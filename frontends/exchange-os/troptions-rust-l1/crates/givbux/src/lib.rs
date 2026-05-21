#![allow(dead_code)]

//! GivBux / TROPTIONS Pay Evidence System
//!
//! Tracks all GivBux / TROPTIONS Pay claims as evidence-gated records.
//! No live payments, merchant processing, or token transactions are enabled.
//!
//! Safety posture:
//! - `live_execution_enabled = false`
//! - `simulation_only = true`
//! - All income/payout claims default BLOCKED
//! - Payment-rail claims default NEEDS_EVIDENCE
//! - Merchant-count claims default NEEDS_EVIDENCE
//! - Global payment claims always BLOCKED

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::collections::BTreeMap;
use uuid::Uuid;

pub mod errors;
pub mod types;

pub use errors::GivBuxError;
pub use types::*;

pub const LIVE_EXECUTION_ENABLED: bool = false;
pub const SIMULATION_ONLY: bool = true;

pub const GIVBUX_DISCLAIMER: &str = "\
GivBux / TROPTIONS Pay is evidence and documentation tracking only. \
No live payment processing, merchant acceptance guarantees, charity payouts, \
rewards, income, or token transactions are enabled. All live GivBux operations \
require evidence verification, provider agreement, and board approval.";

/// GivBux claim record — evidence-gated.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GivBuxClaimRecord {
    pub claim_id: Uuid,
    pub claim_type: GivBuxClaimType,
    pub claim_text_hash: String,
    pub status: ClaimStatus,
    pub evidence_hashes: Vec<String>,
    pub public_use_allowed: bool,
    pub risk_flags: Vec<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl GivBuxClaimRecord {
    /// Create new GivBux claim.
    pub fn new(claim_type: GivBuxClaimType, claim_text: &str) -> Self {
        let text_hash = Self::hash_content(claim_text);

        // Determine default status based on claim type
        let status = match claim_type {
            GivBuxClaimType::IncomeGuarantee
            | GivBuxClaimType::CompensationPlan
            | GivBuxClaimType::CustomerRewards => ClaimStatus::Blocked,
            GivBuxClaimType::MerchantCount
            | GivBuxClaimType::PaymentRail
            | GivBuxClaimType::TroptionsPayAcceptance => ClaimStatus::NeedsEvidence,
            _ => ClaimStatus::NeedsEvidence,
        };

        let risk_flags = match claim_type {
            GivBuxClaimType::IncomeGuarantee => {
                vec!["income claims require strict evidence and regulatory approval".to_string()]
            }
            GivBuxClaimType::MerchantCount => {
                vec!["merchant count claims require partner verification".to_string()]
            }
            GivBuxClaimType::PaymentRail => {
                vec!["payment rail claims require provider agreement".to_string()]
            }
            _ => vec![],
        };

        GivBuxClaimRecord {
            claim_id: Uuid::new_v4(),
            claim_type,
            claim_text_hash: text_hash,
            status,
            evidence_hashes: Vec::new(),
            public_use_allowed: status != ClaimStatus::Blocked,
            risk_flags,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        }
    }

    /// Attach evidence.
    pub fn attach_evidence(&mut self, evidence_hash: String) -> Result<(), GivBuxError> {
        self.evidence_hashes.push(evidence_hash);
        self.updated_at = Utc::now();
        Ok(())
    }

    /// Mark as verified.
    pub fn mark_verified(&mut self) -> Result<(), GivBuxError> {
        if self.status == ClaimStatus::Blocked {
            return Err(GivBuxError::CannotVerifyBlockedClaim);
        }
        self.status = ClaimStatus::Verified;
        self.public_use_allowed = true;
        self.updated_at = Utc::now();
        Ok(())
    }

    /// Block claim.
    pub fn block(&mut self, reason: String) -> Result<(), GivBuxError> {
        self.status = ClaimStatus::Blocked;
        self.public_use_allowed = false;
        self.risk_flags.push(reason);
        self.updated_at = Utc::now();
        Ok(())
    }

    /// Retire claim.
    pub fn retire(&mut self) -> Result<(), GivBuxError> {
        self.status = ClaimStatus::Retired;
        self.public_use_allowed = false;
        self.updated_at = Utc::now();
        Ok(())
    }

    /// Generate deterministic claim hash.
    pub fn compute_claim_hash(&self) -> String {
        let mut hasher = Sha256::new();
        let json = serde_json::json!({
            "claim_id": self.claim_id.to_string(),
            "claim_type": format!("{:?}", self.claim_type),
            "text_hash": self.claim_text_hash,
            "status": format!("{:?}", self.status),
        });
        hasher.update(serde_json::to_string(&json).unwrap_or_default().as_bytes());
        format!("{:x}", hasher.finalize())
    }

    fn hash_content(content: &str) -> String {
        let mut hasher = Sha256::new();
        hasher.update(content.as_bytes());
        format!("{:x}", hasher.finalize())
    }
}

/// GivBux evidence engine.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GivBuxEvidenceEngine {
    pub claims: BTreeMap<Uuid, GivBuxClaimRecord>,
    pub engine_hash: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl GivBuxEvidenceEngine {
    /// Create new engine.
    pub fn new() -> Self {
        GivBuxEvidenceEngine {
            claims: BTreeMap::new(),
            engine_hash: String::new(),
            created_at: Utc::now(),
            updated_at: Utc::now(),
        }
    }

    /// Add claim.
    pub fn add_claim(&mut self, claim: GivBuxClaimRecord) -> Result<Uuid, GivBuxError> {
        let claim_id = claim.claim_id;
        self.claims.insert(claim_id, claim);
        self.updated_at = Utc::now();
        self.engine_hash = self.compute_engine_hash();
        Ok(claim_id)
    }

    /// Get claim.
    pub fn get_claim(&self, claim_id: Uuid) -> Option<&GivBuxClaimRecord> {
        self.claims.get(&claim_id)
    }

    /// Get claim mutable.
    pub fn get_claim_mut(&mut self, claim_id: Uuid) -> Option<&mut GivBuxClaimRecord> {
        self.claims.get_mut(&claim_id)
    }

    /// List claims by status.
    pub fn list_by_status(&self, status: ClaimStatus) -> Vec<&GivBuxClaimRecord> {
        self.claims
            .values()
            .filter(|claim| claim.status == status)
            .collect()
    }

    /// List claims by type.
    pub fn list_by_type(&self, claim_type: GivBuxClaimType) -> Vec<&GivBuxClaimRecord> {
        self.claims
            .values()
            .filter(|claim| claim.claim_type == claim_type)
            .collect()
    }

    /// Compute deterministic engine hash.
    pub fn compute_engine_hash(&self) -> String {
        let mut hasher = Sha256::new();
        let sorted_json = serde_json::to_string(&self.claims)
            .unwrap_or_default();
        hasher.update(sorted_json.as_bytes());
        format!("{:x}", hasher.finalize())
    }

    /// Generate summary.
    pub fn generate_summary(&self) -> GivBuxEngineSummary {
        let verified = self.list_by_status(ClaimStatus::Verified).len();
        let needs_evidence = self.list_by_status(ClaimStatus::NeedsEvidence).len();
        let blocked = self.list_by_status(ClaimStatus::Blocked).len();
        let under_review = self.list_by_status(ClaimStatus::UnderReview).len();

        GivBuxEngineSummary {
            total_claims: self.claims.len(),
            verified_count: verified,
            needs_evidence_count: needs_evidence,
            blocked_count: blocked,
            under_review_count: under_review,
            engine_hash: self.engine_hash.clone(),
            disclaimer: GIVBUX_DISCLAIMER.to_string(),
        }
    }
}

impl Default for GivBuxEvidenceEngine {
    fn default() -> Self {
        Self::new()
    }
}

/// Summary of GivBux evidence engine.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GivBuxEngineSummary {
    pub total_claims: usize,
    pub verified_count: usize,
    pub needs_evidence_count: usize,
    pub blocked_count: usize,
    pub under_review_count: usize,
    pub engine_hash: String,
    pub disclaimer: String,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_income_claim_defaults_blocked() {
        let claim = GivBuxClaimRecord::new(
            GivBuxClaimType::IncomeGuarantee,
            "Earn thousands monthly",
        );
        assert_eq!(claim.status, ClaimStatus::Blocked);
        assert!(!claim.public_use_allowed);
    }

    #[test]
    fn test_merchant_claim_defaults_needs_evidence() {
        let claim =
            GivBuxClaimRecord::new(GivBuxClaimType::MerchantCount, "430000 merchants");
        assert_eq!(claim.status, ClaimStatus::NeedsEvidence);
    }

    #[test]
    fn test_engine_hash_deterministic() {
        let mut engine1 = GivBuxEvidenceEngine::new();
        let mut engine2 = GivBuxEvidenceEngine::new();

        let claim1 = GivBuxClaimRecord::new(GivBuxClaimType::MerchantCount, "430000");
        let claim2 = GivBuxClaimRecord::new(GivBuxClaimType::MerchantCount, "430000");

        engine1.add_claim(claim1).unwrap();
        engine2.add_claim(claim2).unwrap();

        // Same claims produce deterministic hashes
        assert_eq!(engine1.engine_hash, engine2.engine_hash);
    }

    #[test]
    fn test_cannot_mark_blocked_verified() {
        let mut claim = GivBuxClaimRecord::new(
            GivBuxClaimType::IncomeGuarantee,
            "income claim",
        );
        assert!(claim.mark_verified().is_err());
    }
}
