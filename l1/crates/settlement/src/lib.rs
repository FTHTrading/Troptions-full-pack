//! Settlement crate for TROPTIONS L1.
//! Self-executing conditional payments (time-locked, hash-locked, multi-sig).

use primitives::{AccountId, Amount, AssetId, BlockHeight, Signature};
use runtime::{execute_transaction_internal, Operation, RuntimeError, Transaction};
use state::{Event, SettlementCondition, State};

/// Create a time-locked settlement.
pub fn create_time_locked_settlement(
    state: &mut State,
    creator: AccountId,
    asset: AssetId,
    amount: Amount,
    recipient: AccountId,
    release_height: BlockHeight,
    expires_at: BlockHeight,
) -> Result<Event, RuntimeError> {
    let tx = Transaction {
        operations: vec![Operation::SettlementCreate {
            creator,
            asset,
            amount,
            recipient,
            condition: SettlementCondition::TimeLocked { release_height },
            expires_at,
        }],
        signer: creator,
        signature: Signature::new([0u8; 64]), // Placeholder
    };
    let events = execute_transaction_internal(state, &tx)?;
    Ok(events.into_iter().next().unwrap())
}

/// Create a hash-locked settlement (HTLC).
pub fn create_hash_locked_settlement(
    state: &mut State,
    creator: AccountId,
    asset: AssetId,
    amount: Amount,
    recipient: AccountId,
    hash_lock: [u8; 32],
    expires_at: BlockHeight,
) -> Result<Event, RuntimeError> {
    let tx = Transaction {
        operations: vec![Operation::SettlementCreate {
            creator,
            asset,
            amount,
            recipient,
            condition: SettlementCondition::CryptoCondition { hash_lock },
            expires_at,
        }],
        signer: creator,
        signature: Signature::new([0u8; 64]), // Placeholder
    };
    let events = execute_transaction_internal(state, &tx)?;
    Ok(events.into_iter().next().unwrap())
}

/// Claim a settlement.
pub fn claim_settlement(
    state: &mut State,
    settlement_id: [u8; 32],
    secret: Option<[u8; 32]>,
) -> Result<Event, RuntimeError> {
    let tx = Transaction {
        operations: vec![Operation::SettlementClaim {
            settlement_id,
            secret,
        }],
        signer: AccountId::new([0u8; 32]), // Anyone can claim (condition-dependent)
        signature: Signature::new([0u8; 64]), // Placeholder
    };
    let events = execute_transaction_internal(state, &tx)?;
    Ok(events.into_iter().next().unwrap())
}

/// Cancel an expired settlement.
pub fn cancel_settlement(
    state: &mut State,
    creator: AccountId,
    settlement_id: [u8; 32],
) -> Result<Event, RuntimeError> {
    let tx = Transaction {
        operations: vec![Operation::SettlementCancel { settlement_id }],
        signer: creator,
        signature: Signature::new([0u8; 64]), // Placeholder
    };
    let events = execute_transaction_internal(state, &tx)?;
    Ok(events.into_iter().next().unwrap())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crypto::generate_keypair;
    use state::State;
    use crypto::sha256_hash;

    #[test]
    fn test_time_locked_settlement() {
        let mut state = State::new();
        let (creator, _) = generate_keypair();
        let (recipient, _) = generate_keypair();

        // Fund creator
        state.credit(&creator, &AssetId::Native, 1000).unwrap();

        // Create settlement that releases at block 100, expires at 200
        let event = create_time_locked_settlement(
            &mut state,
            creator,
            AssetId::Native,
            500,
            recipient,
            100,
            200,
        )
        .unwrap();

        // Try to claim before time (should fail)
        state.current_height = 50;
        let id = match event {
            Event::SettlementCreated { id } => id,
            _ => panic!("unexpected event"),
        };
        assert!(claim_settlement(&mut state, id, None).is_err());

        // Advance time and claim
        state.current_height = 100;
        let claim_event = claim_settlement(&mut state, id, None).unwrap();
        assert!(matches!(claim_event, Event::SettlementClaimed { .. }));
        assert_eq!(state.get_balance(&recipient, &AssetId::Native), 500);
    }

    #[test]
    fn test_hash_locked_settlement() {
        let mut state = State::new();
        let (creator, _) = generate_keypair();
        let (recipient, _) = generate_keypair();

        state.credit(&creator, &AssetId::Native, 1000).unwrap();

        // Use a fixed-length secret for consistent hashing
        let secret = b"my_secret_phrase_is_exactly_32!!";
        assert_eq!(secret.len(), 32, "secret must be exactly 32 bytes");
        let hash_lock = sha256_hash(secret);

        let event = create_hash_locked_settlement(
            &mut state,
            creator,
            AssetId::Native,
            500,
            recipient,
            hash_lock,
            200,
        )
        .unwrap();

        let id = match event {
            Event::SettlementCreated { id } => id,
            _ => panic!("unexpected event"),
        };

        // Claim with wrong secret (should fail)
        let wrong_secret = b"wrong_secret_not_match_at_all___";
        assert!(claim_settlement(&mut state, id, Some(*wrong_secret)).is_err());

        // Claim with correct secret - exact 32-byte match
        let claim_event = claim_settlement(&mut state, id, Some(*secret)).unwrap();
        assert!(matches!(claim_event, Event::SettlementClaimed { .. }));
        assert_eq!(state.get_balance(&recipient, &AssetId::Native), 500);
    }

    #[test]
    fn test_settlement_cancel() {
        let mut state = State::new();
        let (creator, _) = generate_keypair();
        let (recipient, _) = generate_keypair();

        state.credit(&creator, &AssetId::Native, 1000).unwrap();

        let event = create_time_locked_settlement(
            &mut state,
            creator,
            AssetId::Native,
            500,
            recipient,
            100,
            200,
        )
        .unwrap();

        let id = match event {
            Event::SettlementCreated { id } => id,
            _ => panic!("unexpected event"),
        };

        // Try to cancel before expiry (should fail)
        state.current_height = 150;
        assert!(cancel_settlement(&mut state, creator, id).is_err());

        // Cancel after expiry
        state.current_height = 201;
        let cancel_event = cancel_settlement(&mut state, creator, id).unwrap();
        assert!(matches!(cancel_event, Event::SettlementCancelled { .. }));
        assert_eq!(state.get_balance(&creator, &AssetId::Native), 1000); // Funds returned
    }
}
