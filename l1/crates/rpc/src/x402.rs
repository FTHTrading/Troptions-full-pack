//! x402 agent registry and fee metadata on L1.

use serde::{Deserialize, Serialize};
use state::{State, X402AgentRecord};
use std::time::{SystemTime, UNIX_EPOCH};

pub const PROPOSAL_FEE_ATP: &str = "10000000000000000000"; // 10 ATP
pub const SETTLEMENT_FEE_ATP: &str = "1000000000000000000"; // 1 ATP

fn now_secs() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_secs())
        .unwrap_or(0)
}

pub fn agent_register(
    state: &mut State,
    agent_id: String,
    label: String,
    service_port: Option<u16>,
) -> Result<X402AgentRecord, String> {
    if agent_id.is_empty() {
        return Err("agent_id required".into());
    }
    let now = now_secs();
    let rec = X402AgentRecord {
        agent_id: agent_id.clone(),
        label,
        service_port,
        registered_at: now,
        last_heartbeat: now,
        active: true,
    };
    state.x402_agents.insert(agent_id, rec.clone());
    Ok(rec)
}

pub fn agent_deregister(state: &mut State, agent_id: &str) -> Result<(), String> {
    state
        .x402_agents
        .remove(agent_id)
        .map(|_| ())
        .ok_or_else(|| "agent not found".to_string())
}

pub fn agent_list(state: &State) -> Vec<X402AgentRecord> {
    state.x402_agents.values().cloned().collect()
}

pub fn agent_heartbeat(state: &mut State, agent_id: &str) -> Result<X402AgentRecord, String> {
    let rec = state
        .x402_agents
        .get_mut(agent_id)
        .ok_or_else(|| "agent not found".to_string())?;
    rec.last_heartbeat = now_secs();
    rec.active = true;
    Ok(rec.clone())
}

pub fn fee_schedule() -> serde_json::Value {
    serde_json::json!({
        "proposal_submit_atp": PROPOSAL_FEE_ATP,
        "settlement_create_atp": SETTLEMENT_FEE_ATP,
        "currency": "ATP",
        "decimals": 18
    })
}
