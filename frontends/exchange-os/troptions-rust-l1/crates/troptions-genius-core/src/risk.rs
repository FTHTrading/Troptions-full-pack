use crate::models::{RiskInput, RiskRating, SettlementLane};

pub fn classify_genius_risk(input: &RiskInput) -> RiskRating {
    if input.live_action_requested && !input.blockers.is_empty() {
        return RiskRating::Critical;
    }

    if matches!(input.lane, SettlementLane::PaymentStablecoin) && !input.blockers.is_empty() {
        return RiskRating::High;
    }

    if matches!(input.lane, SettlementLane::TokenizedDeposit) {
        if input.blockers.is_empty() {
            return RiskRating::Low;
        }
        return RiskRating::Medium;
    }

    if input.public_chain_allowed && !input.blockers.is_empty() {
        return RiskRating::High;
    }

    RiskRating::Low
}
