use troptions_genius_core::{
    calculate_readiness_score, classify_genius_risk, create_regulator_packet_summary,
    evaluate_stablecoin_action, list_blocking_items, ComplianceGate, GateStatus, IssuanceStatus,
    IssuerMode, RequirementLevel, RiskInput, RiskRating, SettlementLane, StablecoinAction,
    TroptionsGeniusProfile,
};

fn base_profile() -> TroptionsGeniusProfile {
    TroptionsGeniusProfile {
        program_name: "Troptions Regulated Digital Settlement OS".to_string(),
        issuer_mode: IssuerMode::SandboxSimulation,
        issuance_status: IssuanceStatus::BlockedMissingRegulatorApproval,
        jurisdiction: "United States".to_string(),
        credit_union_partner_name: Some("Blue River".to_string()),
        cuso_partner_name: Some("Coastal Shared Services CUSO".to_string()),
        ppsi_partner_name: Some("PPSI Candidate".to_string()),
        reserve_custodian_name: Some("Reserve Custody Candidate".to_string()),
        kyc_kyb_provider_name: Some("Atlas Identity Mock".to_string()),
        aml_provider_name: Some("Signal AML Mock".to_string()),
        chain_networks_allowed: vec!["XRPL".to_string(), "Stellar".to_string()],
        public_chain_allowed: true,
        live_actions_enabled: false,
        legal_counsel_memo_approved: false,
        regulator_approval_recorded: false,
        board_approval_recorded: false,
        reserve_policy_approved: true,
        reserve_attestation_current: false,
        redemption_policy_approved: true,
        aml_sanctions_program_approved: true,
        kyc_kyb_provider_active: true,
        incident_response_plan_approved: true,
        consumer_disclosures_approved: false,
        chain_risk_review_approved: false,
        smart_contract_audit_approved: false,
    }
}

fn base_gates() -> Vec<ComplianceGate> {
    vec![
        ComplianceGate {
            id: "aml-bsa-policy".to_string(),
            label: "AML/BSA policy".to_string(),
            status: GateStatus::Approved,
            required_for: RequirementLevel::Sandbox,
            evidence_uri: None,
            owner: Some("Compliance".to_string()),
            last_reviewed_at: None,
        },
        ComplianceGate {
            id: "kyc-kyb-provider".to_string(),
            label: "KYC/KYB provider".to_string(),
            status: GateStatus::Approved,
            required_for: RequirementLevel::Sandbox,
            evidence_uri: None,
            owner: Some("Compliance".to_string()),
            last_reviewed_at: None,
        },
        ComplianceGate {
            id: "reserve-attestation".to_string(),
            label: "Reserve attestation".to_string(),
            status: GateStatus::Expired,
            required_for: RequirementLevel::Live,
            evidence_uri: None,
            owner: Some("Audit".to_string()),
            last_reviewed_at: None,
        },
        ComplianceGate {
            id: "regulator-approval".to_string(),
            label: "Regulator approval".to_string(),
            status: GateStatus::Missing,
            required_for: RequirementLevel::Live,
            evidence_uri: None,
            owner: Some("Regulatory".to_string()),
            last_reviewed_at: None,
        },
    ]
}

#[test]
fn live_mint_is_blocked_by_default() {
    let decision =
        evaluate_stablecoin_action(&base_profile(), &base_gates(), StablecoinAction::LiveMint);
    assert!(!decision.allowed);
    assert!(decision
        .reasons
        .iter()
        .any(|reason| reason.contains("licensed or partnered ppsi")));
}

#[test]
fn simulate_mint_is_allowed_in_sandbox_if_sandbox_gates_pass() {
    let gates = base_gates();
    let decision =
        evaluate_stablecoin_action(&base_profile(), &gates, StablecoinAction::SimulateMint);
    assert!(decision.allowed);
    assert_eq!(decision.status, "sandbox_ready");
}

#[test]
fn live_actions_blocked_if_reserve_attestation_missing() {
    let decision =
        evaluate_stablecoin_action(&base_profile(), &base_gates(), StablecoinAction::LiveMint);
    assert!(decision
        .reasons
        .iter()
        .any(|reason| reason.contains("reserve attestation")));
}

#[test]
fn live_actions_blocked_if_kyc_kyb_missing() {
    let mut profile = base_profile();
    profile.kyc_kyb_provider_active = false;
    let decision = evaluate_stablecoin_action(&profile, &base_gates(), StablecoinAction::LiveBurn);
    assert!(decision
        .reasons
        .iter()
        .any(|reason| reason.contains("kyc/kyb provider")));
}

#[test]
fn live_actions_blocked_if_regulator_approval_missing() {
    let decision = evaluate_stablecoin_action(
        &base_profile(),
        &base_gates(),
        StablecoinAction::LiveRedemption,
    );
    assert!(decision
        .reasons
        .iter()
        .any(|reason| reason.contains("regulator approval")));
}

#[test]
fn partner_ready_does_not_equal_live_enabled() {
    let readiness = calculate_readiness_score(&base_gates());
    assert!(readiness.partner_score >= readiness.sandbox_score);
    assert!(readiness.live_score < 100);
}

#[test]
fn public_chain_allowed_does_not_bypass_compliance_gates() {
    let decision =
        evaluate_stablecoin_action(&base_profile(), &base_gates(), StablecoinAction::LiveMint);
    assert!(decision
        .reasons
        .iter()
        .any(|reason| reason.contains("public chain allowance does not bypass")));
}

#[test]
fn tokenized_deposit_lane_is_distinct_from_payment_stablecoin_lane() {
    let payment_risk = classify_genius_risk(&RiskInput {
        lane: SettlementLane::PaymentStablecoin,
        blockers: vec!["reserve attestation expired".to_string()],
        public_chain_allowed: true,
        live_action_requested: false,
    });
    let deposit_risk = classify_genius_risk(&RiskInput {
        lane: SettlementLane::TokenizedDeposit,
        blockers: vec!["partner diligence required".to_string()],
        public_chain_allowed: false,
        live_action_requested: false,
    });
    assert_eq!(payment_risk, RiskRating::High);
    assert_eq!(deposit_risk, RiskRating::Medium);
}

#[test]
fn blocking_items_and_packet_summary_include_live_blockers() {
    let blockers = list_blocking_items(&base_gates(), RequirementLevel::Live);
    assert!(blockers
        .iter()
        .any(|item| item.contains("reserve attestation")));

    let packet = create_regulator_packet_summary(&base_profile(), &base_gates());
    assert!(!packet.blockers.is_empty());
    assert!(packet.live_issuance_blocked_notice.contains("blocked"));
}
