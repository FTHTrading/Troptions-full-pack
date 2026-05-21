/**
 * Troptions NIL — L1 Native Bridge (TypeScript)
 *
 * Provides a TypeScript representation of the Rust tsn-nil crate protocol.
 * This is a deterministic simulation bridge — no actual Rust FFI is called.
 * All outputs are simulation-only, devnet-only, unsigned templates.
 *
 * SAFETY:
 * - No live athlete payments
 * - No live NIL deal settlement
 * - No NFT/token minting
 * - No on-chain Web3 anchoring
 * - No sensitive athlete PII
 * - No guaranteed valuation language
 */

import crypto from "node:crypto";

// ─── Constants ────────────────────────────────────────────────────────────────

const SIMULATION_ONLY = true as const;
const LIVE_EXECUTION_ENABLED = false as const;
const LIVE_PAYMENT_ENABLED = false as const;
const LIVE_NFT_MINT_ENABLED = false as const;
const LIVE_WEB3_ANCHOR_ENABLED = false as const;
const DEVNET_ONLY = true as const;

const NIL_DISCLAIMER =
  "ESTIMATE ONLY — not a guaranteed NIL value, deal, income, or endorsement amount. " +
  "Actual NIL activity requires legal review, institutional approval, and compliance " +
  "with applicable state law. No pay-for-play or guaranteed income is represented.";

const SUBSYSTEM_VERSION = "0.1.0";

// ─── Types ────────────────────────────────────────────────────────────────────

export type NilValuationBand =
  | "InsufficientData"
  | "Emerging"
  | "Developing"
  | "Established"
  | "Elite";

export type NilGovernanceDecision =
  | "AllowReadOnly"
  | "SimulationOnly"
  | "NeedsApproval"
  | "LegalReviewRequired"
  | "InstitutionReviewRequired"
  | "GuardianReviewRequired"
  | "Blocked"
  | "Disabled";

export interface NilL1Status {
  subsystem: "tsn_nil";
  version: string;
  simulationOnly: typeof SIMULATION_ONLY;
  liveExecutionEnabled: typeof LIVE_EXECUTION_ENABLED;
  livePaymentEnabled: typeof LIVE_PAYMENT_ENABLED;
  liveNftMintEnabled: typeof LIVE_NFT_MINT_ENABLED;
  liveWeb3AnchorEnabled: typeof LIVE_WEB3_ANCHOR_ENABLED;
  devnetOnly: typeof DEVNET_ONLY;
  signalCount: 33;
  buckets: 6;
  agentCount: 9;
  timestamp: string;
}

export interface NilValuationSimulationResult {
  athleteIdHash: string;
  compositeScore: number;
  estimateLowUsd: number;
  estimateHighUsd: number;
  valuationBand: NilValuationBand;
  confidence: number;
  missingSignalCount: number;
  disclaimer: string;
  simulationOnly: true;
  evaluatedAt: string;
}

export interface NilComplianceSimulationResult {
  athleteIdHash: string;
  dealIdHash: string;
  stateCode: string;
  stateRuleStatus: string;
  institutionCode: string;
  institutionRuleStatus: string;
  payForPlayRisk: "None" | "PotentialLink" | "Blocked";
  recruitingRisk: "None" | "PotentialConflict" | "Blocked";
  minorConsentStatus: string;
  blockedReasons: string[];
  requiredApprovals: string[];
  complianceDecision: string;
  disclaimer: string;
  simulationOnly: true;
  evaluatedAt: string;
}

export interface NilReceiptSimulationResult {
  receiptIdHash: string;
  dealIdHash: string;
  athleteIdHash: string;
  brandHash: string;
  dealHash: string;
  compensationBand: string;
  complianceStatus: string;
  signatureHex: null;
  unsigned: true;
  simulationOnly: true;
  issuedAt: string;
}

export interface NilProofAnchorSimulationResult {
  templateType: "nil_proof_anchor";
  chainTarget: string;
  athleteIdHash: string;
  dealHash: string;
  proofMerkleRoot: string | null;
  ipfsCid: string | null;
  signatureHex: null;
  unsigned: true;
  liveSubmissionEnabled: false;
  disclaimer: string;
  templateCreatedAt: string;
}

export interface NilL1ReadinessReport {
  module: "tsn_nil";
  version: string;
  signals: 33;
  buckets: 6;
  agents: 9;
  complianceChecks: string[];
  safetyGates: string[];
  integrationPoints: string[];
  simulationOnly: true;
  liveExecutionEnabled: false;
  generatedAt: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sha256Hex(input: string): string {
  return crypto.createHash("sha256").update(input, "utf8").digest("hex");
}

function valBand(score: number): NilValuationBand {
  if (score < 15) return "InsufficientData";
  if (score < 40) return "Emerging";
  if (score < 65) return "Developing";
  if (score < 85) return "Established";
  return "Elite";
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Return the TSN NIL L1 module status.
 * Always simulation-only and devnet-only.
 */
export function getTroptionsNilL1Status(): NilL1Status {
  return {
    subsystem: "tsn_nil",
    version: SUBSYSTEM_VERSION,
    simulationOnly: SIMULATION_ONLY,
    liveExecutionEnabled: LIVE_EXECUTION_ENABLED,
    livePaymentEnabled: LIVE_PAYMENT_ENABLED,
    liveNftMintEnabled: LIVE_NFT_MINT_ENABLED,
    liveWeb3AnchorEnabled: LIVE_WEB3_ANCHOR_ENABLED,
    devnetOnly: DEVNET_ONLY,
    signalCount: 33,
    buckets: 6,
    agentCount: 9,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create a NIL L1 simulation payload for a given athlete ID hash and sport.
 * Returns a deterministic pseudonymous payload — no raw PII.
 */
export function createNilL1SimulationPayload(
  athleteIdHash: string,
  sport: string,
  institutionCode: string,
): object {
  return {
    athleteIdHash,
    sport,
    institutionCode,
    simulationOnly: SIMULATION_ONLY,
    liveExecutionEnabled: LIVE_EXECUTION_ENABLED,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Simulate the NIL 33-signal valuation protocol.
 * Output is an ESTIMATE ONLY — not a guaranteed NIL value.
 */
export function simulateNilL1Valuation(
  athleteIdHash: string,
  compositeSeed = 0.45,
): NilValuationSimulationResult {
  const score = Math.min(100, Math.max(0, compositeSeed * 100));
  const base = Math.pow(1.065, score) * 12;
  const low = Math.round(base * 0.75 * 100) / 100;
  const high = Math.round(base * 1.35 * 100) / 100;
  const band = valBand(score);
  const missingSignals = Math.max(0, 28 - Math.round(compositeSeed * 28));

  return {
    athleteIdHash,
    compositeScore: Math.round(score * 100) / 100,
    estimateLowUsd: low,
    estimateHighUsd: high,
    valuationBand: band,
    confidence: Math.min(1.0, compositeSeed),
    missingSignalCount: missingSignals,
    disclaimer: NIL_DISCLAIMER,
    simulationOnly: SIMULATION_ONLY,
    evaluatedAt: new Date().toISOString(),
  };
}

/**
 * Simulate a NIL deal compliance check.
 * Blocks pay-for-play, recruiting inducement, and minor consent failures.
 */
export function simulateNilL1ComplianceCheck(
  athleteIdHash: string,
  stateCode: string,
  institutionCode: string,
  isMinor: boolean,
  compensationBand: string,
): NilComplianceSimulationResult {
  const blockedReasons: string[] = [];
  const requiredApprovals: string[] = ["control_hub_approval", "legal_review"];

  const pfpKeywords = ["per game", "per touchdown", "performance bonus", "per point", "per win"];
  const recKeywords = ["if you enroll", "upon commitment", "signing bonus", "letter of intent"];

  const compLower = compensationBand.toLowerCase();

  if (pfpKeywords.some((kw) => compLower.includes(kw))) {
    blockedReasons.push("pay_for_play_detected: blocked");
  }
  if (recKeywords.some((kw) => compLower.includes(kw))) {
    blockedReasons.push("recruiting_inducement_detected: blocked");
  }
  if (isMinor) {
    blockedReasons.push("minor_consent_not_approved");
    requiredApprovals.push("guardian_approval");
  }

  const knownStates = ["TX", "CA", "FL", "OH", "GA"];
  const stateRuleStatus = knownStates.includes(stateCode.toUpperCase())
    ? "permitted_with_conditions"
    : "needs_review";

  if (!knownStates.includes(stateCode.toUpperCase())) {
    blockedReasons.push(`state_nil_not_permitted: ${stateCode}`);
  }

  requiredApprovals.push("institution_pre_approval");

  const dealIdHash = sha256Hex(`${athleteIdHash}-${stateCode}-${institutionCode}-${Date.now()}`);

  return {
    athleteIdHash,
    dealIdHash,
    stateCode,
    stateRuleStatus,
    institutionCode,
    institutionRuleStatus: "pre_approval_required",
    payForPlayRisk: pfpKeywords.some((kw) => compLower.includes(kw)) ? "Blocked" : "None",
    recruitingRisk: recKeywords.some((kw) => compLower.includes(kw)) ? "Blocked" : "None",
    minorConsentStatus: isMinor ? "PendingGuardianReview" : "NotApplicable",
    blockedReasons,
    requiredApprovals,
    complianceDecision:
      blockedReasons.length > 0
        ? "blocked — see blocked_reasons"
        : "simulation_only — no blocked reasons detected",
    disclaimer:
      "Compliance simulation only. Not legal advice or compliance certification.",
    simulationOnly: SIMULATION_ONLY,
    evaluatedAt: new Date().toISOString(),
  };
}

/**
 * Simulate an unsigned NIL deal receipt creation.
 * No live payment, settlement, or token issuance is enabled.
 */
export function simulateNilL1Receipt(
  athleteIdHash: string,
  brandHash: string,
  compensationBand: string,
  stateCode: string,
  institutionCode: string,
): NilReceiptSimulationResult {
  const dealPayload = JSON.stringify({
    athlete_id_hash: athleteIdHash,
    brand_hash: brandHash,
    compensation_band: compensationBand,
    institution_code: institutionCode,
    state_code: stateCode,
  });
  const dealHash = sha256Hex(dealPayload);
  const receiptId = sha256Hex(`receipt-${dealHash}-${Date.now()}`);

  return {
    receiptIdHash: receiptId,
    dealIdHash: sha256Hex(`deal-${athleteIdHash}-${Date.now()}`),
    athleteIdHash,
    brandHash,
    dealHash,
    compensationBand,
    complianceStatus: "simulation_only",
    signatureHex: null,
    unsigned: true,
    simulationOnly: SIMULATION_ONLY,
    issuedAt: new Date().toISOString(),
  };
}

/**
 * Simulate a NIL proof vault anchor template.
 * No live XRPL/Stellar/Polygon anchoring is enabled.
 */
export function simulateNilL1ProofAnchor(
  athleteIdHash: string,
  dealHash: string,
  documentHashes: string[],
  chainTarget = "xrpl",
): NilProofAnchorSimulationResult {
  const merkleRoot =
    documentHashes.length > 0
      ? documentHashes.reduce((acc, h) => sha256Hex(acc + h), documentHashes[0])
      : null;

  return {
    templateType: "nil_proof_anchor",
    chainTarget,
    athleteIdHash,
    dealHash,
    proofMerkleRoot: merkleRoot,
    ipfsCid: null,
    signatureHex: null,
    unsigned: true,
    liveSubmissionEnabled: false,
    disclaimer:
      "Unsigned devnet template only. No live XRPL, Stellar, or Polygon submission enabled.",
    templateCreatedAt: new Date().toISOString(),
  };
}

/**
 * Create a NIL L1 module readiness report.
 */
export function createNilL1ReadinessReport(): NilL1ReadinessReport {
  return {
    module: "tsn_nil",
    version: SUBSYSTEM_VERSION,
    signals: 33,
    buckets: 6,
    agents: 9,
    complianceChecks: [
      "state_nil_law_50_state_model",
      "institution_overlay",
      "minor_consent_gate",
      "restricted_category_detection",
      "pay_for_play_block",
      "recruiting_inducement_block",
    ],
    safetyGates: [
      "live_execution_disabled",
      "live_payment_disabled",
      "live_nft_mint_disabled",
      "live_web3_anchor_disabled",
      "simulation_only_enforced",
      "devnet_only_enforced",
      "control_hub_approval_required",
      "legal_review_required",
    ],
    integrationPoints: [
      "tsn_runtime_subsystem",
      "tsn_cli_simulate_commands",
      "control_hub_task_records",
      "control_hub_audit_trail",
      "typescript_bridge",
    ],
    simulationOnly: SIMULATION_ONLY,
    liveExecutionEnabled: LIVE_EXECUTION_ENABLED,
    generatedAt: new Date().toISOString(),
  };
}
