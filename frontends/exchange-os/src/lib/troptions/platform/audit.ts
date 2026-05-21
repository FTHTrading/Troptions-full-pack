/**
 * TROPTIONS Platform — Audit Events
 */

import type { PlatformAuditEvent, PlatformAuditAction, ExecutionStatus } from "./types";
import { randomUUID } from "crypto";

export function createPlatformAuditEvent(params: {
  action: PlatformAuditAction;
  namespaceId: string | null;
  actorId: string;
  resourceType: string;
  resourceId: string;
  status: ExecutionStatus;
  reason: string;
  metadata?: Record<string, unknown>;
}): PlatformAuditEvent {
  return {
    id: `pa-${randomUUID()}`,
    action: params.action,
    namespaceId: params.namespaceId,
    actorId: params.actorId,
    resourceType: params.resourceType,
    resourceId: params.resourceId,
    status: params.status,
    reason: params.reason,
    metadata: params.metadata ?? {},
    timestamp: new Date().toISOString(),
  };
}

export function auditExecutionBlocked(
  namespaceId: string | null,
  actorId: string,
  resourceId: string,
  reason: string
): PlatformAuditEvent {
  return createPlatformAuditEvent({
    action: "execution_blocked",
    namespaceId,
    actorId,
    resourceType: "execution_request",
    resourceId,
    status: "blocked",
    reason,
  });
}

export function auditGuardTriggered(
  namespaceId: string | null,
  actorId: string,
  resourceId: string,
  reason: string
): PlatformAuditEvent {
  return createPlatformAuditEvent({
    action: "guard_triggered",
    namespaceId,
    actorId,
    resourceType: "guard",
    resourceId,
    status: "blocked",
    reason,
  });
}
