//! HTTP RPC server for TROPTIONS L1.
//! Uses raw TCP for maximum portability — no external HTTP framework dependencies.

use rpc::{
    dao_cast_vote, dao_execute, dao_get_proposals, dao_get_votes, dao_submit_proposal,
    metrics, query_balance, query_governance_state, query_proposal, query_proposals,
    query_settlement, query_soulbound_by_owner, query_soulbound_token, submit_namespace_register,
    submit_proposal_create, submit_proposal_execute, submit_proposal_finalize, submit_proposal_vote,
    submit_settlement_create, submit_soulbound_mint, submit_transaction, treasury_get_balance,
    RpcResponse, SharedState,
};
use rpc::x402::{agent_deregister, agent_heartbeat, agent_list, agent_register, fee_schedule};
use runtime::Transaction;
use serde_json;
use std::io::{Read, Write};
use std::net::{TcpListener, TcpStream};
use std::sync::Arc;
use std::thread;

/// Handle an HTTP request from a TCP stream.
fn handle_http_request(stream: &mut TcpStream, shared_state: &SharedState) {
    let mut buffer = [0u8; 8192];
    let bytes_read = match stream.read(&mut buffer) {
        Ok(n) => n,
        Err(_) => return,
    };

    if bytes_read == 0 {
        return;
    }

    let request = String::from_utf8_lossy(&buffer[..bytes_read]);

    let body = if let Some(pos) = request.find("\r\n\r\n") {
        request[pos + 4..].trim().to_string()
    } else if let Some(pos) = request.find("\n\n") {
        request[pos + 2..].trim().to_string()
    } else {
        request.trim().to_string()
    };

    metrics::inc_rpc_requests();

    let response_body = if body.is_empty() {
        metrics::inc_rpc_errors();
        serde_json::to_string(&RpcResponse::<serde_json::Value>::err("empty request body")).unwrap()
    } else {
        let mut state = shared_state.lock().unwrap();
        let result = handle_json_rpc(&mut state, &body);
        drop(state);
        result
    };

    let http_response = format!(
        "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nContent-Length: {}\r\nAccess-Control-Allow-Origin: *\r\n\r\n{}",
        response_body.len(),
        response_body
    );

    let _ = stream.write_all(http_response.as_bytes());
    let _ = stream.flush();
}

/// Process a JSON-RPC request.
pub fn handle_json_rpc(state: &mut state::State, body: &str) -> String {
    #[derive(serde::Deserialize)]
    struct JsonRpcRequest {
        #[allow(dead_code)]
        jsonrpc: String,
        method: String,
        #[serde(default)]
        params: serde_json::Value,
        id: serde_json::Value,
    }

    let req: JsonRpcRequest = match serde_json::from_str(body) {
        Ok(r) => r,
        Err(e) => {
            metrics::inc_rpc_errors();
            return serde_json::to_string(&serde_json::json!({
                "jsonrpc": "2.0",
                "error": {"code": -32700, "message": format!("Parse error: {}", e)},
                "id": null
            }))
            .unwrap();
        }
    };

    let result: Result<serde_json::Value, String> = match req.method.as_str() {
        "soulbound_get" => {
            let token_id = req.params.get("token_id").and_then(|v| v.as_str()).unwrap_or("");
            query_soulbound_token(state, token_id).map(|r| serde_json::to_value(r).unwrap())
        }
        "soulbound_by_owner" => {
            let owner = req.params.get("owner").and_then(|v| v.as_str()).unwrap_or("");
            query_soulbound_by_owner(state, owner).map(|r| serde_json::to_value(r).unwrap())
        }
        "settlement_get" => {
            let settlement_id = req.params.get("settlement_id").and_then(|v| v.as_str()).unwrap_or("");
            query_settlement(state, settlement_id).map(|r| serde_json::to_value(r).unwrap())
        }
        "settlement_create" => {
            let creator = req.params.get("creator").and_then(|v| v.as_str()).unwrap_or("");
            let asset = req.params.get("asset").and_then(|v| v.as_str()).unwrap_or("TROPTIONS");
            let amount = req.params.get("amount").and_then(|v| v.as_str()).unwrap_or("0");
            let recipient = req.params.get("recipient").and_then(|v| v.as_str()).unwrap_or("");
            let condition = req.params.get("condition").and_then(|v| v.as_str()).unwrap_or("time_locked");
            submit_settlement_create(state, creator, asset, amount, recipient, condition)
                .map(|r| serde_json::to_value(r).unwrap())
        }
        "balance_get" => {
            let account = req.params.get("account").and_then(|v| v.as_str()).unwrap_or("");
            let asset = req.params.get("asset").and_then(|v| v.as_str()).unwrap_or("NATIVE");
            query_balance(state, account, asset).map(|r| serde_json::to_value(r).unwrap())
        }
        "state_get" => {
            let summary = serde_json::json!({
                "block_height": state.current_height,
                "total_accounts": state.balances.len(),
                "total_soulbound": state.soulbound_tokens.len(),
                "total_settlements": state.settlements.len(),
                "total_proposals": state.governance_proposals.len(),
                "total_namespaces": state.namespaces.len(),
                "total_events": state.events.len(),
                "treasury_accounts": state.treasury_balances.len(),
                "sequencer_mode": "single_node",
            });
            Ok(summary)
        }
        "governance_get" => Ok(query_governance_state(state)),
        "proposal_get" | "dao_getProposal" => {
            let proposal_id = req.params.get("proposal_id").and_then(|v| v.as_str()).unwrap_or("");
            query_proposal(state, proposal_id).map(|r| serde_json::to_value(r).unwrap())
        }
        "proposal_list" | "dao_getProposals" => {
            Ok(serde_json::to_value(dao_get_proposals(state)).unwrap())
        }
        "dao_getVotes" => {
            let proposal_id = req.params.get("proposal_id").and_then(|v| v.as_str()).unwrap_or("");
            dao_get_votes(state, proposal_id).map(|v| serde_json::to_value(v).unwrap())
        }
        "treasury_getBalance" => {
            let chain = req.params.get("chain").and_then(|v| v.as_str()).unwrap_or("xrpl");
            let asset = req.params.get("asset").and_then(|v| v.as_str()).unwrap_or("TROPTIONS");
            Ok(treasury_get_balance(state, chain, asset))
        }
        "submit_transaction" => match serde_json::from_value::<Transaction>(req.params.clone()) {
            Ok(tx) => submit_transaction(state, tx),
            Err(e) => Err(format!("invalid transaction: {}", e)),
        },
        "dao_submit_proposal" => {
            let proposer = req.params.get("proposer").and_then(|v| v.as_str()).unwrap_or("");
            let title = req.params.get("title").and_then(|v| v.as_str()).unwrap_or("");
            let description = req.params.get("description").and_then(|v| v.as_str()).unwrap_or("");
            let action_uri = req.params.get("action_uri").and_then(|v| v.as_str()).map(String::from);
            let signature = req.params.get("signature").and_then(|v| v.as_str()).unwrap_or("");
            dao_submit_proposal(state, proposer, title, description, action_uri, signature)
                .map(|r| serde_json::to_value(r).unwrap())
        }
        "dao_cast_vote" => {
            let proposal_id = req.params.get("proposal_id").and_then(|v| v.as_str()).unwrap_or("");
            let voter = req.params.get("voter").and_then(|v| v.as_str()).unwrap_or("");
            let choice = req.params.get("choice").and_then(|v| v.as_str()).unwrap_or("for");
            let signature = req.params.get("signature").and_then(|v| v.as_str()).unwrap_or("");
            dao_cast_vote(state, proposal_id, voter, choice, signature)
        }
        "dao_execute" => {
            let proposal_id = req.params.get("proposal_id").and_then(|v| v.as_str()).unwrap_or("");
            let executor = req.params.get("executor").and_then(|v| v.as_str()).unwrap_or("");
            let signature = req.params.get("signature").and_then(|v| v.as_str()).unwrap_or("");
            dao_execute(state, proposal_id, executor, signature)
                .map(|r| serde_json::to_value(r).unwrap())
        }
        "submit_soulbound_mint" => {
            let issuer = req.params.get("issuer").and_then(|v| v.as_str()).unwrap_or("");
            let owner = req.params.get("owner").and_then(|v| v.as_str()).unwrap_or("");
            let metadata_uri = req.params.get("metadata_uri").and_then(|v| v.as_str()).map(String::from);
            let nonce = req.params.get("nonce").and_then(|v| v.as_u64()).unwrap_or(0);
            submit_soulbound_mint(state, issuer, owner, metadata_uri, nonce)
                .map(|r| serde_json::to_value(r).unwrap())
        }
        "submit_namespace_register" => {
            let namespace = req.params.get("namespace").and_then(|v| v.as_str()).unwrap_or("");
            let owner = req.params.get("owner").and_then(|v| v.as_str()).unwrap_or("");
            let brand_domain = req.params.get("brand_domain").and_then(|v| v.as_str()).map(String::from);
            submit_namespace_register(state, namespace, owner, brand_domain)
        }
        "submit_proposal_create" => {
            let proposer = req.params.get("proposer").and_then(|v| v.as_str()).unwrap_or("");
            let title = req.params.get("title").and_then(|v| v.as_str()).unwrap_or("");
            let description = req.params.get("description").and_then(|v| v.as_str()).unwrap_or("");
            let action_uri = req.params.get("action_uri").and_then(|v| v.as_str()).map(String::from);
            submit_proposal_create(state, proposer, title, description, action_uri)
                .map(|r| serde_json::to_value(r).unwrap())
        }
        "submit_proposal_vote" => {
            let proposal_id = req.params.get("proposal_id").and_then(|v| v.as_str()).unwrap_or("");
            let voter = req.params.get("voter").and_then(|v| v.as_str()).unwrap_or("");
            let choice = req.params.get("choice").and_then(|v| v.as_str()).unwrap_or("for");
            submit_proposal_vote(state, proposal_id, voter, choice)
        }
        "submit_proposal_finalize" => {
            let proposal_id = req.params.get("proposal_id").and_then(|v| v.as_str()).unwrap_or("");
            submit_proposal_finalize(state, proposal_id).map(|r| serde_json::to_value(r).unwrap())
        }
        "submit_proposal_execute" => {
            let proposal_id = req.params.get("proposal_id").and_then(|v| v.as_str()).unwrap_or("");
            submit_proposal_execute(state, proposal_id).map(|r| serde_json::to_value(r).unwrap())
        }
        "agent_register" => {
            let agent_id = req.params.get("agent_id").and_then(|v| v.as_str()).unwrap_or("").to_string();
            let label = req.params.get("label").and_then(|v| v.as_str()).unwrap_or("").to_string();
            let service_port = req.params.get("service_port").and_then(|v| v.as_u64()).map(|p| p as u16);
            agent_register(state, agent_id, label, service_port)
                .map(|r| serde_json::to_value(r).unwrap())
        }
        "agent_deregister" => {
            let agent_id = req.params.get("agent_id").and_then(|v| v.as_str()).unwrap_or("");
            agent_deregister(state, agent_id).map(|_| serde_json::json!({"ok": true}))
        }
        "agent_list" => Ok(serde_json::to_value(agent_list(state)).unwrap()),
        "agent_heartbeat" => {
            let agent_id = req.params.get("agent_id").and_then(|v| v.as_str()).unwrap_or("");
            agent_heartbeat(state, agent_id).map(|r| serde_json::to_value(r).unwrap())
        }
        "x402_fee_schedule" => Ok(fee_schedule()),
        _ => Err(format!("Unknown method: {}", req.method)),
    };

    match result {
        Ok(data) => serde_json::to_string(&serde_json::json!({
            "jsonrpc": "2.0",
            "result": data,
            "id": req.id
        }))
        .unwrap(),
        Err(e) => {
            metrics::inc_rpc_errors();
            serde_json::to_string(&serde_json::json!({
                "jsonrpc": "2.0",
                "error": {"code": -32601, "message": e},
                "id": req.id
            }))
            .unwrap()
        }
    }
}

/// Start the HTTP server.
pub fn start_http_server(shared_state: SharedState, port: u16) {
    let listener = match TcpListener::bind(format!("127.0.0.1:{}", port)) {
        Ok(l) => l,
        Err(e) => {
            eprintln!("Failed to bind to port {}: {}", port, e);
            return;
        }
    };

    println!("HTTP RPC server listening on http://127.0.0.1:{}", port);
    println!("   Send JSON-RPC POST requests to this endpoint");

    for stream in listener.incoming() {
        match stream {
            Ok(mut stream) => {
                let state = Arc::clone(&shared_state);
                thread::spawn(move || {
                    handle_http_request(&mut stream, &state);
                });
            }
            Err(e) => {
                eprintln!("Connection failed: {}", e);
            }
        }
    }
}

/// Prometheus metrics on port 9945.
pub fn start_metrics_server(port: u16) {
    let listener = match TcpListener::bind(format!("127.0.0.1:{}", port)) {
        Ok(l) => l,
        Err(e) => {
            eprintln!("Failed to bind metrics port {}: {}", port, e);
            return;
        }
    };

    println!("Prometheus metrics on http://127.0.0.1:{}/metrics", port);

    for stream in listener.incoming() {
        if let Ok(mut stream) = stream {
            let body = metrics::render_prometheus();
            let response = format!(
                "HTTP/1.1 200 OK\r\nContent-Type: text/plain; version=0.0.4\r\nContent-Length: {}\r\n\r\n{}",
                body.len(),
                body
            );
            let _ = stream.write_all(response.as_bytes());
        }
    }
}
