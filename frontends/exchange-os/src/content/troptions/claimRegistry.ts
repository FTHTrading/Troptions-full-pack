/**
 * Troptions Claim Registry
 * Every public advertising claim, announcement, landing page assertion,
 * whitepaper statement, and partnership declaration must be registered here.
 *
 * GLOBAL RULES:
 * - HIGH or CRITICAL claims cannot publish without evidenceStatus = "approved"
 * - CRITICAL claims require legalStatus = "approved"
 * - Prohibited terms are blocked from publishing
 * - Inconsistencies are flagged automatically
 */

export type ClaimType =
  | "merchant-acceptance"
  | "payment-utility"
  | "barter-utility"
  | "token-supply"
  | "market-value"
  | "liquidity"
  | "partnership"
  | "audit"
  | "rwa-tokenization"
  | "gold-backed"
  | "asset-backed"
  | "stable-token"
  | "humanitarian-impact"
  | "exchange"
  | "balance-sheet"
  | "investor-interest"
  | "presale"
  | "staking"
  | "rewards"
  | "custody"
  | "reserve"
  | "treasury"
  | "legal-status"
  | "compliance"
  | "ai-infrastructure"
  | "telecom-support"
  | "education"
  | "media-television";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type PublishStatus =
  | "blocked"
  | "pending-review"
  | "approved-institutional"
  | "approved-public"
  | "rejected";

export type EvidenceStatus = "approved" | "partial" | "missing" | "not-started";

export interface TroptionsClaim {
  id: string;
  sourcePage: string;
  sourceUrl: string;
  originalText: string;
  claimType: ClaimType;
  riskLevel: RiskLevel;
  audience: string;
  currentStatus: string;
  legalStatus: EvidenceStatus;
  evidenceStatus: EvidenceStatus;
  proofRequired: string[];
  proofProvided: string[];
  missingEvidence: string[];
  prohibitedTerms: string[];
  approvedReplacementText: string;
  problemSummary: string;
  disclaimerRequired: string;
  reviewer: string;
  reviewDate: string | null;
  publishStatus: PublishStatus;
  nextAction: string;
}

export const CLAIM_REGISTRY: TroptionsClaim[] = [
  // ─── Merchant Network Claims ──────────────────────────────────────────────
  {
    id: "CLAIM-MERCHANT-001",
    sourcePage: "troptions.org — main landing page",
    sourceUrl: "https://www.troptions.org/",
    originalText: "Troptions Pay is accepted at over 580,000 merchant locations.",
    claimType: "merchant-acceptance",
    riskLevel: "HIGH",
    audience: "public",
    currentStatus: "unverified",
    legalStatus: "not-started",
    evidenceStatus: "missing",
    proofRequired: [
      "GivBux agreement or merchant network provider agreement",
      "Merchant network documentation with source and date",
      "Acceptance test receipts",
      "Current merchant count source with date-stamp",
      "Geographic limitations disclosure",
      "Excluded merchant categories",
      "Acceptance conditions",
    ],
    proofProvided: [],
    missingEvidence: [
      "GivBux agreement",
      "Merchant count verification with date",
      "Acceptance conditions document",
    ],
    prohibitedTerms: [],
    approvedReplacementText:
      "Troptions Pay is represented as connected to third-party merchant payment rails. Published merchant network counts must include source, date, rail provider, acceptance conditions, excluded merchant categories, and independent verification method before use in institutional materials.",
    problemSummary:
      "Count is inconsistent across Troptions pages (480,000 vs 580,000). No source, date, methodology, or provider confirmation provided. Cannot be used in institutional materials without verification.",
    disclaimerRequired:
      "Merchant acceptance is subject to third-party rail provider terms, counterparty acceptance, geographic restrictions, and category exclusions. Troptions does not guarantee universal merchant acceptance.",
    reviewer: "",
    reviewDate: null,
    publishStatus: "blocked",
    nextAction:
      "Reconcile merchant count. Obtain GivBux or rail-provider agreement. Date-stamp and source the count.",
  },
  {
    id: "CLAIM-MERCHANT-002",
    sourcePage: "troptions.org — alternate page",
    sourceUrl: "https://www.troptions.org/",
    originalText: "Troptions Pay is accepted at over 480,000 merchant locations.",
    claimType: "merchant-acceptance",
    riskLevel: "HIGH",
    audience: "public",
    currentStatus: "inconsistent-with-CLAIM-MERCHANT-001",
    legalStatus: "not-started",
    evidenceStatus: "missing",
    proofRequired: [
      "Same as CLAIM-MERCHANT-001",
      "Reconciliation memo explaining the 480K vs 580K discrepancy",
    ],
    proofProvided: [],
    missingEvidence: ["Reconciliation memo", "Source verification"],
    prohibitedTerms: [],
    approvedReplacementText:
      "See CLAIM-MERCHANT-001. Inconsistency must be resolved before any public or institutional use.",
    problemSummary:
      "This claim contradicts CLAIM-MERCHANT-001 (580,000 vs 480,000). Neither is sourced or dated. Both are blocked.",
    disclaimerRequired: "See CLAIM-MERCHANT-001 disclaimer.",
    reviewer: "",
    reviewDate: null,
    publishStatus: "blocked",
    nextAction: "Reconcile with CLAIM-MERCHANT-001. Obtain single verified, sourced, dated count.",
  },

  // ─── Tagline / Brand Claims ───────────────────────────────────────────────
  {
    id: "CLAIM-BRAND-001",
    sourcePage: "troptions.org — homepage tagline",
    sourceUrl: "https://www.troptions.org/",
    originalText: "Fueling Business Without Cash.",
    claimType: "barter-utility",
    riskLevel: "MEDIUM",
    audience: "public",
    currentStatus: "promotional",
    legalStatus: "not-started",
    evidenceStatus: "partial",
    proofRequired: [
      "Transaction examples demonstrating non-cash settlement",
      "Participant terms of service",
      "Tax treatment disclaimer (barter income is taxable)",
      "Accounting classification disclaimer",
      "Counterparty acceptance records",
    ],
    proofProvided: [],
    missingEvidence: [
      "Transaction examples",
      "Tax disclaimer",
      "Accounting memo",
    ],
    prohibitedTerms: [],
    approvedReplacementText:
      "Troptions supports barter-style digital value exchange workflows where approved participants may document, price, and settle non-cash transactions, subject to counterparty acceptance, tax treatment, legal review, and platform rules.",
    problemSummary:
      "Tagline is retail-oriented. For institutional use it requires defined scope, tax treatment disclosure, and counterparty acceptance documentation.",
    disclaimerRequired:
      "Barter transactions may be taxable events. Troptions does not provide tax advice. Participants should consult independent tax counsel.",
    reviewer: "",
    reviewDate: null,
    publishStatus: "pending-review",
    nextAction:
      "Add tax and accounting disclaimer to all pages using this tagline. Approve for public use only after legal review.",
  },

  // ─── Audit Claims ─────────────────────────────────────────────────────────
  {
    id: "CLAIM-AUDIT-001",
    sourcePage: "Troptions Gold audit announcement",
    sourceUrl: "https://www.troptions.org/",
    originalText: "Troptions.Gold completed a comprehensive audit — a declaration of openness and legitimacy.",
    claimType: "audit",
    riskLevel: "HIGH",
    audience: "public",
    currentStatus: "unverified",
    legalStatus: "not-started",
    evidenceStatus: "missing",
    proofRequired: [
      "Audit report (full document)",
      "Auditor identity and credentials",
      "Audit date",
      "Audit methodology",
      "Scope of assets reviewed",
      "Items excluded from audit",
      "Exception log",
      "Remediation status for any exceptions",
      "Reserve schedule",
    ],
    proofProvided: [],
    missingEvidence: [
      "Audit report",
      "Auditor identity",
      "Methodology",
      "Exception log",
      "Reserve schedule",
    ],
    prohibitedTerms: ["declaration of openness and legitimacy", "game-changing audit", "comprehensive audit"],
    approvedReplacementText:
      "Troptions.Gold audit materials are available for review, including audit scope, reviewer identity, date, methodology, assets reviewed, exclusions, exceptions, and remediation status.",
    problemSummary:
      "No audit report, auditor identity, methodology, date, or exception log has been produced for institutional review. 'Declaration of openness and legitimacy' is promotional language with no evidentiary basis.",
    disclaimerRequired:
      "Audit scope, methodology, and limitations are disclosed separately. An audit is not a guarantee of reserves, compliance, or future performance.",
    reviewer: "",
    reviewDate: null,
    publishStatus: "blocked",
    nextAction:
      "Upload full audit report. Disclose auditor identity, date, methodology, exceptions, and remediation.",
  },

  // ─── Exchange Claims ──────────────────────────────────────────────────────
  {
    id: "CLAIM-EXCHANGE-001",
    sourcePage: "QuantumXchange partnership announcement",
    sourceUrl: "https://www.troptions.org/",
    originalText: "Troptions and QuantumXchange will build the world's first full-service crypto exchange for the new global financial system.",
    claimType: "exchange",
    riskLevel: "CRITICAL",
    audience: "public",
    currentStatus: "announced-unverified",
    legalStatus: "not-started",
    evidenceStatus: "missing",
    proofRequired: [
      "Signed partnership or development agreement",
      "Licensing status memo (exchange, broker-dealer, MTL)",
      "Jurisdiction memo",
      "Custody model documentation",
      "Exchange architecture documentation",
      "Compliance and AML policy",
      "Matching engine development status",
      "Settlement model",
      "Launch readiness assessment",
    ],
    proofProvided: [],
    missingEvidence: [
      "Signed agreement",
      "Licensing memo",
      "Custody model",
      "Exchange architecture",
      "Launch status",
    ],
    prohibitedTerms: ["world's first", "full-service crypto exchange", "new global financial system"],
    approvedReplacementText:
      "Troptions has announced an exchange infrastructure initiative with QuantumXchange. Institutional materials distinguish between announced partnership, development status, licensing status, jurisdiction, custody model, matching-engine status, settlement model, and launch readiness.",
    problemSummary:
      "Operating an exchange requires licensing (broker-dealer, ATS, MTL, or jurisdiction equivalents). 'World's first' is unverifiable. No licensing, custody, or architecture documentation exists for institutional review.",
    disclaimerRequired:
      "Exchange operations require licensing, custody arrangements, compliance programs, and regulatory approval. Current status is announced initiative only. No exchange services are being offered.",
    reviewer: "",
    reviewDate: null,
    publishStatus: "blocked",
    nextAction:
      "Engage exchange/ATS counsel. Determine licensing pathway. Do not describe as operational exchange until licensed.",
  },

  // ─── Unity Token Claims ───────────────────────────────────────────────────
  {
    id: "CLAIM-UNITY-001",
    sourcePage: "The Unity Token whitepaper",
    sourceUrl: "https://www.theunitytoken.com/whitepaper",
    originalText: "Troptions.Unity is a stable, asset-backed humanitarian token on Solana with a 400,000,000 starting supply.",
    claimType: "stable-token",
    riskLevel: "CRITICAL",
    audience: "public",
    currentStatus: "unverified",
    legalStatus: "not-started",
    evidenceStatus: "missing",
    proofRequired: [
      "Reserve schedule with backing asset list",
      "Custody proof of backing assets",
      "Redemption policy",
      "Use-of-proceeds policy",
      "Charity governance policy and controls",
      "Treasury controls memo",
      "Legal classification memo (utility token vs security vs stablecoin)",
      "Solana on-chain token data (supply, holders, transactions)",
      "Reporting cadence policy",
    ],
    proofProvided: [],
    missingEvidence: [
      "Reserve schedule",
      "Backing asset proof",
      "Redemption policy",
      "Legal classification memo",
      "Charity governance controls",
    ],
    prohibitedTerms: ["stable", "asset-backed", "humanitarian token"],
    approvedReplacementText:
      "Troptions.Unity is positioned as a Solana-based utility token for ecosystem participation and social-impact programs. Any use of 'stable' or 'asset-backed' requires reserve policy, backing evidence, redemption terms, legal classification, governance controls, and reporting cadence before institutional or public use.",
    problemSummary:
      "Stablecoin and asset-backed claims require reserve proof, redemption policy, and legal classification. Charitable-impact claims require governance controls and use-of-proceeds policy. CoinMarketCap shows circulating supply as 0.",
    disclaimerRequired:
      "Troptions.Unity is not a stablecoin, money market instrument, or guaranteed-value product. Any reserve backing, redemption terms, and charitable governance are disclosed separately and subject to legal review.",
    reviewer: "",
    reviewDate: null,
    publishStatus: "blocked",
    nextAction:
      "Engage securities counsel, stablecoin counsel, and nonprofit/charity counsel. Remove 'stable' and 'asset-backed' from all public copy pending legal review.",
  },

  // ─── SALP / RWA Claims ────────────────────────────────────────────────────
  {
    id: "CLAIM-SALP-001",
    sourcePage: "troptions.net — SALP / Smart Asset Liquidity Protocol",
    sourceUrl: "https://troptions.net/",
    originalText: "SALP turns real assets into liquid digital tokens that can be traded or used for financing.",
    claimType: "rwa-tokenization",
    riskLevel: "CRITICAL",
    audience: "public",
    currentStatus: "unverified",
    legalStatus: "not-started",
    evidenceStatus: "missing",
    proofRequired: [
      "Asset title documents",
      "Independent appraisal",
      "Lien and encumbrance search",
      "Custody receipt for underlying asset",
      "Legal classification memo (security token, commodity, etc.)",
      "Transfer restriction policy",
      "Investor eligibility requirements",
      "Market-access approval documentation",
      "Liquidity disclosure (no liquidity assumed)",
    ],
    proofProvided: [],
    missingEvidence: [
      "Asset title",
      "Appraisal",
      "Lien search",
      "Custody receipt",
      "Legal memo",
      "Investor restrictions",
      "Transfer policy",
    ],
    prohibitedTerms: ["liquid digital tokens", "can be traded", "instant liquidity"],
    approvedReplacementText:
      "Troptions SALP is an RWA intake and representation framework. Asset liquidity is not assumed. Each asset requires title verification, appraisal, lien review, custody control, legal classification, transfer restrictions, investor eligibility, and market-access approval.",
    problemSummary:
      "Tokenizing real assets into 'liquid digital tokens' without title, appraisal, custody, legal classification, and transfer restrictions creates potential securities law, commodities law, and investor protection issues.",
    disclaimerRequired:
      "SALP-represented assets are not automatically liquid or tradeable. Each asset is subject to legal classification, transfer restrictions, investor eligibility requirements, custody proof, and market-access approval before any secondary market activity.",
    reviewer: "",
    reviewDate: null,
    publishStatus: "blocked",
    nextAction:
      "Engage securities and RWA counsel. Define SALP intake requirements. Block 'liquid' language until market access is legally approved.",
  },

  // ─── Balance Sheet Claims ─────────────────────────────────────────────────
  {
    id: "CLAIM-BALANCE-001",
    sourcePage: "Troptions Gold institutional materials",
    sourceUrl: "https://www.troptions.org/",
    originalText: "Troptions.Gold enhances corporate balance sheets.",
    claimType: "balance-sheet",
    riskLevel: "CRITICAL",
    audience: "institutional",
    currentStatus: "unverified",
    legalStatus: "not-started",
    evidenceStatus: "missing",
    proofRequired: [
      "Independent CPA memo on accounting treatment",
      "Asset classification methodology",
      "Valuation method documentation",
      "Impairment policy",
      "Custody proof",
      "Legal ownership documentation",
      "Jurisdiction-specific accounting standards review",
    ],
    proofProvided: [],
    missingEvidence: [
      "CPA memo",
      "Valuation method",
      "Impairment policy",
      "Custody proof",
    ],
    prohibitedTerms: ["enhances corporate balance sheets", "balance sheet enhancement"],
    approvedReplacementText:
      "Any balance-sheet treatment of Troptions.Gold depends on independent accounting review, asset classification, valuation method, impairment policy, liquidity, custody, and jurisdiction-specific reporting standards. Troptions does not provide accounting advice.",
    problemSummary:
      "Balance-sheet treatment of digital assets is jurisdiction-specific, classification-dependent, and requires independent CPA review. This claim cannot be made without supporting accounting analysis.",
    disclaimerRequired:
      "Accounting treatment requires independent CPA or auditor review. Troptions does not provide accounting, tax, or financial advice.",
    reviewer: "",
    reviewDate: null,
    publishStatus: "blocked",
    nextAction:
      "Engage CPA for accounting treatment memo. Remove 'balance sheet enhancement' from all materials until memo is complete.",
  },

  // ─── Market / Liquidity Claims ────────────────────────────────────────────
  {
    id: "CLAIM-MARKET-001",
    sourcePage: "CoinMarketCap listing page",
    sourceUrl: "https://coinmarketcap.com/currencies/troptions/",
    originalText: "TROPTIONS — circulating supply: 0 (preview page).",
    claimType: "liquidity",
    riskLevel: "HIGH",
    audience: "institutional",
    currentStatus: "incomplete-public-data",
    legalStatus: "not-started",
    evidenceStatus: "missing",
    proofRequired: [
      "Verified circulating supply from on-chain data",
      "Wallet distribution report",
      "Transfer history",
      "Volume data from verified venues",
      "Market maker agreements",
      "Venue listing status",
    ],
    proofProvided: [],
    missingEvidence: [
      "Circulating supply verification",
      "Volume data",
      "Venue listing confirmation",
    ],
    prohibitedTerms: ["instant liquidity", "public market access", "deep liquidity"],
    approvedReplacementText:
      "Supply schedule, wallet distribution, transfer history, circulating supply, liquidity status, and demand assumptions are disclosed separately. Any implication of market depth or liquidity requires independently verified venue, volume, and market-maker data.",
    problemSummary:
      "CoinMarketCap shows circulating supply as 0. Institutional materials cannot imply market depth, liquidity, or public market access without independently verified venue, volume, and market-maker data.",
    disclaimerRequired:
      "Market data is subject to independent verification. No guarantee of liquidity, venue access, or market depth is made or implied.",
    reviewer: "",
    reviewDate: null,
    publishStatus: "blocked",
    nextAction:
      "Update CoinMarketCap listing with verified supply data. Obtain and disclose venue/volume information.",
  },

  // ─── Gold-Backed Claims ───────────────────────────────────────────────────
  {
    id: "CLAIM-GOLD-001",
    sourcePage: "Troptions Gold token description",
    sourceUrl: "https://www.troptions.org/",
    originalText: "Troptions.Gold is backed by physical gold held in verified custody.",
    claimType: "gold-backed",
    riskLevel: "CRITICAL",
    audience: "institutional",
    currentStatus: "unverified",
    legalStatus: "not-started",
    evidenceStatus: "missing",
    proofRequired: [
      "Custody agreement naming custodian, address, and jurisdiction",
      "Physical gold warehouse receipt",
      "Independent weight and purity certificate",
      "Custodian audit report",
      "Insurance certificate for stored gold",
      "Reserve ratio: grams of gold per token",
      "Redemption policy",
      "Locked vs. available gold disclosure",
    ],
    proofProvided: [],
    missingEvidence: [
      "Custody agreement",
      "Warehouse receipt",
      "Purity certificate",
      "Reserve ratio",
      "Redemption policy",
    ],
    prohibitedTerms: ["backed by physical gold", "gold-backed", "gold reserves confirmed"],
    approvedReplacementText:
      "Troptions.Gold represents an institutional-grade digital asset. Any gold-backing claim requires a signed custody agreement, warehouse receipt, independent weight and purity certification, reserve ratio disclosure, custodian audit, insurance, and redemption policy.",
    problemSummary:
      "No custody agreement, warehouse receipt, purity certificate, reserve ratio, or redemption policy has been produced. Gold-backed claims cannot appear in any institutional materials without these documents.",
    disclaimerRequired:
      "Gold-backing is not confirmed. Any gold custody, reserve, or redemption claims are subject to verification. Troptions.Gold is not a gold ETF, fund, or commodity contract.",
    reviewer: "",
    reviewDate: null,
    publishStatus: "blocked",
    nextAction:
      "Engage gold custodian. Obtain warehouse receipt and purity certificate. Define reserve ratio and redemption policy.",
  },
  {
    id: "CLAIM-GOLD-002",
    sourcePage: "Troptions Gold investor materials",
    sourceUrl: "https://www.troptions.org/",
    originalText: "Troptions.Gold increases in value as demand grows and supply remains fixed.",
    claimType: "market-value",
    riskLevel: "CRITICAL",
    audience: "public",
    currentStatus: "investment-implication",
    legalStatus: "not-started",
    evidenceStatus: "missing",
    proofRequired: [
      "Legal classification memo — utility token vs. investment contract",
      "Howey test analysis",
      "Securities counsel review",
      "Verified fixed-supply on-chain documentation",
      "Demand data and methodology",
    ],
    proofProvided: [],
    missingEvidence: [
      "Legal classification memo",
      "Howey test analysis",
      "Securities counsel review",
      "Fixed-supply on-chain verification",
    ],
    prohibitedTerms: ["increases in value", "value grows", "appreciate in value", "price appreciation"],
    approvedReplacementText:
      "Troptions.Gold is an ecosystem participation token. No price appreciation, investment returns, or value guarantees are made or implied. Participants should consult independent counsel regarding token classification and applicable securities laws.",
    problemSummary:
      "Statements implying value increase driven by demand and fixed supply constitute potential investment-contract language under Howey. Securities counsel review required before any public use.",
    disclaimerRequired:
      "Troptions does not guarantee returns, value appreciation, or market demand. Digital asset values can decline. No investment advice is provided.",
    reviewer: "",
    reviewDate: null,
    publishStatus: "blocked",
    nextAction:
      "Engage securities counsel. Obtain Howey analysis. Remove all value-appreciation language from public materials.",
  },
  {
    id: "CLAIM-GOLD-003",
    sourcePage: "Troptions Gold reserve description",
    sourceUrl: "https://www.troptions.org/",
    originalText: "Troptions.Gold is fully reserved and independently verified.",
    claimType: "reserve",
    riskLevel: "CRITICAL",
    audience: "institutional",
    currentStatus: "unverified",
    legalStatus: "not-started",
    evidenceStatus: "missing",
    proofRequired: [
      "Reserve schedule",
      "Custodian attestation letter",
      "Independent verifier identity and credentials",
      "Verification date and methodology",
      "Tokens in circulation vs. total reserves ratio",
      "Exceptions or discrepancies disclosed",
    ],
    proofProvided: [],
    missingEvidence: [
      "Reserve schedule",
      "Custodian attestation",
      "Verification report",
      "Circulation vs. reserve ratio",
    ],
    prohibitedTerms: ["fully reserved", "independently verified", "100% backed"],
    approvedReplacementText:
      "Reserve status, custodian identity, verification methodology, reserve ratio, and exception log are disclosed in the Troptions Proof of Reserves package. No reserve claim is made without supporting documentation.",
    problemSummary:
      "No reserve schedule, custodian attestation, or independent verifier report exists. 'Fully reserved and independently verified' is a high-stakes claim requiring complete documentation.",
    disclaimerRequired:
      "Reserve status is subject to verification. No claim of full backing is made without current attestation and reserve schedule.",
    reviewer: "",
    reviewDate: null,
    publishStatus: "blocked",
    nextAction:
      "Produce reserve schedule. Engage independent verifier. Publish Proof of Reserves package.",
  },
  {
    id: "CLAIM-GOLD-004",
    sourcePage: "Troptions Gold redemption description",
    sourceUrl: "https://www.troptions.org/",
    originalText: "Troptions.Gold token holders can redeem for physical gold delivery.",
    claimType: "gold-backed",
    riskLevel: "CRITICAL",
    audience: "institutional",
    currentStatus: "unverified",
    legalStatus: "not-started",
    evidenceStatus: "missing",
    proofRequired: [
      "Gold custodian identity and signed agreement",
      "Redemption mechanics documentation",
      "Minimum redemption amount",
      "Delivery conditions and logistics",
      "Commodity delivery law analysis by jurisdiction",
      "Legal classification memo (commodity contract?)",
      "Insurance for delivery",
      "Refusal conditions",
    ],
    proofProvided: [],
    missingEvidence: [
      "Custody agreement",
      "Redemption mechanics",
      "Commodity law analysis",
      "Delivery logistics",
    ],
    prohibitedTerms: ["physical delivery", "redeem for gold", "physical gold redemption"],
    approvedReplacementText:
      "Physical gold redemption mechanics, custodian identity, minimum amounts, delivery conditions, commodity law analysis, insurance, and refusal conditions are disclosed in the Troptions Gold redemption policy.",
    problemSummary:
      "Physical commodity delivery may constitute a commodity contract under CFTC jurisdiction. Redemption claims require custody proof, delivery mechanics, and commodity law analysis.",
    disclaimerRequired:
      "Physical gold redemption is not guaranteed. Subject to custodian terms, commodity law, minimum amounts, delivery conditions, and applicable regulations.",
    reviewer: "",
    reviewDate: null,
    publishStatus: "blocked",
    nextAction:
      "Engage commodities counsel. Obtain custody agreement. Document redemption mechanics and delivery conditions.",
  },

  // ─── Partnership Claims ───────────────────────────────────────────────────
  {
    id: "CLAIM-PARTNER-001",
    sourcePage: "Troptions partnership announcements",
    sourceUrl: "https://www.troptions.org/",
    originalText: "Troptions has established strategic partnerships with leading institutions.",
    claimType: "partnership",
    riskLevel: "HIGH",
    audience: "institutional",
    currentStatus: "unverified",
    legalStatus: "not-started",
    evidenceStatus: "missing",
    proofRequired: [
      "Signed agreement for each named partner",
      "Agreement date and term",
      "Scope of services or activities",
      "Each partner's regulatory status",
      "Exclusivity or non-exclusivity disclosure",
      "Due diligence performed on partner",
    ],
    proofProvided: [],
    missingEvidence: [
      "Signed agreements",
      "Partner regulatory status",
      "Scope documentation",
    ],
    prohibitedTerms: ["leading institutions", "strategic partnerships", "global network of partners"],
    approvedReplacementText:
      "Troptions has announced partnership initiatives with named counterparties. Each partnership is disclosed with signed agreement status, date, scope, partner regulatory status, and due diligence performed.",
    problemSummary:
      "Generic partnership language without named, verified, agreement-backed counterparties cannot appear in institutional materials. Each partnership must be individually documented.",
    disclaimerRequired:
      "Partnership announcements do not constitute executed agreements. Each partnership requires independent verification of counterparty identity, regulatory status, and scope.",
    reviewer: "",
    reviewDate: null,
    publishStatus: "blocked",
    nextAction:
      "List every named partner. For each: confirm signed agreement, date, scope, regulatory status, and due diligence.",
  },
  {
    id: "CLAIM-PARTNER-002",
    sourcePage: "Luxor / Alliance Group partnership materials",
    sourceUrl: "https://www.troptions.org/",
    originalText: "Troptions has partnered with Luxor and The Alliance Group to tokenize rare stones, commodities, and collectibles.",
    claimType: "partnership",
    riskLevel: "HIGH",
    audience: "institutional",
    currentStatus: "announced-unverified",
    legalStatus: "not-started",
    evidenceStatus: "missing",
    proofRequired: [
      "Luxor signed partnership or MOU",
      "Alliance Group signed partnership or MOU",
      "Asset list with appraisal and title status",
      "Tokenization methodology for rare stones and collectibles",
      "Legal classification memo for each asset class",
      "Custody model for physical assets",
      "Transfer restriction policy",
    ],
    proofProvided: [],
    missingEvidence: [
      "Signed MOUs",
      "Asset list with appraisal",
      "Legal classification memo",
      "Custody model",
    ],
    prohibitedTerms: ["exclusive partnership", "joint venture confirmed", "signed and closed"],
    approvedReplacementText:
      "Troptions has announced tokenization initiatives involving rare stones, commodities, and collectibles through named counterparties. Each initiative requires signed agreement, asset title, appraisal, lien review, custody proof, legal classification, transfer restrictions, and investor eligibility.",
    problemSummary:
      "Tokenizing rare stones and collectibles creates potential securities law, commodities law, and collectibles-regulation issues. No signed agreement, asset list, appraisal, or legal classification memo has been produced.",
    disclaimerRequired:
      "Rare stones, commodities, and collectible tokenization is subject to commodities law, securities law, and jurisdiction-specific regulations. No trading or investment activity is available without completed legal review.",
    reviewer: "",
    reviewDate: null,
    publishStatus: "blocked",
    nextAction:
      "Obtain signed MOUs. Engage commodities and securities counsel. Document each asset class separately.",
  },

  // ─── Staking / Rewards Claims ─────────────────────────────────────────────
  {
    id: "CLAIM-STAKING-001",
    sourcePage: "Troptions staking / rewards program description",
    sourceUrl: "https://www.troptions.org/",
    originalText: "Troptions holders earn rewards through the staking program.",
    claimType: "staking",
    riskLevel: "CRITICAL",
    audience: "public",
    currentStatus: "unverified",
    legalStatus: "not-started",
    evidenceStatus: "missing",
    proofRequired: [
      "Securities counsel memo: staking rewards vs. unregistered investment contract",
      "Howey test analysis for staking program",
      "Smart contract audit",
      "Reward rate documentation (APR/APY)",
      "Lock-up period disclosure",
      "Withdrawal conditions",
      "Jurisdiction restrictions",
      "Tax treatment disclosure",
    ],
    proofProvided: [],
    missingEvidence: [
      "Securities counsel memo",
      "Howey analysis",
      "Smart contract audit",
      "Reward rate documentation",
      "Jurisdiction restrictions",
    ],
    prohibitedTerms: ["earn rewards", "passive income", "guaranteed APY", "staking returns"],
    approvedReplacementText:
      "Any staking or rewards mechanism requires securities counsel review, Howey analysis, smart contract audit, reward rate documentation, lock-up and withdrawal policy, jurisdiction restrictions, and tax treatment disclosure before any participant communications.",
    problemSummary:
      "Staking rewards that generate returns for token holders may constitute an investment contract under securities law. This claim requires securities counsel review before any public communications.",
    disclaimerRequired:
      "Staking rewards are not guaranteed. Tax treatment varies. Staking programs may be subject to securities regulation. Participants should consult independent counsel.",
    reviewer: "",
    reviewDate: null,
    publishStatus: "blocked",
    nextAction:
      "Engage securities counsel. Obtain Howey analysis. Do not publish any staking communications until legal review is complete.",
  },

  // ─── Stable Unit Claims ───────────────────────────────────────────────────
  {
    id: "CLAIM-STABLE-001",
    sourcePage: "Troptions stable unit description",
    sourceUrl: "https://www.troptions.org/",
    originalText: "Troptions stable units maintain consistent value through asset backing and reserve controls.",
    claimType: "stable-token",
    riskLevel: "CRITICAL",
    audience: "institutional",
    currentStatus: "unverified",
    legalStatus: "not-started",
    evidenceStatus: "missing",
    proofRequired: [
      "Legal classification memo: stablecoin vs. money market vs. utility token",
      "Reserve asset list and schedule",
      "Custody proof for reserve assets",
      "Redemption policy and conditions",
      "Reserve ratio documentation",
      "Peg maintenance mechanism description",
      "Depeg event policy",
      "Regulatory analysis (FinCEN, state money transmitter, bank regulations)",
      "Jurisdiction restrictions",
    ],
    proofProvided: [],
    missingEvidence: [
      "Legal classification memo",
      "Reserve schedule",
      "Custody proof",
      "Redemption policy",
      "Regulatory analysis",
    ],
    prohibitedTerms: ["stable value", "maintains value", "price stability", "stablecoin"],
    approvedReplacementText:
      "Troptions stable-unit instruments are subject to reserve policy, custody proof, legal classification, redemption conditions, regulatory analysis, and jurisdiction-specific requirements. No stability is guaranteed without complete documentation.",
    problemSummary:
      "Stable-value claims require reserve proof, redemption policy, legal classification, and regulatory analysis. Stablecoin regulation is evolving and may require licensing.",
    disclaimerRequired:
      "Stable units are not FDIC-insured, do not guarantee price stability, and are not bank deposits. Reserve backing, redemption, and regulatory status are disclosed separately.",
    reviewer: "",
    reviewDate: null,
    publishStatus: "blocked",
    nextAction:
      "Engage stablecoin counsel. Produce reserve schedule and custody proof. Obtain regulatory analysis.",
  },

  // ─── Public Market Access Claims ──────────────────────────────────────────
  {
    id: "CLAIM-PUBMKT-001",
    sourcePage: "Troptions public market / OTC access description",
    sourceUrl: "https://www.troptions.org/",
    originalText: "Troptions tokens are available for purchase and trading on public markets and OTC desks.",
    claimType: "liquidity",
    riskLevel: "CRITICAL",
    audience: "public",
    currentStatus: "unverified",
    legalStatus: "not-started",
    evidenceStatus: "missing",
    proofRequired: [
      "Named exchange or OTC venue with listing confirmation",
      "Licensing status of each venue",
      "Investor eligibility requirements per jurisdiction",
      "Transfer restriction policy",
      "Lockup schedules",
      "Securities law analysis by jurisdiction",
      "Legal counsel review of each market-access route",
    ],
    proofProvided: [],
    missingEvidence: [
      "Exchange listing confirmation",
      "Venue licensing status",
      "Securities law analysis",
      "Transfer restriction policy",
    ],
    prohibitedTerms: ["available for trading", "public markets", "buy and sell freely", "OTC available"],
    approvedReplacementText:
      "Any public market, exchange, or OTC access for Troptions tokens requires named venue confirmation, venue licensing, investor eligibility restrictions, transfer restrictions, lockup schedules, jurisdiction analysis, and legal counsel review.",
    problemSummary:
      "Implying tradeable public market access without confirmed venues, investor eligibility restrictions, and jurisdiction analysis creates investor protection and securities law exposure.",
    disclaimerRequired:
      "No guarantee of liquidity, exchange listing, OTC access, or market depth is made. Market access is subject to investor eligibility, transfer restrictions, jurisdiction restrictions, and applicable law.",
    reviewer: "",
    reviewDate: null,
    publishStatus: "blocked",
    nextAction:
      "Identify specific trading venues. Confirm listing status. Engage securities counsel for each jurisdiction.",
  },

  // ─── Scarcity / Demand Claims ─────────────────────────────────────────────
  {
    id: "CLAIM-SCARCITY-001",
    sourcePage: "Troptions token economics description",
    sourceUrl: "https://www.troptions.org/",
    originalText: "Troptions has a fixed supply driving natural demand and scarcity value.",
    claimType: "market-value",
    riskLevel: "CRITICAL",
    audience: "public",
    currentStatus: "investment-implication",
    legalStatus: "not-started",
    evidenceStatus: "missing",
    proofRequired: [
      "Securities counsel memo on supply/scarcity language",
      "Howey test analysis",
      "On-chain verified fixed-supply proof",
      "No-mint guarantee mechanism",
      "Token distribution schedule",
    ],
    proofProvided: [],
    missingEvidence: [
      "Securities counsel memo",
      "On-chain fixed-supply proof",
      "Token distribution schedule",
    ],
    prohibitedTerms: ["scarcity value", "natural demand", "fixed supply drives value", "deflationary model"],
    approvedReplacementText:
      "Troptions token supply parameters are documented on-chain. Supply, distribution schedule, and economics are disclosed separately. No value appreciation or investment returns are implied.",
    problemSummary:
      "Fixed supply + demand = value appreciation is classic investment contract language. Securities counsel analysis required before public use.",
    disclaimerRequired:
      "Token economics do not guarantee value, demand, or returns. Digital asset values are speculative and can decline to zero.",
    reviewer: "",
    reviewDate: null,
    publishStatus: "blocked",
    nextAction:
      "Engage securities counsel. Remove scarcity and value-appreciation language from all public materials.",
  },

  // ─── Reserve Claims ───────────────────────────────────────────────────────
  {
    id: "CLAIM-RESERVE-001",
    sourcePage: "Troptions reserve / treasury description",
    sourceUrl: "https://www.troptions.org/",
    originalText: "Troptions maintains robust treasury reserves backing ecosystem operations.",
    claimType: "reserve",
    riskLevel: "HIGH",
    audience: "institutional",
    currentStatus: "unverified",
    legalStatus: "not-started",
    evidenceStatus: "missing",
    proofRequired: [
      "Treasury account statements",
      "Reserve asset composition",
      "Custodian identity and account confirmation",
      "Reserve ratio relative to outstanding obligations",
      "Reserve policy document",
      "Board approval of reserve policy",
      "Independent verification or attestation",
    ],
    proofProvided: [],
    missingEvidence: [
      "Treasury statements",
      "Reserve composition",
      "Custodian confirmation",
      "Reserve policy",
    ],
    prohibitedTerms: ["robust reserves", "fully funded treasury", "strong reserves"],
    approvedReplacementText:
      "Troptions treasury reserve status, asset composition, custodian identity, reserve ratio, and reserve policy are disclosed in the Troptions Proof of Reserves package. No reserve claim is made without current attestation.",
    problemSummary:
      "Reserve claims require treasury statements, custodian confirmation, reserve composition, and independent attestation. None have been produced.",
    disclaimerRequired:
      "Reserve adequacy is not guaranteed. Reserve status is subject to change. Independent verification is required before any reserve claims.",
    reviewer: "",
    reviewDate: null,
    publishStatus: "blocked",
    nextAction:
      "Produce treasury statements. Engage independent verifier. Draft reserve policy for board approval.",
  },

  // ─── Unity Humanitarian Claims ────────────────────────────────────────────
  {
    id: "CLAIM-UNITY-002",
    sourcePage: "Troptions Unity humanitarian impact description",
    sourceUrl: "https://www.theunitytoken.com/",
    originalText: "Troptions Unity channels every transaction toward global humanitarian causes.",
    claimType: "humanitarian-impact",
    riskLevel: "HIGH",
    audience: "public",
    currentStatus: "unverified",
    legalStatus: "not-started",
    evidenceStatus: "missing",
    proofRequired: [
      "Use-of-proceeds policy",
      "Named charitable or humanitarian beneficiaries",
      "Governance controls over proceeds",
      "Legal structure (501(c)(3), foundation, etc.)",
      "Transaction fee to charity mechanism documented",
      "Percentage or amount per transaction disclosed",
      "Beneficiary confirmation letters",
      "Audit or reporting cadence for humanitarian distributions",
    ],
    proofProvided: [],
    missingEvidence: [
      "Use-of-proceeds policy",
      "Named beneficiaries",
      "Governance controls",
      "Legal structure",
      "Distribution audit",
    ],
    prohibitedTerms: ["every transaction", "global humanitarian", "changes lives automatically"],
    approvedReplacementText:
      "Troptions Unity designates a portion of ecosystem proceeds to named social-impact programs, subject to use-of-proceeds policy, governance controls, legal structure, reporting cadence, and beneficiary confirmation.",
    problemSummary:
      "Humanitarian impact claims without use-of-proceeds controls, governance, legal structure, and beneficiary confirmations are unverifiable and potentially misleading.",
    disclaimerRequired:
      "Charitable or humanitarian impact claims are subject to governance controls and independent verification. Troptions does not guarantee specific humanitarian outcomes.",
    reviewer: "",
    reviewDate: null,
    publishStatus: "blocked",
    nextAction:
      "Define use-of-proceeds policy. Name beneficiaries. Establish governance controls. Engage nonprofit/charity counsel.",
  },

  // ─── Pay Token Claims ─────────────────────────────────────────────────────
  {
    id: "CLAIM-PAY-001",
    sourcePage: "Troptions Pay description",
    sourceUrl: "https://www.troptions.org/",
    originalText: "Troptions Pay enables instant, borderless digital payments.",
    claimType: "payment-utility",
    riskLevel: "HIGH",
    audience: "public",
    currentStatus: "unverified",
    legalStatus: "not-started",
    evidenceStatus: "missing",
    proofRequired: [
      "Payment rail provider agreement (GivBux or equivalent)",
      "Settlement speed documentation",
      "Geographic coverage disclosure",
      "Currency conversion policy",
      "AML/KYC requirements for payments",
      "Money transmission license status by jurisdiction",
      "Transaction limits disclosure",
      "Fee structure",
    ],
    proofProvided: [],
    missingEvidence: [
      "Rail provider agreement",
      "Settlement documentation",
      "MTL status by jurisdiction",
      "Geographic coverage",
    ],
    prohibitedTerms: ["instant payments", "borderless", "zero fees", "unlimited transfers"],
    approvedReplacementText:
      "Troptions Pay is connected to third-party payment rails. Settlement speed, geographic coverage, currency conversion, MTL status, AML/KYC requirements, transaction limits, and fees are disclosed by the rail provider.",
    problemSummary:
      "Payment services may require money transmission licenses. 'Borderless' and 'instant' are unverified. Settlement depends on third-party rail availability.",
    disclaimerRequired:
      "Payment services are subject to third-party rail availability, geographic restrictions, AML/KYC requirements, and applicable money transmission regulations.",
    reviewer: "",
    reviewDate: null,
    publishStatus: "blocked",
    nextAction:
      "Obtain rail provider agreement. Document MTL status. Define geographic coverage and settlement terms.",
  },

  // ─── Presale / Early Investor Claims ──────────────────────────────────────
  {
    id: "CLAIM-PRESALE-001",
    sourcePage: "Troptions presale / early access materials",
    sourceUrl: "https://www.troptions.org/",
    originalText: "Join the Troptions presale — get in early before public launch.",
    claimType: "presale",
    riskLevel: "CRITICAL",
    audience: "public",
    currentStatus: "potential-unregistered-offering",
    legalStatus: "not-started",
    evidenceStatus: "missing",
    proofRequired: [
      "Securities exemption analysis (Reg D, Reg A, Reg CF, or offshore)",
      "Investor accreditation requirements",
      "Offering documents (private placement memo or equivalent)",
      "Transfer restrictions on presale tokens",
      "Lock-up schedule",
      "Use-of-proceeds disclosure",
      "Legal counsel approval for all presale communications",
    ],
    proofProvided: [],
    missingEvidence: [
      "Exemption analysis",
      "Investor accreditation requirements",
      "Offering documents",
      "Transfer restrictions",
      "Legal counsel approval",
    ],
    prohibitedTerms: ["presale", "get in early", "ground floor", "early investor discount", "before public launch"],
    approvedReplacementText:
      "Any presale, early access, or token sale to investors requires securities exemption analysis, investor eligibility determination, offering documents, transfer restrictions, lock-up schedule, use-of-proceeds disclosure, and legal counsel approval before any communications.",
    problemSummary:
      "Token presales may constitute unregistered securities offerings. CRITICAL risk. Cannot appear in any public communications without completed securities counsel review.",
    disclaimerRequired:
      "No presale or token sale to investors is available or offered without completed legal review. This is not an offer to sell securities.",
    reviewer: "",
    reviewDate: null,
    publishStatus: "blocked",
    nextAction:
      "Engage securities counsel immediately. Do not publish any presale materials until exemption analysis and offering documents are complete.",
  },
];

/** Claims that are blocked from publishing */
export function getBlockedClaims(): TroptionsClaim[] {
  return CLAIM_REGISTRY.filter((c) => c.publishStatus === "blocked");
}

/** Claims missing required evidence */
export function getClaimsMissingEvidence(): TroptionsClaim[] {
  return CLAIM_REGISTRY.filter(
    (c) => c.evidenceStatus === "missing" || c.evidenceStatus === "not-started",
  );
}

/** Claims at CRITICAL risk level */
export function getCriticalClaims(): TroptionsClaim[] {
  return CLAIM_REGISTRY.filter((c) => c.riskLevel === "CRITICAL");
}

/** Claims at HIGH risk level */
export function getHighRiskClaims(): TroptionsClaim[] {
  return CLAIM_REGISTRY.filter((c) => c.riskLevel === "HIGH");
}

/** Runtime publish guard */
export function assertClaimCanPublish(claim: TroptionsClaim): void {
  if (claim.publishStatus === "blocked") {
    throw new Error(`[ClaimGuard] Claim "${claim.id}" is blocked from publishing. Next action: ${claim.nextAction}`);
  }
  if ((claim.riskLevel === "HIGH" || claim.riskLevel === "CRITICAL") && claim.evidenceStatus !== "approved") {
    throw new Error(
      `[ClaimGuard] Claim "${claim.id}" is ${claim.riskLevel} risk and requires evidenceStatus = "approved" before publishing.`,
    );
  }
  if (claim.riskLevel === "CRITICAL" && claim.legalStatus !== "approved") {
    throw new Error(
      `[ClaimGuard] Claim "${claim.id}" is CRITICAL risk and requires legalStatus = "approved" before publishing.`,
    );
  }
}

/** Claims by type */
export function getClaimsByType(type: ClaimType): TroptionsClaim[] {
  return CLAIM_REGISTRY.filter((c) => c.claimType === type);
}

/** Claims by risk level */
export function getClaimsByRiskLevel(level: RiskLevel): TroptionsClaim[] {
  return CLAIM_REGISTRY.filter((c) => c.riskLevel === level);
}

/** Claims approved for public use */
export function getApprovedPublicClaims(): TroptionsClaim[] {
  return CLAIM_REGISTRY.filter((c) => c.publishStatus === "approved-public");
}

/** Claims approved for institutional use */
export function getApprovedInstitutionalClaims(): TroptionsClaim[] {
  return CLAIM_REGISTRY.filter(
    (c) => c.publishStatus === "approved-institutional" || c.publishStatus === "approved-public",
  );
}

/** Claims pending review */
export function getPendingReviewClaims(): TroptionsClaim[] {
  return CLAIM_REGISTRY.filter((c) => c.publishStatus === "pending-review");
}

/** Claims that were rejected */
export function getRejectedClaims(): TroptionsClaim[] {
  return CLAIM_REGISTRY.filter((c) => c.publishStatus === "rejected");
}

/** Claims with prohibited terms defined */
export function getClaimsWithProhibitedTerms(): TroptionsClaim[] {
  return CLAIM_REGISTRY.filter((c) => c.prohibitedTerms.length > 0);
}

/** Claims that require legal review (CRITICAL risk or legalStatus not approved) */
export function getClaimsRequiringLegalReview(): TroptionsClaim[] {
  return CLAIM_REGISTRY.filter(
    (c) => c.riskLevel === "CRITICAL" || c.legalStatus === "not-started" || c.legalStatus === "missing",
  );
}

/** Claims with inconsistent data (flagged by currentStatus) */
export function getInconsistentClaims(): TroptionsClaim[] {
  return CLAIM_REGISTRY.filter((c) => c.currentStatus.startsWith("inconsistent"));
}

/** Claims containing a specific term in originalText (case-insensitive) */
export function getClaimsContainingTerm(term: string): TroptionsClaim[] {
  const lower = term.toLowerCase();
  return CLAIM_REGISTRY.filter((c) => c.originalText.toLowerCase().includes(lower));
}

/** Assert no prohibited terms in text (throws on first violation found) */
export function assertNoCriticalBannedTerms(text: string): void {
  for (const claim of CLAIM_REGISTRY) {
    if (claim.riskLevel !== "CRITICAL") continue;
    for (const term of claim.prohibitedTerms) {
      if (text.toLowerCase().includes(term.toLowerCase())) {
        throw new Error(
          `[TermGuard] Prohibited CRITICAL term detected: "${term}" (see ${claim.id}). Use approved replacement text.`,
        );
      }
    }
  }
}
