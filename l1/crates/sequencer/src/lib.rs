//! Sovereign Sequencer (stub)
//!
//! TROPTIONS L1 currently runs as a **single-node sovereign sequencer** with
//! deterministic state transitions (MARS runtime). This crate documents the
//! intended evolution path — NOT full BFT consensus today.
//!
//! ## Current (production v0.1)
//! - One `troptions-node` process orders transactions locally
//! - RocksDB persistence + signed submit RPC
//! - Fraud-proof hooks reserved for future optimistic rollup path
//!
//! ## Planned (see docs/ROADMAP.md)
//! - Multi-sequencer federation with challenge window
//! - BFT committee (Q4 2026 target)
//! - State proof export for light clients

use primitives::BlockHeight;

/// Sequencer mode — honest capability flag for operators and dashboards.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum SequencerMode {
    /// Single operator node (current production default).
    SingleNode,
    /// Multiple sequencers with fraud proof challenge period (planned).
    FederatedFraudProofs,
    /// Full BFT quorum (planned Q4 2026).
    BftQuorum,
}

pub struct SequencerInfo {
    pub mode: SequencerMode,
    pub node_id: &'static str,
    pub last_block: BlockHeight,
}

pub fn current_sequencer_info(last_block: BlockHeight) -> SequencerInfo {
    SequencerInfo {
        mode: SequencerMode::SingleNode,
        node_id: "sovereign-sequencer-0",
        last_block,
    }
}

pub fn mode_description(mode: SequencerMode) -> &'static str {
    match mode {
        SequencerMode::SingleNode => {
            "Single-node sovereign sequencer — NOT distributed BFT"
        }
        SequencerMode::FederatedFraudProofs => {
            "Multi-sequencer with fraud proofs (planned)"
        }
        SequencerMode::BftQuorum => "BFT quorum consensus (planned Q4 2026)",
    }
}
