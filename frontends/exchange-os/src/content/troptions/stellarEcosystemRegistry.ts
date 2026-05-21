/**
 * Stellar Ecosystem Registry
 *
 * Defines Stellar profiles for all Troptions business units.
 *
 * SAFETY RULES:
 * - publicNetworkAllowedNow: false (all entries)
 * - All entries are simulation_only or disabled by default
 * - No private keys, seeds, or secrets
 * - No real XLM, stablecoin, or asset movement
 */

import type {
  StellarIssuerProfile,
  StellarAssetProfile,
  StellarTrustlineProfile,
  StellarLiquidityPoolProfile,
  StellarPathPaymentProfile,
  StellarEcosystemEntry,
} from "@/lib/troptions/xrpl-stellar/xrplStellarTypes";

// ─── Troptions Settlement Unit ─────────────────────────────────────────────────

export const STELLAR_TSU_ISSUER: StellarIssuerProfile = {
  id: "stellar-tsu-issuer",
  displayName: "Troptions Settlement Unit — Stellar Issuer",
  category: "settlement",
  stellarPrimitive: "issuer_profile",
  purpose: "Issue TSU as a Stellar custom asset for settlement workflows",
  issuerStatus: "draft",
  trustlineRequired: true,
  publicNetworkAllowedNow: false,
  executionMode: "simulation_only",
  complianceRequirements: [
    "Legal entity KYB verified",
    "Stellar issuer account configured on testnet",
    "Authorization required flag evaluated",
    "Clawback policy defined",
    "Counsel approval for issuance",
    "Board authorization",
  ],
  risks: [
    "Stellar custom asset holders bear issuer risk",
    "Trustline authorization required flag controls holder access",
    "Redemption not guaranteed without liquidity",
  ],
  recommendedNextAction: "Complete KYB and legal review. Configure issuer on Stellar testnet.",
};

export const STELLAR_TSU_TRUSTLINE: StellarTrustlineProfile = {
  id: "stellar-tsu-trustline",
  displayName: "Troptions Settlement Unit — Stellar Trustline",
  category: "settlement",
  stellarPrimitive: "trustline",
  purpose: "Holder trustline for TSU custom asset on Stellar",
  issuerStatus: "draft",
  trustlineRequired: true,
  publicNetworkAllowedNow: false,
  executionMode: "simulation_only",
  complianceRequirements: [
    "Holder KYC/KYB verified",
    "Trustline approved by operator",
    "Issuer account live on testnet",
    "Travel Rule compliance reviewed",
  ],
  risks: [
    "Holder must establish trustline before receiving TSU",
    "Issuer authorization controls apply",
    "No guaranteed liquidity",
  ],
  recommendedNextAction: "Simulate trustline establishment on testnet after issuer is configured.",
};

// ─── Troptions Xchange ─────────────────────────────────────────────────────────

export const STELLAR_TXC_ASSET: StellarAssetProfile = {
  id: "stellar-txc-asset",
  displayName: "Troptions Xchange — Stellar Asset",
  category: "exchange",
  stellarPrimitive: "asset",
  purpose: "Issue TXC as a Stellar custom asset representing exchange credit",
  issuerStatus: "draft",
  trustlineRequired: true,
  publicNetworkAllowedNow: false,
  executionMode: "simulation_only",
  complianceRequirements: [
    "Exchange license or legal opinion",
    "KYB verification",
    "AML/KYC program established",
    "Counsel approval",
    "Board authorization",
  ],
  risks: [
    "Exchange credit classification may require securities analysis",
    "Holder trustlines create issuer-side liability",
    "No guaranteed exchange rate or redemption",
  ],
  recommendedNextAction: "Obtain legal opinion on exchange credit classification before issuer setup.",
};

export const STELLAR_TXC_PATH_PAYMENT: StellarPathPaymentProfile = {
  id: "stellar-txc-path-payment",
  displayName: "Troptions Xchange — Stellar Path Payment",
  category: "exchange",
  stellarPrimitive: "path_payment",
  purpose: "Simulate path payment routes for TXC conversion on Stellar",
  issuerStatus: "draft",
  trustlineRequired: true,
  publicNetworkAllowedNow: false,
  executionMode: "simulation_only",
  complianceRequirements: [
    "Path payment participants KYC/KYB verified",
    "Travel Rule compliance for cross-border paths",
    "Anchor/SEP compliance if fiat on/off-ramps involved",
    "Legal review of path conversion",
  ],
  risks: [
    "Path payment slippage risk",
    "Intermediate asset exposure during conversion",
    "No guaranteed path or fill",
    "Anchor counterparty risk if involved",
  ],
  recommendedNextAction: "Simulate path payment routes on testnet. No live execution until compliance complete.",
};

// ─── Troptions University ──────────────────────────────────────────────────────

export const STELLAR_TUNI_ASSET: StellarAssetProfile = {
  id: "stellar-tuni-asset",
  displayName: "Troptions University — Stellar Credential Asset",
  category: "credential",
  stellarPrimitive: "asset",
  purpose: "Issue credential tokens on Stellar for course completion and certifications",
  issuerStatus: "draft",
  trustlineRequired: true,
  publicNetworkAllowedNow: false,
  executionMode: "simulation_only",
  complianceRequirements: [
    "Credential issuer legal authority",
    "Non-transferable credential design evaluated",
    "Legal review of credential tokens",
    "Issuer KYB verified",
  ],
  risks: [
    "Credential tokens may not have legal recognition in all jurisdictions",
    "Transferability controls must be enforced",
    "Metadata permanence strategy required",
  ],
  recommendedNextAction: "Define credential token standards. Simulate on Stellar testnet.",
};

// ─── Real Estate Connections ───────────────────────────────────────────────────

export const STELLAR_REC_ASSET: StellarAssetProfile = {
  id: "stellar-rec-asset",
  displayName: "Real Estate Connections — Stellar Asset Record",
  category: "real_estate",
  stellarPrimitive: "asset",
  purpose: "Issue asset record tokens on Stellar for real estate transaction proofs",
  issuerStatus: "draft",
  trustlineRequired: true,
  publicNetworkAllowedNow: false,
  executionMode: "simulation_only",
  complianceRequirements: [
    "Real estate regulatory review by jurisdiction",
    "Title/deed legal opinion",
    "Not-a-security determination",
    "Issuer KYB verified",
    "AML program for property transactions",
  ],
  risks: [
    "Asset record tokens are jurisdiction-specific",
    "Token does not confer legal title without additional documentation",
    "Property value claims require independent appraisal",
    "No guaranteed liquidity or redemption",
  ],
  recommendedNextAction: "Complete real estate legal review before token design. Simulate on testnet only.",
};

// ─── Green-N-Go Solar ──────────────────────────────────────────────────────────

export const STELLAR_GNGS_ASSET: StellarAssetProfile = {
  id: "stellar-gngs-asset",
  displayName: "Green-N-Go Solar — Stellar Energy Credit",
  category: "energy_credit",
  stellarPrimitive: "asset",
  purpose: "Issue GNGS solar credit units on Stellar for energy credit tracking",
  issuerStatus: "draft",
  trustlineRequired: true,
  publicNetworkAllowedNow: false,
  executionMode: "simulation_only",
  complianceRequirements: [
    "Energy credit regulatory review",
    "Carbon/renewable credit standards compliance",
    "Issuer KYB verified",
    "No securities determination",
    "Counsel approval",
  ],
  risks: [
    "Energy credit classification varies by jurisdiction",
    "Credit value depends on underlying solar production",
    "No guaranteed redemption or market price",
  ],
  recommendedNextAction: "Obtain energy credit legal classification. Simulate on Stellar testnet.",
};

export const STELLAR_GNGS_LIQUIDITY_POOL: StellarLiquidityPoolProfile = {
  id: "stellar-gngs-liquidity-pool",
  displayName: "Green-N-Go Solar — Stellar Liquidity Pool (Simulation Only)",
  category: "energy_credit",
  stellarPrimitive: "liquidity_pool",
  purpose: "Simulate Stellar AMM liquidity pool for GNGS/XLM price discovery",
  issuerStatus: "draft",
  trustlineRequired: true,
  publicNetworkAllowedNow: false,
  executionMode: "simulation_only",
  complianceRequirements: [
    "LP regulatory review",
    "LP provider risk disclosures mandatory",
    "No guaranteed yield or return claims",
    "Market-making legal review",
  ],
  risks: [
    "AMM impermanent loss risk for LP providers",
    "Stellar AMM fee structure applies",
    "No guaranteed liquidity or fill",
    "Simulation results are not financial projections",
  ],
  recommendedNextAction: "Simulate LP pool dynamics only. No LP deposit until legal review complete.",
};

// ─── Mobile Medical Unit ───────────────────────────────────────────────────────

export const STELLAR_MMU_ASSET: StellarAssetProfile = {
  id: "stellar-mmu-asset",
  displayName: "Mobile Medical Unit — Stellar Service Record Token",
  category: "healthcare",
  stellarPrimitive: "asset",
  purpose: "Issue service record tokens on Stellar for mobile medical unit delivery proofs",
  issuerStatus: "draft",
  trustlineRequired: true,
  publicNetworkAllowedNow: false,
  executionMode: "simulation_only",
  complianceRequirements: [
    "HIPAA / healthcare privacy compliance review",
    "No PHI stored in token metadata",
    "Healthcare regulatory review by jurisdiction",
    "Issuer KYB verified",
    "Legal opinion on service record tokens",
  ],
  risks: [
    "Healthcare records on blockchain require strict privacy controls",
    "Token may not substitute for legal medical record",
    "Jurisdiction-specific healthcare data laws apply",
  ],
  recommendedNextAction: "Complete HIPAA compliance review. No PHI in metadata. Simulate on testnet only.",
};

// ─── Media / TV Access ────────────────────────────────────────────────────────

export const STELLAR_MEDIA_ASSET: StellarAssetProfile = {
  id: "stellar-media-asset",
  displayName: "Media / TV Access — Stellar Access Credential",
  category: "media",
  stellarPrimitive: "asset",
  purpose: "Issue access credential tokens on Stellar for media and content entitlements",
  issuerStatus: "draft",
  trustlineRequired: true,
  publicNetworkAllowedNow: false,
  executionMode: "simulation_only",
  complianceRequirements: [
    "Content licensing agreements verified",
    "DRM strategy reviewed",
    "Consumer protection compliance",
    "Issuer KYB verified",
  ],
  risks: [
    "Access credentials depend on issuer infrastructure",
    "Content licensing terms govern transferability",
    "No guaranteed content availability",
  ],
  recommendedNextAction: "Define access token metadata. Verify content licensing. Simulate on testnet.",
};

// ─── HOTRCW ────────────────────────────────────────────────────────────────────

export const STELLAR_HOTRCW_ASSET: StellarAssetProfile = {
  id: "stellar-hotrcw-asset",
  displayName: "HOTRCW — Stellar Utility/Service Credit",
  category: "utility",
  stellarPrimitive: "asset",
  purpose: "Issue HOTRCW utility credits on Stellar for service and utility redemption",
  issuerStatus: "draft",
  trustlineRequired: true,
  publicNetworkAllowedNow: false,
  executionMode: "simulation_only",
  complianceRequirements: [
    "Utility credit legal classification",
    "No securities determination",
    "Issuer KYB verified",
    "Counsel approval",
    "Board authorization",
  ],
  risks: [
    "Utility credit classification is jurisdiction-dependent",
    "Trustlines require issuer to be live",
    "No guaranteed redemption or utility delivery",
    "Service dependency risk",
  ],
  recommendedNextAction: "Define utility credit terms. Obtain legal classification. Simulate on Stellar testnet.",
};

export const STELLAR_HOTRCW_LIQUIDITY_POOL: StellarLiquidityPoolProfile = {
  id: "stellar-hotrcw-liquidity-pool",
  displayName: "HOTRCW — Stellar Liquidity Pool (Simulation Only)",
  category: "utility",
  stellarPrimitive: "liquidity_pool",
  purpose: "Simulate Stellar AMM liquidity pool for HOTRCW/XLM price discovery",
  issuerStatus: "draft",
  trustlineRequired: true,
  publicNetworkAllowedNow: false,
  executionMode: "simulation_only",
  complianceRequirements: [
    "LP regulatory review",
    "LP provider risk disclosures mandatory",
    "No guaranteed yield or return claims",
    "Market-making legal review",
  ],
  risks: [
    "AMM impermanent loss risk for LP providers",
    "Stellar liquidity pool fee structure applies",
    "No guaranteed liquidity or fill",
    "Simulation results are not financial projections",
  ],
  recommendedNextAction: "Simulate LP pool dynamics only. No LP deposit until legal review complete.",
};

// ─── Registry ─────────────────────────────────────────────────────────────────

export const STELLAR_ECOSYSTEM_REGISTRY: readonly StellarEcosystemEntry[] = [
  STELLAR_TSU_ISSUER,
  STELLAR_TSU_TRUSTLINE,
  STELLAR_TXC_ASSET,
  STELLAR_TXC_PATH_PAYMENT,
  STELLAR_TUNI_ASSET,
  STELLAR_REC_ASSET,
  STELLAR_GNGS_ASSET,
  STELLAR_GNGS_LIQUIDITY_POOL,
  STELLAR_MMU_ASSET,
  STELLAR_MEDIA_ASSET,
  STELLAR_HOTRCW_ASSET,
  STELLAR_HOTRCW_LIQUIDITY_POOL,
] as const;
