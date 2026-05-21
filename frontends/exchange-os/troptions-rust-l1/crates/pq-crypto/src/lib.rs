#![allow(dead_code)]

//! TSN Post-Quantum Cryptography roadmap types.
//! Aligned to NIST FIPS 203 (ML-KEM), FIPS 204 (ML-DSA), FIPS 205 (SLH-DSA).
//!
//! IMPORTANT: This crate contains TYPE DEFINITIONS and ROADMAP STRUCTURES only.
//! It does NOT implement production post-quantum cryptographic operations.
//! Production PQ crypto requires an audited library (e.g., pqcrypto, oqs-rust).

use chrono::Utc;
pub use tsn_state::{
    QuantumKemScheme, QuantumKeyProfile, QuantumMigrationStatus, QuantumSignatureScheme,
};

pub fn classic_only_profile(address: &str, classic_public_key: &str) -> QuantumKeyProfile {
    QuantumKeyProfile {
        address: address.to_string(),
        migration_status: QuantumMigrationStatus::ClassicOnly,
        classic_public_key: classic_public_key.to_string(),
        pq_signature_scheme: None,
        pq_kem_scheme: None,
        pq_public_key_placeholder: None,
        nist_fips_reference: "Ed25519 (classic) — see FIPS 204 for ML-DSA migration".to_string(),
        migrated_at: None,
    }
}

pub fn hybrid_profile(address: &str, classic_public_key: &str) -> QuantumKeyProfile {
    QuantumKeyProfile {
        address: address.to_string(),
        migration_status: QuantumMigrationStatus::HybridTransition,
        classic_public_key: classic_public_key.to_string(),
        pq_signature_scheme: Some(QuantumSignatureScheme::HybridEd25519MlDsa),
        pq_kem_scheme: Some(QuantumKemScheme::HybridX25519MlKem),
        pq_public_key_placeholder: Some("PLACEHOLDER_ML_DSA_KEY_NOT_FOR_PRODUCTION".to_string()),
        nist_fips_reference: "NIST FIPS 204 (ML-DSA) + FIPS 203 (ML-KEM) hybrid transition"
            .to_string(),
        migrated_at: Some(Utc::now()),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn quantum_key_profile_classic_only_serializes() {
        let profile = classic_only_profile("tsn1test", "ed25519_pubkey_hex_placeholder");
        let json = serde_json::to_string(&profile).unwrap();
        assert!(json.contains("classic_only"));
        assert!(json.contains("tsn1test"));
    }

    #[test]
    fn quantum_key_profile_hybrid_serializes() {
        let profile = hybrid_profile("tsn1test", "ed25519_pubkey_hex_placeholder");
        let json = serde_json::to_string(&profile).unwrap();
        assert!(json.contains("hybrid_transition"));
        assert!(json.contains("hybrid_ed25519_ml_dsa"));
    }
}
