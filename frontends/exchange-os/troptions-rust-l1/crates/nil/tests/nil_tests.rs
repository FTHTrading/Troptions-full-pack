//! TSN NIL — Integration tests.
//!
//! These tests verify end-to-end NIL protocol behaviour across all modules.
//! All tested functionality is simulation-only and devnet-only.

use chrono::Utc;
use uuid::Uuid;

use tsn_nil::agent::all_nil_agents;
use tsn_nil::compliance::{
    evaluate_minor_consent_requirement, evaluate_nil_deal_compliance, evaluate_pay_for_play_risk,
    evaluate_recruiting_inducement_risk, NilDealComplianceInput,
};
use tsn_nil::governance::{
    create_nil_state_transition, evaluate_nil_governance_decision, require_control_hub_approval,
};
use tsn_nil::identity::{
    create_canonical_athlete_payload, create_identity_record, hash_athlete_identity,
};
use tsn_nil::proof::{
    create_merkle_root, create_proof_vault_record, create_web3_anchor_template,
    hash_proof_document, verify_proof_vault_record,
};
use tsn_nil::receipt::{create_nil_deal_receipt, create_unsigned_web3_receipt_template};
use tsn_nil::signals::all_nil_signals;
use tsn_nil::types::{
    AthleteId, AthleteProfile, MinorConsentStatus, NilDeal, NilDealDeliverable,
    NilGovernanceDecision, NilL1Transaction, NilSignalScore, NilValuationInput, PayForPlayRisk,
    RecruitingRisk, RestrictedCategory, Sport, SportVertical,
};
use tsn_nil::valuation::{
    compute_composite_score, compute_nil_valuation_estimate, create_valuation_report,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

fn make_athlete_profile(is_minor: bool) -> AthleteProfile {
    AthleteProfile {
        athlete_id: AthleteId("integration_test_hash".into()),
        sport: Sport::Football,
        sport_vertical: SportVertical::TeamSport,
        institution_code: "UNIV_001".into(),
        graduation_band: "2025-2027".into(),
        is_minor,
        simulation_only: true,
        created_at: Utc::now(),
    }
}

fn make_signal_score(id: u8, raw: f64) -> NilSignalScore {
    NilSignalScore {
        signal_id: id,
        signal_name: format!("signal_{}", id),
        raw_score: raw,
        normalized_score: raw / 10.0,
        data_provided: true,
        confidence: 1.0,
    }
}

fn make_deal(compensation_band: &str, state_code: &str) -> NilDeal {
    let hash = tsn_crypto::sha256_hex(b"test deliverable");
    NilDeal {
        deal_id: Uuid::new_v4(),
        athlete_id: AthleteId("integration_test_hash".into()),
        brand_hash: tsn_crypto::sha256_hex(b"BrandCo"),
        deliverables: vec![NilDealDeliverable {
            deliverable_hash: hash,
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

// ─── Test 1: Exactly 33 signals defined ───────────────────────────────────────

#[test]
fn test_01_exactly_33_signals_defined() {
    let signals = all_nil_signals();
    assert_eq!(
        signals.len(),
        33,
        "Expected exactly 33 NIL signals, found {}",
        signals.len()
    );
}

// ─── Test 2: Deterministic composite score ────────────────────────────────────

#[test]
fn test_02_composite_score_is_deterministic() {
    let scores: Vec<NilSignalScore> = (1..=20).map(|i| make_signal_score(i, 7.5)).collect();
    let r1 = compute_composite_score(&scores);
    let r2 = compute_composite_score(&scores);
    assert!(
        (r1 - r2).abs() < f64::EPSILON,
        "Composite score should be deterministic: {} vs {}",
        r1,
        r2
    );
}

// ─── Test 3: Valuation InsufficientData when no data provided ────────────────

#[test]
fn test_03_valuation_insufficient_data_with_no_signals() {
    use tsn_nil::errors::NilError;

    let scores: Vec<NilSignalScore> = (1..=3).map(|i| make_signal_score(i, 5.0)).collect();
    let input = NilValuationInput {
        athlete_id: AthleteId("integration_test_hash".into()),
        sport: Sport::Football,
        signal_scores: scores,
        institution_code: "UNIV_001".into(),
        is_minor: false,
    };
    let result = create_valuation_report(&input);
    assert!(
        matches!(result, Err(NilError::InsufficientSignalData(_))),
        "Expected InsufficientSignalData error for 3 signals"
    );
}

// ─── Test 4: Valuation disclaimer never says "guaranteed" ─────────────────────

#[test]
fn test_04_valuation_disclaimer_never_says_guaranteed() {
    let scores: Vec<NilSignalScore> = (1..=20).map(|i| make_signal_score(i, 6.0)).collect();
    let input = NilValuationInput {
        athlete_id: AthleteId("integration_test_hash".into()),
        sport: Sport::Football,
        signal_scores: scores,
        institution_code: "UNIV_001".into(),
        is_minor: false,
    };
    let result = create_valuation_report(&input).unwrap();
    assert!(
        result.disclaimer.contains("not a guaranteed NIL value"),
        "Disclaimer must explicitly state this is not a guaranteed value"
    );
    // Ensure no positive guarantee language slips in
    let lowercase = result.disclaimer.to_lowercase();
    assert!(
        !lowercase.contains("we guarantee") && !lowercase.contains("guaranteed income"),
        "Disclaimer must not contain guarantee language"
    );
}

// ─── Test 5: Deterministic SHA-256 identity hash ──────────────────────────────

#[test]
fn test_05_deterministic_identity_hash() {
    let profile = make_athlete_profile(false);
    let p1 = create_canonical_athlete_payload(&profile).unwrap();
    let p2 = create_canonical_athlete_payload(&profile).unwrap();
    let h1 = hash_athlete_identity(&p1);
    let h2 = hash_athlete_identity(&p2);
    assert_eq!(h1, h2, "SHA-256 identity hash must be deterministic");
    assert_eq!(h1.len(), 64, "SHA-256 hash must be 64 hex chars");
}

// ─── Test 6: Identity record has simulation_only = true ───────────────────────

#[test]
fn test_06_identity_record_simulation_only() {
    let profile = make_athlete_profile(false);
    let record = create_identity_record(&profile, MinorConsentStatus::NotApplicable).unwrap();
    assert!(
        record.simulation_only,
        "Identity record must have simulation_only = true"
    );
    assert!(
        record.signature_hex.is_none(),
        "Identity record must have no signature in devnet"
    );
}

// ─── Test 7: Pay-for-play text → PayForPlayRisk::Blocked ────────────────────

#[test]
fn test_07_pay_for_play_text_is_blocked() {
    let risk = evaluate_pay_for_play_risk("$500 per touchdown performance bonus", &[]);
    assert_eq!(
        risk,
        PayForPlayRisk::Blocked,
        "Performance-linked compensation must be blocked"
    );
}

// ─── Test 8: Recruiting inducement text → RecruitingRisk::Blocked ───────────

#[test]
fn test_08_recruiting_inducement_is_blocked() {
    let risk = evaluate_recruiting_inducement_risk(
        "Bonus if you enroll and sign with our university",
        &[],
    );
    assert_eq!(
        risk,
        RecruitingRisk::Blocked,
        "Enrollment-linked compensation must be blocked as recruiting inducement"
    );
}

// ─── Test 9: Minor athlete → guardian review required ─────────────────────────

#[test]
fn test_09_minor_athlete_requires_guardian_review() {
    let (blocked, reasons) =
        evaluate_minor_consent_requirement(true, &MinorConsentStatus::PendingGuardianReview);
    assert!(
        blocked,
        "Minor athlete without approved consent must be blocked"
    );
    assert!(
        reasons
            .iter()
            .any(|r| r.contains("guardian_review_required")),
        "Blocked reasons must include guardian_review_required"
    );
}

// ─── Test 10: Proof vault stores hash, not raw bytes ─────────────────────────

#[test]
fn test_10_proof_vault_stores_hash_not_raw_content() {
    let sensitive_content = "THIS IS SENSITIVE LEGAL DOCUMENT CONTENT — DO NOT STORE";
    let doc_hash = hash_proof_document(sensitive_content);

    let athlete_id = AthleteId("integration_test_hash".into());
    let record = create_proof_vault_record(athlete_id, "nil_deal_agreement", &doc_hash, None);

    let serialized = serde_json::to_string(&record).unwrap();
    assert!(
        !serialized.contains(sensitive_content),
        "Proof vault must NOT contain raw document content"
    );
    assert!(
        serialized.contains(&doc_hash),
        "Proof vault record must contain the document hash"
    );
    assert!(record.simulation_only);
}

// ─── Test 11: Web3 anchor template is unsigned and not live ──────────────────

#[test]
fn test_11_web3_anchor_template_unsigned_not_live() {
    let athlete_id = AthleteId("integration_test_hash".into());
    let template = create_web3_anchor_template(
        &athlete_id,
        "deal_hash_abc123",
        Some("merkle_root_xyz".into()),
        None,
        "xrpl",
    );
    assert!(template.unsigned, "Web3 anchor template must be unsigned");
    assert!(
        !template.live_submission_enabled,
        "Web3 anchor must not have live_submission_enabled"
    );
    assert!(
        template.signature_hex.is_none(),
        "Web3 anchor template must have no signature"
    );
}

// ─── Test 12: Governance blocks live settlement, minting, Web3 anchoring ─────

#[test]
fn test_12_governance_blocks_live_execution() {
    let athlete = AthleteId("integration_test_hash".into());

    // Live execution of any type must be Disabled
    let live_decision = evaluate_nil_governance_decision(
        &NilL1Transaction::CreateNilDealReceipt,
        &athlete,
        false,
        false,
        false,
        true,
    );
    assert_eq!(
        live_decision,
        NilGovernanceDecision::Disabled,
        "Live execution must be Disabled"
    );

    // Pay-for-play must be Blocked
    let pfp_decision = evaluate_nil_governance_decision(
        &NilL1Transaction::CreateNilDealReceipt,
        &athlete,
        false,
        true,
        false,
        false,
    );
    assert_eq!(
        pfp_decision,
        NilGovernanceDecision::Blocked,
        "Pay-for-play must be Blocked"
    );

    // Web3 anchor requires institution review
    let anchor_decision = evaluate_nil_governance_decision(
        &NilL1Transaction::CreateWeb3AnchorTemplate,
        &athlete,
        false,
        false,
        false,
        false,
    );
    assert_eq!(
        anchor_decision,
        NilGovernanceDecision::InstitutionReviewRequired,
        "Web3 anchor must require institution review"
    );

    // State transitions are simulation_only and not live
    let transition = create_nil_state_transition(
        NilL1Transaction::ComputeNilValuation,
        athlete.clone(),
        NilGovernanceDecision::SimulationOnly,
        "Integration test",
        vec![],
    );
    assert!(transition.simulation_only);
    assert!(!transition.live_execution_enabled);
}
