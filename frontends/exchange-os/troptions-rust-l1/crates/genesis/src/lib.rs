#![allow(dead_code)]

//! TSN Genesis — Troptions Settlement Network genesis block builder.
//!
//! Assembles the canonical entity graph from all registered brands, wallets,
//! assets, chains, and governance anchors.  Produces a deterministic genesis
//! manifest serialisable to JSON for IPFS pinning.
//!
//! SIMULATION-ONLY — no live transactions, issuances, or settlements.

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use tsn_brands::{all_brands, BrandEntity, TROPTIONS_GENESIS_OPERATOR};

// ─── Chain Records ─────────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize)]
pub struct XrplGenesisConfig {
    /// TROPTIONS IOU issuer (active, use only for read / trust-line setup)
    pub issuer_address: &'static str,
    /// Safe treasury wallet (OPTKAS Genesis — not compromised)
    pub treasury_address: &'static str,
    /// TROPTIONS currency hex (XLS-20 compatible, 40 chars)
    pub currency_hex: &'static str,
    /// Human-readable currency code
    pub currency_code: &'static str,
    /// Recommended trust-line limit per holder
    pub default_trust_limit: &'static str,
    /// Post-compromise notes
    pub compromise_notes: &'static [&'static str],
    pub simulation_only: bool,
}

#[derive(Debug, Clone, Serialize)]
pub struct StellarGenesisConfig {
    /// Issuer account (generated 2026-02-07, NOT yet funded on mainnet)
    pub issuer_address: &'static str,
    /// Distribution account
    pub distribution_address: &'static str,
    /// Anchor account
    pub anchor_address: &'static str,
    pub asset_code: &'static str,
    pub activation_status: &'static str,
    pub simulation_only: bool,
}

#[derive(Debug, Clone, Serialize)]
pub struct PolygonGenesisConfig {
    pub quantum_vault_factory: &'static str,
    pub kenny_token_address: &'static str,
    pub evl_token_address: &'static str,
    pub network: &'static str,
    pub simulation_only: bool,
}

#[derive(Debug, Clone, Serialize)]
pub struct ApostleChainConfig {
    pub chain_id: u32,
    pub operator_agent_id: &'static str,
    pub rpc_port: u16,
    pub simulation_only: bool,
}

// ─── Asset Records ────────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum GenesisAssetType {
    XrplIou,
    XrplMpt,
    XrplNft,
    StellarCustomAsset,
    PolygonErc20,
}

#[derive(Debug, Clone, Serialize)]
pub struct GenesisAsset {
    pub symbol: &'static str,
    pub name: &'static str,
    pub asset_type: GenesisAssetType,
    pub chain: &'static str,
    pub issuer_or_contract: &'static str,
    pub max_supply: Option<&'static str>,
    pub decimals: u8,
    pub status: &'static str,
    pub xls_standard: Option<&'static str>,
    pub simulation_only: bool,
}

// ─── NFT Type Definitions (XLS-20) ────────────────────────────────────────────

#[derive(Debug, Clone, Serialize)]
pub struct NftTypeDefinition {
    pub collection_id: &'static str,
    pub brand_id: &'static str,
    pub name: &'static str,
    pub description: &'static str,
    pub xls_standard: &'static str,
    pub transfer_fee_basis_pts: u16,
    pub transferable: bool,
    pub burnable: bool,
    pub max_supply: Option<u64>,
    pub status: &'static str,
    pub simulation_only: bool,
}

// ─── MPT Definitions (XLS-33) ─────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize)]
pub struct MptDefinition {
    pub symbol: &'static str,
    pub name: &'static str,
    pub max_amount: &'static str,
    pub asset_scale: u8,
    pub transfer_fee_basis_pts: u16,
    pub flags: &'static [&'static str],
    pub issuer_role: &'static str,
    pub status: &'static str,
    pub xls_standard: &'static str,
    pub simulation_only: bool,
}

// ─── Governance Anchors ───────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize)]
pub struct GenesisGovernance {
    pub model: &'static str,
    pub voting_mechanism: &'static str,
    pub quorum_threshold_pct: u8,
    pub upgrade_authority: &'static str,
    pub compliance_gate: &'static str,
}

// ─── Genesis Manifest ─────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize)]
pub struct GenesisOperator {
    pub name: &'static str,
    pub organization: &'static str,
    pub role: &'static str,
}

#[derive(Debug, Clone, Serialize)]
pub struct TsnGenesisManifest {
    pub genesis_version: &'static str,
    pub chain_id: &'static str,
    pub network_name: &'static str,
    pub genesis_height: u64,
    pub genesis_timestamp: DateTime<Utc>,
    pub operator: GenesisOperator,
    pub brands: Vec<BrandEntity>,
    pub xrpl: XrplGenesisConfig,
    pub stellar: StellarGenesisConfig,
    pub polygon: PolygonGenesisConfig,
    pub apostle_chain: ApostleChainConfig,
    pub assets: Vec<GenesisAsset>,
    pub nft_collections: Vec<NftTypeDefinition>,
    pub mpt_definitions: Vec<MptDefinition>,
    pub governance: GenesisGovernance,
    /// SHA-256 of the manifest JSON (excluding this field) — see `seal()`
    pub genesis_hash: String,
    pub ipfs_cid: Option<String>,
    pub simulation_only: bool,
}

// ─── Build Functions ──────────────────────────────────────────────────────────

fn xrpl_config() -> XrplGenesisConfig {
    XrplGenesisConfig {
        issuer_address: "rPF2M1QjdVh1hkNgmMMTkT9qMU7tA7Wds3",
        treasury_address: "rncYwc1ss8AdV2vKjaYwMAEj7RNRfKRV4r",
        currency_hex: "54524F5054494F4E530000000000000000000000",
        currency_code: "TROPTIONS",
        default_trust_limit: "1000000000",
        compromise_notes: &[
            "Primary wallet rpP12ND2K7ZRzXZBEUnQM2i18tMGytXnW1 COMPROMISED 2026-02-25",
            "Master key disabled 2026-02-25. Regular key swapped twice.",
            "~184M USDT, ~20M GOLD, ~50M EUR drained 2026-03-05 00:29-00:38 UTC",
            "NFTs burned 2026-02-21. Forensics registry confirmed empty.",
            "DO NOT use rpP12ND2K7ZRzXZBEUnQM2i18tMGytXnW1 for any new operations.",
            "Fresh brand-specific wallets must be generated for each entity going live.",
        ],
        simulation_only: true,
    }
}

fn stellar_config() -> StellarGenesisConfig {
    StellarGenesisConfig {
        issuer_address: "GBJIMHMBGTPN5RS42OGBUY5NC2ATZLPT3B3EWV32SM2GQLS46TRJWG4I",
        distribution_address: "GAKCD7OKDM4HLZDBEE7KXTRFAYIE755UHL3JFQEOOHDPIMM5GEFY3RPF",
        anchor_address: "GC6O6Q7FG5FZGHE5D5BHGA6ZTLRAU7UWFJKKWNOJ36G3PKVVKVYLQGA6",
        asset_code: "TROPTIONS",
        activation_status: "accounts_generated_not_yet_funded_or_activated",
        simulation_only: true,
    }
}

fn polygon_config() -> PolygonGenesisConfig {
    PolygonGenesisConfig {
        quantum_vault_factory: "0x9BE7E2A62D8fE9b76E50cBDB9C4e0B80a8b7Ff3A",
        kenny_token_address: "0x93F2a3e8E13E0B81B5cE3a84b5c1BC23E1Ac45Ce",
        evl_token_address: "0xAFe18578D2E7d4C3a9aA5Ef0EF85c2a2D57Bb1A",
        network: "polygon-mainnet",
        simulation_only: true,
    }
}

fn apostle_config() -> ApostleChainConfig {
    ApostleChainConfig {
        chain_id: 7332,
        operator_agent_id: "87724c76-da93-4b1a-9fa6-271ba856338e",
        rpc_port: 7332,
        simulation_only: true,
    }
}

fn genesis_assets() -> Vec<GenesisAsset> {
    vec![
        GenesisAsset {
            symbol: "TROPTIONS",
            name: "Troptions",
            asset_type: GenesisAssetType::XrplIou,
            chain: "xrpl",
            issuer_or_contract: "rPF2M1QjdVh1hkNgmMMTkT9qMU7tA7Wds3",
            max_supply: None,
            decimals: 6,
            status: "active_read_only",
            xls_standard: None,
            simulation_only: false,
        },
        GenesisAsset {
            symbol: "OPTKAS",
            name: "OPTKAS Claim Receipt",
            asset_type: GenesisAssetType::XrplIou,
            chain: "xrpl",
            issuer_or_contract: "rncYwc1ss8AdV2vKjaYwMAEj7RNRfKRV4r",
            max_supply: None,
            decimals: 6,
            status: "spec_issued_gated",
            xls_standard: None,
            simulation_only: true,
        },
        GenesisAsset {
            symbol: "SOVBND",
            name: "Sovereign Bond Receipt",
            asset_type: GenesisAssetType::XrplIou,
            chain: "xrpl",
            issuer_or_contract: "rncYwc1ss8AdV2vKjaYwMAEj7RNRfKRV4r",
            max_supply: None,
            decimals: 6,
            status: "spec_only_gated",
            xls_standard: None,
            simulation_only: true,
        },
        GenesisAsset {
            symbol: "IMPERIA",
            name: "Imperial Commodity Claim",
            asset_type: GenesisAssetType::XrplIou,
            chain: "xrpl",
            issuer_or_contract: "rncYwc1ss8AdV2vKjaYwMAEj7RNRfKRV4r",
            max_supply: None,
            decimals: 6,
            status: "spec_only_gated",
            xls_standard: None,
            simulation_only: true,
        },
        GenesisAsset {
            symbol: "GEMVLT",
            name: "Gem Vault Receipt",
            asset_type: GenesisAssetType::XrplIou,
            chain: "xrpl",
            issuer_or_contract: "rncYwc1ss8AdV2vKjaYwMAEj7RNRfKRV4r",
            max_supply: None,
            decimals: 6,
            status: "spec_only_gated",
            xls_standard: None,
            simulation_only: true,
        },
        GenesisAsset {
            symbol: "TERRAVL",
            name: "Terra Value — Real Estate",
            asset_type: GenesisAssetType::XrplIou,
            chain: "xrpl",
            issuer_or_contract: "rncYwc1ss8AdV2vKjaYwMAEj7RNRfKRV4r",
            max_supply: None,
            decimals: 6,
            status: "spec_only_gated",
            xls_standard: None,
            simulation_only: true,
        },
        GenesisAsset {
            symbol: "PETRO",
            name: "Petroleum Commodity Claim",
            asset_type: GenesisAssetType::XrplIou,
            chain: "xrpl",
            issuer_or_contract: "rncYwc1ss8AdV2vKjaYwMAEj7RNRfKRV4r",
            max_supply: None,
            decimals: 6,
            status: "review_required_high_risk",
            xls_standard: None,
            simulation_only: true,
        },
        GenesisAsset {
            symbol: "ATTEST",
            name: "Evidence Attestation Marker",
            asset_type: GenesisAssetType::XrplNft,
            chain: "xrpl",
            issuer_or_contract: "rncYwc1ss8AdV2vKjaYwMAEj7RNRfKRV4r",
            max_supply: None,
            decimals: 0,
            status: "spec_only_gated",
            xls_standard: Some("XLS-20"),
            simulation_only: true,
        },
        GenesisAsset {
            symbol: "TUT",
            name: "Troptions Unity Token",
            asset_type: GenesisAssetType::XrplMpt,
            chain: "xrpl",
            issuer_or_contract: "PENDING_FRESH_WALLET",
            max_supply: Some("1000000000"),
            decimals: 6,
            status: "spec_only_xls33_pending_legal_clearance",
            xls_standard: Some("XLS-33"),
            simulation_only: true,
        },
    ]
}

fn nft_collections() -> Vec<NftTypeDefinition> {
    vec![
        NftTypeDefinition {
            collection_id: "nft-troptions-org-credential",
            brand_id: "troptions-org",
            name: "TROPTIONS.ORG Institutional Credential",
            description: "Verifiable institutional credential NFT issued by TROPTIONS.ORG to verified participants.",
            xls_standard: "XLS-20",
            transfer_fee_basis_pts: 0,
            transferable: false,
            burnable: true,
            max_supply: None,
            status: "spec_only_pending_re_issuance_post_compromise",
            simulation_only: true,
        },
        NftTypeDefinition {
            collection_id: "nft-troptions-xchange-member",
            brand_id: "troptions-xchange",
            name: "Troptions Xchange Member NFT",
            description: "Exchange membership credential for verified Troptions Xchange participants.",
            xls_standard: "XLS-20",
            transfer_fee_basis_pts: 0,
            transferable: false,
            burnable: true,
            max_supply: None,
            status: "spec_only_wallet_pending",
            simulation_only: true,
        },
        NftTypeDefinition {
            collection_id: "nft-troptions-university-cert",
            brand_id: "troptions-university",
            name: "Troptions University Completion Certificate",
            description: "Course completion and certification credential NFT for Troptions University graduates.",
            xls_standard: "XLS-20",
            transfer_fee_basis_pts: 0,
            transferable: false,
            burnable: false,
            max_supply: None,
            status: "spec_only_wallet_pending",
            simulation_only: true,
        },
        NftTypeDefinition {
            collection_id: "nft-troptions-tv-media-access",
            brand_id: "troptions-tv-network",
            name: "Troptions TV Premium Access NFT",
            description: "Media access credential for Troptions Television Network premium content.",
            xls_standard: "XLS-20",
            transfer_fee_basis_pts: 0,
            transferable: true,
            burnable: true,
            max_supply: None,
            status: "spec_only_wallet_pending",
            simulation_only: true,
        },
        NftTypeDefinition {
            collection_id: "nft-real-estate-proof-of-interest",
            brand_id: "real-estate-connections",
            name: "Real Estate Proof-of-Interest NFT",
            description: "Non-transferable proof-of-interest token for verified real estate opportunities in the Troptions RWA pipeline.",
            xls_standard: "XLS-20",
            transfer_fee_basis_pts: 0,
            transferable: false,
            burnable: true,
            max_supply: None,
            status: "spec_only_wallet_pending",
            simulation_only: true,
        },
        NftTypeDefinition {
            collection_id: "nft-green-n-go-solar-rec",
            brand_id: "green-n-go-solar",
            name: "Green-N-Go Solar REC NFT",
            description: "Renewable Energy Certificate credential NFT for solar installations registered in the Troptions ecosystem.",
            xls_standard: "XLS-20",
            transfer_fee_basis_pts: 0,
            transferable: true,
            burnable: true,
            max_supply: None,
            status: "spec_only_wallet_pending",
            simulation_only: true,
        },
        NftTypeDefinition {
            collection_id: "nft-hotrcw-service-credential",
            brand_id: "hotrcw",
            name: "HOTRCW Service Credential NFT",
            description: "Service platform access and credential NFT for verified HOTRCW participants.",
            xls_standard: "XLS-20",
            transfer_fee_basis_pts: 0,
            transferable: false,
            burnable: true,
            max_supply: None,
            status: "spec_only_model_under_review",
            simulation_only: true,
        },
        NftTypeDefinition {
            collection_id: "nft-troptions-unity-token-stake",
            brand_id: "troptions-unity-token",
            name: "Troptions Unity Token Genesis Stake NFT",
            description: "Genesis-epoch stake credential for founding TUT holders. Non-transferable, non-burnable.",
            xls_standard: "XLS-20",
            transfer_fee_basis_pts: 0,
            transferable: false,
            burnable: false,
            max_supply: Some(1000),
            status: "spec_only_securities_counsel_review_required",
            simulation_only: true,
        },
    ]
}

fn mpt_definitions() -> Vec<MptDefinition> {
    vec![
        MptDefinition {
            symbol: "TUT",
            name: "Troptions Unity Token",
            max_amount: "1000000000",
            asset_scale: 6,
            transfer_fee_basis_pts: 0,
            flags: &["lsfMPTCanTransfer", "lsfMPTCanTrade"],
            issuer_role: "PENDING_FRESH_XRPL_WALLET",
            status: "spec_only_xls33_pending_legal_clearance_and_fresh_wallet",
            xls_standard: "XLS-33",
            simulation_only: true,
        },
    ]
}

fn genesis_governance() -> GenesisGovernance {
    GenesisGovernance {
        model: "HotStuff BFT simulation layer",
        voting_mechanism: "GENIUS Act compliant proposal/vote/execute pipeline",
        quorum_threshold_pct: 67,
        upgrade_authority: "Bryan Stone / FTH Trading board",
        compliance_gate: "Legal review + board authorization required for all live state transitions",
    }
}

/// Build the full genesis manifest.  The `genesis_hash` field in the returned
/// struct is computed by sealing the manifest after initial construction.
pub fn build_genesis() -> TsnGenesisManifest {
    let mut manifest = TsnGenesisManifest {
        genesis_version: "1.0",
        chain_id: "tsn-mainnet",
        network_name: "Troptions Settlement Network",
        genesis_height: 0,
        genesis_timestamp: chrono::DateTime::parse_from_rfc3339("2026-04-27T00:00:00Z")
            .unwrap()
            .with_timezone(&Utc),
        operator: GenesisOperator {
            name: TROPTIONS_GENESIS_OPERATOR.name,
            organization: TROPTIONS_GENESIS_OPERATOR.organization,
            role: TROPTIONS_GENESIS_OPERATOR.role,
        },
        brands: all_brands(),
        xrpl: xrpl_config(),
        stellar: stellar_config(),
        polygon: polygon_config(),
        apostle_chain: apostle_config(),
        assets: genesis_assets(),
        nft_collections: nft_collections(),
        mpt_definitions: mpt_definitions(),
        governance: genesis_governance(),
        genesis_hash: String::new(),
        ipfs_cid: None,
        simulation_only: true,
    };

    manifest.genesis_hash = compute_genesis_hash(&manifest);
    manifest
}

/// Compute SHA-256 of the genesis manifest with `genesis_hash` zeroed out.
pub fn compute_genesis_hash(manifest: &TsnGenesisManifest) -> String {
    let mut hashable = manifest.clone();
    hashable.genesis_hash = String::from("0000000000000000000000000000000000000000000000000000000000000000");
    let canonical =
        serde_json::to_string(&hashable).unwrap_or_default();
    let mut hasher = Sha256::new();
    hasher.update(canonical.as_bytes());
    hex::encode(hasher.finalize())
}

/// Serialize genesis manifest to canonical JSON for IPFS.
pub fn genesis_to_json(manifest: &TsnGenesisManifest) -> String {
    serde_json::to_string_pretty(manifest).unwrap_or_default()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn genesis_builds_without_panic() {
        let m = build_genesis();
        assert_eq!(m.genesis_height, 0);
        assert_eq!(m.chain_id, "tsn-mainnet");
    }

    #[test]
    fn genesis_contains_all_8_brands() {
        let m = build_genesis();
        assert_eq!(m.brands.len(), 8);
    }

    #[test]
    fn genesis_hash_is_non_empty() {
        let m = build_genesis();
        assert_eq!(m.genesis_hash.len(), 64, "SHA-256 hex must be 64 chars");
    }

    #[test]
    fn genesis_hash_is_deterministic() {
        let h1 = build_genesis().genesis_hash;
        let h2 = build_genesis().genesis_hash;
        assert_eq!(h1, h2, "genesis hash must be deterministic");
    }

    #[test]
    fn genesis_serialises_to_valid_json() {
        let m = build_genesis();
        let json = genesis_to_json(&m);
        let parsed: serde_json::Value = serde_json::from_str(&json).expect("valid JSON");
        assert!(parsed.is_object());
    }

    #[test]
    fn genesis_has_8_nft_collections() {
        let m = build_genesis();
        assert_eq!(m.nft_collections.len(), 8);
    }

    #[test]
    fn genesis_has_tut_mpt_definition() {
        let m = build_genesis();
        let tut = m.mpt_definitions.iter().find(|d| d.symbol == "TUT");
        assert!(tut.is_some(), "TUT MPT must be in genesis");
        assert_eq!(tut.unwrap().xls_standard, "XLS-33");
    }

    #[test]
    fn all_genesis_assets_have_non_empty_symbols() {
        let m = build_genesis();
        for a in &m.assets {
            assert!(!a.symbol.is_empty());
        }
    }

    #[test]
    fn xrpl_config_has_compromise_notes() {
        let m = build_genesis();
        assert!(!m.xrpl.compromise_notes.is_empty());
        assert!(m.xrpl.compromise_notes.iter().any(|n| n.contains("COMPROMISED")));
    }

    #[test]
    fn stellar_config_accounts_not_yet_activated() {
        let m = build_genesis();
        assert!(m.stellar.activation_status.contains("not_yet_funded"));
    }
}
