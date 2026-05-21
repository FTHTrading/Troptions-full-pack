//! Integration test: signed transaction submit requires valid Ed25519 signature.

use crypto::{generate_keypair, sign_message};
use primitives::{AssetId, Signature};
use runtime::{execute_transaction, Operation, Transaction};
use state::State;

#[test]
fn signed_transfer_rejects_bad_signature() {
    let mut state = State::new();
    let (from, sk) = generate_keypair();
    let (to, _) = generate_keypair();
    state.credit(&from, &AssetId::Native, 5000).unwrap();

    let ops = vec![Operation::Transfer {
        from,
        to,
        asset: AssetId::Native,
        amount: 100,
        nonce: 0,
    }];
    let bad_sig = Signature::new([0u8; 64]);
    let tx = Transaction {
        operations: ops.clone(),
        signer: from,
        signature: bad_sig,
    };
    assert!(execute_transaction(&mut state, &tx).is_err());

    let tx_data = serde_json::to_vec(&ops).unwrap();
    let good_sig = sign_message(&tx_data, &sk).unwrap();
    let tx2 = Transaction {
        operations: ops,
        signer: from,
        signature: good_sig,
    };
    assert!(execute_transaction(&mut state, &tx2).is_ok());
    assert_eq!(state.get_balance(&to, &AssetId::Native), 100);
}
