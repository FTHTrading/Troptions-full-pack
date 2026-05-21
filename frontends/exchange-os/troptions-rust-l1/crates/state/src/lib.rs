#![allow(dead_code)]

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

// ─── KYC / KYB Tiers ─────────────────────────────────────────────────────────

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum KycTier {
    Unknown,
    Pending,
    Basic,
    Enhanced,
    Institutional,
    Failed,
}

impl Default for KycTier {
    fn default() -> Self {
        KycTier::Unknown
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum KybTier {
    Unknown,
    Pending,
    Registered,
    Enhanced,
    Institutional,
    Failed,
}

impl Default for KybTier {
    fn default() -> Self {
        KybTier::Unknown
    }
}

// ─── Sanctions ────────────────────────────────────────────────────────────────

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SanctionsStatus {
    Unscreened,
    Clear,
    PotentialMatch,
    Blocked,
}

impl Default for SanctionsStatus {
    fn default() -> Self {
        SanctionsStatus::Unscreened
    }
}

// ─── Jurisdiction ─────────────────────────────────────────────────────────────

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct JurisdictionCode(pub String);

// ─── Account ──────────────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Account {
    pub id: Uuid,
    pub address: String,
    pub display_name: String,
    pub kyc_tier: KycTier,
    pub kyb_tier: KybTier,
    pub sanctions_status: SanctionsStatus,
    pub jurisdiction: JurisdictionCode,
    pub wallet_risk_score: u8, // 0-100
    pub active: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

// ─── Validator ────────────────────────────────────────────────────────────────

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ValidatorRole {
    Validator,
    Observer,
    Auditor,
    ComplianceWitness,
    IssuerNode,
    ReserveAttestor,
    BridgeWatcher,
    GovernanceNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Validator {
    pub id: Uuid,
    pub name: String,
    pub role: ValidatorRole,
    pub jurisdiction: JurisdictionCode,
    pub public_key: String,
    pub stake_bond_amount_string: String,
    pub compliance_certifications: Vec<String>,
    pub active: bool,
    pub registered_at: DateTime<Utc>,
}

// ─── Asset ────────────────────────────────────────────────────────────────────

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum AssetClass {
    NativeToken,
    PaymentStablecoin,
    CommodityToken,
    RealWorldAsset,
    EquityToken,
    NftCredential,
    SyntheticAsset,
    Unknown,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Asset {
    pub id: Uuid,
    pub symbol: String,
    pub name: String,
    pub asset_class: AssetClass,
    pub issuer_id: Uuid,
    pub total_supply_string: String,
    pub decimals: u8,
    pub simulation_only: bool,
    pub live_execution_enabled: bool,
    pub created_at: DateTime<Utc>,
}

// ─── Trustline ────────────────────────────────────────────────────────────────

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum FreezeStatus {
    Active,
    FrozenByIssuer,
    FrozenByCompliance,
    Suspended,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Trustline {
    pub id: Uuid,
    pub account_id: Uuid,
    pub asset_id: Uuid,
    pub limit_string: String,
    pub balance_string: String,
    pub freeze_status: FreezeStatus,
    pub simulation_only: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

// ─── Stablecoin ───────────────────────────────────────────────────────────────

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum GeniusActStatus {
    NotReviewed,
    InPreparation,
    PendingApproval,
    PermittedIssuer,
    Blocked,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ReservePolicyType {
    CashAndEquivalents,
    UsTreasuries,
    InsuredBankDeposits,
    MixedReserve,
    Undisclosed,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum RedemptionPolicy {
    OneToOne,
    AtNet,
    Restricted,
    NoRedemption,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StablecoinAsset {
    pub asset_id: Uuid,
    pub symbol: String,
    pub genius_act_status: GeniusActStatus,
    pub reserve_policy: ReservePolicyType,
    pub redemption_policy: RedemptionPolicy,
    pub aml_program_approved: bool,
    pub sanctions_program_approved: bool,
    pub issued_supply_string: String,
    pub reserved_supply_string: String,
    pub issuance_enabled: bool,
    pub simulation_only: bool,
}

// ─── RWA Asset ────────────────────────────────────────────────────────────────

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum RwaAssetType {
    RealEstate,
    Commodity,
    PrivateEquity,
    Invoice,
    Infrastructure,
    SolarEnergy,
    Other,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RwaAsset {
    pub asset_id: Uuid,
    pub asset_type: RwaAssetType,
    pub legal_name: String,
    pub jurisdiction: JurisdictionCode,
    pub valuation_usd_cents: u64,
    pub valuation_hash: String,
    pub evidence_hash: String,
    pub custodian: String,
    pub simulation_only: bool,
    pub live_execution_enabled: bool,
    pub registered_at: DateTime<Utc>,
}

// ─── NFT Credential ───────────────────────────────────────────────────────────

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum NftCredentialType {
    Certificate,
    RealEstate,
    SolarEnergy,
    Medical,
    Partner,
    Compliance,
    Other,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NftCredential {
    pub credential_id: Uuid,
    pub credential_type: NftCredentialType,
    pub holder_id: Uuid,
    pub issuer_id: Uuid,
    pub metadata_hash: String,
    pub issued_at: DateTime<Utc>,
    pub expires_at: Option<DateTime<Utc>>,
    pub simulation_only: bool,
}

// ─── Liquidity Pool ───────────────────────────────────────────────────────────

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum PoolPermissionMode {
    Public,
    Permissioned,
    InstitutionalOnly,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LiquidityPool {
    pub pool_id: Uuid,
    pub asset_a_id: Uuid,
    pub asset_b_id: Uuid,
    pub reserve_a_string: String,
    pub reserve_b_string: String,
    pub lp_fee_bps: u32,
    pub permission_mode: PoolPermissionMode,
    pub risk_disclosure_acknowledged: bool,
    pub simulation_only: bool,
    pub created_at: DateTime<Utc>,
}

// ─── Compliance Decision ──────────────────────────────────────────────────────

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ComplianceOutcome {
    Allow,
    SimulateOnly,
    NeedsApproval,
    Blocked,
    ReportRequired,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ComplianceDecision {
    pub outcome: ComplianceOutcome,
    pub blocked_reasons: Vec<String>,
    pub required_approvals: Vec<String>,
    pub compliance_checks: Vec<String>,
    pub travel_rule_required: bool,
    pub audit_hint: String,
    pub simulation_only: bool,
    pub evaluated_at: DateTime<Utc>,
}

// ─── Governance Decision ──────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GovernanceDecision {
    pub task_id: String,
    pub audit_record_id: String,
    pub allowed: bool,
    pub simulation_only: bool,
    pub blocked_actions: Vec<String>,
    pub required_approvals: Vec<String>,
    pub compliance_checks: Vec<String>,
    pub audit_hint: String,
    pub decided_at: DateTime<Utc>,
}

impl GovernanceDecision {
    pub fn simulation_blocked(task_id: &str, audit_record_id: &str, hint: &str) -> Self {
        GovernanceDecision {
            task_id: task_id.to_string(),
            audit_record_id: audit_record_id.to_string(),
            allowed: false,
            simulation_only: true,
            blocked_actions: vec!["live_execution".to_string()],
            required_approvals: vec!["control_hub_approval".to_string()],
            compliance_checks: vec!["platform_simulation_gate".to_string()],
            audit_hint: hint.to_string(),
            decided_at: Utc::now(),
        }
    }
}

// ─── Settlement Instruction ───────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SettlementInstruction {
    pub instruction_id: Uuid,
    pub sender_id: Uuid,
    pub receiver_id: Uuid,
    pub asset_id: Uuid,
    pub amount_string: String,
    pub compliance_decision: ComplianceDecision,
    pub governance_decision: GovernanceDecision,
    pub simulation_only: bool,
    pub created_at: DateTime<Utc>,
}

// ─── Cross-Rail Route ─────────────────────────────────────────────────────────

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum CrossRailTarget {
    TsnInternal,
    Xrpl,
    Stellar,
    Rln,
    Agora,
    Mbridge,
    BankRail,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CrossRailRoute {
    pub route_id: Uuid,
    pub source_network: CrossRailTarget,
    pub dest_network: CrossRailTarget,
    pub asset_id: Uuid,
    pub amount_string: String,
    pub compliance_requirements: Vec<String>,
    pub blocked_actions: Vec<String>,
    pub required_approvals: Vec<String>,
    pub simulation_only: bool,
    pub created_at: DateTime<Utc>,
}

// ─── Audit Event ──────────────────────────────────────────────────────────────

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum AuditEventType {
    ComplianceAllow,
    ComplianceBlock,
    ComplianceSimulateOnly,
    TransferSimulated,
    TrustlineSimulated,
    StablecoinIssuanceBlocked,
    RwaRegistered,
    NftIssued,
    AmmSwapSimulated,
    CrossRailRouteSimulated,
    ValidatorRegistered,
    GovernanceDecisionRecorded,
    ReserveAttestationRecorded,
    QuantumKeyProfileUpdated,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuditEvent {
    pub event_id: Uuid,
    pub event_type: AuditEventType,
    pub actor: String,
    pub summary: String,
    pub metadata: serde_json::Value,
    pub simulation_only: bool,
    pub timestamp: DateTime<Utc>,
}

impl AuditEvent {
    pub fn new(
        event_type: AuditEventType,
        actor: &str,
        summary: &str,
        metadata: serde_json::Value,
    ) -> Self {
        AuditEvent {
            event_id: Uuid::new_v4(),
            event_type,
            actor: actor.to_string(),
            summary: summary.to_string(),
            metadata,
            simulation_only: true,
            timestamp: Utc::now(),
        }
    }
}

// ─── Reserve Attestation ──────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReserveAttestation {
    pub attestation_id: Uuid,
    pub stablecoin_asset_id: Uuid,
    pub attested_by: String,
    pub reserve_amount_string: String,
    pub issued_supply_string: String,
    pub reserve_asset_type: ReservePolicyType,
    pub custodian: String,
    pub valid_until: DateTime<Utc>,
    pub simulation_only: bool,
    pub attested_at: DateTime<Utc>,
}

// ─── Quantum Key Profile ──────────────────────────────────────────────────────

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum QuantumMigrationStatus {
    ClassicOnly,
    HybridTransition,
    PostQuantumNative,
    FipsCertified,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum QuantumSignatureScheme {
    MlDsa,              // NIST FIPS 204
    SlhDsa,             // NIST FIPS 205
    HybridEd25519MlDsa, // Transition hybrid
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum QuantumKemScheme {
    MlKem,             // NIST FIPS 203
    HybridX25519MlKem, // Transition hybrid
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QuantumKeyProfile {
    pub address: String,
    pub migration_status: QuantumMigrationStatus,
    pub classic_public_key: String,
    pub pq_signature_scheme: Option<QuantumSignatureScheme>,
    pub pq_kem_scheme: Option<QuantumKemScheme>,
    /// Placeholder only — no actual PQ key material in scaffold
    pub pq_public_key_placeholder: Option<String>,
    pub nist_fips_reference: String,
    pub migrated_at: Option<DateTime<Utc>>,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn audit_event_emitted_for_blocked_action() {
        let event = AuditEvent::new(
            AuditEventType::ComplianceBlock,
            "tcsa_compliance_engine",
            "Transfer blocked: unknown KYC tier",
            serde_json::json!({ "outcome": "blocked", "reason": "kyc_unknown" }),
        );
        assert!(event.simulation_only);
        assert_eq!(event.event_type, AuditEventType::ComplianceBlock);
        let json = serde_json::to_string(&event).unwrap();
        assert!(json.contains("compliance_block"));
    }

    #[test]
    fn governance_decision_simulation_blocked() {
        let decision = GovernanceDecision::simulation_blocked(
            "task-001",
            "audit-001",
            "Platform simulation gate active",
        );
        assert!(!decision.allowed);
        assert!(decision.simulation_only);
        assert!(decision
            .blocked_actions
            .contains(&"live_execution".to_string()));
    }
}
