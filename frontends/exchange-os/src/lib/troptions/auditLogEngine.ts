import { AUDIT_LOG_REGISTRY, computeAuditHash, type AuditEvent } from "@/content/troptions/auditLogRegistry";
import type { TroptionsRole } from "@/content/troptions/roleRegistry";
import {
  ensureControlPlanePersistenceLoaded,
  persistAuditLogRegistry,
} from "@/lib/troptions/controlPlanePersistence";

export interface AppendAuditEventInput {
  actorId: string;
  actorRole: TroptionsRole;
  actionType: string;
  subjectId: string;
  subjectType: string;
  previousState: string;
  nextState: string;
  reason: string;
  evidenceIds: string[];
  approvalIds: string[];
}

function makeEventId(): string {
  return `AUDIT-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export function appendAuditEvent(input: AppendAuditEventInput): AuditEvent {
  ensureControlPlanePersistenceLoaded();
  const last = AUDIT_LOG_REGISTRY[AUDIT_LOG_REGISTRY.length - 1];
  const eventWithoutHash: Omit<AuditEvent, "hash"> = {
    eventId: makeEventId(),
    timestamp: new Date().toISOString(),
    actorId: input.actorId,
    actorRole: input.actorRole,
    actionType: input.actionType,
    subjectId: input.subjectId,
    subjectType: input.subjectType,
    previousState: input.previousState,
    nextState: input.nextState,
    reason: input.reason,
    evidenceIds: input.evidenceIds,
    approvalIds: input.approvalIds,
    previousHash: last.hash,
  };

  const event: AuditEvent = {
    ...eventWithoutHash,
    hash: computeAuditHash(eventWithoutHash),
  };

  AUDIT_LOG_REGISTRY.push(event);
  persistAuditLogRegistry();
  return event;
}

export function verifyAuditChain(): { valid: boolean; brokenAtEventId?: string; totalEvents: number } {
  ensureControlPlanePersistenceLoaded();
  for (let index = 0; index < AUDIT_LOG_REGISTRY.length; index += 1) {
    const current = AUDIT_LOG_REGISTRY[index];
    if (index > 0) {
      const previous = AUDIT_LOG_REGISTRY[index - 1];
      if (current.previousHash !== previous.hash) {
        return { valid: false, brokenAtEventId: current.eventId, totalEvents: AUDIT_LOG_REGISTRY.length };
      }
    }

    const recalculated = computeAuditHash({
      eventId: current.eventId,
      timestamp: current.timestamp,
      actorId: current.actorId,
      actorRole: current.actorRole,
      actionType: current.actionType,
      subjectId: current.subjectId,
      subjectType: current.subjectType,
      previousState: current.previousState,
      nextState: current.nextState,
      reason: current.reason,
      evidenceIds: current.evidenceIds,
      approvalIds: current.approvalIds,
      previousHash: current.previousHash,
    });

    if (recalculated !== current.hash) {
      return { valid: false, brokenAtEventId: current.eventId, totalEvents: AUDIT_LOG_REGISTRY.length };
    }
  }

  return { valid: true, totalEvents: AUDIT_LOG_REGISTRY.length };
}

export function getRecentAuditEvents(limit = 25): AuditEvent[] {
  ensureControlPlanePersistenceLoaded();
  return AUDIT_LOG_REGISTRY.slice(-limit).reverse();
}
