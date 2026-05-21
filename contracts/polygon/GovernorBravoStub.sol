// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @notice Minimal GovernorBravo-style stub for KENNY/EVL ecosystem (Phase 2 deploy).
/// Canonical DAO votes live on TROPTIONS L1 soulbound credentials.
contract GovernorBravoStub {
    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        bool executed;
    }

    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;

    event ProposalCreated(uint256 indexed id, address proposer);
    event VoteCast(uint256 indexed id, address voter, bool support);

    function propose(string calldata description) external returns (uint256 id) {
        id = ++proposalCount;
        proposals[id] = Proposal({
            id: id,
            proposer: msg.sender,
            description: description,
            forVotes: 0,
            againstVotes: 0,
            executed: false
        });
        emit ProposalCreated(id, msg.sender);
    }

    function castVote(uint256 id, bool support) external {
        require(id > 0 && id <= proposalCount, "invalid id");
        if (support) proposals[id].forVotes += 1;
        else proposals[id].againstVotes += 1;
        emit VoteCast(id, msg.sender, support);
    }
}
