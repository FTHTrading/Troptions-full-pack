//! DAO governance for TROPTIONS L1 — proposals, soulbound-weighted votes, execution queue.

use crypto::{sha256_hash, sign_message, verify_signature};
use primitives::Signature;
use primitives::{AccountId, BlockHeight};
use serde::{Deserialize, Serialize};
use state::{
    Event, Proposal, ProposalStatus, State, VoteChoice, VoteRecord,
};
use std::collections::HashMap;

pub use state::{NamespaceRecord, ProposalStatus as Status, VoteChoice as Choice};

pub const DEFAULT_QUORUM_BPS: u32 = 1000;
pub const DEFAULT_VOTING_BLOCKS: BlockHeight = 10_080;
pub const DEFAULT_TIMELOCK_BLOCKS: BlockHeight = 720;

#[derive(Debug, Clone, thiserror::Error)]
pub enum GovernanceError {
    #[error("proposal not found")]
    ProposalNotFound,
    #[error("invalid proposal status")]
    InvalidStatus,
    #[error("voting closed")]
    VotingClosed,
    #[error("already voted")]
    AlreadyVoted,
    #[error("no voting power")]
    NoVotingPower,
    #[error("timelock active")]
    TimelockActive,
    #[error("namespace taken")]
    NamespaceTaken,
}

fn vote_key(proposal_id: &[u8; 32], voter: &AccountId) -> String {
    format!("{}:{}", hex::encode(proposal_id), hex::encode(voter.as_bytes()))
}

pub fn voting_power(state: &State, voter: &AccountId) -> u64 {
    let count = state
        .soulbound_tokens
        .values()
        .filter(|t| t.owner == *voter && !t.revoked)
        .count();
    if count == 0 {
        0
    } else {
        count as u64
    }
}

pub fn create_proposal(
    state: &mut State,
    proposer: AccountId,
    title: String,
    description: String,
    action_uri: Option<String>,
) -> Result<Proposal, GovernanceError> {
    let mut data = Vec::new();
    data.extend_from_slice(proposer.as_bytes());
    data.extend_from_slice(title.as_bytes());
    data.extend_from_slice(&state.current_height.to_le_bytes());
    let id = sha256_hash(&data);

    let voting_ends_at = state.current_height.saturating_add(DEFAULT_VOTING_BLOCKS);
    let proposal = Proposal {
        id,
        proposer,
        title,
        description,
        action_uri,
        status: ProposalStatus::Active,
        created_at: state.current_height,
        voting_ends_at,
        timelock_until: 0,
        quorum_bps: DEFAULT_QUORUM_BPS,
        votes_for: 0,
        votes_against: 0,
        votes_abstain: 0,
    };
    state.governance_proposals.insert(id, proposal.clone());
    state.emit_event(Event::ProposalCreated { id, proposer });
    Ok(proposal)
}

pub fn cast_vote(
    state: &mut State,
    proposal_id: [u8; 32],
    voter: AccountId,
    choice: VoteChoice,
) -> Result<VoteRecord, GovernanceError> {
    let proposal = state
        .governance_proposals
        .get(&proposal_id)
        .ok_or(GovernanceError::ProposalNotFound)?;

    if proposal.status != ProposalStatus::Active {
        return Err(GovernanceError::InvalidStatus);
    }
    if state.current_height > proposal.voting_ends_at {
        return Err(GovernanceError::VotingClosed);
    }

    let key = vote_key(&proposal_id, &voter);
    if state.governance_votes.contains_key(&key) {
        return Err(GovernanceError::AlreadyVoted);
    }

    let weight = voting_power(state, &voter);
    if weight == 0 {
        return Err(GovernanceError::NoVotingPower);
    }

    let record = VoteRecord {
        proposal_id,
        voter,
        choice: choice.clone(),
        weight,
        cast_at: state.current_height,
    };
    state.governance_votes.insert(key, record.clone());

    let proposal = state.governance_proposals.get_mut(&proposal_id).unwrap();
    match choice {
        VoteChoice::For => proposal.votes_for = proposal.votes_for.saturating_add(weight),
        VoteChoice::Against => proposal.votes_against = proposal.votes_against.saturating_add(weight),
        VoteChoice::Abstain => proposal.votes_abstain = proposal.votes_abstain.saturating_add(weight),
    }

    state.emit_event(Event::ProposalVoted {
        id: proposal_id,
        voter,
        weight,
    });
    Ok(record)
}

pub fn finalize_proposal(state: &mut State, proposal_id: [u8; 32]) -> Result<Proposal, GovernanceError> {
    let proposal = state
        .governance_proposals
        .get(&proposal_id)
        .ok_or(GovernanceError::ProposalNotFound)?
        .clone();

    if proposal.status != ProposalStatus::Active {
        return Err(GovernanceError::InvalidStatus);
    }

    let total_votes = proposal.votes_for + proposal.votes_against + proposal.votes_abstain;
    let eligible = state.soulbound_tokens.values().filter(|t| !t.revoked).count() as u64;
    let quorum_needed = (eligible * proposal.quorum_bps as u64) / 10_000;
    let passed = total_votes >= quorum_needed.max(1) && proposal.votes_for > proposal.votes_against;

    let mut updated = proposal;
    updated.status = if passed {
        ProposalStatus::Passed
    } else {
        ProposalStatus::Failed
    };
    if passed {
        updated.timelock_until = state
            .current_height
            .saturating_add(DEFAULT_TIMELOCK_BLOCKS);
    }

    state.governance_proposals.insert(proposal_id, updated.clone());
    state.emit_event(Event::ProposalFinalized {
        id: proposal_id,
        passed,
    });
    Ok(updated)
}

pub fn execute_proposal(state: &mut State, proposal_id: [u8; 32]) -> Result<Proposal, GovernanceError> {
    let proposal = state
        .governance_proposals
        .get(&proposal_id)
        .ok_or(GovernanceError::ProposalNotFound)?
        .clone();

    if proposal.status != ProposalStatus::Passed {
        return Err(GovernanceError::InvalidStatus);
    }
    if state.current_height < proposal.timelock_until {
        return Err(GovernanceError::TimelockActive);
    }

    let mut updated = proposal;
    updated.status = ProposalStatus::Executed;
    state.governance_proposals.insert(proposal_id, updated.clone());
    state.emit_event(Event::ProposalExecuted { id: proposal_id });
    Ok(updated)
}

pub fn register_namespace(
    state: &mut State,
    namespace: String,
    owner: AccountId,
    brand_domain: Option<String>,
) -> Result<state::NamespaceRecord, GovernanceError> {
    if state.namespaces.contains_key(&namespace) {
        return Err(GovernanceError::NamespaceTaken);
    }
    let record = state::NamespaceRecord {
        namespace: namespace.clone(),
        owner,
        brand_domain,
        registered_at: state.current_height,
    };
    state.namespaces.insert(namespace.clone(), record.clone());
    state.emit_event(Event::NamespaceRegistered {
        namespace,
        owner,
    });
    Ok(record)
}

pub fn list_proposals(state: &State) -> Vec<Proposal> {
    let mut proposals: Vec<Proposal> = state.governance_proposals.values().cloned().collect();
    proposals.sort_by_key(|p| p.created_at);
    proposals
}

pub fn get_proposal(state: &State, id: &[u8; 32]) -> Option<Proposal> {
    state.governance_proposals.get(id).cloned()
}

pub fn governance_action_message(action: &str, proposal_id: &[u8; 32], actor: &AccountId) -> Vec<u8> {
    let mut data = Vec::new();
    data.extend_from_slice(b"GOV_ACTION_V1");
    data.extend_from_slice(action.as_bytes());
    data.extend_from_slice(proposal_id);
    data.extend_from_slice(actor.as_bytes());
    data
}

pub fn signed_create_proposal(
    state: &mut State,
    proposer: AccountId,
    title: String,
    description: String,
    action_uri: Option<String>,
    signature: Signature,
) -> Result<Proposal, GovernanceError> {
    let msg = governance_action_message("create", &[0u8; 32], &proposer);
    verify_signature(&msg, &signature, &proposer).map_err(|_| GovernanceError::NoVotingPower)?;
    create_proposal(state, proposer, title, description, action_uri)
}

pub fn signed_cast_vote(
    state: &mut State,
    proposal_id: [u8; 32],
    voter: AccountId,
    choice: VoteChoice,
    signature: Signature,
) -> Result<VoteRecord, GovernanceError> {
    let msg = governance_action_message("vote", &proposal_id, &voter);
    verify_signature(&msg, &signature, &voter).map_err(|_| GovernanceError::NoVotingPower)?;
    cast_vote(state, proposal_id, voter, choice)
}

pub fn signed_execute_proposal(
    state: &mut State,
    proposal_id: [u8; 32],
    executor: AccountId,
    signature: Signature,
) -> Result<Proposal, GovernanceError> {
    let msg = governance_action_message("execute", &proposal_id, &executor);
    verify_signature(&msg, &signature, &executor).map_err(|_| GovernanceError::NoVotingPower)?;
    execute_proposal(state, proposal_id)
}

pub fn sign_governance_action(
    action: &str,
    proposal_id: &[u8; 32],
    actor: &AccountId,
    secret_key: &[u8],
) -> Result<Signature, primitives::PrimitiveError> {
    let msg = governance_action_message(action, proposal_id, actor);
    sign_message(&msg, secret_key)
}

pub fn governance_summary(state: &State) -> HashMap<String, serde_json::Value> {
    let mut by_status: HashMap<String, u64> = HashMap::new();
    for p in state.governance_proposals.values() {
        let key = format!("{:?}", p.status);
        *by_status.entry(key).or_insert(0) += 1;
    }
    let mut map = HashMap::new();
    map.insert(
        "total_proposals".into(),
        serde_json::json!(state.governance_proposals.len()),
    );
    map.insert("total_votes".into(), serde_json::json!(state.governance_votes.len()));
    map.insert("by_status".into(), serde_json::json!(by_status));
    map.insert("quorum_bps".into(), serde_json::json!(DEFAULT_QUORUM_BPS));
    map
}

#[cfg(test)]
mod tests {
    use super::*;
    use crypto::generate_keypair;
    use runtime::authorize_soulbound_issuer;
    use soulbound::mint_soulbound;

    fn voter_with_credential(state: &mut State) -> AccountId {
        let (issuer, _) = generate_keypair();
        let (owner, _) = generate_keypair();
        authorize_soulbound_issuer(state, issuer, true);
        let _ = mint_soulbound(state, issuer, owner, Some("dao://member".into()), 1);
        owner
    }

    #[test]
    fn test_proposal_lifecycle() {
        let mut state = State::new();
        let voter = voter_with_credential(&mut state);
        let (proposer, _) = generate_keypair();

        let p = create_proposal(
            &mut state,
            proposer,
            "Treasury allocation".into(),
            "Fund XRPL gateway ops".into(),
            None,
        )
        .unwrap();

        let _ = cast_vote(&mut state, p.id, voter, VoteChoice::For).unwrap();
        state.current_height = p.voting_ends_at + 1;
        let finalized = finalize_proposal(&mut state, p.id).unwrap();
        assert_eq!(finalized.status, ProposalStatus::Passed);
        state.current_height = finalized.timelock_until + 1;
        let executed = execute_proposal(&mut state, p.id).unwrap();
        assert_eq!(executed.status, ProposalStatus::Executed);
    }
}
