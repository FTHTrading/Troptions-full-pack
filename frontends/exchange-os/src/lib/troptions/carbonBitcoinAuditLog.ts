/**
 * Carbon + Bitcoin module audit log.
 *
 * Self-contained, in-memory append-only log for the gated carbon credit
 * and bitcoin settlement simulation modules. This is INTENTIONALLY separate
 * from the primary control-plane audit chain in `auditLogEngine.ts` because
 * every event recorded here is simulation/preview only — no live custody,
 * exchange, money transmission, or signing is performed. Operators can
 * promote events into the primary chain via `appendAuditEvent()` once a
 * real-world action is approved through external providers.
 */

export type CarbonBitcoinAuditEventType =
  | "CARBON_ASSET_CREATED"
  | "CARBON_EVIDENCE_ATTACHED"
  | "CARBON_STATUS_UPDATED"
  | "CARBON_RETIREMENT_RECORDED"
  | "BTC_SETTLEMENT_CREATED"
  | "BTC_SETTLEMENT_APPROVAL_REQUESTED"
  | "BTC_TX_HASH_RECORDED"
  | "BTC_CONFIRMATION_UPDATED"
  | "BTC_SETTLEMENT_BLOCKED"
  | "CARBON_BTC_FLOW_SIMULATED";

export interface CarbonBitcoinAuditEvent {
  eventId: string;
  eventType: CarbonBitcoinAuditEventType;
  actor: string;
  timestamp: string;
  relatedAssetId?: string;
  relatedSettlementId?: string;
  previousStatus?: string;
  newStatus?: string;
  reason: string;
  riskFlags: string[];
  evidenceRefs: string[];
}

const REGISTRY: CarbonBitcoinAuditEvent[] = [];

function makeEventId(): string {
  return `CBE-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export interface AppendCarbonBitcoinEventInput {
  eventType: CarbonBitcoinAuditEventType;
  actor: string;
  relatedAssetId?: string;
  relatedSettlementId?: string;
  previousStatus?: string;
  newStatus?: string;
  reason: string;
  riskFlags?: string[];
  evidenceRefs?: string[];
}

export function appendCarbonBitcoinAuditEvent(
  input: AppendCarbonBitcoinEventInput
): CarbonBitcoinAuditEvent {
  const event: CarbonBitcoinAuditEvent = {
    eventId: makeEventId(),
    eventType: input.eventType,
    actor: input.actor,
    timestamp: new Date().toISOString(),
    relatedAssetId: input.relatedAssetId,
    relatedSettlementId: input.relatedSettlementId,
    previousStatus: input.previousStatus,
    newStatus: input.newStatus,
    reason: input.reason,
    riskFlags: input.riskFlags ?? [],
    evidenceRefs: input.evidenceRefs ?? [],
  };
  REGISTRY.push(event);
  return event;
}

export function listCarbonBitcoinAuditEvents(filter?: {
  relatedAssetId?: string;
  relatedSettlementId?: string;
  eventType?: CarbonBitcoinAuditEventType;
}): CarbonBitcoinAuditEvent[] {
  if (!filter) return [...REGISTRY];
  return REGISTRY.filter((event) => {
    if (filter.relatedAssetId && event.relatedAssetId !== filter.relatedAssetId) return false;
    if (filter.relatedSettlementId && event.relatedSettlementId !== filter.relatedSettlementId)
      return false;
    if (filter.eventType && event.eventType !== filter.eventType) return false;
    return true;
  });
}

export function clearCarbonBitcoinAuditLog(): void {
  REGISTRY.length = 0;
}
