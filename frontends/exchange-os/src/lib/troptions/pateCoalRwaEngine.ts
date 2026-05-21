/**
 * TROPTIONS Pate Coal RWA Engine
 * ─────────────────────────────────────────────────────────────────────────────
 * SERVER-SIDE ONLY. Simulation-only — no live mining operations, no live
 * collateral execution, no live Aave execution, no XRPL live issuance.
 *
 * Models the readiness state, document requirements, funding routes, and
 * compliance gates for the PATE-COAL-001 mineral-rights / coal-resource
 * RWA prospect in Morgan County, Tennessee.
 *
 * Asset basis:
 *   Engineering appraisal by James T. Weiss, PE, MBA, F. NSPE (2020)
 *   with 2024 update letter. Reported in-place value: $8,378,310,000.
 *   This is NOT a guaranteed market value, financing value, or sale price.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * SAFETY STATEMENT:
 * No live IOU issuance, stablecoin issuance, custody, exchange, mining
 * operation, permitting claim, Aave execution, token buyback, liquidity
 * pool execution, or public investment functionality was enabled.
 * ──────────────────────────────────────────────────────────────────────────
 */

// ─── Constants ────────────────────────────────────────────────────────────────

export const PATE_COAL_ASSET_ID = "PATE-COAL-001";

export const PATE_COAL_META = {
  assetId:              "PATE-COAL-001",
  assetName:            "Pate Prospect Tennessee Coal Prospect",
  assetType:            "Mineral Rights / Coal Resource / RWA Collateral Prospect",
  location:             "Morgan County, Tennessee",
  reportedAcreage:      3790,
  appraiser:            "James T. Weiss, PE, MBA, F. NSPE",
  appraisalYear:        2020,
  updateYear:           2024,
  reportedInPlaceValue: "$8,378,310,000",
  rexSeamSurfaceTons:   1_068_000,
  undergroundTons:      139_282_500,
  coalSeams:            [
    "Rex", "Nemo", "Morgan Springs", "Sewanee", "Richland",
    "Wilder", "Lower Wilder", "Upper White Oak", "Lower White Oak",
  ],
  xrplCurrencyCodeOptions: ["PATE001", "PATECOAL", "PATE-RWA", "COAL001"],
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────

export type PateCoalStatus =
  | "DRAFT"
  | "EVIDENCE_RECEIVED"
  | "TITLE_PENDING"
  | "TECHNICAL_REPORT_PENDING"
  | "PERMITTING_PENDING"
  | "ENVIRONMENTAL_PENDING"
  | "LEGAL_PENDING"
  | "LENDER_REVIEW"
  | "FINANCING_READY"
  | "BLOCKED";

export type PateCoalDocumentType =
  | "ENGINEERING_APPRAISAL"
  | "UPDATE_VALUATION_LETTER"
  | "APPENDIX_LEGAL_DESCRIPTION"
  | "COAL_RESERVE_TABLES"
  | "COAL_ANALYSIS"
  | "GEOLOGY_REPORT"
  | "DEED"
  | "MINERAL_RIGHTS_DEED"
  | "CHAIN_OF_TITLE"
  | "TAX_PARCEL_RECORDS"
  | "LIEN_SEARCH"
  | "UCC_SEARCH"
  | "TITLE_OPINION"
  | "PERMIT_STATUS"
  | "ENVIRONMENTAL_REPORT"
  | "RECLAMATION_BOND_ESTIMATE"
  | "INSURANCE_ESTIMATE"
  | "OPERATOR_LOI"
  | "OFFTAKE_LOI"
  | "UPDATED_QP_REPORT"
  | "LEGAL_OPINION"
  | "FUNDING_TERM_SHEET";

export type PateCoalDocumentStatus = "MISSING" | "PENDING" | "SUBMITTED" | "VERIFIED";

export type PateCoalFundingRoute =
  | "DILIGENCE_BRIDGE"
  | "PRIVATE_MINERAL_LENDER"
  | "OPERATOR_JV"
  | "OFFTAKE_PREPAYMENT"
  | "ROYALTY_STREAMING"
  | "XRPL_PERMISSIONED_RECEIPT"
  | "AAVE_ACCEPTED_COLLATERAL_ONLY"
  | "BLOCKED";

export type PateCoalRouteEligibility = "ELIGIBLE" | "CONDITIONAL" | "BLOCKED";

// ─── Document record ─────────────────────────────────────────────────────────

export interface PateCoalDocumentRecord {
  type:                PateCoalDocumentType;
  label:               string;
  description:         string;
  status:              PateCoalDocumentStatus;
  required:            boolean;
  hardBlocksFinancing: boolean;
  scoreWeight:         number;
  category:            "TECHNICAL" | "TITLE" | "PERMITTING" | "COMMERCIAL";
  uploadedAt?:         string;
  notes?:              string;
}

// ─── Asset record ─────────────────────────────────────────────────────────────

export interface PateCoalAssetRecord {
  assetId:          string;
  assetName:        string;
  assetType:        string;
  location:         string;
  reportedAcreage:  number;
  reportedInPlaceValue: string;
  appraiser:        string;
  appraisalYear:    number;
  updateYear:       number;
  primaryStatus:    PateCoalStatus;
  activeStatuses:   PateCoalStatus[];
  documents:        PateCoalDocumentRecord[];
  readinessScore:   number;
  readinessLabel:   string;
  riskFlags:        string[];
  blockedReasons:   string[];
  simulationOnly:   true;
  createdAt:        string;
}

// ─── Readiness result ─────────────────────────────────────────────────────────

export interface PateCoalReadinessResult {
  assetId:              string;
  readinessScore:       number;
  readinessLabel:       string;
  submittedDocuments:   PateCoalDocumentRecord[];
  missingDocuments:     PateCoalDocumentRecord[];
  pendingDocuments:     PateCoalDocumentRecord[];
  hardBlockList:        PateCoalDocumentRecord[];
  isFinancingReady:     boolean;
  isXrplReceiptReady:   boolean;
  fundingPhase:         string;
  scoreByCategory:      Record<"TECHNICAL" | "TITLE" | "PERMITTING" | "COMMERCIAL", { earned: number; max: number }>;
  simulationOnly:       true;
}

// ─── Funding route assessment ─────────────────────────────────────────────────

export interface PateCoalFundingRouteAssessment {
  route:             PateCoalFundingRoute;
  displayName:       string;
  eligibility:       PateCoalRouteEligibility;
  description:       string;
  blockedReasons:    string[];
  conditions:        string[];
  estimatedTimeline: string;
  askRange:          string;
  priority:          number;
  simulationOnly:    true;
}

// ─── Lender packet summary ────────────────────────────────────────────────────

export interface PateCoalLenderPacketSummary {
  assetId:              string;
  headline:             string;
  reportedValue:        string;
  valuationDisclaimer:  string;
  keyStrengths:         string[];
  keyRisks:             string[];
  missingItems:         string[];
  requiredDisclosures:  string[];
  immediateNextSteps:   string[];
  recommendedFirstAsk:  string;
  simulationOnly:       true;
}

// ─── Disclosure ───────────────────────────────────────────────────────────────

export interface PateCoalDisclosure {
  assetId:          string;
  publicWording:    string;
  safetyStatement:  string;
  valuationWarning: string;
  simulationOnly:   true;
}

// ─── Document definitions ─────────────────────────────────────────────────────

const DOCUMENT_DEFINITIONS: Omit<PateCoalDocumentRecord, "status" | "uploadedAt" | "notes">[] = [
  // ── Technical / Engineering (max 40 pts) ──
  {
    type:                "ENGINEERING_APPRAISAL",
    label:               "Engineering Appraisal — Pate Prospect (2020)",
    description:         "James T. Weiss, PE, MBA, F. NSPE appraisal of coal resources in Morgan County, Tennessee. Reports in-place value of $8,378,310,000.",
    required:            true,
    hardBlocksFinancing: false,
    scoreWeight:         12,
    category:            "TECHNICAL",
  },
  {
    type:                "UPDATE_VALUATION_LETTER",
    label:               "2024 Valuation Update Letter",
    description:         "2024 update letter from appraiser maintaining $8,378,310,000 valuation. Conservatively holds 2020 level despite potential coal price changes.",
    required:            true,
    hardBlocksFinancing: false,
    scoreWeight:         5,
    category:            "TECHNICAL",
  },
  {
    type:                "APPENDIX_LEGAL_DESCRIPTION",
    label:               "Appendix — Legal Description",
    description:         "Legal description of the approximately 3,790-acre prospect including parcel details.",
    required:            true,
    hardBlocksFinancing: false,
    scoreWeight:         4,
    category:            "TECHNICAL",
  },
  {
    type:                "COAL_RESERVE_TABLES",
    label:               "Estimated Coal Reserve Tables",
    description:         "Reserve tables showing Rex seam (1,068,000 surface mineable tons), underground mineable (139,282,500 tons), and per-seam breakdowns.",
    required:            true,
    hardBlocksFinancing: false,
    scoreWeight:         9,
    category:            "TECHNICAL",
  },
  {
    type:                "COAL_ANALYSIS",
    label:               "Coal Analysis",
    description:         "Coal quality analysis supporting the engineering appraisal, including seam characteristics.",
    required:            true,
    hardBlocksFinancing: false,
    scoreWeight:         6,
    category:            "TECHNICAL",
  },
  {
    type:                "GEOLOGY_REPORT",
    label:               "General Geology Appendix",
    description:         "Geology appendix covering the Morgan County prospect area, seam mapping, and structural geology notes.",
    required:            true,
    hardBlocksFinancing: false,
    scoreWeight:         4,
    category:            "TECHNICAL",
  },
  // ── Title / Legal (max 25 pts) ──
  {
    type:                "DEED",
    label:               "Current Deed",
    description:         "Current recorded deed for the surface and/or mineral rights property.",
    required:            true,
    hardBlocksFinancing: true,
    scoreWeight:         5,
    category:            "TITLE",
  },
  {
    type:                "MINERAL_RIGHTS_DEED",
    label:               "Mineral Rights Deed",
    description:         "Deed or severance document confirming ownership and right to coal and mineral extraction.",
    required:            true,
    hardBlocksFinancing: true,
    scoreWeight:         7,
    category:            "TITLE",
  },
  {
    type:                "CHAIN_OF_TITLE",
    label:               "Chain of Title",
    description:         "Complete chain of title tracing ownership from original grant through current holder.",
    required:            true,
    hardBlocksFinancing: true,
    scoreWeight:         5,
    category:            "TITLE",
  },
  {
    type:                "TAX_PARCEL_RECORDS",
    label:               "Tax Parcel Records",
    description:         "Morgan County tax parcel IDs, current tax status, and tax certificate.",
    required:            true,
    hardBlocksFinancing: false,
    scoreWeight:         2,
    category:            "TITLE",
  },
  {
    type:                "LIEN_SEARCH",
    label:               "Lien / Mortgage Search",
    description:         "Title search confirming no prior liens, mortgages, or encumbrances on the mineral/surface rights.",
    required:            true,
    hardBlocksFinancing: true,
    scoreWeight:         3,
    category:            "TITLE",
  },
  {
    type:                "UCC_SEARCH",
    label:               "UCC Search",
    description:         "UCC filing search confirming no prior security interests against the mineral rights or related assets.",
    required:            true,
    hardBlocksFinancing: false,
    scoreWeight:         2,
    category:            "TITLE",
  },
  {
    type:                "TITLE_OPINION",
    label:               "Attorney Title Opinion",
    description:         "Written opinion from a Tennessee / mineral-rights attorney confirming clear, marketable title to coal/mineral rights.",
    required:            true,
    hardBlocksFinancing: true,
    scoreWeight:         1,
    category:            "TITLE",
  },
  // ── Permitting / Environmental (max 20 pts) ──
  {
    type:                "PERMIT_STATUS",
    label:               "Current Permit Status Report",
    description:         "Status of any existing Tennessee surface mining permits (TDEC Division of Water Resources) and required permit path for proposed operations.",
    required:            true,
    hardBlocksFinancing: true,
    scoreWeight:         7,
    category:            "PERMITTING",
  },
  {
    type:                "ENVIRONMENTAL_REPORT",
    label:               "Environmental Review",
    description:         "Environmental assessment covering water impact, wetlands, streams, SMCRA compliance, and any outstanding environmental violations.",
    required:            true,
    hardBlocksFinancing: false,
    scoreWeight:         7,
    category:            "PERMITTING",
  },
  {
    type:                "RECLAMATION_BOND_ESTIMATE",
    label:               "Reclamation Bond Estimate",
    description:         "Estimated reclamation / bonding requirement for Tennessee surface and underground mining operations.",
    required:            true,
    hardBlocksFinancing: false,
    scoreWeight:         3,
    category:            "PERMITTING",
  },
  {
    type:                "INSURANCE_ESTIMATE",
    label:               "Insurance / Liability Estimate",
    description:         "Public liability insurance estimate and surety bond estimate required for Tennessee surface mining permit applications.",
    required:            true,
    hardBlocksFinancing: false,
    scoreWeight:         3,
    category:            "PERMITTING",
  },
  // ── Commercial / Lender (max 15 pts) ──
  {
    type:                "LEGAL_OPINION",
    label:               "Legal Opinion — Structure",
    description:         "Legal opinion from transaction counsel on ownership rights, pledge/lien ability, SPV structure, and compliance with applicable securities and commodity laws.",
    required:            true,
    hardBlocksFinancing: true,
    scoreWeight:         4,
    category:            "COMMERCIAL",
  },
  {
    type:                "UPDATED_QP_REPORT",
    label:               "Updated Qualified Person / Mining Engineer Report",
    description:         "Updated technical report from a qualified mining engineer per industry standards (similar to Regulation S-K Subpart 1300 QP standards). Includes recoverable tonnage, mine plan, CAPEX/OPEX, and sensitivity analysis.",
    required:            true,
    hardBlocksFinancing: true,
    scoreWeight:         5,
    category:            "COMMERCIAL",
  },
  {
    type:                "OPERATOR_LOI",
    label:               "Mining Operator LOI",
    description:         "Letter of intent from a mining operator interested in reviewing or operating the Pate Prospect.",
    required:            false,
    hardBlocksFinancing: false,
    scoreWeight:         2,
    category:            "COMMERCIAL",
  },
  {
    type:                "OFFTAKE_LOI",
    label:               "Coal Buyer / Offtake LOI",
    description:         "Letter of intent from a coal buyer, industrial buyer, or offtake broker indicating interest in future production.",
    required:            false,
    hardBlocksFinancing: false,
    scoreWeight:         2,
    category:            "COMMERCIAL",
  },
  {
    type:                "FUNDING_TERM_SHEET",
    label:               "Lender / Investor Term Sheet",
    description:         "Executed or draft term sheet from a lender, JV partner, or royalty/streaming financier.",
    required:            false,
    hardBlocksFinancing: false,
    scoreWeight:         2,
    category:            "COMMERCIAL",
  },
];

// Uploaded evidence from the three PDF files provided
const DEFAULT_SUBMITTED_DOCS: PateCoalDocumentType[] = [
  "ENGINEERING_APPRAISAL",
  "UPDATE_VALUATION_LETTER",
  "APPENDIX_LEGAL_DESCRIPTION",
  "COAL_RESERVE_TABLES",
  "COAL_ANALYSIS",
  "GEOLOGY_REPORT",
];

// Documents whose absence hard-blocks FINANCING_READY
const FINANCING_READY_HARD_BLOCKERS: PateCoalDocumentType[] = [
  "DEED",
  "MINERAL_RIGHTS_DEED",
  "CHAIN_OF_TITLE",
  "LIEN_SEARCH",
  "TITLE_OPINION",
  "PERMIT_STATUS",
  "LEGAL_OPINION",
  "UPDATED_QP_REPORT",
];

// Documents required before XRPL_PERMISSIONED_RECEIPT can be issued
const XRPL_RECEIPT_REQUIRED_DOCS: PateCoalDocumentType[] = [
  "DEED",
  "MINERAL_RIGHTS_DEED",
  "CHAIN_OF_TITLE",
  "TITLE_OPINION",
  "LEGAL_OPINION",
  "FUNDING_TERM_SHEET",
];

// ─── Helper ───────────────────────────────────────────────────────────────────

function hasSubmitted(documents: PateCoalDocumentRecord[], type: PateCoalDocumentType): boolean {
  return documents.some(
    (d) => d.type === type && (d.status === "SUBMITTED" || d.status === "VERIFIED")
  );
}

function scoreLabel(score: number): string {
  if (score >= 91) return "Financing-Ready";
  if (score >= 76) return "Lender Review — Near Financing-Ready";
  if (score >= 61) return "Permitting & Legal Review";
  if (score >= 41) return "Title & Technical Review";
  if (score >= 21) return "Evidence Received / Early Diligence";
  return "Intake / Pre-Diligence";
}

function fundingPhase(score: number): string {
  if (score >= 76) return "Phase 3 — Secured Asset Facility (ready for formal lender)";
  if (score >= 51) return "Phase 2 — Operator JV / Updated Technical Package";
  if (score >= 21) return "Phase 1 — Diligence Bridge / Title & Technical Work";
  return "Phase 0 — Evidence Intake";
}

// ─── Core functions ───────────────────────────────────────────────────────────

/**
 * Creates the base asset record with document statuses.
 * Pass submittedDocTypes to indicate which documents have been received.
 * Defaults to the 6 documents from the uploaded PDF evidence package.
 */
export function createPateCoalAssetRecord(
  submittedDocTypes: PateCoalDocumentType[] = DEFAULT_SUBMITTED_DOCS
): PateCoalAssetRecord {
  const documents: PateCoalDocumentRecord[] = DOCUMENT_DEFINITIONS.map((def) => ({
    ...def,
    status: submittedDocTypes.includes(def.type) ? "SUBMITTED" : "MISSING",
  }));

  const score = calculatePateCoalReadinessScore({ documents } as PateCoalAssetRecord).readinessScore;
  const label = scoreLabel(score);

  // Determine active statuses
  const activeStatuses: PateCoalStatus[] = ["EVIDENCE_RECEIVED"];
  if (!hasSubmitted(documents, "DEED") || !hasSubmitted(documents, "MINERAL_RIGHTS_DEED")) {
    activeStatuses.push("TITLE_PENDING");
  }
  if (!hasSubmitted(documents, "UPDATED_QP_REPORT")) {
    activeStatuses.push("TECHNICAL_REPORT_PENDING");
  }
  if (!hasSubmitted(documents, "PERMIT_STATUS")) {
    activeStatuses.push("PERMITTING_PENDING");
  }
  if (!hasSubmitted(documents, "ENVIRONMENTAL_REPORT")) {
    activeStatuses.push("ENVIRONMENTAL_PENDING");
  }
  if (!hasSubmitted(documents, "LEGAL_OPINION") || !hasSubmitted(documents, "TITLE_OPINION")) {
    activeStatuses.push("LEGAL_PENDING");
  }

  const blockedReasons: string[] = [];
  const hardBlocked = FINANCING_READY_HARD_BLOCKERS.filter((t) => !hasSubmitted(documents, t));
  if (hardBlocked.length > 0) {
    blockedReasons.push(`Financing-ready gate blocked by missing: ${hardBlocked.join(", ")}`);
  }

  const riskFlags = [
    "Reported in-place value ($8,378,310,000) is NOT guaranteed market value, financing value, or sale price",
    "No updated independent qualified-person mining report on file",
    "Title / mineral rights ownership not yet verified by independent attorney",
    "No current permit status confirmed",
    "No environmental review completed",
    "Coal prices and market conditions may differ significantly from 2020 appraisal assumptions",
    "Lender haircut will apply — advance rate against in-place value will be substantially lower",
  ];

  return {
    assetId:             PATE_COAL_META.assetId,
    assetName:           PATE_COAL_META.assetName,
    assetType:           PATE_COAL_META.assetType,
    location:            PATE_COAL_META.location,
    reportedAcreage:     PATE_COAL_META.reportedAcreage,
    reportedInPlaceValue: PATE_COAL_META.reportedInPlaceValue,
    appraiser:           PATE_COAL_META.appraiser,
    appraisalYear:       PATE_COAL_META.appraisalYear,
    updateYear:          PATE_COAL_META.updateYear,
    primaryStatus:       "EVIDENCE_RECEIVED",
    activeStatuses,
    documents,
    readinessScore:      score,
    readinessLabel:      label,
    riskFlags,
    blockedReasons,
    simulationOnly:      true,
    createdAt:           new Date().toISOString(),
  };
}

/**
 * Calculates the readiness score for a Pate Coal asset record.
 * Score is 0–100 based on weighted document categories.
 */
export function calculatePateCoalReadinessScore(
  record: Pick<PateCoalAssetRecord, "documents">
): PateCoalReadinessResult {
  const docs = record.documents;

  const scoreByCategory: Record<string, { earned: number; max: number }> = {
    TECHNICAL:   { earned: 0, max: 0 },
    TITLE:       { earned: 0, max: 0 },
    PERMITTING:  { earned: 0, max: 0 },
    COMMERCIAL:  { earned: 0, max: 0 },
  };

  for (const doc of docs) {
    scoreByCategory[doc.category].max += doc.scoreWeight;
    if (doc.status === "SUBMITTED" || doc.status === "VERIFIED") {
      scoreByCategory[doc.category].earned += doc.scoreWeight;
    }
  }

  const totalEarned = Object.values(scoreByCategory).reduce((s, c) => s + c.earned, 0);
  const totalMax    = Object.values(scoreByCategory).reduce((s, c) => s + c.max, 0);
  const score       = totalMax > 0 ? Math.round((totalEarned / totalMax) * 100) : 0;
  const label       = scoreLabel(score);

  const submittedDocuments = docs.filter(
    (d) => d.status === "SUBMITTED" || d.status === "VERIFIED"
  );
  const missingDocuments   = docs.filter((d) => d.status === "MISSING");
  const pendingDocuments   = docs.filter((d) => d.status === "PENDING");
  const hardBlockList      = docs.filter(
    (d) => d.hardBlocksFinancing && (d.status === "MISSING" || d.status === "PENDING")
  );

  const isFinancingReady =
    FINANCING_READY_HARD_BLOCKERS.every((t) =>
      docs.some((d) => d.type === t && (d.status === "SUBMITTED" || d.status === "VERIFIED"))
    );

  const isXrplReceiptReady =
    isFinancingReady &&
    XRPL_RECEIPT_REQUIRED_DOCS.every((t) =>
      docs.some((d) => d.type === t && (d.status === "SUBMITTED" || d.status === "VERIFIED"))
    );

  return {
    assetId:            PATE_COAL_META.assetId,
    readinessScore:     score,
    readinessLabel:     label,
    submittedDocuments,
    missingDocuments,
    pendingDocuments,
    hardBlockList,
    isFinancingReady,
    isXrplReceiptReady,
    fundingPhase:       fundingPhase(score),
    scoreByCategory:    scoreByCategory as PateCoalReadinessResult["scoreByCategory"],
    simulationOnly:     true,
  };
}

/**
 * Returns documents that are missing and need to be requested.
 */
export function getMissingPateCoalDocuments(
  record: Pick<PateCoalAssetRecord, "documents">
): PateCoalDocumentRecord[] {
  return record.documents.filter((d) => d.status === "MISSING");
}

/**
 * Recommends funding routes based on the current document status.
 */
export function recommendPateCoalFundingRoutes(
  record: Pick<PateCoalAssetRecord, "documents">
): PateCoalFundingRouteAssessment[] {
  const docs = record.documents;

  const hasDeed           = hasSubmitted(docs, "DEED");
  const hasMineralDeed    = hasSubmitted(docs, "MINERAL_RIGHTS_DEED");
  const hasChainOfTitle   = hasSubmitted(docs, "CHAIN_OF_TITLE");
  const hasTitleOpinion   = hasSubmitted(docs, "TITLE_OPINION");
  const hasLegalOpinion   = hasSubmitted(docs, "LEGAL_OPINION");
  const hasQPReport       = hasSubmitted(docs, "UPDATED_QP_REPORT");
  const hasPermitStatus   = hasSubmitted(docs, "PERMIT_STATUS");
  const hasOfftakeLOI     = hasSubmitted(docs, "OFFTAKE_LOI");
  const hasOperatorLOI    = hasSubmitted(docs, "OPERATOR_LOI");
  const hasFundingTerms   = hasSubmitted(docs, "FUNDING_TERM_SHEET");

  const titleClear        = hasDeed && hasMineralDeed && hasChainOfTitle && hasTitleOpinion;
  const legalClear        = hasLegalOpinion;

  // ── DILIGENCE_BRIDGE ──
  const diligenceBridge: PateCoalFundingRouteAssessment = {
    route:             "DILIGENCE_BRIDGE",
    displayName:       "Diligence Bridge Facility",
    eligibility:       "CONDITIONAL",
    description:       "Smaller bridge facility (typically $50K–$500K) to fund title work, updated qualified-person mining report, legal opinion, permitting review, and environmental study. First monetization path for this asset.",
    conditions: [
      "Pledge option or collateral agreement on mineral rights if legally available",
      "NDA and intake form executed with prospective bridge lender",
      "Entity ownership documents showing authority to pledge",
      "Repayment plan from larger facility, JV, or sale/refinance",
    ],
    blockedReasons:    [],
    estimatedTimeline: "30 – 90 days from lender introduction",
    askRange:          "$50,000 – $500,000",
    priority:          1,
    simulationOnly:    true,
  };

  // ── PRIVATE_MINERAL_LENDER ──
  const mineralLenderBlocks: string[] = [];
  if (!hasDeed)         mineralLenderBlocks.push("DEED: current property deed required");
  if (!hasMineralDeed)  mineralLenderBlocks.push("MINERAL_RIGHTS_DEED: mineral rights ownership required");
  if (!hasChainOfTitle) mineralLenderBlocks.push("CHAIN_OF_TITLE: full chain of title required");
  if (!hasTitleOpinion) mineralLenderBlocks.push("TITLE_OPINION: attorney title opinion required");
  if (!hasLegalOpinion) mineralLenderBlocks.push("LEGAL_OPINION: transaction legal opinion required");
  if (!hasQPReport)     mineralLenderBlocks.push("UPDATED_QP_REPORT: updated qualified-person mining report required — lender will not rely solely on 2020 appraisal");

  const privateMineralLender: PateCoalFundingRouteAssessment = {
    route:          "PRIVATE_MINERAL_LENDER",
    displayName:    "Private Mineral Lender / Asset-Backed Lender",
    eligibility:    mineralLenderBlocks.length === 0 ? "CONDITIONAL" : "BLOCKED",
    description:    "Asset-backed loan or credit facility from a private mineral lender or family office. Lender applies haircut to the engineering in-place value — advance rate is significantly lower than reported value, especially pre-permit.",
    blockedReasons: mineralLenderBlocks,
    conditions:     mineralLenderBlocks.length === 0 ? [
      "Insurance / bonding estimate provided",
      "Mine plan and logistics overview",
      "Lender NDA and intake form",
      "Permit path documented",
    ] : [],
    estimatedTimeline: "90 – 180 days after complete package delivered to lender",
    askRange:          "Private — depends on lender advance rate and haircut from in-place value",
    priority:          2,
    simulationOnly:    true,
  };

  // ── OPERATOR_JV ──
  const operatorJv: PateCoalFundingRouteAssessment = {
    route:          "OPERATOR_JV",
    displayName:    "Mining Operator Joint Venture",
    eligibility:    "CONDITIONAL",
    description:    "Mining operator reviews reserves, funds updated study and permitting, and earns mining rights / revenue share / JV interest. Avoids large debt before operational proof.",
    blockedReasons: [],
    conditions: [
      "Mineral rights ownership confirmed (deed / title opinion)",
      "Operator performs independent technical review",
      "JV agreement drafted by transaction counsel",
      "Revenue share and carried interest structure defined",
      !hasOperatorLOI ? "No operator LOI on file yet — first step is operator introduction" : "",
    ].filter(Boolean),
    estimatedTimeline: "60 – 180 days from first operator introduction",
    askRange:          "Operator-funded (non-debt) — operator provides capital in exchange for interest",
    priority:          2,
    simulationOnly:    true,
  };

  // ── OFFTAKE_PREPAYMENT ──
  const offtakeBlocks: string[] = [];
  if (!hasQPReport)     offtakeBlocks.push("UPDATED_QP_REPORT: recoverable tonnage confirmation required");
  if (!hasPermitStatus) offtakeBlocks.push("PERMIT_STATUS: coal buyer will require permit path before offtake");
  if (!hasOfftakeLOI)   offtakeBlocks.push("OFFTAKE_LOI: no coal buyer LOI on file yet");

  const offtakePrepayment: PateCoalFundingRouteAssessment = {
    route:          "OFFTAKE_PREPAYMENT",
    displayName:    "Offtake Prepayment / Coal Buyer Advance",
    eligibility:    offtakeBlocks.length === 0 ? "CONDITIONAL" : "BLOCKED",
    description:    "If recoverable tonnage and coal quality are confirmed, a coal buyer may advance capital against future delivery. Requires updated technical report, access/logistics plan, and permitting path.",
    blockedReasons: offtakeBlocks,
    conditions: [],
    estimatedTimeline: "180 – 365 days after QP report, permits path, and buyer introduction",
    askRange:          "Negotiated with buyer — typically advance against committed tonnage at contracted price",
    priority:          4,
    simulationOnly:    true,
  };

  // ── ROYALTY_STREAMING ──
  const royaltyStreaming: PateCoalFundingRouteAssessment = {
    route:          "ROYALTY_STREAMING",
    displayName:    "Royalty / Streaming Financing",
    eligibility:    "CONDITIONAL",
    description:    "A funder advances capital now in exchange for a royalty per ton produced. Works for mining assets when direct collateral lending is difficult. TROPTIONS records royalty agreement and payment ledger.",
    blockedReasons: [],
    conditions: [
      "Mineral rights ownership confirmed",
      "Royalty agreement drafted by transaction counsel",
      "Mine plan and production schedule estimate",
      hasMineralDeed ? "Mineral rights deed — confirmed" : "Mineral rights deed — required before royalty agreement",
    ].filter(Boolean),
    estimatedTimeline: "120 – 240 days from funder introduction",
    askRange:          "Negotiated — capital advance against per-ton royalty at agreed rate",
    priority:          3,
    simulationOnly:    true,
  };

  // ── XRPL_PERMISSIONED_RECEIPT ──
  const xrplBlocks: string[] = [];
  if (!titleClear)      xrplBlocks.push("Title clear required: DEED + MINERAL_RIGHTS_DEED + CHAIN_OF_TITLE + TITLE_OPINION");
  if (!legalClear)      xrplBlocks.push("Legal wrapper required: LEGAL_OPINION and SPV / lien structure");
  if (!hasFundingTerms) xrplBlocks.push("Lender terms required: FUNDING_TERM_SHEET before XRPL receipt");
  xrplBlocks.push("Authorized trustline policy must be configured on XRPL issuer wallet");
  xrplBlocks.push("Holder rights and redemption terms must be defined in writing");
  xrplBlocks.push("Issuer policy and currency code (PATE001 / PATECOAL) must be finalized");

  const xrplReceipt: PateCoalFundingRouteAssessment = {
    route:          "XRPL_PERMISSIONED_RECEIPT",
    displayName:    "XRPL Permissioned RWA Receipt / IOU",
    eligibility:    "BLOCKED",
    description:    "A permissioned XRPL receipt (PATE001 or PATECOAL) can be issued to lender/escrow wallets as a digital proof-of-claim and audit trail record. NOT a public token sale. Issued only to authorized wallets after full legal clearance.",
    blockedReasons: xrplBlocks,
    conditions: [
      "Use authorized trustlines only — no public XRPL trading until legal approval",
      "Freeze / clawback rights enabled on issuer wallet",
      "No stablecoin issuance backed by this receipt",
    ],
    estimatedTimeline: "After all title, legal, and lender terms complete — not a first-phase item",
    askRange:          "Receipt-only (not a direct funding source) — supports lender control record",
    priority:          6,
    simulationOnly:    true,
  };

  // ── AAVE_ACCEPTED_COLLATERAL_ONLY (hard-blocked) ──
  const aaveRoute: PateCoalFundingRouteAssessment = {
    route:          "AAVE_ACCEPTED_COLLATERAL_ONLY",
    displayName:    "Aave v3 — Accepted Crypto Collateral Only",
    eligibility:    "BLOCKED",
    description:    "Aave v3 accepts only approved crypto collateral assets (ETH, WBTC, stablecoins) to borrow GHO/stablecoins. Raw coal/mineral rights are NOT accepted Aave collateral. Aave can only be used with separately held accepted crypto assets.",
    blockedReasons: [
      "Raw coal prospects and mineral rights are not in the Aave v3 collateral registry",
      "Aave requires overcollateralized accepted crypto assets — positions can be liquidated if health factor drops below 1",
      "PATE-COAL-001 is not an ERC-20 token depositable into Aave",
      "Aave can only be used if TROPTIONS separately holds approved crypto collateral (ETH / supported BTC wrapper / stablecoin) — not this coal asset",
    ],
    conditions: [],
    estimatedTimeline: "Not applicable — hard-blocked for raw mineral rights",
    askRange:          "Not applicable",
    priority:          7,
    simulationOnly:    true,
  };

  return [
    diligenceBridge,
    privateMineralLender,
    operatorJv,
    royaltyStreaming,
    offtakePrepayment,
    xrplReceipt,
    aaveRoute,
  ];
}

/**
 * Generates a lender-facing summary packet for the Pate Prospect.
 */
export function generatePateCoalLenderPacketSummary(
  record: Pick<PateCoalAssetRecord, "documents" | "readinessScore">
): PateCoalLenderPacketSummary {
  const missing = getMissingPateCoalDocuments(record);
  const hardMissing = missing
    .filter((d) => d.hardBlocksFinancing)
    .map((d) => d.label);

  return {
    assetId:      PATE_COAL_META.assetId,
    headline:
      "Pate Prospect — Morgan County, Tennessee Coal/Mineral-Rights RWA Diligence Package. " +
      "Engineering appraisal package received. Title, legal, and updated technical work required before facility.",
    reportedValue: PATE_COAL_META.reportedInPlaceValue,
    valuationDisclaimer:
      "The reported in-place value of $8,378,310,000 is an engineering estimate of coal in-place value only. " +
      "It is NOT a guaranteed market value, financing value, liquidation value, or recoverable reserve value. " +
      "Lender advance rates will be significantly lower than reported in-place value, particularly at pre-permit stage.",
    keyStrengths: [
      "Engineering appraisal by James T. Weiss, PE, MBA, F. NSPE (2020) with 2024 update confirming valuation",
      `Approximately ${PATE_COAL_META.reportedAcreage.toLocaleString()} acres in Morgan County, Tennessee`,
      `${PATE_COAL_META.coalSeams.length} identified coal seams including Rex, Sewanee, Richland, and Nemo`,
      `${PATE_COAL_META.rexSeamSurfaceTons.toLocaleString()} surface mineable tons (Rex seam); ${PATE_COAL_META.undergroundTons.toLocaleString()} underground mineable tons`,
      "Appraisal includes legal description, coal reserve tables, coal analysis, and geology appendices",
      "Appraiser notes conservative 2024 hold of 2020 valuation level",
    ],
    keyRisks: [
      "No current independent title opinion or mineral rights deed on file",
      "No updated qualified-person / mining engineer report (per current industry standards) on file",
      "No current permit status — Tennessee surface/underground mining permits required",
      "No environmental assessment completed",
      "In-place value ≠ recoverable value — lender haircut expected to be substantial",
      "2020 appraisal assumptions (coal price, market) may not reflect current conditions",
      "No operator, offtake buyer, or mine plan documented",
    ],
    missingItems:       hardMissing,
    requiredDisclosures: [
      "This package is provided for diligence purposes only",
      "No securities offering, investment advice, or guarantee is made",
      "Lender/investor must conduct independent due diligence",
      "TROPTIONS is not a licensed mining operator, commodity broker, or investment advisor",
      "All financing is subject to legal review and transaction counsel approval",
    ],
    immediateNextSteps: [
      "Collect current deed and mineral rights deed from asset owner",
      "Order full chain of title and lien search",
      "Engage Tennessee mineral-rights attorney for title opinion",
      "Commission updated qualified-person / mining engineer report",
      "Obtain current permit status from Tennessee TDEC",
      "Identify and introduce potential bridge lender / operator",
    ],
    recommendedFirstAsk:
      "Diligence bridge of $50K–$500K to fund title opinion, updated QP report, and legal opinion. " +
      "Larger facility after complete package.",
    simulationOnly: true,
  };
}

/**
 * Returns the standard public-facing disclosure for this asset.
 */
export function generatePateCoalDisclosure(): PateCoalDisclosure {
  return {
    assetId: PATE_COAL_META.assetId,
    publicWording:
      "The Pate Prospect package includes engineering appraisal materials and reserve-related documentation " +
      "for a coal/mineral-rights prospect in Morgan County, Tennessee. TROPTIONS treats this as an RWA diligence " +
      "package only. The reported in-place valuation of $8,378,310,000 is not a guarantee of recoverable value, " +
      "financing value, liquidity, or sale price. Any financing requires title verification, updated technical " +
      "review, legal approval, permitting review, environmental review, lender acceptance, and executed " +
      "transaction documents.",
    safetyStatement:
      "No live IOU issuance, stablecoin issuance, custody, exchange, mining operation, permitting claim, " +
      "Aave execution, token buyback, liquidity pool execution, or public investment functionality was enabled.",
    valuationWarning:
      "The reported in-place value ($8,378,310,000) was determined by an independent engineer in 2020 and " +
      "conservatively maintained in a 2024 update letter. This is an estimate of coal in-place value only. " +
      "Recoverable value, market value, financing value, and liquidation value will all be substantially different " +
      "and can only be determined through updated technical review, market analysis, permitting review, and " +
      "arm's-length lender/buyer acceptance.",
    simulationOnly: true,
  };
}

/**
 * Returns a BLOCKED version of the asset record with a reason appended.
 */
export function blockPateCoalAsset(
  record: PateCoalAssetRecord,
  reason: string
): PateCoalAssetRecord {
  return {
    ...record,
    primaryStatus:  "BLOCKED",
    activeStatuses: ["BLOCKED"],
    blockedReasons: [...record.blockedReasons, reason],
  };
}
