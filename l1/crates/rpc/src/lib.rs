//! RPC server for TROPTIONS L1.
//! Exposes REST-like endpoints for querying and submitting transactions.

pub mod metrics;
pub mod x402;

use governance::{
    cast_vote, create_proposal, execute_proposal, finalize_proposal, get_proposal, governance_summary,
    list_proposals, register_namespace,
};
use primitives::{AccountId, Amount, AssetId, Signature};
use governance::{signed_cast_vote, signed_create_proposal, signed_execute_proposal};
use runtime::{execute_transaction, Transaction};
use serde::{Deserialize, Serialize};
use settlement::create_time_locked_settlement;
use soulbound::mint_soulbound;
use state::{Proposal, Settlement, SoulboundToken, State, VoteChoice};
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

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProposalResponse {
    pub proposal_id: String,
    pub proposer: String,
    pub title: String,
    pub description: String,
    pub status: String,
    pub votes_for: u64,
    pub votes_against: u64,
    pub votes_abstain: u64,
    pub voting_ends_at: u64,
    pub timelock_until: u64,
}

fn proposal_to_response(p: &Proposal) -> ProposalResponse {
    ProposalResponse {
        proposal_id: hex::encode_upper(&p.id[..8]),
        proposer: hex::encode_upper(&p.proposer.as_bytes()[..8]),
        title: p.title.clone(),
        description: p.description.clone(),
        status: format!("{:?}", p.status),
        votes_for: p.votes_for,
        votes_against: p.votes_against,
        votes_abstain: p.votes_abstain,
        voting_ends_at: p.voting_ends_at,
        timelock_until: p.timelock_until,
    }
}

pub fn query_proposal(state: &State, proposal_id_hex: &str) -> Result<ProposalResponse, String> {
    let id = parse_id32(proposal_id_hex)?;
    let p = get_proposal(state, &id).ok_or("proposal not found")?;
    Ok(proposal_to_response(&p))
}

pub fn query_proposals(state: &State) -> Vec<ProposalResponse> {
    list_proposals(state)
        .iter()
        .map(proposal_to_response)
        .collect()
}

pub fn query_governance_state(state: &State) -> serde_json::Value {
    serde_json::json!(governance_summary(state))
}

/// DAO RPC: list all proposals (alias `dao_getProposals`).
pub fn dao_get_proposals(state: &State) -> Vec<ProposalResponse> {
    query_proposals(state)
}

/// DAO RPC: list votes for a proposal (alias `dao_getVotes`).
pub fn dao_get_votes(state: &State, proposal_id_hex: &str) -> Result<Vec<serde_json::Value>, String> {
    let proposal_id = parse_id32(proposal_id_hex)?;
    let votes: Vec<serde_json::Value> = state
        .governance_votes
        .values()
        .filter(|v| v.proposal_id == proposal_id)
        .map(|v| {
            serde_json::json!({
                "proposal_id": hex::encode_upper(&v.proposal_id[..8]),
                "voter": hex::encode_upper(&v.voter.as_bytes()[..8]),
                "choice": format!("{:?}", v.choice),
                "weight": v.weight,
                "cast_at": v.cast_at,
            })
        })
        .collect();
    Ok(votes)
}

/// Treasury balance on L1 (source of truth).
pub fn treasury_get_balance(state: &State, chain: &str, asset: &str) -> serde_json::Value {
    serde_json::json!({
        "chain": chain,
        "asset": asset,
        "balance": state.get_treasury_balance(chain, asset).to_string(),
        "source": "l1_state"
    })
}

/// Submit a signed transaction to L1 (requires valid Ed25519 signature).
pub fn submit_transaction(state: &mut State, tx: Transaction) -> Result<serde_json::Value, String> {
    metrics::inc_tx_submitted();
    let events = execute_transaction(state, &tx).map_err(|e| format!("{}", e))?;
    state.current_height = state.current_height.saturating_add(1);
    metrics::set_block_height(state.current_height);
    Ok(serde_json::json!({
        "tx_accepted": true,
        "events": events.len(),
        "block_height": state.current_height,
    }))
}

pub fn dao_submit_proposal(
    state: &mut State,
    proposer_hex: &str,
    title: &str,
    description: &str,
    action_uri: Option<String>,
    signature_hex: &str,
) -> Result<ProposalResponse, String> {
    let proposer = parse_account(proposer_hex)?;
    let sig_bytes = hex::decode(signature_hex).map_err(|e| format!("invalid signature: {}", e))?;
    if sig_bytes.len() != 64 {
        return Err("signature must be 64 bytes".into());
    }
    let mut sig_arr = [0u8; 64];
    sig_arr.copy_from_slice(&sig_bytes);
    let signature = Signature::new(sig_arr);
    let p = signed_create_proposal(
        state,
        proposer,
        title.to_string(),
        description.to_string(),
        action_uri,
        signature,
    )
    .map_err(|e| format!("{}", e))?;
    Ok(proposal_to_response(&p))
}

pub fn dao_cast_vote(
    state: &mut State,
    proposal_id_hex: &str,
    voter_hex: &str,
    choice: &str,
    signature_hex: &str,
) -> Result<serde_json::Value, String> {
    let proposal_id = parse_id32(proposal_id_hex)?;
    let voter = parse_account(voter_hex)?;
    let vote_choice = match choice.to_lowercase().as_str() {
        "for" | "yes" => VoteChoice::For,
        "against" | "no" => VoteChoice::Against,
        "abstain" => VoteChoice::Abstain,
        _ => return Err("choice must be for|against|abstain".into()),
    };
    let sig_bytes = hex::decode(signature_hex).map_err(|e| format!("invalid signature: {}", e))?;
    if sig_bytes.len() != 64 {
        return Err("signature must be 64 bytes".into());
    }
    let mut sig_arr = [0u8; 64];
    sig_arr.copy_from_slice(&sig_bytes);
    let signature = Signature::new(sig_arr);
    let record = signed_cast_vote(state, proposal_id, voter, vote_choice, signature)
        .map_err(|e| format!("{}", e))?;
    Ok(serde_json::json!({
        "proposal_id": hex::encode_upper(&record.proposal_id[..8]),
        "voter": hex::encode_upper(&record.voter.as_bytes()[..8]),
        "choice": format!("{:?}", record.choice),
        "weight": record.weight,
    }))
}

pub fn dao_execute(
    state: &mut State,
    proposal_id_hex: &str,
    executor_hex: &str,
    signature_hex: &str,
) -> Result<ProposalResponse, String> {
    let proposal_id = parse_id32(proposal_id_hex)?;
    let executor = parse_account(executor_hex)?;
    let sig_bytes = hex::decode(signature_hex).map_err(|e| format!("invalid signature: {}", e))?;
    if sig_bytes.len() != 64 {
        return Err("signature must be 64 bytes".into());
    }
    let mut sig_arr = [0u8; 64];
    sig_arr.copy_from_slice(&sig_bytes);
    let signature = Signature::new(sig_arr);
    let p = signed_execute_proposal(state, proposal_id, executor, signature)
        .map_err(|e| format!("{}", e))?;
    Ok(proposal_to_response(&p))
}

fn parse_account(hex_str: &str) -> Result<AccountId, String> {
    let bytes = hex::decode(hex_str).map_err(|e| format!("invalid hex: {}", e))?;
    if bytes.len() != 32 {
        return Err("account must be 32 bytes".to_string());
    }
    let mut arr = [0u8; 32];
    arr.copy_from_slice(&bytes);
    Ok(AccountId::new(arr))
}

fn parse_id32(hex_str: &str) -> Result<[u8; 32], String> {
    let bytes = hex::decode(hex_str).map_err(|e| format!("invalid hex: {}", e))?;
    if bytes.len() != 32 {
        return Err("id must be 32 bytes".to_string());
    }
    let mut arr = [0u8; 32];
    arr.copy_from_slice(&bytes);
    Ok(arr)
}

pub fn submit_soulbound_mint(
    state: &mut State,
    issuer_hex: &str,
    owner_hex: &str,
    metadata_uri: Option<String>,
    nonce: u64,
) -> Result<SoulboundQueryResponse, String> {
    let issuer = parse_account(issuer_hex)?;
    let owner = parse_account(owner_hex)?;
    let event = mint_soulbound(state, issuer, owner, metadata_uri, nonce)
        .map_err(|e| format!("mint failed: {}", e))?;
    let token_id = match event {
        state::Event::SoulboundMinted { id, .. } => id,
        _ => return Err("unexpected event".into()),
    };
    query_soulbound_token(state, &hex::encode(token_id))
}

pub fn submit_settlement_create(
    state: &mut State,
    creator_hex: &str,
    asset: &str,
    amount: &str,
    recipient_hex: &str,
    condition: &str,
) -> Result<SettlementQueryResponse, String> {
    let creator = parse_account(creator_hex)?;
    let recipient = parse_account(recipient_hex)?;
    let amount_val: Amount = amount.parse().map_err(|_| "invalid amount")?;
    let asset_id = match asset.to_uppercase().as_str() {
        "NATIVE" | "TROPTIONS" => AssetId::Native,
        _ => return Err("unsupported asset".into()),
    };
    let release_height = state.current_height.saturating_add(10);
    let expires_at = state.current_height.saturating_add(1000);
    let event = if condition.contains("hash") {
        return Err("hash-locked via settlement API not yet exposed".into());
    } else {
        create_time_locked_settlement(
            state,
            creator,
            asset_id,
            amount_val,
            recipient,
            release_height,
            expires_at,
        )
        .map_err(|e| format!("{}", e))?
    };
    let id = match event {
        state::Event::SettlementCreated { id } => id,
        _ => return Err("unexpected event".into()),
    };
    query_settlement(state, &hex::encode(id))
}

pub fn submit_namespace_register(
    state: &mut State,
    namespace: &str,
    owner_hex: &str,
    brand_domain: Option<String>,
) -> Result<serde_json::Value, String> {
    let owner = parse_account(owner_hex)?;
    let record = register_namespace(state, namespace.to_string(), owner, brand_domain)
        .map_err(|e| format!("register failed: {}", e))?;
    Ok(serde_json::json!({
        "namespace": record.namespace,
        "owner": hex::encode_upper(&record.owner.as_bytes()[..8]),
        "brand_domain": record.brand_domain,
        "registered_at": record.registered_at,
    }))
}

pub fn submit_proposal_create(
    state: &mut State,
    proposer_hex: &str,
    title: &str,
    description: &str,
    action_uri: Option<String>,
) -> Result<ProposalResponse, String> {
    let proposer = parse_account(proposer_hex)?;
    let p = create_proposal(
        state,
        proposer,
        title.to_string(),
        description.to_string(),
        action_uri,
    )
    .map_err(|e| format!("create failed: {}", e))?;
    Ok(proposal_to_response(&p))
}

pub fn submit_proposal_vote(
    state: &mut State,
    proposal_id_hex: &str,
    voter_hex: &str,
    choice: &str,
) -> Result<serde_json::Value, String> {
    let proposal_id = parse_id32(proposal_id_hex)?;
    let voter = parse_account(voter_hex)?;
    let vote_choice = match choice.to_lowercase().as_str() {
        "for" | "yes" => VoteChoice::For,
        "against" | "no" => VoteChoice::Against,
        "abstain" => VoteChoice::Abstain,
        _ => return Err("choice must be for|against|abstain".into()),
    };
    let record = cast_vote(state, proposal_id, voter, vote_choice)
        .map_err(|e| format!("vote failed: {}", e))?;
    Ok(serde_json::json!({
        "proposal_id": hex::encode_upper(&record.proposal_id[..8]),
        "voter": hex::encode_upper(&record.voter.as_bytes()[..8]),
        "choice": format!("{:?}", record.choice),
        "weight": record.weight,
    }))
}

pub fn submit_proposal_finalize(
    state: &mut State,
    proposal_id_hex: &str,
) -> Result<ProposalResponse, String> {
    let proposal_id = parse_id32(proposal_id_hex)?;
    let p = finalize_proposal(state, proposal_id).map_err(|e| format!("finalize failed: {}", e))?;
    Ok(proposal_to_response(&p))
}

pub fn submit_proposal_execute(
    state: &mut State,
    proposal_id_hex: &str,
) -> Result<ProposalResponse, String> {
    let proposal_id = parse_id32(proposal_id_hex)?;
    let p = execute_proposal(state, proposal_id).map_err(|e| format!("execute failed: {}", e))?;
    Ok(proposal_to_response(&p))
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
