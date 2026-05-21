#![allow(dead_code)]

//! TSN NIL — Error types.

use thiserror::Error;

#[derive(Debug, Error)]
pub enum NilError {
    #[error("Invalid athlete ID: {0}")]
    InvalidAthleteId(String),

    #[error("Pay-for-play detected: {0}")]
    PayForPlayBlocked(String),

    #[error("Recruiting inducement detected: {0}")]
    RecruitingInducementBlocked(String),

    #[error("Minor consent required: guardian review not completed")]
    MinorConsentRequired,

    #[error("Insufficient signal data: {0} of 33 signals scored")]
    InsufficientSignalData(u8),

    #[error("Invalid signal score: signal {0} score {1} out of range 0.0–10.0")]
    InvalidSignalScore(u8, f64),

    #[error("Compliance blocked: {0}")]
    ComplianceBlocked(String),

    #[error("State rule not found: {0}")]
    StateRuleNotFound(String),

    #[error("Serialization error: {0}")]
    SerializationError(String),

    #[error("Hash computation error: {0}")]
    HashError(String),

    #[error("Live execution is disabled in this module")]
    LiveExecutionDisabled,

    #[error("Live payment is disabled in this module")]
    LivePaymentDisabled,

    #[error("Live NFT minting is disabled in this module")]
    LiveNftMintDisabled,

    #[error("Live Web3 anchoring is disabled in this module")]
    LiveWeb3AnchorDisabled,
}
