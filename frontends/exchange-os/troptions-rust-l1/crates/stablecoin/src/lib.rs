#![allow(dead_code)]

//! TSN Stablecoin Runtime — simulation only.
//! All issuance, redemption, and reserve operations are blocked pending:
//! 1. GENIUS Act permitted issuer status
//! 2. Control Hub approval
//! 3. Legal review

use chrono::Utc;
use tsn_state::{
    AuditEvent, AuditEventType, GeniusActStatus, GovernanceDecision,
    ReserveAttestation,
};
use uuid::Uuid;

pub struct StablecoinIssuanceRequest {
    pub stablecoin_asset_id: Uuid,
    pub issuer_id: Uuid,
    pub amount_string: String,
    pub reserve_attestation: Option<ReserveAttestation>,
    pub genius_act_status: GeniusActStatus,
    pub aml_program_approved: bool,
    pub sanctions_program_approved: bool,
}

pub struct StablecoinSimulationResult {
    pub simulation_id: Uuid,
    pub request_id: Uuid,
    pub simulation_only: bool,
    pub governance_decision: GovernanceDecision,
    pub audit_event: AuditEvent,
    pub blocked_reasons: Vec<String>,
    pub required_approvals: Vec<String>,
}

/// Simulate stablecoin issuance. Always blocked in scaffold.
pub fn simulate_issue_stablecoin(req: &StablecoinIssuanceRequest) -> StablecoinSimulationResult {
    let sim_id = Uuid::new_v4();
    let task_id = Uuid::new_v4().to_string();
    let audit_id = Uuid::new_v4().to_string();

    let mut blocked_reasons = vec!["platform_simulation_gate_active".to_string()];
    let mut required_approvals = vec![
        "control_hub_approval".to_string(),
        "genius_act_permitted_issuer_verification".to_string(),
    ];

    // GENIUS Act check
    match &req.genius_act_status {
        GeniusActStatus::PermittedIssuer => {
            // Still blocked by platform gate, but GENIUS Act passes
        }
        GeniusActStatus::NotReviewed | GeniusActStatus::Blocked => {
            blocked_reasons.push("genius_act_not_permitted_issuer".to_string());
        }
        GeniusActStatus::InPreparation | GeniusActStatus::PendingApproval => {
            blocked_reasons.push("genius_act_pending_approval".to_string());
            required_approvals.push("genius_act_regulator_approval".to_string());
        }
    }

    // AML / sanctions program check
    if !req.aml_program_approved {
        blocked_reasons.push("aml_program_not_approved".to_string());
        required_approvals.push("aml_program_review".to_string());
    }
    if !req.sanctions_program_approved {
        blocked_reasons.push("sanctions_program_not_approved".to_string());
    }

    // Reserve attestation check
    if req.reserve_attestation.is_none() {
        blocked_reasons.push("no_reserve_attestation".to_string());
        required_approvals.push("reserve_attestation_required".to_string());
    } else if let Some(att) = &req.reserve_attestation {
        if att.valid_until < Utc::now() {
            blocked_reasons.push("reserve_attestation_expired".to_string());
        }
    }

    let governance_decision = GovernanceDecision {
        task_id: task_id.clone(),
        audit_record_id: audit_id.clone(),
        allowed: false,
        simulation_only: true,
        blocked_actions: blocked_reasons.clone(),
        required_approvals: required_approvals.clone(),
        compliance_checks: vec![
            "platform_simulation_gate".to_string(),
            "genius_act".to_string(),
            "aml_program".to_string(),
            "reserve_attestation".to_string(),
        ],
        audit_hint: "Stablecoin issuance blocked — simulation only".to_string(),
        decided_at: Utc::now(),
    };

    let audit_event = AuditEvent::new(
        AuditEventType::StablecoinIssuanceBlocked,
        "tsn_stablecoin_runtime",
        "Stablecoin issuance simulation — blocked by platform gate",
        serde_json::json!({
            "stablecoin_asset_id": req.stablecoin_asset_id.to_string(),
            "issuer_id": req.issuer_id.to_string(),
            "amount_string": req.amount_string,
            "blocked_reasons": blocked_reasons,
        }),
    );

    StablecoinSimulationResult {
        simulation_id: sim_id,
        request_id: req.stablecoin_asset_id,
        simulation_only: true,
        governance_decision,
        audit_event,
        blocked_reasons,
        required_approvals,
    }
}

/// Evaluate if an issuer meets reserve readiness requirements (TRRA).
pub fn evaluate_reserve_readiness(attestation: &ReserveAttestation) -> (bool, Vec<String>) {
    let mut issues = Vec::new();

    if attestation.valid_until < Utc::now() {
        issues.push("reserve_attestation_expired".to_string());
    }

    if attestation.reserve_amount_string == "0" {
        issues.push("zero_reserve".to_string());
    }

    let ready = issues.is_empty();
    (ready, issues)
}

/// Hard gate for unapproved issuance.
pub fn block_unapproved_issuance(genius_act_status: &GeniusActStatus) -> bool {
    !matches!(genius_act_status, GeniusActStatus::PermittedIssuer)
}

#[cfg(test)]
mod tests {
    use super::*;
    use tsn_state::GeniusActStatus;

    #[test]
    fn stablecoin_issuance_blocked_without_permitted_issuer() {
        let req = StablecoinIssuanceRequest {
            stablecoin_asset_id: Uuid::new_v4(),
            issuer_id: Uuid::new_v4(),
            amount_string: "1000000000000000000".to_string(),
            reserve_attestation: None,
            genius_act_status: GeniusActStatus::NotReviewed,
            aml_program_approved: false,
            sanctions_program_approved: false,
        };
        let result = simulate_issue_stablecoin(&req);
        assert!(result.simulation_only);
        assert!(!result.governance_decision.allowed);
        assert!(result.blocked_reasons.iter().any(|r| r.contains("genius_act_not_permitted_issuer")));
    }

    #[test]
    fn stablecoin_still_blocked_by_platform_gate_even_with_permitted_issuer() {
        let req = StablecoinIssuanceRequest {
            stablecoin_asset_id: Uuid::new_v4(),
            issuer_id: Uuid::new_v4(),
            amount_string: "1000000000000000000".to_string(),
            reserve_attestation: None,
            genius_act_status: GeniusActStatus::PermittedIssuer,
            aml_program_approved: true,
            sanctions_program_approved: true,
        };
        let result = simulate_issue_stablecoin(&req);
        assert!(result.simulation_only);
        assert!(!result.governance_decision.allowed);
        assert!(result.blocked_reasons.iter().any(|r| r.contains("platform_simulation_gate_active")));
    }

    #[test]
    fn block_unapproved_issuance_blocks_non_permitted() {
        assert!(block_unapproved_issuance(&GeniusActStatus::NotReviewed));
        assert!(block_unapproved_issuance(&GeniusActStatus::InPreparation));
        assert!(!block_unapproved_issuance(&GeniusActStatus::PermittedIssuer));
    }
}
