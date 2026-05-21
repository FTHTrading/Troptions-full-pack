/**
 * Funding Playbook Registry
 *
 * Central registry of all funding playbook documents, SOPs, and reference
 * materials available on the TROPTIONS platform.
 *
 * SAFETY: No entry in this registry implies live execution, IOU issuance,
 * stablecoin issuance, custody, exchange, mining operation, permitting claim,
 * Aave execution, token buyback, LP execution, or public investment.
 * All documents are informational and simulation-only.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PlaybookStatus = "PRINT_TO_PDF_READY" | "PDF_PENDING" | "BLOCKED";

export type PlaybookCategory =
  | "MASTER"
  | "ROUTE_MATRIX"
  | "INTAKE"
  | "PROCEDURE"
  | "REFERENCE"
  | "CHEAT_SHEET";

export type PlaybookAudience =
  | "CLIENT"
  | "OPERATOR"
  | "LENDER"
  | "INTERNAL"
  | "ASSET_OWNER"
  | "EXECUTIVE";

export type DownloadMethod = "PRINT_TO_PDF" | "JSON_API" | "MARKDOWN";

export interface FundingPlaybookEntry {
  id: string;
  title: string;
  route: string;
  category: PlaybookCategory;
  /** 1 = easiest to prepare / use  |  5 = most complex */
  difficulty: 1 | 2 | 3 | 4 | 5;
  audience: PlaybookAudience[];
  status: PlaybookStatus;
  description: string;
  /** Which client types / asset types this document is required for */
  requiredFor: string[];
  downloadMethod: DownloadMethod;
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

export const FUNDING_PLAYBOOK_REGISTRY: FundingPlaybookEntry[] = [
  {
    id: "master-funding-playbook",
    title: "Master Funding Playbook",
    route: "/troptions/docs/funding-playbook",
    category: "MASTER",
    difficulty: 2,
    audience: ["OPERATOR", "LENDER", "ASSET_OWNER", "EXECUTIVE"],
    status: "PRINT_TO_PDF_READY",
    description:
      "Comprehensive guide covering all 10 funding routes with step-by-step procedures, difficulty ratings, ease ratings, timeline estimates, success probabilities, owner responsibility badges, hard-blocker warnings, escalation rules, and the open-source protocol stack. Print-to-PDF produces a professional client-ready document.",
    requiredFor: [
      "All client intake sessions",
      "Lender review meetings",
      "Operator JV discussions",
      "Asset owner document collection",
      "Executive pipeline review",
    ],
    downloadMethod: "PRINT_TO_PDF",
  },
  {
    id: "funding-route-matrix",
    title: "Funding Route Matrix",
    route: "/troptions/docs/funding-playbook#route-matrix",
    category: "ROUTE_MATRIX",
    difficulty: 1,
    audience: ["CLIENT", "LENDER", "EXECUTIVE"],
    status: "PRINT_TO_PDF_READY",
    description:
      "One-page comparison of all 10 funding routes: tier, priority, difficulty stars, ease stars, typical timeline, success probability, and asset eligibility. Designed for quick client-facing explanation and lender pre-qualification calls.",
    requiredFor: [
      "First client meeting",
      "Lender pre-qualification",
      "Route selection decision",
    ],
    downloadMethod: "PRINT_TO_PDF",
  },
  {
    id: "client-intake-checklist",
    title: "Client Intake Checklist",
    route: "/troptions/docs/funding-playbook#intake-system",
    category: "INTAKE",
    difficulty: 1,
    audience: ["CLIENT", "OPERATOR"],
    status: "PRINT_TO_PDF_READY",
    description:
      "5-phase cookie-cutter intake pipeline: Day-1 fee agreement and NDA, document collection by asset type, route selection matrix, funding package assembly, and execution routing. Includes printable checklists for mineral rights, gemstones, carbon credits, and real estate.",
    requiredFor: [
      "Every new client onboarding",
      "Asset owner intake",
      "Document collection phase",
    ],
    downloadMethod: "PRINT_TO_PDF",
  },
  {
    id: "pate-coal-001-funding-procedure",
    title: "PATE-COAL-001 Funding Procedure",
    route: "/troptions/docs/funding-playbook#pate-coal-map",
    category: "PROCEDURE",
    difficulty: 3,
    audience: ["OPERATOR", "LENDER", "ASSET_OWNER"],
    status: "PRINT_TO_PDF_READY",
    description:
      "Prioritized funding strategy for PATE-COAL-001 at its current 40/100 readiness score. Maps 8 routes from highest to lowest priority with specific hard-blocker callouts, what must be resolved to advance, and which routes are available now vs. conditional on document completion.",
    requiredFor: [
      "Pate Prospect asset funding",
      "Coal/mineral-rights asset onboarding",
      "PATE-COAL-001 lender presentation",
    ],
    downloadMethod: "PRINT_TO_PDF",
  },
  {
    id: "executive-route-cheat-sheet",
    title: "Executive Route Cheat Sheet",
    route: "/troptions/docs/funding-playbook#route-matrix",
    category: "CHEAT_SHEET",
    difficulty: 1,
    audience: ["EXECUTIVE", "OPERATOR", "CLIENT"],
    status: "PRINT_TO_PDF_READY",
    description:
      "Single-page executive summary of all routes sorted by PURSUE_FIRST priority. Shows route name, tier, min/max ask, timeline, and one-line action. Optimized for printing as a quarter-fold card for client meetings and lender calls.",
    requiredFor: [
      "Executive briefings",
      "Quick reference during calls",
      "Client decision support",
    ],
    downloadMethod: "PRINT_TO_PDF",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Return all entries regardless of status */
export function getAllPlaybooks(): FundingPlaybookEntry[] {
  return FUNDING_PLAYBOOK_REGISTRY;
}

/** Return only entries that are ready to print/download */
export function getPrintReadyPlaybooks(): FundingPlaybookEntry[] {
  return FUNDING_PLAYBOOK_REGISTRY.filter(
    (e) => e.status === "PRINT_TO_PDF_READY",
  );
}

/** Return a single entry by id, or undefined */
export function getPlaybookById(id: string): FundingPlaybookEntry | undefined {
  return FUNDING_PLAYBOOK_REGISTRY.find((e) => e.id === id);
}

/** Assert: no entry in the registry implies live execution */
export function assertNoLiveExecution(): void {
  const live = FUNDING_PLAYBOOK_REGISTRY.filter(
    (e) =>
      e.description.toLowerCase().includes("live execution") ||
      e.description.toLowerCase().includes("live iou") ||
      e.description.toLowerCase().includes("live stablecoin"),
  );
  if (live.length > 0) {
    throw new Error(
      `Registry safety violation: ${live.map((e) => e.id).join(", ")} imply live execution`,
    );
  }
}
