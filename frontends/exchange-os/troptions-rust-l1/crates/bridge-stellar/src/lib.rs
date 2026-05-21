#![allow(dead_code)]

use chrono::Utc;
use tsn_state::{AuditEvent, AuditEventType, CrossRailRoute, CrossRailTarget};
use uuid::Uuid;

pub fn simulate_stellar_route(asset_id: Uuid, amount_string: &str) -> (CrossRailRoute, AuditEvent) {
    let route_id = Uuid::new_v4();
    let route = CrossRailRoute {
        route_id,
        source_network: CrossRailTarget::Stellar,
        dest_network: CrossRailTarget::TsnInternal,
        asset_id,
        amount_string: amount_string.to_string(),
        compliance_requirements: vec!["stellar_trust_line_established".to_string()],
        blocked_actions: vec!["platform_simulation_gate_active".to_string()],
        required_approvals: vec![
            "control_hub_approval".to_string(),
            "stellar_bridge_operator_approval".to_string(),
        ],
        simulation_only: true,
        created_at: Utc::now(),
    };
    let audit = AuditEvent::new(
        AuditEventType::CrossRailRouteSimulated,
        "tsn_bridge_stellar",
        "Stellar cross-rail route simulated",
        serde_json::json!({"route_id": route_id.to_string(), "simulation_only": true}),
    );
    (route, audit)
}
