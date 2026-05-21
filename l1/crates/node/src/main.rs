//! TROPTIONS L1 Node — RPC server entry point.
//!
//! Usage: troptions-node [port]
//! Default port: 9944

mod http_server;

use crypto::generate_keypair;
use primitives::AccountId;
use runtime::authorize_soulbound_issuer;
use rpc::create_shared_state;
use sha2::{Digest, Sha256};
use std::env;

/// Genesis configuration — pre-register brand namespaces.
fn initialize_genesis(state: &mut state::State) {
    println!("⚙️  Initializing genesis state...");

    // Generate deterministic issuer accounts for the 8 brand domains
    // In production, these would be loaded from secure config
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
        // Derive deterministic AccountId from domain name
        let seed = format!("TROPTIONS_GENESIS_{}_{}", i, domain);
        let hash = Sha256::digest(seed.as_bytes());
        let mut bytes = [0u8; 32];
        bytes.copy_from_slice(&hash);
        let account = AccountId::new(bytes);

        authorize_soulbound_issuer(state, account, true);
        println!("  ✅ Authorized issuer: {} ({}) - {}", 
            hex::encode_upper(&bytes[..8]), 
            domain, 
            _purpose
        );
    }

    // Set initial block height
    state.current_height = 1;
    println!("✅ Genesis state initialized at block {}", state.current_height);
}

fn main() {
    println!("🚀 TROPTIONS L1 Node Starting...");
    println!("   Version: {} ({})", env!("CARGO_PKG_VERSION"), env!("CARGO_PKG_NAME"));
    println!();

    // Parse port from args
    let port = env::args().nth(1)
        .and_then(|s| s.parse::<u16>().ok())
        .unwrap_or(9944);

    // Initialize state with genesis
    let shared_state = create_shared_state();
    {
        let mut state = shared_state.lock().unwrap();
        initialize_genesis(&mut state);
    }

    println!();
    println!("📡 Starting RPC server...");
    println!();

    // Start HTTP server
    http_server::start_http_server(shared_state, port);
}
