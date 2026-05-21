#![allow(dead_code)]

//! TSN Bridge — XRPL Cross-Rail Adapter (simulation only).
//! Models XRPL IOU/trust line routing paths.
//! No XRPL credentials, seed phrases, or live transactions in this crate.

use chrono::Utc;
use tsn_state::{AuditEvent, AuditEventType, CrossRailRoute, CrossRailTarget};
use uuid::Uuid;

/// Simulate an XRPL-sourced cross-rail route.
/// `asset_id_hint` can be Uuid::nil() for simulation; represents the TSN asset.
pub fn simulate_xrpl_route(asset_id: Uuid, amount_string: &str) -> (CrossRailRoute, AuditEvent) {
    let route_id = Uuid::new_v4();

    let route = CrossRailRoute {
        route_id,
        source_network: CrossRailTarget::Xrpl,
        dest_network: CrossRailTarget::TsnInternal,
        asset_id,
        amount_string: amount_string.to_string(),
        compliance_requirements: vec!["xrpl_trust_line_established".to_string()],
        blocked_actions: vec!["platform_simulation_gate_active".to_string()],
        required_approvals: vec![
            "control_hub_approval".to_string(),
            "xrpl_bridge_operator_approval".to_string(),
        ],
        simulation_only: true,
        created_at: Utc::now(),
    };

    let audit = AuditEvent::new(
        AuditEventType::CrossRailRouteSimulated,
        "tsn_bridge_xrpl",
        "XRPL cross-rail route simulated",
        serde_json::json!({
            "route_id": route_id.to_string(),
            "source_network": "xrpl",
            "asset_id": asset_id.to_string(),
            "simulation_only": true,
        }),
    );

    (route, audit)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn cross_rail_route_requires_approvals() {
        let (route, audit) = simulate_xrpl_route(Uuid::new_v4(), "10000000");
        assert!(route.simulation_only);
        assert!(route
            .required_approvals
            .contains(&"control_hub_approval".to_string()));
        assert!(route
            .required_approvals
            .contains(&"xrpl_bridge_operator_approval".to_string()));
        assert!(!route.blocked_actions.is_empty());
        assert_eq!(audit.actor, "tsn_bridge_xrpl");
    }
}
