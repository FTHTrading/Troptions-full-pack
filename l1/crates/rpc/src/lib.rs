//! RPC server for TROPTIONS L1.
//! Exposes REST-like endpoints for querying and submitting transactions.

use primitives::{AccountId, Amount, AssetId};
use serde::{Deserialize, Serialize};
use state::{Settlement, SoulboundToken, State};
use std::sync::{Arc, Mutex};

/// Global state accessible across RPC calls.
pub type SharedState = Arc<Mutex<State>>;

/// Create a new shared state instance.
pub fn create_shared_state() -> SharedState {
    Arc::new(Mutex::new(State::new()))
}

/// Soulbound query responses.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SoulboundQueryResponse {
    pub token_id: String,
    pub issuer: String,
    pub owner: String,
    pub metadata_uri: Option<String>,
    pub issued_at: u64,
    pub revoked: bool,
}

/// Settlement query responses.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SettlementQueryResponse {
    pub settlement_id: String,
    pub creator: String,
    pub asset: String,
    pub amount: String,
    pub recipient: String,
    pub condition: String,
    pub status: String,
    pub expires_at: u64,
}

/// Balance query response.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BalanceResponse {
    pub account: String,
    pub asset: String,
    pub balance: String,
}

/// Generic RPC response wrapper.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RpcResponse<T> {
    pub success: bool,
    pub data: Option<T>,
    pub error: Option<String>,
}

impl<T> RpcResponse<T> {
    pub fn ok(data: T) -> Self {
        RpcResponse {
            success: true,
            data: Some(data),
            error: None,
        }
    }

    pub fn err(msg: impl Into<String>) -> Self {
        RpcResponse {
            success: false,
            data: None,
            error: Some(msg.into()),
        }
    }
}

/// Query a soulbound token by ID.
pub fn query_soulbound_token(state: &State, token_id_hex: &str) -> Result<SoulboundQueryResponse, String> {
    let token_id_bytes = hex::decode(token_id_hex).map_err(|e| format!("invalid hex: {}", e))?;
    if token_id_bytes.len() != 32 {
        return Err("token id must be 32 bytes".to_string());
    }
    let mut token_id = [0u8; 32];
    token_id.copy_from_slice(&token_id_bytes);

    let token = state
        .soulbound_tokens
        .get(&token_id)
        .ok_or("token not found")?;

    Ok(SoulboundQueryResponse {
        token_id: hex::encode_upper(&token.id[..8]),
        issuer: hex::encode_upper(&token.issuer.as_bytes()[..8]),
        owner: hex::encode_upper(&token.owner.as_bytes()[..8]),
        metadata_uri: token.metadata_uri.clone(),
        issued_at: token.issued_at,
        revoked: token.revoked,
    })
}

/// Query all soulbound tokens for an account.
pub fn query_soulbound_by_owner(
    state: &State,
    owner_hex: &str,
) -> Result<Vec<SoulboundQueryResponse>, String> {
    let owner_bytes = hex::decode(owner_hex).map_err(|e| format!("invalid hex: {}", e))?;
    if owner_bytes.len() != 32 {
        return Err("owner must be 32 bytes".to_string());
    }
    let mut owner_arr = [0u8; 32];
    owner_arr.copy_from_slice(&owner_bytes);
    let owner = AccountId::new(owner_arr);

    let tokens: Vec<SoulboundQueryResponse> = state
        .soulbound_tokens
        .values()
        .filter(|t| t.owner == owner)
        .map(|t| SoulboundQueryResponse {
            token_id: hex::encode_upper(&t.id[..8]),
            issuer: hex::encode_upper(&t.issuer.as_bytes()[..8]),
            owner: hex::encode_upper(&t.owner.as_bytes()[..8]),
            metadata_uri: t.metadata_uri.clone(),
            issued_at: t.issued_at,
            revoked: t.revoked,
        })
        .collect();

    Ok(tokens)
}

/// Query a settlement by ID.
pub fn query_settlement(state: &State, settlement_id_hex: &str) -> Result<SettlementQueryResponse, String> {
    let id_bytes = hex::decode(settlement_id_hex).map_err(|e| format!("invalid hex: {}", e))?;
    if id_bytes.len() != 32 {
        return Err("settlement id must be 32 bytes".to_string());
    }
    let mut id = [0u8; 32];
    id.copy_from_slice(&id_bytes);

    let settlement = state.settlements.get(&id).ok_or("settlement not found")?;

    let condition_str = match &settlement.condition {
        state::SettlementCondition::TimeLocked { release_height } => {
            format!("TimeLocked(release_height={})", release_height)
        }
        state::SettlementCondition::CryptoCondition { hash_lock } => {
            format!("CryptoCondition(hash_lock={}...)", hex::encode_upper(&hash_lock[..8]))
        }
        state::SettlementCondition::MultiSig { required, signers } => {
            format!("MultiSig({}/{})", required, signers.len())
        }
    };

    Ok(SettlementQueryResponse {
        settlement_id: hex::encode_upper(&settlement.id[..8]),
        creator: hex::encode_upper(&settlement.creator.as_bytes()[..8]),
        asset: format!("{:?}", settlement.asset),
        amount: settlement.amount.to_string(),
        recipient: hex::encode_upper(&settlement.recipient.as_bytes()[..8]),
        condition: condition_str,
        status: format!("{:?}", settlement.status),
        expires_at: settlement.expires_at,
    })
}

/// Query all settlements for a creator.
pub fn query_settlements_by_creator(
    state: &State,
    creator_hex: &str,
) -> Result<Vec<SettlementQueryResponse>, String> {
    let creator_bytes = hex::decode(creator_hex).map_err(|e| format!("invalid hex: {}", e))?;
    if creator_bytes.len() != 32 {
        return Err("creator must be 32 bytes".to_string());
    }
    let mut creator_arr = [0u8; 32];
    creator_arr.copy_from_slice(&creator_bytes);
    let creator = AccountId::new(creator_arr);

    let settlements: Vec<SettlementQueryResponse> = state
        .settlements
        .values()
        .filter(|s| s.creator == creator)
        .map(|s| {
            let condition_str = match &s.condition {
                state::SettlementCondition::TimeLocked { release_height } => {
                    format!("TimeLocked(release_height={})", release_height)
                }
                state::SettlementCondition::CryptoCondition { hash_lock } => {
                    format!("CryptoCondition(hash_lock={}...)", hex::encode_upper(&hash_lock[..8]))
                }
                state::SettlementCondition::MultiSig { required, signers } => {
                    format!("MultiSig({}/{})", required, signers.len())
                }
            };
            SettlementQueryResponse {
                settlement_id: hex::encode_upper(&s.id[..8]),
                creator: hex::encode_upper(&s.creator.as_bytes()[..8]),
                asset: format!("{:?}", s.asset),
                amount: s.amount.to_string(),
                recipient: hex::encode_upper(&s.recipient.as_bytes()[..8]),
                condition: condition_str,
                status: format!("{:?}", s.status),
                expires_at: s.expires_at,
            }
        })
        .collect();

    Ok(settlements)
}

/// Query balance for an account.
pub fn query_balance(state: &State, account_hex: &str, asset: &str) -> Result<BalanceResponse, String> {
    let account_bytes = hex::decode(account_hex).map_err(|e| format!("invalid hex: {}", e))?;
    if account_bytes.len() != 32 {
        return Err("account must be 32 bytes".to_string());
    }
    let mut account_arr = [0u8; 32];
    account_arr.copy_from_slice(&account_bytes);
    let account = AccountId::new(account_arr);

    let asset_id = match asset {
        "NATIVE" | "native" => AssetId::Native,
        _ => {
            // Try to parse as XRPL, Stellar, or Custom
            if let Some(rest) = asset.strip_prefix("XRPL_") {
                let bytes = hex::decode(rest).map_err(|_| "invalid XRPL asset")?;
                if bytes.len() != 20 {
                    return Err("XRPL asset must be 20 bytes".to_string());
                }
                let mut arr = [0u8; 20];
                arr.copy_from_slice(&bytes);
                AssetId::XRPL(arr)
            } else {
                return Err("unsupported asset format".to_string());
            }
        }
    };

    let balance = state.get_balance(&account, &asset_id);

    Ok(BalanceResponse {
        account: hex::encode_upper(&account.as_bytes()[..8]),
        asset: asset.to_string(),
        balance: balance.to_string(),
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use crypto::generate_keypair;
    use runtime::authorize_soulbound_issuer;
    use soulbound::mint_soulbound;

    #[test]
    fn test_query_soulbound_token() {
        let mut state = State::new();
        let (issuer, _) = generate_keypair();
        let (owner, _) = generate_keypair();

        authorize_soulbound_issuer(&mut state, issuer, true);
        let event = mint_soulbound(
            &mut state,
            issuer,
            owner,
            Some("ipfs://QmTest".to_string()),
            1,
        )
        .unwrap();

        let token_id = match event {
            state::Event::SoulboundMinted { id, .. } => id,
            _ => panic!("unexpected event"),
        };

        let response = query_soulbound_token(&state, &hex::encode(&token_id),
        )
        .unwrap();
        assert_eq!(response.owner, hex::encode_upper(&owner.as_bytes()[..8]));
        assert_eq!(response.metadata_uri, Some("ipfs://QmTest".to_string()));
        assert!(!response.revoked);
    }

    #[test]
    fn test_query_balance() {
        let mut state = State::new();
        let (account, _) = generate_keypair();

        state.credit(&account, &AssetId::Native, 1000).unwrap();

        let response = query_balance(&state, &hex::encode(account.as_bytes()), "NATIVE",
        )
        .unwrap();
        assert_eq!(response.balance, "1000");
    }

    #[test]
    fn test_query_soulbound_by_owner() {
        let mut state = State::new();
        let (issuer, _) = generate_keypair();
        let (owner, _) = generate_keypair();

        authorize_soulbound_issuer(&mut state, issuer, true);
        let _ = mint_soulbound(
            &mut state,
            issuer,
            owner,
            Some("ipfs://QmCredential".to_string()),
            1,
        )
        .unwrap();

        let tokens = query_soulbound_by_owner(&state, &hex::encode(owner.as_bytes()),
        )
        .unwrap();
        assert_eq!(tokens.len(), 1);
        assert_eq!(tokens[0].metadata_uri, Some("ipfs://QmCredential".to_string()));
    }
}
