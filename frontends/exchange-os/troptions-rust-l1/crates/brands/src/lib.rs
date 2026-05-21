#![allow(dead_code)]

//! TSN Brands — Troptions entity registry embedded in the Layer 1.
//!
//! All 8 TROPTIONS brand entities with chain registrations, asset symbols,
//! RWA categories, and system roles.  This is the canonical source of truth
//! for entity identity within the Troptions Settlement Network.
//!
//! All entries are informational and simulation-only.  No live issuance,
//! trading, exchange, or financial activity is enabled by this crate.

use serde::{Deserialize, Serialize};

// ─── Chain Registration ────────────────────────────────────────────────────────

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum TsnChain {
    Xrpl,
    Stellar,
    Polygon,
    ApostleChain,
    TsnInternal,
}

#[derive(Debug, Clone, Serialize)]
pub struct ChainRegistration {
    pub chain: TsnChain,
    pub role: &'static str,
    /// 0 = not started · 50 = in progress · 100 = live
    pub readiness: u8,
    pub notes: &'static str,
}

// ─── Brand Status ──────────────────────────────────────────────────────────────

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum BrandStatus {
    Active,
    Draft,
    NeedsReview,
    Planned,
    Suspended,
}

// ─── Brand Entity ─────────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize)]
pub struct BrandEntity {
    pub id: &'static str,
    pub display_name: &'static str,
    pub domain: &'static str,
    pub category: &'static str,
    pub system_role: &'static str,
    pub public_description: &'static str,
    pub chain_registrations: Vec<ChainRegistration>,
    pub xrpl_asset_symbol: Option<&'static str>,
    pub stellar_asset_symbol: Option<&'static str>,
    pub rwa_category: Option<&'static str>,
    pub status: BrandStatus,
    pub compliance_notes: &'static str,
    pub simulation_only: bool,
}

// ─── Genesis Operator ─────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize)]
pub struct GenesisOperator {
    pub name: &'static str,
    pub organization: &'static str,
    pub role: &'static str,
}

pub const TROPTIONS_GENESIS_OPERATOR: GenesisOperator = GenesisOperator {
    name: "Bryan Stone",
    organization: "FTH Trading / Troptions",
    role: "Founder and Genesis Operator",
};

// ─── The 8 TROPTIONS Brand Entities ──────────────────────────────────────────

pub fn troptions_org() -> BrandEntity {
    BrandEntity {
        id: "troptions-org",
        display_name: "TROPTIONS.ORG",
        domain: "TROPTIONS.ORG",
        category: "Institutional Platform",
        system_role: "Primary institutional operating infrastructure — the canonical platform entry point.",
        public_description: "Troptions is an institutional operating infrastructure platform for proof-gated RWA issuance, custody coordination, settlement readiness, and compliance workflows.",
        chain_registrations: vec![
            ChainRegistration { chain: TsnChain::Xrpl, role: "primary-issuer", readiness: 75, notes: "TROPTIONS IOU issuer active. NFT re-issuance pending post-compromise." },
            ChainRegistration { chain: TsnChain::Stellar, role: "anchor-issuer", readiness: 40, notes: "Accounts generated, funding and activation pending." },
            ChainRegistration { chain: TsnChain::Polygon, role: "observer", readiness: 50, notes: "Provider configuration required." },
            ChainRegistration { chain: TsnChain::TsnInternal, role: "genesis-entity", readiness: 100, notes: "Genesis entity — always active." },
        ],
        xrpl_asset_symbol: Some("TROPTIONS"),
        stellar_asset_symbol: Some("TROPTIONS"),
        rwa_category: None,
        status: BrandStatus::Active,
        compliance_notes: "Not a bank, broker-dealer, exchange, custodian, or licensed financial institution.",
        simulation_only: true,
    }
}

pub fn troptions_xchange() -> BrandEntity {
    BrandEntity {
        id: "troptions-xchange",
        display_name: "Troptions Xchange",
        domain: "TROPTIONSXCHANGE.IO",
        category: "Exchange / Trade Platform",
        system_role: "Exchange venue routing — structured barter, asset routing, and value-exchange workflows.",
        public_description: "Troptions Xchange is the trade and exchange coordination layer of the Troptions ecosystem.",
        chain_registrations: vec![
            ChainRegistration { chain: TsnChain::Xrpl, role: "exchange-wallet", readiness: 30, notes: "Fresh wallet pending generation post-compromise." },
            ChainRegistration { chain: TsnChain::Stellar, role: "exchange-anchor", readiness: 20, notes: "Anchor configuration pending." },
            ChainRegistration { chain: TsnChain::TsnInternal, role: "exchange-entity", readiness: 80, notes: "Registered in TSN entity graph." },
        ],
        xrpl_asset_symbol: Some("TXC"),
        stellar_asset_symbol: Some("TXC"),
        rwa_category: None,
        status: BrandStatus::Draft,
        compliance_notes: "ATS / exchange licensing review required before live execution.",
        simulation_only: true,
    }
}

pub fn troptions_unity_token() -> BrandEntity {
    BrandEntity {
        id: "troptions-unity-token",
        display_name: "Troptions Unity Token",
        domain: "TROPTIONSUNITYTOKEN.COM",
        category: "Token / Digital Asset",
        system_role: "Ecosystem coordination and governance participation token (TUT).",
        public_description: "Troptions Unity Token (TUT) represents ecosystem coordination and participation access within the Troptions infrastructure.",
        chain_registrations: vec![
            ChainRegistration { chain: TsnChain::Xrpl, role: "mpt-issuer", readiness: 25, notes: "XLS-33 MPT spec defined. Issuance pending legal clearance." },
            ChainRegistration { chain: TsnChain::Stellar, role: "asset-issuer", readiness: 20, notes: "Stellar asset spec defined. Activation pending." },
            ChainRegistration { chain: TsnChain::TsnInternal, role: "governance-token", readiness: 90, notes: "Registered in TSN governance layer." },
        ],
        xrpl_asset_symbol: Some("TUT"),
        stellar_asset_symbol: Some("TUT"),
        rwa_category: None,
        status: BrandStatus::Draft,
        compliance_notes: "Token issuance may constitute a securities offering. Securities counsel review required before any distribution.",
        simulation_only: true,
    }
}

pub fn troptions_university() -> BrandEntity {
    BrandEntity {
        id: "troptions-university",
        display_name: "Troptions University",
        domain: "TROPTIONS-UNIVERSITY.COM",
        category: "Education / Academy",
        system_role: "Education, certification, and onboarding layer for Troptions participants.",
        public_description: "Troptions University delivers structured education on Troptions ecosystem participation, barter economics, compliance, and institutional operating concepts.",
        chain_registrations: vec![
            ChainRegistration { chain: TsnChain::Xrpl, role: "credential-nft-issuer", readiness: 20, notes: "XLS-20 NFT credential spec defined. Issuance pending." },
            ChainRegistration { chain: TsnChain::TsnInternal, role: "education-entity", readiness: 85, notes: "Education module active in TSN portal." },
        ],
        xrpl_asset_symbol: Some("TUTCERT"),
        stellar_asset_symbol: None,
        rwa_category: None,
        status: BrandStatus::Active,
        compliance_notes: "Education content must not constitute investment advice or securities promotion.",
        simulation_only: true,
    }
}

pub fn troptions_tv_network() -> BrandEntity {
    BrandEntity {
        id: "troptions-tv-network",
        display_name: "Troptions Television Network",
        domain: "TROPTIONSTelevisionNetwork.Tv",
        category: "Media / Broadcasting",
        system_role: "Media broadcasting and content distribution for the Troptions ecosystem.",
        public_description: "Troptions Television Network hosts educational content, ecosystem updates, partner features, and community programming.",
        chain_registrations: vec![
            ChainRegistration { chain: TsnChain::Xrpl, role: "media-nft-issuer", readiness: 15, notes: "Media NFT credential spec defined. Content-backed NFTs pending." },
            ChainRegistration { chain: TsnChain::TsnInternal, role: "media-entity", readiness: 60, notes: "Media content module integrated with insights layer." },
        ],
        xrpl_asset_symbol: Some("TTVN"),
        stellar_asset_symbol: None,
        rwa_category: None,
        status: BrandStatus::Draft,
        compliance_notes: "Broadcast content must comply with FCC guidelines. Promotional content requires financial disclaimers.",
        simulation_only: true,
    }
}

pub fn real_estate_connections() -> BrandEntity {
    BrandEntity {
        id: "real-estate-connections",
        display_name: "The Real Estate Connections",
        domain: "TheRealEstateConnections.com",
        category: "Real Estate / RWA",
        system_role: "Real estate RWA intake and institutional coordination layer.",
        public_description: "The Real Estate Connections connects real estate assets to Troptions RWA and proof-gated infrastructure.",
        chain_registrations: vec![
            ChainRegistration { chain: TsnChain::Xrpl, role: "rwa-receipt-issuer", readiness: 30, notes: "OPTKAS IOU usable for real-estate RWA receipts. New wallet pending." },
            ChainRegistration { chain: TsnChain::Polygon, role: "rwa-registry", readiness: 50, notes: "QuantumVaultFactory usable. Provider configuration required." },
            ChainRegistration { chain: TsnChain::TsnInternal, role: "rwa-entity", readiness: 80, notes: "RWA operations module active." },
        ],
        xrpl_asset_symbol: Some("TERRAVL"),
        stellar_asset_symbol: None,
        rwa_category: Some("real_estate"),
        status: BrandStatus::Draft,
        compliance_notes: "Real estate brokerage and securities activities are heavily regulated. Legal review required before any activation.",
        simulation_only: true,
    }
}

pub fn green_n_go_solar() -> BrandEntity {
    BrandEntity {
        id: "green-n-go-solar",
        display_name: "Green-N-Go Solar",
        domain: "Green-N-Go.Solar",
        category: "Energy / ESG / Asset",
        system_role: "Solar and clean energy RWA, ESG reporting, and green asset coordination.",
        public_description: "Green-N-Go Solar connects solar installations, energy credits, and green asset documentation to Troptions institutional infrastructure.",
        chain_registrations: vec![
            ChainRegistration { chain: TsnChain::Xrpl, role: "energy-rwa-issuer", readiness: 20, notes: "Energy RWA receipt model defined. Wallet pending." },
            ChainRegistration { chain: TsnChain::TsnInternal, role: "energy-entity", readiness: 70, notes: "Energy module active. ESG reporting pending." },
        ],
        xrpl_asset_symbol: Some("SOLAR"),
        stellar_asset_symbol: None,
        rwa_category: Some("energy"),
        status: BrandStatus::Draft,
        compliance_notes: "Energy asset tokenization subject to CFTC, SEC, state utility commission, and EPA guidelines.",
        simulation_only: true,
    }
}

pub fn hotrcw() -> BrandEntity {
    BrandEntity {
        id: "hotrcw",
        display_name: "HOTRCW",
        domain: "HOTRCW.COM",
        category: "Utility / Service Platform",
        system_role: "Utility and service coordination — service-backed value exchange within the Troptions ecosystem.",
        public_description: "HOTRCW is a utility and service coordination platform connecting service-based value and operational workflows to the Troptions infrastructure.",
        chain_registrations: vec![
            ChainRegistration { chain: TsnChain::TsnInternal, role: "service-entity", readiness: 40, notes: "Service model under review. Chain integration pending confirmation." },
        ],
        xrpl_asset_symbol: None,
        stellar_asset_symbol: None,
        rwa_category: None,
        status: BrandStatus::NeedsReview,
        compliance_notes: "Service platform operations may require MSB licensing if payments are intermediated.",
        simulation_only: true,
    }
}

// ─── Brand Registry ────────────────────────────────────────────────────────────

/// Returns all 8 TROPTIONS brand entities.
pub fn all_brands() -> Vec<BrandEntity> {
    vec![
        troptions_org(),
        troptions_xchange(),
        troptions_unity_token(),
        troptions_university(),
        troptions_tv_network(),
        real_estate_connections(),
        green_n_go_solar(),
        hotrcw(),
    ]
}

/// Returns the brand entity for a given domain (case-insensitive).
pub fn brand_by_domain(domain: &str) -> Option<BrandEntity> {
    let d = domain.to_lowercase();
    all_brands()
        .into_iter()
        .find(|b| b.domain.to_lowercase() == d)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn all_8_brands_load() {
        let brands = all_brands();
        assert_eq!(brands.len(), 8);
    }

    #[test]
    fn all_brands_have_domains() {
        for b in all_brands() {
            assert!(!b.domain.is_empty(), "brand {} has no domain", b.id);
        }
    }

    #[test]
    fn all_brands_simulation_only() {
        for b in all_brands() {
            assert!(b.simulation_only, "brand {} must be simulation_only", b.id);
        }
    }

    #[test]
    fn all_brands_have_at_least_one_chain_registration() {
        for b in all_brands() {
            assert!(
                !b.chain_registrations.is_empty(),
                "brand {} has no chain registrations",
                b.id
            );
        }
    }

    #[test]
    fn brand_lookup_by_domain() {
        let b = brand_by_domain("TROPTIONS.ORG").unwrap();
        assert_eq!(b.id, "troptions-org");
    }

    #[test]
    fn genesis_operator_is_set() {
        assert_eq!(TROPTIONS_GENESIS_OPERATOR.name, "Bryan Stone");
        assert!(!TROPTIONS_GENESIS_OPERATOR.organization.is_empty());
    }

    #[test]
    fn troptions_org_has_xrpl_registration() {
        let b = troptions_org();
        let xrpl = b.chain_registrations.iter().find(|c| c.chain == TsnChain::Xrpl);
        assert!(xrpl.is_some(), "TROPTIONS.ORG must have XRPL registration");
    }

    #[test]
    fn unity_token_has_mpt_role() {
        let b = troptions_unity_token();
        let xrpl = b.chain_registrations.iter().find(|c| c.chain == TsnChain::Xrpl);
        assert!(xrpl.is_some());
        assert!(xrpl.unwrap().role.contains("mpt"));
    }
}
