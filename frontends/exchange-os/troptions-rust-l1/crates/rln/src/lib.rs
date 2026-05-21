#![allow(dead_code)]

//! TSN RLN Adapter — Regulated Liability Network compatibility (simulation only).

use chrono::Utc;
use serde::{Deserialize, Serialize};
use tsn_state::{AuditEvent, AuditEventType};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum RegulatedLiabilityType {
    BankDeposit,
    CentralBankMoney,
    EMoney,
    WholesaleCbdc,
    RetailCbdc,
    InstitutionalSettlement,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RegulatedLiability {
    pub liability_id: Uuid,
    pub liability_type: RegulatedLiabilityType,
    pub issuing_institution: String,
    pub amount_string: String,
    pub currency_code: String,
    pub simulation_only: bool,
    pub regulated: bool,
    pub created_at: chrono::DateTime<Utc>,
}

pub fn simulate_rln_transfer(
    liability: &RegulatedLiability,
    destination_institution: &str,
) -> (RegulatedLiability, AuditEvent) {
    let settled = RegulatedLiability {
        liability_id: Uuid::new_v4(),
        simulation_only: true,
        ..liability.clone()
    };
    let audit = AuditEvent::new(
        AuditEventType::CrossRailRouteSimulated,
        "tsn_rln_adapter",
        &format!("RLN transfer simulated → {}", destination_institution),
        serde_json::json!({
            "source_liability_id": liability.liability_id.to_string(),
            "destination_institution": destination_institution,
            "simulation_only": true,
        }),
    );
    (settled, audit)
}

/// Confirm (finalise) a simulated RLN settlement.  Returns a new liability
/// record stamped with a fresh `liability_id` and a `SettlementConfirmed`
/// audit event.  Always `simulation_only = true`.
pub fn confirm_rln_settlement(
    liability: &RegulatedLiability,
    confirming_institution: &str,
) -> (RegulatedLiability, AuditEvent) {
    let confirmed = RegulatedLiability {
        liability_id: Uuid::new_v4(),
        simulation_only: true,
        regulated: true,
        ..liability.clone()
    };
    let audit = AuditEvent::new(
        AuditEventType::CrossRailRouteSimulated,
        "tsn_rln_adapter",
        &format!("RLN settlement confirmed by {}", confirming_institution),
        serde_json::json!({
            "original_liability_id": liability.liability_id.to_string(),
            "confirmed_liability_id": confirmed.liability_id.to_string(),
            "confirming_institution": confirming_institution,
            "simulation_only": true,
        }),
    );
    (confirmed, audit)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn sample_liability() -> RegulatedLiability {
        RegulatedLiability {
            liability_id: Uuid::new_v4(),
            liability_type: RegulatedLiabilityType::WholesaleCbdc,
            issuing_institution: "Central Bank Alpha".to_string(),
            amount_string: "5000000000".to_string(),
            currency_code: "USD".to_string(),
            simulation_only: true,
            regulated: true,
            created_at: Utc::now(),
        }
    }

    #[test]
    fn simulate_assigns_new_liability_id() {
        let src = sample_liability();
        let (transferred, _) = simulate_rln_transfer(&src, "Bank Beta");
        assert_ne!(transferred.liability_id, src.liability_id);
    }

    #[test]
    fn simulate_is_always_simulation_only() {
        let src = sample_liability();
        let (transferred, audit) = simulate_rln_transfer(&src, "Bank Beta");
        assert!(transferred.simulation_only);
        assert_eq!(audit.actor, "tsn_rln_adapter");
    }

    #[test]
    fn simulate_preserves_currency_and_amount() {
        let src = sample_liability();
        let (transferred, _) = simulate_rln_transfer(&src, "Bank Beta");
        assert_eq!(transferred.currency_code, "USD");
        assert_eq!(transferred.amount_string, "5000000000");
    }

    #[test]
    fn confirm_assigns_fresh_id() {
        let src = sample_liability();
        let (transferred, _) = simulate_rln_transfer(&src, "Bank Beta");
        let (confirmed, _) = confirm_rln_settlement(&transferred, "Central Bank Alpha");
        assert_ne!(confirmed.liability_id, transferred.liability_id);
    }

    #[test]
    fn confirm_emits_audit_event() {
        let src = sample_liability();
        let (transferred, _) = simulate_rln_transfer(&src, "Bank Beta");
        let (confirmed, audit) = confirm_rln_settlement(&transferred, "Central Bank Alpha");
        assert!(confirmed.regulated);
        assert!(audit.summary.contains("Central Bank Alpha"));
    }

    #[test]
    fn liability_types_serialize_correctly() {
        let types = vec![
            RegulatedLiabilityType::BankDeposit,
            RegulatedLiabilityType::CentralBankMoney,
            RegulatedLiabilityType::WholesaleCbdc,
            RegulatedLiabilityType::RetailCbdc,
        ];
        for t in &types {
            let s = serde_json::to_string(t).unwrap();
            assert!(!s.is_empty());
        }
    }
}
