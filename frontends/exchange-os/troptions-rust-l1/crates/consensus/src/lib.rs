#![allow(dead_code)]

//! TSN Consensus — stub crate.
//! Target: HotStuff-style linear-complexity BFT.
//! Devnet params: min_validators=4, max_validators=21,
//!                block_time_target_ms=2000, finality_threshold_pct=67.
//! Not implemented in scaffold phase.

pub const MIN_VALIDATORS: u8 = 4;
pub const MAX_VALIDATORS: u8 = 21;
pub const BLOCK_TIME_TARGET_MS: u64 = 2000;
pub const FINALITY_THRESHOLD_PCT: u8 = 67;
