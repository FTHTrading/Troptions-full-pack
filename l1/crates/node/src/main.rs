//! TROPTIONS L1 Node — RPC server entry point.
//!
//! Usage: troptions-node [rpc_port] [data_dir]
//! Default RPC port: 9944, metrics: 9945, data: ./l1-data

mod http_server;

use primitives::AccountId;
use runtime::authorize_soulbound_issuer;
use rpc::{create_shared_state, metrics};
use sequencer::current_sequencer_info;
use sha2::{Digest, Sha256};
use state::persistence::StateStore;
use std::env;
use std::path::PathBuf;
use std::sync::Arc;
use std::thread;
use std::time::Duration;

fn initialize_genesis(state: &mut state::State) {
    println!("Initializing genesis state...");

    let domains = vec![
        ("TROPTIONSXCHANGE.IO", "Exchange OS"),
        ("TROPTIONS-UNIVERSITY.COM", "FTH Academy"),
        ("TROPTIONSTelevisionNetwork.Tv", "TTN Sports"),
        ("HOTRCW.COM", "TTN"),
        ("TROPTIONS.IO", "Platform"),
        ("TROPTIONS.ORG", "Platform"),
        ("TheRealEstateConnections.com", "Real Estate"),
        ("Green-N-Go.Solar", "Solar Platform"),
    ];

    for (i, (domain, _purpose)) in domains.iter().enumerate() {
        let seed = format!("TROPTIONS_GENESIS_{}_{}", i, domain);
        let hash = Sha256::digest(seed.as_bytes());
        let mut bytes = [0u8; 32];
        bytes.copy_from_slice(&hash);
        let account = AccountId::new(bytes);
        authorize_soulbound_issuer(state, account, true);
        println!("  Authorized issuer: {} ({})", hex::encode_upper(&bytes[..8]), domain);
    }

    // Seed treasury balances on L1 (source of truth)
    let _ = state.credit_treasury("xrpl", "TROPTIONS", 1_000_000);
    let _ = state.credit_treasury("polygon", "KENNY", 500_000);
    let _ = state.credit_treasury("polygon", "EVL", 250_000);

    if state.current_height == 0 {
        state.current_height = 1;
    }
    println!("Genesis state at block {}", state.current_height);
}

fn main() {
    println!("TROPTIONS L1 Node Starting...");
    println!("   Version: {} ({})", env!("CARGO_PKG_VERSION"), env!("CARGO_PKG_NAME"));

    let port = env::args()
        .nth(1)
        .and_then(|s| s.parse::<u16>().ok())
        .unwrap_or(9944);

    let metrics_port = env::var("L1_METRICS_PORT")
        .ok()
        .and_then(|s| s.parse().ok())
        .unwrap_or(9945);

    let data_dir: PathBuf = env::args()
        .nth(2)
        .map(PathBuf::from)
        .or_else(|| env::var("L1_DATA_DIR").ok().map(PathBuf::from))
        .unwrap_or_else(|| PathBuf::from("l1-data"));

    let store = match StateStore::open(&data_dir) {
        Ok(s) => s,
        Err(e) => {
            eprintln!("Failed to open RocksDB at {:?}: {}", data_dir, e);
            std::process::exit(1);
        }
    };

    let shared_state = create_shared_state();
    {
        let mut state = shared_state.lock().unwrap();
        match store.load() {
            Ok(loaded) if !loaded.balances.is_empty()
                || !loaded.soulbound_tokens.is_empty()
                || loaded.current_height > 0 =>
            {
                *state = loaded;
                println!("Loaded state from RocksDB ({:?})", data_dir);
            }
            _ => {
                initialize_genesis(&mut state);
                if let Err(e) = store.save(&state) {
                    eprintln!("Warning: initial save failed: {}", e);
                }
            }
        }
        metrics::set_block_height(state.current_height);
        let info = current_sequencer_info(state.current_height);
        println!(
            "Sequencer: {} — {}",
            info.node_id,
            sequencer::mode_description(info.mode)
        );
    }

    // Periodic flush every 30s
    let flush_state = Arc::clone(&shared_state);
    let flush_dir = data_dir.clone();
    thread::spawn(move || {
        loop {
            thread::sleep(Duration::from_secs(30));
            if let Ok(store) = StateStore::open(&flush_dir) {
                if let Ok(state) = flush_state.lock() {
                    let _ = store.save(&state);
                    let _ = store.flush();
                }
            }
        }
    });

    // Metrics server
    thread::spawn(move || {
        http_server::start_metrics_server(metrics_port);
    });

    println!("Starting RPC server on port {}...", port);
    http_server::start_http_server(shared_state, port);
}
