//! On-chain multisig verification for treasury and high-value transfers.

use crypto::verify_signature;
use primitives::{AccountId, Amount, Signature};
use sha2::{Digest, Sha256};

pub const MIN_TREASURY_APPROVAL_AMOUNT: Amount = 1000;
pub const DEFAULT_MULTISIG_THRESHOLD: u32 = 2;

#[derive(Debug, Clone, thiserror::Error)]
pub enum MultisigError {
    #[error("insufficient signatures: got {got}, need {need}")]
    InsufficientSignatures { got: usize, need: u32 },
    #[error("duplicate signer")]
    DuplicateSigner,
    #[error("unauthorized signer")]
    UnauthorizedSigner,
    #[error("invalid signature")]
    InvalidSignature,
    #[error("amount below multisig threshold")]
    BelowThreshold,
}

/// Ed25519 multisig payload for treasury debits.
pub fn treasury_debit_message(
    treasury_key: &str,
    to: &AccountId,
    amount: Amount,
    nonce: u64,
) -> Vec<u8> {
    let mut data = Vec::new();
    data.extend_from_slice(b"TREASURY_DEBIT_V1");
    data.extend_from_slice(treasury_key.as_bytes());
    data.extend_from_slice(to.as_bytes());
    data.extend_from_slice(&amount.to_le_bytes());
    data.extend_from_slice(&nonce.to_le_bytes());
    data
}

/// Verify threshold Ed25519 signatures from authorized council members.
pub fn verify_threshold_signatures(
    message: &[u8],
    signatures: &[(AccountId, Signature)],
    authorized_signers: &[AccountId],
    threshold: u32,
) -> Result<(), MultisigError> {
    if signatures.len() < threshold as usize {
        return Err(MultisigError::InsufficientSignatures {
            got: signatures.len(),
            need: threshold,
        });
    }

    let mut seen = std::collections::HashSet::new();
    let mut valid = 0u32;

    for (signer, sig) in signatures {
        if !seen.insert(*signer) {
            return Err(MultisigError::DuplicateSigner);
        }
        if !authorized_signers.contains(signer) {
            return Err(MultisigError::UnauthorizedSigner);
        }
        verify_signature(message, sig, signer).map_err(|_| MultisigError::InvalidSignature)?;
        valid += 1;
        if valid >= threshold {
            return Ok(());
        }
    }

    Err(MultisigError::InsufficientSignatures {
        got: valid as usize,
        need: threshold,
    })
}

/// Derive deterministic treasury council member IDs from seeds (genesis config).
pub fn default_council_members() -> Vec<AccountId> {
    (0..3)
        .map(|i| {
            let seed = format!("TROPTIONS_TREASURY_COUNCIL_{}", i);
            let hash = Sha256::digest(seed.as_bytes());
            let mut bytes = [0u8; 32];
            bytes.copy_from_slice(&hash);
            AccountId::new(bytes)
        })
        .collect()
}

pub fn requires_multisig(amount: Amount) -> bool {
    amount > MIN_TREASURY_APPROVAL_AMOUNT
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_requires_multisig() {
        assert!(!requires_multisig(500));
        assert!(requires_multisig(1001));
    }
}
