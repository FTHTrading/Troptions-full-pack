//! Prometheus metrics exposition for TROPTIONS L1 (port 9945).

use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::Mutex;

static RPC_REQUESTS: AtomicU64 = AtomicU64::new(0);
static RPC_ERRORS: AtomicU64 = AtomicU64::new(0);
static TX_SUBMITTED: AtomicU64 = AtomicU64::new(0);
static BLOCK_HEIGHT: AtomicU64 = AtomicU64::new(0);

static CUSTOM: Mutex<String> = Mutex::new(String::new());

pub fn inc_rpc_requests() {
    RPC_REQUESTS.fetch_add(1, Ordering::Relaxed);
}

pub fn inc_rpc_errors() {
    RPC_ERRORS.fetch_add(1, Ordering::Relaxed);
}

pub fn inc_tx_submitted() {
    TX_SUBMITTED.fetch_add(1, Ordering::Relaxed);
}

pub fn set_block_height(h: u64) {
    BLOCK_HEIGHT.store(h, Ordering::Relaxed);
}

pub fn set_custom_gauge(name: &str, value: u64) {
    if let Ok(mut s) = CUSTOM.lock() {
        *s = format!("troptions_{}{{}} {}\n", name, value);
    }
}

pub fn render_prometheus() -> String {
    format!(
        "# HELP troptions_rpc_requests_total JSON-RPC requests served\n\
         # TYPE troptions_rpc_requests_total counter\n\
         troptions_rpc_requests_total {}\n\
         # HELP troptions_rpc_errors_total JSON-RPC errors\n\
         # TYPE troptions_rpc_errors_total counter\n\
         troptions_rpc_errors_total {}\n\
         # HELP troptions_tx_submitted_total Signed transactions submitted\n\
         # TYPE troptions_tx_submitted_total counter\n\
         troptions_tx_submitted_total {}\n\
         # HELP troptions_block_height Current L1 block height\n\
         # TYPE troptions_block_height gauge\n\
         troptions_block_height {}\n\
         {}",
        RPC_REQUESTS.load(Ordering::Relaxed),
        RPC_ERRORS.load(Ordering::Relaxed),
        TX_SUBMITTED.load(Ordering::Relaxed),
        BLOCK_HEIGHT.load(Ordering::Relaxed),
        CUSTOM.lock().map(|s| s.clone()).unwrap_or_default()
    )
}
