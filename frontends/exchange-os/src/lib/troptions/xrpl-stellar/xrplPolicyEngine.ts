/**
 * XRPL Policy Engine
 *
 * Evaluates XRPL ecosystem requests for readiness, compliance, and governance.
 *
 * SAFETY RULES:
 * - Mainnet execution is blocked by default (liveMainnetAllowedNow: false)
 * - NFT minting is blocked by default (nftMintingAllowedNow: false)
 * - Unknown KYC/KYB/sanctions status blocks all operations
 * - No guaranteed liquidity, yield, profit, or return claims allowed
 * - All outputs include simulationOnly: true
 */

import type {
  XrplEcosystemEntry,
  CrossRailComplianceCheck,
  CrossRailGovernanceDecision,
  XrplStellarReadinessReport,
} from "@/lib/troptions/xrpl-stellar/xrplStellarTypes";
import { XRPL_ECOSYSTEM_REGISTRY } from "@/content/troptions/xrplEcosystemRegistry";

// ─── Evaluation Inputs ─────────────────────────────────────────────────────────

export interface XrplIssuerReadinessInput {
  readonly assetId: string;
  readonly kybStatus?: "verified" | "pending" | "unknown" | "failed";
  readonly counselApproved?: boolean;
  readonly boardAuthorized?: boolean;
  readonly testnetConfigured?: boolean;
}

export interface XrplTrustlineRequestInput {
  readonly assetId: string;
  readonly holderKycStatus?: "verified" | "pending" | "unknown" | "failed";
  readonly issuerStatus?: "live" | "testnet" | "draft" | "not_configured";
  readonly requestedNetwork?: "mainnet" | "testnet" | "simulation";
}

export interface XrplNftMintRequestInput {
  readonly assetId: string;
  readonly kybStatus?: "verified" | "pending" | "unknown" | "failed";
  readonly metadataDefined?: boolean;
  readonly legalReviewComplete?: boolean;
  readonly requestedNetwork?: "mainnet" | "testnet" | "simulation";
}

export interface XrplDexRouteInput {
  readonly assetId: string;
  readonly participantKycStatus?: "verified" | "pending" | "unknown" | "failed";
  readonly requestedNetwork?: "mainnet" | "testnet" | "simulation";
}

export interface XrplAmmPoolRequestInput {
  readonly assetId: string;
  readonly lpProviderKycStatus?: "verified" | "pending" | "unknown" | "failed";
  readonly riskDisclosureAcknowledged?: boolean;
  readonly requestedNetwork?: "mainnet" | "testnet" | "simulation";
}

// ─── Evaluation Outputs ────────────────────────────────────────────────────────

export interface XrplPolicyResult {
  readonly allowed: boolean;
  readonly simulationOnly: true;
  readonly liveMainnetAllowedNow: false;
  readonly nftMintingAllowedNow: false;
  readonly blockedReasons: readonly string[];
  readonly complianceChecks: readonly CrossRailComplianceCheck[];
  readonly requiredNextSteps: readonly string[];
  readonly auditHint: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function check(
  rail: CrossRailComplianceCheck["rail"],
  checkType: string,
  passed: boolean,
  blockedReason?: string,
  requiredAction?: string,
): CrossRailComplianceCheck {
  return { rail, checkType, passed, blockedReason, requiredAction };
}

// ─── Evaluators ───────────────────────────────────────────────────────────────

export function evaluateXrplIssuerReadiness(
  input: XrplIssuerReadinessInput,
): XrplPolicyResult {
  const entry = XRPL_ECOSYSTEM_REGISTRY.find(
    (e) => e.id === input.assetId && e.xrplPrimitive === "issuer_profile",
  );

  const complianceChecks: CrossRailComplianceCheck[] = [];
  const blockedReasons: string[] = [];

  // Hard gate: mainnet always blocked
  complianceChecks.push(
    check("xrpl", "mainnet_execution_gate", false, "XRPL mainnet execution is disabled by policy"),
  );
  blockedReasons.push("XRPL mainnet execution is disabled by policy");

  if (!entry) {
    blockedReasons.push(`Asset ID '${input.assetId}' not found in XRPL ecosystem registry`);
  }

  if (!input.kybStatus || input.kybStatus === "unknown" || input.kybStatus === "failed") {
    complianceChecks.push(
      check("xrpl", "kyb_verification", false, "Issuer KYB is not verified", "Complete KYB verification"),
    );
    blockedReasons.push("Issuer KYB is not verified");
  } else {
    complianceChecks.push(check("xrpl", "kyb_verification", input.kybStatus === "verified"));
  }

  if (!input.counselApproved) {
    complianceChecks.push(
      check("xrpl", "counsel_approval", false, "Counsel approval not confirmed", "Obtain counsel approval"),
    );
    blockedReasons.push("Counsel approval not confirmed");
  } else {
    complianceChecks.push(check("xrpl", "counsel_approval", true));
  }

  if (!input.boardAuthorized) {
    complianceChecks.push(
      check("xrpl", "board_authorization", false, "Board authorization not confirmed", "Obtain board authorization"),
    );
    blockedReasons.push("Board authorization not confirmed");
  } else {
    complianceChecks.push(check("xrpl", "board_authorization", true));
  }

  return {
    allowed: false, // always false — simulation only
    simulationOnly: true,
    liveMainnetAllowedNow: false,
    nftMintingAllowedNow: false,
    blockedReasons,
    complianceChecks,
    requiredNextSteps: entry?.complianceRequirements ?? [],
    auditHint: "Simulation only. No XRPL issuer account was created or configured on mainnet.",
  };
}

export function evaluateXrplTrustlineRequest(
  input: XrplTrustlineRequestInput,
): XrplPolicyResult {
  const entry = XRPL_ECOSYSTEM_REGISTRY.find((e) => e.id === input.assetId);

  const complianceChecks: CrossRailComplianceCheck[] = [];
  const blockedReasons: string[] = [];

  complianceChecks.push(
    check("xrpl", "mainnet_execution_gate", false, "XRPL mainnet execution is disabled by policy"),
  );
  blockedReasons.push("XRPL mainnet execution is disabled by policy");

  if (input.requestedNetwork === "mainnet") {
    blockedReasons.push("Mainnet trustline creation is blocked");
    complianceChecks.push(
      check("xrpl", "network_gate", false, "Mainnet trustline creation is blocked"),
    );
  }

  if (!input.holderKycStatus || input.holderKycStatus === "unknown" || input.holderKycStatus === "failed") {
    complianceChecks.push(
      check("xrpl", "holder_kyc", false, "Holder KYC is not verified", "Complete holder KYC"),
    );
    blockedReasons.push("Holder KYC is not verified");
  } else {
    complianceChecks.push(check("xrpl", "holder_kyc", input.holderKycStatus === "verified"));
  }

  if (!input.issuerStatus || input.issuerStatus === "not_configured" || input.issuerStatus === "draft") {
    complianceChecks.push(
      check("xrpl", "issuer_status", false, "Issuer account not live", "Configure issuer account"),
    );
    blockedReasons.push("Issuer account not live");
  }

  return {
    allowed: false,
    simulationOnly: true,
    liveMainnetAllowedNow: false,
    nftMintingAllowedNow: false,
    blockedReasons,
    complianceChecks,
    requiredNextSteps: entry?.complianceRequirements ?? [],
    auditHint: "Simulation only. No XRPL trustline was submitted or established on any network.",
  };
}

export function evaluateXrplNftMintRequest(
  input: XrplNftMintRequestInput,
): XrplPolicyResult {
  const entry = XRPL_ECOSYSTEM_REGISTRY.find((e) => e.id === input.assetId);

  const complianceChecks: CrossRailComplianceCheck[] = [];
  const blockedReasons: string[] = [];

  complianceChecks.push(
    check("xrpl", "nft_minting_gate", false, "NFT minting is disabled by policy"),
  );
  blockedReasons.push("NFT minting is disabled by policy");

  complianceChecks.push(
    check("xrpl", "mainnet_execution_gate", false, "XRPL mainnet execution is disabled by policy"),
  );

  if (input.requestedNetwork === "mainnet") {
    blockedReasons.push("Mainnet NFT minting is blocked");
  }

  if (!input.kybStatus || input.kybStatus === "unknown" || input.kybStatus === "failed") {
    complianceChecks.push(
      check("xrpl", "issuer_kyb", false, "Issuer KYB is not verified", "Complete KYB"),
    );
    blockedReasons.push("Issuer KYB is not verified");
  }

  if (!input.metadataDefined) {
    complianceChecks.push(
      check("xrpl", "metadata_defined", false, "NFT metadata schema not defined", "Define metadata schema"),
    );
    blockedReasons.push("NFT metadata schema not defined");
  }

  if (!input.legalReviewComplete) {
    complianceChecks.push(
      check("xrpl", "legal_review", false, "Legal review not complete", "Complete legal review"),
    );
    blockedReasons.push("Legal review not complete");
  }

  return {
    allowed: false,
    simulationOnly: true,
    liveMainnetAllowedNow: false,
    nftMintingAllowedNow: false,
    blockedReasons,
    complianceChecks,
    requiredNextSteps: entry?.complianceRequirements ?? [],
    auditHint: "Simulation only. No XRPL NFT was minted or submitted on any network.",
  };
}

export function evaluateXrplDexRoute(
  input: XrplDexRouteInput,
): XrplPolicyResult {
  const entry = XRPL_ECOSYSTEM_REGISTRY.find((e) => e.id === input.assetId);

  const complianceChecks: CrossRailComplianceCheck[] = [];
  const blockedReasons: string[] = [];

  complianceChecks.push(
    check("xrpl", "mainnet_execution_gate", false, "XRPL mainnet execution is disabled by policy"),
  );
  blockedReasons.push("XRPL mainnet execution is disabled by policy");

  if (!input.participantKycStatus || input.participantKycStatus !== "verified") {
    complianceChecks.push(
      check("xrpl", "participant_kyc", false, "DEX participant KYC not verified", "Verify participant KYC"),
    );
    blockedReasons.push("DEX participant KYC not verified");
  }

  return {
    allowed: false,
    simulationOnly: true,
    liveMainnetAllowedNow: false,
    nftMintingAllowedNow: false,
    blockedReasons,
    complianceChecks,
    requiredNextSteps: entry?.complianceRequirements ?? [],
    auditHint: "Simulation only. No XRPL DEX offer was submitted or executed on any network.",
  };
}

export function evaluateXrplAmmPoolRequest(
  input: XrplAmmPoolRequestInput,
): XrplPolicyResult {
  const entry = XRPL_ECOSYSTEM_REGISTRY.find((e) => e.id === input.assetId);

  const complianceChecks: CrossRailComplianceCheck[] = [];
  const blockedReasons: string[] = [];

  complianceChecks.push(
    check("xrpl", "mainnet_execution_gate", false, "XRPL mainnet execution is disabled by policy"),
  );
  blockedReasons.push("XRPL mainnet execution is disabled by policy");

  if (!input.riskDisclosureAcknowledged) {
    complianceChecks.push(
      check(
        "xrpl",
        "lp_risk_disclosure",
        false,
        "LP risk disclosure not acknowledged — no guaranteed yield or return",
        "Acknowledge LP risk disclosures",
      ),
    );
    blockedReasons.push("LP risk disclosures not acknowledged — no guaranteed liquidity, yield, or return");
  }

  if (!input.lpProviderKycStatus || input.lpProviderKycStatus !== "verified") {
    complianceChecks.push(
      check("xrpl", "lp_provider_kyc", false, "LP provider KYC not verified", "Verify LP provider KYC"),
    );
    blockedReasons.push("LP provider KYC not verified");
  }

  return {
    allowed: false,
    simulationOnly: true,
    liveMainnetAllowedNow: false,
    nftMintingAllowedNow: false,
    blockedReasons,
    complianceChecks,
    requiredNextSteps: entry?.complianceRequirements ?? [],
    auditHint:
      "Simulation only. No XRPL AMM deposit or pool interaction was submitted. " +
      "AMM LP positions carry impermanent loss risk. No guaranteed yield or return.",
  };
}

export function createXrplReadinessReport(
  entries: readonly XrplEcosystemEntry[] = XRPL_ECOSYSTEM_REGISTRY,
): Pick<
  XrplStellarReadinessReport,
  | "xrplAssetsTotal"
  | "xrplAssetsBlocked"
  | "xrplAssetsSimulationOnly"
  | "xrplAssetsTestnetReady"
  | "isLiveMainnetExecutionEnabled"
> {
  return {
    xrplAssetsTotal: entries.length,
    xrplAssetsBlocked: entries.filter((e) => e.executionMode === "disabled").length,
    xrplAssetsSimulationOnly: entries.filter((e) => e.executionMode === "simulation_only").length,
    xrplAssetsTestnetReady: entries.filter((e) => e.executionMode === "testnet_only").length,
    isLiveMainnetExecutionEnabled: false,
  };
}

export function getXrplPolicyBlockedReason(): string {
  return "XRPL mainnet execution is disabled by platform policy. All operations are simulation-only.";
}
