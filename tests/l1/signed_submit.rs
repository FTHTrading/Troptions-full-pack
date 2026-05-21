//! Integration test: signed transaction submit via JSON-RPC (run with L1 node or in-process).

use crypto::{generate_keypair, sign_message};
use primitives::{AccountId, AssetId, Signature};
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
    let tx_data = serde_json::to_vec(&ops).unwrap();
    let bad_sig = Signature::new([0u8; 64]);

    let tx = Transaction {
        operations: ops,
        signer: from,
        signature: bad_sig,
    };
    assert!(execute_transaction(&mut state, &tx).is_err());

    let good_sig = sign_message(&tx_data, &sk).unwrap();
    let tx2 = Transaction {
        operations: vec![Operation::Transfer {
            from,
            to,
            asset: AssetId::Native,
            amount: 100,
            nonce: 0,
        }],
        signer: from,
        signature: good_sig,
    };
    assert!(execute_transaction(&mut state, &tx2).is_ok());
    assert_eq!(state.get_balance(&to, &AssetId::Native), 100);
}
