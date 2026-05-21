use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum IssuerMode {
    ResearchOnly,
    SandboxSimulation,
    PartneredPpsi,
    LicensedPpsi,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum IssuanceStatus {
    NotStarted,
    BlockedMissingLegal,
    BlockedMissingRegulatorApproval,
    BlockedMissingReservePolicy,
    BlockedMissingReserveAttestation,
    BlockedMissingAmlSanctionsProgram,
    BlockedMissingKycKybProvider,
    BlockedMissingRedemptionPolicy,
    BlockedMissingBoardApproval,
    SandboxReady,
    PartnerReady,
    RegulatorReady,
    LiveEnabled,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum StablecoinAction {
    SimulateMint,
    SimulateBurn,
    SimulateTransfer,
    SimulateRedemptionRequest,
    CreateReadinessPacket,
    CreatePartnerPacket,
    CreateRegulatorPacket,
    LiveMint,
    LiveBurn,
    LiveRedemption,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum GateStatus {
    Missing,
    Draft,
    Review,
    Approved,
    Expired,
    Blocked,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum RequirementLevel {
    Sandbox,
    PartnerReady,
    RegulatorReady,
    Live,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum RiskRating {
    Low,
    Medium,
    High,
    Critical,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SettlementLane {
    PaymentStablecoin,
    TokenizedDeposit,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TroptionsGeniusProfile {
    pub program_name: String,
    pub issuer_mode: IssuerMode,
    pub issuance_status: IssuanceStatus,
    pub jurisdiction: String,
    pub credit_union_partner_name: Option<String>,
    pub cuso_partner_name: Option<String>,
    pub ppsi_partner_name: Option<String>,
    pub reserve_custodian_name: Option<String>,
    pub kyc_kyb_provider_name: Option<String>,
    pub aml_provider_name: Option<String>,
    pub chain_networks_allowed: Vec<String>,
    pub public_chain_allowed: bool,
    pub live_actions_enabled: bool,
    pub legal_counsel_memo_approved: bool,
    pub regulator_approval_recorded: bool,
    pub board_approval_recorded: bool,
    pub reserve_policy_approved: bool,
    pub reserve_attestation_current: bool,
    pub redemption_policy_approved: bool,
    pub aml_sanctions_program_approved: bool,
    pub kyc_kyb_provider_active: bool,
    pub incident_response_plan_approved: bool,
    pub consumer_disclosures_approved: bool,
    pub chain_risk_review_approved: bool,
    pub smart_contract_audit_approved: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ComplianceGate {
    pub id: String,
    pub label: String,
    pub status: GateStatus,
    pub required_for: RequirementLevel,
    pub evidence_uri: Option<String>,
    pub owner: Option<String>,
    pub last_reviewed_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReadinessScore {
    pub sandbox_score: u8,
    pub partner_score: u8,
    pub regulator_score: u8,
    pub live_score: u8,
    pub blocking_items: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Decision {
    pub allowed: bool,
    pub status: String,
    pub reasons: Vec<String>,
    pub required_next_steps: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PacketSummary {
    pub title: String,
    pub status: String,
    pub readiness_score: ReadinessScore,
    pub approved_gates: Vec<String>,
    pub missing_gates: Vec<String>,
    pub blockers: Vec<String>,
    pub next_actions: Vec<String>,
    pub legal_disclaimer: String,
    pub live_issuance_blocked_notice: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RiskInput {
    pub lane: SettlementLane,
    pub blockers: Vec<String>,
    pub public_chain_allowed: bool,
    pub live_action_requested: bool,
}
