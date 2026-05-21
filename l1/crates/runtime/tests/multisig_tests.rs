use crypto::sign_message;
use ed25519_dalek::SigningKey;
use sha2::Digest;
use primitives::AccountId;
use runtime::multisig::{
    requires_multisig, treasury_debit_message, verify_threshold_signatures,
    DEFAULT_MULTISIG_THRESHOLD, MIN_TREASURY_APPROVAL_AMOUNT,
};

fn keypair_from_seed(seed: &str) -> (AccountId, Vec<u8>) {
    let sk_bytes = sha2::Sha256::digest(format!("{}_sk", seed).as_bytes());
    let mut sk = [0u8; 32];
    sk.copy_from_slice(&sk_bytes);
    let signing_key = SigningKey::from_bytes(&sk);
    let account = AccountId::new(signing_key.verifying_key().to_bytes());
    (account, sk.to_vec())
}

#[test]
fn min_treasury_threshold_constant() {
    assert_eq!(MIN_TREASURY_APPROVAL_AMOUNT, 1000);
    assert!(requires_multisig(1001));
    assert!(!requires_multisig(1000));
}

#[test]
fn verify_threshold_ed25519_signatures() {
    let (a0, sk0) = keypair_from_seed("council_0");
    let (a1, sk1) = keypair_from_seed("council_1");
    let council = vec![a0, a1];
    let msg = treasury_debit_message("xrpl:TROPTIONS", &a0, 5000, 0);
    let sig0 = sign_message(&msg, &sk0).unwrap();
    let sig1 = sign_message(&msg, &sk1).unwrap();
    let sigs = vec![(a0, sig0), (a1, sig1)];
    assert!(
        verify_threshold_signatures(&msg, &sigs, &council, DEFAULT_MULTISIG_THRESHOLD).is_ok()
    );
}
