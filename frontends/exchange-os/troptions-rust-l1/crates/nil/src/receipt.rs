#![allow(dead_code)]

//! TSN NIL — Deal receipt engine.
//!
//! NIL deal receipts are cryptographic hash records of unsigned deal payloads.
//! No private deal terms (exact compensation, personal brand data) are stored on-chain.
//! Ed25519 signing is an unsigned template in devnet — no live payment enabled.

use chrono::Utc;
use serde_json::json;
use uuid::Uuid;

use crate::errors::NilError;
use crate::types::{NilDeal, NilDealReceipt, Web3ReceiptTemplate};

const RECEIPT_DISCLAIMER: &str = "\
This NIL deal receipt is an unsigned template for devnet simulation only. \
No live NIL payment, deal settlement, token transfer, or NFT issuance is enabled. \
All production NIL deal activity requires legal review, institution/school approval, \
applicable state law compliance, and Control Hub authorization.";

/// Create the canonical JSON payload for a NIL deal hash.
///
/// Compensation is represented as a band only — not an exact amount.
/// Brand is represented as a hash — not a raw brand name.
pub fn create_canonical_deal_payload(deal: &NilDeal) -> Result<String, NilError> {
    let deliverable_hashes: Vec<&str> = deal
        .deliverables
        .iter()
        .map(|d| d.deliverable_hash.as_str())
        .collect();

    let payload = json!({
        "athlete_id_hash": deal.athlete_id.0,
        "brand_hash": deal.brand_hash,
        "compensation_band": deal.compensation_band,
        "deliverable_hashes": deliverable_hashes,
        "institution_code": deal.institution_code,
        "state_code": deal.state_code,
    });

    serde_json::to_string(&payload).map_err(|e| NilError::SerializationError(e.to_string()))
}

/// Hash a NIL deal payload using SHA-256.
pub fn hash_nil_deal_receipt(canonical_payload: &str) -> String {
    tsn_crypto::sha256_hex(canonical_payload.as_bytes())
}

/// Create an unsigned NIL deal receipt record.
///
/// The receipt contains only hash proofs and pseudonymous metadata.
/// No private deal terms, raw brand names, or compensation amounts are stored.
pub fn create_nil_deal_receipt(deal: &NilDeal) -> Result<NilDealReceipt, NilError> {
    let canonical = create_canonical_deal_payload(deal)?;
    let deal_hash = hash_nil_deal_receipt(&canonical);

    let deliverable_hashes: Vec<String> = deal
        .deliverables
        .iter()
        .map(|d| d.deliverable_hash.clone())
        .collect();

    Ok(NilDealReceipt {
        receipt_id: Uuid::new_v4(),
        deal_id: deal.deal_id,
        athlete_id: deal.athlete_id.clone(),
        brand_hash: deal.brand_hash.clone(),
        deal_hash,
        compensation_band: deal.compensation_band.clone(),
        deliverable_hashes,
        compliance_status: "simulation_only".to_string(),
        // Unsigned in devnet — signing requires Control Hub approval + legal review.
        signature_hex: None,
        simulation_only: true,
        issued_at: Utc::now(),
    })
}

/// Verify that a receipt's deal hash matches the canonical deal payload.
pub fn verify_nil_deal_receipt(receipt: &NilDealReceipt, deal: &NilDeal) -> Result<bool, NilError> {
    let canonical = create_canonical_deal_payload(deal)?;
    let expected_hash = hash_nil_deal_receipt(&canonical);
    Ok(receipt.deal_hash == expected_hash)
}

/// Create an unsigned Web3 receipt template for institution/legal review.
///
/// This template is a JSON payload suitable for external review and future
/// on-chain anchoring (XRPL, Stellar, Polygon), but is not submitted in devnet.
pub fn create_unsigned_web3_receipt_template(
    receipt: &NilDealReceipt,
    chain_target: &str,
    proof_merkle_root: Option<String>,
    ipfs_cid: Option<String>,
) -> Web3ReceiptTemplate {
    Web3ReceiptTemplate {
        template_type: "nil_deal_receipt".to_string(),
        chain_target: chain_target.to_string(),
        athlete_id_hash: receipt.athlete_id.0.clone(),
        deal_hash: receipt.deal_hash.clone(),
        proof_merkle_root,
        ipfs_cid,
        // Always None in devnet — signing requires human review + legal approval.
        signature_hex: None,
        unsigned: true,
        live_submission_enabled: false,
        disclaimer: RECEIPT_DISCLAIMER.to_string(),
        template_created_at: Utc::now(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::types::{AthleteId, NilDeal, NilDealDeliverable, Sport};
    use chrono::Utc;

    fn make_deal() -> NilDeal {
        let deliverable_hash = tsn_crypto::sha256_hex(b"endorse product post 3 times");
        NilDeal {
            deal_id: Uuid::new_v4(),
            athlete_id: AthleteId("athlete_test_hash".into()),
            brand_hash: tsn_crypto::sha256_hex(b"BrandName Corp"),
            deliverables: vec![NilDealDeliverable {
                deliverable_hash,
                deliverable_type: "social_post".into(),
                estimated_count: 3,
            }],
            compensation_band: "1000-5000".into(),
            deal_start_date: None,
            deal_end_date: None,
            state_code: "TX".into(),
            institution_code: "UNIV_001".into(),
            simulation_only: true,
            created_at: Utc::now(),
        }
    }

    #[test]
    fn receipt_hash_is_deterministic() {
        let deal = make_deal();
        let r1 = create_nil_deal_receipt(&deal).unwrap();
        let r2 = create_nil_deal_receipt(&deal).unwrap();
        assert_eq!(r1.deal_hash, r2.deal_hash);
    }

    #[test]
    fn receipt_is_unsigned_template() {
        let deal = make_deal();
        let receipt = create_nil_deal_receipt(&deal).unwrap();
        assert!(receipt.signature_hex.is_none());
        assert!(receipt.simulation_only);
    }

    #[test]
    fn verify_receipt_returns_true_for_matching_deal() {
        let deal = make_deal();
        let receipt = create_nil_deal_receipt(&deal).unwrap();
        let valid = verify_nil_deal_receipt(&receipt, &deal).unwrap();
        assert!(valid);
    }

    #[test]
    fn web3_template_has_no_signature_and_is_unsigned() {
        let deal = make_deal();
        let receipt = create_nil_deal_receipt(&deal).unwrap();
        let template = create_unsigned_web3_receipt_template(&receipt, "xrpl", None, None);
        assert!(template.unsigned);
        assert!(!template.live_submission_enabled);
        assert!(template.signature_hex.is_none());
    }
}
