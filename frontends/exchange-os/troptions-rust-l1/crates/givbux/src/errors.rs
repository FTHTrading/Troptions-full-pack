use thiserror::Error;

/// GivBux evidence system errors.
#[derive(Debug, Error)]
pub enum GivBuxError {
    #[error("claim not found")]
    ClaimNotFound,

    #[error("cannot verify blocked claim")]
    CannotVerifyBlockedClaim,

    #[error("insufficient evidence to verify")]
    InsufficientEvidence,

    #[error("serialization error: {0}")]
    SerializationError(#[from] serde_json::Error),
}
