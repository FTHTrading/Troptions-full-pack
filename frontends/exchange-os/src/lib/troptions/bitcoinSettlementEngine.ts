/**
 * Bitcoin Settlement Rail Engine.
 *
 * Records Bitcoin payment/payout PREFERENCES on a TROPTIONS deal, invoice,
 * RWA package, or carbon credit transaction. SIMULATION ONLY.
 *
 * TROPTIONS does NOT:
 *   - custody Bitcoin
 *   - generate, store, or sign with private keys
 *   - operate as exchange, broker, or money transmitter
 *   - guarantee BTC price, conversion, or appreciation
 *
 * Live BTC settlement requires an EXTERNAL provider (regulated custodian /
 * exchange / payment processor). This engine only records preferences,
 * compliance gates, and on-chain references after a provider has acted.
 */

import { appendCarbonBitcoinAuditEvent } from "@/lib/troptions/carbonBitcoinAuditLog";

export type BitcoinSettlementStatus =
  | "DRAFT"
  | "QUOTE_REQUESTED"
  | "PROVIDER_REQUIRED"
  | "COMPLIANCE_REVIEW"
  | "APPROVED_FOR_EXTERNAL_PROVIDER"
  | "PAYMENT_PENDING"
  | "TX_OBSERVED"
  | "CONFIRMATIONS_PENDING"
  | "SETTLED"
  | "FAILED"
  | "BLOCKED";

export type BitcoinSettlementType =
  | "BUYER_PAYS_BTC"
  | "SELLER_RECEIVES_BTC"
  | "TREASURY_RESERVE"
  | "RECORD_ONLY";

export type ComplianceCheckStatus =
  | "not-started"
  | "in-review"
  | "approved"
  | "rejected"
  | "expired";

export type SettlementApprovalStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "blocked";

export interface BitcoinSettlementRecord {
  settlementId: string;
  relatedDealId: string | null;
  relatedAssetId: string | null;
  payerName: string;
  payeeName: string;
  settlementType: BitcoinSettlementType;
  usdReferenceValue: number;
  btcQuotedAmount: number | null;
  quoteTimestamp: string | null;
  quoteExpiresAt: string | null;
  providerName: string | null;
  providerReferenceId: string | null;
  receivingWalletAddress: string | null;
  sendingWalletAddress: string | null;
  btcTxHash: string | null;
  confirmationsRequired: number;
  confirmationsObserved: number;
  settlementStatus: BitcoinSettlementStatus;
  kycStatus: ComplianceCheckStatus;
  amlStatus: ComplianceCheckStatus;
  taxRecordId: string | null;
  invoiceId: string | null;
  approvalStatus: SettlementApprovalStatus;
  riskFlags: string[];
  createdAt: string;
  updatedAt: string;
}

export const BITCOIN_SETTLEMENT_DISCLOSURE =
  "Bitcoin is supported only as an external settlement preference or transaction-record rail. TROPTIONS does not provide custody, exchange, brokerage, money transmission, investment advice, or guaranteed Bitcoin conversion.";

// ─── Validation ──────────────────────────────────────────────────────────────

export interface BitcoinValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateBitcoinSettlementRecord(
  record: Partial<BitcoinSettlementRecord>
): BitcoinValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (!record.settlementId) errors.push("settlementId is required");
  if (!record.payerName) errors.push("payerName is required");
  if (!record.payeeName) errors.push("payeeName is required");
  if (!record.settlementType) errors.push("settlementType is required");
  if (record.usdReferenceValue == null || record.usdReferenceValue < 0)
    errors.push("usdReferenceValue must be >= 0");
  if (!record.providerName) warnings.push("providerName missing — cannot move past PROVIDER_REQUIRED");
  if (record.kycStatus !== "approved") warnings.push("kycStatus not approved");
  if (record.amlStatus !== "approved") warnings.push("amlStatus not approved");
  return { valid: errors.length === 0, errors, warnings };
}

// ─── Registry (in-memory, simulation-only) ───────────────────────────────────

const REGISTRY: BitcoinSettlementRecord[] = [];

function nowIso(): string {
  return new Date().toISOString();
}

export interface CreateBitcoinSettlementInput {
  settlementId: string;
  relatedDealId?: string | null;
  relatedAssetId?: string | null;
  payerName: string;
  payeeName: string;
  settlementType: BitcoinSettlementType;
  usdReferenceValue: number;
  btcQuotedAmount?: number;
  quoteExpiresAt?: string;
  providerName?: string;
  providerReferenceId?: string;
  receivingWalletAddress?: string;
  sendingWalletAddress?: string;
  invoiceId?: string;
  confirmationsRequired?: number;
  actor?: string;
}

export function createBitcoinSettlementRecord(
  input: CreateBitcoinSettlementInput
): BitcoinSettlementRecord {
  const timestamp = nowIso();
  const record: BitcoinSettlementRecord = {
    settlementId: input.settlementId,
    relatedDealId: input.relatedDealId ?? null,
    relatedAssetId: input.relatedAssetId ?? null,
    payerName: input.payerName,
    payeeName: input.payeeName,
    settlementType: input.settlementType,
    usdReferenceValue: input.usdReferenceValue,
    btcQuotedAmount: input.btcQuotedAmount ?? null,
    quoteTimestamp: input.btcQuotedAmount ? timestamp : null,
    quoteExpiresAt: input.quoteExpiresAt ?? null,
    providerName: input.providerName ?? null,
    providerReferenceId: input.providerReferenceId ?? null,
    receivingWalletAddress: input.receivingWalletAddress ?? null,
    sendingWalletAddress: input.sendingWalletAddress ?? null,
    btcTxHash: null,
    confirmationsRequired: input.confirmationsRequired ?? 3,
    confirmationsObserved: 0,
    settlementStatus: "DRAFT",
    kycStatus: "not-started",
    amlStatus: "not-started",
    taxRecordId: null,
    invoiceId: input.invoiceId ?? null,
    approvalStatus: "pending",
    riskFlags: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  if (!record.providerName) {
    record.settlementStatus = "PROVIDER_REQUIRED";
    record.riskFlags.push("missing-provider");
  } else {
    record.settlementStatus = "QUOTE_REQUESTED";
  }

  REGISTRY.push(record);
  appendCarbonBitcoinAuditEvent({
    eventType: "BTC_SETTLEMENT_CREATED",
    actor: input.actor ?? "system",
    relatedSettlementId: record.settlementId,
    relatedAssetId: record.relatedAssetId ?? undefined,
    newStatus: record.settlementStatus,
    reason: "BTC settlement record created (simulation only)",
    riskFlags: record.riskFlags,
  });
  return record;
}

export function listBitcoinSettlements(): BitcoinSettlementRecord[] {
  return [...REGISTRY];
}

export function getBitcoinSettlement(
  settlementId: string
): BitcoinSettlementRecord | undefined {
  return REGISTRY.find((r) => r.settlementId === settlementId);
}

export function clearBitcoinSettlementRegistry(): void {
  REGISTRY.length = 0;
}

// ─── Approval gate ───────────────────────────────────────────────────────────

export interface RequestBitcoinSettlementApprovalInput {
  settlementId: string;
  kycStatus: ComplianceCheckStatus;
  amlStatus: ComplianceCheckStatus;
  actor?: string;
}

export function requestBitcoinSettlementApproval(
  input: RequestBitcoinSettlementApprovalInput
): { ok: boolean; record?: BitcoinSettlementRecord; error?: string } {
  const record = getBitcoinSettlement(input.settlementId);
  if (!record) return { ok: false, error: "settlement not found" };
  if (!record.providerName) {
    record.settlementStatus = "PROVIDER_REQUIRED";
    record.updatedAt = nowIso();
    return { ok: false, record, error: "providerName missing — status pinned to PROVIDER_REQUIRED" };
  }
  record.kycStatus = input.kycStatus;
  record.amlStatus = input.amlStatus;
  if (input.kycStatus !== "approved" || input.amlStatus !== "approved") {
    record.settlementStatus = "COMPLIANCE_REVIEW";
    record.approvalStatus = "pending";
    record.updatedAt = nowIso();
    appendCarbonBitcoinAuditEvent({
      eventType: "BTC_SETTLEMENT_APPROVAL_REQUESTED",
      actor: input.actor ?? "system",
      relatedSettlementId: record.settlementId,
      newStatus: record.settlementStatus,
      reason: "KYC/AML not approved — held in compliance review",
      riskFlags: record.riskFlags,
    });
    return {
      ok: false,
      record,
      error: "KYC/AML not approved — settlement held in compliance review",
    };
  }
  record.settlementStatus = "APPROVED_FOR_EXTERNAL_PROVIDER";
  record.approvalStatus = "approved";
  record.updatedAt = nowIso();
  appendCarbonBitcoinAuditEvent({
    eventType: "BTC_SETTLEMENT_APPROVAL_REQUESTED",
    actor: input.actor ?? "system",
    relatedSettlementId: record.settlementId,
    newStatus: record.settlementStatus,
    reason: "approved for external provider execution",
    riskFlags: record.riskFlags,
  });
  return { ok: true, record };
}

// ─── Tx hash + confirmations ─────────────────────────────────────────────────

export interface RecordBitcoinTxHashInput {
  settlementId: string;
  btcTxHash: string;
  actor?: string;
}

export function recordBitcoinTxHash(
  input: RecordBitcoinTxHashInput
): { ok: boolean; record?: BitcoinSettlementRecord; error?: string } {
  const record = getBitcoinSettlement(input.settlementId);
  if (!record) return { ok: false, error: "settlement not found" };
  if (record.settlementStatus !== "APPROVED_FOR_EXTERNAL_PROVIDER" &&
      record.settlementStatus !== "PAYMENT_PENDING") {
    return {
      ok: false,
      record,
      error: `cannot record tx hash from status ${record.settlementStatus}`,
    };
  }
  if (!input.btcTxHash || input.btcTxHash.length < 16) {
    return { ok: false, record, error: "btcTxHash invalid" };
  }
  record.btcTxHash = input.btcTxHash;
  record.settlementStatus = "TX_OBSERVED";
  record.updatedAt = nowIso();
  appendCarbonBitcoinAuditEvent({
    eventType: "BTC_TX_HASH_RECORDED",
    actor: input.actor ?? "system",
    relatedSettlementId: record.settlementId,
    newStatus: record.settlementStatus,
    reason: `tx hash recorded ${input.btcTxHash.slice(0, 10)}…`,
    evidenceRefs: [input.btcTxHash],
  });
  return { ok: true, record };
}

export interface UpdateBitcoinConfirmationsInput {
  settlementId: string;
  confirmationsObserved: number;
  actor?: string;
}

export function updateBitcoinConfirmations(
  input: UpdateBitcoinConfirmationsInput
): { ok: boolean; record?: BitcoinSettlementRecord; error?: string } {
  const record = getBitcoinSettlement(input.settlementId);
  if (!record) return { ok: false, error: "settlement not found" };
  if (!record.btcTxHash) return { ok: false, record, error: "no tx hash recorded yet" };
  if (input.confirmationsObserved < 0)
    return { ok: false, record, error: "confirmationsObserved must be >= 0" };
  record.confirmationsObserved = input.confirmationsObserved;
  if (record.confirmationsObserved < record.confirmationsRequired) {
    record.settlementStatus = "CONFIRMATIONS_PENDING";
  }
  record.updatedAt = nowIso();
  appendCarbonBitcoinAuditEvent({
    eventType: "BTC_CONFIRMATION_UPDATED",
    actor: input.actor ?? "system",
    relatedSettlementId: record.settlementId,
    newStatus: record.settlementStatus,
    reason: `confirmations ${record.confirmationsObserved}/${record.confirmationsRequired}`,
  });
  return { ok: true, record };
}

export interface MarkBitcoinSettledInput {
  settlementId: string;
  taxRecordId?: string;
  actor?: string;
}

export function markBitcoinSettlementSettled(
  input: MarkBitcoinSettledInput
): { ok: boolean; record?: BitcoinSettlementRecord; error?: string } {
  const record = getBitcoinSettlement(input.settlementId);
  if (!record) return { ok: false, error: "settlement not found" };
  if (!record.btcTxHash) return { ok: false, record, error: "no btcTxHash — cannot settle" };
  if (record.confirmationsObserved < record.confirmationsRequired)
    return {
      ok: false,
      record,
      error: `confirmations ${record.confirmationsObserved}/${record.confirmationsRequired} insufficient`,
    };
  if (record.approvalStatus !== "approved")
    return { ok: false, record, error: "approval not granted — cannot settle" };

  record.settlementStatus = "SETTLED";
  record.taxRecordId = input.taxRecordId ?? record.taxRecordId;
  record.updatedAt = nowIso();
  appendCarbonBitcoinAuditEvent({
    eventType: "BTC_CONFIRMATION_UPDATED",
    actor: input.actor ?? "system",
    relatedSettlementId: record.settlementId,
    newStatus: record.settlementStatus,
    reason: "settlement marked SETTLED",
  });
  return { ok: true, record };
}

export function blockBitcoinSettlement(
  settlementId: string,
  reason: string,
  actor: string = "system"
): { ok: boolean; record?: BitcoinSettlementRecord; error?: string } {
  const record = getBitcoinSettlement(settlementId);
  if (!record) return { ok: false, error: "settlement not found" };
  const previousStatus = record.settlementStatus;
  record.settlementStatus = "BLOCKED";
  record.approvalStatus = "blocked";
  record.riskFlags = Array.from(new Set([...record.riskFlags, `blocked:${reason}`]));
  record.updatedAt = nowIso();
  appendCarbonBitcoinAuditEvent({
    eventType: "BTC_SETTLEMENT_BLOCKED",
    actor,
    relatedSettlementId: record.settlementId,
    previousStatus,
    newStatus: "BLOCKED",
    reason,
    riskFlags: record.riskFlags,
  });
  return { ok: true, record };
}

// ─── Summary ─────────────────────────────────────────────────────────────────

export interface BitcoinSettlementSummary {
  settlementId: string;
  settlementStatus: BitcoinSettlementStatus;
  approvalStatus: SettlementApprovalStatus;
  providerName: string | null;
  kycStatus: ComplianceCheckStatus;
  amlStatus: ComplianceCheckStatus;
  btcTxHash: string | null;
  confirmations: { observed: number; required: number };
  usdReferenceValue: number;
  btcQuotedAmount: number | null;
  riskFlags: string[];
  disclosure: string;
  generatedAt: string;
}

export function generateBitcoinSettlementSummary(
  settlementId: string
): BitcoinSettlementSummary | { error: string } {
  const record = getBitcoinSettlement(settlementId);
  if (!record) return { error: "settlement not found" };
  return {
    settlementId: record.settlementId,
    settlementStatus: record.settlementStatus,
    approvalStatus: record.approvalStatus,
    providerName: record.providerName,
    kycStatus: record.kycStatus,
    amlStatus: record.amlStatus,
    btcTxHash: record.btcTxHash,
    confirmations: {
      observed: record.confirmationsObserved,
      required: record.confirmationsRequired,
    },
    usdReferenceValue: record.usdReferenceValue,
    btcQuotedAmount: record.btcQuotedAmount,
    riskFlags: record.riskFlags,
    disclosure: BITCOIN_SETTLEMENT_DISCLOSURE,
    generatedAt: nowIso(),
  };
}

// ─── Seed ────────────────────────────────────────────────────────────────────

export function seedBitcoinSettlementsIfEmpty(): void {
  if (REGISTRY.length > 0) return;
  // Settlement awaiting provider
  createBitcoinSettlementRecord({
    settlementId: "BTC-DEMO-001",
    relatedAssetId: "CRB-DEMO-002",
    payerName: "Demo Buyer Inc.",
    payeeName: "TROPTIONS Demo Holder LLC",
    settlementType: "BUYER_PAYS_BTC",
    usdReferenceValue: 50000,
    actor: "seed",
  });
  // Settlement with provider, awaiting compliance
  const r2 = createBitcoinSettlementRecord({
    settlementId: "BTC-DEMO-002",
    relatedAssetId: "CRB-DEMO-002",
    payerName: "Demo Buyer Inc.",
    payeeName: "TROPTIONS Demo Holder LLC",
    settlementType: "BUYER_PAYS_BTC",
    usdReferenceValue: 120000,
    btcQuotedAmount: 1.85,
    providerName: "External Regulated BTC Provider (demo)",
    providerReferenceId: "PROV-REF-DEMO-002",
    invoiceId: "INV-DEMO-002",
    actor: "seed",
  });
  void r2;
  // Blocked example
  const r3 = createBitcoinSettlementRecord({
    settlementId: "BTC-DEMO-003",
    relatedAssetId: null,
    payerName: "Anonymous",
    payeeName: "Unknown",
    settlementType: "RECORD_ONLY",
    usdReferenceValue: 5000,
    actor: "seed",
  });
  void r3;
  blockBitcoinSettlement("BTC-DEMO-003", "missing payer/payee KYC", "seed");
}
