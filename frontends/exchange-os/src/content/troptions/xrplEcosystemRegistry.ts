/**
 * XRPL Ecosystem Registry
 *
 * Defines XRPL profiles for all Troptions business units.
 *
 * SAFETY RULES:
 * - nftMintingAllowedNow: false (all entries)
 * - liveMainnetAllowedNow: false (all entries)
 * - All entries are simulation_only or disabled by default
 * - No private keys, seeds, or secrets
 */

import type {
  XrplIssuerProfile,
  XrplTrustlineAsset,
  XrplNftProfile,
  XrplDexRoute,
  XrplAmmPoolProfile,
  XrplEcosystemEntry,
} from "@/lib/troptions/xrpl-stellar/xrplStellarTypes";

// ─── Troptions Settlement Unit ─────────────────────────────────────────────────

export const XRPL_TSU_ISSUER: XrplIssuerProfile = {
  id: "xrpl-tsu-issuer",
  displayName: "Troptions Settlement Unit — XRPL Issuer",
  category: "settlement",
  xrplPrimitive: "issuer_profile",
  purpose: "Issue TSU as an XRPL IOU for settlement and redemption workflows",
  issuerStatus: "draft",
  trustlineRequired: true,
  nftMintingAllowedNow: false,
  liveMainnetAllowedNow: false,
  executionMode: "simulation_only",
  complianceRequirements: [
    "Legal entity KYB verified",
    "Issuer account configured on testnet",
    "Freeze authority set",
    "Clawback authority evaluated",
    "Counsel approval for issuance",
    "Board authorization",
  ],
  risks: [
    "IOU trustline holders bear issuer risk",
    "Freeze authority can lock holder balances",
    "Redemption not guaranteed without liquidity",
  ],
  recommendedNextAction: "Complete KYB and legal review. Configure issuer account on testnet.",
};

export const XRPL_TSU_TRUSTLINE: XrplTrustlineAsset = {
  id: "xrpl-tsu-trustline",
  displayName: "Troptions Settlement Unit — XRPL Trustline",
  category: "settlement",
  xrplPrimitive: "trustline_asset",
  purpose: "Holder trustline for TSU IOU on XRPL",
  issuerStatus: "draft",
  trustlineRequired: true,
  nftMintingAllowedNow: false,
  liveMainnetAllowedNow: false,
  executionMode: "simulation_only",
  complianceRequirements: [
    "Holder KYC/KYB verified",
    "Trustline creation approved by operator",
    "Issuer account live on testnet",
    "Travel Rule compliance reviewed",
  ],
  risks: [
    "Holder must establish trustline before receiving TSU",
    "Issuer freeze risk applies",
    "No guaranteed liquidity",
  ],
  recommendedNextAction: "Simulate trustline creation on testnet after issuer is configured.",
};

// ─── Troptions Xchange ─────────────────────────────────────────────────────────

export const XRPL_TXC_ISSUER: XrplIssuerProfile = {
  id: "xrpl-txc-issuer",
  displayName: "Troptions Xchange — XRPL Issuer",
  category: "exchange",
  xrplPrimitive: "issuer_profile",
  purpose: "Issue TXC as an XRPL IOU representing exchange credit/value",
  issuerStatus: "draft",
  trustlineRequired: true,
  nftMintingAllowedNow: false,
  liveMainnetAllowedNow: false,
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

export const XRPL_TXC_DEX: XrplDexRoute = {
  id: "xrpl-txc-dex",
  displayName: "Troptions Xchange — XRPL DEX Route",
  category: "exchange",
  xrplPrimitive: "dex_route",
  purpose: "Simulate TXC/XRP DEX offer routes for price discovery",
  issuerStatus: "draft",
  trustlineRequired: true,
  nftMintingAllowedNow: false,
  liveMainnetAllowedNow: false,
  executionMode: "simulation_only",
  complianceRequirements: [
    "Issuer account live",
    "DEX participant KYC/KYB",
    "Market-making legal review",
    "No wash trading controls",
  ],
  risks: [
    "DEX offer slippage and front-running risk",
    "Liquidity may be insufficient",
    "No guaranteed fill",
    "No guaranteed price",
  ],
  recommendedNextAction: "Simulate DEX route quotes only. No live offers until legal and issuer reviews complete.",
};

// ─── Troptions University ──────────────────────────────────────────────────────

export const XRPL_TUNI_NFT: XrplNftProfile = {
  id: "xrpl-tuni-nft",
  displayName: "Troptions University — XRPL NFT Credential",
  category: "credential",
  xrplPrimitive: "nft",
  purpose: "Issue XLS-20 NFT credentials for course completion and certifications",
  issuerStatus: "draft",
  trustlineRequired: false,
  nftMintingAllowedNow: false,
  liveMainnetAllowedNow: false,
  executionMode: "simulation_only",
  complianceRequirements: [
    "Issuer account configured",
    "Credential metadata standards defined",
    "NFT royalty structure approved",
    "Legal review of credential validity",
  ],
  risks: [
    "NFT credentials may not have legal recognition in all jurisdictions",
    "Minting gas costs on XRPL",
    "Metadata permanence strategy required",
  ],
  recommendedNextAction: "Define credential metadata schema. Simulate NFT mint on testnet.",
};

// ─── Real Estate Connections ───────────────────────────────────────────────────

export const XRPL_REC_NFT: XrplNftProfile = {
  id: "xrpl-rec-nft",
  displayName: "Real Estate Connections — XRPL Asset Record NFT",
  category: "real_estate",
  xrplPrimitive: "nft",
  purpose: "Issue NFTs representing asset record proofs for real estate transactions",
  issuerStatus: "draft",
  trustlineRequired: false,
  nftMintingAllowedNow: false,
  liveMainnetAllowedNow: false,
  executionMode: "simulation_only",
  complianceRequirements: [
    "Real estate regulatory review by jurisdiction",
    "Title/deed legal opinion",
    "NFT not a security determination",
    "Issuer KYB verified",
    "AML program for property transactions",
  ],
  risks: [
    "Real estate asset records are jurisdiction-specific",
    "NFT does not confer legal title without additional documentation",
    "Property value claims require independent appraisal",
    "No guaranteed liquidity or redemption",
  ],
  recommendedNextAction: "Complete real estate legal review before NFT design. Simulate on testnet only.",
};

// ─── Green-N-Go Solar ──────────────────────────────────────────────────────────

export const XRPL_GNGS_TRUSTLINE: XrplTrustlineAsset = {
  id: "xrpl-gngs-trustline",
  displayName: "Green-N-Go Solar — XRPL Credit Trustline",
  category: "energy_credit",
  xrplPrimitive: "trustline_asset",
  purpose: "Issue GNGS as an XRPL IOU representing solar energy credit units",
  issuerStatus: "draft",
  trustlineRequired: true,
  nftMintingAllowedNow: false,
  liveMainnetAllowedNow: false,
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
    "IOU holder bears issuer freeze risk",
  ],
  recommendedNextAction: "Obtain energy credit legal classification. Simulate trustline on testnet.",
};

// ─── Mobile Medical Unit ───────────────────────────────────────────────────────

export const XRPL_MMU_NFT: XrplNftProfile = {
  id: "xrpl-mmu-nft",
  displayName: "Mobile Medical Unit — XRPL Service Record NFT",
  category: "healthcare",
  xrplPrimitive: "nft",
  purpose: "Issue NFTs representing service delivery proofs for mobile medical units",
  issuerStatus: "draft",
  trustlineRequired: false,
  nftMintingAllowedNow: false,
  liveMainnetAllowedNow: false,
  executionMode: "simulation_only",
  complianceRequirements: [
    "HIPAA / healthcare privacy compliance review",
    "No PHI stored in NFT metadata",
    "Healthcare regulatory review by jurisdiction",
    "Issuer KYB verified",
    "Legal opinion on service record NFTs",
  ],
  risks: [
    "Healthcare records on blockchain require strict privacy controls",
    "NFT may not substitute for legal medical record",
    "Jurisdiction-specific healthcare data laws apply",
  ],
  recommendedNextAction: "Complete HIPAA compliance review. No PHI in metadata. Simulate on testnet only.",
};

// ─── Media / TV Access ────────────────────────────────────────────────────────

export const XRPL_MEDIA_NFT: XrplNftProfile = {
  id: "xrpl-media-nft",
  displayName: "Media / TV Access — XRPL Access Credential NFT",
  category: "media",
  xrplPrimitive: "nft",
  purpose: "Issue NFTs representing media access credentials and content entitlements",
  issuerStatus: "draft",
  trustlineRequired: false,
  nftMintingAllowedNow: false,
  liveMainnetAllowedNow: false,
  executionMode: "simulation_only",
  complianceRequirements: [
    "Content licensing agreements verified",
    "DRM strategy reviewed",
    "Consumer protection compliance",
    "Issuer KYB verified",
  ],
  risks: [
    "NFT access credentials depend on issuer infrastructure",
    "Content licensing terms govern transferability",
    "No guaranteed content availability",
  ],
  recommendedNextAction: "Define access credential metadata. Verify content licensing. Simulate on testnet.",
};

// ─── HOTRCW ────────────────────────────────────────────────────────────────────

export const XRPL_HOTRCW_TRUSTLINE: XrplTrustlineAsset = {
  id: "xrpl-hotrcw-trustline",
  displayName: "HOTRCW — XRPL Utility/Service Credit Trustline",
  category: "utility",
  xrplPrimitive: "trustline_asset",
  purpose: "Issue HOTRCW as an XRPL IOU representing utility and service credits",
  issuerStatus: "draft",
  trustlineRequired: true,
  nftMintingAllowedNow: false,
  liveMainnetAllowedNow: false,
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
    "Holder trustlines require issuer to be live",
    "No guaranteed redemption or utility delivery",
    "Service dependency risk",
  ],
  recommendedNextAction: "Define utility credit terms. Obtain legal classification. Simulate on testnet.",
};

export const XRPL_HOTRCW_AMM: XrplAmmPoolProfile = {
  id: "xrpl-hotrcw-amm",
  displayName: "HOTRCW — XRPL AMM Pool (Simulation Only)",
  category: "utility",
  xrplPrimitive: "amm_pool",
  purpose: "Simulate AMM liquidity pool for HOTRCW/XRP price discovery",
  issuerStatus: "draft",
  trustlineRequired: true,
  nftMintingAllowedNow: false,
  liveMainnetAllowedNow: false,
  executionMode: "simulation_only",
  complianceRequirements: [
    "AMM pool regulatory review",
    "LP provider risk disclosures mandatory",
    "No guaranteed yield or return",
    "Market-making legal review",
  ],
  risks: [
    "AMM impermanent loss risk for LP providers",
    "XRPL AMM fee structure applies",
    "No guaranteed liquidity or fill",
    "Simulation results are not financial projections",
  ],
  recommendedNextAction: "Simulate AMM pool dynamics only. No LP deposit until legal and issuer review complete.",
};

// ─── Registry ─────────────────────────────────────────────────────────────────

export const XRPL_ECOSYSTEM_REGISTRY: readonly XrplEcosystemEntry[] = [
  XRPL_TSU_ISSUER,
  XRPL_TSU_TRUSTLINE,
  XRPL_TXC_ISSUER,
  XRPL_TXC_DEX,
  XRPL_TUNI_NFT,
  XRPL_REC_NFT,
  XRPL_GNGS_TRUSTLINE,
  XRPL_MMU_NFT,
  XRPL_MEDIA_NFT,
  XRPL_HOTRCW_TRUSTLINE,
  XRPL_HOTRCW_AMM,
] as const;
