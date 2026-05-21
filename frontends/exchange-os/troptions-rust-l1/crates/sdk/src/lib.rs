#![allow(dead_code)]

//! TSN SDK — integrator client library for the Troptions Settlement Network.
//!
//! Wraps the in-process JSON-RPC 2.0 dispatcher (`tsn-rpc`) behind typed,
//! ergonomic method calls.  All operations are simulation-only; no live
//! execution is possible from this crate.

use serde::{Deserialize, Serialize};
use serde_json::Value;
use tsn_rpc::RpcDispatcher;

// ─── Error ───────────────────────────────────────────────────────────────────

#[derive(Debug)]
pub enum SdkError {
    /// The RPC layer returned a JSON-RPC error object.
    RpcError { code: i32, message: String },
    /// Could not parse the server's response.
    ParseError(serde_json::Error),
    /// The dispatcher returned an empty string (notification path — should
    /// not happen for SDK calls that always supply an id).
    EmptyResponse,
}

impl std::fmt::Display for SdkError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            SdkError::RpcError { code, message } => {
                write!(f, "RPC error {}: {}", code, message)
            }
            SdkError::ParseError(e) => write!(f, "parse error: {}", e),
            SdkError::EmptyResponse => write!(f, "empty response from dispatcher"),
        }
    }
}

pub type SdkResult<T> = Result<T, SdkError>;

// ─── Typed responses ─────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PingResponse {
    pub pong: bool,
    pub timestamp: String,
    pub simulation_only: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VersionResponse {
    pub version: String,
    pub network: String,
    pub simulation_only: bool,
    pub live_execution_enabled: bool,
}

// ─── Client ──────────────────────────────────────────────────────────────────

/// In-process TSN SDK client.  Instantiate once and reuse.
///
/// ```rust
/// let client = tsn_sdk::SdkClient::new();
/// let pong = client.ping().unwrap();
/// assert!(pong.pong);
/// ```
#[derive(Debug, Clone)]
pub struct SdkClient {
    pub simulation_only: bool,
    pub network: String,
}

impl Default for SdkClient {
    fn default() -> Self {
        Self::new()
    }
}

impl SdkClient {
    /// Create a new SDK client bound to the local in-process dispatcher.
    pub fn new() -> Self {
        SdkClient {
            simulation_only: true,
            network: "tsn-devnet".to_string(),
        }
    }

    // ── Internal helper ──────────────────────────────────────────────────────

    /// Dispatch a JSON-RPC 2.0 request and return the `result` field as a
    /// `serde_json::Value`, or an `SdkError` wrapping the error object.
    fn call(&self, method: &str, params: Option<Value>) -> SdkResult<Value> {
        let id = serde_json::json!(1);
        let request = match params {
            Some(p) => serde_json::json!({
                "jsonrpc": "2.0",
                "method": method,
                "params": p,
                "id": id
            }),
            None => serde_json::json!({
                "jsonrpc": "2.0",
                "method": method,
                "id": id
            }),
        };

        let raw = RpcDispatcher::dispatch(&request.to_string());
        if raw.is_empty() {
            return Err(SdkError::EmptyResponse);
        }

        let response: Value = serde_json::from_str(&raw).map_err(SdkError::ParseError)?;

        if let Some(err) = response.get("error") {
            let code = err.get("code").and_then(|v| v.as_i64()).unwrap_or(-1) as i32;
            let message = err
                .get("message")
                .and_then(|v| v.as_str())
                .unwrap_or("unknown error")
                .to_string();
            return Err(SdkError::RpcError { code, message });
        }

        Ok(response["result"].clone())
    }

    // ── Public API ───────────────────────────────────────────────────────────

    /// Ping the TSN node.  Returns a `PingResponse` confirming liveness.
    pub fn ping(&self) -> SdkResult<PingResponse> {
        let result = self.call("tsn_ping", None)?;
        serde_json::from_value(result).map_err(SdkError::ParseError)
    }

    /// Retrieve the node's semantic version, network name, and execution flags.
    pub fn get_version(&self) -> SdkResult<VersionResponse> {
        let result = self.call("tsn_getVersion", None)?;
        serde_json::from_value(result).map_err(SdkError::ParseError)
    }

    /// Retrieve a full `RuntimeStatus` snapshot as a generic JSON value.
    /// Deserialise into `tsn_runtime::RuntimeStatus` if the runtime crate is
    /// available in the caller's dependency graph.
    pub fn get_status(&self) -> SdkResult<Value> {
        self.call("tsn_getStatus", None)
    }

    /// Retrieve the most-recent `n` telemetry events from the process buffer.
    pub fn get_telemetry(&self, n: usize) -> SdkResult<Vec<Value>> {
        let params = serde_json::json!({ "n": n });
        let result = self.call("tsn_getTelemetry", Some(params))?;
        result
            .as_array()
            .cloned()
            .ok_or_else(|| SdkError::RpcError {
                code: -32603,
                message: "telemetry result is not an array".to_string(),
            })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn client() -> SdkClient {
        SdkClient::new()
    }

    #[test]
    fn sdk_ping_returns_pong() {
        let pong = client().ping().expect("ping should succeed");
        assert!(pong.pong);
        assert!(pong.simulation_only);
        assert!(!pong.timestamp.is_empty());
    }

    #[test]
    fn sdk_get_version_returns_devnet() {
        let v = client().get_version().expect("get_version should succeed");
        assert!(v.network.contains("devnet"));
        assert!(v.simulation_only);
        assert!(!v.live_execution_enabled);
    }

    #[test]
    fn sdk_get_status_contains_subsystems() {
        let status = client().get_status().expect("get_status should succeed");
        assert!(status.get("subsystems").is_some());
        assert_eq!(status["simulation_only"], true);
    }

    #[test]
    fn sdk_get_telemetry_returns_vec() {
        // warm the buffer first
        let _ = client().ping();
        let events = client().get_telemetry(5).expect("get_telemetry should succeed");
        // may be empty if buffer hasn't been populated yet; just check type
        assert!(events.len() <= 5);
    }

    #[test]
    fn sdk_unknown_method_returns_error() {
        let err = client().call("tsn_nonexistent", None);
        match err {
            Err(SdkError::RpcError { code, .. }) => assert_eq!(code, -32601),
            other => panic!("expected RpcError, got {:?}", other),
        }
    }

    #[test]
    fn sdk_client_is_simulation_only() {
        let c = SdkClient::new();
        assert!(c.simulation_only);
        assert_eq!(c.network, "tsn-devnet");
    }
}
