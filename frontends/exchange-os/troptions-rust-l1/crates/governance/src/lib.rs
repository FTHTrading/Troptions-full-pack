#![allow(dead_code)]

//! TSN Governance — stub crate.
//! HotStuff-style BFT governance proposal submission (simulation only).

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum ProposalStatus {
    Draft,
    Submitted,
    Voting,
    Approved,
    Rejected,
    Vetoed,
    Expired,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GovernanceProposal {
    pub proposal_id: Uuid,
    pub title: String,
    pub description: String,
    pub proposer_id: Uuid,
    pub status: ProposalStatus,
    pub simulation_only: bool,
    pub quorum_threshold_pct: u8,
    pub approval_threshold_pct: u8,
    pub submitted_at: DateTime<Utc>,
    pub voting_ends_at: Option<DateTime<Utc>>,
}

pub fn submit_proposal_simulation(
    proposer_id: Uuid,
    title: &str,
    description: &str,
) -> GovernanceProposal {
    GovernanceProposal {
        proposal_id: Uuid::new_v4(),
        title: title.to_string(),
        description: description.to_string(),
        proposer_id,
        status: ProposalStatus::Draft,
        simulation_only: true,
        quorum_threshold_pct: 51,
        approval_threshold_pct: 67,
        submitted_at: Utc::now(),
        voting_ends_at: None,
    }
}

// ─── Vote types ───────────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GovernanceVote {
    pub vote_id: Uuid,
    pub proposal_id: Uuid,
    pub voter_id: Uuid,
    /// `true` = yes/approve, `false` = no/reject
    pub approve: bool,
    /// Voting power (e.g. 1 = equal weight, higher = validator/stake weight)
    pub weight: u64,
    pub cast_at: DateTime<Utc>,
}

impl GovernanceVote {
    pub fn new(proposal_id: Uuid, voter_id: Uuid, approve: bool, weight: u64) -> Self {
        GovernanceVote {
            vote_id: Uuid::new_v4(),
            proposal_id,
            voter_id,
            approve,
            weight,
            cast_at: Utc::now(),
        }
    }
}

// ─── Vote tally ───────────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VoteTally {
    pub proposal_id: Uuid,
    pub yes_weight: u64,
    pub no_weight: u64,
    pub total_weight: u64,
    pub total_voters: usize,
    /// Quorum = votes cast / eligible_weight >= quorum_threshold_pct
    pub quorum_reached: bool,
    /// Approval = yes_weight / total_weight >= approval_threshold_pct
    pub approved: bool,
    pub outcome: ProposalStatus,
}

/// Tally a set of votes for a proposal.
///
/// `eligible_weight` is the sum of all possible voting power (used to test
/// whether quorum has been reached). If unknown, pass the sum of all cast votes.
pub fn tally_votes(
    proposal: &GovernanceProposal,
    votes: &[GovernanceVote],
    eligible_weight: u64,
) -> VoteTally {
    let mut yes_weight: u64 = 0;
    let mut no_weight: u64 = 0;

    for vote in votes {
        if vote.approve {
            yes_weight = yes_weight.saturating_add(vote.weight);
        } else {
            no_weight = no_weight.saturating_add(vote.weight);
        }
    }

    let total_weight = yes_weight.saturating_add(no_weight);
    let total_voters = votes.len();

    // Quorum: participating weight / eligible weight >= quorum_threshold_pct
    let quorum_reached = eligible_weight > 0
        && (total_weight * 100) / eligible_weight >= proposal.quorum_threshold_pct as u64;

    // Approval: yes_weight / total_weight >= approval_threshold_pct
    let approved = quorum_reached
        && total_weight > 0
        && (yes_weight * 100) / total_weight >= proposal.approval_threshold_pct as u64;

    let outcome = if !quorum_reached {
        ProposalStatus::Voting // still insufficient participation
    } else if approved {
        ProposalStatus::Approved
    } else {
        ProposalStatus::Rejected
    };

    VoteTally {
        proposal_id: proposal.proposal_id,
        yes_weight,
        no_weight,
        total_weight,
        total_voters,
        quorum_reached,
        approved,
        outcome,
    }
}

/// Advance a proposal from `Draft` → `Voting` and set the voting deadline.
pub fn open_voting(
    proposal: &mut GovernanceProposal,
    voting_ends_at: DateTime<Utc>,
) {
    proposal.status = ProposalStatus::Voting;
    proposal.voting_ends_at = Some(voting_ends_at);
}

/// Apply a tally result back onto a proposal (updates status field).
pub fn resolve_proposal(proposal: &mut GovernanceProposal, tally: &VoteTally) {
    proposal.status = tally.outcome.clone();
}

// ─── Tests ───────────────────────────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;
    use chrono::Duration;

    fn make_proposal() -> GovernanceProposal {
        submit_proposal_simulation(Uuid::new_v4(), "Test Proposal", "A governance test")
    }

    #[test]
    fn proposal_starts_as_draft() {
        let p = make_proposal();
        assert_eq!(p.status, ProposalStatus::Draft);
        assert_eq!(p.quorum_threshold_pct, 51);
        assert_eq!(p.approval_threshold_pct, 67);
        assert!(p.simulation_only);
    }

    #[test]
    fn open_voting_sets_status_and_deadline() {
        let mut p = make_proposal();
        let deadline = Utc::now() + Duration::days(7);
        open_voting(&mut p, deadline);
        assert_eq!(p.status, ProposalStatus::Voting);
        assert!(p.voting_ends_at.is_some());
    }

    #[test]
    fn tally_quorum_not_reached() {
        let p = make_proposal(); // quorum = 51%
        // 10 eligible, only 4 vote → 40% < 51% quorum
        let votes = vec![
            GovernanceVote::new(p.proposal_id, Uuid::new_v4(), true, 4),
        ];
        let tally = tally_votes(&p, &votes, 10);
        assert!(!tally.quorum_reached);
        assert!(!tally.approved);
        assert_eq!(tally.outcome, ProposalStatus::Voting);
    }

    #[test]
    fn tally_quorum_reached_and_approved() {
        let p = make_proposal(); // quorum = 51%, approval = 67%
        // 10 eligible, 8 vote yes → 80% participation, 100% yes → approved
        let votes = vec![
            GovernanceVote::new(p.proposal_id, Uuid::new_v4(), true, 8),
        ];
        let tally = tally_votes(&p, &votes, 10);
        assert!(tally.quorum_reached);
        assert!(tally.approved);
        assert_eq!(tally.yes_weight, 8);
        assert_eq!(tally.outcome, ProposalStatus::Approved);
    }

    #[test]
    fn tally_quorum_reached_but_rejected() {
        let p = make_proposal(); // quorum = 51%, approval = 67%
        // 10 eligible: 6 vote yes (60%), 4 vote no — quorum met but 60% < 67% approval
        let votes = vec![
            GovernanceVote::new(p.proposal_id, Uuid::new_v4(), true, 6),
            GovernanceVote::new(p.proposal_id, Uuid::new_v4(), false, 4),
        ];
        let tally = tally_votes(&p, &votes, 10);
        assert!(tally.quorum_reached);
        assert!(!tally.approved);
        assert_eq!(tally.outcome, ProposalStatus::Rejected);
    }

    #[test]
    fn tally_exact_approval_threshold() {
        let p = make_proposal(); // approval = 67%
        // 10 eligible: 7 yes, 3 no (70% yes) — just over 67% → approved
        let votes = vec![
            GovernanceVote::new(p.proposal_id, Uuid::new_v4(), true, 7),
            GovernanceVote::new(p.proposal_id, Uuid::new_v4(), false, 3),
        ];
        let tally = tally_votes(&p, &votes, 10);
        assert!(tally.approved);
    }

    #[test]
    fn resolve_proposal_updates_status() {
        let mut p = make_proposal();
        open_voting(&mut p, Utc::now() + Duration::days(1));
        let votes = vec![GovernanceVote::new(p.proposal_id, Uuid::new_v4(), true, 8)];
        let tally = tally_votes(&p, &votes, 10);
        resolve_proposal(&mut p, &tally);
        assert_eq!(p.status, ProposalStatus::Approved);
    }
}
