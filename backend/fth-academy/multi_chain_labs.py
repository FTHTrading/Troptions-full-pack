# Multi-Chain Lab Definitions for FTH Backend
# Extended from basic labs to include XRPL, Stellar, Solana, Base, x402, TTN

MULTI_CHAIN_LABS = {
    "lab-xrpl-001": {
        "id": "lab-xrpl-001",
        "title": "Launch Your First XRPL Token",
        "chain": "xrpl",
        "difficulty": "beginner",
        "duration_hours": 2,
        "fee_kenny": 10,
        "fee_evl": 50,
        "reward_xp": 500,
        "reward_pick": 50,
        "reward_nft": "XRPL Token Deployer Certificate",
        "prerequisites": ["course-crypto-basics"],
        "steps": [
            {"id": "s1", "title": "Create XRPL Testnet Wallet", "content": "Use Xaman app. Write down seed phrase."},
            {"id": "s2", "title": "Fund with Testnet XRP", "content": "Use faucet at https://test.bithomp.com/faucet/"},
            {"id": "s3", "title": "Set Trustline", "content": "Trust TROPTIONS issuer rPF2M1QjRj72rHdJyRqfFRTqWREBdJds3"},
            {"id": "s4", "title": "Deploy Token", "content": "Use Exchange OS guided launch or issue yourself"},
            {"id": "s5", "title": "Verify on XRPScan", "content": "Check https://testnet.xrpl.org for your token"},
            {"id": "s6", "title": "Generate Proof Packet", "content": "Document issuer verification and trustline setup"}
        ],
        "chain_config": {
            "rpc": "wss://s.altnet.rippletest.net:51233",
            "issuer": "rPF2M1QjRj72rHdJyRqfFRTqWREBdJds3",
            "explorer": "https://testnet.xrpl.org"
        }
    },
    "lab-xrpl-002": {
        "id": "lab-xrpl-002",
        "title": "Set Up XRPL Escrow for Deal Funding",
        "chain": "xrpl",
        "difficulty": "intermediate",
        "duration_hours": 3,
        "fee_kenny": 25,
        "fee_evl": 100,
        "reward_xp": 1000,
        "reward_pick": 100,
        "reward_nft": "XRPL Escrow Specialist Certificate",
        "prerequisites": ["lab-xrpl-001", "course-rwa-tokenization"],
        "steps": [
            {"id": "s1", "title": "Understand EscrowCreate", "content": "Study FinishAfter, CancelAfter, crypto-condition parameters"},
            {"id": "s2", "title": "Create Escrow", "content": "Lock funds with crypto-condition for deal release"},
            {"id": "s3", "title": "Verify Lock", "content": "Confirm locked funds on XRPScan"},
            {"id": "s4", "title": "Simulate Counterparty", "content": "Walk through verification flow"},
            {"id": "s5", "title": "Execute EscrowFinish", "content": "Release funds when condition met"},
            {"id": "s6", "title": "Document Proof", "content": "Add escrow proof to portfolio"}
        ]
    },
    "lab-stellar-001": {
        "id": "lab-stellar-001",
        "title": "Create a Stellar Claimable Balance",
        "chain": "stellar",
        "difficulty": "beginner",
        "duration_hours": 2,
        "fee_kenny": 10,
        "fee_evl": 40,
        "reward_xp": 400,
        "reward_pick": 40,
        "reward_nft": "Stellar Balance Creator Certificate",
        "prerequisites": ["course-crypto-basics"],
        "steps": [
            {"id": "s1", "title": "Create Stellar Wallet", "content": "Use Freighter or Albedo browser extension"},
            {"id": "s2", "title": "Fund with Testnet XLM", "content": "Use Friendbot at https://friendbot.stellar.org"},
            {"id": "s3", "title": "Open Trustline", "content": "Trust TROPTIONS Stellar issuer"},
            {"id": "s4", "title": "Create ClaimableBalance", "content": "Set time predicate (e.g., 30 days)"},
            {"id": "s5", "title": "Verify on Expert", "content": "Check https://stellar.expert/explorer/testnet"},
            {"id": "s6", "title": "Claim as Counterparty", "content": "Simulate claiming the balance"}
        ]
    },
    "lab-solana-001": {
        "id": "lab-solana-001",
        "title": "Deploy a Solana SPL Token",
        "chain": "solana",
        "difficulty": "beginner",
        "duration_hours": 2,
        "fee_kenny": 15,
        "fee_evl": 60,
        "reward_xp": 500,
        "reward_pick": 50,
        "reward_nft": "Solana Token Deployer Certificate",
        "prerequisites": ["course-crypto-basics"],
        "steps": [
            {"id": "s1", "title": "Set Up Phantom", "content": "Install Phantom wallet, switch to devnet"},
            {"id": "s2", "title": "Airdrop SOL", "content": "Get devnet SOL from https://faucet.solana.com/"},
            {"id": "s3", "title": "Create Token", "content": "Use Smithii no-code or spl-token CLI"},
            {"id": "s4", "title": "Configure Metadata", "content": "Set name, symbol, supply, decimals"},
            {"id": "s5", "title": "Revoke Mint Authority", "content": "Optional: make token trustless"},
            {"id": "s6", "title": "Verify on Solscan", "content": "Check https://solscan.io"}
        ]
    },
    "lab-solana-002": {
        "id": "lab-solana-002",
        "title": "Create a Raydium Liquidity Pool",
        "chain": "solana",
        "difficulty": "intermediate",
        "duration_hours": 4,
        "fee_kenny": 30,
        "fee_evl": 150,
        "reward_xp": 1500,
        "reward_pick": 150,
        "reward_nft": "Raydium LP Architect Certificate",
        "prerequisites": ["lab-solana-001", "course-amm-trading"],
        "steps": [
            {"id": "s1", "title": "Understand AMM", "content": "Constant product formula x*y=k"},
            {"id": "s2", "title": "Prepare Assets", "content": "Your token + SOL or USDC"},
            {"id": "s3", "title": "Create Pool", "content": "Use Raydium LaunchLab"},
            {"id": "s4", "title": "Deposit Liquidity", "content": "Set initial price and deposit"},
            {"id": "s5", "title": "Verify Pool", "content": "Check on Raydium interface"},
            {"id": "s6", "title": "Simulate Swap", "content": "Test trading through your pool"}
        ]
    },
    "lab-base-001": {
        "id": "lab-base-001",
        "title": "Launch a USDC Reward Vault on Base",
        "chain": "base",
        "difficulty": "intermediate",
        "duration_hours": 3,
        "fee_kenny": 20,
        "fee_evl": 100,
        "reward_xp": 800,
        "reward_pick": 80,
        "reward_nft": "Base Vault Builder Certificate",
        "prerequisites": ["course-defi-basics"],
        "steps": [
            {"id": "s1", "title": "Connect MetaMask", "content": "Add Base network (chain ID 8453)"},
            {"id": "s2", "title": "Bridge Test ETH", "content": "Use Base Sepolia bridge"},
            {"id": "s3", "title": "Deploy Vault", "content": "Use thirdweb or deploy custom contract"},
            {"id": "s4", "title": "Deposit USDC", "content": "Fund vault with Circle USDC"},
            {"id": "s5", "title": "Configure Rewards", "content": "Set distribution logic and parameters"},
            {"id": "s6", "title": "Verify on BaseScan", "content": "Check https://sepolia.basescan.org"}
        ]
    },
    "lab-x402-001": {
        "id": "lab-x402-001",
        "title": "Integrate x402 Payment Intelligence",
        "chain": "multi",
        "difficulty": "advanced",
        "duration_hours": 5,
        "fee_kenny": 40,
        "fee_evl": 200,
        "reward_xp": 2000,
        "reward_pick": 200,
        "reward_nft": "x402 Payment Architect Certificate",
        "prerequisites": ["lab-xrpl-001", "course-payment-rails"],
        "steps": [
            {"id": "s1", "title": "Understand x402", "content": "HTTP 402 paid API protocol"},
            {"id": "s2", "title": "Set Up API Key", "content": "Configure x402 wallet and key"},
            {"id": "s3", "title": "Request Risk Report", "content": "Call x402 token analysis endpoint"},
            {"id": "s4", "title": "Parse Metrics", "content": "Extract risk scores and indicators"},
            {"id": "s5", "title": "Build Dashboard", "content": "Display x402 intelligence in your dApp"},
            {"id": "s6", "title": "Document Integration", "content": "Add to portfolio"}
        ]
    },
    "lab-ttn-001": {
        "id": "lab-ttn-001",
        "title": "Launch Your TTN Creator Channel",
        "chain": "ipfs",
        "difficulty": "beginner",
        "duration_hours": 3,
        "fee_kenny": 10,
        "fee_evl": 50,
        "reward_xp": 300,
        "reward_pick": 30,
        "reward_nft": "TTN Creator Certificate",
        "prerequisites": [],
        "steps": [
            {"id": "s1", "title": "Choose Vertical", "content": "Select Sports/Events/Charity/Local/Creators/Business"},
            {"id": "s2", "title": "Set Up Owncast", "content": "Install streaming server"},
            {"id": "s3", "title": "Configure RTMP", "content": "Set ingest and HLS delivery"},
            {"id": "s4", "title": "Upload Video", "content": "Add content to MediaCMS archive"},
            {"id": "s5", "title": "Register Proof", "content": "IPFS CID + SHA-256 fingerprint"},
            {"id": "s6", "title": "Publish Channel", "content": "Go live on TTN"}
        ]
    },
    "lab-l1-001": {
        "id": "lab-l1-001",
        "title": "Understand TROPTIONS L1 Trust Boundaries",
        "chain": "troptions",
        "difficulty": "advanced",
        "duration_hours": 6,
        "fee_kenny": 50,
        "fee_evl": 250,
        "reward_xp": 2000,
        "reward_pick": 200,
        "reward_nft": "TROPTIONS Architect Certificate",
        "prerequisites": ["course-blockchain-101", "course-rwa-tokenization"],
        "steps": [
            {"id": "s1", "title": "Study 5-Stage Loop", "content": "POPEYE → TEV → CONSENSUS → MARS → TAR"},
            {"id": "s2", "title": "POPEYE Never Mutates", "content": "Understand why the network layer is read-only"},
            {"id": "s3", "title": "TEV Signature Verification", "content": "Trace unsigned payload rejection"},
            {"id": "s4", "title": "CONSENSUS Finality", "content": "Examine BFT certificate structure"},
            {"id": "s5", "title": "MARS Pure Function", "content": "Understand deterministic execution"},
            {"id": "s6", "title": "TAR Append-Only", "content": "Study persistence guarantees"},
            {"id": "s7", "title": "Write Summary", "content": "Document why trust boundaries are non-negotiable"}
        ]
    }
}

# Career pathways that use these labs
MULTI_CHAIN_CAREERS = {
    "xrpl-specialist": {
        "title": "XRPL Tokenization Specialist",
        "description": "Master XRPL for real-world asset tokenization and deal escrow",
        "courses": ["course-crypto-basics", "course-rwa-tokenization"],
        "labs": ["lab-xrpl-001", "lab-xrpl-002"],
        "estimated_time_days": 14,
        "monthly_cost": 79
    },
    "solana-builder": {
        "title": "Solana dApp Builder",
        "description": "Build high-performance dApps on Solana with token and DeFi integration",
        "courses": ["course-crypto-basics", "course-amm-trading"],
        "labs": ["lab-solana-001", "lab-solana-002"],
        "estimated_time_days": 21,
        "monthly_cost": 99
    },
    "multi-chain-architect": {
        "title": "Multi-Chain Infrastructure Architect",
        "description": "Design systems spanning XRPL, Stellar, Solana, Base, and TROPTIONS L1",
        "courses": ["course-crypto-basics", "course-defi-basics", "course-rwa-tokenization", "course-payment-rails"],
        "labs": ["lab-xrpl-001", "lab-stellar-001", "lab-solana-001", "lab-base-001", "lab-x402-001", "lab-l1-001"],
        "estimated_time_days": 60,
        "monthly_cost": 149
    },
    "ttn-creator": {
        "title": "TTN Sovereign Creator",
        "description": "Launch and monetize your own Web3 broadcast channel",
        "courses": ["course-crypto-basics"],
        "labs": ["lab-ttn-001", "lab-solana-001"],
        "estimated_time_days": 10,
        "monthly_cost": 49
    }
}
