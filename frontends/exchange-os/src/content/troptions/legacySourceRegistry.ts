export type LegacySourceType =
  | "official"
  | "third-party"
  | "social"
  | "media"
  | "whitepaper"
  | "partner"
  | "historical"
  | "needs-verification";

export type InstitutionalUseStatus =
  | "approved-for-institutional-use"
  | "needs-verification"
  | "legally-sensitive"
  | "outdated-legacy"
  | "blocked-until-evidence";

export type VerificationStatus =
  | "verified"
  | "pending-verification"
  | "conflicting-sources"
  | "blocked";

export type RiskLevel = "low" | "medium" | "high";

export interface LegacySourceRecord {
  sourceId: string;
  title: string;
  sourceType: LegacySourceType;
  url: string;
  dateObserved: string;
  summary: string;
  claimsExtracted: readonly string[];
  institutionalUseStatus: InstitutionalUseStatus;
  verificationStatus: VerificationStatus;
  riskLevel: RiskLevel;
  requiredEvidence: readonly string[];
  approvedInstitutionalLanguage: string;
  blockedLanguage: readonly string[];
  notes: string;
}

export const LEGACY_SOURCE_REGISTRY: readonly LegacySourceRecord[] = [
  {
    sourceId: "SRC-OFFICIAL-HOME-2003",
    title: "Troptions Official Home",
    sourceType: "official",
    url: "https://www.troptions.org/home?utm_source=chatgpt.com",
    dateObserved: "2026-04-25",
    summary:
      "Public positioning describes Troptions as founded in 2003 with barter and trade utility orientation.",
    claimsExtracted: [
      "Founded in 2003",
      "Digital value ecosystem",
      "Barter and trade utility framing",
    ],
    institutionalUseStatus: "needs-verification",
    verificationStatus: "pending-verification",
    riskLevel: "medium",
    requiredEvidence: [
      "Corporate formation records",
      "Archived product release timeline",
      "Independent date and entity validation",
    ],
    approvedInstitutionalLanguage:
      "Public Troptions materials describe a 2003 start date and barter-first digital utility orientation. Institutional publication requires documentary corroboration.",
    blockedLanguage: [
      "proven beyond dispute",
      "globally accepted since launch",
    ],
    notes: "Founding-year references are historical claims and should stay source-dated.",
  },
  {
    sourceId: "SRC-OFFICIAL-ABOUT-ECOSYSTEM",
    title: "Troptions Official About",
    sourceType: "official",
    url: "https://www.troptions.org/about?utm_source=chatgpt.com",
    dateObserved: "2026-04-25",
    summary:
      "Describes ecosystem branches including Troptions Pay, Troptions Unity, and RWA-related positioning.",
    claimsExtracted: [
      "Troptions Pay branch",
      "Troptions Unity on Solana positioning",
      "RWA and smart-contract language",
    ],
    institutionalUseStatus: "needs-verification",
    verificationStatus: "pending-verification",
    riskLevel: "medium",
    requiredEvidence: [
      "Product architecture diagrams",
      "Current service availability by branch",
      "Legal classification memo for each branch",
    ],
    approvedInstitutionalLanguage:
      "Official ecosystem materials reference multiple Troptions branches. Institutional usage must map each branch to current controls, legal status, and provider dependencies.",
    blockedLanguage: [
      "fully institutional today",
      "automatically compliant in all jurisdictions",
    ],
    notes: "Branch names are usable; capability claims need evidence attachments.",
  },
  {
    sourceId: "SRC-OFFICIAL-MERCHANTS",
    title: "Troptions Merchants Positioning",
    sourceType: "official",
    url: "https://www.troptions.org/merchants",
    dateObserved: "2026-04-25",
    summary:
      "Merchant/payment statements appear in public Troptions materials and connect to Troptions Pay language.",
    claimsExtracted: [
      "Merchant payment positioning",
      "Network acceptance narrative",
    ],
    institutionalUseStatus: "blocked-until-evidence",
    verificationStatus: "conflicting-sources",
    riskLevel: "high",
    requiredEvidence: [
      "Dated merchant-count source",
      "Rail-provider confirmation",
      "Acceptance conditions and exclusions",
    ],
    approvedInstitutionalLanguage:
      "Troptions Pay has been publicly represented as connected to merchant-payment rails. Merchant counts require dated source evidence and rail-provider confirmation before institutional publication.",
    blockedLanguage: [
      "accepted everywhere",
      "merchant count guaranteed",
    ],
    notes: "Count discrepancies across public materials must remain flagged as unverified.",
  },
  {
    sourceId: "SRC-GIVBUX-MERCHANTS",
    title: "GivBux Merchant Materials",
    sourceType: "third-party",
    url: "https://givbux.com/merchants/?utm_source=chatgpt.com",
    dateObserved: "2026-04-25",
    summary:
      "Third-party merchant-network references used in Troptions-adjacent payment narratives.",
    claimsExtracted: [
      "Merchant location claims",
      "Payment network availability claims",
    ],
    institutionalUseStatus: "needs-verification",
    verificationStatus: "pending-verification",
    riskLevel: "high",
    requiredEvidence: [
      "Contractual relationship evidence",
      "Provider status letter",
      "Regional and category eligibility terms",
    ],
    approvedInstitutionalLanguage:
      "GivBux references are treated as third-party source inputs and require direct provider validation before institutional use.",
    blockedLanguage: [
      "proves universal acceptance",
      "institutional settlement ready by default",
    ],
    notes: "Third-party source; do not elevate to fact without corroboration.",
  },
  {
    sourceId: "SRC-UNITY-WHITEPAPER",
    title: "Troptions Unity Whitepaper",
    sourceType: "whitepaper",
    url: "https://www.theunitytoken.com/whitepaper?utm_source=chatgpt.com",
    dateObserved: "2026-04-25",
    summary:
      "Unity whitepaper positioning around Solana utility and community/humanitarian narratives.",
    claimsExtracted: [
      "Solana utility framing",
      "Community impact claims",
      "Humanitarian positioning",
    ],
    institutionalUseStatus: "legally-sensitive",
    verificationStatus: "pending-verification",
    riskLevel: "high",
    requiredEvidence: [
      "Token legal classification memo",
      "Governance and treasury disclosures",
      "Impact reporting methodology",
    ],
    approvedInstitutionalLanguage:
      "Troptions Unity has been publicly positioned as a Solana-oriented utility track. Social-impact statements require program evidence and governance disclosure before institutional use.",
    blockedLanguage: [
      "asset-backed without reserves",
      "charitable outcomes guaranteed",
    ],
    notes: "Social-impact claims require measurable and auditable reporting design.",
  },
  {
    sourceId: "SRC-SOCIAL-ANNOUNCEMENTS",
    title: "Social and Medium Announcements",
    sourceType: "social",
    url: "https://medium.com",
    dateObserved: "2026-04-25",
    summary:
      "Public social/media announcements discussing merchant growth, RWA expansion, and global reach.",
    claimsExtracted: [
      "Merchant growth claims",
      "Global expansion claims",
      "RWA development claims",
    ],
    institutionalUseStatus: "outdated-legacy",
    verificationStatus: "pending-verification",
    riskLevel: "high",
    requiredEvidence: [
      "Primary source attachments",
      "Date-constrained claim snapshots",
      "Counterparty validation",
    ],
    approvedInstitutionalLanguage:
      "Social/media announcements are treated as historical narrative signals and require primary evidence before institutional adoption.",
    blockedLanguage: [
      "confirmed by social momentum",
      "self-proving public narrative",
    ],
    notes: "Use as claim leads, not proof artifacts.",
  },
  {
    sourceId: "SRC-LEGACY-GOLD-RWA",
    title: "Troptions Gold and RWA Legacy Materials",
    sourceType: "historical",
    url: "https://www.troptions.org",
    dateObserved: "2026-04-25",
    summary:
      "Legacy references to Troptions Gold, SALP, and commodity/real-asset positioning.",
    claimsExtracted: [
      "Gold and commodity narrative",
      "RWA tokenization concepts",
      "Balance-sheet impact language",
    ],
    institutionalUseStatus: "legally-sensitive",
    verificationStatus: "pending-verification",
    riskLevel: "high",
    requiredEvidence: [
      "Custody evidence",
      "Valuation methodology",
      "Legal and accounting treatment memos",
    ],
    approvedInstitutionalLanguage:
      "Legacy Troptions Gold and RWA statements are interpreted as concept-phase materials that require custody, valuation, legal, and accounting evidence prior to institutional publication.",
    blockedLanguage: [
      "balance sheet enhancement guaranteed",
      "reserve status assumed",
    ],
    notes: "Treat as diligence candidates; do not present as finalized capabilities.",
  },
  // ── Site Audit 2026-04-27: Three Legacy Domains ────────────────────────────
  {
    sourceId: "SRC-TROPTIONSXCHANGE-IO",
    title: "Troptions Xchange Legacy Domain (troptionsxchange.io)",
    sourceType: "official",
    url: "https://troptionsxchange.io",
    dateObserved: "2026-04-27",
    summary:
      "Legacy domain used historically for the Troptions Xchange sub-brand. Site audit identified exchange-readiness language, liquidity claims, and trading-platform framing that require compliance review before institutional re-use.",
    claimsExtracted: [
      "Exchange readiness or live-trading language",
      "Liquidity availability claims",
      "Token listing and trading-pair references",
      "Institutional-grade exchange framing",
    ],
    institutionalUseStatus: "blocked-until-evidence",
    verificationStatus: "pending-verification",
    riskLevel: "high",
    requiredEvidence: [
      "Exchange or ATS licensing status memo",
      "Liquidity-provider agreement evidence",
      "Trading-pair and asset-listing compliance review",
      "Jurisdiction analysis for exchange operations",
    ],
    approvedInstitutionalLanguage:
      "The troptionsxchange.io domain carries legacy exchange-positioning content. All exchange-platform language, liquidity claims, and token-trading references require licensing analysis, compliance sign-off, and approved-rewrite before institutional use. The canonical primary domain is troptionsxchange.com.",
    blockedLanguage: [
      "live exchange",
      "trade now",
      "instant liquidity",
      "listed and trading",
      "exchange ready",
    ],
    notes:
      "Legacy .io domain. The canonical sub-brand domain is troptionsxchange.com. All visitors should be redirected to the institutional portal. Legacy content must not be republished without compliance approval.",
  },
  {
    sourceId: "SRC-TROPTIONS-UNITYTOKEN-COM",
    title: "Troptions Unity Token Legacy Domain (troptions-unitytoken.com)",
    sourceType: "official",
    url: "https://troptions-unitytoken.com",
    dateObserved: "2026-04-27",
    summary:
      "Legacy domain used historically for Troptions Unity Token marketing. Site audit identified token-sale language, utility claims, humanitarian impact narratives, and Solana-integration statements that require legal classification and compliance review.",
    claimsExtracted: [
      "Token-sale or ICO-adjacent language",
      "Utility token framing",
      "Humanitarian / social-impact claims",
      "Solana platform integration references",
      "Asset-backed or value-preservation language",
    ],
    institutionalUseStatus: "legally-sensitive",
    verificationStatus: "pending-verification",
    riskLevel: "high",
    requiredEvidence: [
      "Securities/utility token legal classification memo",
      "Token-sale or offering compliance analysis",
      "Social-impact program governance and methodology",
      "Reserve and custody evidence if asset-backed claims are made",
      "Solana integration status and provider agreements",
    ],
    approvedInstitutionalLanguage:
      "The troptions-unitytoken.com domain carries legacy Unity Token marketing content. Token-classification, offering, and asset-backing language requires legal classification memo, compliance sign-off, and approved-rewrite before any institutional use. The canonical domain is unitytoken.io.",
    blockedLanguage: [
      "buy now",
      "token sale live",
      "guaranteed returns",
      "asset-backed without reserve evidence",
      "charity guaranteed",
      "instant purchase",
    ],
    notes:
      "Legacy hyphenated domain. The canonical sub-brand domain is unitytoken.io. All token-sale or ICO-style language is blocked until legal classification memo is obtained (see Critical action C1 in troptions-next-actions.md). Users must be redirected to the institutional portal.",
  },
  {
    sourceId: "SRC-TROPTIONS-ORG-FULL-AUDIT",
    title: "Troptions.org Full Site Audit 2026-04-27",
    sourceType: "official",
    url: "https://www.troptions.org",
    dateObserved: "2026-04-27",
    summary:
      "Full audit of troptions.org conducted 2026-04-27. The domain hosts the primary legacy Troptions brand. Multiple compliance risk areas identified: barter-ecosystem marketing language overstated without operational evidence, merchant-count claims unverified, RWA readiness implied without intake controls, and balance-sheet/asset references lacking custody and accounting support.",
    claimsExtracted: [
      "Primary brand identity and founding narrative",
      "Barter and trade ecosystem positioning",
      "Multiple purpose-built token references (TROPTIONS, TUT, Troptions Gold, Troptions Pay)",
      "Merchant acceptance and network scale claims",
      "RWA tokenization readiness",
      "Balance-sheet impact narrative",
      "Humanitarian and social-impact positioning",
      "Global expansion language",
    ],
    institutionalUseStatus: "needs-verification",
    verificationStatus: "pending-verification",
    riskLevel: "high",
    requiredEvidence: [
      "Corporate records corroborating founding date",
      "Dated merchant-count source with acceptance-condition disclosure",
      "RWA intake workflow and legal readiness gates",
      "Balance-sheet treatment memo",
      "Token-by-token legal classification memos",
      "Humanitarian-program governance and reporting",
      "Exchange or payment-rail licensing evidence",
    ],
    approvedInstitutionalLanguage:
      "Troptions.org is the primary legacy brand site. It describes a 2003-origin barter utility ecosystem with multiple purpose-built tokens. Each claim family (founding date, merchant counts, RWA readiness, asset backing, humanitarian impact) requires independent documentary corroboration before institutional publication. Legacy site visitors should be directed to the institutional compliance portal.",
    blockedLanguage: [
      "proven global acceptance",
      "fully compliant everywhere",
      "balance sheet enhancement guaranteed",
      "tokenize the world",
      "exchange ready today",
    ],
    notes:
      "Primary legacy domain. Must remain linked to institutional portal via prominent migration notice. All marketing language must pass riskLanguageRules before re-use. Review cadence: quarterly.",
  },
];

export function getSourcesByVerificationStatus(status: VerificationStatus): LegacySourceRecord[] {
  return LEGACY_SOURCE_REGISTRY.filter((source) => source.verificationStatus === status);
}

export function getInstitutionalReadySources(): LegacySourceRecord[] {
  return LEGACY_SOURCE_REGISTRY.filter(
    (source) => source.institutionalUseStatus === "approved-for-institutional-use",
  );
}
