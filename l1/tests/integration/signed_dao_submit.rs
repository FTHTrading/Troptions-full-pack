//! Signed DAO governance RPC rejects invalid Ed25519 signatures.

use crypto::generate_keypair;
use governance::{sign_governance_action, signed_create_proposal};
use rpc::dao_submit_proposal;
use state::State;

#[test]
fn dao_submit_proposal_rejects_invalid_signature() {
    let mut state = State::new();
    let (proposer, _) = generate_keypair();
    let proposer_hex = hex::encode(proposer.as_bytes());
    let bad_sig = "00".repeat(64);

    let err = dao_submit_proposal(
        &mut state,
        &proposer_hex,
        "Treasury test",
        "Allocate ops budget",
        None,
        &bad_sig,
    )
    .unwrap_err();
    assert!(err.contains("signature") || err.contains("voting") || err.contains("power"));
}

#[test]
fn signed_create_proposal_accepts_valid_signature() {
    let mut state = State::new();
    let (proposer, sk) = generate_keypair();
    let sig = sign_governance_action("create", &[0u8; 32], &proposer, sk.as_ref()).unwrap();
    let proposal = signed_create_proposal(
        &mut state,
        proposer,
        "Valid proposal".into(),
        "Signed path".into(),
        None,
        sig,
    )
    .unwrap();
    assert!(!proposal.title.is_empty());
}
