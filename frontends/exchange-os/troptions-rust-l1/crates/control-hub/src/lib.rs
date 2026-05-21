#![allow(dead_code)]

//! TSN Control Hub Bridge — Rust interface matching the TypeScript Control Hub
//! (Clawd/OpenClaw/Jefe) governance shape.
//! All structs use camelCase for JSON to match TypeScript exactly.

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use tsn_state::{AuditEvent, AuditEventType};
use uuid::Uuid;

/// A task submitted to the Control Hub for review/approval.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ControlHubTask {
    pub task_id: String,
    pub task_type: String,
    pub origin_crate: String,
    pub payload: serde_json::Value,
    pub simulation_only: bool,
    pub required_approvals: Vec<String>,
    pub submitted_at: DateTime<Utc>,
}

/// The result of a Control Hub simulation evaluation.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ControlHubSimulation {
    pub simulation_id: String,
    pub task_id: String,
    pub simulation_only: bool,
    pub allowed: bool,
    pub blocked_reasons: Vec<String>,
    pub compliance_summary: String,
    pub evaluated_at: DateTime<Utc>,
}

/// A Control Hub approval record (camelCase for TypeScript compatibility).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ControlHubApproval {
    pub approval_id: String,
    pub task_id: String,
    pub approver_id: String,
    pub approved: bool,
    pub note: String,
    pub approved_at: DateTime<Utc>,
}

/// A blocked action recorded by the Control Hub.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ControlHubBlockedAction {
    pub blocked_action_id: String,
    pub task_id: String,
    pub blocked_reason: String,
    pub blocked_at: DateTime<Utc>,
    pub simulation_only: bool,
}

/// Audit record written for every Control Hub operation.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ControlHubAuditRecord {
    pub audit_id: String,
    pub task_id: String,
    pub event_type: String,
    pub origin: String,
    pub details: serde_json::Value,
    pub simulation_only: bool,
    pub recorded_at: DateTime<Utc>,
}

impl ControlHubAuditRecord {
    pub fn new(task_id: &str, event_type: &str, origin: &str, details: serde_json::Value) -> Self {
        Self {
            audit_id: Uuid::new_v4().to_string(),
            task_id: task_id.to_string(),
            event_type: event_type.to_string(),
            origin: origin.to_string(),
            details,
            simulation_only: true,
            recorded_at: Utc::now(),
        }
    }
}

/// Submit a task to the Control Hub and receive a simulation result.
/// All tasks are blocked in scaffold — platform simulation gate active.
pub fn submit_to_control_hub(task: &ControlHubTask) -> (ControlHubSimulation, AuditEvent) {
    let sim_id = Uuid::new_v4().to_string();

    let simulation = ControlHubSimulation {
        simulation_id: sim_id.clone(),
        task_id: task.task_id.clone(),
        simulation_only: true,
        allowed: false,
        blocked_reasons: vec![
            "platform_simulation_gate_active".to_string(),
            "awaiting_control_hub_review".to_string(),
        ],
        compliance_summary: format!(
            "Task '{}' of type '{}' submitted for simulation review.",
            task.task_id, task.task_type
        ),
        evaluated_at: Utc::now(),
    };

    let audit_event = AuditEvent::new(
        AuditEventType::GovernanceDecisionRecorded,
        &task.origin_crate,
        &format!(
            "Control Hub task submitted (simulation): {}",
            task.task_type
        ),
        serde_json::json!({
            "task_id": task.task_id,
            "task_type": task.task_type,
            "simulation_only": true,
        }),
    );

    (simulation, audit_event)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn control_hub_task_always_blocked_in_simulation() {
        let task = ControlHubTask {
            task_id: Uuid::new_v4().to_string(),
            task_type: "stablecoin_issuance".to_string(),
            origin_crate: "tsn-stablecoin".to_string(),
            payload: serde_json::json!({"amount": "1000000000"}),
            simulation_only: true,
            required_approvals: vec!["control_hub_approval".to_string()],
            submitted_at: Utc::now(),
        };
        let (sim, _audit) = submit_to_control_hub(&task);
        assert!(sim.simulation_only);
        assert!(!sim.allowed);
        assert!(sim
            .blocked_reasons
            .iter()
            .any(|r| r.contains("platform_simulation_gate_active")));
    }

    #[test]
    fn control_hub_audit_record_camelcase_serializes() {
        let record = ControlHubAuditRecord::new(
            "task-123",
            "stablecoin_issuance",
            "tsn-stablecoin",
            serde_json::json!({"amount": "1000"}),
        );
        let json = serde_json::to_string(&record).unwrap();
        // camelCase keys must appear in JSON output
        assert!(json.contains("taskId"));
        assert!(json.contains("eventType"));
        assert!(json.contains("simulationOnly"));
        assert!(json.contains("recordedAt"));
    }
}
