//! Atomic router crate for TROPTIONS L1.
//! Ensures multi-operation transactions commit or revert as a single unit.

use primitives::{AccountId, Amount, AssetId, Signature};
use runtime::{execute_transaction_internal, Operation, RuntimeError, Transaction};
use state::{Event, State};

/// Build an atomic transaction with multiple operations.
pub struct AtomicTransaction {
    operations: Vec<Operation>,
    signer: AccountId,
}

impl AtomicTransaction {
    pub fn new(signer: AccountId) -> Self {
        AtomicTransaction {
            operations: Vec::new(),
            signer,
        }
    }

    pub fn add_transfer(
        &mut self,
        from: AccountId,
        to: AccountId,
        asset: AssetId,
        amount: Amount,
        nonce: u64,
    ) {
        self.operations.push(Operation::Transfer {
            from,
            to,
            asset,
            amount,
            nonce,
        });
    }

    pub fn add_soulbound_mint(
        &mut self,
        issuer: AccountId,
        owner: AccountId,
        metadata_uri: Option<String>,
        nonce: u64,
    ) {
        self.operations.push(Operation::SoulboundMint {
            issuer,
            owner,
            metadata_uri,
            nonce,
        });
    }

    pub fn add_settlement_create(
        &mut self,
        creator: AccountId,
        asset: AssetId,
        amount: Amount,
        recipient: AccountId,
        condition: state::SettlementCondition,
        expires_at: u64,
    ) {
        self.operations.push(Operation::SettlementCreate {
            creator,
            asset,
            amount,
            recipient,
            condition,
            expires_at,
        });
    }

    pub fn finalize(self, signature: Signature) -> Transaction {
        Transaction {
            operations: self.operations,
            signer: self.signer,
            signature,
        }
    }
}

/// Execute an atomic swap: soulbound credential + payment in one transaction.
pub fn execute_atomic_swap(
    state: &mut State,
    issuer: AccountId,
    recipient: AccountId,
    metadata_uri: Option<String>,
    payment_amount: Amount,
    payment_asset: AssetId,
) -> Result<Vec<Event>, RuntimeError> {
    let mut tx = AtomicTransaction::new(issuer);

    // Step 1: Mint soulbound credential to recipient
    tx.add_soulbound_mint(issuer, recipient, metadata_uri, 0);

    // Step 2: Transfer payment to recipient
    tx.add_transfer(issuer, recipient, payment_asset, payment_amount, 0);

    let finalized_tx = tx.finalize(Signature::new([0u8; 64]));
    execute_transaction_internal(state, &finalized_tx)
}

/// Execute an atomic batch: multiple operations that must all succeed.
pub fn execute_batch(
    state: &mut State,
    operations: Vec<Operation>,
    signer: AccountId,
) -> Result<Vec<Event>, RuntimeError> {
    let tx = Transaction {
        operations,
        signer,
        signature: Signature::new([0u8; 64]),
    };
    execute_transaction_internal(state, &tx)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crypto::generate_keypair;
    use state::{SettlementCondition, State};

    #[test]
    fn test_atomic_swap() {
        let mut state = State::new();
        let (issuer, _) = generate_keypair();
        let (recipient, _) = generate_keypair();

        // Fund issuer
        state.credit(&issuer, &AssetId::Native, 1000).unwrap();

        // Authorize soulbound issuer
        runtime::authorize_soulbound_issuer(&mut state, issuer, true);

        // Execute atomic swap
        let events = execute_atomic_swap(
            &mut state,
            issuer,
            recipient,
            Some("ipfs://QmDegree".to_string()),
            500,
            AssetId::Native,
        )
        .unwrap();

        assert_eq!(events.len(), 2);
        assert!(matches!(
            events[0],
            Event::SoulboundMinted { .. }
        ));
        assert!(matches!(
            events[1],
            Event::Transfer { .. }
        ));

        // Verify recipient has credential and payment
        assert_eq!(state.get_balance(&recipient, &AssetId::Native), 500);
    }

    #[test]
    fn test_atomic_rollback() {
        let mut state = State::new();
        let (from, _) = generate_keypair();
        let (to, _) = generate_keypair();

        // Fund sender with only 100
        state.credit(&from, &AssetId::Native, 100).unwrap();

        // Try to send 500 (will fail) + create settlement (would succeed individually)
        // But because it's a batch, BOTH should fail
        let mut tx = AtomicTransaction::new(from);
        tx.add_transfer(from, to, AssetId::Native, 500, 0);
        tx.add_soulbound_mint(from, to, None, 0); // This would fail anyway (not authorized)

        let finalized_tx = tx.finalize(Signature::new([0u8; 64]));
        let result = execute_transaction_internal(&mut state, &finalized_tx);
        assert!(result.is_err());

        // Verify NO state change occurred (rollback)
        assert_eq!(state.get_balance(&from, &AssetId::Native), 100);
        assert_eq!(state.get_balance(&to, &AssetId::Native), 0);
    }

    #[test]
    fn test_batch_all_or_nothing() {
        let mut state = State::new();
        let (a, _) = generate_keypair();
        let (b, _) = generate_keypair();
        let (c, _) = generate_keypair();

        state.credit(&a, &AssetId::Native, 1000).unwrap();

        // Batch: A->B (500), A->C (500) — both should succeed
        let mut tx = AtomicTransaction::new(a);
        tx.add_transfer(a, b, AssetId::Native, 500, 0);
        tx.add_transfer(a, c, AssetId::Native, 500, 1);

        let finalized_tx = tx.finalize(Signature::new([0u8; 64]));
        let events = execute_transaction_internal(&mut state, &finalized_tx).unwrap();
        assert_eq!(events.len(), 2);

        assert_eq!(state.get_balance(&a, &AssetId::Native), 0);
        assert_eq!(state.get_balance(&b, &AssetId::Native), 500);
        assert_eq!(state.get_balance(&c, &AssetId::Native), 500);
    }
}
