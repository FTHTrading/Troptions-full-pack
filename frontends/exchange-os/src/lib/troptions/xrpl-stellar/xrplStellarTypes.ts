/**
 * XRPL + Stellar Shared Type Definitions
 *
 * SAFETY: All execution modes default to blocked/simulation-only.
 * No live mainnet or public-network operations are enabled.
 */

// ─── Execution Mode ────────────────────────────────────────────────────────────

export type XrplStellarExecutionMode =
  | "read_only"
  | "simulation_only"
  | "testnet_only"
  | "approval_required"
  | "disabled";

// ─── XRPL Types ───────────────────────────────────────────────────────────────

export type XrplPrimitive =
  | "issuer_profile"
  | "trustline_asset"
  | "nft"
  | "dex_route"
  | "amm_pool";

export interface XrplIssuerProfile {
  readonly id: string;
  readonly displayName: string;
  readonly category: string;
  readonly xrplPrimitive: "issuer_profile";
  readonly purpose: string;
  readonly issuerStatus: "not_configured" | "draft" | "testnet_ready" | "pending_approval" | "blocked";
  readonly trustlineRequired: boolean;
  readonly nftMintingAllowedNow: false;
  readonly liveMainnetAllowedNow: false;
  readonly executionMode: XrplStellarExecutionMode;
  readonly complianceRequirements: readonly string[];
  readonly risks: readonly string[];
  readonly recommendedNextAction: string;
}

export interface XrplTrustlineAsset {
  readonly id: string;
  readonly displayName: string;
  readonly category: string;
  readonly xrplPrimitive: "trustline_asset";
  readonly purpose: string;
  readonly issuerStatus: "not_configured" | "draft" | "testnet_ready" | "pending_approval" | "blocked";
  readonly trustlineRequired: true;
  readonly nftMintingAllowedNow: false;
  readonly liveMainnetAllowedNow: false;
  readonly executionMode: XrplStellarExecutionMode;
  readonly complianceRequirements: readonly string[];
  readonly risks: readonly string[];
  readonly recommendedNextAction: string;
}

export interface XrplNftProfile {
  readonly id: string;
  readonly displayName: string;
  readonly category: string;
  readonly xrplPrimitive: "nft";
  readonly purpose: string;
  readonly issuerStatus: "not_configured" | "draft" | "testnet_ready" | "pending_approval" | "blocked";
  readonly trustlineRequired: false;
  readonly nftMintingAllowedNow: false;
  readonly liveMainnetAllowedNow: false;
  readonly executionMode: XrplStellarExecutionMode;
  readonly complianceRequirements: readonly string[];
  readonly risks: readonly string[];
  readonly recommendedNextAction: string;
}

export interface XrplDexRoute {
  readonly id: string;
  readonly displayName: string;
  readonly category: string;
  readonly xrplPrimitive: "dex_route";
  readonly purpose: string;
  readonly issuerStatus: "not_configured" | "draft" | "testnet_ready" | "pending_approval" | "blocked";
  readonly trustlineRequired: boolean;
  readonly nftMintingAllowedNow: false;
  readonly liveMainnetAllowedNow: false;
  readonly executionMode: XrplStellarExecutionMode;
  readonly complianceRequirements: readonly string[];
  readonly risks: readonly string[];
  readonly recommendedNextAction: string;
}

export interface XrplAmmPoolProfile {
  readonly id: string;
  readonly displayName: string;
  readonly category: string;
  readonly xrplPrimitive: "amm_pool";
  readonly purpose: string;
  readonly issuerStatus: "not_configured" | "draft" | "testnet_ready" | "pending_approval" | "blocked";
  readonly trustlineRequired: boolean;
  readonly nftMintingAllowedNow: false;
  readonly liveMainnetAllowedNow: false;
  readonly executionMode: XrplStellarExecutionMode;
  readonly complianceRequirements: readonly string[];
  readonly risks: readonly string[];
  readonly recommendedNextAction: string;
}

export type XrplEcosystemEntry =
  | XrplIssuerProfile
  | XrplTrustlineAsset
  | XrplNftProfile
  | XrplDexRoute
  | XrplAmmPoolProfile;

// ─── Stellar Types ─────────────────────────────────────────────────────────────

export type StellarPrimitive =
  | "issuer_profile"
  | "asset"
  | "trustline"
  | "liquidity_pool"
  | "path_payment"
  | "anchor_profile";

export interface StellarIssuerProfile {
  readonly id: string;
  readonly displayName: string;
  readonly category: string;
  readonly stellarPrimitive: "issuer_profile";
  readonly purpose: string;
  readonly issuerStatus: "not_configured" | "draft" | "testnet_ready" | "pending_approval" | "blocked";
  readonly trustlineRequired: boolean;
  readonly publicNetworkAllowedNow: false;
  readonly executionMode: XrplStellarExecutionMode;
  readonly complianceRequirements: readonly string[];
  readonly risks: readonly string[];
  readonly recommendedNextAction: string;
}

export interface StellarAssetProfile {
  readonly id: string;
  readonly displayName: string;
  readonly category: string;
  readonly stellarPrimitive: "asset";
  readonly purpose: string;
  readonly issuerStatus: "not_configured" | "draft" | "testnet_ready" | "pending_approval" | "blocked";
  readonly trustlineRequired: boolean;
  readonly publicNetworkAllowedNow: false;
  readonly executionMode: XrplStellarExecutionMode;
  readonly complianceRequirements: readonly string[];
  readonly risks: readonly string[];
  readonly recommendedNextAction: string;
}

export interface StellarTrustlineProfile {
  readonly id: string;
  readonly displayName: string;
  readonly category: string;
  readonly stellarPrimitive: "trustline";
  readonly purpose: string;
  readonly issuerStatus: "not_configured" | "draft" | "testnet_ready" | "pending_approval" | "blocked";
  readonly trustlineRequired: true;
  readonly publicNetworkAllowedNow: false;
  readonly executionMode: XrplStellarExecutionMode;
  readonly complianceRequirements: readonly string[];
  readonly risks: readonly string[];
  readonly recommendedNextAction: string;
}

export interface StellarLiquidityPoolProfile {
  readonly id: string;
  readonly displayName: string;
  readonly category: string;
  readonly stellarPrimitive: "liquidity_pool";
  readonly purpose: string;
  readonly issuerStatus: "not_configured" | "draft" | "testnet_ready" | "pending_approval" | "blocked";
  readonly trustlineRequired: boolean;
  readonly publicNetworkAllowedNow: false;
  readonly executionMode: XrplStellarExecutionMode;
  readonly complianceRequirements: readonly string[];
  readonly risks: readonly string[];
  readonly recommendedNextAction: string;
}

export interface StellarPathPaymentProfile {
  readonly id: string;
  readonly displayName: string;
  readonly category: string;
  readonly stellarPrimitive: "path_payment";
  readonly purpose: string;
  readonly issuerStatus: "not_configured" | "draft" | "testnet_ready" | "pending_approval" | "blocked";
  readonly trustlineRequired: boolean;
  readonly publicNetworkAllowedNow: false;
  readonly executionMode: XrplStellarExecutionMode;
  readonly complianceRequirements: readonly string[];
  readonly risks: readonly string[];
  readonly recommendedNextAction: string;
}

export type StellarEcosystemEntry =
  | StellarIssuerProfile
  | StellarAssetProfile
  | StellarTrustlineProfile
  | StellarLiquidityPoolProfile
  | StellarPathPaymentProfile;

// ─── Cross-Rail Types ──────────────────────────────────────────────────────────

export interface CrossRailRoute {
  readonly id: string;
  readonly displayName: string;
  readonly sourceRail: "xrpl" | "stellar";
  readonly destinationRail: "xrpl" | "stellar";
  readonly routeType: "bridge" | "swap" | "settlement" | "payment";
  readonly executionMode: XrplStellarExecutionMode;
  readonly complianceRequirements: readonly string[];
  readonly blockedReason: string;
  readonly liveExecutionAllowedNow: false;
}

export interface CrossRailComplianceCheck {
  readonly rail: "xrpl" | "stellar" | "cross-rail";
  readonly checkType: string;
  readonly passed: boolean;
  readonly blockedReason?: string;
  readonly requiredAction?: string;
}

export interface CrossRailGovernanceDecision {
  readonly taskId: string | null;
  readonly auditRecordId: string | null;
  readonly persisted: boolean;
  readonly allowed: boolean;
  readonly simulationOnly: true;
  readonly blockedActions: readonly string[];
  readonly requiredApprovals: readonly string[];
  readonly complianceChecks: readonly CrossRailComplianceCheck[];
  readonly auditHint: string;
}

export interface XrplStellarReadinessReport {
  readonly generatedAt: string;
  readonly xrplAssetsTotal: number;
  readonly xrplAssetsBlocked: number;
  readonly xrplAssetsSimulationOnly: number;
  readonly xrplAssetsTestnetReady: number;
  readonly stellarAssetsTotal: number;
  readonly stellarAssetsBlocked: number;
  readonly stellarAssetsSimulationOnly: number;
  readonly stellarAssetsTestnetReady: number;
  readonly isLiveMainnetExecutionEnabled: false;
  readonly isLivePublicNetworkEnabled: false;
  readonly complianceGapsCount: number;
  readonly blockedActionsCount: number;
  readonly recommendedNextActions: readonly string[];
  readonly governanceDecision: CrossRailGovernanceDecision;
}

export interface XrplStellarAuditEvent {
  readonly id: string;
  readonly rail: "xrpl" | "stellar" | "cross-rail";
  readonly eventType: string;
  readonly assetId: string;
  readonly simulationMode: true;
  readonly liveExecutionEnabled: false;
  readonly outcome: "blocked" | "simulation_complete" | "approval_required";
  readonly blockedReason?: string;
  readonly timestamp: string;
  readonly auditHint: string;
}
