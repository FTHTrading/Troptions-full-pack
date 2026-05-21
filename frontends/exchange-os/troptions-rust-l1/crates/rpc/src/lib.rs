//! TSN RPC — JSON-RPC 2.0 in-process dispatcher (simulation only).
//!
//! This crate implements a pure message-passing JSON-RPC 2.0 layer.
//! There is no TCP/HTTP server — `RpcDispatcher::dispatch()` accepts a raw
//! JSON string and returns a JSON string response, suitable for embedding in
//! a future async transport (WebSocket, stdio, HTTP) without coupling.
//!
//! Registered methods:
//! - `tsn_ping`             → pong with timestamp
//! - `tsn_getVersion`       → version, network, simulation_only
//! - `tsn_getStatus`        → full runtime status snapshot
//! - `tsn_getTelemetry`     → tail of recent telemetry events (params: {"n": u})

use chrono::Utc;
use serde::{Deserialize, Serialize};
use serde_json::Value;

// ─── JSON-RPC 2.0 wire types ─────────────────────────────────────────────────

/// Parsed JSON-RPC 2.0 request.
#[derive(Debug, Clone, Deserialize)]
pub struct RpcRequest {
    pub jsonrpc: String,
    pub method: String,
    pub params: Option<Value>,
    pub id: Option<Value>,
}

/// JSON-RPC 2.0 error object (spec error codes).
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RpcError {
    pub code: i32,
    pub message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<Value>,
}

impl RpcError {
    // Standard JSON-RPC 2.0 error codes
    pub const PARSE_ERROR: i32      = -32700;
    pub const INVALID_REQUEST: i32  = -32600;
    pub const METHOD_NOT_FOUND: i32 = -32601;
    pub const INVALID_PARAMS: i32   = -32602;
    pub const INTERNAL_ERROR: i32   = -32603;

    pub fn parse_error() -> Self {
        RpcError { code: Self::PARSE_ERROR, message: "Parse error".into(), data: None }
    }
    pub fn invalid_request(detail: &str) -> Self {
        RpcError { code: Self::INVALID_REQUEST, message: format!("Invalid Request: {}", detail), data: None }
    }
    pub fn method_not_found(method: &str) -> Self {
        RpcError {
            code: Self::METHOD_NOT_FOUND,
            message: format!("Method not found: {}", method),
            data: None,
        }
    }
    pub fn invalid_params(detail: &str) -> Self {
        RpcError { code: Self::INVALID_PARAMS, message: format!("Invalid params: {}", detail), data: None }
    }
}

// ─── Response serialisation ──────────────────────────────────────────────────

fn ok_response(id: Option<Value>, result: Value) -> Value {
    serde_json::json!({
        "jsonrpc": "2.0",
        "id": id,
        "result": result,
    })
}

fn err_response(id: Option<Value>, error: RpcError) -> Value {
    serde_json::json!({
        "jsonrpc": "2.0",
        "id": id,
        "error": {
            "code": error.code,
            "message": error.message,
        },
    })
}

// ─── Dispatcher ──────────────────────────────────────────────────────────────

pub struct RpcDispatcher;

impl RpcDispatcher {
    /// Parse `raw_json`, route to the correct handler, and return a
    /// JSON-serialised JSON-RPC 2.0 response string.
    pub fn dispatch(raw_json: &str) -> String {
        // 1. Parse
        let req: RpcRequest = match serde_json::from_str(raw_json) {
            Ok(r) => r,
            Err(_) => {
                let resp = err_response(None, RpcError::parse_error());
                return serde_json::to_string(&resp).unwrap_or_default();
            }
        };

        // 2. Validate jsonrpc field
        if req.jsonrpc != "2.0" {
            let resp = err_response(
                req.id.clone(),
                RpcError::invalid_request("jsonrpc must be \"2.0\""),
            );
            return serde_json::to_string(&resp).unwrap_or_default();
        }

        // 3. Route
        let result = Self::route(&req);

        // 4. If this is a notification (no id), return empty string per spec
        if req.id.is_none() {
            return String::new();
        }

        let response = match result {
            Ok(val)  => ok_response(req.id, val),
            Err(err) => err_response(req.id, err),
        };

        serde_json::to_string(&response).unwrap_or_default()
    }

    fn route(req: &RpcRequest) -> Result<Value, RpcError> {
        tsn_telemetry::emit(
            tsn_telemetry::TraceLevel::Debug,
            "tsn_rpc",
            &format!("rpc method: {}", req.method),
            serde_json::json!({ "method": req.method }),
        );

        match req.method.as_str() {
            "tsn_ping"         => Self::handle_ping(),
            "tsn_getVersion"   => Self::handle_get_version(),
            "tsn_getStatus"    => Self::handle_get_status(),
            "tsn_getTelemetry" => Self::handle_get_telemetry(req.params.as_ref()),
            other              => Err(RpcError::method_not_found(other)),
        }
    }

    // ─── Method handlers ────────────────────────────────────────────

    fn handle_ping() -> Result<Value, RpcError> {
        Ok(serde_json::json!({
            "pong": true,
            "timestamp": Utc::now().to_rfc3339(),
            "simulation_only": true,
        }))
    }

    fn handle_get_version() -> Result<Value, RpcError> {
        Ok(serde_json::json!({
            "version": env!("CARGO_PKG_VERSION"),
            "network": "devnet",
            "simulation_only": true,
            "live_execution_enabled": false,
        }))
    }

    fn handle_get_status() -> Result<Value, RpcError> {
        let status = tsn_runtime::start_devnet_runtime();
        serde_json::to_value(&status).map_err(|e| RpcError {
            code: RpcError::INTERNAL_ERROR,
            message: format!("serialize error: {}", e),
            data: None,
        })
    }

    fn handle_get_telemetry(params: Option<&Value>) -> Result<Value, RpcError> {
        let n: usize = match params {
            Some(Value::Object(map)) => map
                .get("n")
                .and_then(|v| v.as_u64())
                .unwrap_or(10) as usize,
            None => 10,
            _ => return Err(RpcError::invalid_params("expected {\"n\": uint} or null")),
        };
        let events = tsn_telemetry::tail(n);
        serde_json::to_value(&events).map_err(|e| RpcError {
            code: RpcError::INTERNAL_ERROR,
            message: format!("serialize error: {}", e),
            data: None,
        })
    }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;

    fn dispatch(raw: &str) -> Value {
        let s = RpcDispatcher::dispatch(raw);
        serde_json::from_str(&s).expect("response must be valid JSON")
    }

    #[test]
    fn ping_returns_pong() {
        let resp = dispatch(r#"{"jsonrpc":"2.0","method":"tsn_ping","id":1}"#);
        assert_eq!(resp["result"]["pong"], true);
    }

    #[test]
    fn get_version_returns_devnet() {
        let resp = dispatch(r#"{"jsonrpc":"2.0","method":"tsn_getVersion","id":2}"#);
        assert_eq!(resp["result"]["network"], "devnet");
        assert_eq!(resp["result"]["simulation_only"], true);
        assert_eq!(resp["result"]["live_execution_enabled"], false);
    }

    #[test]
    fn get_status_returns_runtime() {
        let resp = dispatch(r#"{"jsonrpc":"2.0","method":"tsn_getStatus","id":3}"#);
        assert_eq!(resp["result"]["network"], "devnet");
        assert!(resp["result"]["subsystems"].is_array());
        assert!(resp["result"]["subsystems"].as_array().unwrap().len() > 0);
    }

    #[test]
    fn get_telemetry_returns_array() {
        // Ensure there are events first
        tsn_telemetry::info("test", "rpc_telemetry_test");
        let resp = dispatch(r#"{"jsonrpc":"2.0","method":"tsn_getTelemetry","params":{"n":5},"id":4}"#);
        assert!(resp["result"].is_array());
    }

    #[test]
    fn unknown_method_returns_method_not_found() {
        let resp = dispatch(r#"{"jsonrpc":"2.0","method":"tsn_unknown","id":5}"#);
        assert_eq!(resp["error"]["code"], RpcError::METHOD_NOT_FOUND);
        assert!(resp["error"]["message"].as_str().unwrap().contains("tsn_unknown"));
    }

    #[test]
    fn parse_error_on_invalid_json() {
        let raw = "NOT JSON {{{";  // deliberately broken
        // parse error returns non-empty string with error field
        let s = RpcDispatcher::dispatch(raw);
        let v: Value = serde_json::from_str(&s).expect("must be valid JSON even on parse error");
        assert_eq!(v["error"]["code"], RpcError::PARSE_ERROR);
    }

    #[test]
    fn invalid_jsonrpc_version() {
        let resp = dispatch(r#"{"jsonrpc":"1.0","method":"tsn_ping","id":6}"#);
        assert_eq!(resp["error"]["code"], RpcError::INVALID_REQUEST);
    }

    #[test]
    fn notification_returns_empty_string() {
        // JSON-RPC notifications have no id; response MUST be empty
        let s = RpcDispatcher::dispatch(r#"{"jsonrpc":"2.0","method":"tsn_ping"}"#);
        assert!(s.is_empty(), "notification must produce empty response, got: {}", s);
    }

    #[test]
    fn id_is_preserved_in_response() {
        let resp = dispatch(r#"{"jsonrpc":"2.0","method":"tsn_ping","id":42}"#);
        assert_eq!(resp["id"], 42);
    }
}
