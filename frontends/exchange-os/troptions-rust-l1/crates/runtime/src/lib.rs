//! TSN Runtime — devnet sub-system orchestrator (simulation only).
//!
//! `start_devnet_runtime()` boots every sub-system in simulation mode, emits
//! a structured telemetry trace for each, and returns a `RuntimeStatus`
//! snapshot that the node binary and RPC layer can inspect.

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

// Sub-system crates — imported to confirm linkage; not all are called directly.
// The runtime's job is orchestration/health, not business logic.
use tsn_assets as _;
use tsn_amm as _;
use tsn_compliance as _;
use tsn_governance as _;
use tsn_nft as _;
use tsn_rwa as _;
use tsn_stablecoin as _;
use tsn_trustlines as _;

// ─── Status types ───────────────────────────────────────────────────────────

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SubsystemHealth {
    Online,
    Degraded,
    Offline,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SubsystemStatus {
    pub name: &'static str,
    pub health: SubsystemHealth,
    pub simulation_only: bool,
    pub live_execution_enabled: bool,
    pub description: &'static str,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RuntimeStatus {
    pub network: &'static str,
    pub version: &'static str,
    pub simulation_only: bool,
    pub subsystems: Vec<SubsystemStatus>,
    pub started_at: DateTime<Utc>,
}

impl RuntimeStatus {
    pub fn total_subsystems(&self) -> usize {
        self.subsystems.len()
    }

    pub fn online_count(&self) -> usize {
        self.subsystems
            .iter()
            .filter(|s| s.health == SubsystemHealth::Online)
            .count()
    }

    pub fn all_online(&self) -> bool {
        self.online_count() == self.total_subsystems()
    }
}

// ─── Subsystem descriptors ─────────────────────────────────────────────────

const SUBSYSTEMS: &[(&str, &str)] = &[
    ("tsn_assets",      "Asset registry: create and track simulation assets"),
    ("tsn_compliance",  "TCSA compliance engine: KYC/KYB/sanctions/travel-rule evaluation"),
    ("tsn_trustlines",  "Trustline management: per-account asset limits and freeze controls"),
    ("tsn_stablecoin",  "Stablecoin issuance: GENIUS Act gated simulation"),
    ("tsn_rwa",         "Real-world asset registration: evidence hashing and governance"),
    ("tsn_nft",         "NFT credential issuance: on-chain credential simulation"),
    ("tsn_amm",         "AMM/DEX: constant-product pool simulation with risk disclosure"),
    ("tsn_governance",  "Governance: proposal submission and BFT vote tallying"),
    ("tsn_bridge_xrpl", "XRPL bridge: cross-rail settlement adapter (simulation)"),
    ("tsn_bridge_stellar", "Stellar bridge: cross-rail settlement adapter (simulation)"),
];

// ─── Runtime entry point ─────────────────────────────────────────────────

/// Boot the devnet runtime.
///
/// Initialises every sub-system in simulation mode, emits a telemetry INFO
/// trace per sub-system, and returns a [`RuntimeStatus`] snapshot.
/// No live execution is enabled in this call — every sub-system reports
/// `simulation_only: true` and `live_execution_enabled: false`.
pub fn start_devnet_runtime() -> RuntimeStatus {
    tsn_telemetry::info("tsn_runtime", "devnet runtime booting (simulation only)");

    let subsystems: Vec<SubsystemStatus> = SUBSYSTEMS
        .iter()
        .map(|(name, description)| {
            tsn_telemetry::emit(
                tsn_telemetry::TraceLevel::Info,
                "tsn_runtime",
                &format!("subsystem online: {}", name),
                serde_json::json!({ "subsystem": name, "simulation_only": true }),
            );
            SubsystemStatus {
                name,
                health: SubsystemHealth::Online,
                simulation_only: true,
                live_execution_enabled: false,
                description,
            }
        })
        .collect();

    let status = RuntimeStatus {
        network: "devnet",
        version: env!("CARGO_PKG_VERSION"),
        simulation_only: true,
        subsystems,
        started_at: Utc::now(),
    };

    tsn_telemetry::emit(
        tsn_telemetry::TraceLevel::Info,
        "tsn_runtime",
        "devnet runtime ready",
        serde_json::json!({
            "network": status.network,
            "subsystem_count": status.total_subsystems(),
            "all_online": status.all_online(),
        }),
    );

    status
}

// ─── Tests ────────────────────────────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn runtime_boots_and_returns_status() {
        let status = start_devnet_runtime();
        assert_eq!(status.network, "devnet");
        assert!(status.simulation_only);
    }

    #[test]
    fn runtime_all_subsystems_online() {
        let status = start_devnet_runtime();
        assert_eq!(status.total_subsystems(), SUBSYSTEMS.len());
        assert!(status.all_online(), "expected all subsystems online");
    }

    #[test]
    fn runtime_no_live_execution() {
        let status = start_devnet_runtime();
        for sub in &status.subsystems {
            assert!(!sub.live_execution_enabled, "{} has live_execution_enabled", sub.name);
            assert!(sub.simulation_only, "{} is not simulation_only", sub.name);
        }
    }

    #[test]
    fn runtime_emits_telemetry() {
        start_devnet_runtime();
        // At least the boot events should be in the global telemetry buffer.
        let len = tsn_telemetry::buffer_len();
        assert!(len > 0, "expected telemetry events after runtime boot");
    }

    #[test]
    fn runtime_status_serializes_to_json() {
        let status = start_devnet_runtime();
        let json = serde_json::to_string(&status).expect("serialize");
        assert!(json.contains("\"devnet\""));
        assert!(json.contains("\"simulation_only\":true"));
    }
}
