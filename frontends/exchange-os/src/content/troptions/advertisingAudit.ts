/**
 * Troptions Advertising Audit
 * Full table mapping original public claims to problems, rewrites, and status.
 */

export interface AdvertisingAuditEntry {
  auditId: string;
  source: string;
  originalCopy: string;
  problems: string[];
  institutionalRewrite: string;
  requiredEvidence: string[];
  disclosureRequired: string;
  publishStatus: "blocked" | "pending-review" | "approved" | "rejected";
  linkedClaimIds: string[];
  linkedRiskRuleIds: string[];
}

export const ADVERTISING_AUDIT: AdvertisingAuditEntry[] = [
  {
    auditId: "ADV-001",
    source: "troptions.gold website",
    originalCopy: "Troptions Gold is accepted at over 580,000 merchants worldwide",
    problems: [
      "No signed GivBux agreement documented",
      "Inconsistent with 480K figure on another Troptions page",
      "Count is undated and unverified",
      "Merchant coverage depends on third-party provider, not Troptions directly",
    ],
    institutionalRewrite: "Troptions Pay is designed to connect to merchant payment networks via third-party payment rail providers. Merchant acceptance coverage is subject to provider coverage, counterparty acceptance, geographic restrictions, and category eligibility. Current verified merchant coverage data is pending provider agreement execution.",
    requiredEvidence: [
      "Signed GivBux integration agreement",
      "Verified, dated merchant count from GivBux",
      "Reconciliation of 480K vs 580K figures",
    ],
    disclosureRequired: "Merchant acceptance disclaimer (DISCLAIMERS.MERCHANT)",
    publishStatus: "blocked",
    linkedClaimIds: ["CLAIM-MERCHANT-001", "CLAIM-MERCHANT-002"],
    linkedRiskRuleIds: [],
  },
  {
    auditId: "ADV-002",
    source: "troptions.gold website",
    originalCopy: "Troptions Gold is the world's first full-service crypto exchange",
    problems: [
      "'World's first' — unverifiable superlative",
      "'Full-service crypto exchange' implies licensed exchange operations which require regulatory approval",
      "No QuantumXchange signed agreement documented",
      "No exchange license analysis performed",
    ],
    institutionalRewrite: "QuantumXchange is an announced exchange infrastructure initiative. The development of exchange capabilities is subject to licensing analysis and regulatory approval in applicable jurisdictions. No exchange services are currently being offered.",
    requiredEvidence: [
      "QuantumXchange signed agreement or partnership documentation",
      "Exchange licensing analysis memo",
      "Regulatory approval or exemption analysis",
    ],
    disclosureRequired: "Exchange disclaimer (DISCLAIMERS.EXCHANGE) + Jurisdiction disclaimer",
    publishStatus: "blocked",
    linkedClaimIds: ["CLAIM-EXCHANGE-001"],
    linkedRiskRuleIds: ["RLANG-010", "RLANG-019"],
  },
  {
    auditId: "ADV-003",
    source: "troptions.gold / TUNITY materials",
    originalCopy: "Troptions Unity is a stable, asset-backed humanitarian token",
    problems: [
      "'Stable token' — stablecoin classification requires licensing",
      "'Asset-backed' — requires reserve schedule, custody proof, and legal opinion",
      "'Humanitarian token' — requires charity governance and legal classification",
      "CoinMarketCap shows circulating supply as 0",
    ],
    institutionalRewrite: "Troptions Unity (TUNITY) is a Solana-based utility token positioned for social-impact and ecosystem participation programs. Token mechanics, reserve policy, and legal classification are subject to ongoing legal and compliance review.",
    requiredEvidence: [
      "Reserve schedule",
      "Custody proof",
      "Legal classification memo",
      "If humanitarian: charity governance documentation",
    ],
    disclosureRequired: "Asset disclaimer + Stable unit disclaimer (DISCLAIMERS.STABLE_UNIT)",
    publishStatus: "blocked",
    linkedClaimIds: ["CLAIM-UNITY-001"],
    linkedRiskRuleIds: ["RLANG-014", "RLANG-015"],
  },
  {
    auditId: "ADV-004",
    source: "Troptions SALP materials",
    originalCopy: "SALP allows businesses to tokenize assets as liquid digital tokens that can be traded",
    problems: [
      "'Liquid digital tokens that can be traded' — presupposes market access that has not been established",
      "No legal classification for tokenized RWA",
      "No transfer restrictions documented",
      "No exchange or ATS license for secondary trading",
    ],
    institutionalRewrite: "SALP processes real-world asset documentation through intake, custody, legal classification, and tokenization workflows. Tokenized assets are subject to transfer restrictions, investor eligibility requirements, and market-access approval. Secondary trading requires separate exchange or ATS regulatory analysis.",
    requiredEvidence: [
      "First asset through full SALP intake",
      "Legal classification memo for each asset class",
      "Transfer restriction documentation",
      "Market-access license or exemption analysis",
    ],
    disclosureRequired: "RWA disclaimer (DISCLAIMERS.RWA)",
    publishStatus: "blocked",
    linkedClaimIds: ["CLAIM-SALP-001"],
    linkedRiskRuleIds: ["RLANG-005"],
  },
  {
    auditId: "ADV-005",
    source: "Troptions institutional materials",
    originalCopy: "Troptions tokens enhance corporate balance sheets",
    problems: [
      "'Balance sheet enhancement' — accounting treatment requires independent CPA analysis",
      "This phrase implies an accounting conclusion that has not been verified",
      "Creates liability if token does not receive favorable accounting treatment",
    ],
    institutionalRewrite: "The potential accounting treatment of Troptions tokens as balance-sheet assets is subject to independent CPA or auditor review and applicable financial reporting standards. No accounting treatment is guaranteed.",
    requiredEvidence: [
      "Independent CPA analysis",
      "Accounting opinion letter",
    ],
    disclosureRequired: "Forward-looking disclaimer + Master disclaimer",
    publishStatus: "blocked",
    linkedClaimIds: ["CLAIM-BALANCE-001"],
    linkedRiskRuleIds: ["RLANG-008", "RLANG-009"],
  },
  {
    auditId: "ADV-006",
    source: "troptions.gold website",
    originalCopy: "Fueling Business Without Cash",
    problems: [
      "No critical legal issues. Accurately describes barter/utility functionality.",
      "Should include barter tax disclosure on all associated pages.",
    ],
    institutionalRewrite: "Fueling Business Without Cash — Troptions enables non-cash exchange of value between consenting parties. Barter transactions may be taxable events under applicable law.",
    requiredEvidence: ["Barter tax disclosure included on all associated pages"],
    disclosureRequired: "Barter disclaimer (DISCLAIMERS.BARTER)",
    publishStatus: "pending-review",
    linkedClaimIds: ["CLAIM-BRAND-001"],
    linkedRiskRuleIds: [],
  },
  {
    auditId: "ADV-007",
    source: "Troptions.Gold audit claim",
    originalCopy: "Troptions Gold has been audited",
    problems: [
      "No audit report has been provided or published",
      "Audit scope, auditor identity, and findings are unknown",
      "If exceptions or reservations exist, they must be disclosed",
    ],
    institutionalRewrite: "Troptions Gold has a pending audit program. Audit scope, methodology, auditor identity, findings, exceptions, and remediation status will be disclosed upon completion of the audit process.",
    requiredEvidence: [
      "Full audit report",
      "Auditor identity and qualifications",
      "Audit scope and methodology",
      "Exceptions and remediation status",
    ],
    disclosureRequired: "Audit disclaimer (DISCLAIMERS.AUDIT)",
    publishStatus: "blocked",
    linkedClaimIds: ["CLAIM-AUDIT-001"],
    linkedRiskRuleIds: [],
  },
];

export function getBlockedAdvertisingItems(): AdvertisingAuditEntry[] {
  return ADVERTISING_AUDIT.filter((a) => a.publishStatus === "blocked");
}

export function getApprovedAdvertisingItems(): AdvertisingAuditEntry[] {
  return ADVERTISING_AUDIT.filter((a) => a.publishStatus === "approved");
}
