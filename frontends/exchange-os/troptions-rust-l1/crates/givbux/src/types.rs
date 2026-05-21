use serde::{Deserialize, Serialize};

/// GivBux claim type.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum GivBuxClaimType {
    MerchantCount,
    PaymentRail,
    AppIntegration,
    CharityDonation,
    InvitationCode,
    IncomeGuarantee,
    CompensationPlan,
    CustomerRewards,
    TroptionsPayAcceptance,
    GivBuxRelationship,
}

/// Claim status in evidence system.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ClaimStatus {
    Draft,
    NeedsEvidence,
    UnderReview,
    Verified,
    Blocked,
    Retired,
}
