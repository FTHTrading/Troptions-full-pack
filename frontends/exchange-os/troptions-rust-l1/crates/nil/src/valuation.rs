#![allow(dead_code)]

//! TSN NIL — Valuation engine.
//!
//! Formula: `estimated_annual_value = 1.065^composite_score × 12`
//! where `composite_score` is the weighted sum of normalized signal scores (0–100).
//!
//! Output is an ESTIMATE ONLY — not a guaranteed NIL value, deal amount, or income.
//! All valuations are simulation-only and require legal + institution review.

use chrono::Utc;

use crate::errors::NilError;
use crate::signals::{all_nil_signals, normalize_signal_score};
use crate::types::{
    AthleteId, NilSignalScore, NilValuationBand, NilValuationInput, NilValuationResult,
};

const ESTIMATE_DISCLAIMER: &str = "\
This is an ESTIMATE only — not a guaranteed NIL value, deal, \
income, or endorsement amount. Actual NIL activity requires legal review, \
institutional approval, and compliance with applicable state law. \
No pay-for-play compensation is represented.";

/// Compute the weighted composite score (0–100) from provided signal scores.
pub fn compute_composite_score(scores: &[NilSignalScore]) -> f64 {
    let signals = all_nil_signals();
    let mut weighted_sum = 0.0_f64;
    let mut total_weight = 0.0_f64;

    for score in scores {
        if let Some(signal) = signals.iter().find(|s| s.id == score.signal_id) {
            if score.data_provided {
                let normalized = normalize_signal_score(score.raw_score);
                weighted_sum += normalized * signal.weight * score.confidence;
                total_weight += signal.weight;
            }
        }
    }

    if total_weight < f64::EPSILON {
        return 0.0;
    }

    // Scale to 0–100
    (weighted_sum / total_weight) * 100.0
}

/// Apply the NIL valuation formula.
///
/// `estimate_annual_usd = 1.065^composite × 12`
///
/// This produces a geometric growth curve: higher composite scores yield
/// exponentially higher estimates, reflecting market dynamics.
/// Output is an estimate band — not a guaranteed value.
pub fn compute_nil_valuation_estimate(composite_score: f64) -> (f64, f64) {
    let base = 1.065_f64.powf(composite_score) * 12.0;
    let low = base * 0.75;
    let high = base * 1.35;
    (low, high)
}

/// Map composite score to a valuation band.
pub fn compute_valuation_band(composite_score: f64) -> NilValuationBand {
    match composite_score as u32 {
        0..=14 => NilValuationBand::InsufficientData,
        15..=39 => NilValuationBand::Emerging,
        40..=64 => NilValuationBand::Developing,
        65..=84 => NilValuationBand::Established,
        _ => NilValuationBand::Elite,
    }
}

/// Describe the top factors contributing to the composite score.
pub fn explain_valuation_factors(scores: &[NilSignalScore]) -> Vec<String> {
    let signals = all_nil_signals();
    let mut factors: Vec<(String, f64)> = scores
        .iter()
        .filter(|s| s.data_provided && s.raw_score > 0.0)
        .filter_map(|s| {
            signals.iter().find(|sig| sig.id == s.signal_id).map(|sig| {
                let contribution = normalize_signal_score(s.raw_score) * sig.weight * s.confidence;
                (sig.name.to_string(), contribution)
            })
        })
        .collect();

    factors.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap_or(std::cmp::Ordering::Equal));

    factors
        .into_iter()
        .take(5)
        .map(|(name, score)| format!("{} (contribution: {:.4})", name, score))
        .collect()
}

/// Create a complete valuation report.
pub fn create_valuation_report(input: &NilValuationInput) -> Result<NilValuationResult, NilError> {
    let signals = all_nil_signals();
    let scored_count = input
        .signal_scores
        .iter()
        .filter(|s| s.data_provided)
        .count();

    if scored_count < 5 {
        return Err(NilError::InsufficientSignalData(scored_count as u8));
    }

    let composite = compute_composite_score(&input.signal_scores);
    let (low, high) = compute_nil_valuation_estimate(composite);
    let band = compute_valuation_band(composite);

    let missing = signals.len() as u8 - scored_count as u8;

    // Confidence is proportional to how many signals were provided
    let confidence = (scored_count as f64 / signals.len() as f64).min(1.0);

    Ok(NilValuationResult {
        athlete_id: input.athlete_id.clone(),
        composite_score: (composite * 100.0).round() / 100.0,
        estimate_low_usd: (low * 100.0).round() / 100.0,
        estimate_high_usd: (high * 100.0).round() / 100.0,
        valuation_band: band,
        confidence,
        missing_signal_count: missing,
        disclaimer: ESTIMATE_DISCLAIMER.to_string(),
        simulation_only: true,
        evaluated_at: Utc::now(),
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::types::AthleteId;

    fn make_score(id: u8, raw: f64) -> NilSignalScore {
        NilSignalScore {
            signal_id: id,
            signal_name: format!("signal_{}", id),
            raw_score: raw,
            normalized_score: normalize_signal_score(raw),
            data_provided: true,
            confidence: 1.0,
        }
    }

    #[test]
    fn composite_score_is_deterministic() {
        let scores: Vec<NilSignalScore> = (1..=10).map(|i| make_score(i, 7.0)).collect();
        let r1 = compute_composite_score(&scores);
        let r2 = compute_composite_score(&scores);
        assert!((r1 - r2).abs() < f64::EPSILON);
    }

    #[test]
    fn zero_scores_produce_insufficient_data_band() {
        let band = compute_valuation_band(5.0);
        assert_eq!(band, NilValuationBand::InsufficientData);
    }

    #[test]
    fn high_score_produces_elite_band() {
        let band = compute_valuation_band(90.0);
        assert_eq!(band, NilValuationBand::Elite);
    }

    #[test]
    fn estimate_includes_disclaimer() {
        let scores: Vec<NilSignalScore> = (1..=20).map(|i| make_score(i, 7.0)).collect();
        let input = NilValuationInput {
            athlete_id: AthleteId("test_hash".into()),
            sport: crate::types::Sport::Football,
            signal_scores: scores,
            institution_code: "INST_001".into(),
            is_minor: false,
        };
        let result = create_valuation_report(&input).unwrap();
        assert!(result.disclaimer.contains("ESTIMATE only"));
        assert!(result.disclaimer.contains("not a guaranteed NIL value"));
        assert!(result.simulation_only);
    }

    #[test]
    fn insufficient_signals_returns_error() {
        let scores: Vec<NilSignalScore> = (1..=3).map(|i| make_score(i, 7.0)).collect();
        let input = NilValuationInput {
            athlete_id: AthleteId("test_hash".into()),
            sport: crate::types::Sport::Football,
            signal_scores: scores,
            institution_code: "INST_001".into(),
            is_minor: false,
        };
        let result = create_valuation_report(&input);
        assert!(matches!(result, Err(NilError::InsufficientSignalData(_))));
    }
}
