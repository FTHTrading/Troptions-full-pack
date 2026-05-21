use thiserror::Error;

/// Media system errors.
#[derive(Debug, Error)]
pub enum MediaError {
    #[error("episode not found")]
    EpisodeNotFound,

    #[error("publish blocked: missing guest release")]
    PublishBlockedMissingRelease,

    #[error("publish blocked: missing sponsor agreement")]
    PublishBlockedMissingSponsorship,

    #[error("invalid episode status")]
    InvalidStatus,

    #[error("serialization error: {0}")]
    SerializationError(#[from] serde_json::Error),
}
