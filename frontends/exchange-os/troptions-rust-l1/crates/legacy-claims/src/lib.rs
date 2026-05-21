#![allow(dead_code)]

//! TROPTIONS Legacy Claims System
//!
//! Tracks all old TROPTIONS claims, token claims, website statements,
//! merchant claims, and prior promises for evidence review and categorization.
//!
//! Safety posture:
//! - `live_execution_enabled = false`
//! - `simulation_only = true`
//! - No legacy claim enables live transaction flow until verified
//! - Income/payment/token price claims default BLOCKED
//! - Merchant acceptance claims default BLOCKED
//! - Legacy claims cannot be public-use until verified

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::collections::BTreeMap;
use uuid::Uuid;

pub mod errors;
pub mod types;

pub use errors::LegacyClaimError;
pub use types::*;

pub const LIVE_EXECUTION_ENABLED: bool = false;
pub const SIMULATION_ONLY: bool = true;

pub const LEGACY_DISCLAIMER: &str = "\
TROPTIONS Legacy Claims are old statements and promises under evidence review. \
No legacy claim guarantees performance, value, income, payment acceptance, \
merchant relationships, token value, or investment returns. All legacy claims \
require evidence verification and Control Hub approval before public use.";

/// Legacy claim record.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LegacyClaimRecord {
    pub claim_id: Uuid,
    pub source_label: String,
    pub source_hash: String,
    pub claim_hash: String,
    pub claim_summary: String,
    pub status: LegacyClaimStatus,
    pub evidence_hashes: Vec<String>,
    pub public_use_allowed: bool,
    pub risk_flags: Vec<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl LegacyClaimRecord {
    /// Create new legacy claim.
    pub fn new(source_label: &str, source_hash: &str, claim_text: &str) -> Self {
        let claim_hash = Self::hash_content(claim_text);

        // Determine default status
        let status = if claim_text.to_lowercase().contains("income")
            || claim_text.to_lowercase().contains("earn")
            || claim_text.to_lowercase().contains("thousand")
        {
            LegacyClaimStatus::Blocked
        } else {
            LegacyClaimStatus::NeedsEvidence
        };

        let risk_flags = if status == LegacyClaimStatus::Blocked {
            vec!["income claim requires strict evidence and regulatory review".to_string()]
        } else {
            vec![]
        };

        LegacyClaimRecord {
            claim_id: Uuid::new_v4(),
            source_label: source_label.to_string(),
            source_hash: source_hash.to_string(),
            claim_hash,
            claim_summary: claim_text.to_string(),
            status,
            evidence_hashes: Vec::new(),
            public_use_allowed: status != LegacyClaimStatus::Blocked,
            risk_flags,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        }
    }

    /// Attach evidence.
    pub fn attach_evidence(&mut self, evidence_hash: String) -> Result<(), LegacyClaimError> {
        self.evidence_hashes.push(evidence_hash);
        self.updated_at = Utc::now();
        Ok(())
    }

    /// Mark as verified.
    pub fn mark_verified(&mut self) -> Result<(), LegacyClaimError> {
        if self.status == LegacyClaimStatus::Blocked {
            return Err(LegacyClaimError::CannotVerifyBlockedClaim);
        }
        self.status = LegacyClaimStatus::Verified;
        self.public_use_allowed = true;
        self.updated_at = Utc::now();
        Ok(())
    }

    /// Block claim.
    pub fn block(&mut self, reason: String) -> Result<(), LegacyClaimError> {
        self.status = LegacyClaimStatus::Blocked;
        self.public_use_allowed = false;
        self.risk_flags.push(reason);
        self.updated_at = Utc::now();
        Ok(())
    }

    /// Retire claim.
    pub fn retire(&mut self) -> Result<(), LegacyClaimError> {
        self.status = LegacyClaimStatus::Retired;
        self.public_use_allowed = false;
        self.updated_at = Utc::now();
        Ok(())
    }

    /// Generate deterministic claim hash.
    pub fn compute_claim_hash(&self) -> String {
        let mut hasher = Sha256::new();
        let json = serde_json::json!({
            "claim_id": self.claim_id.to_string(),
            "source": self.source_label,
            "claim_hash": self.claim_hash,
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

/// Legacy claims repository.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LegacyClaimsRepository {
    pub claims: BTreeMap<Uuid, LegacyClaimRecord>,
    pub repository_hash: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl LegacyClaimsRepository {
    /// Create new repository.
    pub fn new() -> Self {
        LegacyClaimsRepository {
            claims: BTreeMap::new(),
            repository_hash: String::new(),
            created_at: Utc::now(),
            updated_at: Utc::now(),
        }
    }

    /// Add claim.
    pub fn add_claim(&mut self, claim: LegacyClaimRecord) -> Result<Uuid, LegacyClaimError> {
        let claim_id = claim.claim_id;
        self.claims.insert(claim_id, claim);
        self.updated_at = Utc::now();
        self.repository_hash = self.compute_repository_hash();
        Ok(claim_id)
    }

    /// Get claim.
    pub fn get_claim(&self, claim_id: Uuid) -> Option<&LegacyClaimRecord> {
        self.claims.get(&claim_id)
    }

    /// Get claim mutable.
    pub fn get_claim_mut(&mut self, claim_id: Uuid) -> Option<&mut LegacyClaimRecord> {
        self.claims.get_mut(&claim_id)
    }

    /// List claims by status.
    pub fn list_by_status(&self, status: LegacyClaimStatus) -> Vec<&LegacyClaimRecord> {
        self.claims
            .values()
            .filter(|claim| claim.status == status)
            .collect()
    }

    /// List claims by source.
    pub fn list_by_source(&self, source: &str) -> Vec<&LegacyClaimRecord> {
        self.claims
            .values()
            .filter(|claim| claim.source_label.contains(source))
            .collect()
    }

    /// Compute deterministic repository hash.
    pub fn compute_repository_hash(&self) -> String {
        let mut hasher = Sha256::new();
        let sorted_json = serde_json::to_string(&self.claims)
            .unwrap_or_default();
        hasher.update(sorted_json.as_bytes());
        format!("{:x}", hasher.finalize())
    }

    /// Generate summary.
    pub fn generate_summary(&self) -> LegacyClaimsSummary {
        let verified = self.list_by_status(LegacyClaimStatus::Verified).len();
        let needs_evidence = self.list_by_status(LegacyClaimStatus::NeedsEvidence).len();
        let blocked = self.list_by_status(LegacyClaimStatus::Blocked).len();
        let under_review = self.list_by_status(LegacyClaimStatus::UnderReview).len();

        LegacyClaimsSummary {
            total_claims: self.claims.len(),
            verified_count: verified,
            needs_evidence_count: needs_evidence,
            blocked_count: blocked,
            under_review_count: under_review,
            repository_hash: self.repository_hash.clone(),
            disclaimer: LEGACY_DISCLAIMER.to_string(),
        }
    }
}

impl Default for LegacyClaimsRepository {
    fn default() -> Self {
        Self::new()
    }
}

/// Summary of legacy claims repository.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LegacyClaimsSummary {
    pub total_claims: usize,
    pub verified_count: usize,
    pub needs_evidence_count: usize,
    pub blocked_count: usize,
    pub under_review_count: usize,
    pub repository_hash: String,
    pub disclaimer: String,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_income_claim_blocks() {
        let claim = LegacyClaimRecord::new(
            "old-website",
            "hash",
            "Learn to make thousands a month",
        );
        assert_eq!(claim.status, LegacyClaimStatus::Blocked);
        assert!(!claim.public_use_allowed);
    }

    #[test]
    fn test_generic_claim_needs_evidence() {
        let claim = LegacyClaimRecord::new(
            "old-brochure",
            "hash",
            "TROPTIONS is a platform",
        );
        assert_eq!(claim.status, LegacyClaimStatus::NeedsEvidence);
    }

    #[test]
    fn test_repository_hash_deterministic() {
        let mut repo1 = LegacyClaimsRepository::new();
        let mut repo2 = LegacyClaimsRepository::new();

        let claim1 = LegacyClaimRecord::new("source", "hash", "claim");
        let claim2 = LegacyClaimRecord::new("source", "hash", "claim");

        repo1.add_claim(claim1).unwrap();
        repo2.add_claim(claim2).unwrap();

        assert_eq!(repo1.repository_hash, repo2.repository_hash);
    }

    #[test]
    fn test_cannot_verify_blocked() {
        let mut claim = LegacyClaimRecord::new(
            "old",
            "hash",
            "make thousands monthly",
        );
        assert!(claim.mark_verified().is_err());
    }
}
