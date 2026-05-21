#![allow(dead_code)]

//! TSN Agorá Adapter — BIS Agorá-style wholesale settlement compatibility (simulation only).

use chrono::Utc;
use serde::{Deserialize, Serialize};
use tsn_state::{AuditEvent, AuditEventType};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AgoraStyleSettlement {
    pub settlement_id: Uuid,
    pub originating_bank: String,
    pub correspondent_bank: String,
    pub amount_string: String,
    pub currency_code: String,
    pub fx_rate_string: String,
    pub simulation_only: bool,
    pub created_at: chrono::DateTime<Utc>,
}

pub fn simulate_agora_settlement(
    originating_bank: &str,
    correspondent_bank: &str,
    amount_string: &str,
    currency_code: &str,
) -> (AgoraStyleSettlement, AuditEvent) {
    let settlement_id = Uuid::new_v4();
    let settlement = AgoraStyleSettlement {
        settlement_id,
        originating_bank: originating_bank.to_string(),
        correspondent_bank: correspondent_bank.to_string(),
        amount_string: amount_string.to_string(),
        currency_code: currency_code.to_string(),
        fx_rate_string: "1.0".to_string(), // placeholder rate
        simulation_only: true,
        created_at: Utc::now(),
    };
    let audit = AuditEvent::new(
        AuditEventType::CrossRailRouteSimulated,
        "tsn_agora_adapter",
        "Agorá-style wholesale settlement simulated",
        serde_json::json!({
            "settlement_id": settlement_id.to_string(),
            "simulation_only": true,
        }),
    );
    (settlement, audit)
}

/// Apply a confirmed FX rate to a simulated Agorá settlement.
/// Returns an updated settlement record (same `settlement_id`) with the
/// supplied rate and a new audit event.  Always `simulation_only = true`.
pub fn apply_fx_rate(
    settlement: &AgoraStyleSettlement,
    actual_rate: &str,
) -> (AgoraStyleSettlement, AuditEvent) {
    let updated = AgoraStyleSettlement {
        fx_rate_string: actual_rate.to_string(),
        simulation_only: true,
        ..settlement.clone()
    };
    let audit = AuditEvent::new(
        AuditEventType::CrossRailRouteSimulated,
        "tsn_agora_adapter",
        &format!(
            "FX rate {} applied to Agorá settlement {}",
            actual_rate, settlement.settlement_id
        ),
        serde_json::json!({
            "settlement_id": settlement.settlement_id.to_string(),
            "previous_rate": settlement.fx_rate_string,
            "applied_rate": actual_rate,
            "simulation_only": true,
        }),
    );
    (updated, audit)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn make_settlement() -> AgoraStyleSettlement {
        simulate_agora_settlement(
            "Bank of England",
            "Banque de France",
            "100000000",
            "GBP",
        ).0
    }

    #[test]
    fn simulate_creates_settlement_with_simulation_only() {
        let (s, _) = simulate_agora_settlement("BoE", "BdF", "1000", "GBP");
        assert!(s.simulation_only);
    }

    #[test]
    fn simulate_preserves_bank_names() {
        let (s, _) = simulate_agora_settlement("Bank of England", "Banque de France", "1000", "GBP");
        assert_eq!(s.originating_bank, "Bank of England");
        assert_eq!(s.correspondent_bank, "Banque de France");
    }

    #[test]
    fn simulate_default_fx_rate_is_one() {
        let s = make_settlement();
        assert_eq!(s.fx_rate_string, "1.0");
    }

    #[test]
    fn apply_fx_rate_updates_rate() {
        let s = make_settlement();
        let (updated, audit) = apply_fx_rate(&s, "1.2456");
        assert_eq!(updated.fx_rate_string, "1.2456");
        assert_eq!(updated.settlement_id, s.settlement_id);
        assert!(audit.summary.contains("1.2456"));
    }

    #[test]
    fn settlement_serializes_to_json() {
        let s = make_settlement();
        let json = serde_json::to_value(&s).unwrap();
        assert_eq!(json["simulation_only"], true);
        assert_eq!(json["currency_code"], "GBP");
    }
}
