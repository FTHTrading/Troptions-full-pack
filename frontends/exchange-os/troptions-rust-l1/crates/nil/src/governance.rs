#![allow(dead_code)]

//! TSN NIL — Governance and Control Hub integration.
//!
//! All NIL production actions require Control Hub approval.
//! Decision outcomes: allow_read_only, simulation_only, needs_approval,
//! legal_review_required, institution_review_required, guardian_review_required,
//! blocked, disabled.
//!
//! Live execution, payment, minting, and Web3 anchoring are disabled.

use chrono::Utc;
use uuid::Uuid;

use crate::types::{
    AthleteId, NilAuditEvent, NilGovernanceDecision, NilL1StateTransition, NilL1Transaction,
};

/// Evaluate a NIL governance decision for a proposed action.
pub fn evaluate_nil_governance_decision(
    transaction_type: &NilL1Transaction,
    athlete_id: &AthleteId,
    requires_minor_consent: bool,
    pay_for_play_risk: bool,
    recruiting_inducement_risk: bool,
    is_live_action: bool,
) -> NilGovernanceDecision {
    // Live actions are always disabled
    if is_live_action {
        return NilGovernanceDecision::Disabled;
    }

    // Pay-for-play blocked
    if pay_for_play_risk {
        return NilGovernanceDecision::Blocked;
    }

    // Recruiting inducement blocked
    if recruiting_inducement_risk {
        return NilGovernanceDecision::Blocked;
    }

    // Minor consent required
    if requires_minor_consent {
        return NilGovernanceDecision::GuardianReviewRequired;
    }

    // Transaction-specific decisions
    match transaction_type {
        NilL1Transaction::RegisterAthleteIdentity => NilGovernanceDecision::NeedsApproval,
        NilL1Transaction::ComputeNilValuation => NilGovernanceDecision::SimulationOnly,
        NilL1Transaction::CheckNilCompliance => NilGovernanceDecision::SimulationOnly,
        NilL1Transaction::CreateNilDealReceipt => NilGovernanceDecision::LegalReviewRequired,
        NilL1Transaction::CreateProofVaultRecord => NilGovernanceDecision::NeedsApproval,
        NilL1Transaction::CreateWeb3AnchorTemplate => {
            NilGovernanceDecision::InstitutionReviewRequired
        }
    }
}

/// Gate a proposed action — returns `true` if allowed to proceed (in simulation mode).
///
/// Only `SimulationOnly` and `AllowReadOnly` decisions allow proceeding.
/// All others are gated for human review.
pub fn require_control_hub_approval(decision: &NilGovernanceDecision) -> bool {
    matches!(
        decision,
        NilGovernanceDecision::SimulationOnly | NilGovernanceDecision::AllowReadOnly
    )
}

/// Create an audit event for a NIL action.
pub fn create_nil_audit_event(
    transaction_type: &NilL1Transaction,
    athlete_id: &AthleteId,
    decision: NilGovernanceDecision,
    summary: &str,
    blocked_actions: Vec<String>,
) -> NilAuditEvent {
    NilAuditEvent {
        event_id: Uuid::new_v4(),
        event_type: format!("{:?}", transaction_type),
        athlete_id_hash: Some(athlete_id.0.clone()),
        actor: "tsn_nil_module".to_string(),
        summary: summary.to_string(),
        decision,
        blocked_actions,
        metadata: serde_json::json!({
            "simulation_only": true,
            "live_execution_enabled": false,
        }),
        simulation_only: true,
        timestamp: Utc::now(),
    }
}

/// Create a blocked action record for an attempted live execution.
pub fn create_blocked_action(action: &str, athlete_id: &AthleteId, reason: &str) -> NilAuditEvent {
    NilAuditEvent {
        event_id: Uuid::new_v4(),
        event_type: "blocked_action".to_string(),
        athlete_id_hash: Some(athlete_id.0.clone()),
        actor: "tsn_nil_module".to_string(),
        summary: format!("Action blocked: {} — {}", action, reason),
        decision: NilGovernanceDecision::Blocked,
        blocked_actions: vec![action.to_string()],
        metadata: serde_json::json!({
            "action": action,
            "reason": reason,
            "simulation_only": true,
        }),
        simulation_only: true,
        timestamp: Utc::now(),
    }
}

/// Create a recommendation for a NIL action requiring review.
pub fn create_recommendation(
    action: &str,
    athlete_id: &AthleteId,
    recommendation: &str,
    required_approvals: &[&str],
) -> NilAuditEvent {
    NilAuditEvent {
        event_id: Uuid::new_v4(),
        event_type: "recommendation".to_string(),
        athlete_id_hash: Some(athlete_id.0.clone()),
        actor: "tsn_nil_module".to_string(),
        summary: format!("Recommendation for {}: {}", action, recommendation),
        decision: NilGovernanceDecision::NeedsApproval,
        blocked_actions: vec![],
        metadata: serde_json::json!({
            "action": action,
            "recommendation": recommendation,
            "required_approvals": required_approvals,
            "simulation_only": true,
        }),
        simulation_only: true,
        timestamp: Utc::now(),
    }
}

/// Create a full L1 state transition record for a NIL simulation.
pub fn create_nil_state_transition(
    transaction_type: NilL1Transaction,
    athlete_id: AthleteId,
    decision: NilGovernanceDecision,
    summary: &str,
    blocked_actions: Vec<String>,
) -> NilL1StateTransition {
    let audit_event = create_nil_audit_event(
        &transaction_type,
        &athlete_id,
        decision,
        summary,
        blocked_actions,
    );

    NilL1StateTransition {
        transition_id: Uuid::new_v4(),
        transaction_type,
        athlete_id,
        simulation_only: true,
        live_execution_enabled: false,
        audit_event,
        executed_at: Utc::now(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::types::AthleteId;

    fn athlete() -> AthleteId {
        AthleteId("test_athlete_hash".into())
    }

    #[test]
    fn live_action_is_disabled() {
        let decision = evaluate_nil_governance_decision(
            &NilL1Transaction::ComputeNilValuation,
            &athlete(),
            false,
            false,
            false,
            true, // live = true
        );
        assert_eq!(decision, NilGovernanceDecision::Disabled);
    }

    #[test]
    fn pay_for_play_is_blocked() {
        let decision = evaluate_nil_governance_decision(
            &NilL1Transaction::CreateNilDealReceipt,
            &athlete(),
            false,
            true, // pfp = true
            false,
            false,
        );
        assert_eq!(decision, NilGovernanceDecision::Blocked);
    }

    #[test]
    fn recruiting_inducement_is_blocked() {
        let decision = evaluate_nil_governance_decision(
            &NilL1Transaction::CreateNilDealReceipt,
            &athlete(),
            false,
            false,
            true, // recruiting inducement = true
            false,
        );
        assert_eq!(decision, NilGovernanceDecision::Blocked);
    }

    #[test]
    fn minor_requires_guardian_review() {
        let decision = evaluate_nil_governance_decision(
            &NilL1Transaction::RegisterAthleteIdentity,
            &athlete(),
            true, // minor
            false,
            false,
            false,
        );
        assert_eq!(decision, NilGovernanceDecision::GuardianReviewRequired);
    }

    #[test]
    fn state_transition_is_simulation_only() {
        let transition = create_nil_state_transition(
            NilL1Transaction::ComputeNilValuation,
            athlete(),
            NilGovernanceDecision::SimulationOnly,
            "Test",
            vec![],
        );
        assert!(transition.simulation_only);
        assert!(!transition.live_execution_enabled);
    }
}
