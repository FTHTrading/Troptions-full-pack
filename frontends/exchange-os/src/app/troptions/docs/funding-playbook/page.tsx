import type { Metadata } from "next";
import Link from "next/link";
import PrintButton from "./PrintButton";

export const metadata: Metadata = {
  title: "RWA Funding Routes Playbook | TROPTIONS",
  description:
    "Complete TROPTIONS funding routes playbook — step-by-step procedures, cookie-cutter intake system, difficulty ratings, and document requirements for every funding route. Print and download as PDF.",
};

// ─── Types ────────────────────────────────────────────────────────────────────

type Difficulty = 1 | 2 | 3 | 4 | 5;

interface ProcedureStep {
  step: number;
  title: string;
  detail: string;
  owner: "CLIENT" | "TROPTIONS" | "THIRD_PARTY" | "SHARED";
  blockerIfMissed?: string;
}

interface RouteDoc {
  document: string;
  required: boolean;
  hardBlocker?: boolean;
  notes?: string;
}

interface FundingRoutePlaybook {
  id: string;
  tier: 1 | 2 | 3;
  displayName: string;
  shortName: string;
  tagline: string;
  description: string;
  status: "AVAILABLE" | "CONDITIONAL" | "BLOCKED_FOR_COAL" | "DEFERRED";
  eligibleAssetTypes: string[];
  blockedAssetTypes: string[];
  difficulty: Difficulty;
  ease: Difficulty; // 5 = very easy, 1 = very hard
  successProbability: string;
  timelineRange: string;
  timelineNote: string;
  typicalAskRange: string;
  procedure: ProcedureStep[];
  requiredDocuments: RouteDoc[];
  successFactors: string[];
  commonBlockers: string[];
  keyCounterparties: string[];
  cookieCutterNotes: string;
  priority: "PURSUE_FIRST" | "PURSUE_PARALLEL" | "PURSUE_LATER" | "BLOCKED";
}

// ─── Route Data ───────────────────────────────────────────────────────────────

const ROUTES: FundingRoutePlaybook[] = [
  // ── TIER 1 ─────────────────────────────────────────────────────────────────
  {
    id: "MERCHANT_CREDIT",
    tier: 1,
    displayName: "Merchant Credit / Trade Settlement",
    shortName: "Merchant Credit",
    tagline: "Fastest path — TROPTIONS-native closed-network settlement",
    description:
      "Use TROPTIONS as a unit of account to settle merchant-to-merchant obligations. No external lender or third-party required. Fastest path to liquidity for clients already operating within the TROPTIONS merchant network. Works for operational trade credit, barter conversions, and closed-loop settlement.",
    status: "AVAILABLE",
    eligibleAssetTypes: ["TROPTIONS", "Trade Credit", "Barter Assets"],
    blockedAssetTypes: ["Mineral Rights", "Gemstones", "Real Estate (open market)"],
    difficulty: 1,
    ease: 5,
    successProbability: "High (70–90%) for existing TROPTIONS merchants",
    timelineRange: "5–15 days",
    timelineNote: "Merchant onboarding can begin same day if KYC is ready",
    typicalAskRange: "$5,000 – $2,000,000 per transaction",
    procedure: [
      { step: 1, title: "Classify the Asset / Transaction", detail: "Determine if the client's asset or trade obligation is suitable for TROPTIONS settlement (merchant goods, services, barter assets, operational trade credit).", owner: "TROPTIONS", blockerIfMissed: "Wrong route selected — cannot force real property through merchant track" },
      { step: 2, title: "KYC the Merchant Entity", detail: "Collect government ID, business registration, and source-of-funds statement for both parties. Use the standard TROPTIONS KYC intake form.", owner: "TROPTIONS" },
      { step: 3, title: "Execute Merchant Onboarding Agreement", detail: "Both parties sign the TROPTIONS Merchant Settlement Agreement accepting TROPTIONS as unit of account and agreeing to redemption/settlement terms.", owner: "SHARED" },
      { step: 4, title: "Value the Transaction", detail: "Agree on the TROPTIONS-denominated value of the goods/services being settled. Use current market reference or agreed schedule.", owner: "SHARED" },
      { step: 5, title: "Issue Settlement Receipt", detail: "Record the settlement in the TROPTIONS ledger. Issue XRPL IOU receipt if both parties are on the XRPL network.", owner: "TROPTIONS" },
      { step: 6, title: "Close and Confirm", detail: "Both parties confirm receipt and delivery. File the transaction record and retain for compliance documentation.", owner: "SHARED" },
    ],
    requiredDocuments: [
      { document: "Government-issued ID (both parties)", required: true, hardBlocker: true },
      { document: "Business registration / EIN", required: true, hardBlocker: true },
      { document: "Merchant Onboarding Agreement (signed)", required: true, hardBlocker: true },
      { document: "Transaction valuation schedule", required: true },
      { document: "Source-of-funds statement", required: true },
      { document: "XRPL wallet address (if receipt issued)", required: false, notes: "Only needed for XRPL IOU track" },
    ],
    successFactors: [
      "Both parties are existing TROPTIONS merchants or willing to onboard",
      "Transaction is operational trade (goods/services) not regulated securities",
      "KYC is complete for both parties",
      "Clear agreement on TROPTIONS-denominated value",
    ],
    commonBlockers: [
      "Client expects cash payout — must explain TROPTIONS settlement model",
      "Asset is real property / mineral rights — wrong route, redirect to Private Lender or Operator JV",
      "One party unwilling to accept TROPTIONS as settlement unit",
    ],
    keyCounterparties: ["Merchant counterparty", "TROPTIONS compliance team"],
    cookieCutterNotes: "Best for TROPTIONS-native deals. Use Day-1 intake question: 'Is this a goods/services trade or asset-backed financing need?' If trade → this route. If asset → Tier 2/3.",
    priority: "PURSUE_FIRST",
  },
  {
    id: "SERVICE_FEE",
    tier: 1,
    displayName: "Verification-as-a-Service / Origination Fee",
    shortName: "Service Fee",
    tagline: "Scalable — earn per client onboarded regardless of funding outcome",
    description:
      "TROPTIONS earns origination, packaging, and administration fees for managing the asset verification, document collection, and funding route preparation on behalf of asset owners. This route generates immediate revenue before any lender or buyer is engaged. Highly scalable and the foundation of a cookie-cutter system.",
    status: "AVAILABLE",
    eligibleAssetTypes: ["All asset types", "Mineral Rights", "Gemstones", "Carbon Credits", "Real Estate", "TROPTIONS"],
    blockedAssetTypes: [],
    difficulty: 1,
    ease: 5,
    successProbability: "Very High (85–95%) — revenue does not depend on funding closing",
    timelineRange: "15–30 days per client engagement",
    timelineNote: "Fee is earned during document collection and package preparation phases",
    typicalAskRange: "$2,500 – $25,000 origination + $500–$3,000/month administration",
    procedure: [
      { step: 1, title: "Client Intake and Fee Agreement", detail: "Conduct 30-minute intake call. Classify asset type. Present the TROPTIONS packaging fee schedule. Execute a signed Fee Agreement before any work begins.", owner: "TROPTIONS", blockerIfMissed: "Do not begin work without signed fee agreement" },
      { step: 2, title: "Issue Document Request Packet", detail: "Send the standard TROPTIONS Document Request Packet for the client's asset type (use our cookie-cutter checklists below). Set a 10-business-day submission deadline.", owner: "TROPTIONS" },
      { step: 3, title: "Score the Asset Package", detail: "As documents arrive, score them against the TROPTIONS Readiness Matrix (Technical/Title/Permitting/Commercial). Update client on score weekly.", owner: "TROPTIONS" },
      { step: 4, title: "Prepare the Funding Package", detail: "Compile executive summary, readiness score card, document index, and lender/buyer presentation. Use our standard templates.", owner: "TROPTIONS" },
      { step: 5, title: "Present Route Recommendations", detail: "Present 2–3 ranked funding route options based on readiness score and asset type. Include timeline and probability estimates.", owner: "TROPTIONS" },
      { step: 6, title: "Invoice and Collect", detail: "Invoice the origination fee upon package delivery. Invoice monthly administration fee for ongoing management.", owner: "TROPTIONS" },
    ],
    requiredDocuments: [
      { document: "Signed Fee Agreement / Engagement Letter", required: true, hardBlocker: true },
      { document: "KYC on asset owner(s)", required: true, hardBlocker: true },
      { document: "Asset description and appraisal (any version)", required: true },
      { document: "Ownership documentation (any form at intake)", required: false, notes: "Full title work collected as part of the service" },
    ],
    successFactors: [
      "Fee agreement signed before work begins — never work for free on hope of commission",
      "Clear scope of deliverables in the engagement letter",
      "Repeatable process using standard document request templates",
      "Score-based progress reporting keeps client engaged and accountable",
    ],
    commonBlockers: [
      "Client refuses to pay packaging fee — educate on value; if unwilling, do not proceed",
      "Asset has zero documentation — adjust fee upward for high-effort intake",
      "Client expects immediate funding — set realistic expectations at intake",
    ],
    keyCounterparties: ["Asset owner", "TROPTIONS internal team"],
    cookieCutterNotes: "This is the foundational revenue model for every client regardless of outcome. Always execute a Fee Agreement first. Stack this with every other route.",
    priority: "PURSUE_FIRST",
  },
  {
    id: "ASSET_BUYER",
    tier: 1,
    displayName: "Asset Buyer / Strategic Partner",
    shortName: "Direct Buyer",
    tagline: "Fast cash — for liquid, registry-verifiable commodities",
    description:
      "Source a direct buyer, off-taker, or strategic partner for the underlying asset. Works best for liquid assets with active commodity markets: gold, silver, carbon credits, verified BTC receipts. Buyer pays cash or structured consideration for the asset itself. Fastest route to actual cash for qualifying assets.",
    status: "CONDITIONAL",
    eligibleAssetTypes: ["Gold / Precious Metals", "Carbon Credits (verified registry)", "BTC Receipts", "Timber", "Grain / Ag Commodities"],
    blockedAssetTypes: ["Unverified mineral rights", "Raw gemstones (no assay)", "TROPTIONS (use Merchant Credit)"],
    difficulty: 2,
    ease: 4,
    successProbability: "Moderate–High (50–75%) for verifiable liquid assets",
    timelineRange: "30–90 days",
    timelineNote: "Registry verification and AML screening add 2–4 weeks minimum",
    typicalAskRange: "$50,000 – $50,000,000 depending on asset",
    procedure: [
      { step: 1, title: "Verify Asset Registries and Ownership", detail: "Confirm serial numbers, registry records, or assay certificates. Gold: assay + vault confirmation. Carbon: Verra/Gold Standard registry ID. BTC: verified custody statement.", owner: "SHARED", blockerIfMissed: "No serious buyer will engage without verified ownership proof" },
      { step: 2, title: "AML / Source-of-Funds Declaration", detail: "Client completes source-of-funds declaration explaining the origin of the asset. Retain for compliance file.", owner: "CLIENT" },
      { step: 3, title: "Establish Market Value Reference", detail: "Pull current commodity prices or registry values. For gold: London Fix. For carbon: registry spot price. For BTC: CME reference.", owner: "TROPTIONS" },
      { step: 4, title: "Prepare Asset Sale Package", detail: "One-page asset summary with: serial/registry ID, quantity, grade/quality, custody location, asking price, ownership proof summary, and contact information.", owner: "TROPTIONS" },
      { step: 5, title: "Approach Buyer / Broker Network", detail: "Present the package to our qualified buyer network. For carbon: contact registered carbon brokers. For gold: approach vault-connected dealers. For BTC: crypto OTC desks.", owner: "TROPTIONS", blockerIfMissed: "Buyer selection drives deal quality — vet counterparties carefully" },
      { step: 6, title: "Negotiate and Execute LOI", detail: "Negotiate price, payment terms, and transfer conditions. Execute Letter of Intent before any asset movement.", owner: "SHARED" },
      { step: 7, title: "KYC Buyer and Confirm Wire Pathway", detail: "Full KYC on buying entity. Confirm bank wire or on-chain settlement pathway. Retain all wire details in compliance file.", owner: "TROPTIONS" },
      { step: 8, title: "Transfer Asset and Collect", detail: "Coordinate asset transfer simultaneous with or after confirmed payment receipt. Issue transfer receipt and close compliance file.", owner: "SHARED" },
    ],
    requiredDocuments: [
      { document: "Asset registry certificate or assay report", required: true, hardBlocker: true },
      { document: "Serial numbers or custody statement", required: true, hardBlocker: true },
      { document: "Current ownership documentation", required: true, hardBlocker: true },
      { document: "AML / source-of-funds declaration", required: true, hardBlocker: true },
      { document: "KYC on seller and buyer", required: true },
      { document: "Letter of Intent (LOI)", required: true },
      { document: "Transfer / settlement confirmation", required: true },
    ],
    successFactors: [
      "Asset has verifiable registry record or assay certificate",
      "Commodity is liquid with active market (gold, carbon, BTC)",
      "Owner has clear, unencumbered title",
      "TROPTIONS has pre-qualified buyers in the asset category",
    ],
    commonBlockers: [
      "Asset cannot be verified by independent third-party registry",
      "Owner cannot prove unencumbered title",
      "AML concerns on source of asset",
      "Buyer network not active for specific commodity",
    ],
    keyCounterparties: ["Commodity buyer / OTC desk", "Carbon broker", "Vault custodian", "Escrow agent"],
    cookieCutterNotes: "Run Day-1 asset classification: if the asset has a commodity ticker and active market price, this route is primary. If not, pivot to Private Lender or Operator JV.",
    priority: "PURSUE_PARALLEL",
  },

  // ── TIER 2 ─────────────────────────────────────────────────────────────────
  {
    id: "ROYALTY_STREAMING",
    tier: 2,
    displayName: "Royalty Streaming Agreement",
    shortName: "Royalty Stream",
    tagline: "Non-dilutive capital — upfront cash for a share of future production revenue",
    description:
      "A streaming company or royalty fund provides upfront capital in exchange for the right to purchase a percentage of future production at a fixed (below-market) price. No loan repayment schedule. No equity dilution. Works for mineral rights, oil & gas, timber, and other production assets. Ideal when title is clear but permitting is pending.",
    status: "CONDITIONAL",
    eligibleAssetTypes: ["Coal / Mineral Rights", "Oil & Gas Royalties", "Precious Metals (in-ground)", "Timber", "Water Rights"],
    blockedAssetTypes: ["TROPTIONS", "Carbon Credits (retired)", "Gemstones (no production)"],
    difficulty: 3,
    ease: 3,
    successProbability: "Moderate (35–60%) — requires clear title and credible production story",
    timelineRange: "45–90 days",
    timelineNote: "Streaming companies move faster than banks but require production-stage diligence",
    typicalAskRange: "$500,000 – $50,000,000 upfront",
    procedure: [
      { step: 1, title: "Clear Title — Non-Negotiable First Step", detail: "Obtain current deed, mineral rights deed, chain of title, and lien/UCC search results. No streaming company will engage without confirmed title. This is the single most critical gate.", owner: "CLIENT", blockerIfMissed: "HARD BLOCK — streaming companies will not advance without clear title" },
      { step: 2, title: "Obtain Updated Independent Technical Report", detail: "Engage a Qualified Person (QP) for an updated reserve estimate and production feasibility study. The 2020 appraisal should be current-dated and include production scenarios.", owner: "CLIENT", blockerIfMissed: "Streaming companies underwrite production cash flows — stale reserve data blocks advance" },
      { step: 3, title: "Model the Royalty Economics", detail: "Build a simple royalty model: (Streaming %) × (Production Volume) × (Commodity Price) = annual royalty. Back-calculate the upfront advance the streaming company is likely to offer at a 1.2–2.0x stream multiple.", owner: "TROPTIONS" },
      { step: 4, title: "Prepare Streaming Presentation Package", detail: "Executive summary, reserve estimate, production scenario, royalty model, title/ownership summary, environmental status, operator LOI (if any), and use-of-proceeds plan.", owner: "TROPTIONS" },
      { step: 5, title: "Approach Royalty / Streaming Funds", detail: "Target streaming companies appropriate to asset size: Franco-Nevada, Royal Gold, Wheaton Precious Metals for precious metals; coal-specific royalty funds for coal. For smaller deals: private royalty funds and family office royalty desks.", owner: "TROPTIONS" },
      { step: 6, title: "Negotiate Streaming Terms", detail: "Key terms: upfront advance amount, stream percentage, fixed purchase price (% of spot), production threshold, minimum royalty floor, buyback provisions.", owner: "SHARED" },
      { step: 7, title: "Legal Diligence and Closing", detail: "Streaming company counsel conducts 4–6 week legal diligence on title, environmental, and technical. TROPTIONS coordinates document production. Close and fund.", owner: "THIRD_PARTY" },
    ],
    requiredDocuments: [
      { document: "Current Deed", required: true, hardBlocker: true },
      { document: "Mineral Rights Deed", required: true, hardBlocker: true },
      { document: "Chain of Title", required: true, hardBlocker: true },
      { document: "Lien / Mortgage Search", required: true, hardBlocker: true },
      { document: "Updated QP / Reserve Report (within 2 years)", required: true, hardBlocker: true },
      { document: "Permit Status Report", required: true },
      { document: "Environmental Assessment (Phase I)", required: true },
      { document: "Operator LOI (preferred)", required: false, notes: "Greatly increases advance rate; not always required at term sheet stage" },
      { document: "Legal Opinion on Title", required: true },
      { document: "Use of Proceeds Plan", required: true },
    ],
    successFactors: [
      "Clean title with no encumbrances",
      "Credible, current reserve estimate from qualified engineer",
      "Commodity with active streaming market (coal harder than gold/silver)",
      "Operator LOI showing production pathway",
      "Environmental clean bill of health (or bond estimate secured)",
    ],
    commonBlockers: [
      "Title defects or gaps in chain of title",
      "Stale or unverified reserve estimates",
      "No operator or production pathway",
      "Coal specifically has fewer active streaming funds than precious metals",
      "Environmental liability uncertainty",
    ],
    keyCounterparties: ["Royalty streaming fund", "Qualified Person (independent engineer)", "Title company", "Environmental consultant"],
    cookieCutterNotes: "This is the primary non-dilutive route for mineral rights clients once title is clear. Build the royalty model on Day 3 of engagement to qualify size of deal before spending on legal.",
    priority: "PURSUE_PARALLEL",
  },
  {
    id: "DILIGENCE_BRIDGE",
    tier: 2,
    displayName: "Diligence Bridge Loan",
    shortName: "Diligence Bridge",
    tagline: "Fast gap capital to complete the document package and unlock permanent financing",
    description:
      "A short-term (3–12 month) bridge loan secured against the asset to fund the cost of completing the document package (title work, updated QP report, legal opinion, environmental). Bridge is repaid at closing of the permanent financing. Rates are higher (12–24% annualized) but the purpose is to unlock a much larger permanent facility. Best use: client has strong technical evidence but is blocked on title/legal/permitting costs.",
    status: "CONDITIONAL",
    eligibleAssetTypes: ["Mineral Rights", "Real Estate", "Oil & Gas", "Timber"],
    blockedAssetTypes: ["TROPTIONS (no collateral basis)", "Carbon Credits (insufficient collateral for bridge)"],
    difficulty: 3,
    ease: 4,
    successProbability: "Moderate–High (50–70%) for assets with strong technical evidence",
    timelineRange: "21–45 days to close bridge",
    timelineNote: "Bridge lenders move fast — most can close in 2–3 weeks on strong packages",
    typicalAskRange: "$50,000 – $2,000,000 bridge (to fund completion costs)",
    procedure: [
      { step: 1, title: "Assess Bridge-Worthiness", detail: "The asset must have sufficient technical evidence to justify the bridge lender's collateral risk. For PATE-COAL-001: the engineering appraisal provides the technical basis. Score must be ≥ 30/100.", owner: "TROPTIONS" },
      { step: 2, title: "Define Use of Bridge Proceeds", detail: "Itemize exactly what the bridge will fund: title search ($2–5K), updated QP report ($15–50K), legal opinion ($5–15K), Phase I ESA ($3–8K), permit status ($2–5K). Total typical: $25,000 – $85,000.", owner: "TROPTIONS" },
      { step: 3, title: "Prepare Bridge Lender Package", detail: "One-pager on asset + appraisal summary, specific use of proceeds, exit strategy (which permanent financing route closes out the bridge), personal guarantee or other security.", owner: "TROPTIONS" },
      { step: 4, title: "Source Bridge Lender", detail: "Approach hard-money lenders, asset-based lenders, and private credit funds that specialize in pre-development bridge financing. TROPTIONS network first; broker network second.", owner: "TROPTIONS" },
      { step: 5, title: "Negotiate Bridge Terms", detail: "Key terms: rate (12–24%), term (6–12 months), origination fee (1–3%), exit fee (0–2%), collateral (asset pledge or personal guarantee), prepayment penalty.", owner: "SHARED" },
      { step: 6, title: "Execute Bridge and Deploy Capital", detail: "Close bridge, deploy against the approved use-of-proceeds schedule. Begin all document collection tasks funded by bridge in parallel.", owner: "SHARED" },
      { step: 7, title: "Complete Document Package and Exit Bridge", detail: "Use bridge proceeds to complete title, legal, technical, and permitting documents. Once package scores ≥ 70/100, execute permanent financing and repay bridge from proceeds.", owner: "SHARED" },
    ],
    requiredDocuments: [
      { document: "Engineering appraisal or technical report", required: true, hardBlocker: true, notes: "Bridge lender's primary collateral basis" },
      { document: "Asset ownership statement (any form)", required: true, hardBlocker: true },
      { document: "Use of bridge proceeds — itemized budget", required: true, hardBlocker: true },
      { document: "Exit strategy memo (which permanent route, expected timeline)", required: true, hardBlocker: true },
      { document: "Personal guarantee or secondary collateral", required: false, notes: "Usually required for sub-70% readiness assets" },
      { document: "Entity formation documents (LLC/Corp)", required: true },
    ],
    successFactors: [
      "Strong technical evidence (engineering appraisal, reserve report) already in hand",
      "Clear itemized use of proceeds — bridge lender wants to see exactly where money goes",
      "Credible exit strategy to permanent financing",
      "Guarantor has sufficient net worth to backstop",
    ],
    commonBlockers: [
      "No technical evidence — bridge lender has no collateral basis",
      "Client has no exit strategy from bridge — high refusal rate",
      "Asset encumbered by prior liens",
      "Guarantor net worth insufficient",
    ],
    keyCounterparties: ["Hard-money / bridge lender", "Title company", "Independent engineer (QP)", "Closing attorney"],
    cookieCutterNotes: "Use this when client has a strong appraisal but no cash to complete the package. Present bridge as the 'unlock fee' for permanent financing. Build the bridge-to-permanent waterfall model at intake.",
    priority: "PURSUE_FIRST",
  },
  {
    id: "OPERATOR_JV",
    tier: 2,
    displayName: "Operator Joint Venture / Co-Development Agreement",
    shortName: "Operator JV",
    tagline: "Bring in an operator who provides capital and expertise in exchange for equity or revenue share",
    description:
      "Structure a joint venture or co-development agreement with an experienced mine operator, energy company, or development firm. The operator brings capital, equipment, and operating expertise; the asset owner provides the mineral rights, land, or proven reserves. Operator typically receives 40–70% of project economics in exchange for development capital and operational management.",
    status: "CONDITIONAL",
    eligibleAssetTypes: ["Coal / Mineral Rights", "Oil & Gas", "Timber", "Quarry / Aggregate", "Gold / Silver Mine"],
    blockedAssetTypes: ["TROPTIONS", "Carbon Credits", "Financial Assets"],
    difficulty: 3,
    ease: 3,
    successProbability: "Moderate (40–65%) — depends heavily on operator interest in the specific geology",
    timelineRange: "45–90 days to LOI; 6–18 months to closing and first capital deployment",
    timelineNote: "LOI is fast; JV negotiation and legal are slow — plan for 12+ months to first production capital",
    typicalAskRange: "No cash payment — operator funds development; asset owner receives % of production profits",
    procedure: [
      { step: 1, title: "Establish Clear Title", detail: "Operator JV requires unambiguous ownership of the mineral rights. Title opinion, deed, and mineral rights deed are non-negotiable before any operator will engage seriously.", owner: "CLIENT", blockerIfMissed: "No operator will sign a binding JV without clear title" },
      { step: 2, title: "Prepare the Technical Data Room", detail: "Compile all technical documents: engineering appraisal, reserve tables, seam analysis, geology maps. The more detail, the stronger the JV negotiating position.", owner: "CLIENT" },
      { step: 3, title: "Develop the JV Term Sheet Framework", detail: "Define what the asset owner is offering: mineral rights access, surface rights (if any), existing permits. Define what the asset owner wants: upfront advance, profit share %, royalty %, carried interest.", owner: "TROPTIONS" },
      { step: 4, title: "Identify and Approach Operators", detail: "Research coal operators active in East Tennessee / Cumberland Plateau region. Check MSHA operator registry. Approach 3–5 qualified operators with a teaser (no proprietary data until NDA).", owner: "TROPTIONS" },
      { step: 5, title: "Execute NDAs and Share Data Room", detail: "All operators sign a mutual NDA before receiving reserve data, geology reports, or financial projections.", owner: "SHARED" },
      { step: 6, title: "Receive and Compare Operator Proposals", detail: "Allow 30 days for operators to submit JV proposals. Compare on: upfront capital offer, royalty rate, profit share, timeline to production, operator track record.", owner: "TROPTIONS" },
      { step: 7, title: "Negotiate and Execute LOI", detail: "Select best operator. Negotiate LOI covering: upfront advance, development capital commitment, profit split, royalty, term, area of mutual interest.", owner: "SHARED" },
      { step: 8, title: "Full Legal Negotiation of JV Agreement", detail: "Engage specialized mining / energy JV attorneys. Negotiate full JV agreement, surface use agreement, and operating agreement. Typically 60–120 day process.", owner: "THIRD_PARTY" },
      { step: 9, title: "Close JV and Begin Development Phase", detail: "Sign JV agreement, transfer necessary rights, receive advance (if structured), and operator begins permitting and development process.", owner: "SHARED" },
    ],
    requiredDocuments: [
      { document: "Current Deed and Mineral Rights Deed", required: true, hardBlocker: true },
      { document: "Chain of Title", required: true, hardBlocker: true },
      { document: "Legal Opinion on Title", required: true, hardBlocker: true },
      { document: "Engineering / Reserve Report (updated within 3 years)", required: true, hardBlocker: true },
      { document: "Permit Status Report", required: true },
      { document: "Surface Rights Agreement (if mineral-only)", required: true },
      { document: "Phase I Environmental Site Assessment", required: true },
      { document: "NDAs (signed by all operator contacts)", required: true },
      { document: "JV Term Sheet", required: true },
      { document: "Full JV Agreement (at closing)", required: true },
    ],
    successFactors: [
      "Asset is in a geologically active area with proven operator interest",
      "Reserve size is commercial-scale (enough to attract a serious operator)",
      "Title is clean and transferable",
      "Owner has realistic economic expectations (50%+ to operator is typical)",
      "Permitting pathway is clear or well-understood",
    ],
    commonBlockers: [
      "Title defects — operators will not execute until resolved",
      "Reserve estimates are too small to attract a commercial operator",
      "Permitting is politically or environmentally blocked",
      "Owner expects cash upfront; JV does not guarantee cash before production",
      "Geographic area not active in current market cycle",
    ],
    keyCounterparties: ["Coal / mineral operator (MSHA registered)", "Mining/energy attorney", "Independent engineer (QP)", "Permitting consultant"],
    cookieCutterNotes: "Present JV as the 'development partner model' — owner provides rights, operator provides capital and expertise, both share upside. Run this in parallel with Royalty Streaming so you have two competing term sheets.",
    priority: "PURSUE_PARALLEL",
  },
  {
    id: "PRIVATE_LENDER",
    tier: 2,
    displayName: "Private Lender / Family Office",
    shortName: "Private Lender",
    tagline: "Asset-backed loan — full package required, broadest asset class coverage",
    description:
      "Obtain a secured loan or credit facility from an accredited private lender, family office, or private credit fund using the asset as collateral. The lender reviews the full asset package, orders independent diligence, and advances 20–60% of appraised value. This is the most common first institutional financing for non-liquid RWA types.",
    status: "CONDITIONAL",
    eligibleAssetTypes: ["Mineral Rights", "Real Estate", "Gemstones (large, certified)", "Gold / Metals", "TROPTIONS (structured)", "Other RWA"],
    blockedAssetTypes: ["TROPTIONS (casual) — use Merchant Credit"],
    difficulty: 3,
    ease: 2,
    successProbability: "Moderate (40–65%) — very package-dependent; requires complete file",
    timelineRange: "45–120 days from complete package submission",
    timelineNote: "45 days is optimistic with a tight package; 120 days is typical for complex assets",
    typicalAskRange: "$100,000 – $50,000,000 (20–60% LTV against appraised value)",
    procedure: [
      { step: 1, title: "Achieve ≥ 70/100 Readiness Score", detail: "Private lenders require a substantially complete package. Target all 8 hard-blocker documents before approaching any lender: Deed, Mineral Rights Deed, Chain of Title, Lien Search, Title Opinion, Permit Status, Legal Opinion, Updated QP Report.", owner: "SHARED", blockerIfMissed: "HARD BLOCK — lender engagement before package is complete wastes credibility" },
      { step: 2, title: "Determine Loan Structure", detail: "Decide on loan structure: term loan (lump sum advance), revolving credit line, or bridge-to-perm. Decide on collateral pledge: full asset, partial, or cross-collateralized with other assets.", owner: "TROPTIONS" },
      { step: 3, title: "Prepare the Lender Packet", detail: "Executive summary, asset profile, readiness score, all supporting documents indexed and tabbed, appraisal, legal opinion, insurance certificate, SPV/pledge documentation, KYC package.", owner: "TROPTIONS" },
      { step: 4, title: "Sign NDA with Lender and Submit Package", detail: "Execute mutual NDA before sharing proprietary reserve or geological data. Submit complete package electronically with cover letter stating ask, use of proceeds, and repayment source.", owner: "SHARED" },
      { step: 5, title: "Lender Orders Independent Diligence", detail: "Lender will order their own appraisal, title review, and possibly environmental assessment. Budget 3–6 weeks. TROPTIONS coordinates document production and answers queries.", owner: "THIRD_PARTY" },
      { step: 6, title: "Receive and Review Term Sheet", detail: "Lender issues indicative term sheet. Key terms: advance rate (%), interest rate, term, origination fee, covenants, prepayment terms, cross-default provisions.", owner: "THIRD_PARTY" },
      { step: 7, title: "Negotiate and Execute Term Sheet", detail: "Counter where warranted (rate, fee, advance rate). Execute term sheet. Do not commit to exclusivity without timeline protection.", owner: "SHARED" },
      { step: 8, title: "Lender Conducts Final Diligence", detail: "Lender completes legal, title, and collateral diligence. TROPTIONS provides any additional requested documents within 48 hours.", owner: "THIRD_PARTY" },
      { step: 9, title: "Close Loan and Fund", detail: "Sign loan documents, pledge/transfer collateral to lender's custody, receive advance. File all closing documents in compliance record.", owner: "SHARED" },
    ],
    requiredDocuments: [
      { document: "Current Deed", required: true, hardBlocker: true },
      { document: "Mineral Rights Deed", required: true, hardBlocker: true },
      { document: "Chain of Title", required: true, hardBlocker: true },
      { document: "Lien / Mortgage Search", required: true, hardBlocker: true },
      { document: "Title Opinion (attorney-issued)", required: true, hardBlocker: true },
      { document: "Permit Status Report", required: true, hardBlocker: true },
      { document: "Legal Opinion on Structure", required: true, hardBlocker: true },
      { document: "Updated QP / Reserve Report", required: true, hardBlocker: true },
      { document: "Independent Appraisal (lender-ordered)", required: true },
      { document: "KYC Package (borrower entity)", required: true },
      { document: "Insurance Certificate", required: true },
      { document: "SPV / Pledge Agreement", required: true },
      { document: "Use of Proceeds Statement", required: true },
      { document: "Personal Guarantee (if required)", required: false },
    ],
    successFactors: [
      "All 8 hard-blocker documents completed before approaching lender",
      "Asset appraisal supports requested advance amount with headroom",
      "Borrower has clean credit and sufficient net worth",
      "Clear repayment source (operating cash flow, sale, refinance)",
      "SPV / legal wrapper properly structured",
    ],
    commonBlockers: [
      "Package incomplete when lender is approached — wastes credibility, kills deal",
      "Advance rate expectations too high (owner thinks LTV will be 80% on in-place value — it won't be)",
      "No operating agreement or production pathway — lender sees no exit",
      "Environmental liability unsecured",
      "Borrower credit or net worth insufficient",
    ],
    keyCounterparties: ["Private lender / credit fund", "Title company", "Independent appraiser (lender-approved)", "Closing attorney", "Insurance broker"],
    cookieCutterNotes: "Never approach a private lender with a partial package. Spend 2–4 weeks completing the file first (use Diligence Bridge if needed). This is the 'institutional path' — respect the process.",
    priority: "PURSUE_LATER",
  },

  // ── TIER 3 ─────────────────────────────────────────────────────────────────
  {
    id: "PRIVATE_MINERAL_LENDER",
    tier: 3,
    displayName: "Private Mineral Rights Lender",
    shortName: "Mineral Lender",
    tagline: "Specialized lender class for confirmed mineral rights with production pathway",
    description:
      "A narrow category of private lenders who specialize specifically in mineral rights financing — coal, oil & gas, precious metals, and royalty interests. These lenders have in-house geological expertise and different underwriting models than generalist private lenders. They focus on recoverable reserve value and production economics, not in-place value. Advance rates: 10–30% of estimated recoverable value (NOT in-place value).",
    status: "CONDITIONAL",
    eligibleAssetTypes: ["Coal Mineral Rights", "Oil & Gas Royalties", "Precious Metal Mineral Rights"],
    blockedAssetTypes: ["TROPTIONS", "Carbon Credits", "Gemstones (surface)"],
    difficulty: 4,
    ease: 2,
    successProbability: "Lower–Moderate (25–50%) — very few lenders in this category; strict underwriting",
    timelineRange: "60–120 days from complete package",
    timelineNote: "Mineral lenders are thorough and slow — they order their own geological assessment",
    typicalAskRange: "$250,000 – $20,000,000 (10–30% of recoverable reserve value, NOT in-place value)",
    procedure: [
      { step: 1, title: "Complete ALL Hard-Blocker Documents", detail: "All 8 hard-blocker documents must be in hand. Mineral lenders are the most strict lender class — any missing title document is an immediate disqualification.", owner: "CLIENT", blockerIfMissed: "HARD BLOCK — mineral lenders will not issue even a preliminary LOI without complete title" },
      { step: 2, title: "Commission Updated QP Report with Production Economics", detail: "Engage a Qualified Person to produce a reserve estimate that includes production scenarios, cost estimates, and cash flow projections. This is the primary underwriting document for mineral lenders.", owner: "CLIENT" },
      { step: 3, title: "Secure Operator LOI or Binding Offtake", detail: "Without an operator willing to mine or a buyer willing to purchase production, mineral lenders rarely advance. Secure at minimum a conditional operator LOI.", owner: "CLIENT", blockerIfMissed: "Most mineral lenders require demonstrated production pathway" },
      { step: 4, title: "Prepare Mineral Finance Package", detail: "Full package with emphasis on: recoverable reserve calculations, production cost estimates, operator credentials, commodity price sensitivity analysis, environmental compliance status.", owner: "TROPTIONS" },
      { step: 5, title: "Identify Mineral Finance Specialists", detail: "Research private credit firms and family offices with mineral rights portfolios. Smaller, specialist firms are more likely to engage than large institutions. TROPTIONS maintains a specialist lender directory.", owner: "TROPTIONS" },
      { step: 6, title: "Submit to 3–5 Mineral Lenders Simultaneously", detail: "Submit to multiple lenders in parallel to create competitive tension. Include cover letter noting multiple submissions. Allow 30 days for preliminary responses.", owner: "TROPTIONS" },
      { step: 7, title: "Field Lender Due Diligence", detail: "Mineral lenders will conduct 6–10 week independent geological review. TROPTIONS coordinates site visits, document production, and management interviews.", owner: "SHARED" },
      { step: 8, title: "Negotiate and Close", detail: "Compare term sheets on: advance rate (10–30% of recoverable value), interest rate (typically 12–20%), term (3–7 years), royalty override, operator approval rights.", owner: "SHARED" },
    ],
    requiredDocuments: [
      { document: "All 8 hard-blocker documents (see Private Lender route)", required: true, hardBlocker: true },
      { document: "Updated QP Report with Production Economics", required: true, hardBlocker: true },
      { document: "Operator LOI or Binding Offtake Agreement", required: true, hardBlocker: true, notes: "Strong preference — nearly required" },
      { document: "MSHA Permit Status", required: true },
      { document: "Reclamation Bond Estimate", required: true },
      { document: "Phase I Environmental Site Assessment", required: true },
      { document: "Commodity Price Sensitivity Analysis", required: true },
      { document: "Production Cash Flow Model (3 scenarios: base/bull/bear)", required: true },
      { document: "Insurance Certificate (mining operations coverage)", required: true },
    ],
    successFactors: [
      "All title and legal documentation complete and clean",
      "Current QP report with production economics — not just in-place appraisal",
      "Operator LOI or committed offtake buyer",
      "Environmental pathway understood and bonded",
      "Borrower team has operational credibility in mining",
    ],
    commonBlockers: [
      "Lender focuses on recoverable value (10–30% of in-place) — owner's expectations must adjust",
      "No operator identified — lender has no production pathway",
      "Stale or insufficient reserve data",
      "Environmental cleanup liability not quantified",
      "Very few mineral-specific lenders exist at sub-$5M deal size",
    ],
    keyCounterparties: ["Mineral rights lender / private credit firm", "Independent Qualified Person (geologist/engineer)", "Mining attorney", "MSHA compliance consultant"],
    cookieCutterNotes: "This route requires the most complete package of any route. Do NOT pursue until readiness score ≥ 80/100. Run in parallel with Operator JV to create deal-making momentum.",
    priority: "PURSUE_LATER",
  },
  {
    id: "XRPL_RECEIPT",
    tier: 3,
    displayName: "XRPL Permissioned IOU Receipt",
    shortName: "XRPL Receipt",
    tagline: "Digital proof layer — blockchain-recorded ownership receipt for qualified counterparties",
    description:
      "Issue permissioned XRPL trustline IOUs as machine-readable ownership receipts to qualified counterparties (lenders, operators, custodians). The IOU is a RECEIPT — not a security, not a guarantee, not a promise of payment. It creates a tamper-evident, timestamped digital record of the asset claim that can be referenced in lender packages, title insurance, and structured finance documentation.",
    status: "CONDITIONAL",
    eligibleAssetTypes: ["All verified asset types after title completion"],
    blockedAssetTypes: ["Assets with unresolved title", "Assets without legal opinion"],
    difficulty: 4,
    ease: 3,
    successProbability: "High (70–85%) as a documentation layer; low as a standalone financing route",
    timelineRange: "30–60 days from IOU readiness package completion",
    timelineNote: "Technical setup is fast (1–2 days); legal framework and counterparty onboarding is the bottleneck",
    typicalAskRange: "N/A — this is a documentation / receipt layer, not a capital raise by itself",
    procedure: [
      { step: 1, title: "Confirm Legal Framework", detail: "Obtain legal opinion that the XRPL IOU is a receipt instrument only — not a security, not a note, not an investment contract. This opinion is required before any IOU is issued.", owner: "THIRD_PARTY", blockerIfMissed: "HARD BLOCK — issuing without legal opinion creates securities law exposure" },
      { step: 2, title: "Establish XRPL Issuer Account", detail: "Create a funded XRPL issuer account. Set up domain verification (DNS TXT record linking xrpl.toml). Configure account flags: no freeze (or with freeze per regulatory requirement).", owner: "TROPTIONS" },
      { step: 3, title: "Define Currency Code and Redemption Terms", detail: "Choose XRPL currency code (e.g., PATE001 for PATE-COAL-001). Document precisely what the IOU represents and what triggers redemption. Include all redemption conditions in the issuer policy document.", owner: "TROPTIONS" },
      { step: 4, title: "Onboard Authorized Trustline Holders", detail: "Only issue to pre-approved, KYC-verified counterparties. Each holder must sign a trustline authorization agreement acknowledging the receipt-only nature of the IOU.", owner: "TROPTIONS" },
      { step: 5, title: "Issue IOUs", detail: "Configure XRPL trustlines for each authorized holder. Issue the appropriate IOU amount to each. Record in the compliance ledger.", owner: "TROPTIONS" },
      { step: 6, title: "Maintain Issuer Policy Compliance", detail: "Publish and maintain issuer policy at xrpl.toml. Do not allow secondary market trading without separate legal analysis. Monitor for unauthorized transfers.", owner: "TROPTIONS" },
      { step: 7, title: "Reference in Lender Packages", detail: "Include the XRPL receipt hash and issuer address in all lender packages as tamper-evident proof of asset record. Lenders can independently verify on the XRPL ledger.", owner: "TROPTIONS" },
    ],
    requiredDocuments: [
      { document: "Legal Opinion (IOU as receipt, not security)", required: true, hardBlocker: true },
      { document: "XRPL Issuer Policy Document", required: true, hardBlocker: true },
      { document: "Issuer Account Setup and Domain Verification", required: true, hardBlocker: true },
      { document: "KYC on all trustline holders", required: true, hardBlocker: true },
      { document: "Trustline Authorization Agreement (signed by each holder)", required: true },
      { document: "Underlying asset documentation (all title + technical)", required: true },
      { document: "Redemption Terms Document", required: true },
    ],
    successFactors: [
      "Strong legal opinion framing IOU as receipt — not security",
      "Counterparties are sophisticated (lenders, operators) not retail",
      "No secondary market trading enabled",
      "XRPL issuer domain verification complete",
      "Underlying asset documentation is complete (IOU is only as good as the asset behind it)",
    ],
    commonBlockers: [
      "Attempting to issue before legal opinion is in hand",
      "Treating the IOU as a fundraising mechanism — this triggers securities laws",
      "Insufficient underlying asset documentation — the receipt is worthless without the asset",
      "Counterparties unwilling to do trustline onboarding",
    ],
    keyCounterparties: ["Securities attorney", "XRPL technical integrator", "Pre-approved KYC'd counterparties"],
    cookieCutterNotes: "XRPL receipts ADD VALUE to every other route — they make lender packages more professional and verifiable. Pursue in parallel with Private Lender and Royalty Streaming as a value-add layer, not as a standalone route.",
    priority: "PURSUE_PARALLEL",
  },
  {
    id: "OFFTAKE_PREPAYMENT",
    tier: 3,
    displayName: "Offtake Prepayment Financing",
    shortName: "Offtake Prepay",
    tagline: "Buyer pre-pays for production that hasn't happened yet — secured by reserves and operator commitment",
    description:
      "A commodity buyer, energy company, or utility pre-pays for a fixed quantity of future production at an agreed (below-spot) price. Seller receives upfront capital; buyer secures future supply at a discount. Requires both clear title AND a committed operator who can guarantee production. Most complex route — but potentially largest upfront capital for production-ready mineral assets.",
    status: "CONDITIONAL",
    eligibleAssetTypes: ["Coal (production-ready)", "Oil & Gas", "Precious Metals (production-ready)", "Timber"],
    blockedAssetTypes: ["Pre-permit assets", "TROPTIONS", "Carbon Credits", "Gemstones"],
    difficulty: 4,
    ease: 2,
    successProbability: "Lower–Moderate (25–45%) — requires both title and committed operator",
    timelineRange: "60–120 days from package completion",
    timelineNote: "Both operator and buyer due diligence run in parallel — complexity is high",
    typicalAskRange: "$500,000 – $100,000,000 depending on production volume",
    procedure: [
      { step: 1, title: "Secure Complete Title Package", detail: "Non-negotiable: deed, mineral rights deed, chain of title, lien search, title opinion, permit status. Both operator and buyer require this before any binding commitment.", owner: "CLIENT", blockerIfMissed: "HARD BLOCK — no offtake buyer will advance without clean, confirmed title" },
      { step: 2, title: "Identify and Commit Operator", detail: "Secure a binding operator commitment (not just LOI) to produce specific volumes on a specific schedule. Operator must be MSHA-registered and bonded.", owner: "CLIENT", blockerIfMissed: "HARD BLOCK — no buyer prepays for production without a committed, credentialed operator" },
      { step: 3, title: "Get Updated Production Feasibility Study", detail: "Qualified Person produces a production feasibility study with: production schedule, extraction costs per ton, equipment plan, timeline to first production.", owner: "CLIENT" },
      { step: 4, title: "Identify Offtake Buyer Candidates", detail: "Approach industrial coal consumers: cement plants, steel mills, export terminals, industrial utility operators. Present the reserve estimate, operator credentials, and production schedule.", owner: "TROPTIONS" },
      { step: 5, title: "Negotiate Offtake Prepayment Term Sheet", detail: "Key terms: prepayment amount (% of agreed purchase price × contracted volume), delivery schedule, price per ton (typically 15–30% below spot for prepayment discount), penalties for delivery shortfall.", owner: "SHARED" },
      { step: 6, title: "Structure Security Package", detail: "Buyer requires: asset pledge, operator performance bond, production insurance, step-in rights if operator defaults.", owner: "TROPTIONS" },
      { step: 7, title: "Legal Drafting and Closing", detail: "Specialized energy/mining attorneys draft the offtake agreement, prepayment terms, and security package. Complex — budget 60–90 day legal process.", owner: "THIRD_PARTY" },
      { step: 8, title: "Close, Receive Prepayment, Begin Production", detail: "Sign all agreements, receive prepayment proceeds, operator begins permitted extraction on schedule.", owner: "SHARED" },
    ],
    requiredDocuments: [
      { document: "All hard-blocker title and legal documents", required: true, hardBlocker: true },
      { document: "MSHA Permit (active)", required: true, hardBlocker: true, notes: "PATE-COAL-001 is pre-permit — this blocks offtake route until permit secured" },
      { document: "Binding Operator Agreement", required: true, hardBlocker: true },
      { document: "Updated Production Feasibility Study", required: true, hardBlocker: true },
      { document: "Operator Performance Bond", required: true },
      { document: "Production Insurance Certificate", required: true },
      { document: "Offtake Agreement (fully negotiated)", required: true },
    ],
    successFactors: [
      "Active mining permit (MSHA) in hand",
      "Committed, experienced, bonded operator",
      "Current production feasibility study supporting contracted volumes",
      "Buyer has appetite for long-term supply security (large industrial consumer)",
    ],
    commonBlockers: [
      "Pre-permit assets cannot use this route (PATE-COAL-001 is currently blocked here)",
      "No committed operator (buyers won't prepay without production guarantee)",
      "Coal market conditions / buyer demand for long-term supply contracts",
      "Legal complexity is very high — budget $50K–$200K in legal fees",
    ],
    keyCounterparties: ["Industrial coal buyer / utility", "MSHA-registered operator", "Energy/mining attorney", "Surety bond provider", "Production insurer"],
    cookieCutterNotes: "This is the largest potential deal but requires the most complete package. Do not pursue until permit is in hand and operator is committed. Flag for Phase 2 planning once permit is obtained.",
    priority: "PURSUE_LATER",
  },
  {
    id: "AAVE_DEFI",
    tier: 3,
    displayName: "Aave v3 DeFi Collateral",
    shortName: "Aave / DeFi",
    tagline: "Instant liquidity — ONLY for accepted on-chain collateral (WBTC, ETH, stablecoins)",
    description:
      "Deposit accepted collateral (WBTC/cbBTC, ETH, USDC, USDT) into Aave v3 lending pool and borrow against it instantly. No credit check, no timeline, no lender approval. BUT: raw coal mineral rights, gemstones, carbon credits, TROPTIONS tokens, and most RWA instruments are NOT accepted by Aave v3. This route is only available when the client already holds on-chain accepted collateral.",
    status: "BLOCKED_FOR_COAL",
    eligibleAssetTypes: ["WBTC / cbBTC", "ETH / WETH", "USDC", "USDT", "DAI", "Other Aave-accepted collateral"],
    blockedAssetTypes: ["Coal mineral rights", "Gemstones", "Carbon credits (unaccepted)", "TROPTIONS", "Real estate", "Any non-listed RWA"],
    difficulty: 5,
    ease: 5,
    successProbability: "Near-certain for accepted collateral; zero for non-accepted collateral",
    timelineRange: "Minutes — fully automated smart contract execution",
    timelineNote: "Fastest possible route when the right collateral is already held",
    typicalAskRange: "Up to 75–80% LTV against deposited collateral value",
    procedure: [
      { step: 1, title: "Verify Collateral Eligibility", detail: "Check Aave v3 asset list (app.aave.com). Confirm the client's asset is listed with adequate liquidity. COAL, TROPTIONS, gemstones, and non-tokenized real estate are NOT listed.", owner: "TROPTIONS", blockerIfMissed: "HARD BLOCK — if asset is not on Aave list, this route does not exist" },
      { step: 2, title: "Convert or Acquire Accepted Collateral", detail: "If client holds non-accepted collateral (e.g., BTC on Bitcoin chain), wrap to cbBTC/WBTC. If holding raw commodity, sale proceeds may be used to acquire accepted collateral.", owner: "CLIENT" },
      { step: 3, title: "Connect DeFi Wallet", detail: "Client connects a self-custody wallet (MetaMask, Coinbase Wallet) to app.aave.com. Ensure wallet is on the correct chain (Ethereum mainnet, Polygon, Arbitrum, etc.).", owner: "CLIENT" },
      { step: 4, title: "Deposit Collateral into Aave Pool", detail: "Approve and deposit accepted collateral into the Aave v3 pool. Asset becomes collateral and earns supply APY.", owner: "CLIENT" },
      { step: 5, title: "Borrow Against Collateral", detail: "Select borrow asset (USDC, ETH, etc.). Set borrow amount below the Health Factor 1.0 threshold (recommend staying above 2.0 to avoid liquidation risk).", owner: "CLIENT" },
      { step: 6, title: "Monitor Health Factor", detail: "Daily monitor of Health Factor. If collateral value drops (price crash), add collateral or repay borrowing to avoid liquidation. This is the key ongoing risk.", owner: "CLIENT" },
    ],
    requiredDocuments: [
      { document: "Confirmed Aave-accepted collateral (on-chain balance)", required: true, hardBlocker: true },
      { document: "Self-custody wallet (non-custodial)", required: true, hardBlocker: true },
      { document: "Gas ETH for transaction fees", required: true },
    ],
    successFactors: [
      "Client already holds WBTC, ETH, or accepted stablecoins on-chain",
      "Sufficient collateral to support desired borrow amount with Health Factor ≥ 2.0",
      "Client understands liquidation risk in volatile markets",
    ],
    commonBlockers: [
      "Asset is a TROPTIONS, coal, gemstone, carbon credit, or real estate — HARD BLOCKED by Aave protocol design",
      "Client confuses in-place asset value with DeFi collateral value",
      "Liquidation risk from volatile collateral prices",
    ],
    keyCounterparties: ["Aave protocol (automated)", "Self-custody wallet provider"],
    cookieCutterNotes: "Only relevant for clients who also hold crypto assets. Do NOT attempt to force coal/mineral rights through Aave — it is technically and contractually impossible.",
    priority: "BLOCKED",
  },
];

// ─── Cookie-Cutter Intake System ──────────────────────────────────────────────

const INTAKE_PHASES = [
  {
    phase: 1,
    name: "Day 1: Asset Classification + Fee Agreement",
    timeline: "Day 1 — 30 minutes",
    color: "#C9A84C",
    steps: [
      "Ask: Is this a goods/services trade OR an asset-backed financing need?",
      "If trade → immediately qualify for Merchant Credit / Service Fee route",
      "If asset-backed → classify the asset type (mineral rights, real estate, gemstone, commodity, TROPTIONS)",
      "Ask: What documentation does the client already have? (deed, appraisal, title search)",
      "Run preliminary route eligibility: which routes could this asset qualify for?",
      "Execute SIGNED FEE AGREEMENT before any additional work",
      "Collect: government ID, business name, asset location, appraisal summary (if any)",
    ],
  },
  {
    phase: 2,
    name: "Days 2–14: Document Collection",
    timeline: "Days 2–14 — concurrent with fee-generating activity",
    color: "#64b6ac",
    steps: [
      "Send standard Document Request Packet for the asset type (use our category checklists)",
      "Establish a shared folder (Google Drive or secure portal) for document upload",
      "Score each document as it arrives using the Readiness Matrix (Technical/Title/Permitting/Commercial)",
      "Provide client weekly score update: 'You are at 40/100 — here is what would move you to 70/100'",
      "Flag any hard-blocker gaps immediately with specific cost/time estimate to cure",
      "Use bridge financing referral if client needs cash to fund the document completion",
    ],
  },
  {
    phase: 3,
    name: "Days 3–5: Route Selection",
    timeline: "Days 3–5 — after initial document review",
    color: "#a78bfa",
    steps: [
      "Map current readiness score to the Route Eligibility Matrix",
      "Identify which routes are (a) available now, (b) available after document completion, (c) permanently blocked",
      "Rank available routes by: estimated timeline × success probability × fee potential",
      "Select 2–3 routes to pursue in parallel (never put all eggs in one basket)",
      "Present to client: 'Route A is fastest but lower amount; Route B is larger but takes 90 days'",
      "Get client written approval on the route selection strategy",
    ],
  },
  {
    phase: 4,
    name: "Weeks 2–4: Package Preparation",
    timeline: "2–4 weeks — concurrent with document collection",
    color: "#fb923c",
    steps: [
      "Build the executive summary using the TROPTIONS standard template",
      "Create the readiness score card with category breakdown",
      "Index all documents with a clean table of contents",
      "Build route-specific presentations: lender packet, buyer teaser, JV term sheet framework",
      "Draft the use-of-proceeds plan",
      "Review all materials for compliance — ensure simulationOnly/not-a-guarantee language is present",
    ],
  },
  {
    phase: 5,
    name: "Ongoing: Route Execution",
    timeline: "Route-specific — see individual route procedures above",
    color: "#4ade80",
    steps: [
      "Execute route-specific procedure steps (detailed in each route card above)",
      "Run 2 routes in parallel maximum to avoid complexity overload",
      "Report to client weekly on route status, counterparty responses, and next steps",
      "Never advance to a new counterparty without client written authorization",
      "Escalate any regulatory, legal, or compliance questions to qualified counsel immediately",
    ],
  },
];

// ─── Difficulty Ratings Helper ────────────────────────────────────────────────

function Stars({ count, max = 5, color }: { count: number; max?: number; color: string }) {
  return (
    <span style={{ display: "inline-flex", gap: "2px" }}>
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: i < count ? color : "rgba(255,255,255,0.12)",
          }}
        />
      ))}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TIER_COLORS = { 1: "#4ade80", 2: "#f0cf82", 3: "#f87171" } as const;
const TIER_LABELS = { 1: "Tier 1 — Fastest / Easiest", 2: "Tier 2 — Mid-Range", 3: "Tier 3 — Advanced / Complex" } as const;

const OWNER_BADGES: Record<string, { label: string; color: string }> = {
  CLIENT:       { label: "Owner / Client",   color: "#64b6ac" },
  TROPTIONS:    { label: "TROPTIONS Team",   color: "#C9A84C" },
  THIRD_PARTY:  { label: "Third Party",      color: "#a78bfa" },
  SHARED:       { label: "Shared / Joint",   color: "#94a3b8" },
};

export default function FundingPlaybookPage() {
  const tiers = [1, 2, 3] as const;

  return (
    <>
      {/* ─── Print Styles ─────────────────────────────────────────────────── */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: #fff !important; color: #111 !important; font-size: 10pt; }
          main { padding: 0 !important; }
          .print-page-break { page-break-before: always; }
          .print-keep-together { page-break-inside: avoid; }
          h1, h2, h3 { color: #111 !important; }
          a { color: #111 !important; text-decoration: none; }
          .route-card { border: 1pt solid #ccc !important; background: #f9f9f9 !important; }
          .step-row { border-bottom: 1pt solid #eee !important; }
          .score-pill { border: 1pt solid #ccc !important; background: #f0f0f0 !important; color: #333 !important; }
          .print-black { color: #111 !important; }
          .safety-bar { border: 1pt solid #c00 !important; background: #fff3f3 !important; }
          @page { margin: 0.85in 0.7in; }
        }
      `}</style>

      <main
        style={{
          minHeight: "100vh",
          background: "#0A0A0A",
          color: "#f8fafc",
          padding: "2.5rem 1.25rem",
        }}
      >
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>

          {/* ─── Safety Disclosure ──────────────────────────────────────────── */}
          <div
            className="safety-bar print-keep-together"
            style={{
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.4)",
              borderRadius: "0.75rem",
              padding: "1rem 1.25rem",
              marginBottom: "2rem",
              fontSize: "0.78rem",
              color: "#fca5a5",
            }}
          >
            <strong style={{ color: "#f87171", display: "block", marginBottom: "0.4rem" }}>
              Regulatory Disclosure — Simulation-Only Reference Document
            </strong>
            This playbook describes operational procedures and route eligibility criteria for informational and planning purposes only.
            No live lending, IOU issuance, stablecoin issuance, custody, securities offering, mining operation, commodity brokering,
            or public investment functionality is enabled. All funding route assessments are simulations.
            TROPTIONS is not a registered lender, investment adviser, commodity broker, or securities dealer.
            Nothing in this document constitutes investment advice or a guaranteed funding commitment.
            All timelines, advance rates, and probabilities are estimates based on market experience and may differ materially.
          </div>

          {/* ─── Header ─────────────────────────────────────────────────────── */}
          <div style={{ marginBottom: "2.5rem", display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "1.25rem" }}>
            <div>
              <p className="print-black" style={{ fontFamily: "monospace", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "#C9A84C", marginBottom: "0.5rem" }}>
                TROPTIONS — RWA Funding Operations
              </p>
              <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 800, color: "#f8fafc", margin: "0 0 0.5rem", lineHeight: 1.2 }}>
                Complete Funding Routes Playbook
              </h1>
              <p style={{ color: "#94a3b8", fontSize: "0.9rem", maxWidth: "600px", lineHeight: 1.6 }}>
                10 funding routes with step-by-step procedures, document requirements, difficulty ratings, and the TROPTIONS cookie-cutter client intake system.
                Print or save as PDF for use in client presentations.
              </p>
              <div style={{ marginTop: "0.75rem", display: "flex", flexWrap: "wrap", gap: "0.5rem", fontSize: "0.72rem" }}>
                <span className="score-pill" style={{ background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)", color: "#4ade80", padding: "0.25rem 0.75rem", borderRadius: "2rem", fontWeight: 600 }}>Tier 1: 3 Routes</span>
                <span className="score-pill" style={{ background: "rgba(240,207,130,0.12)", border: "1px solid rgba(240,207,130,0.3)", color: "#f0cf82", padding: "0.25rem 0.75rem", borderRadius: "2rem", fontWeight: 600 }}>Tier 2: 4 Routes</span>
                <span className="score-pill" style={{ background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171", padding: "0.25rem 0.75rem", borderRadius: "2rem", fontWeight: 600 }}>Tier 3: 3 Routes</span>
                <span className="score-pill" style={{ background: "rgba(148,163,184,0.12)", border: "1px solid rgba(148,163,184,0.3)", color: "#94a3b8", padding: "0.25rem 0.75rem", borderRadius: "2rem", fontWeight: 600 }}>Updated: April 2026</span>
              </div>
            </div>
            <div className="no-print" style={{ display: "flex", flexDirection: "column", gap: "0.6rem", alignItems: "flex-end" }}>
              <PrintButton />
              <Link
                href="/troptions/rwa/pate-coal"
                style={{ fontSize: "0.75rem", color: "#C9A84C", textDecoration: "none" }}
              >
                PATE-COAL-001 Live Package →
              </Link>
              <Link
                href="/troptions/funding-routes"
                style={{ fontSize: "0.75rem", color: "#94a3b8", textDecoration: "none" }}
              >
                Funding Routes Dashboard →
              </Link>
            </div>
          </div>

          {/* ─── Difficulty Matrix ──────────────────────────────────────────── */}
          <div className="print-page-break" style={{ marginBottom: "2.5rem" }}>
            <p style={{ fontFamily: "monospace", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "#C9A84C", marginBottom: "1rem" }}>
              Section 1 — Route Comparison Matrix
            </p>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
                    {["Route", "Tier", "Difficulty", "Ease", "Timeline", "Success %", "Asset Types", "Priority"].map((h) => (
                      <th key={h} style={{ padding: "0.6rem 0.75rem", textAlign: "left", color: "#64748b", fontWeight: 600, fontFamily: "monospace", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROUTES.map((r) => (
                    <tr key={r.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <td style={{ padding: "0.65rem 0.75rem", color: "#f1f5f9", fontWeight: 600, whiteSpace: "nowrap" }}>{r.shortName}</td>
                      <td style={{ padding: "0.65rem 0.75rem" }}>
                        <span style={{ color: TIER_COLORS[r.tier], fontWeight: 700, fontFamily: "monospace", fontSize: "0.7rem" }}>T{r.tier}</span>
                      </td>
                      <td style={{ padding: "0.65rem 0.75rem" }}>
                        <Stars count={r.difficulty} color="#f87171" />
                      </td>
                      <td style={{ padding: "0.65rem 0.75rem" }}>
                        <Stars count={r.ease} color="#4ade80" />
                      </td>
                      <td style={{ padding: "0.65rem 0.75rem", color: "#94a3b8", whiteSpace: "nowrap" }}>{r.timelineRange}</td>
                      <td style={{ padding: "0.65rem 0.75rem", color: "#cbd5e1" }}>{r.successProbability.split("(")[0].trim()}</td>
                      <td style={{ padding: "0.65rem 0.75rem", color: "#64748b", fontSize: "0.7rem" }}>{r.eligibleAssetTypes.slice(0, 2).join(", ")}{r.eligibleAssetTypes.length > 2 ? "…" : ""}</td>
                      <td style={{ padding: "0.65rem 0.75rem" }}>
                        <span style={{
                          fontFamily: "monospace",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          padding: "0.2rem 0.55rem",
                          borderRadius: "2rem",
                          background: r.priority === "PURSUE_FIRST" ? "rgba(74,222,128,0.15)" : r.priority === "PURSUE_PARALLEL" ? "rgba(240,207,130,0.15)" : r.priority === "BLOCKED" ? "rgba(248,113,113,0.15)" : "rgba(148,163,184,0.1)",
                          color: r.priority === "PURSUE_FIRST" ? "#4ade80" : r.priority === "PURSUE_PARALLEL" ? "#f0cf82" : r.priority === "BLOCKED" ? "#f87171" : "#94a3b8",
                          border: "1px solid",
                          borderColor: r.priority === "PURSUE_FIRST" ? "rgba(74,222,128,0.3)" : r.priority === "PURSUE_PARALLEL" ? "rgba(240,207,130,0.3)" : r.priority === "BLOCKED" ? "rgba(248,113,113,0.3)" : "rgba(148,163,184,0.2)",
                        }}>
                          {r.priority.replace(/_/g, " ")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: "0.7rem", color: "#475569", marginTop: "0.75rem" }}>
              Difficulty: ⚫⚫⚫⚫⚫ = Hard | Ease: 🟢🟢🟢🟢🟢 = Easy. Priority: PURSUE FIRST = start immediately; PURSUE PARALLEL = run alongside primary; PURSUE LATER = after package is complete; BLOCKED = do not attempt.
            </p>
          </div>

          {/* ─── Cookie-Cutter Intake System ───────────────────────────────── */}
          <div className="print-page-break" style={{ marginBottom: "2.5rem" }}>
            <p style={{ fontFamily: "monospace", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "#C9A84C", marginBottom: "0.5rem" }}>
              Section 2 — Cookie-Cutter Client Intake System
            </p>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#f8fafc", margin: "0 0 0.75rem" }}>
              Repeatable Intake-to-Funding Pipeline
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.84rem", lineHeight: 1.65, marginBottom: "1.5rem", maxWidth: "700px" }}>
              Every TROPTIONS client engagement follows the same 5-phase pipeline regardless of asset type or funding route. The system is designed to:
              (1) generate service fee revenue immediately, (2) qualify assets accurately before spending on legal or technical work,
              (3) select the best 2 routes in parallel, and (4) produce a lender-ready package that closes deals efficiently.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {INTAKE_PHASES.map((ph) => (
                <div
                  key={ph.phase}
                  className="print-keep-together"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    borderLeft: `4px solid ${ph.color}`,
                    borderRadius: "0.75rem",
                    padding: "1.1rem 1.25rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${ph.color}22`, border: `1px solid ${ph.color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: ph.color, fontSize: "0.9rem", flexShrink: 0 }}>
                      {ph.phase}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, color: "#f1f5f9", margin: 0, fontSize: "0.95rem" }}>{ph.name}</p>
                      <p style={{ fontSize: "0.72rem", color: "#64748b", margin: "0.2rem 0 0", fontFamily: "monospace" }}>{ph.timeline}</p>
                    </div>
                  </div>
                  <ol style={{ margin: 0, paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    {ph.steps.map((s, i) => (
                      <li key={i} style={{ fontSize: "0.82rem", color: "#cbd5e1", lineHeight: 1.6 }}>{s}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Document Collection Templates ─────────────────────────────── */}
          <div className="print-page-break" style={{ marginBottom: "2.5rem" }}>
            <p style={{ fontFamily: "monospace", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "#C9A84C", marginBottom: "0.5rem" }}>
              Section 3 — Standard Document Collection Templates
            </p>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#f8fafc", margin: "0 0 0.75rem" }}>
              By Asset Type — Send to Client on Day 2
            </h2>
            {[
              {
                label: "Mineral Rights / Coal / Oil & Gas",
                color: "#C9A84C",
                docs: [
                  "Current Deed (recorded, with book/page or document number)",
                  "Mineral Rights Deed or Severance Document",
                  "Chain of Title (continuous from original patent/grant)",
                  "Tax Parcel Records (county assessor + current tax certificate)",
                  "Lien / Mortgage Search (within 60 days)",
                  "UCC Search (county + state)",
                  "Title Opinion (attorney-issued, within 1 year)",
                  "Engineering / Reserve Appraisal (most recent)",
                  "2024 update letter or refreshed reserve estimate",
                  "Geological survey or seam map",
                  "Permit Status (MSHA for coal; state permit for O&G)",
                  "Phase I Environmental Site Assessment",
                  "Reclamation Bond Estimate",
                  "Operator LOI or operating agreement",
                  "Offtake LOI or commodity buyer term sheet",
                  "Legal Opinion on transaction structure",
                  "Entity documents (if held in LLC/Corp)",
                  "Authorization to act on behalf of owner",
                ],
              },
              {
                label: "Gemstones / Precious Metals (Physical)",
                color: "#a78bfa",
                docs: [
                  "Gemological certificate (GIA, AGS, or equivalent) — per stone",
                  "Independent appraisal (current, within 90 days)",
                  "Custody / vault confirmation letter",
                  "Chain of custody documentation (provenance)",
                  "Source-of-funds declaration",
                  "Ownership certificate or bill of sale",
                  "KYC on all owners",
                  "Insurance certificate (fine art / valuables rider)",
                  "Photos: gemological-quality, with scale reference",
                ],
              },
              {
                label: "Carbon Credits",
                color: "#4ade80",
                docs: [
                  "Registry record (Verra VCS / Gold Standard / ACR serial numbers)",
                  "Vintage year and project ID",
                  "Retirement status (confirmed not yet retired)",
                  "Custody / brokerage statement",
                  "AML / source-of-funds declaration",
                  "KYC on selling entity",
                  "Any offtake or pre-sale agreement",
                ],
              },
              {
                label: "Real Estate",
                color: "#64b6ac",
                docs: [
                  "Current deed (recorded)",
                  "Title search / title insurance commitment",
                  "Property tax statement (current)",
                  "Appraisal (USPAP-compliant, within 12 months)",
                  "Phase I Environmental (if commercial or industrial)",
                  "Survey (ALTA or equivalent)",
                  "Rent roll and leases (if income-producing)",
                  "Insurance certificate",
                  "Entity documents (if held in LLC/Trust)",
                  "Mortgage statements (all liens)",
                  "Legal opinion on structure",
                ],
              },
            ].map((cat) => (
              <div
                key={cat.label}
                className="print-keep-together"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: "0.75rem",
                  padding: "1rem 1.25rem",
                  marginBottom: "0.85rem",
                }}
              >
                <p style={{ fontWeight: 700, color: cat.color, marginBottom: "0.65rem", fontSize: "0.9rem" }}>{cat.label}</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "0.3rem 1.5rem" }}>
                  {cat.docs.map((d, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.78rem", color: "#cbd5e1", lineHeight: 1.5 }}>
                      <span style={{ color: cat.color, flexShrink: 0, marginTop: "2px" }}>☐</span>
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ─── Route Cards ─────────────────────────────────────────────────── */}
          <p style={{ fontFamily: "monospace", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "#C9A84C", marginBottom: "0.5rem" }}>
            Section 4 — Route Procedures (Full Detail)
          </p>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#f8fafc", margin: "0 0 1.5rem" }}>
            Step-by-Step Procedures for All 10 Routes
          </h2>

          {tiers.map((t) => (
            <div key={t} className="print-page-break">
              <div style={{ marginBottom: "1rem", borderLeft: `4px solid ${TIER_COLORS[t]}`, paddingLeft: "0.85rem" }}>
                <p style={{ fontWeight: 800, color: TIER_COLORS[t], fontSize: "1rem", margin: 0 }}>{TIER_LABELS[t]}</p>
                <p style={{ color: "#64748b", fontSize: "0.78rem", margin: "0.2rem 0 0" }}>
                  {t === 1 && "Start here — lowest barrier, fastest revenue. Pursue before spending on legal or technical work."}
                  {t === 2 && "Core capital-raise routes. Run 2 in parallel. Full document package required."}
                  {t === 3 && "High-complexity, high-reward. Only pursue when Tier 1 & 2 options are exhausted or running, and package is ≥ 75/100."}
                </p>
              </div>

              {ROUTES.filter((r) => r.tier === t).map((route) => (
                <div
                  key={route.id}
                  className="route-card print-keep-together"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    borderRadius: "1rem",
                    padding: "1.5rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  {/* Card Header */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1rem" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginBottom: "0.35rem" }}>
                        <span style={{ fontFamily: "monospace", fontSize: "0.65rem", fontWeight: 700, background: `${TIER_COLORS[t]}22`, border: `1px solid ${TIER_COLORS[t]}44`, color: TIER_COLORS[t], padding: "0.15rem 0.55rem", borderRadius: "2rem" }}>
                          T{t}
                        </span>
                        <span style={{
                          fontFamily: "monospace",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          padding: "0.15rem 0.55rem",
                          borderRadius: "2rem",
                          background: route.status === "AVAILABLE" ? "rgba(74,222,128,0.15)" : route.status === "CONDITIONAL" ? "rgba(240,207,130,0.15)" : "rgba(248,113,113,0.15)",
                          color: route.status === "AVAILABLE" ? "#4ade80" : route.status === "CONDITIONAL" ? "#f0cf82" : "#f87171",
                          border: "1px solid",
                          borderColor: route.status === "AVAILABLE" ? "rgba(74,222,128,0.3)" : route.status === "CONDITIONAL" ? "rgba(240,207,130,0.3)" : "rgba(248,113,113,0.3)",
                        }}>
                          {route.status === "BLOCKED_FOR_COAL" ? "BLOCKED — COAL/RWA" : route.status}
                        </span>
                        <span style={{ fontFamily: "monospace", fontSize: "0.65rem", fontWeight: 700, padding: "0.15rem 0.55rem", borderRadius: "2rem",
                          background: route.priority === "PURSUE_FIRST" ? "rgba(74,222,128,0.1)" : route.priority === "BLOCKED" ? "rgba(248,113,113,0.1)" : "rgba(148,163,184,0.08)",
                          color: route.priority === "PURSUE_FIRST" ? "#4ade80" : route.priority === "BLOCKED" ? "#f87171" : "#94a3b8",
                          border: "1px solid rgba(255,255,255,0.1)" }}>
                          {route.priority.replace(/_/g, " ")}
                        </span>
                      </div>
                      <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#f1f5f9", margin: 0 }}>{route.displayName}</h3>
                      <p style={{ fontSize: "0.78rem", color: "#64748b", margin: "0.2rem 0 0", fontStyle: "italic" }}>{route.tagline}</p>
                    </div>
                    {/* Ratings block */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", textAlign: "right", flexShrink: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.5rem" }}>
                        <span style={{ fontSize: "0.65rem", color: "#64748b", fontFamily: "monospace" }}>DIFFICULTY</span>
                        <Stars count={route.difficulty} color="#f87171" />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.5rem" }}>
                        <span style={{ fontSize: "0.65rem", color: "#64748b", fontFamily: "monospace" }}>EASE</span>
                        <Stars count={route.ease} color="#4ade80" />
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>{route.timelineRange}</div>
                      <div style={{ fontSize: "0.7rem", color: "#C9A84C", fontWeight: 700 }}>{route.typicalAskRange}</div>
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{ fontSize: "0.83rem", color: "#94a3b8", lineHeight: 1.7, marginBottom: "1.25rem" }}>{route.description}</p>

                  {/* Asset Eligibility */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.25rem" }}>
                    <div>
                      <p style={{ fontSize: "0.65rem", fontFamily: "monospace", color: "#4ade80", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>Eligible Asset Types</p>
                      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                        {route.eligibleAssetTypes.map((a) => <li key={a} style={{ fontSize: "0.75rem", color: "#86efac" }}>✓ {a}</li>)}
                      </ul>
                    </div>
                    {route.blockedAssetTypes.length > 0 && (
                      <div>
                        <p style={{ fontSize: "0.65rem", fontFamily: "monospace", color: "#f87171", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>Blocked Asset Types</p>
                        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                          {route.blockedAssetTypes.map((a) => <li key={a} style={{ fontSize: "0.75rem", color: "#fca5a5" }}>✗ {a}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Procedure Steps */}
                  <div style={{ marginBottom: "1.25rem" }}>
                    <p style={{ fontSize: "0.65rem", fontFamily: "monospace", color: "#C9A84C", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.65rem" }}>
                      Procedure — {route.procedure.length} Steps
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                      {route.procedure.map((step) => (
                        <div
                          key={step.step}
                          className="step-row"
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "0.85rem",
                            padding: "0.65rem 0",
                            borderBottom: "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.35)", display: "flex", alignItems: "center", justifyContent: "center", color: "#C9A84C", fontWeight: 700, fontSize: "0.7rem", flexShrink: 0, marginTop: "2px" }}>
                            {step.step}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "0.35rem" }}>
                              <span style={{ fontWeight: 700, color: "#f1f5f9", fontSize: "0.83rem" }}>{step.title}</span>
                              <span style={{
                                fontFamily: "monospace",
                                fontSize: "0.6rem",
                                padding: "0.15rem 0.5rem",
                                borderRadius: "2rem",
                                background: `${OWNER_BADGES[step.owner].color}22`,
                                border: `1px solid ${OWNER_BADGES[step.owner].color}44`,
                                color: OWNER_BADGES[step.owner].color,
                                flexShrink: 0,
                              }}>
                                {OWNER_BADGES[step.owner].label}
                              </span>
                            </div>
                            <p style={{ fontSize: "0.78rem", color: "#94a3b8", margin: "0.3rem 0 0", lineHeight: 1.6 }}>{step.detail}</p>
                            {step.blockerIfMissed && (
                              <p style={{ fontSize: "0.72rem", color: "#fca5a5", margin: "0.35rem 0 0", fontWeight: 600 }}>
                                ⚠ {step.blockerIfMissed}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Required Documents */}
                  <div style={{ marginBottom: "1.25rem" }}>
                    <p style={{ fontSize: "0.65rem", fontFamily: "monospace", color: "#a78bfa", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.65rem" }}>
                      Required Documents ({route.requiredDocuments.filter((d) => d.hardBlocker).length} hard blockers of {route.requiredDocuments.length} total)
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "0.35rem" }}>
                      {route.requiredDocuments.map((doc, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.45rem", fontSize: "0.75rem", color: doc.hardBlocker ? "#fca5a5" : "#cbd5e1" }}>
                          <span style={{ flexShrink: 0, marginTop: "2px", color: doc.hardBlocker ? "#f87171" : "#64748b" }}>{doc.hardBlocker ? "⛔" : doc.required ? "☐" : "○"}</span>
                          <span>
                            {doc.document}
                            {doc.hardBlocker && <span style={{ color: "#f87171", fontWeight: 700, fontFamily: "monospace", fontSize: "0.6rem" }}> HARD BLOCK</span>}
                            {doc.notes && <span style={{ color: "#475569" }}> — {doc.notes}</span>}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Success Factors + Common Blockers */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                      <p style={{ fontSize: "0.65rem", fontFamily: "monospace", color: "#4ade80", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.45rem" }}>Success Factors</p>
                      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                        {route.successFactors.map((f, i) => (
                          <li key={i} style={{ fontSize: "0.75rem", color: "#86efac", lineHeight: 1.5 }}>✓ {f}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p style={{ fontSize: "0.65rem", fontFamily: "monospace", color: "#f87171", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.45rem" }}>Common Blockers</p>
                      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                        {route.commonBlockers.map((b, i) => (
                          <li key={i} style={{ fontSize: "0.75rem", color: "#fca5a5", lineHeight: 1.5 }}>✗ {b}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Cookie-Cutter Note */}
                  <div style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: "0.5rem", padding: "0.7rem 1rem" }}>
                    <p style={{ fontSize: "0.65rem", fontFamily: "monospace", color: "#C9A84C", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.3rem" }}>System Note</p>
                    <p style={{ fontSize: "0.78rem", color: "#e2b96b", lineHeight: 1.6, margin: 0 }}>{route.cookieCutterNotes}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* ─── Escalation & Open-Source Protocol Stack ────────────────────── */}
          <div className="print-page-break" style={{ marginTop: "2rem" }}>
            <p style={{ fontFamily: "monospace", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "#C9A84C", marginBottom: "0.5rem" }}>
              Section 5 — Open-Source Protocol Stack &amp; Escalation
            </p>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#f8fafc", margin: "0 0 1rem" }}>
              Built-In Tools and Escalation Protocols
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
              {[
                { name: "XRPL (XRP Ledger)", role: "Permissioned IOU receipt layer, trustline management, tamper-evident asset records", link: "https://xrpl.org", color: "#64b6ac" },
                { name: "TROPTIONS Gateway", role: "Asset intake, scoring, document registry, route assessment engine — already deployed at this platform", link: "/troptions/rwa/pate-coal", color: "#C9A84C" },
                { name: "Stellar", role: "Cross-border payment rails, USDF stablecoin settlement, low-cost fiat on/off ramp integration", link: "https://stellar.org", color: "#a78bfa" },
                { name: "MSHA Online", role: "Free coal operator/permit registry lookup — verify operators, permit numbers, inspection history", link: "https://arlweb.msha.gov", color: "#fb923c" },
                { name: "PACER (Federal Courts)", role: "Public lien/bankruptcy search on counterparties — free with registration, critical for diligence", link: "https://pacer.uscourts.gov", color: "#f87171" },
                { name: "Verra Registry", role: "Carbon credit serial lookup, retirement status, project verification — free public access", link: "https://registry.verra.org", color: "#4ade80" },
                { name: "Aave v3 App", role: "DeFi borrowing against accepted on-chain collateral — no credit check, instant for eligible assets", link: "https://app.aave.com", color: "#9f7aea" },
                { name: "EDGAR (SEC)", role: "Company filing lookup, security registration checks, exempt offering verification — free", link: "https://www.sec.gov/cgi-bin/browse-edgar", color: "#94a3b8" },
              ].map((tool) => (
                <div
                  key={tool.name}
                  className="print-keep-together"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    borderRadius: "0.75rem",
                    padding: "1rem 1.1rem",
                  }}
                >
                  <p style={{ fontWeight: 700, color: tool.color, fontSize: "0.88rem", marginBottom: "0.3rem" }}>{tool.name}</p>
                  <p style={{ fontSize: "0.75rem", color: "#94a3b8", lineHeight: 1.6, marginBottom: "0.5rem" }}>{tool.role}</p>
                  <a href={tool.link} style={{ fontSize: "0.68rem", color: tool.color, fontFamily: "monospace" }} target="_blank" rel="noopener noreferrer">
                    {tool.link.replace("https://", "")}
                  </a>
                </div>
              ))}
            </div>

            {/* Escalation Table */}
            <div style={{ marginBottom: "2.5rem" }}>
              <p style={{ fontFamily: "monospace", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#C9A84C", marginBottom: "0.65rem" }}>Escalation Protocol — Who to Call and When</p>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
                      {["Trigger Condition", "Escalate To", "Response Time"].map((h) => (
                        <th key={h} style={{ padding: "0.55rem 0.85rem", textAlign: "left", color: "#64748b", fontFamily: "monospace", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { trigger: "Client asks 'is this a security?' or 'can I invest in this?'", to: "Securities attorney immediately — do not answer", time: "< 2 hours" },
                      { trigger: "Title defect discovered (gap, break, or adverse claim)", to: "Title attorney — do not proceed with financing", time: "< 24 hours" },
                      { trigger: "Environmental liability exceeds bond estimate", to: "Environmental consultant + attorney", time: "< 48 hours" },
                      { trigger: "Counterparty fails AML / KYC screening", to: "Compliance officer — freeze engagement", time: "Immediate" },
                      { trigger: "Client wants to advertise returns or 'guaranteed funding'", to: "Legal review + update all materials", time: "< 2 hours" },
                      { trigger: "XRPL IOU recipient wants to 'sell' their receipt to public", to: "Securities attorney — hard stop pending opinion", time: "Immediate" },
                      { trigger: "Readiness score cannot reach 60/100 after all docs collected", to: "Route strategy review — pivot or terminate engagement", time: "< 1 week" },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <td style={{ padding: "0.6rem 0.85rem", color: "#cbd5e1" }}>{row.trigger}</td>
                        <td style={{ padding: "0.6rem 0.85rem", color: "#f0cf82", fontWeight: 600 }}>{row.to}</td>
                        <td style={{ padding: "0.6rem 0.85rem", color: "#4ade80", fontFamily: "monospace", fontSize: "0.72rem" }}>{row.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ─── PATE-COAL-001 Route Map ─────────────────────────────────────── */}
          <div className="print-keep-together" style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: "1rem", padding: "1.5rem", marginBottom: "2.5rem" }}>
            <p style={{ fontFamily: "monospace", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "#C9A84C", marginBottom: "0.5rem" }}>
              Section 6 — PATE-COAL-001 Route Map (Current State)
            </p>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#f8fafc", margin: "0 0 0.75rem" }}>
              Prioritized Route Strategy — Pate Prospect, Morgan County TN
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.82rem", marginBottom: "1.25rem" }}>
              Readiness score: <strong style={{ color: "#f0cf82" }}>40 / 100</strong> (6 of 22 documents submitted — all technical).
              8 hard-blocker documents missing. Recommended route strategy based on current state:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {[
                { rank: 1, name: "Service Fee", status: "START NOW", note: "Sign fee agreement; issue owner document request packet. Revenue Day 1.", color: "#4ade80" },
                { rank: 2, name: "Diligence Bridge", status: "PURSUE NOW", note: "If owner needs cash, structure a $25K–$85K bridge to fund title + legal + QP update.", color: "#4ade80" },
                { rank: 3, name: "Royalty Streaming", status: "PURSUE AFTER TITLE", note: "Once deed, mineral deed, chain of title, and lien search are in — approach royalty funds.", color: "#f0cf82" },
                { rank: 4, name: "Operator JV", status: "PURSUE PARALLEL", note: "Run in parallel with royalty streaming. Contact East TN coal operators with NDA + teaser.", color: "#f0cf82" },
                { rank: 5, name: "Private Mineral Lender", status: "AFTER ≥ 80/100", note: "Once all 8 hard-blocker docs are complete and QP update is in hand.", color: "#f87171" },
                { rank: 6, name: "XRPL Receipt", status: "ADD-ON LAYER", note: "Issue XRPL IOU receipt once legal opinion is in hand. Enhances all other routes.", color: "#a78bfa" },
                { rank: 7, name: "Offtake Prepay", status: "PHASE 2 — POST-PERMIT", note: "Cannot pursue until MSHA permit is active and committed operator is in place.", color: "#f87171" },
                { rank: 8, name: "Aave DeFi", status: "NOT APPLICABLE", note: "Coal mineral rights are not accepted Aave v3 collateral. Hard blocked.", color: "#64748b" },
              ].map((row) => (
                <div key={row.rank} style={{ display: "flex", alignItems: "flex-start", gap: "0.85rem", padding: "0.55rem 0.75rem", background: "rgba(0,0,0,0.2)", borderRadius: "0.5rem" }}>
                  <span style={{ width: 22, height: 22, borderRadius: "50%", background: `${row.color}22`, border: `1px solid ${row.color}44`, display: "flex", alignItems: "center", justifyContent: "center", color: row.color, fontWeight: 800, fontSize: "0.68rem", flexShrink: 0 }}>{row.rank}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, color: "#f1f5f9", fontSize: "0.82rem" }}>{row.name}</span>
                      <span style={{ fontFamily: "monospace", fontSize: "0.62rem", color: row.color, border: `1px solid ${row.color}44`, padding: "0.1rem 0.45rem", borderRadius: "2rem", background: `${row.color}11` }}>{row.status}</span>
                    </div>
                    <p style={{ fontSize: "0.76rem", color: "#94a3b8", margin: "0.2rem 0 0" }}>{row.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Footer ─────────────────────────────────────────────────────── */}
          <div className="no-print" style={{ marginTop: "3rem", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "2rem", display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
              <Link href="/troptions/rwa/pate-coal" style={{ color: "#f0cf82", fontSize: "0.82rem", textDecoration: "none", fontWeight: 600 }}>PATE-COAL-001 Package →</Link>
              <Link href="/troptions/funding-routes" style={{ color: "#f0cf82", fontSize: "0.82rem", textDecoration: "none", fontWeight: 600 }}>Funding Routes Dashboard →</Link>
              <Link href="/troptions/compliance/handbooks" style={{ color: "#f0cf82", fontSize: "0.82rem", textDecoration: "none", fontWeight: 600 }}>Compliance Handbooks →</Link>
              <Link href="/troptions/kyc" style={{ color: "#f0cf82", fontSize: "0.82rem", textDecoration: "none", fontWeight: 600 }}>KYC / Onboarding →</Link>
            </div>
            <PrintButton />
          </div>

          {/* Print footer — only visible in print mode */}
          <div style={{ display: "none" }} className="print-footer">
            <p style={{ fontSize: "8pt", color: "#666", borderTop: "1pt solid #ccc", paddingTop: "0.5rem", marginTop: "2rem" }}>
              TROPTIONS RWA Funding Routes Playbook — Simulation-Only Reference — April 2026 — Not investment advice. Not a securities offering. Not a lending commitment. All funding route outcomes are simulations and estimates only.
            </p>
          </div>
          <style>{`
            @media print {
              .print-footer { display: block !important; }
            }
          `}</style>

        </div>
      </main>
    </>
  );
}
