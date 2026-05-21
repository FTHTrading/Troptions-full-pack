#![allow(dead_code)]

//! TSN NIL — Proof vault and Web3 anchoring.
//!
//! The proof vault stores SHA-256 hashes of NIL-related documents.
//! Documents themselves remain off-chain — only hash references are stored.
//! Web3 anchoring (XRPL, Stellar, Polygon) is a template only — no live submission.
//! Merkle root computation is deterministic for a given ordered document list.

use chrono::Utc;
use sha2::{Digest, Sha256};
use uuid::Uuid;

use crate::errors::NilError;
use crate::types::{AthleteId, ProofVaultRecord, Web3ReceiptTemplate};

const PROOF_DISCLAIMER: &str = "\
This proof vault record stores cryptographic hash references only. \
No private documents, personal data, or deal terms are stored on-chain. \
Web3 anchor templates are unsigned and devnet-only — no live XRPL, Stellar, \
or Polygon submission is enabled. All production anchoring requires legal review \
and Control Hub authorization.";

/// Create a proof vault record for an off-chain document.
///
/// Only the SHA-256 hash of the document is stored on-chain.
/// The full document must be retained by the institution, agent, or legal counsel.
pub fn create_proof_vault_record(
    athlete_id: AthleteId,
    document_type: &str,
    document_hash: &str,
    ipfs_cid: Option<String>,
) -> ProofVaultRecord {
    ProofVaultRecord {
        record_id: Uuid::new_v4(),
        athlete_id,
        document_type: document_type.to_string(),
        document_hash: document_hash.to_string(),
        ipfs_cid,
        merkle_root: None,
        simulation_only: true,
        recorded_at: Utc::now(),
    }
}

/// Hash a document using SHA-256, returning a hex-encoded string.
///
/// The document content is never stored — only the hash is returned.
pub fn hash_proof_document(document_content: &str) -> String {
    tsn_crypto::sha256_hex(document_content.as_bytes())
}

/// Compute a Merkle root from an ordered list of document hashes.
///
/// Uses a simplified binary Merkle tree: pairs of hashes are concatenated
/// and re-hashed up to the root. Single-element trees return the element itself.
/// This is deterministic for the same ordered input.
pub fn create_merkle_root(document_hashes: &[String]) -> Result<String, NilError> {
    if document_hashes.is_empty() {
        return Err(NilError::HashError(
            "Cannot compute Merkle root of empty set".into(),
        ));
    }
    if document_hashes.len() == 1 {
        return Ok(document_hashes[0].clone());
    }

    let mut layer: Vec<String> = document_hashes.to_vec();

    while layer.len() > 1 {
        // Pad with last element if odd count
        if layer.len() % 2 != 0 {
            let last = layer.last().unwrap().clone();
            layer.push(last);
        }

        let next_layer: Vec<String> = layer
            .chunks(2)
            .map(|pair| {
                let mut hasher = Sha256::new();
                hasher.update(pair[0].as_bytes());
                hasher.update(pair[1].as_bytes());
                hex::encode(hasher.finalize())
            })
            .collect();

        layer = next_layer;
    }

    Ok(layer.into_iter().next().unwrap())
}

/// Create a Web3 anchor template for a proof vault set.
///
/// Supports XRPL, Stellar, and Polygon chain targets.
/// Template is unsigned and not submitted in devnet.
pub fn create_web3_anchor_template(
    athlete_id: &AthleteId,
    deal_hash: &str,
    proof_merkle_root: Option<String>,
    ipfs_cid: Option<String>,
    chain_target: &str,
) -> Web3ReceiptTemplate {
    let valid_chains = ["xrpl", "stellar", "polygon", "devnet"];
    let chain = if valid_chains.contains(&chain_target.to_lowercase().as_str()) {
        chain_target.to_lowercase()
    } else {
        "devnet".to_string()
    };

    Web3ReceiptTemplate {
        template_type: "nil_proof_anchor".to_string(),
        chain_target: chain,
        athlete_id_hash: athlete_id.0.clone(),
        deal_hash: deal_hash.to_string(),
        proof_merkle_root,
        ipfs_cid,
        // Always None in devnet — never sign without human review + legal approval.
        signature_hex: None,
        unsigned: true,
        live_submission_enabled: false,
        disclaimer: PROOF_DISCLAIMER.to_string(),
        template_created_at: Utc::now(),
    }
}

/// Verify that a proof vault record's document hash matches recomputed hash.
pub fn verify_proof_vault_record(record: &ProofVaultRecord, document_content: &str) -> bool {
    let expected = hash_proof_document(document_content);
    record.document_hash == expected
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::types::AthleteId;

    #[test]
    fn proof_vault_stores_hash_only() {
        let athlete_id = AthleteId("athlete_hash".into());
        let doc_hash = hash_proof_document("sensitive legal contract contents");
        let record = create_proof_vault_record(athlete_id, "nil_deal_agreement", &doc_hash, None);
        // The record must NOT contain the raw document content
        let serialized = serde_json::to_string(&record).unwrap();
        assert!(!serialized.contains("sensitive legal contract contents"));
        assert!(serialized.contains(&doc_hash));
        assert!(record.simulation_only);
    }

    #[test]
    fn merkle_root_is_deterministic() {
        let hashes = vec![
            hash_proof_document("doc1"),
            hash_proof_document("doc2"),
            hash_proof_document("doc3"),
        ];
        let r1 = create_merkle_root(&hashes).unwrap();
        let r2 = create_merkle_root(&hashes).unwrap();
        assert_eq!(r1, r2);
    }

    #[test]
    fn merkle_root_differs_for_different_inputs() {
        let hashes_a = vec![hash_proof_document("docA"), hash_proof_document("docB")];
        let hashes_b = vec![hash_proof_document("docC"), hash_proof_document("docD")];
        let ra = create_merkle_root(&hashes_a).unwrap();
        let rb = create_merkle_root(&hashes_b).unwrap();
        assert_ne!(ra, rb);
    }

    #[test]
    fn web3_anchor_is_unsigned() {
        let athlete_id = AthleteId("athlete_hash".into());
        let template =
            create_web3_anchor_template(&athlete_id, "deal_hash_abc", None, None, "xrpl");
        assert!(template.unsigned);
        assert!(!template.live_submission_enabled);
        assert!(template.signature_hex.is_none());
    }

    #[test]
    fn verify_record_returns_true_for_matching_content() {
        let athlete_id = AthleteId("athlete_hash".into());
        let content = "legal document content";
        let hash = hash_proof_document(content);
        let record = create_proof_vault_record(athlete_id, "doc", &hash, None);
        assert!(verify_proof_vault_record(&record, content));
    }

    #[test]
    fn empty_merkle_root_returns_error() {
        let result = create_merkle_root(&[]);
        assert!(matches!(result, Err(NilError::HashError(_))));
    }
}
