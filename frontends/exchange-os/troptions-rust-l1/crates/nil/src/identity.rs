#![allow(dead_code)]

//! TSN NIL — Athlete identity hashing.
//!
//! Identity records use SHA-256 hashes of canonical JSON payloads.
//! No private athlete data (name, DOB, SSN, guardian PII) is stored on-chain.
//! Ed25519 signing is an unsigned template in devnet — no private key handling.

use chrono::Utc;
use serde_json::json;
use uuid::Uuid;

use crate::errors::NilError;
use crate::types::{AthleteId, AthleteIdentityRecord, AthleteProfile, MinorConsentStatus};

/// Create the canonical JSON payload for athlete identity hashing.
///
/// The payload includes only pseudonymous fields — no name, DOB, or guardian PII.
/// Fields are sorted alphabetically for deterministic serialization.
pub fn create_canonical_athlete_payload(profile: &AthleteProfile) -> Result<String, NilError> {
    let payload = json!({
        "graduation_band": profile.graduation_band,
        "institution_code": profile.institution_code,
        "is_minor": profile.is_minor,
        "sport": serde_json::to_value(&profile.sport)
            .map_err(|e| NilError::SerializationError(e.to_string()))?,
        "sport_vertical": serde_json::to_value(&profile.sport_vertical)
            .map_err(|e| NilError::SerializationError(e.to_string()))?,
    });

    serde_json::to_string(&payload).map_err(|e| NilError::SerializationError(e.to_string()))
}

/// Hash an athlete identity payload using SHA-256.
///
/// Returns a hex-encoded hash string.
/// Input is the canonical JSON payload from `create_canonical_athlete_payload`.
pub fn hash_athlete_identity(canonical_payload: &str) -> String {
    tsn_crypto::sha256_hex(canonical_payload.as_bytes())
}

/// Create an on-chain identity record for an athlete.
///
/// The record contains only the identity hash and pseudonymous metadata —
/// no raw PII is stored.
pub fn create_identity_record(
    profile: &AthleteProfile,
    consent_status: MinorConsentStatus,
) -> Result<AthleteIdentityRecord, NilError> {
    let canonical = create_canonical_athlete_payload(profile)?;
    let identity_hash = hash_athlete_identity(&canonical);

    // Minor check — consent must be provided before creating a public record.
    if profile.is_minor {
        match &consent_status {
            MinorConsentStatus::Approved => {}
            _ => {
                return Err(NilError::MinorConsentRequired);
            }
        }
    }

    Ok(AthleteIdentityRecord {
        record_id: Uuid::new_v4(),
        athlete_id: profile.athlete_id.clone(),
        identity_hash,
        // Unsigned in devnet — Ed25519 signing requires Control Hub approval + legal review.
        signature_hex: None,
        sport: profile.sport.clone(),
        institution_code: profile.institution_code.clone(),
        minor_consent_status: consent_status,
        simulation_only: true,
        registered_at: Utc::now(),
    })
}

/// Verify that an identity record's hash matches a rebuilt canonical payload.
///
/// Returns `true` if the hash matches, `false` otherwise.
/// Does not verify signatures in devnet — signing is disabled.
pub fn verify_identity_record(
    record: &AthleteIdentityRecord,
    profile: &AthleteProfile,
) -> Result<bool, NilError> {
    let canonical = create_canonical_athlete_payload(profile)?;
    let expected_hash = hash_athlete_identity(&canonical);
    Ok(record.identity_hash == expected_hash)
}

/// Derive an `AthleteId` from a canonical payload string.
///
/// The athlete ID is the SHA-256 hash of the canonical payload, hex-encoded.
pub fn derive_athlete_id(canonical_payload: &str) -> AthleteId {
    AthleteId(hash_athlete_identity(canonical_payload))
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::types::{AthleteProfile, Sport, SportVertical};
    use chrono::Utc;

    fn make_profile(is_minor: bool) -> AthleteProfile {
        AthleteProfile {
            athlete_id: AthleteId("test_id".into()),
            sport: Sport::Football,
            sport_vertical: SportVertical::TeamSport,
            institution_code: "UNIV_001".into(),
            graduation_band: "2025-2027".into(),
            is_minor,
            simulation_only: true,
            created_at: Utc::now(),
        }
    }

    #[test]
    fn hash_is_deterministic() {
        let profile = make_profile(false);
        let p1 = create_canonical_athlete_payload(&profile).unwrap();
        let p2 = create_canonical_athlete_payload(&profile).unwrap();
        assert_eq!(hash_athlete_identity(&p1), hash_athlete_identity(&p2));
    }

    #[test]
    fn identity_record_created_for_adult() {
        let profile = make_profile(false);
        let record = create_identity_record(&profile, MinorConsentStatus::NotApplicable).unwrap();
        assert!(record.simulation_only);
        assert!(record.signature_hex.is_none());
        assert!(!record.identity_hash.is_empty());
    }

    #[test]
    fn minor_without_consent_blocked() {
        let profile = make_profile(true);
        let result = create_identity_record(&profile, MinorConsentStatus::PendingGuardianReview);
        assert!(matches!(result, Err(NilError::MinorConsentRequired)));
    }

    #[test]
    fn minor_with_approval_succeeds() {
        let profile = make_profile(true);
        let record = create_identity_record(&profile, MinorConsentStatus::Approved).unwrap();
        assert_eq!(record.minor_consent_status, MinorConsentStatus::Approved);
    }

    #[test]
    fn verify_record_returns_true_for_matching_profile() {
        let profile = make_profile(false);
        let record = create_identity_record(&profile, MinorConsentStatus::NotApplicable).unwrap();
        let valid = verify_identity_record(&record, &profile).unwrap();
        assert!(valid);
    }
}
