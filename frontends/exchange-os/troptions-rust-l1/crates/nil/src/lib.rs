#![allow(dead_code)]

//! TSN NIL — Native Name, Image, and Likeness protocol module.
//!
//! NIL is a first-class Troptions L1 primitive, alongside trustlines,
//! stablecoin readiness, RWA records, proof vaults, identity, compliance,
//! and Control Hub governance.
//!
//! Safety posture (always active):
//! - `live_execution_enabled = false`
//! - `simulation_only = true`
//! - `live_payment_enabled = false`
//! - `live_nft_mint_enabled = false`
//! - `live_web3_anchor_enabled = false`
//!
//! This module is devnet/simulation only.
//! No live athlete payments, NIL deal settlement, token minting, NFT issuance,
//! or private data anchoring is enabled.
//!
//! All production NIL activity requires legal review, school/institution rule
//! review, guardian/minor review where applicable, and Control Hub approval.

pub mod agent;
pub mod compliance;
pub mod errors;
pub mod governance;
pub mod identity;
pub mod proof;
pub mod receipt;
pub mod signals;
pub mod types;
pub mod valuation;

pub use errors::NilError;
pub use types::{
    AthleteId, AthleteIdentityRecord, AthleteProfile, InstitutionRuleProfile, MinorConsentStatus,
    NilAuditEvent, NilComplianceCheck, NilDeal, NilDealDeliverable, NilDealReceipt,
    NilGovernanceDecision, NilL1StateTransition, NilL1Transaction, NilSignal, NilSignalBucket,
    NilSignalScore, NilValuationBand, NilValuationInput, NilValuationResult, PayForPlayRisk,
    ProofVaultRecord, RecruitingRisk, RestrictedCategory, Sport, SportVertical, StateRuleProfile,
    Web3ReceiptTemplate,
};

/// Platform-level safety constants.
///
/// These are compile-time booleans. Changing them to `true` requires a
/// deliberate code change, legal review, and Control Hub approval.
pub const LIVE_EXECUTION_ENABLED: bool = false;
pub const LIVE_PAYMENT_ENABLED: bool = false;
pub const LIVE_NFT_MINT_ENABLED: bool = false;
pub const LIVE_WEB3_ANCHOR_ENABLED: bool = false;
pub const SIMULATION_ONLY: bool = true;
pub const DEVNET_ONLY: bool = true;

/// Crate-level disclaimer emitted on every report.
pub const NIL_MODULE_DISCLAIMER: &str = "\
This module provides NIL readiness simulation and devnet scaffolding only. \
No legal compliance is implied. No guaranteed NIL value, deal, or income is \
represented. No pay-for-play or recruiting inducement is supported. \
No live athlete payments, NIL deal settlement, token minting, NFT issuance, \
or private data anchoring is enabled. All production NIL activity requires \
legal review, school/institution rule review, guardian/minor review where \
applicable, and Control Hub approval.";
