#![allow(dead_code)]

use chrono::Utc;
use tsn_crypto::hash_evidence;
use tsn_state::{
    AuditEvent, AuditEventType, GovernanceDecision, JurisdictionCode, RwaAsset, RwaAssetType,
};
use uuid::Uuid;

pub struct RwaRegistrationRequest {
    pub asset_type: RwaAssetType,
    pub legal_name: String,
    pub jurisdiction: JurisdictionCode,
    pub valuation_usd_cents: u64,
    pub evidence_document: String, // Raw document text/JSON — hashed on registration
    pub custodian: String,
}

pub struct RwaRegistrationResult {
    pub simulation_id: Uuid,
    pub rwa_asset: RwaAsset,
    pub governance_decision: GovernanceDecision,
    pub audit_event: AuditEvent,
    pub simulation_only: bool,
}

pub fn register_rwa_simulation(req: &RwaRegistrationRequest) -> RwaRegistrationResult {
    let sim_id = Uuid::new_v4();
    let asset_id = Uuid::new_v4();
    let task_id = Uuid::new_v4().to_string();
    let audit_id = Uuid::new_v4().to_string();

    let evidence_hash = hash_evidence(&req.evidence_document);
    let valuation_hash = hash_evidence(&format!(
        "{}:{}:{}",
        asset_id, req.valuation_usd_cents, req.legal_name
    ));

    let rwa_asset = RwaAsset {
        asset_id,
        asset_type: req.asset_type.clone(),
        legal_name: req.legal_name.clone(),
        jurisdiction: req.jurisdiction.clone(),
        valuation_usd_cents: req.valuation_usd_cents,
        valuation_hash,
        evidence_hash: evidence_hash.clone(),
        custodian: req.custodian.clone(),
        simulation_only: true,
        live_execution_enabled: false,
        registered_at: Utc::now(),
    };

    let governance_decision = GovernanceDecision {
        task_id: task_id.clone(),
        audit_record_id: audit_id.clone(),
        allowed: false,
        simulation_only: true,
        blocked_actions: vec![
            "platform_simulation_gate_active".to_string(),
            "live_rwa_registry_blocked".to_string(),
        ],
        required_approvals: vec![
            "control_hub_approval".to_string(),
            "legal_review".to_string(),
            "custody_verification".to_string(),
        ],
        compliance_checks: vec![
            "platform_simulation_gate".to_string(),
            "rwa_jurisdiction".to_string(),
        ],
        audit_hint: "RWA registration simulation — legal review required".to_string(),
        decided_at: Utc::now(),
    };

    let audit_event = AuditEvent::new(
        AuditEventType::RwaRegistered,
        "tsn_rwa_runtime",
        "RWA registration simulated",
        serde_json::json!({
            "asset_id": asset_id.to_string(),
            "legal_name": req.legal_name,
            "evidence_hash": evidence_hash,
            "simulation_only": true,
        }),
    );

    RwaRegistrationResult {
        simulation_id: sim_id,
        rwa_asset,
        governance_decision,
        audit_event,
        simulation_only: true,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn rwa_evidence_hash_model_works() {
        let req = RwaRegistrationRequest {
            asset_type: RwaAssetType::RealEstate,
            legal_name: "Test Property LLC".to_string(),
            jurisdiction: JurisdictionCode("US".to_string()),
            valuation_usd_cents: 50_000_000_00,
            evidence_document: r#"{"deed":"recorded","county":"Fulton"}"#.to_string(),
            custodian: "Prime Custody LLC".to_string(),
        };
        let result = register_rwa_simulation(&req);
        assert!(result.simulation_only);
        assert_eq!(result.rwa_asset.evidence_hash.len(), 64); // sha256 hex
        assert!(!result.rwa_asset.evidence_hash.is_empty());
        assert!(!result.rwa_asset.live_execution_enabled);
    }
}
