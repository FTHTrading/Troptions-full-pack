use crate::models::{
    ComplianceGate, Decision, GateStatus, IssuerMode, RequirementLevel, StablecoinAction,
    TroptionsGeniusProfile,
};

fn requirement_order(level: RequirementLevel) -> u8 {
    match level {
        RequirementLevel::Sandbox => 0,
        RequirementLevel::PartnerReady => 1,
        RequirementLevel::RegulatorReady => 2,
        RequirementLevel::Live => 3,
    }
}

fn is_live_action(action: StablecoinAction) -> bool {
    matches!(
        action,
        StablecoinAction::LiveMint | StablecoinAction::LiveBurn | StablecoinAction::LiveRedemption
    )
}

pub fn list_blocking_items(
    gates: &[ComplianceGate],
    requested_status: RequirementLevel,
) -> Vec<String> {
    gates
        .iter()
        .filter(|gate| requirement_order(gate.required_for) <= requirement_order(requested_status))
        .filter(|gate| gate.status != GateStatus::Approved)
        .map(|gate| format!("{} ({:?})", gate.label, gate.status).to_lowercase())
        .collect()
}

pub fn evaluate_stablecoin_action(
    profile: &TroptionsGeniusProfile,
    gates: &[ComplianceGate],
    action: StablecoinAction,
) -> Decision {
    let mut reasons = Vec::new();
    let mut required_next_steps = Vec::new();

    if is_live_action(action) {
        if !matches!(
            profile.issuer_mode,
            IssuerMode::LicensedPpsi | IssuerMode::PartneredPpsi
        ) {
            reasons.push(
                "live stablecoin actions require a licensed or partnered ppsi path".to_string(),
            );
        }

        if !profile.legal_counsel_memo_approved {
            reasons.push("legal counsel memo not approved".to_string());
        }
        if !profile.regulator_approval_recorded {
            reasons.push("regulator approval not recorded".to_string());
        }
        if !profile.board_approval_recorded {
            reasons.push("board approval not recorded".to_string());
        }
        if !profile.reserve_policy_approved {
            reasons.push("reserve policy not approved".to_string());
        }
        if !profile.reserve_attestation_current {
            reasons.push("reserve attestation is not current".to_string());
        }
        if !profile.redemption_policy_approved {
            reasons.push("redemption policy not approved".to_string());
        }
        if !profile.aml_sanctions_program_approved {
            reasons.push("aml and sanctions program not approved".to_string());
        }
        if !profile.kyc_kyb_provider_active {
            reasons.push("kyc/kyb provider is not active".to_string());
        }
        if !profile.incident_response_plan_approved {
            reasons.push("incident response plan not approved".to_string());
        }
        if !profile.consumer_disclosures_approved {
            reasons.push("consumer disclosures not approved".to_string());
        }
        if !profile.chain_risk_review_approved {
            reasons.push("chain risk review not approved".to_string());
        }
        if !profile.smart_contract_audit_approved {
            reasons.push("smart contract audit not approved".to_string());
        }

        let live_blockers = list_blocking_items(gates, RequirementLevel::Live);
        if !live_blockers.is_empty() {
            reasons.push(format!(
                "live blockers remain: {}",
                live_blockers.join("; ")
            ));
        }

        if profile.public_chain_allowed && !profile.chain_risk_review_approved {
            reasons.push("public chain allowance does not bypass chain risk review".to_string());
        }

        if !reasons.is_empty() {
            required_next_steps
                .push("complete live gate approvals before requesting activation".to_string());
        }
    } else {
        let sandbox_blockers = list_blocking_items(gates, RequirementLevel::Sandbox);
        if matches!(
            action,
            StablecoinAction::SimulateMint
                | StablecoinAction::SimulateBurn
                | StablecoinAction::SimulateTransfer
                | StablecoinAction::SimulateRedemptionRequest
        ) && !sandbox_blockers.is_empty()
        {
            reasons.push(format!(
                "sandbox readiness incomplete: {}",
                sandbox_blockers.join("; ")
            ));
            required_next_steps.push("approve sandbox gates before simulation".to_string());
        }
    }

    if reasons.is_empty() {
        Decision {
            allowed: true,
            status: if is_live_action(action) {
                "live_enabled".to_string()
            } else {
                "sandbox_ready".to_string()
            },
            reasons: vec![if is_live_action(action) {
                "all live requirements approved".to_string()
            } else {
                "sandbox-only action approved".to_string()
            }],
            required_next_steps,
        }
    } else {
        Decision {
            allowed: false,
            status: if is_live_action(action) {
                "blocked_live".to_string()
            } else {
                "blocked_sandbox".to_string()
            },
            reasons,
            required_next_steps,
        }
    }
}
