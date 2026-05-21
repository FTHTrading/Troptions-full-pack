/**
 * TROPTIONS Escrow State Engine
 *
 * Simulates smart-contract escrow workflows for TROPTIONS transactions.
 * Each escrow holds both payment and asset tokens until all conditions
 * (payment received, identity verified, agreements signed) are met.
 *
 * Design pattern (per RWA.io escrow model):
 *  1. Buyer deposits payment into escrow.
 *  2. Seller deposits asset token into escrow.
 *  3. Compliance gate checks KYC flags and sanctions.
 *  4. Agreement signatures are collected.
 *  5. Oracle attests asset delivery.
 *  6. Escrow releases payment to seller and asset to buyer atomically.
 *
 * SIMULATION-ONLY — no live token custody, no live smart contract execution,
 * no live funds held. This engine tracks state only.
 */

import { randomUUID } from "crypto";

// ─── Escrow State Machine ─────────────────────────────────────────────────────

export type EscrowStatus =
  | "created"
  | "awaiting_buyer_deposit"
  | "awaiting_seller_deposit"
  | "awaiting_kyc_clearance"
  | "awaiting_signatures"
  | "awaiting_oracle_attestation"
  | "awaiting_final_approval"
  | "released"
  | "cancelled"
  | "disputed"
  | "expired";

export type EscrowCondition =
  | "buyer_deposit_received"
  | "seller_deposit_received"
  | "buyer_kyc_cleared"
  | "seller_kyc_cleared"
  | "agreement_signed"
  | "oracle_attested"
  | "control_hub_approved"
  | "compliance_approved"
  | "travel_rule_submitted";

export type EscrowAssetType = "xrpl_iou" | "erc20" | "carbon_credit" | "btc_external" | "stablecoin" | "rwa_token";

// ─── Escrow Record ────────────────────────────────────────────────────────────

export interface EscrowDepositRecord {
  depositId: string;
  party: "buyer" | "seller";
  assetType: EscrowAssetType;
  assetSymbol: string;
  amount: string;
  depositedAt: string;
  /** Simulated escrow contract address */
  escrowContractAddress: string;
  simulationOnly: true;
}

export interface EscrowRecord {
  escrowId: string;
  transactionId?: string;
  buyerAddress: string;
  sellerAddress: string;
  /** Asset token being transferred (seller → buyer) */
  assetToken: { type: EscrowAssetType; symbol: string; amount: string };
  /** Payment token (buyer → seller) */
  paymentToken: { type: EscrowAssetType; symbol: string; amount: string };
  status: EscrowStatus;
  completedConditions: EscrowCondition[];
  pendingConditions: EscrowCondition[];
  deposits: EscrowDepositRecord[];
  /** Simulated escrow contract address (not a live contract) */
  escrowContractAddress: string;
  disclosureStatement: string;
  auditTrail: EscrowAuditEntry[];
  blockedReasons: string[];
  simulationOnly: true;
  createdAt: string;
  updatedAt: string;
  releasedAt?: string;
  expiresAt: string;
}

export interface EscrowAuditEntry {
  entryId: string;
  action: string;
  actor: string;
  detail: string;
  timestamp: string;
}

// ─── Escrow disclosure ────────────────────────────────────────────────────────

export const ESCROW_DISCLOSURE =
  "TROPTIONS does not hold, custody, or manage any assets in escrow. This escrow engine is a simulation that tracks workflow state only. No live smart contract is deployed and no real assets are locked. All deposits, transfers, and releases shown are simulated records. Live escrow deployment requires audited smart contracts and all required approvals.";

// ─── Standard condition sets per transaction category ────────────────────────

const STANDARD_CONDITIONS: Record<string, EscrowCondition[]> = {
  rwa: ["buyer_deposit_received", "seller_deposit_received", "buyer_kyc_cleared", "seller_kyc_cleared", "agreement_signed", "oracle_attested", "control_hub_approved", "compliance_approved"],
  carbon: ["buyer_deposit_received", "seller_deposit_received", "buyer_kyc_cleared", "seller_kyc_cleared", "agreement_signed", "oracle_attested", "control_hub_approved"],
  btc: ["buyer_deposit_received", "buyer_kyc_cleared", "seller_kyc_cleared", "agreement_signed", "travel_rule_submitted", "control_hub_approved", "compliance_approved"],
  simple: ["buyer_deposit_received", "buyer_kyc_cleared", "agreement_signed", "control_hub_approved"],
};

// ─── In-memory registry ───────────────────────────────────────────────────────

const _escrowRegistry: EscrowRecord[] = [];

export function clearEscrowRegistry(): void {
  _escrowRegistry.length = 0;
}

export function seedEscrowRegistryIfEmpty(): void {
  if (_escrowRegistry.length > 0) return;
  createEscrowRecord({
    buyerAddress: "rDemo1TROPTIONS0000000000000000000",
    sellerAddress: "rDemo2TROPTIONS0000000000000000000",
    assetToken: { type: "rwa_token", symbol: "GEM-001", amount: "1" },
    paymentToken: { type: "xrpl_iou", symbol: "TROPTIONS", amount: "250000" },
    conditionSet: "rwa",
  });
}

// ─── Factory ──────────────────────────────────────────────────────────────────

export function createEscrowRecord(input: {
  buyerAddress: string;
  sellerAddress: string;
  assetToken: { type: EscrowAssetType; symbol: string; amount: string };
  paymentToken: { type: EscrowAssetType; symbol: string; amount: string };
  transactionId?: string;
  conditionSet?: keyof typeof STANDARD_CONDITIONS;
  customConditions?: EscrowCondition[];
}): EscrowRecord {
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const conditions = input.customConditions ?? STANDARD_CONDITIONS[input.conditionSet ?? "simple"];

  const record: EscrowRecord = {
    escrowId: `ESC-${randomUUID().toUpperCase().slice(0, 8)}`,
    transactionId: input.transactionId,
    buyerAddress: input.buyerAddress,
    sellerAddress: input.sellerAddress,
    assetToken: input.assetToken,
    paymentToken: input.paymentToken,
    status: "created",
    completedConditions: [],
    pendingConditions: [...conditions],
    deposits: [],
    escrowContractAddress: `0x${randomUUID().replace(/-/g, "").slice(0, 40)}`,
    disclosureStatement: ESCROW_DISCLOSURE,
    blockedReasons: ["platform_simulation_gate_active", ...conditions.map((c) => `pending_condition_${c}`)],
    auditTrail: [
      {
        entryId: randomUUID(),
        action: "escrow_created",
        actor: "system",
        detail: `Escrow created — buyer: ${input.buyerAddress.slice(0, 12)}… seller: ${input.sellerAddress.slice(0, 12)}… asset: ${input.assetToken.symbol}`,
        timestamp: now,
      },
    ],
    simulationOnly: true,
    createdAt: now,
    updatedAt: now,
    expiresAt,
  };

  _escrowRegistry.push(record);
  return record;
}

// ─── Condition satisfaction ───────────────────────────────────────────────────

export function satisfyCondition(escrowId: string, condition: EscrowCondition, actor: string): EscrowRecord | null {
  const record = _escrowRegistry.find((r) => r.escrowId === escrowId);
  if (!record) return null;
  if (!record.pendingConditions.includes(condition)) return record;

  const now = new Date().toISOString();
  record.pendingConditions = record.pendingConditions.filter((c) => c !== condition);
  record.completedConditions.push(condition);
  record.blockedReasons = record.blockedReasons.filter((r) => r !== `pending_condition_${condition}`);

  record.auditTrail.push({
    entryId: randomUUID(),
    action: "condition_satisfied",
    actor,
    detail: `Condition satisfied: ${condition}`,
    timestamp: now,
  });

  // Advance status
  record.status = computeEscrowStatus(record);
  record.updatedAt = now;
  return record;
}

function computeEscrowStatus(record: EscrowRecord): EscrowStatus {
  if (record.status === "cancelled" || record.status === "disputed" || record.status === "expired") return record.status;
  if (record.pendingConditions.length === 0) return "released";

  const completed = new Set(record.completedConditions);
  if (completed.has("buyer_deposit_received") && completed.has("seller_deposit_received")) {
    if (!completed.has("buyer_kyc_cleared") || !completed.has("seller_kyc_cleared")) return "awaiting_kyc_clearance";
    if (!completed.has("agreement_signed")) return "awaiting_signatures";
    if (!completed.has("oracle_attested") && record.pendingConditions.includes("oracle_attested")) return "awaiting_oracle_attestation";
    return "awaiting_final_approval";
  }
  if (completed.has("buyer_deposit_received") && !completed.has("seller_deposit_received")) return "awaiting_seller_deposit";
  return "awaiting_buyer_deposit";
}

// ─── Deposit recording ────────────────────────────────────────────────────────

export function recordDeposit(input: {
  escrowId: string;
  party: "buyer" | "seller";
  assetType: EscrowAssetType;
  assetSymbol: string;
  amount: string;
  actor: string;
}): EscrowRecord | null {
  const record = _escrowRegistry.find((r) => r.escrowId === input.escrowId);
  if (!record) return null;
  const now = new Date().toISOString();

  const deposit: EscrowDepositRecord = {
    depositId: randomUUID(),
    party: input.party,
    assetType: input.assetType,
    assetSymbol: input.assetSymbol,
    amount: input.amount,
    depositedAt: now,
    escrowContractAddress: record.escrowContractAddress,
    simulationOnly: true,
  };

  record.deposits.push(deposit);
  record.auditTrail.push({
    entryId: randomUUID(),
    action: "deposit_recorded",
    actor: input.actor,
    detail: `${input.party} deposit recorded: ${input.amount} ${input.assetSymbol}`,
    timestamp: now,
  });

  // Auto-satisfy deposit condition
  const condition: EscrowCondition = input.party === "buyer" ? "buyer_deposit_received" : "seller_deposit_received";
  return satisfyCondition(input.escrowId, condition, input.actor);
}

// ─── Query ────────────────────────────────────────────────────────────────────

export function getEscrowRecord(escrowId: string): EscrowRecord | undefined {
  return _escrowRegistry.find((r) => r.escrowId === escrowId);
}

export function listEscrowRecords(transactionId?: string): EscrowRecord[] {
  if (transactionId) return _escrowRegistry.filter((r) => r.transactionId === transactionId);
  return [..._escrowRegistry];
}

export function generateEscrowSummary(escrowId: string): {
  escrowId: string;
  status: EscrowStatus;
  completedConditions: EscrowCondition[];
  pendingConditions: EscrowCondition[];
  depositCount: number;
  disclosure: string;
  simulationOnly: true;
} | null {
  const e = _escrowRegistry.find((r) => r.escrowId === escrowId);
  if (!e) return null;
  return {
    escrowId: e.escrowId,
    status: e.status,
    completedConditions: e.completedConditions,
    pendingConditions: e.pendingConditions,
    depositCount: e.deposits.length,
    disclosure: ESCROW_DISCLOSURE,
    simulationOnly: true,
  };
}
