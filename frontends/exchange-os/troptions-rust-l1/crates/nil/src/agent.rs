#![allow(dead_code)]

//! TSN NIL — Agent profile registry.
//!
//! Defines 9 simulation-only NIL agent profiles.
//! All agents require Control Hub approval before any production action.
//! No external API calls, live payments, or NFT minting are enabled.

use serde::{Deserialize, Serialize};

/// A NIL agent profile definition.
#[derive(Debug, Clone, Serialize)]
pub struct NilAgentProfile {
    pub agent_id: &'static str,
    pub display_name: &'static str,
    pub description: &'static str,
    pub capabilities: &'static [&'static str],
    pub simulation_only: bool,
    pub external_api_calls_enabled: bool,
    pub requires_control_hub_approval: bool,
    pub live_execution_enabled: bool,
    pub live_payment_enabled: bool,
}

const NIL_AGENTS: [NilAgentProfile; 9] = [
    NilAgentProfile {
        agent_id: "nil_orchestrator_agent",
        display_name: "NIL Orchestrator Agent",
        description: "Coordinates NIL workflow across all subsystems — \
            identity, valuation, compliance, deal receipts, and proof vault. \
            All production flows are gated through Control Hub.",
        capabilities: &[
            "coordinate_nil_workflow",
            "route_to_subsystem",
            "require_control_hub_gate",
            "emit_audit_trail",
        ],
        simulation_only: true,
        external_api_calls_enabled: false,
        requires_control_hub_approval: true,
        live_execution_enabled: false,
        live_payment_enabled: false,
    },
    NilAgentProfile {
        agent_id: "athlete_identity_agent",
        display_name: "Athlete Identity Agent",
        description: "Manages athlete identity registration, SHA-256 hashing, \
            and pseudonymous profile records. No PII is stored on-chain. \
            Minor athlete identity requires guardian approval.",
        capabilities: &[
            "register_identity",
            "hash_athlete_profile",
            "verify_identity_record",
            "require_minor_consent",
        ],
        simulation_only: true,
        external_api_calls_enabled: false,
        requires_control_hub_approval: true,
        live_execution_enabled: false,
        live_payment_enabled: false,
    },
    NilAgentProfile {
        agent_id: "signal_collection_agent",
        display_name: "Signal Collection Agent",
        description: "Collects and validates NIL signal data across 33 signals \
            in 6 buckets. No live data APIs are called. All signal inputs are \
            manually provided or simulated.",
        capabilities: &[
            "collect_signal_scores",
            "validate_signal_data",
            "normalize_signal_scores",
            "report_missing_signals",
        ],
        simulation_only: true,
        external_api_calls_enabled: false,
        requires_control_hub_approval: true,
        live_execution_enabled: false,
        live_payment_enabled: false,
    },
    NilAgentProfile {
        agent_id: "valuation_agent",
        display_name: "Valuation Agent",
        description: "Computes composite NIL valuation scores and estimate ranges \
            using the 33-signal protocol. Output is an estimate only — not a \
            guaranteed NIL value, deal, or income.",
        capabilities: &[
            "compute_composite_score",
            "generate_valuation_estimate",
            "assign_valuation_band",
            "explain_valuation_factors",
        ],
        simulation_only: true,
        external_api_calls_enabled: false,
        requires_control_hub_approval: true,
        live_execution_enabled: false,
        live_payment_enabled: false,
    },
    NilAgentProfile {
        agent_id: "compliance_router_agent",
        display_name: "Compliance Router Agent",
        description: "Routes NIL deal parameters through state law, institution \
            overlay, minor consent, restricted category, pay-for-play, and \
            recruiting inducement checks. Blocks non-compliant deals.",
        capabilities: &[
            "evaluate_state_rules",
            "check_institution_overlay",
            "evaluate_minor_consent",
            "detect_restricted_categories",
            "detect_pay_for_play",
            "detect_recruiting_inducement",
        ],
        simulation_only: true,
        external_api_calls_enabled: false,
        requires_control_hub_approval: true,
        live_execution_enabled: false,
        live_payment_enabled: false,
    },
    NilAgentProfile {
        agent_id: "deal_receipt_agent",
        display_name: "Deal Receipt Agent",
        description: "Creates unsigned NIL deal receipt templates with cryptographic \
            hash proofs. No live payment, settlement, or token transfer is enabled. \
            All production deal receipts require legal review.",
        capabilities: &[
            "hash_deal_payload",
            "create_unsigned_receipt",
            "verify_receipt_hash",
            "create_web3_receipt_template",
        ],
        simulation_only: true,
        external_api_calls_enabled: false,
        requires_control_hub_approval: true,
        live_execution_enabled: false,
        live_payment_enabled: false,
    },
    NilAgentProfile {
        agent_id: "proof_vault_agent",
        display_name: "Proof Vault Agent",
        description: "Stores document hash references in the NIL proof vault. \
            Raw documents remain off-chain. Computes Merkle roots from document \
            hash sets. IPFS CID references are stored but not pinned in devnet.",
        capabilities: &[
            "hash_document",
            "create_vault_record",
            "compute_merkle_root",
            "create_anchor_template",
        ],
        simulation_only: true,
        external_api_calls_enabled: false,
        requires_control_hub_approval: true,
        live_execution_enabled: false,
        live_payment_enabled: false,
    },
    NilAgentProfile {
        agent_id: "governance_gate_agent",
        display_name: "Governance Gate Agent",
        description: "Evaluates NIL governance decisions and enforces Control Hub \
            approval gates. Blocks live execution, payments, minting, and Web3 \
            anchoring. Emits governance audit events.",
        capabilities: &[
            "evaluate_governance_decision",
            "gate_live_actions",
            "require_control_hub_approval",
            "emit_governance_audit",
        ],
        simulation_only: true,
        external_api_calls_enabled: false,
        requires_control_hub_approval: true,
        live_execution_enabled: false,
        live_payment_enabled: false,
    },
    NilAgentProfile {
        agent_id: "audit_recorder_agent",
        display_name: "Audit Recorder Agent",
        description: "Records all NIL simulation actions, compliance checks, \
            governance decisions, and blocked actions to the audit trail. \
            No sensitive athlete data is written to audit logs.",
        capabilities: &[
            "record_audit_event",
            "record_blocked_action",
            "record_governance_decision",
            "summarize_nil_audit_trail",
        ],
        simulation_only: true,
        external_api_calls_enabled: false,
        requires_control_hub_approval: true,
        live_execution_enabled: false,
        live_payment_enabled: false,
    },
];

/// Return all NIL agent profiles.
pub fn all_nil_agents() -> &'static [NilAgentProfile] {
    &NIL_AGENTS
}

/// Look up a NIL agent by ID.
pub fn get_nil_agent(agent_id: &str) -> Option<&'static NilAgentProfile> {
    NIL_AGENTS.iter().find(|a| a.agent_id == agent_id)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn nine_agents_defined() {
        assert_eq!(all_nil_agents().len(), 9);
    }

    #[test]
    fn all_agents_are_simulation_only() {
        for agent in all_nil_agents() {
            assert!(
                agent.simulation_only,
                "Agent {} is not simulation_only",
                agent.agent_id
            );
            assert!(
                !agent.live_execution_enabled,
                "Agent {} has live_execution_enabled",
                agent.agent_id
            );
            assert!(
                !agent.live_payment_enabled,
                "Agent {} has live_payment_enabled",
                agent.agent_id
            );
            assert!(
                !agent.external_api_calls_enabled,
                "Agent {} has external_api_calls_enabled",
                agent.agent_id
            );
            assert!(
                agent.requires_control_hub_approval,
                "Agent {} does not require_control_hub_approval",
                agent.agent_id
            );
        }
    }

    #[test]
    fn can_look_up_orchestrator() {
        let agent = get_nil_agent("nil_orchestrator_agent").unwrap();
        assert_eq!(agent.display_name, "NIL Orchestrator Agent");
    }
}
