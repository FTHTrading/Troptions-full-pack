/**
 * Stellar Policy Engine
 *
 * Evaluates Stellar ecosystem requests for readiness, compliance, and governance.
 *
 * SAFETY RULES:
 * - Public network execution is blocked by default (publicNetworkAllowedNow: false)
 * - No real XLM, stablecoin, or asset movement
 * - Anchor/SEP requires legal and compliance review before any simulation
 * - Unknown KYC/KYB/sanctions status blocks all operations
 * - No guaranteed liquidity, yield, profit, or return claims allowed
 * - All outputs include simulationOnly: true
 */

import type {
  StellarEcosystemEntry,
  CrossRailComplianceCheck,
  XrplStellarReadinessReport,
} from "@/lib/troptions/xrpl-stellar/xrplStellarTypes";
import { STELLAR_ECOSYSTEM_REGISTRY } from "@/content/troptions/stellarEcosystemRegistry";

// ─── Evaluation Inputs ─────────────────────────────────────────────────────────

export interface StellarIssuerReadinessInput {
  readonly assetId: string;
  readonly kybStatus?: "verified" | "pending" | "unknown" | "failed";
  readonly counselApproved?: boolean;
  readonly boardAuthorized?: boolean;
  readonly testnetConfigured?: boolean;
}

export interface StellarTrustlineRequestInput {
  readonly assetId: string;
  readonly holderKycStatus?: "verified" | "pending" | "unknown" | "failed";
  readonly issuerStatus?: "live" | "testnet" | "draft" | "not_configured";
  readonly requestedNetwork?: "public" | "testnet" | "simulation";
}

export interface StellarLiquidityPoolRequestInput {
  readonly assetId: string;
  readonly lpProviderKycStatus?: "verified" | "pending" | "unknown" | "failed";
  readonly riskDisclosureAcknowledged?: boolean;
  readonly requestedNetwork?: "public" | "testnet" | "simulation";
}

export interface StellarPathPaymentRequestInput {
  readonly assetId: string;
  readonly senderKycStatus?: "verified" | "pending" | "unknown" | "failed";
  readonly receiverKycStatus?: "verified" | "pending" | "unknown" | "failed";
  readonly anchorInvolved?: boolean;
  readonly requestedNetwork?: "public" | "testnet" | "simulation";
}

// ─── Evaluation Output ────────────────────────────────────────────────────────

export interface StellarPolicyResult {
  readonly allowed: boolean;
  readonly simulationOnly: true;
  readonly publicNetworkAllowedNow: false;
  readonly blockedReasons: readonly string[];
  readonly complianceChecks: readonly CrossRailComplianceCheck[];
  readonly requiredNextSteps: readonly string[];
  readonly auditHint: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function check(
  checkType: string,
  passed: boolean,
  blockedReason?: string,
  requiredAction?: string,
): CrossRailComplianceCheck {
  return { rail: "stellar", checkType, passed, blockedReason, requiredAction };
}

// ─── Evaluators ───────────────────────────────────────────────────────────────

export function evaluateStellarIssuerReadiness(
  input: StellarIssuerReadinessInput,
): StellarPolicyResult {
  const entry = STELLAR_ECOSYSTEM_REGISTRY.find((e) => e.id === input.assetId);

  const complianceChecks: CrossRailComplianceCheck[] = [];
  const blockedReasons: string[] = [];

  complianceChecks.push(
    check("public_network_gate", false, "Stellar public network execution is disabled by policy"),
  );
  blockedReasons.push("Stellar public network execution is disabled by policy");

  if (!entry) {
    blockedReasons.push(`Asset ID '${input.assetId}' not found in Stellar ecosystem registry`);
  }

  if (!input.kybStatus || input.kybStatus === "unknown" || input.kybStatus === "failed") {
    complianceChecks.push(
      check("kyb_verification", false, "Issuer KYB is not verified", "Complete KYB verification"),
    );
    blockedReasons.push("Issuer KYB is not verified");
  } else {
    complianceChecks.push(check("kyb_verification", input.kybStatus === "verified"));
  }

  if (!input.counselApproved) {
    complianceChecks.push(
      check("counsel_approval", false, "Counsel approval not confirmed", "Obtain counsel approval"),
    );
    blockedReasons.push("Counsel approval not confirmed");
  } else {
    complianceChecks.push(check("counsel_approval", true));
  }

  if (!input.boardAuthorized) {
    complianceChecks.push(
      check("board_authorization", false, "Board authorization not confirmed", "Obtain board authorization"),
    );
    blockedReasons.push("Board authorization not confirmed");
  } else {
    complianceChecks.push(check("board_authorization", true));
  }

  return {
    allowed: false,
    simulationOnly: true,
    publicNetworkAllowedNow: false,
    blockedReasons,
    complianceChecks,
    requiredNextSteps: entry?.complianceRequirements ?? [],
    auditHint: "Simulation only. No Stellar issuer account was created or configured on the public network.",
  };
}

export function evaluateStellarTrustlineRequest(
  input: StellarTrustlineRequestInput,
): StellarPolicyResult {
  const entry = STELLAR_ECOSYSTEM_REGISTRY.find((e) => e.id === input.assetId);

  const complianceChecks: CrossRailComplianceCheck[] = [];
  const blockedReasons: string[] = [];

  complianceChecks.push(
    check("public_network_gate", false, "Stellar public network execution is disabled by policy"),
  );
  blockedReasons.push("Stellar public network execution is disabled by policy");

  if (input.requestedNetwork === "public") {
    blockedReasons.push("Public network trustline creation is blocked");
    complianceChecks.push(
      check("network_gate", false, "Public network trustline creation is blocked"),
    );
  }

  if (!input.holderKycStatus || input.holderKycStatus === "unknown" || input.holderKycStatus === "failed") {
    complianceChecks.push(
      check("holder_kyc", false, "Holder KYC is not verified", "Complete holder KYC"),
    );
    blockedReasons.push("Holder KYC is not verified");
  } else {
    complianceChecks.push(check("holder_kyc", input.holderKycStatus === "verified"));
  }

  if (!input.issuerStatus || input.issuerStatus === "not_configured" || input.issuerStatus === "draft") {
    complianceChecks.push(
      check("issuer_status", false, "Issuer account not live", "Configure issuer account"),
    );
    blockedReasons.push("Issuer account not live");
  }

  return {
    allowed: false,
    simulationOnly: true,
    publicNetworkAllowedNow: false,
    blockedReasons,
    complianceChecks,
    requiredNextSteps: entry?.complianceRequirements ?? [],
    auditHint: "Simulation only. No Stellar trustline was submitted or established on any network.",
  };
}

export function evaluateStellarLiquidityPoolRequest(
  input: StellarLiquidityPoolRequestInput,
): StellarPolicyResult {
  const entry = STELLAR_ECOSYSTEM_REGISTRY.find((e) => e.id === input.assetId);

  const complianceChecks: CrossRailComplianceCheck[] = [];
  const blockedReasons: string[] = [];

  complianceChecks.push(
    check("public_network_gate", false, "Stellar public network execution is disabled by policy"),
  );
  blockedReasons.push("Stellar public network execution is disabled by policy");

  if (!input.riskDisclosureAcknowledged) {
    complianceChecks.push(
      check(
        "lp_risk_disclosure",
        false,
        "LP risk disclosure not acknowledged — no guaranteed yield or return",
        "Acknowledge LP risk disclosures",
      ),
    );
    blockedReasons.push(
      "LP risk disclosures not acknowledged — no guaranteed liquidity, yield, or return",
    );
  }

  if (!input.lpProviderKycStatus || input.lpProviderKycStatus !== "verified") {
    complianceChecks.push(
      check("lp_provider_kyc", false, "LP provider KYC not verified", "Verify LP provider KYC"),
    );
    blockedReasons.push("LP provider KYC not verified");
  }

  return {
    allowed: false,
    simulationOnly: true,
    publicNetworkAllowedNow: false,
    blockedReasons,
    complianceChecks,
    requiredNextSteps: entry?.complianceRequirements ?? [],
    auditHint:
      "Simulation only. No Stellar liquidity pool deposit or interaction was submitted. " +
      "LP positions carry impermanent loss risk. No guaranteed yield or return.",
  };
}

export function evaluateStellarPathPaymentRequest(
  input: StellarPathPaymentRequestInput,
): StellarPolicyResult {
  const entry = STELLAR_ECOSYSTEM_REGISTRY.find((e) => e.id === input.assetId);

  const complianceChecks: CrossRailComplianceCheck[] = [];
  const blockedReasons: string[] = [];

  complianceChecks.push(
    check("public_network_gate", false, "Stellar public network execution is disabled by policy"),
  );
  blockedReasons.push("Stellar public network execution is disabled by policy");

  if (!input.senderKycStatus || input.senderKycStatus !== "verified") {
    complianceChecks.push(
      check("sender_kyc", false, "Sender KYC not verified", "Verify sender KYC"),
    );
    blockedReasons.push("Sender KYC not verified");
  }

  if (!input.receiverKycStatus || input.receiverKycStatus !== "verified") {
    complianceChecks.push(
      check("receiver_kyc", false, "Receiver KYC not verified", "Verify receiver KYC"),
    );
    blockedReasons.push("Receiver KYC not verified");
  }

  if (input.anchorInvolved) {
    complianceChecks.push(
      check(
        "anchor_sep_review",
        false,
        "Anchor/SEP involvement requires legal and compliance review",
        "Complete anchor/SEP legal review",
      ),
    );
    blockedReasons.push("Anchor/SEP involvement requires legal review before any path payment simulation");
  }

  return {
    allowed: false,
    simulationOnly: true,
    publicNetworkAllowedNow: false,
    blockedReasons,
    complianceChecks,
    requiredNextSteps: entry?.complianceRequirements ?? [],
    auditHint:
      "Simulation only. No Stellar path payment was submitted or executed. " +
      "No real XLM or stablecoin movement occurred.",
  };
}

export function createStellarReadinessReport(
  entries: readonly StellarEcosystemEntry[] = STELLAR_ECOSYSTEM_REGISTRY,
): Pick<
  XrplStellarReadinessReport,
  | "stellarAssetsTotal"
  | "stellarAssetsBlocked"
  | "stellarAssetsSimulationOnly"
  | "stellarAssetsTestnetReady"
  | "isLivePublicNetworkEnabled"
> {
  return {
    stellarAssetsTotal: entries.length,
    stellarAssetsBlocked: entries.filter((e) => e.executionMode === "disabled").length,
    stellarAssetsSimulationOnly: entries.filter((e) => e.executionMode === "simulation_only").length,
    stellarAssetsTestnetReady: entries.filter((e) => e.executionMode === "testnet_only").length,
    isLivePublicNetworkEnabled: false,
  };
}

export function getStellarPolicyBlockedReason(): string {
  return "Stellar public network execution is disabled by platform policy. All operations are simulation-only.";
}
