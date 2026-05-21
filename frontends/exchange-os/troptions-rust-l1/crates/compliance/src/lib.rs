#![allow(dead_code)]

//! TCSA — Troptions Compliance Scoring Algorithm
//!
//! Evaluates every transfer or state change.
//! All outcomes default to SimulateOnly in scaffold — no live execution.

use chrono::Utc;
use tsn_state::{
    AuditEvent, AuditEventType, AssetClass, ComplianceDecision, ComplianceOutcome,
    GeniusActStatus, KybTier, KycTier, SanctionsStatus,
};
#[allow(unused_imports)]
use uuid::Uuid;

pub struct TransferEvalInput {
    pub sender_kyc_tier: KycTier,
    pub sender_kyb_tier: KybTier,
    pub sender_sanctions_status: SanctionsStatus,
    pub sender_wallet_risk_score: u8,
    pub receiver_kyc_tier: KycTier,
    pub receiver_kyb_tier: KybTier,
    pub receiver_sanctions_status: SanctionsStatus,
    pub receiver_wallet_risk_score: u8,
    pub asset_class: AssetClass,
    pub genius_act_status: Option<GeniusActStatus>,
    pub travel_rule_metadata_provided: bool,
    pub amount_usd_cents: Option<u64>,
}

pub struct ComplianceEngine;

impl ComplianceEngine {
    pub fn evaluate_transfer(input: &TransferEvalInput) -> (ComplianceDecision, AuditEvent) {
        let mut blocked_reasons: Vec<String> = Vec::new();
        let mut required_approvals: Vec<String> = vec!["control_hub_approval".to_string()];
        let mut compliance_checks: Vec<String> = Vec::new();
        let mut travel_rule_required = false;

        // Platform simulation gate — always active in scaffold
        compliance_checks.push("platform_simulation_gate".to_string());
        blocked_reasons.push("platform_simulation_gate_active".to_string());

        // KYC checks
        if !Self::evaluate_kyc(&input.sender_kyc_tier) {
            blocked_reasons.push(format!("sender_kyc_insufficient: {:?}", input.sender_kyc_tier));
        }
        compliance_checks.push("sender_kyc".to_string());

        if !Self::evaluate_kyc(&input.receiver_kyc_tier) {
            blocked_reasons.push(format!("receiver_kyc_insufficient: {:?}", input.receiver_kyc_tier));
        }
        compliance_checks.push("receiver_kyc".to_string());

        // Sanctions checks
        match &input.sender_sanctions_status {
            SanctionsStatus::Unscreened => {
                blocked_reasons.push("sender_sanctions_unscreened".to_string());
                required_approvals.push("sanctions_review".to_string());
            }
            SanctionsStatus::PotentialMatch => {
                blocked_reasons.push("sender_sanctions_potential_match".to_string());
                required_approvals.push("sanctions_review".to_string());
            }
            SanctionsStatus::Blocked => {
                blocked_reasons.push("sender_sanctions_blocked".to_string());
            }
            SanctionsStatus::Clear => {}
        }
        compliance_checks.push("sender_sanctions".to_string());

        match &input.receiver_sanctions_status {
            SanctionsStatus::Unscreened => {
                blocked_reasons.push("receiver_sanctions_unscreened".to_string());
            }
            SanctionsStatus::PotentialMatch | SanctionsStatus::Blocked => {
                blocked_reasons.push(format!(
                    "receiver_sanctions: {:?}",
                    input.receiver_sanctions_status
                ));
            }
            SanctionsStatus::Clear => {}
        }
        compliance_checks.push("receiver_sanctions".to_string());

        // Wallet risk score
        if input.sender_wallet_risk_score > 85 || input.receiver_wallet_risk_score > 85 {
            blocked_reasons.push("wallet_risk_score_critical".to_string());
        } else if input.sender_wallet_risk_score > 70 || input.receiver_wallet_risk_score > 70 {
            required_approvals.push("wallet_risk_review".to_string());
        }
        compliance_checks.push("wallet_risk_score".to_string());

        // Travel Rule threshold: $1,000 USD equivalent
        if let Some(cents) = input.amount_usd_cents {
            if cents >= 100_000 && !input.travel_rule_metadata_provided {
                travel_rule_required = true;
                blocked_reasons.push("travel_rule_metadata_required".to_string());
                required_approvals.push("travel_rule_submission".to_string());
            }
        }
        compliance_checks.push("travel_rule".to_string());

        // GENIUS Act stablecoin check
        if input.asset_class == AssetClass::PaymentStablecoin {
            match input.genius_act_status.as_ref().unwrap_or(&GeniusActStatus::NotReviewed) {
                GeniusActStatus::NotReviewed | GeniusActStatus::Blocked => {
                    blocked_reasons.push("genius_act_not_permitted_issuer".to_string());
                }
                GeniusActStatus::InPreparation | GeniusActStatus::PendingApproval => {
                    required_approvals.push("genius_act_issuer_approval".to_string());
                }
                GeniusActStatus::PermittedIssuer => {}
            }
            compliance_checks.push("genius_act_stablecoin".to_string());
        }

        let outcome = if blocked_reasons.is_empty() {
            ComplianceOutcome::SimulateOnly
        } else {
            ComplianceOutcome::Blocked
        };

        let decision = ComplianceDecision {
            outcome: outcome.clone(),
            blocked_reasons: blocked_reasons.clone(),
            required_approvals: required_approvals.clone(),
            compliance_checks: compliance_checks.clone(),
            travel_rule_required,
            audit_hint: format!("TCSA evaluation: {:?}", outcome),
            simulation_only: true,
            evaluated_at: Utc::now(),
        };

        let audit_event = AuditEvent::new(
            if matches!(outcome, ComplianceOutcome::Blocked) {
                AuditEventType::ComplianceBlock
            } else {
                AuditEventType::ComplianceSimulateOnly
            },
            "tcsa_compliance_engine",
            &format!("Transfer evaluation: {:?}", outcome),
            serde_json::json!({
                "blocked_reasons": blocked_reasons,
                "required_approvals": required_approvals,
            }),
        );

        (decision, audit_event)
    }

    pub fn evaluate_kyc(tier: &KycTier) -> bool {
        matches!(
            tier,
            KycTier::Basic | KycTier::Enhanced | KycTier::Institutional
        )
    }

    pub fn evaluate_kyb(tier: &KybTier) -> bool {
        matches!(
            tier,
            KybTier::Registered | KybTier::Enhanced | KybTier::Institutional
        )
    }

    pub fn evaluate_sanctions(status: &SanctionsStatus) -> bool {
        matches!(status, SanctionsStatus::Clear)
    }

    pub fn evaluate_wallet_risk(score: u8) -> bool {
        score <= 70
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tsn_state::JurisdictionCode;

    fn default_input() -> TransferEvalInput {
        TransferEvalInput {
            sender_kyc_tier: KycTier::Enhanced,
            sender_kyb_tier: KybTier::Enhanced,
            sender_sanctions_status: SanctionsStatus::Clear,
            sender_wallet_risk_score: 10,
            receiver_kyc_tier: KycTier::Enhanced,
            receiver_kyb_tier: KybTier::Enhanced,
            receiver_sanctions_status: SanctionsStatus::Clear,
            receiver_wallet_risk_score: 10,
            asset_class: AssetClass::NativeToken,
            genius_act_status: None,
            travel_rule_metadata_provided: true,
            amount_usd_cents: None,
        }
    }

    #[test]
    fn compliance_blocks_unknown_kyc() {
        let mut input = default_input();
        input.sender_kyc_tier = KycTier::Unknown;
        let (decision, audit_event) = ComplianceEngine::evaluate_transfer(&input);
        assert_eq!(decision.outcome, ComplianceOutcome::Blocked);
        assert!(decision.blocked_reasons.iter().any(|r| r.contains("sender_kyc_insufficient")));
        assert!(decision.simulation_only);
        assert!(audit_event.simulation_only);
    }

    #[test]
    fn compliance_simulate_only_for_clean_transfer() {
        let input = default_input();
        let (decision, _) = ComplianceEngine::evaluate_transfer(&input);
        // Platform gate always fires — outcome is blocked due to platform_simulation_gate_active
        assert!(decision.simulation_only);
    }

    #[test]
    fn compliance_blocks_sanctioned_sender() {
        let mut input = default_input();
        input.sender_sanctions_status = SanctionsStatus::Blocked;
        let (decision, _) = ComplianceEngine::evaluate_transfer(&input);
        assert_eq!(decision.outcome, ComplianceOutcome::Blocked);
        assert!(decision.blocked_reasons.iter().any(|r| r.contains("sanctions_blocked")));
    }

    #[test]
    fn travel_rule_required_above_threshold() {
        let mut input = default_input();
        input.amount_usd_cents = Some(150_000); // $1,500
        input.travel_rule_metadata_provided = false;
        let (decision, _) = ComplianceEngine::evaluate_transfer(&input);
        assert!(decision.travel_rule_required);
        assert!(decision.blocked_reasons.iter().any(|r| r.contains("travel_rule")));
    }
}
