//! HTTP RPC server for TROPTIONS L1.
//! Uses raw TCP for maximum portability — no external HTTP framework dependencies.

use rpc::{query_balance, query_settlement, query_soulbound_by_owner, query_soulbound_token, RpcResponse, SharedState};
use serde_json;
use std::io::{Read, Write};
use std::net::{TcpListener, TcpStream};
use std::sync::Arc;
use std::thread;

/// Handle an HTTP request from a TCP stream.
fn handle_http_request(stream: &mut TcpStream, shared_state: &SharedState) {
    let mut buffer = [0u8; 4096];
    let bytes_read = match stream.read(&mut buffer) {
        Ok(n) => n,
        Err(_) => return,
    };

    if bytes_read == 0 {
        return;
    }

    let request = String::from_utf8_lossy(&buffer[..bytes_read]);
    
    // Parse the HTTP body (JSON after the headers)
    let body = if let Some(pos) = request.find("\r\n\r\n") {
        request[pos + 4..].trim().to_string()
    } else if let Some(pos) = request.find("\n\n") {
        request[pos + 2..].trim().to_string()
    } else {
        request.trim().to_string()
    };

    let response_body = if body.is_empty() {
        serde_json::to_string(
            &RpcResponse::<serde_json::Value>::err("empty request body"),
        )
        .unwrap()
    } else {
        let state = shared_state.lock().unwrap();
        let result = handle_json_rpc(&state, &body);
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
fn handle_json_rpc(state: &state::State, body: &str) -> String {
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
            return serde_json::to_string(
                &serde_json::json!({
                    "jsonrpc": "2.0",
                    "error": {"code": -32700, "message": format!("Parse error: {}", e)},
                    "id": null
                }),
            )
            .unwrap();
        }
    };

    let result: Result<serde_json::Value, String> = match req.method.as_str() {
        "soulbound_get" => {
            let token_id = req.params.get("token_id").and_then(|v| v.as_str()).unwrap_or("");
            query_soulbound_token(state, token_id)
                .map(|r| serde_json::to_value(r).unwrap())
        }
        "soulbound_by_owner" => {
            let owner = req.params.get("owner").and_then(|v| v.as_str()).unwrap_or("");
            query_soulbound_by_owner(state, owner)
                .map(|r| serde_json::to_value(r).unwrap())
        }
        "settlement_get" => {
            let settlement_id = req.params.get("settlement_id").and_then(|v| v.as_str()).unwrap_or("");
            query_settlement(state, settlement_id)
                .map(|r| serde_json::to_value(r).unwrap())
        }
        "balance_get" => {
            let account = req.params.get("account").and_then(|v| v.as_str()).unwrap_or("");
            let asset = req.params.get("asset").and_then(|v| v.as_str()).unwrap_or("NATIVE");
            query_balance(state, account, asset)
                .map(|r| serde_json::to_value(r).unwrap())
        }
        "state_get" => {
            let summary = serde_json::json!({
                "block_height": state.current_height,
                "total_accounts": state.balances.len(),
                "total_soulbound": state.soulbound_tokens.len(),
                "total_settlements": state.settlements.len(),
                "total_events": state.events.len(),
            });
            Ok(summary)
        }
        _ => Err(format!("Unknown method: {}", req.method)),
    };

    match result {
        Ok(data) => serde_json::to_string(
            &serde_json::json!({
                "jsonrpc": "2.0",
                "result": data,
                "id": req.id
            }),
        )
        .unwrap(),
        Err(e) => serde_json::to_string(
            &serde_json::json!({
                "jsonrpc": "2.0",
                "error": {"code": -32601, "message": e},
                "id": req.id
            }),
        )
        .unwrap(),
    }
}

/// Start the HTTP server.
pub fn start_http_server(shared_state: SharedState, port: u16) {
    let listener = match TcpListener::bind(format!("127.0.0.1:{}", port)) {
        Ok(l) => l,
        Err(e) => {
            eprintln!("❌ Failed to bind to port {}: {}", port, e);
            return;
        }
    };

    println!("📡 HTTP RPC server listening on http://127.0.0.1:{}", port);
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
                eprintln!("⚠️  Connection failed: {}", e);
            }
        }
    }
}
