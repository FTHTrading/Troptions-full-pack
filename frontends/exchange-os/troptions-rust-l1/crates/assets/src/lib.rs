#![allow(dead_code)]

use chrono::Utc;
use tsn_state::{Asset, AssetClass};
use uuid::Uuid;

pub fn create_asset_simulation(
    symbol: &str,
    name: &str,
    asset_class: AssetClass,
    issuer_id: Uuid,
    decimals: u8,
) -> Asset {
    Asset {
        id: Uuid::new_v4(),
        symbol: symbol.to_string(),
        name: name.to_string(),
        asset_class,
        issuer_id,
        total_supply_string: "0".to_string(),
        decimals,
        simulation_only: true,
        live_execution_enabled: false,
        created_at: Utc::now(),
    }
}
