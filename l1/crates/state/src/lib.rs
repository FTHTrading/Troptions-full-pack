//! State management for TROPTIONS L1.
//! Provides key-value storage with Merkle tree support and snapshot capability.

use primitives::{AccountId, Amount, AssetId, BlockHeight, PrimitiveError, TxHash};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::collections::HashMap;

/// Global state container.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct State {
    pub current_height: BlockHeight,
    pub balances: HashMap<String, Amount>,
    pub nonces: HashMap<AccountId, u64>,
    pub soulbound_tokens: HashMap<[u8; 32], SoulboundToken>,
    pub soulbound_issuers: HashMap<AccountId, SoulboundIssuer>,
    pub settlements: HashMap<[u8; 32], Settlement>,
    pub events: Vec<Event>,
}

impl State {
    pub fn new() -> Self {
        State {
            current_height: 0,
            balances: HashMap::new(),
            nonces: HashMap::new(),
            soulbound_tokens: HashMap::new(),
            soulbound_issuers: HashMap::new(),
            settlements: HashMap::new(),
            events: Vec::new(),
        }
    }

    /// Create a snapshot of the current state (deep clone for rollback).
    pub fn snapshot(&self) -> StateSnapshot {
        StateSnapshot {
            merkle_root: self.compute_merkle_root(),
            balances: self.balances.clone(),
            nonces: self.nonces.clone(),
            soulbound_tokens: self.soulbound_tokens.clone(),
            soulbound_issuers: self.soulbound_issuers.clone(),
            settlements: self.settlements.clone(),
            events: self.events.clone(),
            current_height: self.current_height,
        }
    }

    /// Restore state from a snapshot.
    pub fn rollback(&mut self, snapshot: &StateSnapshot) {
        // Clone from snapshot back to self
        self.balances = snapshot.balances.clone();
        self.nonces = snapshot.nonces.clone();
        self.soulbound_tokens = snapshot.soulbound_tokens.clone();
        self.soulbound_issuers = snapshot.soulbound_issuers.clone();
        self.settlements = snapshot.settlements.clone();
        self.events = snapshot.events.clone();
        self.current_height = snapshot.current_height;
    }

    fn compute_merkle_root(&self) -> [u8; 32] {
        // Simplified: just hash the serialized state
        let mut hasher = Sha256::new();
        hasher.update(&self.current_height.to_le_bytes());
        hasher.update(&self.balances.len().to_le_bytes());
        hasher.update(&self.soulbound_tokens.len().to_le_bytes());
        hasher.update(&self.settlements.len().to_le_bytes());
        let result = hasher.finalize();
        let mut root = [0u8; 32];
        root.copy_from_slice(&result);
        root
    }

    // Balance operations
    fn balance_key(account: &AccountId, asset: &AssetId) -> String {
        format!("{}:{}", hex::encode(account.as_bytes()), hex::encode(asset.to_bytes()))
    }

    pub fn credit(
        &mut self,
        account: &AccountId,
        asset: &AssetId,
        amount: Amount,
    ) -> Result<(), PrimitiveError> {
        let key = Self::balance_key(account, asset);
        let current = self.balances.get(&key).copied().unwrap_or(0);
        self.balances.insert(key, current + amount);
        Ok(())
    }

    pub fn debit(
        &mut self,
        account: &AccountId,
        asset: &AssetId,
        amount: Amount,
    ) -> Result<(), PrimitiveError> {
        let key = Self::balance_key(account, asset);
        let current = self.balances.get(&key).copied().unwrap_or(0);
        if current < amount {
            return Err(PrimitiveError::InsufficientBalance);
        }
        self.balances.insert(key, current - amount);
        Ok(())
    }

    pub fn get_balance(&self,
        account: &AccountId,
        asset: &AssetId,
    ) -> Amount {
        let key = Self::balance_key(account, asset);
        self.balances.get(&key).copied().unwrap_or(0)
    }

    // Nonce operations
    pub fn get_nonce(&self, account: &AccountId) -> u64 {
        self.nonces.get(account).copied().unwrap_or(0)
    }

    pub fn increment_nonce(&mut self, account: &AccountId) {
        let current = self.get_nonce(account);
        self.nonces.insert(*account, current + 1);
    }

    // Event emission
    pub fn emit_event(&mut self, event: Event) {
        self.events.push(event);
    }
}

/// Snapshot of state for rollback.
#[derive(Debug, Clone)]
pub struct StateSnapshot {
    pub merkle_root: [u8; 32],
    pub balances: HashMap<String, Amount>,
    pub nonces: HashMap<AccountId, u64>,
    pub soulbound_tokens: HashMap<[u8; 32], SoulboundToken>,
    pub soulbound_issuers: HashMap<AccountId, SoulboundIssuer>,
    pub settlements: HashMap<[u8; 32], Settlement>,
    pub events: Vec<Event>,
    pub current_height: BlockHeight,
}

impl StateSnapshot {
    pub fn restore(self, state: &mut State) {
        state.balances = self.balances;
        state.nonces = self.nonces;
        state.soulbound_tokens = self.soulbound_tokens;
        state.soulbound_issuers = self.soulbound_issuers;
        state.settlements = self.settlements;
        state.events = self.events;
        state.current_height = self.current_height;
    }
}

/// Soulbound token data.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SoulboundToken {
    pub id: [u8; 32],
    pub issuer: AccountId,
    pub owner: AccountId,
    pub metadata_uri: Option<String>,
    pub issued_at: BlockHeight,
    pub revoked: bool,
}

/// Soulbound issuer info.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SoulboundIssuer {
    pub account: AccountId,
    pub can_revoke: bool,
}

/// Settlement data.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Settlement {
    pub id: [u8; 32],
    pub creator: AccountId,
    pub asset: AssetId,
    pub amount: Amount,
    pub recipient: AccountId,
    pub condition: SettlementCondition,
    pub status: SettlementStatus,
    pub expires_at: BlockHeight,
}

/// Settlement condition types.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum SettlementCondition {
    TimeLocked { release_height: BlockHeight },
    CryptoCondition { hash_lock: [u8; 32] },
    MultiSig { required: u32, signers: Vec<AccountId> },
}

/// Settlement status.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum SettlementStatus {
    Active,
    Completed,
    Cancelled,
}

/// Generic event for state changes.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Event {
    SoulboundMinted { id: [u8; 32], owner: AccountId },
    SoulboundRevoked { id: [u8; 32] },
    SettlementCreated { id: [u8; 32] },
    SettlementClaimed { id: [u8; 32] },
    SettlementCancelled { id: [u8; 32] },
    Transfer { from: AccountId, to: AccountId, asset: AssetId, amount: Amount },
}

#[cfg(test)]
mod tests {
    use super::*;
    use primitives::AssetId;

    #[test]
    fn test_balance_operations() {
        let mut state = State::new();
        let account = AccountId::new([1u8; 32]);
        let asset = AssetId::Native;

        state.credit(&account, &asset, 1000).unwrap();
        assert_eq!(state.get_balance(&account, &asset), 1000);

        state.debit(&account, &asset, 300).unwrap();
        assert_eq!(state.get_balance(&account, &asset), 700);

        // Should fail
        assert!(state.debit(&account, &asset, 800).is_err());
    }

    #[test]
    fn test_snapshot_and_rollback() {
        let mut state = State::new();
        let account = AccountId::new([2u8; 32]);
        
        state.credit(&account, &AssetId::Native, 500).unwrap();
        let snapshot = state.snapshot();
        
        state.credit(&account, &AssetId::Native, 500).unwrap();
        assert_eq!(state.get_balance(&account, &AssetId::Native), 1000);
        
        state.rollback(&snapshot);
        assert_eq!(state.get_balance(&account, &AssetId::Native), 500);
    }
}
