/**
 * Legacy Bitcoin Holder Audit Types
 * 
 * Kevan BTC Wallet Analysis - 2026-04-26
 * - Asset records from TROPTIONS.GOLD and XTROPTIONS.GOLD historic issuance
 * - Provenance verification (currently UNVERIFIED)
 * - NO REDEMPTION CLAIMS for BTC custody
 * - Research + documentation only
 */

export type BitcoinAuditStatus =
  | "RESEARCH_ONLY"
  | "UNVERIFIED_VALUATION"
  | "UNVERIFIED_PROVENANCE"
  | "PENDING_EVIDENCE"
  | "VERIFIED";

export type AssetChain = "xrpl" | "stellar" | "bitcoin" | "internal";

export interface LegacyGoldAssetRecord {
  /** Asset name (XTROPTIONS.GOLD or TROPTIONS.GOLD) */
  name: string;

  /** Chain where originally recorded */
  chain: AssetChain;

  /** XRPL Asset ID or equivalent */
  assetId?: string;

  /** Total supply reported at issuance */
  supply: string;

  /** Issuer/Source wallet */
  issuer: string;

  /** Current audit status */
  status: BitcoinAuditStatus;

  /** Last update timestamp */
  lastUpdated: string;

  /** Market cap at time of claim (REFERENCE ONLY — UNVERIFIED) */
  referencePricing?: {
    pricePerUnit: string;
    totalMarketCap: string;
    timestamp: string;
    source: string;
    disclaimer: string;
  };

  /** Holder evidence (requires external verification) */
  holderProof?: {
    walletAddress: string;
    chain: AssetChain;
    balanceReported: string;
    verificationUrl?: string;
    status: "UNVERIFIED" | "PENDING" | "VERIFIED";
  }[];

  /** Provenance chain (Kevan BTC custody record) */
  provenanceChain?: string[];

  /** Warnings + disclaimers */
  disclaimers: string[];
}

export interface LegacyBtcHolderAuditSummary {
  /** Timestamp of audit run */
  auditTimestamp: string;

  /** Number of distinct holders identified */
  holderCount: number;

  /** Total supply across all legacy assets */
  totalLegacySupply: string;

  /** Total market cap at reference pricing (UNVERIFIED) */
  referenceTotalMarketCap: string;

  /** Legacy assets included */
  assets: LegacyGoldAssetRecord[];

  /** Common issuer (1LSqksKgmUh1TDMoAxLAQSNcwnfgkzCRP6) */
  commonIssuer: string;

  /** Status of Kevan wallet analysis */
  kevanWalletAnalysis: {
    status: "PENDING" | "RESEARCH_ONLY" | "BLOCKED";
    reason: string;
  };

  /** Safety disclaimer */
  disclaimer: string;
}

export interface LegacyBtcHolderRecord {
  /** Unique wallet address */
  address: string;

  /** Chain (bitcoin, xrpl, stellar) */
  chain: AssetChain;

  /** Assets held and quantities */
  assetHoldings: {
    assetName: string;
    quantity: string;
    chain: AssetChain;
    lastVerified?: string;
  }[];

  /** Holder verification status */
  verificationStatus: "UNVERIFIED" | "PENDING_EVIDENCE" | "VERIFIED";

  /** Holder type (personal, institutional, custodian, lost) */
  holderType?: "personal" | "institutional" | "custodian" | "lost" | "unknown";

  /** Notes from audit */
  notes?: string;

  /** Last checked timestamp */
  lastAuditedAt: string;
}
