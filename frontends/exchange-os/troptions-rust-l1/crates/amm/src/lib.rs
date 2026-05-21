#![allow(dead_code)]

//! TSN AMM/DEX Simulation — constant product (x*y=k) model.
//! All operations are simulation only.
//! Guaranteed yield, guaranteed returns, and guaranteed APY claims are explicitly blocked.

use chrono::Utc;
use tsn_state::{
    AuditEvent, AuditEventType, GovernanceDecision, LiquidityPool, PoolPermissionMode,
};
use uuid::Uuid;

pub struct AmmSimulationResult {
    pub simulation_id: Uuid,
    pub simulation_only: bool,
    pub governance_decision: GovernanceDecision,
    pub audit_event: AuditEvent,
    pub risk_disclosure_required: bool,
    pub risk_disclosure_text: String,
}

const RISK_DISCLOSURE: &str =
    "Liquidity provision carries risk of impermanent loss and loss of principal. \
    TSN does not guarantee any yield, return, or APY on liquidity provided. \
    All AMM operations are in simulation mode. No real assets are at risk.";

fn make_amm_decision(task_id: &str, audit_id: &str, operation: &str) -> GovernanceDecision {
    GovernanceDecision {
        task_id: task_id.to_string(),
        audit_record_id: audit_id.to_string(),
        allowed: false,
        simulation_only: true,
        blocked_actions: vec!["platform_simulation_gate_active".to_string()],
        required_approvals: vec![
            "control_hub_approval".to_string(),
            "risk_disclosure_acknowledged".to_string(),
        ],
        compliance_checks: vec![
            "platform_simulation_gate".to_string(),
            "lp_risk_disclosure".to_string(),
        ],
        audit_hint: format!("AMM {} simulation", operation),
        decided_at: Utc::now(),
    }
}

pub fn create_pool_simulation(
    asset_a_id: Uuid,
    asset_b_id: Uuid,
    fee_bps: u32,
    permission_mode: PoolPermissionMode,
    risk_disclosure_acknowledged: bool,
) -> AmmSimulationResult {
    let sim_id = Uuid::new_v4();
    let task_id = Uuid::new_v4().to_string();
    let audit_id = Uuid::new_v4().to_string();

    let pool = LiquidityPool {
        pool_id: Uuid::new_v4(),
        asset_a_id,
        asset_b_id,
        reserve_a_string: "0".to_string(),
        reserve_b_string: "0".to_string(),
        lp_fee_bps: fee_bps,
        permission_mode,
        risk_disclosure_acknowledged,
        simulation_only: true,
        created_at: Utc::now(),
    };

    let governance_decision = make_amm_decision(&task_id, &audit_id, "pool_creation");

    let audit_event = AuditEvent::new(
        AuditEventType::AmmSwapSimulated,
        "tsn_amm_runtime",
        "AMM pool creation simulated",
        serde_json::json!({
            "pool_id": pool.pool_id.to_string(),
            "risk_disclosure_acknowledged": risk_disclosure_acknowledged,
        }),
    );

    AmmSimulationResult {
        simulation_id: sim_id,
        simulation_only: true,
        governance_decision,
        audit_event,
        risk_disclosure_required: true,
        risk_disclosure_text: RISK_DISCLOSURE.to_string(),
    }
}

/// Simulate a constant product swap quote (x*y=k). Returns simulated output amount.
pub fn swap_quote_simulation(
    reserve_in_str: &str,
    reserve_out_str: &str,
    amount_in_str: &str,
    fee_bps: u32,
) -> (String, AuditEvent) {
    // All amounts as u128 for simulation arithmetic
    let reserve_in: u128 = reserve_in_str.parse().unwrap_or(0);
    let reserve_out: u128 = reserve_out_str.parse().unwrap_or(0);
    let amount_in: u128 = amount_in_str.parse().unwrap_or(0);

    let amount_in_after_fee = amount_in * (10_000 - fee_bps as u128) / 10_000;
    let amount_out = if reserve_in + amount_in_after_fee == 0 {
        0u128
    } else {
        reserve_out * amount_in_after_fee / (reserve_in + amount_in_after_fee)
    };

    let audit_event = AuditEvent::new(
        AuditEventType::AmmSwapSimulated,
        "tsn_amm_runtime",
        "AMM swap quote simulated — no guaranteed return",
        serde_json::json!({
            "amount_in": amount_in_str,
            "amount_out_simulated": amount_out.to_string(),
            "simulation_only": true,
            "risk_disclosure": RISK_DISCLOSURE,
        }),
    );

    (amount_out.to_string(), audit_event)
}

pub fn lp_risk_disclosure_check(acknowledged: bool) -> Result<(), String> {
    if !acknowledged {
        Err(
            "Risk disclosure must be acknowledged before LP operations. \
            No yield, return, or APY is guaranteed."
                .to_string(),
        )
    } else {
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn amm_liquidity_risk_disclosure_required() {
        let result = lp_risk_disclosure_check(false);
        assert!(result.is_err());
        assert!(result
            .unwrap_err()
            .contains("Risk disclosure must be acknowledged"));
    }

    #[test]
    fn amm_risk_disclosure_passes_when_acknowledged() {
        let result = lp_risk_disclosure_check(true);
        assert!(result.is_ok());
    }

    #[test]
    fn amm_pool_creation_is_simulation_only() {
        let result = create_pool_simulation(
            Uuid::new_v4(),
            Uuid::new_v4(),
            30,
            PoolPermissionMode::Permissioned,
            true,
        );
        assert!(result.simulation_only);
        assert!(result.risk_disclosure_required);
        assert!(!result.governance_decision.allowed);
    }

    #[test]
    fn swap_quote_simulation_produces_reasonable_output() {
        // reserve_in=10000, reserve_out=10000, amount_in=100, fee=30bps
        let (out, _) = swap_quote_simulation("10000", "10000", "100", 30);
        let out_val: u128 = out.parse().unwrap();
        // Should be roughly 98.7 (slightly less than 100 due to fee + price impact)
        assert!(out_val > 90 && out_val < 110);
    }
}
