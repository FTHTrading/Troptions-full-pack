#![allow(dead_code)]

//! TSN cryptographic primitives — Ed25519 / secp256k1 for current devnet use.
//! See tsn-pq-crypto for the quantum-resistant roadmap.

use sha2::{Digest, Sha256};

pub fn sha256_hex(data: &[u8]) -> String {
    let mut hasher = Sha256::new();
    hasher.update(data);
    hex::encode(hasher.finalize())
}

pub fn hash_evidence(evidence: &str) -> String {
    sha256_hex(evidence.as_bytes())
}
