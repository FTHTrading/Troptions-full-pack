//! RocksDB persistence for TROPTIONS L1 state.
//! Column families: state, soulbounds, settlements, balances.

use crate::State;
use rocksdb::{ColumnFamilyDescriptor, Options, DB};
use std::path::Path;

const CF_STATE: &str = "state";
const CF_SOULBOUNDS: &str = "soulbounds";
const CF_SETTLEMENTS: &str = "settlements";
const CF_BALANCES: &str = "balances";

#[derive(Debug, thiserror::Error)]
pub enum PersistenceError {
    #[error("rocksdb error: {0}")]
    RocksDb(String),
    #[error("serialization error: {0}")]
    Serde(String),
}

pub struct StateStore {
    db: DB,
}

impl StateStore {
    pub fn open(path: impl AsRef<Path>) -> Result<Self, PersistenceError> {
        let path = path.as_ref();
        std::fs::create_dir_all(path).map_err(|e| PersistenceError::RocksDb(e.to_string()))?;

        let cfs = vec![
            ColumnFamilyDescriptor::new(CF_STATE, Options::default()),
            ColumnFamilyDescriptor::new(CF_SOULBOUNDS, Options::default()),
            ColumnFamilyDescriptor::new(CF_SETTLEMENTS, Options::default()),
            ColumnFamilyDescriptor::new(CF_BALANCES, Options::default()),
        ];

        let mut opts = Options::default();
        opts.create_if_missing(true);
        opts.create_missing_column_families(true);

        let db = DB::open_cf_descriptors(&opts, path, cfs)
            .map_err(|e| PersistenceError::RocksDb(e.to_string()))?;

        Ok(StateStore { db })
    }

    fn cf(&self, name: &str) -> Result<&rocksdb::ColumnFamily, PersistenceError> {
        self.db
            .cf_handle(name)
            .ok_or_else(|| PersistenceError::RocksDb(format!("missing CF {}", name)))
    }

    pub fn save(&self, state: &State) -> Result<(), PersistenceError> {
        let state_cf = self.cf(CF_STATE)?;
        let soul_cf = self.cf(CF_SOULBOUNDS)?;
        let settle_cf = self.cf(CF_SETTLEMENTS)?;
        let bal_cf = self.cf(CF_BALANCES)?;

        let meta = serde_json::to_vec(&StateMeta {
            current_height: state.current_height,
            nonces: state.nonces.clone(),
            governance_proposals: state.governance_proposals.clone(),
            governance_votes: state.governance_votes.clone(),
            namespaces: state.namespaces.clone(),
            soulbound_issuers: state.soulbound_issuers.clone(),
            treasury_balances: state.treasury_balances.clone(),
            x402_agents: state.x402_agents.clone(),
            events_len: state.events.len(),
        })
        .map_err(|e| PersistenceError::Serde(e.to_string()))?;
        self.db
            .put_cf(state_cf, b"meta", meta)
            .map_err(|e| PersistenceError::RocksDb(e.to_string()))?;

        if !state.events.is_empty() {
            let events = serde_json::to_vec(&state.events)
                .map_err(|e| PersistenceError::Serde(e.to_string()))?;
            self.db
                .put_cf(state_cf, b"events", events)
                .map_err(|e| PersistenceError::RocksDb(e.to_string()))?;
        }

        for (id, token) in &state.soulbound_tokens {
            let key = hex::encode(id);
            let val = serde_json::to_vec(token).map_err(|e| PersistenceError::Serde(e.to_string()))?;
            self.db
                .put_cf(soul_cf, key.as_bytes(), val)
                .map_err(|e| PersistenceError::RocksDb(e.to_string()))?;
        }

        for (id, settlement) in &state.settlements {
            let key = hex::encode(id);
            let val =
                serde_json::to_vec(settlement).map_err(|e| PersistenceError::Serde(e.to_string()))?;
            self.db
                .put_cf(settle_cf, key.as_bytes(), val)
                .map_err(|e| PersistenceError::RocksDb(e.to_string()))?;
        }

        for (key, amount) in &state.balances {
            let val = u128::from(*amount).to_le_bytes();
            self.db
                .put_cf(bal_cf, format!("bal:{}", key).as_bytes(), val)
                .map_err(|e| PersistenceError::RocksDb(e.to_string()))?;
        }

        for (key, amount) in &state.treasury_balances {
            let val = u128::from(*amount).to_le_bytes();
            self.db
                .put_cf(bal_cf, format!("treasury:{}", key).as_bytes(), val)
                .map_err(|e| PersistenceError::RocksDb(e.to_string()))?;
        }

        Ok(())
    }

    pub fn load(&self) -> Result<State, PersistenceError> {
        let state_cf = self.cf(CF_STATE)?;
        let soul_cf = self.cf(CF_SOULBOUNDS)?;
        let settle_cf = self.cf(CF_SETTLEMENTS)?;
        let bal_cf = self.cf(CF_BALANCES)?;

        let mut state = State::new();

        if let Ok(Some(meta_bytes)) = self.db.get_cf(state_cf, b"meta") {
            let meta: StateMeta = serde_json::from_slice(&meta_bytes)
                .map_err(|e| PersistenceError::Serde(e.to_string()))?;
            state.current_height = meta.current_height;
            state.nonces = meta.nonces;
            state.governance_proposals = meta.governance_proposals;
            state.governance_votes = meta.governance_votes;
            state.namespaces = meta.namespaces;
            state.soulbound_issuers = meta.soulbound_issuers;
            state.treasury_balances = meta.treasury_balances;
            state.x402_agents = meta.x402_agents;
        }

        if let Ok(Some(events_bytes)) = self.db.get_cf(state_cf, b"events") {
            state.events = serde_json::from_slice(&events_bytes)
                .map_err(|e| PersistenceError::Serde(e.to_string()))?;
        }

        let iter = self.db.iterator_cf(soul_cf, rocksdb::IteratorMode::Start);
        for item in iter {
            let (_, value) = item.map_err(|e| PersistenceError::RocksDb(e.to_string()))?;
            let token: crate::SoulboundToken = serde_json::from_slice(&value)
                .map_err(|e| PersistenceError::Serde(e.to_string()))?;
            state.soulbound_tokens.insert(token.id, token);
        }

        let iter = self.db.iterator_cf(settle_cf, rocksdb::IteratorMode::Start);
        for item in iter {
            let (_, value) = item.map_err(|e| PersistenceError::RocksDb(e.to_string()))?;
            let settlement: crate::Settlement = serde_json::from_slice(&value)
                .map_err(|e| PersistenceError::Serde(e.to_string()))?;
            state.settlements.insert(settlement.id, settlement);
        }

        let iter = self.db.iterator_cf(bal_cf, rocksdb::IteratorMode::Start);
        for item in iter {
            let (key, value) = item.map_err(|e| PersistenceError::RocksDb(e.to_string()))?;
            let key_str = String::from_utf8_lossy(&key).to_string();
            if value.len() != 16 {
                continue;
            }
            let mut arr = [0u8; 16];
            arr.copy_from_slice(&value);
            let amount = u128::from_le_bytes(arr) as primitives::Amount;
            if let Some(bal_key) = key_str.strip_prefix("bal:") {
                state.balances.insert(bal_key.to_string(), amount);
            } else if let Some(t_key) = key_str.strip_prefix("treasury:") {
                state.treasury_balances.insert(t_key.to_string(), amount);
            }
        }

        Ok(state)
    }

    pub fn flush(&self) -> Result<(), PersistenceError> {
        self.db
            .flush()
            .map_err(|e| PersistenceError::RocksDb(e.to_string()))
    }
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
struct StateMeta {
    current_height: u64,
    nonces: std::collections::HashMap<primitives::AccountId, u64>,
    governance_proposals: std::collections::HashMap<[u8; 32], crate::Proposal>,
    governance_votes: std::collections::HashMap<String, crate::VoteRecord>,
    namespaces: std::collections::HashMap<String, crate::NamespaceRecord>,
    soulbound_issuers: std::collections::HashMap<primitives::AccountId, crate::SoulboundIssuer>,
    treasury_balances: std::collections::HashMap<String, primitives::Amount>,
    x402_agents: std::collections::HashMap<String, crate::X402AgentRecord>,
    events_len: usize,
}
