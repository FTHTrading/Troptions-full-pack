import type { LegacySourceRecord } from "@/content/troptions/legacySourceRegistry";

export type LegacyClaimCategory =
  | "founding history"
  | "barter utility"
  | "proof of use"
  | "merchant acceptance"
  | "GivBux payment rail"
  | "Troptions Pay"
  | "Troptions Unity"
  | "Solana utility"
  | "humanitarian impact"
  | "Troptions Gold"
  | "RWA tokenization"
  | "SALP"
  | "gold / commodity backing"
  | "real estate"
  | "energy assets"
  | "global expansion"
  | "payments"
  | "exchange / liquidity"
  | "partnerships"
  | "public-market access"
  | "institutional future";

export type ClaimStatus =
  | "approved-for-institutional-use"
  | "needs-evidence"
  | "legally-sensitive"
  | "blocked"
  | "outdated-legacy";

export interface LegacyClaimRecord {
  claimId: string;
  originalClaim: string;
  sourceId: LegacySourceRecord["sourceId"] | string;
  category: LegacyClaimCategory;
  legacyMeaning: string;
  institutionalMeaning: string;
  status: ClaimStatus;
  evidenceRequired: readonly string[];
  verificationStatus: "verified" | "pending-verification" | "conflicting-sources" | "blocked";
  approvedRewrite: string;
  riskNote: string;
}

export const LEGACY_CLAIM_REGISTRY: readonly LegacyClaimRecord[] = [
  {
    claimId: "LCLM-FOUNDING-2003",
    originalClaim: "Troptions was founded in 2003.",
    sourceId: "SRC-OFFICIAL-HOME-2003",
    category: "founding history",
    legacyMeaning: "Long-duration identity and early digital utility origin.",
    institutionalMeaning: "Historical timeline claim requiring corporate and archival corroboration.",
    status: "needs-evidence",
    evidenceRequired: ["Corporate records", "Archived publications"],
    verificationStatus: "pending-verification",
    approvedRewrite:
      "Public Troptions materials describe a 2003 founding date. This timeline is maintained as a historical claim pending documentary corroboration.",
    riskNote: "Historical date claims can create legal risk if published as certified fact without primary records.",
  },
  {
    claimId: "LCLM-BARTER-UTILITY",
    originalClaim: "Troptions is a proof-of-use barter and trade utility ecosystem.",
    sourceId: "SRC-OFFICIAL-HOME-2003",
    category: "barter utility",
    legacyMeaning: "Utility-first framing versus speculative positioning.",
    institutionalMeaning: "Operational design philosophy mapped into product and control definitions.",
    status: "approved-for-institutional-use",
    evidenceRequired: ["Product flow documentation", "Current module mapping"],
    verificationStatus: "verified",
    approvedRewrite:
      "Troptions originated with a utility-oriented barter/trade narrative and is now translating that model into controlled institutional workflows.",
    riskNote: "Do not convert utility language into performance or value guarantees.",
  },
  {
    claimId: "LCLM-MERCHANT-COUNT",
    originalClaim: "Troptions Pay is accepted at hundreds of thousands of merchants.",
    sourceId: "SRC-OFFICIAL-MERCHANTS",
    category: "merchant acceptance",
    legacyMeaning: "Large-network utility messaging.",
    institutionalMeaning: "Third-party merchant-rail assertion requiring dated source and provider validation.",
    status: "blocked",
    evidenceRequired: ["Dated count source", "Rail-provider confirmation", "Acceptance conditions"],
    verificationStatus: "conflicting-sources",
    approvedRewrite:
      "Troptions Pay has been publicly represented as connected to merchant-payment rails. Any merchant-count claim requires dated source evidence, provider confirmation, and acceptance-condition disclosure before institutional publication.",
    riskNote: "Conflicting public counts and undocumented methodology create high disclosure risk.",
  },
  {
    claimId: "LCLM-UNITY-HUMANITARIAN",
    originalClaim: "Troptions Unity is humanitarian and asset-backed.",
    sourceId: "SRC-UNITY-WHITEPAPER",
    category: "humanitarian impact",
    legacyMeaning: "Community and social-impact positioning.",
    institutionalMeaning: "Social-impact statement that requires governance, methodology, and evidence controls.",
    status: "legally-sensitive",
    evidenceRequired: ["Impact methodology", "Governance disclosure", "Reserve and custody evidence if backing is claimed"],
    verificationStatus: "pending-verification",
    approvedRewrite:
      "Troptions Unity has been publicly positioned as a Solana-based utility and social-impact track. Any asset-backed, stability, or humanitarian-impact statement requires reserve evidence, governance controls, legal classification, and reporting procedures.",
    riskNote: "Asset-backed and humanitarian claims require measurable support and legal review.",
  },
  {
    claimId: "LCLM-GOLD-BALANCE-SHEET",
    originalClaim: "Troptions Gold enhances balance sheets.",
    sourceId: "SRC-LEGACY-GOLD-RWA",
    category: "Troptions Gold",
    legacyMeaning: "Commodity-linked financial strength narrative.",
    institutionalMeaning: "Accounting-sensitive statement requiring independent accounting and valuation policy.",
    status: "blocked",
    evidenceRequired: ["Accounting memo", "Valuation methodology", "Custody records"],
    verificationStatus: "blocked",
    approvedRewrite:
      "Any accounting or balance-sheet treatment requires independent accounting review, valuation methodology, custody evidence, impairment policy, and jurisdiction-specific reporting.",
    riskNote: "Balance-sheet impact language is legally sensitive and blocked without professional review.",
  },
  {
    claimId: "LCLM-RWA-WORLD",
    originalClaim: "Troptions is ready to tokenize the world.",
    sourceId: "SRC-SOCIAL-ANNOUNCEMENTS",
    category: "RWA tokenization",
    legacyMeaning: "Global-scale RWA ambition statement.",
    institutionalMeaning: "RWA pipeline objective requiring asset-by-asset readiness controls.",
    status: "outdated-legacy",
    evidenceRequired: ["RWA intake workflow", "Custody and legal gates", "Asset diligence checklists"],
    verificationStatus: "pending-verification",
    approvedRewrite:
      "Troptions is being rebuilt as an institutional RWA intake and evidence system where each asset requires title evidence, valuation, custody/control proof, legal classification, risk review, and approval gates before any issuance-readiness status.",
    riskNote: "Global readiness language is promotional and not acceptable for institutional publication.",
  },
  {
    claimId: "LCLM-INSTITUTIONAL-FUTURE",
    originalClaim: "Troptions can now operate as institutional infrastructure.",
    sourceId: "SRC-OFFICIAL-ABOUT-ECOSYSTEM",
    category: "institutional future",
    legacyMeaning: "Transition narrative toward regulated-grade systems.",
    institutionalMeaning: "Operating objective bounded by legal, provider, custody, and compliance gates.",
    status: "approved-for-institutional-use",
    evidenceRequired: ["Release gates", "Audit logs", "Control-plane documentation"],
    verificationStatus: "verified",
    approvedRewrite:
      "Troptions is transitioning from legacy utility narratives into a source-tracked, proof-gated, custody-aware, and compliance-controlled operating system.",
    riskNote: "Capability publication must remain tied to module readiness and gated status.",
  },
  // ── Site Audit 2026-04-27: Xchange, Unity Token, Troptions.org ───────────
  {
    claimId: "LCLM-XCHANGE-EXCHANGE-READY",
    originalClaim: "Troptions Xchange is a live exchange with liquidity and trading pairs.",
    sourceId: "SRC-TROPTIONSXCHANGE-IO",
    category: "exchange / liquidity",
    legacyMeaning: "Platform-readiness and trading-availability marketing.",
    institutionalMeaning: "Exchange operations require ATS or exchange licensing, counterparty agreements, and compliance sign-off.",
    status: "blocked",
    evidenceRequired: [
      "ATS or exchange license",
      "Liquidity-provider agreement",
      "Trading-pair compliance review",
      "Jurisdiction-by-jurisdiction analysis",
    ],
    verificationStatus: "blocked",
    approvedRewrite:
      "Troptions Xchange is a planned digital-asset exchange sub-brand currently in the licensing-analysis phase. No live exchange services are offered or available. Any exchange-readiness claims require licensing evidence and compliance approval before publication.",
    riskNote: "Unlicensed exchange operations create regulatory risk across multiple jurisdictions. All exchange-readiness language is blocked until licensing status is resolved.",
  },
  {
    claimId: "LCLM-XCHANGE-INSTANT-LIQUIDITY",
    originalClaim: "Troptions tokens have instant liquidity through the Xchange platform.",
    sourceId: "SRC-TROPTIONSXCHANGE-IO",
    category: "exchange / liquidity",
    legacyMeaning: "Immediate conversion availability for token holders.",
    institutionalMeaning: "Liquidity statements require disclosed market conditions, depth, spread, counterparty terms, and slippage policy.",
    status: "blocked",
    evidenceRequired: [
      "Live exchange order-book evidence",
      "Liquidity depth disclosure",
      "Counterparty terms and withdrawal conditions",
    ],
    verificationStatus: "blocked",
    approvedRewrite:
      "Token liquidity is subject to market conditions, counterparty availability, geographic restrictions, and applicable regulations. No guarantee of liquidity, redemption, or conversion is made or implied.",
    riskNote: "Instant liquidity language is on the Banned Hype Language list and is blocked without verifiable order-book evidence.",
  },
  {
    claimId: "LCLM-UNITY-TOKEN-SALE",
    originalClaim: "Troptions Unity Token sale is live and open to the public.",
    sourceId: "SRC-TROPTIONS-UNITYTOKEN-COM",
    category: "Troptions Unity",
    legacyMeaning: "Public token offering availability.",
    institutionalMeaning: "Token sales may constitute securities offerings subject to SEC or international equivalent regulation.",
    status: "blocked",
    evidenceRequired: [
      "Securities legal classification memo",
      "Offering exemption analysis",
      "Investor eligibility and accreditation verification",
      "Jurisdiction-by-jurisdiction approval",
    ],
    verificationStatus: "blocked",
    approvedRewrite:
      "No Unity Token public offering is active or available. Any token sale or offering is subject to legal classification, securities analysis, investor eligibility verification, and applicable regulatory approval in each jurisdiction.",
    riskNote: "Active token-sale language without legal clearance creates securities-violation risk. Blocked until Critical action C1 (legal memo) is completed.",
  },
  {
    claimId: "LCLM-UNITY-ASSET-BACKED",
    originalClaim: "Troptions Unity Token is asset-backed and preserves value.",
    sourceId: "SRC-TROPTIONS-UNITYTOKEN-COM",
    category: "gold / commodity backing",
    legacyMeaning: "Token stability and value-preservation marketing.",
    institutionalMeaning: "Asset-backed claims require custody records, reserve audits, valuation methodology, and accounting treatment.",
    status: "blocked",
    evidenceRequired: [
      "Custody evidence for backing assets",
      "Reserve audit by independent firm",
      "Valuation and impairment methodology",
      "Accounting treatment memo",
    ],
    verificationStatus: "blocked",
    approvedRewrite:
      "Troptions Unity Token has been publicly described as having asset-backing characteristics. Any such claim requires independent custody evidence, reserve audit, valuation methodology, and accounting review before publication.",
    riskNote: "Unsubstantiated asset-backed language creates significant legal and consumer-protection risk.",
  },
  {
    claimId: "LCLM-TROPTIONS-ORG-MULTITOKEN",
    originalClaim: "Troptions operates multiple live purpose-built tokens including TROPTIONS, TUT, Troptions Gold, and Troptions Pay.",
    sourceId: "SRC-TROPTIONS-ORG-FULL-AUDIT",
    category: "payments",
    legacyMeaning: "Ecosystem breadth and multi-token utility positioning.",
    institutionalMeaning: "Each token branch requires separate legal classification, operational evidence, and disclosure controls before institutional publication.",
    status: "needs-evidence",
    evidenceRequired: [
      "Token-by-token legal classification memos",
      "Operational status and chain deployment evidence per token",
      "Disclosure controls for each branch",
    ],
    verificationStatus: "pending-verification",
    approvedRewrite:
      "Troptions is a multi-token digital asset ecosystem. Each branch (TROPTIONS, Troptions Unity Token, Troptions Gold, Troptions Pay) is at a different operational maturity and legal classification stage. Institutional publication requires separate disclosure, evidence, and approval for each branch.",
    riskNote: "Bundling multiple token branches into a single readiness claim overstates aggregate compliance without per-token evidence.",
  },
  {
    claimId: "LCLM-TROPTIONS-ORG-BARTER-ECOSYSTEM",
    originalClaim: "Troptions is a fully operational barter and trade ecosystem.",
    sourceId: "SRC-TROPTIONS-ORG-FULL-AUDIT",
    category: "barter utility",
    legacyMeaning: "Core utility positioning as operational barter infrastructure.",
    institutionalMeaning: "Barter ecosystem language must be bounded by documented workflow capacity, rail-provider status, and operational evidence.",
    status: "needs-evidence",
    evidenceRequired: [
      "Barter workflow documentation",
      "Active transaction evidence",
      "Rail-provider operational status",
    ],
    verificationStatus: "pending-verification",
    approvedRewrite:
      "Troptions is designed as a utility-oriented barter and trade ecosystem. Current operational capacity is subject to workflow controls, provider availability, and jurisdiction-specific terms. Operational claims must be sourced and dated.",
    riskNote: "Unqualified 'fully operational' language requires documented transaction evidence. Overstated operational claims create disclosure and consumer-protection risk.",
  },
];

export function getClaimsByStatus(status: ClaimStatus): LegacyClaimRecord[] {
  return LEGACY_CLAIM_REGISTRY.filter((claim) => claim.status === status);
}
