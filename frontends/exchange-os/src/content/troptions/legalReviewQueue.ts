/**
 * Troptions Legal Review Queue
 * Items pending legal review with status tracking.
 */

export type LegalReviewStatus =
  | "pending"
  | "in-review"
  | "approved"
  | "rejected"
  | "needs-more-info";

export type LegalReviewCategory =
  | "claim"
  | "asset"
  | "token"
  | "stablecoin"
  | "exchange"
  | "integration"
  | "rwa"
  | "funding-route"
  | "jurisdiction"
  | "governance";

export interface LegalReviewItem {
  itemId: string;
  category: LegalReviewCategory;
  subject: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: LegalReviewStatus;
  assignedCounsel: string | null;
  filingOrMemo: string | null;
  linkedIds: string[];
  dateAdded: string;
  targetCompletionDate: string | null;
  notes: string;
}

export const LEGAL_REVIEW_QUEUE: LegalReviewItem[] = [
  {
    itemId: "LRQ-001",
    category: "token",
    subject: "Troptions Unity (TUNITY) — Legal Classification",
    description: "Determine whether TUNITY is a utility token, security, stablecoin, or other regulated instrument. Currently marketed with 'stable, asset-backed' language which requires licensing analysis.",
    priority: "CRITICAL",
    status: "pending",
    assignedCounsel: null,
    filingOrMemo: null,
    linkedIds: ["ASSET-TUNITY-001", "CLAIM-UNITY-001", "RISK-TUNITY-001"],
    dateAdded: "2025-01-01",
    targetCompletionDate: null,
    notes: "All TUNITY public copy is blocked until counsel completes classification analysis.",
  },
  {
    itemId: "LRQ-002",
    category: "exchange",
    subject: "QuantumXchange Exchange Licensing Analysis",
    description: "Operating a crypto exchange requires licensing (broker-dealer, ATS, MTL). Determine the licensing pathway for the QuantumXchange initiative.",
    priority: "CRITICAL",
    status: "pending",
    assignedCounsel: null,
    filingOrMemo: null,
    linkedIds: ["INT-QXCHANGE-001", "CLAIM-EXCHANGE-001", "RISK-EXCH-001"],
    dateAdded: "2025-01-01",
    targetCompletionDate: null,
    notes: "All exchange claims are blocked until this is resolved.",
  },
  {
    itemId: "LRQ-003",
    category: "rwa",
    subject: "SALP / RWA Legal Classification Framework",
    description: "Define legal classification requirements for each SALP asset category. Determine whether tokenized RWA constitutes securities. Define transfer restrictions and investor eligibility requirements.",
    priority: "CRITICAL",
    status: "pending",
    assignedCounsel: null,
    filingOrMemo: null,
    linkedIds: ["RWA-SALP-001", "CLAIM-SALP-001", "RISK-SALP-001"],
    dateAdded: "2025-01-01",
    targetCompletionDate: null,
    notes: "No SALP tokenization can proceed until legal framework is defined.",
  },
  {
    itemId: "LRQ-004",
    category: "integration",
    subject: "GivBux Agreement Execution",
    description: "Execute integration agreement with GivBux. Verify and date-stamp merchant count. Reconcile 480K vs 580K figure.",
    priority: "HIGH",
    status: "pending",
    assignedCounsel: null,
    filingOrMemo: null,
    linkedIds: ["INT-GIVBUX-001", "CLAIM-MERCHANT-001", "CLAIM-MERCHANT-002"],
    dateAdded: "2025-01-01",
    targetCompletionDate: null,
    notes: "Merchant count claims are blocked until agreement is signed and count verified.",
  },
  {
    itemId: "LRQ-005",
    category: "claim",
    subject: "Balance Sheet Enhancement Accounting Analysis",
    description: "Obtain independent CPA or accounting firm analysis of whether Troptions tokens can be recognized as balance-sheet assets and under what conditions.",
    priority: "HIGH",
    status: "pending",
    assignedCounsel: null,
    filingOrMemo: null,
    linkedIds: ["CLAIM-BALANCE-001", "ADV-005"],
    dateAdded: "2025-01-01",
    targetCompletionDate: null,
    notes: "All balance-sheet language is blocked until accounting opinion is obtained.",
  },
  {
    itemId: "LRQ-006",
    category: "token",
    subject: "Troptions Gold — CFTC/SEC Classification",
    description: "Determine whether Troptions Gold is a commodity (CFTC), security (SEC), or other regulated instrument. Currently no audit documentation, vault custody, or legal opinion exists.",
    priority: "HIGH",
    status: "pending",
    assignedCounsel: null,
    filingOrMemo: null,
    linkedIds: ["ASSET-TGOLD-001", "CLAIM-AUDIT-001", "RISK-TGOLD-001"],
    dateAdded: "2025-01-01",
    targetCompletionDate: null,
    notes: "All gold claims blocked. Vault and audit must also be completed.",
  },
  {
    itemId: "LRQ-007",
    category: "stablecoin",
    subject: "Internal Stable Unit Licensing Analysis",
    description: "Determine whether Troptions internal stable units require money-transmission licensing, stablecoin licensing, or other regulatory authorization before any public use.",
    priority: "CRITICAL",
    status: "pending",
    assignedCounsel: null,
    filingOrMemo: null,
    linkedIds: ["SU-TROP-USD-001", "RISK-STABLE-001"],
    dateAdded: "2025-01-01",
    targetCompletionDate: null,
    notes: "Internal stable units are blocked for public marketing until licensing analysis is complete.",
  },
];

export function getPendingReviewItems(): LegalReviewItem[] {
  return LEGAL_REVIEW_QUEUE.filter((i) => i.status === "pending" || i.status === "in-review");
}

export function getCriticalReviewItems(): LegalReviewItem[] {
  return LEGAL_REVIEW_QUEUE.filter((i) => i.priority === "CRITICAL");
}
