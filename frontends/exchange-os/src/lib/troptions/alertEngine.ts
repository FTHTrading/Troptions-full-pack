import { ALERT_REGISTRY, getActiveAlerts, type AlertRecord } from "@/content/troptions/alertRegistry";
import { SLA_REGISTRY, getBreachedSla } from "@/content/troptions/slaRegistry";
import type { TroptionsRole } from "@/content/troptions/roleRegistry";
import { assertAuthorized } from "@/lib/troptions/authorizationEngine";
import { appendAuditEvent } from "@/lib/troptions/auditLogEngine";
import {
  ensureControlPlanePersistenceLoaded,
  persistAlertRegistry,
} from "@/lib/troptions/controlPlanePersistence";

export interface AcknowledgeAlertInput {
  alertId: string;
  actorId: string;
  actorRole: TroptionsRole;
  reason: string;
}

function getAlert(alertId: string): AlertRecord {
  ensureControlPlanePersistenceLoaded();
  const alert = ALERT_REGISTRY.find((item) => item.alertId === alertId);
  if (!alert) throw new Error(`[AlertEngine] Alert ${alertId} was not found.`);
  return alert;
}

export function acknowledgeAlert(input: AcknowledgeAlertInput): AlertRecord {
  ensureControlPlanePersistenceLoaded();
  assertAuthorized(input.actorRole, "acknowledge-alert");
  const alert = getAlert(input.alertId);

  const previous = alert.status;
  alert.status = "acknowledged";
  alert.acknowledgedBy = input.actorId;
  alert.acknowledgedAt = new Date().toISOString();
  persistAlertRegistry();

  appendAuditEvent({
    actorId: input.actorId,
    actorRole: input.actorRole,
    actionType: "alert-acknowledged",
    subjectId: alert.subjectId,
    subjectType: "alert",
    previousState: previous,
    nextState: alert.status,
    reason: input.reason,
    evidenceIds: [],
    approvalIds: [],
  });

  return alert;
}

export function getAlertSummary() {
  ensureControlPlanePersistenceLoaded();
  const active = getActiveAlerts();
  const breached = getBreachedSla();

  return {
    activeAlerts: active.length,
    slaBreaches: breached.length,
    active,
    breached,
  };
}

export function getActiveSlaTimers() {
  ensureControlPlanePersistenceLoaded();
  return SLA_REGISTRY.filter((item) => item.status === "active");
}
