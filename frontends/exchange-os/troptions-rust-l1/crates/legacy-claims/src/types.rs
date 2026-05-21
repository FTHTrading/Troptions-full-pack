use serde::{Deserialize, Serialize};

/// Status of a legacy claim under review.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum LegacyClaimStatus {
    Draft,
    NeedsEvidence,
    UnderReview,
    Verified,
    Blocked,
    Retired,
}
