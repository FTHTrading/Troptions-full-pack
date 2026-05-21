/**
 * TROPTIONS PayOps — Audit Event Factory
 *
 * Every payout creation, update, approval, and failure must generate an audit event.
 * Audit events are immutable records — never update or delete them.
 */

import { randomUUID } from "crypto";
import type { TroptionsAuditEvent, AuditAction } from "./types";

// ─── Event Factory ────────────────────────────────────────────────────────────

export function createAuditEvent(params: {
  namespaceId: string;
  action: AuditAction;
  actorId: string;
  actorType: "user" | "system" | "adapter";
  resourceType: string;
  resourceId: string;
  outcome: "success" | "failure" | "blocked";
  metadata?: Record<string, string | number | boolean>;
}): TroptionsAuditEvent {
  return {
    id: `audit-${randomUUID()}`,
    namespaceId: params.namespaceId,
    action: params.action,
    actorId: params.actorId,
    actorType: params.actorType,
    resourceType: params.resourceType,
    resourceId: params.resourceId,
    outcome: params.outcome,
    metadata: params.metadata,
    timestamp: new Date().toISOString(),
  };
}

// ─── Pre-built Audit Helpers ──────────────────────────────────────────────────

export function auditBatchCreated(
  namespaceId: string,
  batchId: string,
  actorId: string
): TroptionsAuditEvent {
  return createAuditEvent({
    namespaceId,
    action: "payout_batch.created",
    actorId,
    actorType: "user",
    resourceType: "payout_batch",
    resourceId: batchId,
    outcome: "success",
    metadata: { batchId },
  });
}

export function auditBatchApproved(
  namespaceId: string,
  batchId: string,
  actorId: string
): TroptionsAuditEvent {
  return createAuditEvent({
    namespaceId,
    action: "payout_batch.approved",
    actorId,
    actorType: "user",
    resourceType: "payout_batch",
    resourceId: batchId,
    outcome: "success",
    metadata: { batchId },
  });
}

export function auditBatchBlockedByCompliance(
  namespaceId: string,
  batchId: string,
  reason: string
): TroptionsAuditEvent {
  return createAuditEvent({
    namespaceId,
    action: "payout_batch.blocked_by_compliance",
    actorId: "system",
    actorType: "system",
    resourceType: "payout_batch",
    resourceId: batchId,
    outcome: "blocked",
    metadata: { batchId, reason },
  });
}

export function auditPayeeCreated(
  namespaceId: string,
  payeeId: string,
  actorId: string
): TroptionsAuditEvent {
  return createAuditEvent({
    namespaceId,
    action: "payee.created",
    actorId,
    actorType: "user",
    resourceType: "payee",
    resourceId: payeeId,
    outcome: "success",
  });
}

export function auditReceiptGenerated(
  namespaceId: string,
  receiptId: string,
  batchId: string
): TroptionsAuditEvent {
  return createAuditEvent({
    namespaceId,
    action: "receipt.generated",
    actorId: "system",
    actorType: "system",
    resourceType: "receipt",
    resourceId: receiptId,
    outcome: "success",
    metadata: { batchId },
  });
}

export function auditAdapterConfigured(
  namespaceId: string,
  adapterId: string,
  actorId: string
): TroptionsAuditEvent {
  return createAuditEvent({
    namespaceId,
    action: "adapter.configured",
    actorId,
    actorType: "user",
    resourceType: "adapter",
    resourceId: adapterId,
    outcome: "success",
  });
}
