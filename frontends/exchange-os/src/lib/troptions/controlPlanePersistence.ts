import { ACTION_REGISTRY } from "@/content/troptions/actionRegistry";
import { ALERT_REGISTRY } from "@/content/troptions/alertRegistry";
import { APPROVAL_REGISTRY } from "@/content/troptions/approvalRegistry";
import { AUDIT_LOG_REGISTRY } from "@/content/troptions/auditLogRegistry";
import { EXCEPTION_REGISTRY } from "@/content/troptions/exceptionRegistry";
import { RELEASE_GATE_REGISTRY } from "@/content/troptions/releaseGateRegistry";
import { SLA_REGISTRY } from "@/content/troptions/slaRegistry";
import { loadStateFromDb, saveStateToDb } from "@/lib/troptions/db";

let initialized = false;

function persistenceDisabled(): boolean {
  return process.env.NODE_ENV === "test" || process.env.TROPTIONS_DISABLE_PERSISTENCE === "1";
}

function loadRegistry<T>(target: T[], stateName: string): void {
  const persisted = loadStateFromDb<T>(stateName);
  if (!persisted) {
    saveStateToDb(stateName, target);
    return;
  }

  target.splice(0, target.length, ...persisted);
}

function saveRegistry<T>(source: T[], stateName: string): void {
  saveStateToDb(stateName, source);
}

export function ensureControlPlanePersistenceLoaded(): void {
  if (persistenceDisabled() || initialized) return;

  loadRegistry(APPROVAL_REGISTRY, "approvals");
  loadRegistry(AUDIT_LOG_REGISTRY, "audit-log");
  loadRegistry(EXCEPTION_REGISTRY, "exceptions");
  loadRegistry(ALERT_REGISTRY, "alerts");
  loadRegistry(ACTION_REGISTRY, "actions");
  loadRegistry(SLA_REGISTRY, "sla");
  loadRegistry(RELEASE_GATE_REGISTRY, "release-gates");
  initialized = true;
}

export function persistApprovalRegistry(): void {
  if (persistenceDisabled()) return;
  saveRegistry(APPROVAL_REGISTRY, "approvals");
}

export function persistAuditLogRegistry(): void {
  if (persistenceDisabled()) return;
  saveRegistry(AUDIT_LOG_REGISTRY, "audit-log");
}

export function persistExceptionRegistry(): void {
  if (persistenceDisabled()) return;
  saveRegistry(EXCEPTION_REGISTRY, "exceptions");
}

export function persistAlertRegistry(): void {
  if (persistenceDisabled()) return;
  saveRegistry(ALERT_REGISTRY, "alerts");
}
