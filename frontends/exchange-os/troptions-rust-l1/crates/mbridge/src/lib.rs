#![allow(dead_code)]

//! TSN mBridge Adapter — BIS mBridge multi-CBDC compatibility (simulation only).

use chrono::Utc;
use serde::{Deserialize, Serialize};
use tsn_state::{AuditEvent, AuditEventType};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum CentralBankRouteStatus {
    Pending,
    ValidatedByOrigin,
    ValidatedByDestination,
    Settled,
    Rejected,
    SimulationOnly,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FxQuoteRecord {
    pub quote_id: Uuid,
    pub source_currency: String,
    pub target_currency: String,
    pub mid_rate_string: String,
    pub quoted_at: chrono::DateTime<Utc>,
    pub simulation_only: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MbridgeStyleInstruction {
    pub instruction_id: Uuid,
    pub originating_central_bank: String,
    pub receiving_central_bank: String,
    pub amount_string: String,
    pub fx_quote: FxQuoteRecord,
    pub status: CentralBankRouteStatus,
    pub simulation_only: bool,
    pub created_at: chrono::DateTime<Utc>,
}

pub fn simulate_mbridge_instruction(
    originating_cb: &str,
    receiving_cb: &str,
    amount_string: &str,
    source_currency: &str,
    target_currency: &str,
    mid_rate: &str,
) -> (MbridgeStyleInstruction, AuditEvent) {
    let instruction_id = Uuid::new_v4();
    let fx_quote = FxQuoteRecord {
        quote_id: Uuid::new_v4(),
        source_currency: source_currency.to_string(),
        target_currency: target_currency.to_string(),
        mid_rate_string: mid_rate.to_string(),
        quoted_at: Utc::now(),
        simulation_only: true,
    };
    let instruction = MbridgeStyleInstruction {
        instruction_id,
        originating_central_bank: originating_cb.to_string(),
        receiving_central_bank: receiving_cb.to_string(),
        amount_string: amount_string.to_string(),
        fx_quote,
        status: CentralBankRouteStatus::SimulationOnly,
        simulation_only: true,
        created_at: Utc::now(),
    };
    let audit = AuditEvent::new(
        AuditEventType::CrossRailRouteSimulated,
        "tsn_mbridge_adapter",
        "mBridge-style multi-CBDC instruction simulated",
        serde_json::json!({
            "instruction_id": instruction_id.to_string(),
            "simulation_only": true,
        }),
    );
    (instruction, audit)
}

/// Advance the status of an mBridge instruction through its lifecycle.
///
/// Permitted transitions (simulation only):
/// `SimulationOnly` → `Pending` → `ValidatedByOrigin` →
/// `ValidatedByDestination` → `Settled` | `Rejected`
///
/// Returns an updated instruction and an audit trail event.
pub fn advance_route_status(
    instruction: &MbridgeStyleInstruction,
    new_status: CentralBankRouteStatus,
) -> (MbridgeStyleInstruction, AuditEvent) {
    let updated = MbridgeStyleInstruction {
        status: new_status.clone(),
        simulation_only: true,
        ..instruction.clone()
    };
    let status_label = serde_json::to_string(&new_status)
        .unwrap_or_else(|_| "unknown".to_string());
    let audit = AuditEvent::new(
        AuditEventType::CrossRailRouteSimulated,
        "tsn_mbridge_adapter",
        &format!(
            "mBridge instruction {} advanced to status {}",
            instruction.instruction_id, status_label
        ),
        serde_json::json!({
            "instruction_id": instruction.instruction_id.to_string(),
            "new_status": status_label,
            "simulation_only": true,
        }),
    );
    (updated, audit)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn make_instruction() -> MbridgeStyleInstruction {
        simulate_mbridge_instruction(
            "PBoC", "ECB", "2000000000", "CNY", "EUR", "0.1290",
        ).0
    }

    #[test]
    fn simulate_creates_simulation_only_instruction() {
        let i = make_instruction();
        assert!(i.simulation_only);
        assert_eq!(i.status, CentralBankRouteStatus::SimulationOnly);
    }

    #[test]
    fn simulate_populates_fx_quote() {
        let i = make_instruction();
        assert_eq!(i.fx_quote.source_currency, "CNY");
        assert_eq!(i.fx_quote.target_currency, "EUR");
        assert_eq!(i.fx_quote.mid_rate_string, "0.1290");
        assert!(i.fx_quote.simulation_only);
    }

    #[test]
    fn simulate_preserves_central_bank_names() {
        let i = make_instruction();
        assert_eq!(i.originating_central_bank, "PBoC");
        assert_eq!(i.receiving_central_bank, "ECB");
    }

    #[test]
    fn advance_status_transitions_correctly() {
        let i = make_instruction();
        let (pending, _) = advance_route_status(&i, CentralBankRouteStatus::Pending);
        assert_eq!(pending.status, CentralBankRouteStatus::Pending);
        let (validated, _) = advance_route_status(&pending, CentralBankRouteStatus::ValidatedByOrigin);
        assert_eq!(validated.status, CentralBankRouteStatus::ValidatedByOrigin);
        let (settled, audit) = advance_route_status(&validated, CentralBankRouteStatus::Settled);
        assert_eq!(settled.status, CentralBankRouteStatus::Settled);
        assert!(audit.summary.contains("settled"));
    }

    #[test]
    fn advance_preserves_instruction_id() {
        let i = make_instruction();
        let (advanced, _) = advance_route_status(&i, CentralBankRouteStatus::Pending);
        assert_eq!(advanced.instruction_id, i.instruction_id);
    }

    #[test]
    fn instruction_serializes_to_json() {
        let i = make_instruction();
        let json = serde_json::to_value(&i).unwrap();
        assert_eq!(json["simulation_only"], true);
        assert_eq!(json["originating_central_bank"], "PBoC");
        assert!(json.get("fx_quote").is_some());
    }
}
