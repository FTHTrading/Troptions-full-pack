#![allow(dead_code)]

use chrono::Utc;
use tsn_state::{AuditEvent, AuditEventType, FreezeStatus, GovernanceDecision, KycTier, Trustline};
use uuid::Uuid;

pub struct TrustlineSimulationResult {
    pub simulation_id: Uuid,
    pub trustline: Trustline,
    pub governance_decision: GovernanceDecision,
    pub audit_event: AuditEvent,
    pub simulation_only: bool,
}

pub fn create_trustline_simulation(
    account_id: Uuid,
    asset_id: Uuid,
    limit_string: &str,
    holder_kyc_tier: &KycTier,
) -> TrustlineSimulationResult {
    let sim_id = Uuid::new_v4();
    let task_id = Uuid::new_v4().to_string();
    let audit_id = Uuid::new_v4().to_string();

    let mut blocked_reasons = vec!["platform_simulation_gate_active".to_string()];
    let mut required_approvals = vec!["control_hub_approval".to_string()];

    if !matches!(
        holder_kyc_tier,
        KycTier::Basic | KycTier::Enhanced | KycTier::Institutional
    ) {
        blocked_reasons.push(format!("holder_kyc_insufficient: {:?}", holder_kyc_tier));
        required_approvals.push("kyc_verification_required".to_string());
    }

    let trustline = Trustline {
        id: Uuid::new_v4(),
        account_id,
        asset_id,
        limit_string: limit_string.to_string(),
        balance_string: "0".to_string(),
        freeze_status: FreezeStatus::Active,
        simulation_only: true,
        created_at: Utc::now(),
        updated_at: Utc::now(),
    };

    let governance_decision = GovernanceDecision {
        task_id: task_id.clone(),
        audit_record_id: audit_id.clone(),
        allowed: false,
        simulation_only: true,
        blocked_actions: blocked_reasons.clone(),
        required_approvals: required_approvals.clone(),
        compliance_checks: vec!["platform_simulation_gate".to_string(), "kyc".to_string()],
        audit_hint: "Trustline creation simulation".to_string(),
        decided_at: Utc::now(),
    };

    let audit_event = AuditEvent::new(
        AuditEventType::TrustlineSimulated,
        "tsn_trustline_runtime",
        "Trustline creation simulated",
        serde_json::json!({
            "account_id": account_id.to_string(),
            "asset_id": asset_id.to_string(),
            "limit_string": limit_string,
            "blocked_reasons": blocked_reasons,
        }),
    );

    TrustlineSimulationResult {
        simulation_id: sim_id,
        trustline,
        governance_decision,
        audit_event,
        simulation_only: true,
    }
}

pub fn freeze_trustline_simulation(trustline: &mut Trustline, reason: &str) -> AuditEvent {
    trustline.freeze_status = FreezeStatus::FrozenByCompliance;
    trustline.updated_at = Utc::now();
    AuditEvent::new(
        AuditEventType::TrustlineSimulated,
        "tsn_trustline_runtime",
        &format!("Trustline freeze simulated: {}", reason),
        serde_json::json!({
            "trustline_id": trustline.id.to_string(),
            "reason": reason,
        }),
    )
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn trustline_simulation_works_with_valid_kyc() {
        let result = create_trustline_simulation(
            Uuid::new_v4(),
            Uuid::new_v4(),
            "1000000000",
            &KycTier::Enhanced,
        );
        assert!(result.simulation_only);
        assert!(result.governance_decision.simulation_only);
        assert_eq!(result.trustline.balance_string, "0");
        assert_eq!(result.trustline.freeze_status, FreezeStatus::Active);
    }

    #[test]
    fn trustline_blocked_with_unknown_kyc() {
        let result = create_trustline_simulation(
            Uuid::new_v4(),
            Uuid::new_v4(),
            "1000000000",
            &KycTier::Unknown,
        );
        assert!(result
            .governance_decision
            .blocked_actions
            .iter()
            .any(|r| r.contains("kyc_insufficient")));
    }
}
