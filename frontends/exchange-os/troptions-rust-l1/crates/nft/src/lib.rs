#![allow(dead_code)]

use chrono::Utc;
use tsn_state::{AuditEvent, AuditEventType, NftCredential, NftCredentialType};
use uuid::Uuid;

pub fn issue_nft_credential_simulation(
    credential_type: NftCredentialType,
    holder_id: Uuid,
    issuer_id: Uuid,
    metadata_hash: &str,
    expires_at: Option<chrono::DateTime<chrono::Utc>>,
) -> (NftCredential, AuditEvent) {
    let credential = NftCredential {
        credential_id: Uuid::new_v4(),
        credential_type: credential_type.clone(),
        holder_id,
        issuer_id,
        metadata_hash: metadata_hash.to_string(),
        issued_at: Utc::now(),
        expires_at,
        simulation_only: true,
    };

    let audit_event = AuditEvent::new(
        AuditEventType::NftIssued,
        "tsn_nft_runtime",
        &format!("NFT credential issued (simulation): {:?}", credential_type),
        serde_json::json!({
            "credential_id": credential.credential_id.to_string(),
            "holder_id": holder_id.to_string(),
            "metadata_hash": metadata_hash,
            "simulation_only": true,
        }),
    );

    (credential, audit_event)
}
