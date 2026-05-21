use thiserror::Error;

/// Namespace system errors.
#[derive(Debug, Error)]
pub enum NamespaceError {
    #[error("namespace not found: {0}")]
    NamespaceNotFound(String),

    #[error("namespace already exists: {0}")]
    NamespaceAlreadyExists(String),

    #[error("namespace is blocked: {0}")]
    NamespaceBlocked(String),

    #[error("namespace requires evidence: {0}")]
    NamespaceRequiresEvidence(String),

    #[error("invalid namespace status: {0}")]
    InvalidStatus(String),

    #[error("insufficient evidence to activate: {0}")]
    InsufficientEvidence(String),

    #[error("serialization error: {0}")]
    SerializationError(#[from] serde_json::Error),
}
