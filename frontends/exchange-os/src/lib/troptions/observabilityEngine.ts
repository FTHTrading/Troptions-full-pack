import fs from "node:fs";
import path from "node:path";
import { getOpenExceptions } from "@/content/troptions/exceptionRegistry";
import { getFailedReleaseGates } from "@/content/troptions/releaseGateRegistry";
import { verifyAuditChain } from "@/lib/troptions/auditLogEngine";
import { getDatabaseAdapter } from "@/lib/troptions/databaseAdapter";
import { isDurableObservabilityEnabled } from "@/lib/troptions/durableObservabilityStore";
import { getMetricsSnapshot } from "@/lib/troptions/metricsRegistry";
import { getLatestSmokeCheckResult } from "@/lib/troptions/smokeCheckState";
import { getRecentStructuredLogs, redactSecrets } from "@/lib/troptions/structuredLogger";

const BACKUP_DIR = path.join(process.cwd(), "data", "backups");

export interface BackupFreshnessStatus {
  ok: boolean;
  latestBackupIso: string | null;
  ageHours: number | null;
}

function getLatestBackupTime(): Date | null {
  if (!fs.existsSync(BACKUP_DIR)) return null;

  const entries = fs
    .readdirSync(BACKUP_DIR)
    .map((name) => path.join(BACKUP_DIR, name))
    .filter((fullPath) => fs.statSync(fullPath).isFile())
    .map((fullPath) => ({
      fullPath,
      mtime: fs.statSync(fullPath).mtime,
    }))
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

  if (entries.length === 0) return null;
  return entries[0].mtime;
}

export function getBackupFreshnessStatus(now = new Date()): BackupFreshnessStatus {
  const latest = getLatestBackupTime();
  if (!latest) {
    return {
      ok: false,
      latestBackupIso: null,
      ageHours: null,
    };
  }

  const ageHours = (now.getTime() - latest.getTime()) / 3600000;
  return {
    ok: ageHours <= 36,
    latestBackupIso: latest.toISOString(),
    ageHours: Math.round(ageHours * 100) / 100,
  };
}

export async function getObservabilitySnapshot() {
  const metrics = getMetricsSnapshot();
  const dbHealth = await getDatabaseAdapter().healthCheck();
  const backupFreshness = getBackupFreshnessStatus();
  const openIncidents = getOpenExceptions().filter((item) => item.severity === "CRITICAL" && item.status !== "resolved").length;
  const unresolvedExceptions = getOpenExceptions().filter((item) => item.status !== "resolved").length;
  const failedReleaseGates = getFailedReleaseGates();
  const latestSmokeCheck = getLatestSmokeCheckResult();

  const cards = {
    totalRequests: metrics.api_requests_total,
    failedRequests: metrics.api_request_failures,
    authFailures: metrics.auth_failures,
    rateLimitBlocks: metrics.rate_limit_blocks,
    gateBlocks: metrics.deployment_gate_blocks,
    criticalAlerts: 0,
    openIncidents,
    unresolvedExceptions,
    failedReleaseGates: failedReleaseGates.length,
    auditExports: metrics.audit_exports,
    dbHealth: dbHealth.ok ? "healthy" : "degraded",
    backupFreshness: backupFreshness.ok ? "fresh" : "stale",
    smokeCheckStatus: latestSmokeCheck?.ok ? "pass" : "fail",
  };

  return {
    generatedAt: new Date().toISOString(),
    durableObservability: {
      enabled: isDurableObservabilityEnabled(),
    },
    cards,
    metrics,
    auditChain: verifyAuditChain(),
    dbHealth,
    backupFreshness,
    latestSmokeCheck,
    recentLogs: redactSecrets(getRecentStructuredLogs(50)),
  };
}
