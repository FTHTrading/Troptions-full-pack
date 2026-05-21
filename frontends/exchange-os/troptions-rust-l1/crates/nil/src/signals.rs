#![allow(dead_code)]

//! TSN NIL — 33-Signal Protocol.
//!
//! The NIL33 signal model uses exactly 33 deterministic signals across 6 buckets
//! to compute a composite NIL score. Weights sum to 1.0.
//!
//! Scoring is deterministic given the same inputs — no randomness.

use crate::errors::NilError;
use crate::types::{NilSignal, NilSignalBucket, NilSignalScore};

/// All 33 NIL signals. Weights sum to 1.0.
pub fn all_nil_signals() -> &'static [NilSignal] {
    &SIGNALS
}

/// Return all signals in a specific bucket.
pub fn signals_by_bucket(bucket: &NilSignalBucket) -> Vec<&'static NilSignal> {
    SIGNALS.iter().filter(|s| &s.bucket == bucket).collect()
}

/// Validate that provided scores correspond to real signal IDs and values 0–10.
pub fn validate_signal_scores(scores: &[NilSignalScore]) -> Result<(), NilError> {
    for s in scores {
        if s.signal_id < 1 || s.signal_id > 33 {
            return Err(NilError::InvalidSignalScore(s.signal_id, s.raw_score));
        }
        if s.raw_score < 0.0 || s.raw_score > 10.0 {
            return Err(NilError::InvalidSignalScore(s.signal_id, s.raw_score));
        }
    }
    Ok(())
}

/// Normalize a raw score (0–10) to a 0.0–1.0 value.
pub fn normalize_signal_score(raw: f64) -> f64 {
    (raw.clamp(0.0, 10.0)) / 10.0
}

// ─── Static signal definitions ────────────────────────────────────────────────

static SIGNALS: [NilSignal; 33] = [
    // ── Bucket 1: Identity and Verification (6 signals) ──────────────────────
    NilSignal {
        id: 1,
        name: "identity_hash_verified",
        bucket: NilSignalBucket::IdentityAndVerification,
        description: "Athlete identity record exists and SHA-256 hash is verifiable on devnet.",
        weight: 0.025,
        requires_verification: true,
        minor_sensitive: false,
        public_display_allowed: true,
        compliance_notes: "Base eligibility signal. Required for any NIL simulation.",
    },
    NilSignal {
        id: 2,
        name: "ncaa_eligibility_confirmed",
        bucket: NilSignalBucket::IdentityAndVerification,
        description: "NCAA or applicable governing body eligibility status on file.",
        weight: 0.03,
        requires_verification: true,
        minor_sensitive: false,
        public_display_allowed: true,
        compliance_notes: "Institutional verification required. Not implied by this module.",
    },
    NilSignal {
        id: 3,
        name: "institution_enrollment_verified",
        bucket: NilSignalBucket::IdentityAndVerification,
        description: "Active enrollment at an NCAA/NAIA/JUCO institution verified.",
        weight: 0.03,
        requires_verification: true,
        minor_sensitive: false,
        public_display_allowed: true,
        compliance_notes: "School approval may be required for public disclosure.",
    },
    NilSignal {
        id: 4,
        name: "agent_registration_verified",
        bucket: NilSignalBucket::IdentityAndVerification,
        description: "NIL agent or representative registration status verified (where applicable).",
        weight: 0.02,
        requires_verification: true,
        minor_sensitive: false,
        public_display_allowed: true,
        compliance_notes: "Agent rules vary by state and institution.",
    },
    NilSignal {
        id: 5,
        name: "guardian_consent_on_file",
        bucket: NilSignalBucket::IdentityAndVerification,
        description: "Guardian consent record on file for minors (hash reference only).",
        weight: 0.03,
        requires_verification: true,
        minor_sensitive: true,
        public_display_allowed: false,
        compliance_notes: "Required for all minors. Hash reference only — no PII on-chain.",
    },
    NilSignal {
        id: 6,
        name: "disclosure_agreement_hash",
        bucket: NilSignalBucket::IdentityAndVerification,
        description: "Disclosure agreement hash recorded — raw document stays off-chain.",
        weight: 0.02,
        requires_verification: true,
        minor_sensitive: false,
        public_display_allowed: true,
        compliance_notes: "Hash only. Full document must be retained by institution/agent.",
    },
    // ── Bucket 2: Performance Proof (7 signals) ───────────────────────────────
    NilSignal {
        id: 7,
        name: "sport_performance_tier",
        bucket: NilSignalBucket::PerformanceProof,
        description: "Athletic performance tier based on verified statistics (D1/D2/D3/NAIA).",
        weight: 0.05,
        requires_verification: true,
        minor_sensitive: false,
        public_display_allowed: true,
        compliance_notes: "Tier based on public record stats only.",
    },
    NilSignal {
        id: 8,
        name: "awards_and_recognition_count",
        bucket: NilSignalBucket::PerformanceProof,
        description: "Count of verifiable awards, honors, or conference recognitions.",
        weight: 0.04,
        requires_verification: true,
        minor_sensitive: false,
        public_display_allowed: true,
        compliance_notes: "Public record only. No private coaching evaluations.",
    },
    NilSignal {
        id: 9,
        name: "media_mention_count",
        bucket: NilSignalBucket::PerformanceProof,
        description: "Count of attributable public media mentions (news, sports coverage).",
        weight: 0.03,
        requires_verification: false,
        minor_sensitive: false,
        public_display_allowed: true,
        compliance_notes: "Public record only.",
    },
    NilSignal {
        id: 10,
        name: "professional_prospect_ranking",
        bucket: NilSignalBucket::PerformanceProof,
        description: "Presence and tier on a public recruiting/prospect list.",
        weight: 0.04,
        requires_verification: false,
        minor_sensitive: false,
        public_display_allowed: true,
        compliance_notes: "Public recruiting rankings only — not private scouting reports.",
    },
    NilSignal {
        id: 11,
        name: "verified_highlight_content",
        bucket: NilSignalBucket::PerformanceProof,
        description: "Publicly-available verified highlight or game film content.",
        weight: 0.03,
        requires_verification: false,
        minor_sensitive: false,
        public_display_allowed: true,
        compliance_notes: "Public content only.",
    },
    NilSignal {
        id: 12,
        name: "career_stats_completeness",
        bucket: NilSignalBucket::PerformanceProof,
        description: "Completeness of verified career statistics on record.",
        weight: 0.03,
        requires_verification: true,
        minor_sensitive: false,
        public_display_allowed: true,
        compliance_notes: "From official or public stats sources.",
    },
    NilSignal {
        id: 13,
        name: "team_contribution_score",
        bucket: NilSignalBucket::PerformanceProof,
        description: "Estimated team contribution score based on public game data.",
        weight: 0.03,
        requires_verification: false,
        minor_sensitive: false,
        public_display_allowed: true,
        compliance_notes: "Estimate only. Not an official performance evaluation.",
    },
    // ── Bucket 3: Recruiting and Exposure (5 signals) ─────────────────────────
    NilSignal {
        id: 14,
        name: "recruiting_class_rank",
        bucket: NilSignalBucket::RecruitingAndExposure,
        description: "Public recruiting class ranking tier.",
        weight: 0.035,
        requires_verification: false,
        minor_sensitive: true,
        public_display_allowed: true,
        compliance_notes: "Public recruiting data only. Minor-sensitive — age verified before use.",
    },
    NilSignal {
        id: 15,
        name: "national_exposure_events",
        bucket: NilSignalBucket::RecruitingAndExposure,
        description: "Count of national exposure events (combines, showcases, all-star games).",
        weight: 0.03,
        requires_verification: false,
        minor_sensitive: false,
        public_display_allowed: true,
        compliance_notes: "Public event records only.",
    },
    NilSignal {
        id: 16,
        name: "geographic_market_reach",
        bucket: NilSignalBucket::RecruitingAndExposure,
        description:
            "Geographic market reach score based on institutional location and media coverage.",
        weight: 0.03,
        requires_verification: false,
        minor_sensitive: false,
        public_display_allowed: true,
        compliance_notes: "Estimate only.",
    },
    NilSignal {
        id: 17,
        name: "transfer_portal_activity",
        bucket: NilSignalBucket::RecruitingAndExposure,
        description: "Transfer portal entry presence and interest level (if applicable).",
        weight: 0.02,
        requires_verification: false,
        minor_sensitive: false,
        public_display_allowed: true,
        compliance_notes:
            "Public transfer portal data only. Not applicable to high school athletes.",
    },
    NilSignal {
        id: 18,
        name: "camp_and_clinic_participation",
        bucket: NilSignalBucket::RecruitingAndExposure,
        description: "Participation in verified camps, clinics, or coaching events.",
        weight: 0.02,
        requires_verification: false,
        minor_sensitive: false,
        public_display_allowed: true,
        compliance_notes: "Public event data only.",
    },
    // ── Bucket 4: Market and Reach (7 signals) ────────────────────────────────
    NilSignal {
        id: 19,
        name: "social_media_following",
        bucket: NilSignalBucket::MarketAndReach,
        description: "Verified combined social media following count.",
        weight: 0.04,
        requires_verification: false,
        minor_sensitive: false,
        public_display_allowed: true,
        compliance_notes: "Public follower data only. Athlete must have provided consent to use.",
    },
    NilSignal {
        id: 20,
        name: "engagement_rate",
        bucket: NilSignalBucket::MarketAndReach,
        description: "Average engagement rate across verified public social accounts.",
        weight: 0.04,
        requires_verification: false,
        minor_sensitive: false,
        public_display_allowed: true,
        compliance_notes: "Calculated from public data only.",
    },
    NilSignal {
        id: 21,
        name: "brand_fit_score",
        bucket: NilSignalBucket::MarketAndReach,
        description: "Estimated brand fit score based on sport, content, and public persona.",
        weight: 0.04,
        requires_verification: false,
        minor_sensitive: false,
        public_display_allowed: true,
        compliance_notes: "Estimate only. Not a guarantee of brand interest or deal value.",
    },
    NilSignal {
        id: 22,
        name: "local_market_index",
        bucket: NilSignalBucket::MarketAndReach,
        description: "Local market attractiveness index based on institution location and DMA.",
        weight: 0.03,
        requires_verification: false,
        minor_sensitive: false,
        public_display_allowed: true,
        compliance_notes: "Estimate only.",
    },
    NilSignal {
        id: 23,
        name: "institutional_brand_strength",
        bucket: NilSignalBucket::MarketAndReach,
        description: "Institutional brand strength score (school media reach, program tier).",
        weight: 0.03,
        requires_verification: false,
        minor_sensitive: false,
        public_display_allowed: true,
        compliance_notes: "Based on public institutional data.",
    },
    NilSignal {
        id: 24,
        name: "prior_nil_deal_count",
        bucket: NilSignalBucket::MarketAndReach,
        description: "Count of prior verified NIL deals on record (devnet simulation).",
        weight: 0.02,
        requires_verification: true,
        minor_sensitive: false,
        public_display_allowed: true,
        compliance_notes: "Count only — no deal terms on-chain.",
    },
    NilSignal {
        id: 25,
        name: "cross_platform_content_count",
        bucket: NilSignalBucket::MarketAndReach,
        description: "Count of verified public cross-platform content pieces.",
        weight: 0.02,
        requires_verification: false,
        minor_sensitive: false,
        public_display_allowed: true,
        compliance_notes: "Public content only.",
    },
    // ── Bucket 5: Compliance and Eligibility (5 signals) ─────────────────────
    NilSignal {
        id: 26,
        name: "state_nil_law_compliance",
        bucket: NilSignalBucket::ComplianceAndEligibility,
        description: "State NIL law compliance status — needs_review if state unknown.",
        weight: 0.04,
        requires_verification: true,
        minor_sensitive: false,
        public_display_allowed: true,
        compliance_notes: "Unknown state = needs_review. Not a legal opinion.",
    },
    NilSignal {
        id: 27,
        name: "institution_nil_policy_compliance",
        bucket: NilSignalBucket::ComplianceAndEligibility,
        description: "Institution NIL policy compliance — needs_review if institution unknown.",
        weight: 0.04,
        requires_verification: true,
        minor_sensitive: false,
        public_display_allowed: true,
        compliance_notes: "Unknown institution = needs_review. Not a legal opinion.",
    },
    NilSignal {
        id: 28,
        name: "amateurism_status_clear",
        bucket: NilSignalBucket::ComplianceAndEligibility,
        description: "No amateurism status issues on record.",
        weight: 0.03,
        requires_verification: true,
        minor_sensitive: false,
        public_display_allowed: true,
        compliance_notes: "Verified against public eligibility records only.",
    },
    NilSignal {
        id: 29,
        name: "restricted_category_cleared",
        bucket: NilSignalBucket::ComplianceAndEligibility,
        description: "No restricted category conflicts detected in deal parameters.",
        weight: 0.03,
        requires_verification: true,
        minor_sensitive: false,
        public_display_allowed: true,
        compliance_notes: "Alcohol, tobacco, gambling, adult content, and pay-for-play blocked.",
    },
    NilSignal {
        id: 30,
        name: "control_hub_approval_status",
        bucket: NilSignalBucket::ComplianceAndEligibility,
        description: "Control Hub review and approval status for this athlete record.",
        weight: 0.03,
        requires_verification: true,
        minor_sensitive: false,
        public_display_allowed: true,
        compliance_notes: "All live production NIL requires Control Hub approval.",
    },
    // ── Bucket 6: Deal Execution (3 signals) ─────────────────────────────────
    NilSignal {
        id: 31,
        name: "deal_template_completeness",
        bucket: NilSignalBucket::DealExecution,
        description: "Completeness of unsigned NIL deal template on devnet.",
        weight: 0.03,
        requires_verification: false,
        minor_sensitive: false,
        public_display_allowed: true,
        compliance_notes: "Template only — no live deal settlement.",
    },
    NilSignal {
        id: 32,
        name: "proof_vault_records_count",
        bucket: NilSignalBucket::DealExecution,
        description: "Count of proof vault document hash records on file.",
        weight: 0.02,
        requires_verification: false,
        minor_sensitive: false,
        public_display_allowed: true,
        compliance_notes: "Hash references only — no private documents on-chain.",
    },
    NilSignal {
        id: 33,
        name: "web3_anchor_template_ready",
        bucket: NilSignalBucket::DealExecution,
        description: "Web3 receipt anchor template generated and ready for institution review.",
        weight: 0.02,
        requires_verification: false,
        minor_sensitive: false,
        public_display_allowed: true,
        compliance_notes: "Unsigned template only — no live on-chain submission.",
    },
];

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn exactly_33_signals_defined() {
        assert_eq!(all_nil_signals().len(), 33);
    }

    #[test]
    fn signal_weights_sum_to_one() {
        let total: f64 = all_nil_signals().iter().map(|s| s.weight).sum();
        let diff = (total - 1.0_f64).abs();
        assert!(diff < 0.001, "weights sum {:.4} expected ~1.0", total);
    }

    #[test]
    fn signal_ids_are_unique_and_sequential() {
        let signals = all_nil_signals();
        for (i, s) in signals.iter().enumerate() {
            assert_eq!(s.id as usize, i + 1, "signal {} out of order", s.id);
        }
    }

    #[test]
    fn normalize_clamps_out_of_range() {
        assert_eq!(normalize_signal_score(-5.0), 0.0);
        assert_eq!(normalize_signal_score(15.0), 1.0);
        assert!((normalize_signal_score(5.0) - 0.5).abs() < f64::EPSILON);
    }

    #[test]
    fn six_buckets_all_have_signals() {
        let buckets = [
            NilSignalBucket::IdentityAndVerification,
            NilSignalBucket::PerformanceProof,
            NilSignalBucket::RecruitingAndExposure,
            NilSignalBucket::MarketAndReach,
            NilSignalBucket::ComplianceAndEligibility,
            NilSignalBucket::DealExecution,
        ];
        for b in &buckets {
            let count = signals_by_bucket(b).len();
            assert!(count > 0, "bucket {:?} has no signals", b);
        }
    }
}
