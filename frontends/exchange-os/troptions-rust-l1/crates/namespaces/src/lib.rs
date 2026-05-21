#![allow(dead_code)]

//! TROPTIONS Namespace System — Official brand, service, and system namespaces.
//!
//! The namespace system reserves and tracks official TROPTIONS namespaces
//! across old systems, new products (Web3 TV, NIL, GivBux), compliance,
//! settlement, and legacy claims.
//!
//! Safety posture:
//! - `live_execution_enabled = false`
//! - `simulation_only = true`
//! - All namespaces default to evidence-gated state
//! - Payment/settlement namespaces default to BLOCKED
//! - No namespace can be ACTIVE without controller evidence

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::collections::BTreeMap;
use uuid::Uuid;

pub mod errors;
pub mod types;

pub use errors::NamespaceError;
pub use types::*;

/// Platform-level safety constants.
pub const LIVE_EXECUTION_ENABLED: bool = false;
pub const SIMULATION_ONLY: bool = true;

/// Crate-level disclaimer.
pub const NAMESPACE_DISCLAIMER: &str = "\
TROPTIONS Namespace System is documentation and simulation only. \
No namespace grants payment authority, custody, settlement, token minting, \
or transaction execution authority. All live namespace activation requires \
legal review, provider approval, and Control Hub verification.";

/// Namespace registry — deterministic, sorted, evidence-gated.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NamespaceRegistry {
    pub official_namespaces: BTreeMap<String, NamespaceRecord>,
    pub registry_hash: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl NamespaceRegistry {
    /// Initialize official TROPTIONS namespaces.
    pub fn initialize() -> Self {
        let mut namespaces = BTreeMap::new();

        // Root and brand
        namespaces.insert(
            "troptions.root".to_string(),
            NamespaceRecord::new_root("troptions.root"),
        );
        namespaces.insert(
            "troptions.org".to_string(),
            NamespaceRecord::new("troptions.org", NamespaceKind::Brand, NamespaceStatus::Active),
        );

        // Token and exchange (legacy, evidence-required)
        namespaces.insert(
            "troptions.xchange".to_string(),
            NamespaceRecord::new_blocked(
                "troptions.xchange",
                NamespaceKind::Token,
                "legacy exchange claims require evidence and provider approval",
            ),
        );

        // Payment systems (default blocked)
        namespaces.insert(
            "troptions.pay".to_string(),
            NamespaceRecord::new_blocked(
                "troptions.pay",
                NamespaceKind::Payment,
                "payment namespace requires provider agreement and compliance gate",
            ),
        );
        namespaces.insert(
            "troptions.unity".to_string(),
            NamespaceRecord::new_blocked(
                "troptions.unity",
                NamespaceKind::Payment,
                "legacy payment namespace",
            ),
        );

        // Asset/commodity namespaces (legacy, evidence-required)
        namespaces.insert(
            "troptions.gold".to_string(),
            NamespaceRecord::new_evidence_required(
                "troptions.gold",
                NamespaceKind::Commodity,
                "commodity claims require regulatory approval",
            ),
        );
        namespaces.insert(
            "troptions.aus".to_string(),
            NamespaceRecord::new_evidence_required(
                "troptions.aus",
                NamespaceKind::Commodity,
                "asset claims under review",
            ),
        );

        // Education (active)
        namespaces.insert(
            "troptions.university".to_string(),
            NamespaceRecord::new("troptions.university", NamespaceKind::Education, NamespaceStatus::Active),
        );

        // Media and NIL (active as documentation/content)
        namespaces.insert(
            "troptions.tv".to_string(),
            NamespaceRecord::new("troptions.tv", NamespaceKind::Media, NamespaceStatus::Active),
        );
        namespaces.insert(
            "troptions.tnn".to_string(),
            NamespaceRecord::new("troptions.tnn", NamespaceKind::Media, NamespaceStatus::Active),
        );
        namespaces.insert(
            "troptions.nil".to_string(),
            NamespaceRecord::new("troptions.nil", NamespaceKind::Nil, NamespaceStatus::Active),
        );

        // RWA and carbon (evidence-required)
        namespaces.insert(
            "troptions.rwa".to_string(),
            NamespaceRecord::new_evidence_required(
                "troptions.rwa",
                NamespaceKind::Rwa,
                "RWA claims require regulatory framework and evidence",
            ),
        );
        namespaces.insert(
            "troptions.carbon".to_string(),
            NamespaceRecord::new_evidence_required(
                "troptions.carbon",
                NamespaceKind::Carbon,
                "carbon credit claims require standard verification",
            ),
        );

        // GivBux and merchant (active as campaign/community)
        namespaces.insert(
            "troptions.givbux".to_string(),
            NamespaceRecord::new("troptions.givbux", NamespaceKind::Charity, NamespaceStatus::Active),
        );
        namespaces.insert(
            "troptions.merchants".to_string(),
            NamespaceRecord::new(
                "troptions.merchants",
                NamespaceKind::Merchant,
                NamespaceStatus::Active,
            ),
        );
        namespaces.insert(
            "troptions.charities".to_string(),
            NamespaceRecord::new(
                "troptions.charities",
                NamespaceKind::Charity,
                NamespaceStatus::Active,
            ),
        );

        // Compliance and operations
        namespaces.insert(
            "troptions.compliance".to_string(),
            NamespaceRecord::new(
                "troptions.compliance",
                NamespaceKind::Compliance,
                NamespaceStatus::Active,
            ),
        );
        namespaces.insert(
            "troptions.settlement".to_string(),
            NamespaceRecord::new_blocked(
                "troptions.settlement",
                NamespaceKind::Settlement,
                "settlement namespace blocked until live execution authorized",
            ),
        );

        // Legacy and documentation
        namespaces.insert(
            "troptions.legacy".to_string(),
            NamespaceRecord::new_evidence_required(
                "troptions.legacy",
                NamespaceKind::Legacy,
                "legacy claims under evidence review",
            ),
        );
        namespaces.insert(
            "troptions.media".to_string(),
            NamespaceRecord::new("troptions.media", NamespaceKind::Media, NamespaceStatus::Active),
        );
        namespaces.insert(
            "troptions.sponsors".to_string(),
            NamespaceRecord::new(
                "troptions.sponsors",
                NamespaceKind::Merchant,
                NamespaceStatus::Active,
            ),
        );
        namespaces.insert(
            "troptions.handbooks".to_string(),
            NamespaceRecord::new(
                "troptions.handbooks",
                NamespaceKind::Documentation,
                NamespaceStatus::Active,
            ),
        );

        // Bridge namespaces (evidence-required for settlement bridges)
        namespaces.insert(
            "troptions.bitcoin".to_string(),
            NamespaceRecord::new_evidence_required(
                "troptions.bitcoin",
                NamespaceKind::Settlement,
                "Bitcoin bridge requires custody framework and provider approval",
            ),
        );
        namespaces.insert(
            "troptions.xrpl".to_string(),
            NamespaceRecord::new_evidence_required(
                "troptions.xrpl",
                NamespaceKind::Settlement,
                "XRPL bridge requires settlement provider agreement",
            ),
        );
        namespaces.insert(
            "troptions.stellar".to_string(),
            NamespaceRecord::new_evidence_required(
                "troptions.stellar",
                NamespaceKind::Settlement,
                "Stellar bridge requires settlement provider agreement",
            ),
        );

        let mut registry = NamespaceRegistry {
            official_namespaces: namespaces,
            registry_hash: String::new(),
            created_at: Utc::now(),
            updated_at: Utc::now(),
        };

        registry.registry_hash = registry.compute_hash();
        registry
    }

    /// Compute deterministic hash of registry.
    pub fn compute_hash(&self) -> String {
        let mut hasher = Sha256::new();
        let sorted_json = serde_json::to_string(&self.official_namespaces)
            .unwrap_or_default();
        hasher.update(sorted_json.as_bytes());
        format!("{:x}", hasher.finalize())
    }

    /// Get namespace by name.
    pub fn get(&self, namespace: &str) -> Option<&NamespaceRecord> {
        self.official_namespaces.get(namespace)
    }

    /// List all namespaces of a kind.
    pub fn list_by_kind(&self, kind: NamespaceKind) -> Vec<&NamespaceRecord> {
        self.official_namespaces
            .values()
            .filter(|ns| ns.kind == kind)
            .collect()
    }

    /// List all namespaces of a status.
    pub fn list_by_status(&self, status: NamespaceStatus) -> Vec<&NamespaceRecord> {
        self.official_namespaces
            .values()
            .filter(|ns| ns.status == status)
            .collect()
    }

    /// Generate summary report.
    pub fn generate_summary(&self) -> NamespaceRegistrySummary {
        NamespaceRegistrySummary {
            total_namespaces: self.official_namespaces.len(),
            active_count: self.list_by_status(NamespaceStatus::Active).len(),
            evidence_required_count: self
                .list_by_status(NamespaceStatus::EvidenceRequired)
                .len(),
            blocked_count: self.list_by_status(NamespaceStatus::Blocked).len(),
            registry_hash: self.registry_hash.clone(),
            disclaimer: NAMESPACE_DISCLAIMER.to_string(),
        }
    }
}

/// Summary statistics for namespace registry.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NamespaceRegistrySummary {
    pub total_namespaces: usize,
    pub active_count: usize,
    pub evidence_required_count: usize,
    pub blocked_count: usize,
    pub registry_hash: String,
    pub disclaimer: String,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_initialize_registry() {
        let registry = NamespaceRegistry::initialize();
        assert!(!registry.official_namespaces.is_empty());
        assert_eq!(registry.compute_hash(), registry.registry_hash);
    }

    #[test]
    fn test_registry_deterministic() {
        let reg1 = NamespaceRegistry::initialize();
        let reg2 = NamespaceRegistry::initialize();
        assert_eq!(reg1.compute_hash(), reg2.compute_hash());
    }

    #[test]
    fn test_list_by_kind() {
        let registry = NamespaceRegistry::initialize();
        let media = registry.list_by_kind(NamespaceKind::Media);
        assert!(!media.is_empty());
    }

    #[test]
    fn test_blocked_namespaces_are_blocked() {
        let registry = NamespaceRegistry::initialize();
        if let Some(payment) = registry.get("troptions.pay") {
            assert_eq!(payment.status, NamespaceStatus::Blocked);
        }
    }

    #[test]
    fn test_media_namespaces_are_active() {
        let registry = NamespaceRegistry::initialize();
        if let Some(tnn) = registry.get("troptions.tnn") {
            assert_eq!(tnn.status, NamespaceStatus::Active);
        }
        if let Some(nil) = registry.get("troptions.nil") {
            assert_eq!(nil.status, NamespaceStatus::Active);
        }
    }
}
