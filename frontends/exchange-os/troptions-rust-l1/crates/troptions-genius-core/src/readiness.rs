use crate::gates::list_blocking_items;
use crate::models::{
    ComplianceGate, GateStatus, PacketSummary, ReadinessScore, RequirementLevel,
    TroptionsGeniusProfile,
};

fn score_for_level(gates: &[ComplianceGate], level: RequirementLevel) -> u8 {
    let order = |value: RequirementLevel| match value {
        RequirementLevel::Sandbox => 0,
        RequirementLevel::PartnerReady => 1,
        RequirementLevel::RegulatorReady => 2,
        RequirementLevel::Live => 3,
    };

    let applicable: Vec<&ComplianceGate> = gates
        .iter()
        .filter(|gate| order(gate.required_for) <= order(level))
        .collect();

    if applicable.is_empty() {
        return 0;
    }

    let approved = applicable
        .iter()
        .filter(|gate| gate.status == GateStatus::Approved)
        .count();

    ((approved * 100) / applicable.len()) as u8
}

pub fn calculate_readiness_score(gates: &[ComplianceGate]) -> ReadinessScore {
    ReadinessScore {
        sandbox_score: score_for_level(gates, RequirementLevel::Sandbox),
        partner_score: score_for_level(gates, RequirementLevel::PartnerReady),
        regulator_score: score_for_level(gates, RequirementLevel::RegulatorReady),
        live_score: score_for_level(gates, RequirementLevel::Live),
        blocking_items: list_blocking_items(gates, RequirementLevel::Live),
    }
}

pub fn create_regulator_packet_summary(
    profile: &TroptionsGeniusProfile,
    gates: &[ComplianceGate],
) -> PacketSummary {
    let readiness_score = calculate_readiness_score(gates);
    let approved_gates = gates
        .iter()
        .filter(|gate| gate.status == GateStatus::Approved)
        .map(|gate| gate.label.clone())
        .collect();
    let missing_gates = gates
        .iter()
        .filter(|gate| gate.status != GateStatus::Approved)
        .map(|gate| gate.label.clone())
        .collect();

    PacketSummary {
        title: format!("{} regulator readiness packet", profile.program_name),
        status: format!("{:?}", profile.issuance_status).to_lowercase(),
        readiness_score: readiness_score.clone(),
        approved_gates,
        missing_gates,
        blockers: readiness_score.blocking_items.clone(),
        next_actions: vec![
            "collect final legal memo approval".to_string(),
            "record board approval".to_string(),
            "refresh reserve attestation evidence".to_string(),
        ],
        legal_disclaimer: "readiness planning only; not licensure, approval, or authority to issue live payment stablecoins".to_string(),
        live_issuance_blocked_notice: "live minting, burning, and redemption remain blocked until all regulated issuer, legal, reserve, aml/kyc, disclosure, and audit controls are approved".to_string(),
    }
}
