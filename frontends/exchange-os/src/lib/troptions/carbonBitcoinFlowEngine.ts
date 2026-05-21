/**
 * Carbon-Bitcoin Cross-Module Flow Engine.
 *
 * Combines a verified-active carbon credit asset with a Bitcoin settlement
 * preference. SIMULATION ONLY — never executes a real payment, never signs
 * a Bitcoin transaction, never moves custody. Output is a structured
 * preview with validation results, blocking compliance gates, an audit
 * preview, and the next required evidence step.
 */

import {
  CARBON_CREDIT_DISCLOSURE,
  calculateCarbonReadinessScore,
  getCarbonAsset,
  type CarbonCreditRecord,
} from "@/lib/troptions/carbonCreditEngine";
import {
  BITCOIN_SETTLEMENT_DISCLOSURE,
  createBitcoinSettlementRecord,
  type BitcoinSettlementRecord,
  type BitcoinSettlementType,
} from "@/lib/troptions/bitcoinSettlementEngine";
import { appendCarbonBitcoinAuditEvent } from "@/lib/troptions/carbonBitcoinAuditLog";

export interface CarbonBitcoinFlowInput {
  carbonAssetId: string;
  settlementId: string;
  payerName: string;
  payeeName: string;
  usdReferenceValue: number;
  btcQuotedAmount?: number;
  providerName?: string;
  invoiceId?: string;
  settlementType?: BitcoinSettlementType;
  actor?: string;
}

export interface CarbonBitcoinFlowResult {
  simulated: true;
  requestedAction: "carbon-credit-sale-paid-in-btc";
  carbonAsset:
    | {
        carbonAssetId: string;
        status: CarbonCreditRecord["status"];
        readinessScore: number;
        verificationStatus: CarbonCreditRecord["verificationStatus"];
        retirementStatus: CarbonCreditRecord["retirementStatus"];
      }
    | null;
  bitcoinSettlement: BitcoinSettlementRecord | null;
  blocked: boolean;
  blockingReasons: string[];
  approvalGatesRequired: string[];
  nextRequiredEvidence: string[];
  auditEventPreview: {
    eventType: "CARBON_BTC_FLOW_SIMULATED";
    actor: string;
    relatedAssetId: string;
    relatedSettlementId: string;
    reason: string;
  };
  disclosures: { carbon: string; bitcoin: string };
  generatedAt: string;
}

export function createCarbonCreditBitcoinSettlementFlow(
  input: CarbonBitcoinFlowInput
): CarbonBitcoinFlowResult {
  const blockingReasons: string[] = [];
  const approvalGatesRequired: string[] = [];
  const nextRequiredEvidence: string[] = [];
  const actor = input.actor ?? "system";

  const carbonRecord = getCarbonAsset(input.carbonAssetId);
  if (!carbonRecord) {
    blockingReasons.push(`carbon asset ${input.carbonAssetId} not found`);
  } else {
    if (carbonRecord.verificationStatus !== "verified") {
      blockingReasons.push(`verification status is ${carbonRecord.verificationStatus}`);
      nextRequiredEvidence.push("registry-verification-confirmation");
    }
    if (
      carbonRecord.retirementStatus !== "active" &&
      carbonRecord.retirementStatus !== "pending-retirement"
    ) {
      blockingReasons.push(`carbon credit not in active state (${carbonRecord.retirementStatus})`);
    }
    if (carbonRecord.status === "RETIRED") {
      blockingReasons.push("carbon credit already RETIRED — cannot be sold again without override approval");
    }
    if (carbonRecord.status === "BLOCKED" || carbonRecord.status === "REJECTED") {
      blockingReasons.push(`carbon credit status ${carbonRecord.status}`);
    }
    if (!carbonRecord.ownerName) {
      blockingReasons.push("ownership evidence missing");
      nextRequiredEvidence.push("ownership-attestation");
    }
    if (carbonRecord.approvalStatus !== "approved") {
      approvalGatesRequired.push("carbon-asset-approval");
    }
  }

  if (!input.providerName) {
    blockingReasons.push("BTC settlement provider not designated");
    approvalGatesRequired.push("external-btc-provider-selection");
  }
  approvalGatesRequired.push("kyc-approval", "aml-approval", "settlement-approval");

  const settlementRecord = createBitcoinSettlementRecord({
    settlementId: input.settlementId,
    relatedAssetId: input.carbonAssetId,
    payerName: input.payerName,
    payeeName: input.payeeName,
    settlementType: input.settlementType ?? "BUYER_PAYS_BTC",
    usdReferenceValue: input.usdReferenceValue,
    btcQuotedAmount: input.btcQuotedAmount,
    providerName: input.providerName,
    invoiceId: input.invoiceId,
    actor,
  });

  const blocked = blockingReasons.length > 0;
  const reason = blocked
    ? `simulation blocked: ${blockingReasons.join("; ")}`
    : "simulation passed all gates (still preview only — no real execution)";

  const auditEvent = appendCarbonBitcoinAuditEvent({
    eventType: "CARBON_BTC_FLOW_SIMULATED",
    actor,
    relatedAssetId: input.carbonAssetId,
    relatedSettlementId: input.settlementId,
    reason,
    riskFlags: blocked ? ["flow-blocked", ...blockingReasons.slice(0, 3)] : [],
  });

  return {
    simulated: true,
    requestedAction: "carbon-credit-sale-paid-in-btc",
    carbonAsset: carbonRecord
      ? {
          carbonAssetId: carbonRecord.carbonAssetId,
          status: carbonRecord.status,
          readinessScore: calculateCarbonReadinessScore(carbonRecord),
          verificationStatus: carbonRecord.verificationStatus,
          retirementStatus: carbonRecord.retirementStatus,
        }
      : null,
    bitcoinSettlement: settlementRecord,
    blocked,
    blockingReasons,
    approvalGatesRequired,
    nextRequiredEvidence,
    auditEventPreview: {
      eventType: "CARBON_BTC_FLOW_SIMULATED",
      actor: auditEvent.actor,
      relatedAssetId: input.carbonAssetId,
      relatedSettlementId: input.settlementId,
      reason: auditEvent.reason,
    },
    disclosures: {
      carbon: CARBON_CREDIT_DISCLOSURE,
      bitcoin: BITCOIN_SETTLEMENT_DISCLOSURE,
    },
    generatedAt: new Date().toISOString(),
  };
}
