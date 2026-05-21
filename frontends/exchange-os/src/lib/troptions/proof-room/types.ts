/**
 * TROPTIONS Proof Room — Core Types
 *
 * The Proof Room controls what TROPTIONS can honestly claim, prove, and publish.
 * No fake evidence. No fake legal approval. No fake partnerships.
 * No FTH / FTHX / FTHG references.
 */

// ─── Claim Status ─────────────────────────────────────────────────────────────

export type ClaimStatus =
  | "verified"
  | "partially_verified"
  | "internal_evidence_required"
  | "legal_review_required"
  | "provider_contract_required"
  | "software_build_verified"
  | "future_ready_not_live"
  | "do_not_claim";

export type EvidenceStatus =
  | "verified"
  | "partially_verified"
  | "missing"
  | "expired"
  | "needs_review"
  | "disputed"
  | "not_applicable";

export type PublicUseStatus =
  | "approved_public"
  | "approved_with_disclaimer"
  | "internal_only"
  | "legal_review_first"
  | "blocked";

export type ClaimRiskLevel = "low" | "medium" | "high" | "critical";

export type CapabilityRecordStatus =
  | "live"
  | "build_verified"
  | "mock_only"
  | "manual_only"
  | "provider_ready"
  | "credentials_required"
  | "legal_review_required"
  | "future_ready_not_live"
  | "blocked";

export type HistoryCategory =
  | "founding"
  | "digital_currency_framework"
  | "blockchain_expansion"
  | "public_filing"
  | "merchant_utility"
  | "media_event"
  | "software_rebuild"
  | "payment_readiness"
  | "infrastructure"
  | "regulatory_history"
  | "brand_evolution";

export type EvidenceType =
  | "public_document"
  | "sec_filing"
  | "corporate_record"
  | "chain_record"
  | "software_build_report"
  | "signed_agreement"
  | "admin_record"
  | "press_release"
  | "legal_document"
  | "compliance_record"
  | "merchant_record"
  | "photo_video_evidence";

export type RegulatoryRecordType =
  | "cease_and_desist"
  | "order_to_show_cause"
  | "registration"
  | "exemption"
  | "correspondence"
  | "voluntary_disclosure"
  | "settlement"
  | "clearance";

// ─── Core Entities ────────────────────────────────────────────────────────────

export interface TroptionsHistoryEvent {
  id: string;
  year: number;
  title: string;
  summary: string;
  category: HistoryCategory;
  sourceType: string;
  sourceReference: string | null;
  confidenceLevel: "high" | "medium" | "low" | "unverified";
  publicSafe: boolean;
  reviewStatus: "approved" | "pending" | "blocked";
  notes: string;
}

export interface TroptionsPublicClaim {
  id: string;
  claimText: string;
  plainEnglishVersion: string;
  claimCategory: string;
  claimStatus: ClaimStatus;
  evidenceStatus: EvidenceStatus;
  publicUseStatus: PublicUseStatus;
  riskLevel: ClaimRiskLevel;
  requiredEvidence: string[];
  attachedEvidenceIds: string[];
  legalReviewRequired: boolean;
  providerContractRequired: boolean;
  allowedCopy: string;
  blockedCopy: string;
  notes: string;
}

export interface TroptionsEvidenceRecord {
  id: string;
  title: string;
  evidenceType: EvidenceType;
  sourceUrl: string | null;
  fileReference: string | null;
  description: string;
  relatedClaimIds: string[];
  verificationStatus: EvidenceStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  expirationDate: string | null;
  notes: string;
}

export interface TroptionsRegulatoryRecord {
  id: string;
  title: string;
  jurisdiction: string;
  date: string;
  recordType: RegulatoryRecordType;
  summary: string;
  status: "active" | "resolved" | "under_review" | "archived";
  publicDisclosureRequired: boolean;
  riskNotes: string;
  approvedPublicLanguage: string;
  internalNotes: string;
}

export interface TroptionsCapabilityRecord {
  id: string;
  capabilityName: string;
  capabilityCategory: string;
  currentStatus: CapabilityRecordStatus;
  proofLevel: "build_report" | "admin_dashboard" | "api_route" | "contract" | "live_evidence";
  softwareRoute: string | null;
  apiRoute: string | null;
  evidenceIds: string[];
  limitations: string[];
  nextSteps: string[];
  canBeClaimedPublicly: boolean;
}

export interface TroptionsApprovedCopyBlock {
  id: string;
  blockName: string;
  purpose: string;
  approvedText: string;
  disclaimer: string | null;
  publicUseStatus: PublicUseStatus;
  reviewedAt: string;
  notes: string;
}

export interface TroptionsRiskReview {
  id: string;
  unsafePhrase: string;
  riskLevel: ClaimRiskLevel;
  whyRisky: string;
  saferReplacement: string;
  exampleContext: string;
}

export interface TroptionsClaimDecision {
  claimId: string;
  decision: "approved" | "conditional" | "blocked";
  decisionNotes: string;
  decidedBy: string;
  decidedAt: string;
}

export interface TroptionsProofPacket {
  id: string;
  namespaceId: string | null;
  title: string;
  claims: TroptionsPublicClaim[];
  evidence: TroptionsEvidenceRecord[];
  capabilities: TroptionsCapabilityRecord[];
  generatedAt: string;
  overallStatus: "clean" | "warnings" | "blocked";
  warnings: string[];
  disclaimers: string[];
}

export interface TroptionsClaimAuditEvent {
  id: string;
  claimId: string;
  action: "claim_evaluated" | "claim_approved" | "claim_blocked" | "evidence_attached" | "risk_flagged";
  actor: string;
  notes: string;
  timestamp: string;
}

// ─── Label Maps ──────────────────────────────────────────────────────────────

export const CLAIM_STATUS_LABELS: Record<ClaimStatus, string> = {
  verified: "Verified",
  partially_verified: "Partially Verified",
  internal_evidence_required: "Internal Evidence Required",
  legal_review_required: "Legal Review Required",
  provider_contract_required: "Provider Contract Required",
  software_build_verified: "Software Build Verified",
  future_ready_not_live: "Future Ready — Not Live",
  do_not_claim: "Do Not Claim",
};

export const PUBLIC_USE_LABELS: Record<PublicUseStatus, string> = {
  approved_public: "Approved — Public",
  approved_with_disclaimer: "Approved with Disclaimer",
  internal_only: "Internal Only",
  legal_review_first: "Legal Review First",
  blocked: "Blocked",
};

export const CAPABILITY_STATUS_LABELS: Record<CapabilityRecordStatus, string> = {
  live: "Live",
  build_verified: "Build Verified",
  mock_only: "Mock Only",
  manual_only: "Manual Only",
  provider_ready: "Provider Ready",
  credentials_required: "Credentials Required",
  legal_review_required: "Legal Review Required",
  future_ready_not_live: "Future Ready — Not Live",
  blocked: "Blocked",
};
