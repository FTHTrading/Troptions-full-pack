import { createSignedAuditExport } from "@/lib/troptions/auditExport";
import { verifyAuditChain } from "@/lib/troptions/auditLogEngine";
import { requireControlPlaneAuth } from "@/lib/troptions/apiAuth";
import { getControlPlaneDb, getIdempotencyRecord, hashRequestBody, saveIdempotencyRecord } from "@/lib/troptions/db";
import { getDatabaseAdapter } from "@/lib/troptions/databaseAdapter";
import { enforceDeploymentGate } from "@/lib/troptions/deploymentGates";
import { validateTroptionsEnvironment } from "@/lib/troptions/envValidation";
import { getBackupFreshnessStatus } from "@/lib/troptions/observabilityEngine";
import { setLatestSmokeCheckResult } from "@/lib/troptions/smokeCheckState";

export interface SmokeCheckResult {
  ok: boolean;
  checks: Record<string, { pass: boolean; detail: string }>;
  ranAt: string;
}

function pass(detail: string) {
  return { pass: true, detail };
}

function fail(detail: string) {
  return { pass: false, detail };
}

export async function runProductionSmokeChecks(): Promise<SmokeCheckResult> {
  const checks: Record<string, { pass: boolean; detail: string }> = {};

  checks.healthLive = pass("Liveness endpoint is static-pass by design.");

  const env = validateTroptionsEnvironment();
  checks.envValidation = env.ok ? pass("Environment validation passed.") : fail(env.errors.join(" | "));

  const dbHealth = await getDatabaseAdapter().healthCheck();
  checks.dbAdapterHealth = dbHealth.ok
    ? pass(`Adapter ${dbHealth.adapter} healthy.`)
    : fail(dbHealth.error ?? dbHealth.details ?? "Database adapter health failed.");

  checks.healthReady = env.ok && dbHealth.ok
    ? pass("Readiness composite checks passed.")
    : fail("Readiness failed due to env or DB health.");

  const auditChain = verifyAuditChain();
  checks.auditChainVerification = auditChain.valid
    ? pass(`Audit chain valid across ${auditChain.totalEvents} events.`)
    : fail(`Audit chain failed at ${auditChain.brokenAtEventId ?? "unknown"}.`);

  try {
    enforceDeploymentGate(false);
    checks.releaseGatesEvaluate = pass("Deployment gate evaluation callable.");
  } catch (error) {
    checks.releaseGatesEvaluate = fail((error as Error).message);
  }

  try {
    requireControlPlaneAuth(new Request("http://localhost/api/troptions/readiness/summary"), "read-status");
    checks.authRejectsMissingToken = fail("Missing token was accepted unexpectedly.");
  } catch {
    checks.authRejectsMissingToken = pass("Missing token rejected.");
  }

  const originalEnv = { ...process.env };
  try {
    Object.assign(process.env, {
      NODE_ENV: "staging",
      TROPTIONS_CONTROL_PLANE_TOKEN: "smoke-token",
      TROPTIONS_ALLOW_STATIC_TOKEN_AUTH: "1",
      TROPTIONS_JWT_KEYS_JSON: "",
      TROPTIONS_JWT_SECRET: "",
    });

    const request = new Request("http://localhost/api/troptions/readiness/summary", {
      headers: {
        authorization: "Bearer smoke-token",
        "x-troptions-actor-role": "issuer-admin",
        "x-troptions-actor-id": "smoke-checker",
      },
    });

    requireControlPlaneAuth(request, "read-status");
    checks.authAcceptsValidTestTokenInStagingOnly = pass("Staging static token accepted as expected.");
  } catch (error) {
    checks.authAcceptsValidTestTokenInStagingOnly = fail((error as Error).message);
  } finally {
    process.env = originalEnv;
  }

  const idempotencyKey = `smoke-${Date.now()}`;
  const route = "/api/troptions/smoke";
  const actor = "smoke-checker";
  const requestHash = hashRequestBody("{\"ok\":true}");
  saveIdempotencyRecord(idempotencyKey, route, actor, requestHash, 200, { ok: true }, 60);
  const replay = getIdempotencyRecord(idempotencyKey, route, actor, requestHash);
  checks.idempotencyReplayWorks = replay
    ? pass("Idempotency replay fetched existing response.")
    : fail("Idempotency replay did not return record.");

  try {
    const exportSecret = process.env.TROPTIONS_AUDIT_EXPORT_SECRET ?? "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
    const exportKeyId = process.env.TROPTIONS_AUDIT_EXPORT_KEY_ID ?? "smoke-audit-key";
    const signed = createSignedAuditExport(exportSecret, exportKeyId);
    checks.auditExportSignsSnapshot = signed.signature.length > 0
      ? pass("Audit export signature generated.")
      : fail("Audit export signature missing.");
  } catch (error) {
    checks.auditExportSignsSnapshot = fail((error as Error).message);
  }

  const backup = getBackupFreshnessStatus();
  checks.backupFreshnessAcceptable = backup.ok
    ? pass(`Latest backup ${backup.latestBackupIso ?? "unknown"}`)
    : fail("Backup freshness outside threshold.");

  try {
    const db = getControlPlaneDb();
    db.prepare("SELECT 1 as ok").get();
  } catch {
    checks.dbAdapterHealth = fail("SQLite fallback probe failed.");
  }

  const ok = Object.values(checks).every((item) => item.pass);
  const result: SmokeCheckResult = {
    ok,
    checks,
    ranAt: new Date().toISOString(),
  };

  setLatestSmokeCheckResult(result);
  return result;
}
