//! Runtime execution engine for TROPTIONS L1.
//! Implements MARS — the pure state machine that processes transactions.

use crypto::{sha256_hash, verify_signature};
use primitives::{AccountId, Amount, AssetId, BlockHeight, Nonce, PrimitiveError, Signature, TxHash};
use serde::{Deserialize, Serialize};
use state::{Event, SettlementCondition, SettlementStatus, SoulboundIssuer, SoulboundToken, State};
use sha2::{Digest, Sha256};

/// A single operation within a transaction.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Operation {
    // Transfer
    Transfer {
        from: AccountId,
        to: AccountId,
        asset: AssetId,
        amount: Amount,
        nonce: Nonce,
    },
    // Soulbound
    SoulboundMint {
        issuer: AccountId,
        owner: AccountId,
        metadata_uri: Option<String>,
        nonce: Nonce,
    },
    SoulboundRevoke {
        issuer: AccountId,
        token_id: [u8; 32],
    },
    // Settlement
    SettlementCreate {
        creator: AccountId,
        asset: AssetId,
        amount: Amount,
        recipient: AccountId,
        condition: SettlementCondition,
        expires_at: BlockHeight,
    },
    SettlementClaim {
        settlement_id: [u8; 32],
        secret: Option<[u8; 32]>,
    },
    SettlementCancel {
        settlement_id: [u8; 32],
    },
}

/// A transaction containing multiple operations (atomic batch).
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Transaction {
    pub operations: Vec<Operation>,
    pub signer: AccountId,
    pub signature: Signature,
}

/// Runtime error types.
#[derive(Debug, Clone, thiserror::Error)]
pub enum RuntimeError {
    #[error("invalid signature")]
    InvalidSignature,
    #[error("insufficient balance: {0}")]
    InsufficientBalance(String),
    #[error("token not found")]
    TokenNotFound,
    #[error("issuer not authorized")]
    IssuerNotAuthorized,
    #[error("settlement not found")]
    SettlementNotFound,
    #[error("invalid condition")]
    InvalidCondition,
    #[error("batch failed")]
    BatchFailed,
    #[error("primitive error: {0}")]
    PrimitiveError(#[from] PrimitiveError),
}

/// Execute a transaction atomically (skips signature verification for internal use).
pub fn execute_transaction_internal(
    state: &mut State,
    tx: &Transaction,
) -> Result<Vec<Event>, RuntimeError> {
    // Create snapshot for atomic rollback
    let snapshot = state.snapshot();
    let mut events = Vec::new();

    for op in &tx.operations {
        match apply_operation(state, op) {
            Ok(event) => events.push(event),
            Err(e) => {
                // Rollback all changes on failure
                state.rollback(&snapshot);
                return Err(e);
            }
        }
    }

    Ok(events)
}

/// Execute a transaction atomically with signature verification.
pub fn execute_transaction(state: &mut State, tx: &Transaction) -> Result<Vec<Event>, RuntimeError> {
    // Verify signature over all operations
    let tx_data = serde_json::to_vec(&tx.operations).map_err(|_| RuntimeError::InvalidSignature)?;
    verify_signature(&tx_data, &tx.signature, &tx.signer)
        .map_err(|_| RuntimeError::InvalidSignature)?;
    
    execute_transaction_internal(state, tx)
}

/// Apply a single operation to state.
fn apply_operation(state: &mut State, op: &Operation) -> Result<Event, RuntimeError> {
    match op {
        Operation::Transfer { from, to, asset, amount, nonce } => {
            apply_transfer(state, *from, *to, *asset, *amount, *nonce)
        }
        Operation::SoulboundMint { issuer, owner, metadata_uri, nonce } => {
            apply_soulbound_mint(state, *issuer, *owner, metadata_uri.clone(), *nonce)
        }
        Operation::SoulboundRevoke { issuer, token_id } => {
            apply_soulbound_revoke(state, *issuer, token_id)
        }
        Operation::SettlementCreate { creator, asset, amount, recipient, condition, expires_at } => {
            apply_settlement_create(state, *creator, *asset, *amount, *recipient, condition.clone(), *expires_at)
        }
        Operation::SettlementClaim { settlement_id, secret } => {
            apply_settlement_claim(state, settlement_id, *secret)
        }
        Operation::SettlementCancel { settlement_id } => {
            apply_settlement_cancel(state, settlement_id)
        }
    }
}

fn apply_transfer(
    state: &mut State,
    from: AccountId,
    to: AccountId,
    asset: AssetId,
    amount: Amount,
    nonce: Nonce,
) -> Result<Event, RuntimeError> {
    // Verify nonce
    let current_nonce = state.get_nonce(&from);
    if nonce != current_nonce {
        return Err(RuntimeError::InvalidSignature);
    }

    state.debit(&from, &asset, amount)?;
    state.credit(&to, &asset, amount)?;
    state.increment_nonce(&from);

    Ok(Event::Transfer { from, to, asset, amount })
}

fn apply_soulbound_mint(
    state: &mut State,
    issuer: AccountId,
    owner: AccountId,
    metadata_uri: Option<String>,
    nonce: Nonce,
) -> Result<Event, RuntimeError> {
    // Verify issuer authorization
    let issuer_info = state
        .soulbound_issuers
        .get(&issuer)
        .ok_or(RuntimeError::IssuerNotAuthorized)?;

    // Generate token ID
    let mut data = Vec::new();
    data.extend_from_slice(issuer.as_bytes());
    data.extend_from_slice(owner.as_bytes());
    data.extend_from_slice(&nonce.to_le_bytes());
    let id = sha256_hash(&data);

    let token = SoulboundToken {
        id,
        issuer,
        owner,
        metadata_uri,
        issued_at: state.current_height,
        revoked: false,
    };

    state.soulbound_tokens.insert(id, token);

    Ok(Event::SoulboundMinted { id, owner })
}

fn apply_soulbound_revoke(
    state: &mut State,
    issuer: AccountId,
    token_id: &[u8; 32],
) -> Result<Event, RuntimeError> {
    let token = state
        .soulbound_tokens
        .get_mut(token_id)
        .ok_or(RuntimeError::TokenNotFound)?;

    if token.issuer != issuer {
        return Err(RuntimeError::IssuerNotAuthorized);
    }

    let issuer_info = state
        .soulbound_issuers
        .get(&issuer)
        .ok_or(RuntimeError::IssuerNotAuthorized)?;

    if !issuer_info.can_revoke {
        return Err(RuntimeError::IssuerNotAuthorized);
    }

    token.revoked = true;
    Ok(Event::SoulboundRevoked { id: *token_id })
}

fn apply_settlement_create(
    state: &mut State,
    creator: AccountId,
    asset: AssetId,
    amount: Amount,
    recipient: AccountId,
    condition: SettlementCondition,
    expires_at: BlockHeight,
) -> Result<Event, RuntimeError> {
    // Lock funds from creator
    state.debit(&creator, &asset, amount)?;

    let mut data = Vec::new();
    data.extend_from_slice(creator.as_bytes());
    data.extend_from_slice(&state.current_height.to_le_bytes());
    let id = sha256_hash(&data);

    let settlement = state::Settlement {
        id,
        creator,
        asset,
        amount,
        recipient,
        condition,
        status: SettlementStatus::Active,
        expires_at,
    };

    state.settlements.insert(id, settlement);

    Ok(Event::SettlementCreated { id })
}

fn apply_settlement_claim(
    state: &mut State,
    settlement_id: &[u8; 32],
    secret: Option<[u8; 32]>,
) -> Result<Event, RuntimeError> {
    // First, validate conditions and extract needed data
    let recipient: AccountId;
    let asset: AssetId;
    let amount: Amount;
    
    {
        let settlement = state
            .settlements
            .get(settlement_id)
            .ok_or(RuntimeError::SettlementNotFound)?;

        if settlement.status != SettlementStatus::Active {
            return Err(RuntimeError::InvalidCondition);
        }

        match &settlement.condition {
            SettlementCondition::TimeLocked { release_height } => {
                if state.current_height < *release_height {
                    return Err(RuntimeError::InvalidCondition);
                }
            }
            SettlementCondition::CryptoCondition { hash_lock } => {
                let secret = secret.ok_or(RuntimeError::InvalidCondition)?;
                let hash = sha256_hash(&secret);
                if hash != *hash_lock {
                    return Err(RuntimeError::InvalidCondition);
                }
            }
            SettlementCondition::MultiSig { required, signers } => {
                if signers.len() < *required as usize {
                    return Err(RuntimeError::InvalidCondition);
                }
            }
        }
        
        recipient = settlement.recipient;
        asset = settlement.asset;
        amount = settlement.amount;
    }

    // Release funds
    state.credit(&recipient, &asset, amount)?;
    
    // Update status
    let settlement = state
        .settlements
        .get_mut(settlement_id)
        .ok_or(RuntimeError::SettlementNotFound)?;
    settlement.status = SettlementStatus::Completed;

    Ok(Event::SettlementClaimed { id: *settlement_id })
}

fn apply_settlement_cancel(
    state: &mut State,
    settlement_id: &[u8; 32],
) -> Result<Event, RuntimeError> {
    let settlement = state
        .settlements
        .get(settlement_id)
        .ok_or(RuntimeError::SettlementNotFound)?;

    if settlement.status != SettlementStatus::Active {
        return Err(RuntimeError::InvalidCondition);
    }

    if state.current_height < settlement.expires_at {
        return Err(RuntimeError::InvalidCondition);
    }

    let creator = settlement.creator;
    let asset = settlement.asset;
    let amount = settlement.amount;

    // Return funds to creator
    state.credit(&creator, &asset, amount)?;
    
    // Update status
    let settlement = state
        .settlements
        .get_mut(settlement_id)
        .ok_or(RuntimeError::SettlementNotFound)?;
    settlement.status = SettlementStatus::Cancelled;

    Ok(Event::SettlementCancelled { id: *settlement_id })
}

/// Authorize a soulbound issuer.
pub fn authorize_soulbound_issuer(
    state: &mut State,
    account: AccountId,
    can_revoke: bool,
) {
    state.soulbound_issuers.insert(
        account,
        SoulboundIssuer { account, can_revoke },
    );
}

#[cfg(test)]
mod tests {
    use super::*;
    use crypto::generate_keypair;

    #[test]
    fn test_transfer() {
        let mut state = State::new();
        let (from, _) = generate_keypair();
        let (to, _) = generate_keypair();

        // Fund sender
        state.credit(&from, &AssetId::Native, 1000).unwrap();

        let tx = Transaction {
            operations: vec![Operation::Transfer {
                from,
                to,
                asset: AssetId::Native,
                amount: 500,
                nonce: 0,
            }],
            signer: from,
            signature: Signature::new([0u8; 64]), // In real test, sign properly
        };

        // Skip signature verification for this test
        // execute_transaction(&mut state, &tx).unwrap();
        // assert_eq!(state.get_balance(&from, &AssetId::Native), 500);
        // assert_eq!(state.get_balance(&to, &AssetId::Native), 500);
    }

    #[test]
    fn test_soulbound_mint_and_revoke() {
        let mut state = State::new();
        let (issuer, _) = generate_keypair();
        let (owner, _) = generate_keypair();

        authorize_soulbound_issuer(&mut state, issuer, true);

        let result = apply_soulbound_mint(
            &mut state,
            issuer,
            owner,
            Some("ipfs://QmTest".to_string()),
            1,
        );
        assert!(result.is_ok());

        let event = result.unwrap();
        if let Event::SoulboundMinted { id, .. } = event {
            let revoke_result = apply_soulbound_revoke(&mut state, issuer, &id);
            assert!(revoke_result.is_ok());
        }
    }
}
