/**
 * Legacy Bitcoin Holder Audit Engine
 * 
 * Functions for analyzing TROPTIONS.GOLD and XTROPTIONS.GOLD historic holdings.
 * NO LIVE BTC CUSTODY CLAIMS.
 * All values are UNVERIFIED REFERENCE ONLY.
 */

import type {
  LegacyGoldAssetRecord,
  LegacyBtcHolderAuditSummary,
  BitcoinAuditStatus,
} from "./types";

/** Legacy TROPTIONS gold assets — seeded from TokenScan historical data */
export const LEGACY_GOLD_ASSETS: LegacyGoldAssetRecord[] = [
  {
    name: "XTROPTIONS.GOLD",
    chain: "xrpl",
    assetId: "A7653053619000933582",
    supply: "10000000000", // 10B
    issuer: "1LSqksKgmUh1TDMoAxLAQSNcwnfgkzCRP6",
    status: "UNVERIFIED_VALUATION",
    lastUpdated: "2026-04-26T00:00:00Z",
    referencePricing: {
      pricePerUnit: "0.000000001", // 1 sat per unit (illustrative)
      totalMarketCap: "10000000", // 0.1 BTC equivalent
      timestamp: "2026-04-26T00:00:00Z",
      source: "REFERENCE_ONLY_—_NO_EXTERNAL_VALIDATION",
      disclaimer:
        "This pricing is historical reference only. No redemption claims. No BTC custody claims. For research purposes only.",
    },
    disclaimers: [
      "RESEARCH_ONLY — no live redemption enabled",
      "Valuation UNVERIFIED — requires external audit",
      "No proof of BTC custody or backing",
      "Historical asset record for provenance tracking",
      "Holder audit is documentation exercise, not financial claim",
    ],
  },
  {
    name: "TROPTIONS.GOLD",
    chain: "stellar",
    assetId: "A9170398405421512794",
    supply: "180000000", // 180M
    issuer: "1LSqksKgmUh1TDMoAxLAQSNcwnfgkzCRP6",
    status: "UNVERIFIED_VALUATION",
    lastUpdated: "2026-04-26T00:00:00Z",
    referencePricing: {
      pricePerUnit: "0.00000001", // 1 sat per 10 units (illustrative)
      totalMarketCap: "1800000", // 0.018 BTC equivalent
      timestamp: "2026-04-26T00:00:00Z",
      source: "REFERENCE_ONLY_—_NO_EXTERNAL_VALIDATION",
      disclaimer:
        "This pricing is historical reference only. No redemption claims. No BTC custody claims. For research purposes only.",
    },
    disclaimers: [
      "RESEARCH_ONLY — no live redemption enabled",
      "Valuation UNVERIFIED — requires external audit",
      "No proof of BTC custody or backing",
      "Historical asset record for provenance tracking",
      "Holder audit is documentation exercise, not financial claim",
    ],
  },
];

/** Kevan's known Bitcoin addresses (placeholder for audit) */
export const KEVAN_BITCOIN_WALLETS: { address: string; type: string; status: string }[] = [
  {
    address: "1LSqksKgmUh1TDMoAxLAQSNcwnfgkzCRP6",
    type: "TROPTIONS issuer (legacy GOLD issuance)",
    status: "RESEARCH_ONLY",
  },
];

/**
 * Create baseline audit summary for legacy gold assets
 */
export function createLegacyBtcHolderAuditSummary(): LegacyBtcHolderAuditSummary {
  // Sum supplies as strings (BigInt arithmetic deferred to UI)
  let totalSupply = "0";
  let totalMarketCap = "0";

  for (const asset of LEGACY_GOLD_ASSETS) {
    try {
      totalSupply = (BigInt(totalSupply) + BigInt(asset.supply)).toString();
    } catch {
      totalSupply = asset.supply;
    }
    if (asset.referencePricing) {
      try {
        totalMarketCap = (BigInt(totalMarketCap) + BigInt(asset.referencePricing.totalMarketCap)).toString();
      } catch {
        totalMarketCap = asset.referencePricing.totalMarketCap;
      }
    }
  }

  return {
    auditTimestamp: new Date().toISOString(),
    holderCount: 0, // TBD: requires external TokenScan query
    totalLegacySupply: totalSupply,
    referenceTotalMarketCap: totalMarketCap,
    assets: LEGACY_GOLD_ASSETS,
    commonIssuer: "1LSqksKgmUh1TDMoAxLAQSNcwnfgkzCRP6",
    kevanWalletAnalysis: {
      status: "RESEARCH_ONLY",
      reason:
        "Bitcoin holder audit is documentation + provenance tracking only. No live claims or redemptions enabled.",
    },
    disclaimer:
      "This audit is for historical research and provenance documentation only. " +
      "All valuations are UNVERIFIED REFERENCE ONLY. " +
      "NO REDEMPTION CLAIMS enabled. " +
      "NO BTC CUSTODY CLAIMS. " +
      "All amounts are estimates requiring external verification.",
  };
}

/**
 * Classify audit status with reasoning
 */
export function classifyBitcoinAuditStatus(
  assetName: string
): { status: BitcoinAuditStatus; reasons: string[] } {
  const reasons: string[] = [];
  let status: BitcoinAuditStatus = "RESEARCH_ONLY";

  if (assetName.includes("TROPTIONS.GOLD") || assetName.includes("XTROPTIONS.GOLD")) {
    reasons.push("Legacy asset from TROPTIONS historic issuance");
    reasons.push("No live redemption claims enabled");
    reasons.push("Valuation requires external verification");
    reasons.push("Provenance tracking only");
    status = "UNVERIFIED_VALUATION";
  }

  reasons.push("Research-only documentation for compliance audit trails");

  return { status, reasons };
}

/**
 * Generate audit disclaimer (safety-first language)
 */
export function generateAuditDisclaimer(): string {
  return `
LEGACY BITCOIN HOLDER AUDIT — RESEARCH & DOCUMENTATION ONLY

This audit examines historic TROPTIONS.GOLD and XTROPTIONS.GOLD asset records
for provenance tracking and compliance documentation purposes.

CRITICAL DISCLAIMERS:
1. NO REDEMPTION CLAIMS ENABLED — Legacy assets are historical records only
2. NO BTC CUSTODY CLAIMS — No Bitcoin backing claims or guarantees
3. UNVERIFIED VALUATION — All market cap and pricing is reference-only
4. RESEARCH ONLY — This is documentation for audit trails, not financial claims
5. NO LIVE EXECUTION — Holder audit does not trigger transfers or settlements

This audit will be extended when:
- External TokenScan API integration provides verified holder data
- Kevan provides explicit authorization for wallet analysis
- Legal review confirms provenance documentation scope

Until verified, treat all holdings and valuations as UNVERIFIED REFERENCE ONLY.
`;
}

/**
 * Fetch Kevan wallet analysis status (TBD: external API integration)
 */
export async function getKevanWalletAnalysisStatus(): Promise<{
  status: "PENDING" | "RESEARCH_ONLY" | "BLOCKED";
  reason: string;
  lastUpdated: string;
}> {
  // Placeholder: Real implementation would call TokenScan API
  // or external BTC blockchain explorers
  return {
    status: "RESEARCH_ONLY",
    reason:
      "Kevan wallet audit is on hold pending external API integration and legal authorization",
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Generate evidence requirements checklist for Bitcoin audit
 */
export function getAuditEvidenceRequirements(): {
  item: string;
  status: "PENDING" | "BLOCKED" | "RESEARCH_ONLY";
  nextStep?: string;
}[] {
  return [
    {
      item: "TokenScan API integration (fetch holder data)",
      status: "PENDING",
      nextStep:
        "Request TokenScan API key; implement scripts/troptions/fetch-legacy-btc-holder-audit.mjs",
    },
    {
      item: "Kevan wallet authorization (explicit consent for analysis)",
      status: "BLOCKED",
      nextStep:
        "Kevan must approve wallet analysis scope; document in docs/troptions/legacy-btc-holder-audit/01-audit-authorization.md",
    },
    {
      item: "Bitcoin mainnet holder snapshot (UTXO set for XTROPTIONS/TROPTIONS.GOLD addresses)",
      status: "PENDING",
      nextStep: "Query blockchain explorer API for address balances and transaction history",
    },
    {
      item: "Valuation audit (verify market cap claims)",
      status: "RESEARCH_ONLY",
      nextStep:
        "Cross-reference historic pricing against CoinGecko / CoinMarketCap archives",
    },
    {
      item: "Provenance documentation (trace asset creation + early distributions)",
      status: "RESEARCH_ONLY",
      nextStep: "Collect historic XRPL ledger records and Stellar transaction history",
    },
    {
      item: "Legal disclaimer approval (ensure research-only framing)",
      status: "PENDING",
      nextStep: "Submit docs/troptions/legacy-btc-holder-audit/ to legal review",
    },
  ];
}
