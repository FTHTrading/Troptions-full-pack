//! Cryptographic primitives for TROPTIONS L1.
//! Handles Ed25519 signatures, key generation, and verification.

use ed25519_dalek::{Signer, SigningKey, Verifier, VerifyingKey};
use primitives::{AccountId, PrimitiveError, Signature};
use sha2::{Digest, Sha256};

/// Generate a new Ed25519 keypair.
pub fn generate_keypair() -> (AccountId, Vec<u8>) {
    use rand::rngs::OsRng;
    let mut csprng = OsRng;
    let signing_key = SigningKey::generate(&mut csprng);
    let verifying_key = signing_key.verifying_key();
    let public_key_bytes = verifying_key.to_bytes();
    let account_id = AccountId::new(public_key_bytes);
    let secret_key = signing_key.to_bytes().to_vec();
    (account_id, secret_key)
}

/// Sign a message with a secret key.
pub fn sign_message(message: &[u8], secret_key: &[u8]) -> Result<Signature, PrimitiveError> {
    let signing_key = SigningKey::from_bytes(&secret_key.try_into().map_err(|_| PrimitiveError::InvalidSignature)?);
    let signature = signing_key.sign(message);
    Ok(Signature::new(signature.to_bytes()))
}

/// Verify a signature against a public key (AccountId).
pub fn verify_signature(
    message: &[u8],
    signature: &Signature,
    account_id: &AccountId,
) -> Result<(), PrimitiveError> {
    let public_key_bytes = account_id.as_bytes();
    let verifying_key = VerifyingKey::from_bytes(public_key_bytes)
        .map_err(|_| PrimitiveError::InvalidSignature)?;
    let sig = ed25519_dalek::Signature::from_bytes(signature.as_bytes());
    verifying_key
        .verify(message, &sig)
        .map_err(|_| PrimitiveError::InvalidSignature)
}

/// Sign serialized transaction operations for L1 submit.
pub fn sign_transaction_ops(
    operations: &[u8],
    secret_key: &[u8],
) -> Result<Signature, PrimitiveError> {
    sign_message(operations, secret_key)
}

/// Hash data using SHA-256.
pub fn sha256_hash(data: &[u8]) -> [u8; 32] {
    let hash = Sha256::digest(data);
    let mut result = [0u8; 32];
    result.copy_from_slice(&hash);
    result
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_keypair_generation_and_signing() {
        let (account_id, secret_key) = generate_keypair();
        let message = b"test message for signing";
        
        let signature = sign_message(message, &secret_key).unwrap();
        let result = verify_signature(message, &signature, &account_id);
        assert!(result.is_ok());
    }

    #[test]
    fn test_signature_verification_fails_for_wrong_key() {
        let (account_id, _secret_key) = generate_keypair();
        let (_account_id2, secret_key2) = generate_keypair();
        
        let message = b"test message";
        let signature = sign_message(message, &secret_key2).unwrap();
        
        // Verify with wrong public key should fail
        let result = verify_signature(message, &signature, &account_id);
        assert!(result.is_err());
    }
}
