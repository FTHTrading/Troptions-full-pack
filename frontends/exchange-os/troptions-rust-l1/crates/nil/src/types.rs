#![allow(dead_code)]

//! TSN NIL — Protocol types.
//!
//! All types use pseudonymous IDs and hashes for public fields.
//! Private athlete data (name, DOB, guardian info) is never stored on-chain.

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

// ─── Sport ────────────────────────────────────────────────────────────────────

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Sport {
    Football,
    Basketball,
    Baseball,
    Soccer,
    Volleyball,
    Swimming,
    TrackAndField,
    Tennis,
    Wrestling,
    Lacrosse,
    Hockey,
    Golf,
    Softball,
    CrossCountry,
    Other(String),
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SportVertical {
    TeamSport,
    IndividualSport,
    EnduranceSport,
    CombatSport,
    RacquetSport,
    Other,
}

// ─── Athlete identity ─────────────────────────────────────────────────────────

/// Pseudonymous athlete identifier — a SHA-256 hash of a canonical payload.
/// Never contains raw PII (name, DOB, SSN, guardian info).
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct AthleteId(pub String);

/// Publicly-safe athlete profile — pseudonymous fields only.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AthleteProfile {
    pub athlete_id: AthleteId,
    pub sport: Sport,
    pub sport_vertical: SportVertical,
    /// Institution code — anonymised school/college reference (not full name).
    pub institution_code: String,
    /// Graduation year band — "2025-2027" rather than exact date.
    pub graduation_band: String,
    /// Whether athlete is currently a minor (affects consent requirements).
    pub is_minor: bool,
    pub simulation_only: bool,
    pub created_at: DateTime<Utc>,
}

/// On-chain identity record — contains only hash proofs, no raw PII.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AthleteIdentityRecord {
    pub record_id: Uuid,
    pub athlete_id: AthleteId,
    /// SHA-256 of the canonical identity payload.
    pub identity_hash: String,
    /// Optional Ed25519 signature (unsigned template in devnet).
    pub signature_hex: Option<String>,
    pub sport: Sport,
    pub institution_code: String,
    pub minor_consent_status: MinorConsentStatus,
    pub simulation_only: bool,
    pub registered_at: DateTime<Utc>,
}

// ─── Minor consent ────────────────────────────────────────────────────────────

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum MinorConsentStatus {
    NotApplicable,
    PendingGuardianReview,
    PendingLegalReview,
    Approved,
    Denied,
    Unknown,
}

// ─── NIL Signals ──────────────────────────────────────────────────────────────

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum NilSignalBucket {
    IdentityAndVerification,
    PerformanceProof,
    RecruitingAndExposure,
    MarketAndReach,
    ComplianceAndEligibility,
    DealExecution,
}

#[derive(Debug, Clone, Serialize)]
pub struct NilSignal {
    pub id: u8,
    pub name: &'static str,
    pub bucket: NilSignalBucket,
    pub description: &'static str,
    pub weight: f64,
    pub requires_verification: bool,
    pub minor_sensitive: bool,
    pub public_display_allowed: bool,
    pub compliance_notes: &'static str,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NilSignalScore {
    pub signal_id: u8,
    pub signal_name: String,
    pub raw_score: f64,
    pub normalized_score: f64,
    pub data_provided: bool,
    pub confidence: f64,
}

// ─── Valuation ────────────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NilValuationInput {
    pub athlete_id: AthleteId,
    pub sport: Sport,
    pub signal_scores: Vec<NilSignalScore>,
    pub institution_code: String,
    pub is_minor: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum NilValuationBand {
    /// Insufficient data to estimate.
    InsufficientData,
    /// Emerging — limited proof points.
    Emerging,
    /// Developing — some verifiable signals.
    Developing,
    /// Established — strong verifiable signals.
    Established,
    /// Elite — exceptional multi-signal evidence.
    Elite,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NilValuationResult {
    pub athlete_id: AthleteId,
    /// Composite score 0–100.
    pub composite_score: f64,
    /// Estimated annual NIL value range (low, high) in USD-equivalent.
    /// This is an ESTIMATE only — not a guaranteed value or deal amount.
    pub estimate_low_usd: f64,
    pub estimate_high_usd: f64,
    pub valuation_band: NilValuationBand,
    pub confidence: f64,
    pub missing_signal_count: u8,
    pub disclaimer: String,
    pub simulation_only: bool,
    pub evaluated_at: DateTime<Utc>,
}

// ─── NIL Deal ─────────────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NilDealDeliverable {
    /// Hash of deliverable description (not raw text — avoids private terms on-chain).
    pub deliverable_hash: String,
    pub deliverable_type: String,
    pub estimated_count: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NilDeal {
    pub deal_id: Uuid,
    pub athlete_id: AthleteId,
    /// Brand identified by hash — no raw brand name on-chain for privacy.
    pub brand_hash: String,
    pub deliverables: Vec<NilDealDeliverable>,
    /// Compensation band only — not exact amount — to avoid private contract terms.
    pub compensation_band: String,
    pub deal_start_date: Option<DateTime<Utc>>,
    pub deal_end_date: Option<DateTime<Utc>>,
    pub state_code: String,
    pub institution_code: String,
    pub simulation_only: bool,
    pub created_at: DateTime<Utc>,
}

// ─── Deal Receipt ─────────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NilDealReceipt {
    pub receipt_id: Uuid,
    pub deal_id: Uuid,
    pub athlete_id: AthleteId,
    pub brand_hash: String,
    /// SHA-256 hash of the canonical deal payload.
    pub deal_hash: String,
    pub compensation_band: String,
    pub deliverable_hashes: Vec<String>,
    pub compliance_status: String,
    /// Optional Ed25519 signature (unsigned in devnet).
    pub signature_hex: Option<String>,
    pub simulation_only: bool,
    pub issued_at: DateTime<Utc>,
}

// ─── Compliance ───────────────────────────────────────────────────────────────

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum RestrictedCategory {
    AlcoholTobacco,
    Gambling,
    AdultContent,
    PharmaceuticalWithoutApproval,
    CryptocurrencyWithoutApproval,
    PayForPlay,
    RecruitingInducement,
    Other(String),
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum RecruitingRisk {
    /// No recruiting connection detected.
    None,
    /// Deal timing near recruiting contact period — needs review.
    PotentialConflict,
    /// Clear recruiting inducement language — blocked.
    Blocked,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum PayForPlayRisk {
    /// No pay-for-play connection.
    None,
    /// Compensation linked to athletic performance — needs legal review.
    PotentialLink,
    /// Explicit performance-for-payment language — blocked.
    Blocked,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StateRuleProfile {
    pub state_code: String,
    pub nil_permitted: bool,
    pub agent_permitted: bool,
    pub disclosure_required: bool,
    pub school_approval_required: bool,
    pub legal_review_required: bool,
    pub last_reviewed: Option<DateTime<Utc>>,
    pub notes: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InstitutionRuleProfile {
    pub institution_code: String,
    pub nil_program_exists: bool,
    pub pre_approval_required: bool,
    pub disclosure_required: bool,
    pub agent_registration_required: bool,
    pub legal_review_required: bool,
    pub notes: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NilComplianceCheck {
    pub check_id: Uuid,
    pub athlete_id: AthleteId,
    pub deal_id: Option<Uuid>,
    pub state_rule_status: String,
    pub institution_rule_status: String,
    pub minor_consent_status: MinorConsentStatus,
    pub restricted_categories_detected: Vec<RestrictedCategory>,
    pub pay_for_play_risk: PayForPlayRisk,
    pub recruiting_risk: RecruitingRisk,
    pub blocked_reasons: Vec<String>,
    pub required_approvals: Vec<String>,
    pub compliance_decision: String,
    pub disclaimer: String,
    pub simulation_only: bool,
    pub evaluated_at: DateTime<Utc>,
}

// ─── Proof Vault ──────────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProofVaultRecord {
    pub record_id: Uuid,
    pub athlete_id: AthleteId,
    pub document_type: String,
    /// SHA-256 of the document — document stays off-chain.
    pub document_hash: String,
    /// Optional IPFS CID reference — metadata only, not stored on-chain.
    pub ipfs_cid: Option<String>,
    pub merkle_root: Option<String>,
    pub simulation_only: bool,
    pub recorded_at: DateTime<Utc>,
}

/// An unsigned JSON template for Web3 receipt anchoring.
/// This is a template only — no live on-chain submission is enabled.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Web3ReceiptTemplate {
    pub template_type: String,
    pub chain_target: String,
    pub athlete_id_hash: String,
    pub deal_hash: String,
    pub proof_merkle_root: Option<String>,
    pub ipfs_cid: Option<String>,
    /// Always `None` in devnet — signing requires Control Hub approval + legal review.
    pub signature_hex: Option<String>,
    pub unsigned: bool,
    pub live_submission_enabled: bool,
    pub disclaimer: String,
    pub template_created_at: DateTime<Utc>,
}

// ─── Governance / Audit ───────────────────────────────────────────────────────

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum NilGovernanceDecision {
    AllowReadOnly,
    SimulationOnly,
    NeedsApproval,
    LegalReviewRequired,
    InstitutionReviewRequired,
    GuardianReviewRequired,
    Blocked,
    Disabled,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NilAuditEvent {
    pub event_id: Uuid,
    pub event_type: String,
    pub athlete_id_hash: Option<String>,
    pub actor: String,
    pub summary: String,
    pub decision: NilGovernanceDecision,
    pub blocked_actions: Vec<String>,
    pub metadata: serde_json::Value,
    pub simulation_only: bool,
    pub timestamp: DateTime<Utc>,
}

// ─── L1 Transaction / State Transition ───────────────────────────────────────

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum NilL1Transaction {
    RegisterAthleteIdentity,
    ComputeNilValuation,
    CheckNilCompliance,
    CreateNilDealReceipt,
    CreateProofVaultRecord,
    CreateWeb3AnchorTemplate,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NilL1StateTransition {
    pub transition_id: Uuid,
    pub transaction_type: NilL1Transaction,
    pub athlete_id: AthleteId,
    pub simulation_only: bool,
    pub live_execution_enabled: bool,
    pub audit_event: NilAuditEvent,
    pub executed_at: DateTime<Utc>,
}
