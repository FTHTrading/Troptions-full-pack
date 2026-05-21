import { getOpenExceptions } from "@/content/troptions/exceptionRegistry";
import { getFailedReleaseGates } from "@/content/troptions/releaseGateRegistry";
import { verifyAuditChain } from "@/lib/troptions/auditLogEngine";
import { getDatabaseAdapter } from "@/lib/troptions/databaseAdapter";
import { recordEscalationDurably } from "@/lib/troptions/durableObservabilityStore";
import { getMetricsSnapshot } from "@/lib/troptions/metricsRegistry";
import { getBackupFreshnessStatus } from "@/lib/troptions/observabilityEngine";
import { getLatestSmokeCheckResult } from "@/lib/troptions/smokeCheckState";

export type EscalationLevel = "L1 operator" | "L2 compliance/security" | "L3 legal/board" | "emergency lockdown";

export interface EscalationRecord {
  escalationId: string;
  level: EscalationLevel;
  trigger: string;
  details: string;
  createdAt: string;
}

const escalationLog: EscalationRecord[] = [];

function pushEscalation(level: EscalationLevel, trigger: string, details: string): void {
  const event: EscalationRecord = {
    escalationId: `ESC-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    level,
    trigger,
    details,
    createdAt: new Date().toISOString(),
  };

  escalationLog.push(event);
  void recordEscalationDurably(event).catch(() => {
    // Durable escalation storage must not block policy evaluation.
  });
}

export async function evaluateEscalationPolicies(): Promise<EscalationRecord[]> {
  const metrics = getMetricsSnapshot();
  const before = escalationLog.length;
  const now = Date.now();

  if (metrics.auth_failures >= 5) {
    pushEscalation("L1 operator", "repeated-auth-failures", "Five or more authentication failures detected.");
  }

  const oldCriticalExceptions = getOpenExceptions().filter((exception) => {
    if (exception.severity !== "CRITICAL" || exception.status === "resolved") return false;
    const opened = new Date(exception.openedAt).getTime();
    return Number.isFinite(opened) && now - opened > 8 * 3600000;
  });
  if (oldCriticalExceptions.length > 0) {
    pushEscalation(
      "L2 compliance/security",
      "critical-exception-open-too-long",
      `${oldCriticalExceptions.length} critical exceptions open for over 8 hours.`,
    );
  }

  if (process.env.NODE_ENV === "production" && getFailedReleaseGates().length > 0) {
    pushEscalation("L2 compliance/security", "release-gate-failure", "Release gate failure detected in production.");
  }

  const auditChain = verifyAuditChain();
  if (!auditChain.valid) {
    pushEscalation("emergency lockdown", "audit-chain-verification-failure", "Audit chain verification failed.");
  }

  if (metrics.audit_exports > 0 && metrics.api_request_failures > 0) {
    pushEscalation("L2 compliance/security", "audit-export-signing-failure", "Audit export flow observed with request failures; inspect signing path.");
  }

  const dbHealth = await getDatabaseAdapter().healthCheck();
  if (!dbHealth.ok) {
    pushEscalation("emergency lockdown", "db-health-failure", dbHealth.error ?? "Database adapter health check failed.");
  }

  const backup = getBackupFreshnessStatus();
  if (!backup.ok) {
    pushEscalation("L2 compliance/security", "backup-stale", "Backup freshness is stale or no snapshots are present.");
  }

  const smoke = getLatestSmokeCheckResult();
  if (smoke && !smoke.ok) {
    pushEscalation("L2 compliance/security", "smoke-check-failure", "Production smoke checks reported failures.");
  }

  if (metrics.api_request_failures >= 3) {
    pushEscalation("L3 legal/board", "prohibited-jurisdiction-attempt", "Potential prohibited-jurisdiction signal in failing API traffic.");
  }

  if (process.env.NODE_ENV === "production" && process.env.TROPTIONS_ALLOW_STATIC_TOKEN_AUTH === "1") {
    pushEscalation("L3 legal/board", "static-token-auth-attempt-in-production", "Static token auth allowed in production; immediate remediation required.");
  }

  return escalationLog.slice(before);
}

export function getEscalationLog(limit = 100): EscalationRecord[] {
  return escalationLog.slice(-Math.max(1, limit)).reverse();
}

export function clearEscalationLogForTests(): void {
  escalationLog.splice(0, escalationLog.length);
}
