use thiserror::Error;

/// Legacy claims system errors.
#[derive(Debug, Error)]
pub enum LegacyClaimError {
    #[error("claim not found")]
    ClaimNotFound,

    #[error("cannot verify blocked claim")]
    CannotVerifyBlockedClaim,

    #[error("insufficient evidence to verify")]
    InsufficientEvidence,

    #[error("serialization error: {0}")]
    SerializationError(#[from] serde_json::Error),
}
