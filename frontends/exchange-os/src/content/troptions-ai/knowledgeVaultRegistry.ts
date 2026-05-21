/**
 * Troptions Sovereign AI — Knowledge Vault Registry
 *
 * Defines the data model and mock records for client knowledge vaults.
 *
 * SAFETY INVARIANTS:
 *   simulationOnly: true as const
 *   liveExecutionEnabled: false as const
 *
 * STRICT DATA RULES:
 * - No PHI (protected health information) may be stored or simulated
 * - No private keys, seed phrases, or wallet credentials
 * - No passwords or authentication secrets
 * - No SSNs, tax IDs, or personal identification numbers
 * - No bank account numbers or routing numbers
 * - healthcare_restricted items cannot route to live AI systems
 * - financial_restricted items require compliance review before AI use
 * - legal_restricted items require legal review before AI use
 */

// ─── Source Types ─────────────────────────────────────────────────────────────

export type TroptionsKnowledgeSourceType =
  | "document"
  | "website"
  | "policy"
  | "faq"
  | "transcript"
  | "media_metadata"
  | "workflow"
  | "form"
  | "contract_template"
  | "training_note"
  | "proof_record";

// ─── Sensitivity ──────────────────────────────────────────────────────────────

export type TroptionsKnowledgeSensitivity =
  | "public"
  | "internal"
  | "confidential"
  | "regulated"
  | "healthcare_restricted"
  | "financial_restricted"
  | "legal_restricted";

// ─── Review Status ────────────────────────────────────────────────────────────

export type TroptionsKnowledgeReviewStatus =
  | "pending_review"
  | "approved"
  | "rejected"
  | "needs_legal_review"
  | "needs_compliance_review"
  | "blocked"
  | "archived";

// ─── Knowledge Item ───────────────────────────────────────────────────────────

export interface TroptionsKnowledgeItem {
  id: string;
  namespaceId: string;
  title: string;
  description: string;
  sourceType: TroptionsKnowledgeSourceType;
  sensitivity: TroptionsKnowledgeSensitivity;
  reviewStatus: TroptionsKnowledgeReviewStatus;
  ipfsCid?: string;
  sha256?: string;
  proofRecordId?: string;
  allowedAiSystemIds: string[];
  blockedAiSystemIds: string[];
  tags: string[];
  simulationOnly: true;
  liveExecutionEnabled: false;
  createdAt: string;
  updatedAt: string;
}

// ─── Knowledge Vault ──────────────────────────────────────────────────────────

export interface TroptionsKnowledgeVault {
  id: string;
  namespaceId: string;
  label: string;
  description: string;
  itemCount: number;
  totalSizeLabel: string;
  sensitivity: TroptionsKnowledgeSensitivity;
  reviewStatus: TroptionsKnowledgeReviewStatus;
  simulationOnly: true;
  liveExecutionEnabled: false;
  createdAt: string;
  updatedAt: string;
}

// ─── Sensitivity Rules ────────────────────────────────────────────────────────

export interface TroptionsKnowledgeSensitivityRule {
  sensitivity: TroptionsKnowledgeSensitivity;
  label: string;
  allowLiveAiRouting: false;
  requiresReview: boolean;
  reviewType: string | null;
  blockedNote: string;
}

export const KNOWLEDGE_SENSITIVITY_RULES: TroptionsKnowledgeSensitivityRule[] = [
  {
    sensitivity: "public",
    label: "Public",
    allowLiveAiRouting: false,
    requiresReview: false,
    reviewType: null,
    blockedNote: "Public items are simulation-only. Live routing requires Control Hub approval.",
  },
  {
    sensitivity: "internal",
    label: "Internal",
    allowLiveAiRouting: false,
    requiresReview: true,
    reviewType: "standard",
    blockedNote: "Internal items require standard review before AI use.",
  },
  {
    sensitivity: "confidential",
    label: "Confidential",
    allowLiveAiRouting: false,
    requiresReview: true,
    reviewType: "security",
    blockedNote: "Confidential items require security review before AI use.",
  },
  {
    sensitivity: "regulated",
    label: "Regulated",
    allowLiveAiRouting: false,
    requiresReview: true,
    reviewType: "compliance",
    blockedNote: "Regulated items require compliance review before AI use.",
  },
  {
    sensitivity: "healthcare_restricted",
    label: "Healthcare Restricted",
    allowLiveAiRouting: false,
    requiresReview: true,
    reviewType: "healthcare_compliance",
    blockedNote: "Healthcare-restricted items cannot be used in live AI systems without BAA and compliance review. No PHI permitted.",
  },
  {
    sensitivity: "financial_restricted",
    label: "Financial Restricted",
    allowLiveAiRouting: false,
    requiresReview: true,
    reviewType: "financial_compliance",
    blockedNote: "Financial-restricted items require compliance review. No investment advice or securities data permitted.",
  },
  {
    sensitivity: "legal_restricted",
    label: "Legal Restricted",
    allowLiveAiRouting: false,
    requiresReview: true,
    reviewType: "legal_review",
    blockedNote: "Legal-restricted items require attorney review before AI use.",
  },
];

// ─── Mock Knowledge Items ─────────────────────────────────────────────────────

export const KNOWLEDGE_ITEMS: TroptionsKnowledgeItem[] = [
  {
    id: "ki-001",
    namespaceId: "ns-001",
    title: "Troptions Brand Style Guide",
    description: "Brand voice, color palette, typography, and messaging guidelines for the Troptions namespace.",
    sourceType: "document",
    sensitivity: "internal",
    reviewStatus: "approved",
    ipfsCid: undefined,
    sha256: undefined,
    proofRecordId: undefined,
    allowedAiSystemIds: ["sys-001"],
    blockedAiSystemIds: [],
    tags: ["brand", "style", "marketing"],
    simulationOnly: true,
    liveExecutionEnabled: false,
    createdAt: "2026-04-01T00:00:00Z",
    updatedAt: "2026-04-27T00:00:00Z",
  },
  {
    id: "ki-002",
    namespaceId: "ns-001",
    title: "Troptions Media FAQ",
    description: "Frequently asked questions about Troptions media productions and content offerings.",
    sourceType: "faq",
    sensitivity: "public",
    reviewStatus: "approved",
    ipfsCid: undefined,
    sha256: undefined,
    proofRecordId: undefined,
    allowedAiSystemIds: ["sys-001"],
    blockedAiSystemIds: [],
    tags: ["faq", "media", "public"],
    simulationOnly: true,
    liveExecutionEnabled: false,
    createdAt: "2026-04-01T00:00:00Z",
    updatedAt: "2026-04-27T00:00:00Z",
  },
  {
    id: "ki-003",
    namespaceId: "ns-001",
    title: "Troptions Content Policy",
    description: "Content policy and publishing guidelines for Troptions media teams.",
    sourceType: "policy",
    sensitivity: "internal",
    reviewStatus: "approved",
    ipfsCid: undefined,
    sha256: undefined,
    proofRecordId: undefined,
    allowedAiSystemIds: ["sys-001", "sys-002"],
    blockedAiSystemIds: [],
    tags: ["policy", "content", "publishing"],
    simulationOnly: true,
    liveExecutionEnabled: false,
    createdAt: "2026-04-01T00:00:00Z",
    updatedAt: "2026-04-27T00:00:00Z",
  },
  {
    id: "ki-004",
    namespaceId: "ns-002",
    title: "Troptions TV Show Catalog",
    description: "Non-sensitive metadata for Troptions TV productions. No PHI or confidential personal data.",
    sourceType: "media_metadata",
    sensitivity: "internal",
    reviewStatus: "approved",
    ipfsCid: undefined,
    sha256: undefined,
    proofRecordId: undefined,
    allowedAiSystemIds: ["sys-002"],
    blockedAiSystemIds: [],
    tags: ["tv", "catalog", "media"],
    simulationOnly: true,
    liveExecutionEnabled: false,
    createdAt: "2026-04-01T00:00:00Z",
    updatedAt: "2026-04-27T00:00:00Z",
  },
  {
    id: "ki-005",
    namespaceId: "ns-005",
    title: "Troptions Business Services Overview",
    description: "Description of Troptions Business service offerings, pricing tiers, and onboarding steps.",
    sourceType: "document",
    sensitivity: "internal",
    reviewStatus: "approved",
    ipfsCid: undefined,
    sha256: undefined,
    proofRecordId: undefined,
    allowedAiSystemIds: ["sys-003"],
    blockedAiSystemIds: [],
    tags: ["business", "services", "pricing"],
    simulationOnly: true,
    liveExecutionEnabled: false,
    createdAt: "2026-04-01T00:00:00Z",
    updatedAt: "2026-04-27T00:00:00Z",
  },
  {
    id: "ki-006",
    namespaceId: "ns-005",
    title: "Troptions Business FAQ",
    description: "Frequently asked questions for Troptions Business clients.",
    sourceType: "faq",
    sensitivity: "public",
    reviewStatus: "approved",
    ipfsCid: undefined,
    sha256: undefined,
    proofRecordId: undefined,
    allowedAiSystemIds: ["sys-003"],
    blockedAiSystemIds: [],
    tags: ["faq", "business", "public"],
    simulationOnly: true,
    liveExecutionEnabled: false,
    createdAt: "2026-04-01T00:00:00Z",
    updatedAt: "2026-04-27T00:00:00Z",
  },
  {
    id: "ki-007",
    namespaceId: "ns-004",
    title: "Troptions Health Admin Procedure Manual",
    description: "Administrative procedure guide for the Troptions Health namespace. Contains no PHI or clinical content.",
    sourceType: "document",
    sensitivity: "healthcare_restricted",
    reviewStatus: "needs_compliance_review",
    ipfsCid: undefined,
    sha256: undefined,
    proofRecordId: undefined,
    allowedAiSystemIds: [],
    blockedAiSystemIds: [],
    tags: ["healthcare", "admin", "procedures"],
    simulationOnly: true,
    liveExecutionEnabled: false,
    createdAt: "2026-04-01T00:00:00Z",
    updatedAt: "2026-04-27T00:00:00Z",
  },
  {
    id: "ki-008",
    namespaceId: "ns-010",
    title: "Troptions Enterprise Compliance Policy",
    description: "Internal compliance policies for the Troptions Enterprise namespace.",
    sourceType: "policy",
    sensitivity: "regulated",
    reviewStatus: "needs_compliance_review",
    ipfsCid: undefined,
    sha256: undefined,
    proofRecordId: undefined,
    allowedAiSystemIds: [],
    blockedAiSystemIds: [],
    tags: ["compliance", "enterprise", "policy"],
    simulationOnly: true,
    liveExecutionEnabled: false,
    createdAt: "2026-04-01T00:00:00Z",
    updatedAt: "2026-04-27T00:00:00Z",
  },
];

// ─── Mock Knowledge Vaults ────────────────────────────────────────────────────

export const KNOWLEDGE_VAULTS: TroptionsKnowledgeVault[] = [
  {
    id: "vault-001",
    namespaceId: "ns-001",
    label: "Troptions Core Vault",
    description: "Primary knowledge vault for the Troptions namespace. Contains brand, media, and policy documents.",
    itemCount: 3,
    totalSizeLabel: "2.4 MB",
    sensitivity: "internal",
    reviewStatus: "approved",
    simulationOnly: true,
    liveExecutionEnabled: false,
    createdAt: "2026-04-01T00:00:00Z",
    updatedAt: "2026-04-27T00:00:00Z",
  },
  {
    id: "vault-002",
    namespaceId: "ns-002",
    label: "Troptions TV Vault",
    description: "Knowledge vault for Troptions TV content, show catalog, and brand guides.",
    itemCount: 1,
    totalSizeLabel: "1.1 MB",
    sensitivity: "internal",
    reviewStatus: "approved",
    simulationOnly: true,
    liveExecutionEnabled: false,
    createdAt: "2026-04-01T00:00:00Z",
    updatedAt: "2026-04-27T00:00:00Z",
  },
  {
    id: "vault-003",
    namespaceId: "ns-005",
    label: "Troptions Business Vault",
    description: "Knowledge vault for Troptions Business services, FAQs, and client materials.",
    itemCount: 2,
    totalSizeLabel: "0.8 MB",
    sensitivity: "internal",
    reviewStatus: "approved",
    simulationOnly: true,
    liveExecutionEnabled: false,
    createdAt: "2026-04-01T00:00:00Z",
    updatedAt: "2026-04-27T00:00:00Z",
  },
  {
    id: "vault-004",
    namespaceId: "ns-004",
    label: "Troptions Health Admin Vault",
    description: "Healthcare administrative vault — pending compliance review. No PHI permitted.",
    itemCount: 1,
    totalSizeLabel: "0.3 MB",
    sensitivity: "healthcare_restricted",
    reviewStatus: "needs_compliance_review",
    simulationOnly: true,
    liveExecutionEnabled: false,
    createdAt: "2026-04-01T00:00:00Z",
    updatedAt: "2026-04-27T00:00:00Z",
  },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────

export function getKnowledgeItemsByNamespace(namespaceId: string): TroptionsKnowledgeItem[] {
  return KNOWLEDGE_ITEMS.filter((item) => item.namespaceId === namespaceId);
}

export function getKnowledgeVaultByNamespace(namespaceId: string): TroptionsKnowledgeVault | undefined {
  return KNOWLEDGE_VAULTS.find((v) => v.namespaceId === namespaceId);
}

export function getSensitivityRule(
  sensitivity: TroptionsKnowledgeSensitivity
): TroptionsKnowledgeSensitivityRule | undefined {
  return KNOWLEDGE_SENSITIVITY_RULES.find((r) => r.sensitivity === sensitivity);
}

export function getSensitivityLabel(sensitivity: TroptionsKnowledgeSensitivity): string {
  return getSensitivityRule(sensitivity)?.label ?? sensitivity.replace(/_/g, " ");
}

export function getReviewStatusLabel(status: TroptionsKnowledgeReviewStatus): string {
  const labels: Record<TroptionsKnowledgeReviewStatus, string> = {
    pending_review: "Pending Review",
    approved: "Approved",
    rejected: "Rejected",
    needs_legal_review: "Needs Legal Review",
    needs_compliance_review: "Needs Compliance Review",
    blocked: "Blocked",
    archived: "Archived",
  };
  return labels[status] ?? status.replace(/_/g, " ");
}

export function getSourceTypeLabel(sourceType: TroptionsKnowledgeSourceType): string {
  const labels: Record<TroptionsKnowledgeSourceType, string> = {
    document: "Document",
    website: "Website",
    policy: "Policy",
    faq: "FAQ",
    transcript: "Transcript",
    media_metadata: "Media Metadata",
    workflow: "Workflow",
    form: "Form",
    contract_template: "Contract Template",
    training_note: "Training Note",
    proof_record: "Proof Record",
  };
  return labels[sourceType] ?? sourceType.replace(/_/g, " ");
}
