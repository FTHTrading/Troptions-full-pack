#![allow(dead_code)]

//! TSN NIL — Compliance evaluation engine.
//!
//! Evaluates NIL deal parameters against:
//! - State NIL law readiness (50-state model — unknown state = needs_review)
//! - Institution rule overlays (unknown institution = needs_review)
//! - Minor consent requirements (minor present = guardian review required)
//! - Restricted category detection (alcohol, tobacco, gambling, adult content, pay-for-play blocked)
//! - Pay-for-play risk evaluation (performance-linked compensation blocked)
//! - Recruiting inducement risk evaluation (recruiting-linked deals blocked)
//!
//! All outcomes are simulation-only. Not legal advice.

use chrono::Utc;
use uuid::Uuid;

use crate::errors::NilError;
use crate::types::{
    AthleteId, InstitutionRuleProfile, MinorConsentStatus, NilComplianceCheck, NilDeal,
    PayForPlayRisk, RecruitingRisk, RestrictedCategory, StateRuleProfile,
};

const COMPLIANCE_DISCLAIMER: &str = "\
This compliance evaluation is for devnet simulation only and does not \
constitute legal advice, compliance certification, or eligibility determination. \
Actual NIL activity requires legal counsel, institutional review, state law compliance, \
and Control Hub authorization.";

// ─── State rule database (partial — needs_review for all unknown states) ──────

/// Return a state rule profile.
/// If the state is not in the known list, returns `needs_review = true`.
pub fn evaluate_state_rule_readiness(state_code: &str) -> StateRuleProfile {
    let known = known_state_rule(state_code);
    known.unwrap_or_else(|| StateRuleProfile {
        state_code: state_code.to_string(),
        nil_permitted: false,
        agent_permitted: false,
        disclosure_required: true,
        school_approval_required: true,
        legal_review_required: true,
        last_reviewed: None,
        notes: format!(
            "State '{}' not in NIL rule database — legal review required before proceeding.",
            state_code
        ),
    })
}

fn known_state_rule(code: &str) -> Option<StateRuleProfile> {
    match code.to_uppercase().as_str() {
        "TX" => Some(StateRuleProfile {
            state_code: "TX".into(),
            nil_permitted: true,
            agent_permitted: true,
            disclosure_required: true,
            school_approval_required: false,
            legal_review_required: true,
            last_reviewed: None,
            notes: "Texas NIL law — disclosure required; no school pre-approval mandate. Legal review required.".into(),
        }),
        "CA" => Some(StateRuleProfile {
            state_code: "CA".into(),
            nil_permitted: true,
            agent_permitted: true,
            disclosure_required: true,
            school_approval_required: false,
            legal_review_required: true,
            last_reviewed: None,
            notes: "California SB 206 — NIL permitted; no school pre-approval. Legal review required.".into(),
        }),
        "FL" => Some(StateRuleProfile {
            state_code: "FL".into(),
            nil_permitted: true,
            agent_permitted: true,
            disclosure_required: true,
            school_approval_required: false,
            legal_review_required: true,
            last_reviewed: None,
            notes: "Florida NIL law — NIL permitted. Legal review required.".into(),
        }),
        "OH" => Some(StateRuleProfile {
            state_code: "OH".into(),
            nil_permitted: true,
            agent_permitted: true,
            disclosure_required: true,
            school_approval_required: true,
            legal_review_required: true,
            last_reviewed: None,
            notes: "Ohio NIL law — school disclosure may be required. Legal review required.".into(),
        }),
        "GA" => Some(StateRuleProfile {
            state_code: "GA".into(),
            nil_permitted: true,
            agent_permitted: true,
            disclosure_required: true,
            school_approval_required: false,
            legal_review_required: true,
            last_reviewed: None,
            notes: "Georgia NIL law — NIL permitted. Legal review required.".into(),
        }),
        _ => None,
    }
}

// ─── Institution rule overlay ─────────────────────────────────────────────────

/// Return an institution rule profile.
/// Unknown institutions return a `needs_review` profile.
pub fn evaluate_institution_rule_overlay(institution_code: &str) -> InstitutionRuleProfile {
    InstitutionRuleProfile {
        institution_code: institution_code.to_string(),
        nil_program_exists: false,
        pre_approval_required: true,
        disclosure_required: true,
        agent_registration_required: true,
        legal_review_required: true,
        notes: format!(
            "Institution '{}' not in registry — assume all approvals required. \
            Verify directly with the institution's compliance office.",
            institution_code
        ),
    }
}

// ─── Minor consent check ──────────────────────────────────────────────────────

/// Evaluate minor consent requirements.
///
/// If the athlete is a minor and consent is not `Approved`, returns blocked status.
pub fn evaluate_minor_consent_requirement(
    is_minor: bool,
    consent_status: &MinorConsentStatus,
) -> (bool, Vec<String>) {
    if !is_minor {
        return (false, vec![]);
    }
    match consent_status {
        MinorConsentStatus::Approved => (false, vec![]),
        _ => (
            true,
            vec![
                "guardian_review_required".into(),
                "minor_consent_not_approved".into(),
            ],
        ),
    }
}

// ─── Restricted category detection ───────────────────────────────────────────

/// Evaluate restricted categories in deal deliverables.
///
/// Pay-for-play and recruiting inducement are always blocked.
pub fn evaluate_restricted_category(
    categories: &[RestrictedCategory],
) -> (Vec<RestrictedCategory>, Vec<String>) {
    let mut detected = vec![];
    let mut blocked = vec![];

    for cat in categories {
        match cat {
            RestrictedCategory::AlcoholTobacco => {
                detected.push(cat.clone());
                blocked.push("restricted_category: alcohol/tobacco".into());
            }
            RestrictedCategory::Gambling => {
                detected.push(cat.clone());
                blocked.push("restricted_category: gambling".into());
            }
            RestrictedCategory::AdultContent => {
                detected.push(cat.clone());
                blocked.push("restricted_category: adult_content".into());
            }
            RestrictedCategory::PharmaceuticalWithoutApproval => {
                detected.push(cat.clone());
                blocked.push("restricted_category: pharmaceutical_without_approval".into());
            }
            RestrictedCategory::CryptocurrencyWithoutApproval => {
                detected.push(cat.clone());
                blocked.push("restricted_category: cryptocurrency_without_approval".into());
            }
            RestrictedCategory::PayForPlay => {
                detected.push(cat.clone());
                blocked.push("pay_for_play_detected: blocked".into());
            }
            RestrictedCategory::RecruitingInducement => {
                detected.push(cat.clone());
                blocked.push("recruiting_inducement_detected: blocked".into());
            }
            RestrictedCategory::Other(_) => {
                detected.push(cat.clone());
                blocked.push("restricted_category: other — legal_review_required".into());
            }
        }
    }
    (detected, blocked)
}

// ─── Pay-for-play risk ────────────────────────────────────────────────────────

/// Evaluate pay-for-play risk in a NIL deal.
///
/// Returns `PayForPlayRisk::Blocked` for any compensation linked to
/// athletic performance metrics.
pub fn evaluate_pay_for_play_risk(
    compensation_band: &str,
    deliverable_descriptions: &[String],
) -> PayForPlayRisk {
    let performance_keywords = [
        "per game",
        "per touchdown",
        "per point",
        "per win",
        "per goal",
        "per yard",
        "performance bonus",
        "athletic performance",
        "stats-based",
        "play-based",
    ];

    let comp_lower = compensation_band.to_lowercase();
    let deliverables_lower: String = deliverable_descriptions
        .iter()
        .map(|s| s.to_lowercase())
        .collect::<Vec<_>>()
        .join(" ");

    for kw in &performance_keywords {
        if comp_lower.contains(kw) || deliverables_lower.contains(kw) {
            return PayForPlayRisk::Blocked;
        }
    }
    PayForPlayRisk::None
}

// ─── Recruiting inducement risk ───────────────────────────────────────────────

/// Evaluate recruiting inducement risk.
///
/// Returns `RecruitingRisk::Blocked` for any deal tied to enrollment or
/// institution commitment.
pub fn evaluate_recruiting_inducement_risk(
    compensation_band: &str,
    deliverable_descriptions: &[String],
) -> RecruitingRisk {
    let recruiting_keywords = [
        "if you enroll",
        "upon commitment",
        "upon signing",
        "recruiting commitment",
        "letter of intent",
        "college choice",
        "choose our school",
        "signing bonus",
        "enrolling at",
        "attending our program",
    ];

    let comp_lower = compensation_band.to_lowercase();
    let deliverables_lower: String = deliverable_descriptions
        .iter()
        .map(|s| s.to_lowercase())
        .collect::<Vec<_>>()
        .join(" ");

    for kw in &recruiting_keywords {
        if comp_lower.contains(kw) || deliverables_lower.contains(kw) {
            return RecruitingRisk::Blocked;
        }
    }
    RecruitingRisk::None
}

// ─── Full compliance evaluation ───────────────────────────────────────────────

pub struct NilDealComplianceInput<'a> {
    pub athlete_id: &'a AthleteId,
    pub deal: &'a NilDeal,
    pub is_minor: bool,
    pub minor_consent_status: MinorConsentStatus,
    pub restricted_categories: Vec<RestrictedCategory>,
    pub deliverable_descriptions: Vec<String>,
}

/// Full NIL deal compliance evaluation.
pub fn evaluate_nil_deal_compliance(
    input: &NilDealComplianceInput,
) -> Result<NilComplianceCheck, NilError> {
    let mut blocked_reasons: Vec<String> = Vec::new();
    let mut required_approvals: Vec<String> =
        vec!["control_hub_approval".into(), "legal_review".into()];

    // State rules
    let state_rule = evaluate_state_rule_readiness(&input.deal.state_code);
    let state_status = if state_rule.nil_permitted {
        "permitted_with_conditions".to_string()
    } else {
        blocked_reasons.push(format!(
            "state_nil_not_permitted: {}",
            input.deal.state_code
        ));
        "needs_review".to_string()
    };
    if state_rule.school_approval_required {
        required_approvals.push("school_approval".into());
    }

    // Institution rules
    let inst_rule = evaluate_institution_rule_overlay(&input.deal.institution_code);
    let inst_status = if inst_rule.pre_approval_required {
        required_approvals.push("institution_pre_approval".into());
        "pre_approval_required".to_string()
    } else {
        "disclosure_required".to_string()
    };

    // Minor consent
    let (minor_blocked, minor_reasons) =
        evaluate_minor_consent_requirement(input.is_minor, &input.minor_consent_status);
    if minor_blocked {
        blocked_reasons.extend(minor_reasons);
        required_approvals.push("guardian_approval".into());
    }

    // Restricted categories
    let (detected_cats, cat_blocks) = evaluate_restricted_category(&input.restricted_categories);
    blocked_reasons.extend(cat_blocks);

    // Pay-for-play
    let pfp_risk = evaluate_pay_for_play_risk(
        &input.deal.compensation_band,
        &input.deliverable_descriptions,
    );
    if pfp_risk == PayForPlayRisk::Blocked {
        blocked_reasons.push("pay_for_play_detected: blocked".into());
    }

    // Recruiting inducement
    let rec_risk = evaluate_recruiting_inducement_risk(
        &input.deal.compensation_band,
        &input.deliverable_descriptions,
    );
    if rec_risk == RecruitingRisk::Blocked {
        blocked_reasons.push("recruiting_inducement_detected: blocked".into());
    }

    // Overall decision
    let decision = if blocked_reasons.is_empty() {
        "simulation_only — no blocked reasons detected".to_string()
    } else {
        "blocked — see blocked_reasons".to_string()
    };

    Ok(NilComplianceCheck {
        check_id: Uuid::new_v4(),
        athlete_id: input.athlete_id.clone(),
        deal_id: Some(input.deal.deal_id),
        state_rule_status: state_status,
        institution_rule_status: inst_status,
        minor_consent_status: input.minor_consent_status.clone(),
        restricted_categories_detected: detected_cats,
        pay_for_play_risk: pfp_risk,
        recruiting_risk: rec_risk,
        blocked_reasons,
        required_approvals,
        compliance_decision: decision,
        disclaimer: COMPLIANCE_DISCLAIMER.to_string(),
        simulation_only: true,
        evaluated_at: Utc::now(),
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::types::{AthleteId, NilDeal, NilDealDeliverable, Sport};
    use chrono::Utc;
    use uuid::Uuid;

    fn make_deal(compensation_band: &str, state_code: &str) -> NilDeal {
        let deliverable_hash = tsn_crypto::sha256_hex(b"post content");
        NilDeal {
            deal_id: Uuid::new_v4(),
            athlete_id: AthleteId("athlete_hash".into()),
            brand_hash: tsn_crypto::sha256_hex(b"BrandCo"),
            deliverables: vec![NilDealDeliverable {
                deliverable_hash,
                deliverable_type: "social_post".into(),
                estimated_count: 3,
            }],
            compensation_band: compensation_band.to_string(),
            deal_start_date: None,
            deal_end_date: None,
            state_code: state_code.to_string(),
            institution_code: "UNIV_001".into(),
            simulation_only: true,
            created_at: Utc::now(),
        }
    }

    #[test]
    fn pay_for_play_is_blocked() {
        let risk = evaluate_pay_for_play_risk("$500 per touchdown", &[]);
        assert_eq!(risk, PayForPlayRisk::Blocked);
    }

    #[test]
    fn clean_deal_has_no_pay_for_play_risk() {
        let risk = evaluate_pay_for_play_risk("1000-5000", &["social media post".into()]);
        assert_eq!(risk, PayForPlayRisk::None);
    }

    #[test]
    fn recruiting_inducement_is_blocked() {
        let risk = evaluate_recruiting_inducement_risk("bonus if you enroll", &[]);
        assert_eq!(risk, RecruitingRisk::Blocked);
    }

    #[test]
    fn clean_deal_has_no_recruiting_risk() {
        let risk = evaluate_recruiting_inducement_risk("1000-5000", &["post about product".into()]);
        assert_eq!(risk, RecruitingRisk::None);
    }

    #[test]
    fn minor_without_consent_blocked_in_full_evaluation() {
        let athlete_id = AthleteId("athlete_hash".into());
        let deal = make_deal("1000-5000", "TX");
        let input = NilDealComplianceInput {
            athlete_id: &athlete_id,
            deal: &deal,
            is_minor: true,
            minor_consent_status: MinorConsentStatus::PendingGuardianReview,
            restricted_categories: vec![],
            deliverable_descriptions: vec!["post content".into()],
        };
        let result = evaluate_nil_deal_compliance(&input).unwrap();
        assert!(result
            .blocked_reasons
            .iter()
            .any(|r| r.contains("minor_consent")));
    }

    #[test]
    fn unknown_state_returns_needs_review() {
        let profile = evaluate_state_rule_readiness("ZZ");
        assert!(!profile.nil_permitted);
        assert!(profile.notes.contains("not in NIL rule database"));
    }
}
