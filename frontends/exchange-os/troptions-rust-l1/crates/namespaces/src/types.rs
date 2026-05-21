use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

/// Namespace status in the TROPTIONS system.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum NamespaceStatus {
    /// Reserved but not active.
    Reserved,
    /// Active and accepting activity.
    Active,
    /// Evidence required before activation.
    EvidenceRequired,
    /// Blocked from use.
    Blocked,
    /// Retired from service.
    Retired,
}

/// Namespace classification.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum NamespaceKind {
    /// Root namespace authority.
    Root,
    /// Brand namespace.
    Brand,
    /// Token or token-related.
    Token,
    /// Payment or payment rail.
    Payment,
    /// Commodity (gold, assets, etc).
    Commodity,
    /// Media or content distribution.
    Media,
    /// NIL (Name, Image, Likeness).
    Nil,
    /// Real World Asset.
    Rwa,
    /// Merchant platform.
    Merchant,
    /// Charity or giving platform.
    Charity,
    /// Compliance and governance.
    Compliance,
    /// Settlement or bridge.
    Settlement,
    /// Education or training.
    Education,
    /// Legacy or deprecated systems.
    Legacy,
    /// Carbon credits or environmental.
    Carbon,
    /// General documentation.
    Documentation,
}

/// Namespace record in the registry.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NamespaceRecord {
    pub namespace_id: Uuid,
    pub name: String,
    pub kind: NamespaceKind,
    pub status: NamespaceStatus,
    pub controller: Option<String>,
    pub parent_namespace: Option<String>,
    pub evidence_hashes: Vec<String>,
    pub ipfs_cids: Vec<String>,
    pub linked_contracts: Vec<Uuid>,
    pub risk_flags: Vec<String>,
    pub disclaimer: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl NamespaceRecord {
    /// Create a new active namespace.
    pub fn new(name: &str, kind: NamespaceKind, status: NamespaceStatus) -> Self {
        NamespaceRecord {
            namespace_id: Uuid::new_v4(),
            name: name.to_string(),
            kind,
            status,
            controller: None,
            parent_namespace: None,
            evidence_hashes: Vec::new(),
            ipfs_cids: Vec::new(),
            linked_contracts: Vec::new(),
            risk_flags: Vec::new(),
            disclaimer: format!("Namespace {} is documentation and simulation only.", name),
            created_at: Utc::now(),
            updated_at: Utc::now(),
        }
    }

    /// Create root namespace.
    pub fn new_root(name: &str) -> Self {
        NamespaceRecord {
            namespace_id: Uuid::new_v4(),
            name: name.to_string(),
            kind: NamespaceKind::Root,
            status: NamespaceStatus::Active,
            controller: Some("troptions-core".to_string()),
            parent_namespace: None,
            evidence_hashes: Vec::new(),
            ipfs_cids: Vec::new(),
            linked_contracts: Vec::new(),
            risk_flags: Vec::new(),
            disclaimer: "Root namespace — all TROPTIONS systems descend from troptions.root."
                .to_string(),
            created_at: Utc::now(),
            updated_at: Utc::now(),
        }
    }

    /// Create evidence-required namespace.
    pub fn new_evidence_required(name: &str, kind: NamespaceKind, reason: &str) -> Self {
        NamespaceRecord {
            namespace_id: Uuid::new_v4(),
            name: name.to_string(),
            kind,
            status: NamespaceStatus::EvidenceRequired,
            controller: None,
            parent_namespace: None,
            evidence_hashes: Vec::new(),
            ipfs_cids: Vec::new(),
            linked_contracts: Vec::new(),
            risk_flags: vec![reason.to_string()],
            disclaimer: format!("Namespace {} is evidence-gated: {}", name, reason),
            created_at: Utc::now(),
            updated_at: Utc::now(),
        }
    }

    /// Create blocked namespace.
    pub fn new_blocked(name: &str, kind: NamespaceKind, reason: &str) -> Self {
        NamespaceRecord {
            namespace_id: Uuid::new_v4(),
            name: name.to_string(),
            kind,
            status: NamespaceStatus::Blocked,
            controller: None,
            parent_namespace: None,
            evidence_hashes: Vec::new(),
            ipfs_cids: Vec::new(),
            linked_contracts: Vec::new(),
            risk_flags: vec![reason.to_string()],
            disclaimer: format!("Namespace {} is blocked: {}", name, reason),
            created_at: Utc::now(),
            updated_at: Utc::now(),
        }
    }

    /// Attach evidence hash.
    pub fn attach_evidence(&mut self, hash: String) {
        self.evidence_hashes.push(hash);
        self.updated_at = Utc::now();
    }

    /// Attach IPFS CID.
    pub fn attach_ipfs(&mut self, cid: String) {
        self.ipfs_cids.push(cid);
        self.updated_at = Utc::now();
    }

    /// Link contract.
    pub fn link_contract(&mut self, contract_id: Uuid) {
        self.linked_contracts.push(contract_id);
        self.updated_at = Utc::now();
    }

    /// Add risk flag.
    pub fn add_risk_flag(&mut self, flag: String) {
        self.risk_flags.push(flag);
        self.updated_at = Utc::now();
    }
}
