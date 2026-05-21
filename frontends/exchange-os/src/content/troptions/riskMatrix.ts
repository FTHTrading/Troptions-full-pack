/**
 * Troptions Risk Matrix
 * Per-asset, per-program, and per-route risk categories and severity.
 */

export type RiskCategory =
  | "regulatory"
  | "legal-classification"
  | "custody"
  | "reserve"
  | "liquidity"
  | "counterparty"
  | "technology"
  | "governance"
  | "market"
  | "compliance"
  | "reputational"
  | "operational";

export type RiskSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface RiskEntry {
  riskId: string;
  asset: string;
  category: RiskCategory;
  severity: RiskSeverity;
  description: string;
  mitigationRequired: string;
  currentMitigationStatus: string;
}

export const RISK_MATRIX: RiskEntry[] = [
  // ─── Troptions Pay ─────────────────────────────────────────────────────────
  {
    riskId: "RISK-TPAY-001",
    asset: "Troptions Pay",
    category: "counterparty",
    severity: "HIGH",
    description: "GivBux merchant network claim is unverified. No signed agreement. Merchant count inconsistency (480K vs 580K).",
    mitigationRequired: "Execute GivBux agreement. Verify and date-stamp merchant count.",
    currentMitigationStatus: "not-started",
  },
  {
    riskId: "RISK-TPAY-002",
    asset: "Troptions Pay",
    category: "regulatory",
    severity: "HIGH",
    description: "Payment token operations may require money-transmission licensing depending on jurisdiction and use case.",
    mitigationRequired: "Engage MSB/MTL counsel. Map licensing requirements per jurisdiction.",
    currentMitigationStatus: "not-started",
  },

  // ─── Troptions Gold ────────────────────────────────────────────────────────
  {
    riskId: "RISK-TGOLD-001",
    asset: "Troptions Gold",
    category: "reserve",
    severity: "CRITICAL",
    description: "No custody proof, vault receipt, or reserve schedule has been documented. Gold-backing claims are unverified.",
    mitigationRequired: "Execute vault custody agreement. Obtain assay certificates. Publish reserve schedule.",
    currentMitigationStatus: "not-started",
  },
  {
    riskId: "RISK-TGOLD-002",
    asset: "Troptions Gold",
    category: "legal-classification",
    severity: "HIGH",
    description: "Gold-backed tokens may be regulated as commodities (CFTC) or securities (SEC) depending on structure.",
    mitigationRequired: "Engage commodity and securities counsel. Obtain legal classification memo.",
    currentMitigationStatus: "not-started",
  },
  {
    riskId: "RISK-TGOLD-003",
    asset: "Troptions Gold",
    category: "compliance",
    severity: "HIGH",
    description: "Audit claim (CLAIM-AUDIT-001) has no supporting audit documentation. Creates reputational and legal exposure.",
    mitigationRequired: "Produce full audit report with auditor identity, methodology, exceptions, and remediation.",
    currentMitigationStatus: "not-started",
  },

  // ─── Troptions Unity / TUNITY ──────────────────────────────────────────────
  {
    riskId: "RISK-TUNITY-001",
    asset: "Troptions Unity (TUNITY)",
    category: "legal-classification",
    severity: "CRITICAL",
    description: "'Stable, asset-backed humanitarian token' claim requires reserve proof, redemption policy, legal classification, and charity governance. CoinMarketCap shows circulating supply as 0.",
    mitigationRequired: "Engage securities, stablecoin, and nonprofit counsel. Remove 'stable' and 'asset-backed' from public copy.",
    currentMitigationStatus: "not-started",
  },
  {
    riskId: "RISK-TUNITY-002",
    asset: "Troptions Unity (TUNITY)",
    category: "reserve",
    severity: "CRITICAL",
    description: "No reserve schedule, backing evidence, or redemption policy exists for the 'asset-backed' claim.",
    mitigationRequired: "Produce reserve schedule, custody proof, and redemption policy before any public use of asset-backed language.",
    currentMitigationStatus: "not-started",
  },

  // ─── QuantumXchange / Exchange ─────────────────────────────────────────────
  {
    riskId: "RISK-EXCH-001",
    asset: "QuantumXchange Exchange Initiative",
    category: "regulatory",
    severity: "CRITICAL",
    description: "'World's first full-service crypto exchange' claim. Operating an exchange requires licensing (broker-dealer, ATS, MTL, or local equivalents). No licensing analysis has been documented.",
    mitigationRequired: "Engage exchange/ATS counsel. Determine licensing pathway. Remove exchange claim from public materials until licensed.",
    currentMitigationStatus: "not-started",
  },

  // ─── SALP / RWA ────────────────────────────────────────────────────────────
  {
    riskId: "RISK-SALP-001",
    asset: "SALP / RWA Program",
    category: "legal-classification",
    severity: "CRITICAL",
    description: "'Liquid digital tokens that can be traded' claim for RWA tokens. Without legal classification, transfer restrictions, and market-access approval, this creates securities and commodities law exposure.",
    mitigationRequired: "Engage RWA and securities counsel. Define legal classification, transfer restrictions, and investor eligibility before tokenizing any asset.",
    currentMitigationStatus: "not-started",
  },
  {
    riskId: "RISK-SALP-002",
    asset: "SALP / RWA Program",
    category: "custody",
    severity: "HIGH",
    description: "No custody infrastructure has been established for tokenized assets.",
    mitigationRequired: "Execute custody agreements for each asset class before tokenization.",
    currentMitigationStatus: "not-started",
  },

  // ─── Stable Units ──────────────────────────────────────────────────────────
  {
    riskId: "RISK-STABLE-001",
    asset: "Troptions Internal Stable Units",
    category: "regulatory",
    severity: "CRITICAL",
    description: "Publicly representing closed-loop accounting units as stablecoins or money requires money-transmission licensing and stablecoin legal analysis.",
    mitigationRequired: "Do not market internal units as stablecoins or money until licensed. Engage stablecoin and MTL counsel.",
    currentMitigationStatus: "not-started",
  },

  // ─── Governance ────────────────────────────────────────────────────────────
  {
    riskId: "RISK-GOV-001",
    asset: "All Assets",
    category: "governance",
    severity: "HIGH",
    description: "No documented board governance structure, approval workflows, or key custodian assignments have been established.",
    mitigationRequired: "Establish board governance structure. Document approval workflows. Assign key custodians. Create board register.",
    currentMitigationStatus: "not-started",
  },
];

export function getRiskByAsset(assetName: string): RiskEntry[] {
  return RISK_MATRIX.filter((r) =>
    r.asset.toLowerCase().includes(assetName.toLowerCase()),
  );
}

export function getCriticalRisks(): RiskEntry[] {
  return RISK_MATRIX.filter((r) => r.severity === "CRITICAL");
}

export function getUnmitigatedRisks(): RiskEntry[] {
  return RISK_MATRIX.filter((r) => r.currentMitigationStatus === "not-started");
}
