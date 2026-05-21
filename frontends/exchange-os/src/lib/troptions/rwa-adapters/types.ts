/**
 * TROPTIONS RWA Provider Adapter Registry — Core Types
 *
 * These adapters represent provider-neutral readiness records, NOT official partnerships.
 * No adapter may claim execution_confirmed without real provider confirmation.
 * No adapter may claim production_ready without provider contract, credentials,
 * legal review, and compliance approval all present.
 *
 * TROPTIONS is not a bank, broker-dealer, transfer agent, custody provider,
 * or registered investment adviser.
 *
 * No FTH / FTHX / FTHG / Future Tech Holdings references.
 */

// ─── Provider Category ─────────────────────────────────────────────────────

export type RwaProviderCategory =
  | "tokenized_treasury"
  | "tokenized_money_market"
  | "institutional_credit"
  | "private_credit"
  | "rwa_tokenization_platform"
  | "asset_servicing"
  | "compliance_transfer_agent"
  | "oracle_proof_reference"
  | "marketplace_reference"
  | "manual_evidence"
  | "internal_reference";

// ─── Adapter Status ────────────────────────────────────────────────────────

export type RwaAdapterStatus =
  | "reference_only"
  | "research_only"
  | "design_ready"
  | "legal_review_required"
  | "provider_contract_required"
  | "credentials_required"
  | "sandbox_ready"
  | "production_ready"
  | "disabled"
  | "blocked";

// ─── Capability Status ─────────────────────────────────────────────────────

export type RwaCapabilityStatus =
  | "display_reference"
  | "evidence_tracking"
  | "public_claim_review"
  | "onboarding_required"
  | "api_credentials_required"
  | "legal_review_required"
  | "provider_contract_required"
  | "execution_disabled"
  | "execution_confirmed";

// ─── Evidence Status ───────────────────────────────────────────────────────

export type RwaEvidenceStatus =
  | "present"
  | "missing"
  | "partial"
  | "expired"
  | "not_required"
  | "under_review";

// ─── Claim Risk Level ──────────────────────────────────────────────────────

export type RwaClaimRisk = "safe" | "caution" | "blocked" | "critical";

// ─── Core Interfaces ───────────────────────────────────────────────────────

export interface RwaProviderAdapter {
  providerId: string;
  displayName: string;
  category: RwaProviderCategory;
  description: string;
  officialReferenceUrl: string;
  supportedAssetClasses: string[];
  supportedChains: string[];
  currentTroptionsStatus: RwaAdapterStatus;
  capabilityStatus: RwaCapabilityStatus;
  requiredCredentials: string[];
  requiredLegalReview: string[];
  requiredProviderContract: boolean;
  requiredEvidence: string[];
  allowedPublicLanguage: string;
  blockedPublicLanguage: string[];
  integrationNotes: string;
  riskNotes: string;
  // Runtime readiness flags — all false by default in TROPTIONS build
  hasProviderContract: boolean;
  hasCredentials: boolean;
  hasLegalReview: boolean;
  hasComplianceApproval: boolean;
  /** Always false. Live execution requires approved provider relationships. */
  executionEnabled: false;
}

export interface RwaReadinessScore {
  providerId: string;
  overallScore: number; // 0-100
  legalScore: number;
  evidenceScore: number;
  executionScore: number;
  blockers: string[];
  recommendations: string[];
  canClaimPublicly: boolean;
  canClaimPartnership: boolean;
}

export interface RwaClaimEvaluation {
  claimText: string;
  isSafe: boolean;
  riskLevel: RwaClaimRisk;
  reason: string;
  saferAlternative: string | null;
}

export interface RwaEvidenceRecord {
  id: string;
  providerId: string;
  evidenceType:
    | "provider_contract"
    | "legal_opinion"
    | "custody_document"
    | "audit_record"
    | "title_document"
    | "appraisal"
    | "compliance_approval"
    | "credentials"
    | "api_key_confirmed"
    | "test_transaction"
    | "reference_link";
  description: string;
  status: RwaEvidenceStatus;
  dateRecorded: string | null;
  notes: string;
}

export interface RwaComplianceRecord {
  providerId: string;
  jurisdiction: string;
  regulatoryStatus: string;
  licenseRequired: boolean;
  licenseStatus: "not_obtained" | "in_review" | "obtained" | "not_applicable";
  kycRequired: boolean;
  amlRequired: boolean;
  accreditedInvestorRequired: boolean;
  securitiesLawApplies: boolean;
  notes: string;
}

export interface RwaAdapterRegistry {
  adapters: RwaProviderAdapter[];
  totalAdapters: number;
  referenceOnlyCount: number;
  legalReviewRequiredCount: number;
  providerContractRequiredCount: number;
  productionReadyCount: number;
  blockedCount: number;
  generatedAt: string;
}

// ─── Label Maps ────────────────────────────────────────────────────────────

export const RWA_CATEGORY_LABELS: Record<RwaProviderCategory, string> = {
  tokenized_treasury: "Tokenized Treasury",
  tokenized_money_market: "Tokenized Money Market",
  institutional_credit: "Institutional Credit",
  private_credit: "Private Credit",
  rwa_tokenization_platform: "RWA Tokenization Platform",
  asset_servicing: "Asset Servicing",
  compliance_transfer_agent: "Compliance / Transfer Agent",
  oracle_proof_reference: "Oracle / Proof Reference",
  marketplace_reference: "Marketplace Reference",
  manual_evidence: "Manual Evidence",
  internal_reference: "Internal Reference",
};

export const RWA_STATUS_LABELS: Record<RwaAdapterStatus, string> = {
  reference_only: "Reference Only",
  research_only: "Research Only",
  design_ready: "Design Ready",
  legal_review_required: "Legal Review Required",
  provider_contract_required: "Provider Contract Required",
  credentials_required: "Credentials Required",
  sandbox_ready: "Sandbox Ready",
  production_ready: "Production Ready",
  disabled: "Disabled",
  blocked: "Blocked",
};

export const RWA_CAPABILITY_LABELS: Record<RwaCapabilityStatus, string> = {
  display_reference: "Display Reference",
  evidence_tracking: "Evidence Tracking",
  public_claim_review: "Public Claim Review",
  onboarding_required: "Onboarding Required",
  api_credentials_required: "API Credentials Required",
  legal_review_required: "Legal Review Required",
  provider_contract_required: "Provider Contract Required",
  execution_disabled: "Execution Disabled",
  execution_confirmed: "Execution Confirmed",
};
