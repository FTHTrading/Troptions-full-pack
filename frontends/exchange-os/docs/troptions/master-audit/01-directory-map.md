# Audit Phase 01 — Full Directory Map

**Audit Date:** 2026-04-28  
**Auditor:** GitHub Copilot (Read-Only Audit Mode)

> **Safety Notice:** This is a structural survey only. No code was executed, no secrets accessed.

---

## Root Layout

```
c:\Users\Kevan\troptions\
├── AGENTS.md                          # AI agent behavioral instructions
├── CLAUDE.md                          # Claude-specific agent context
├── CONTRIBUTING.md                    # Contribution guidelines
├── DNS-SETUP.md                       # DNS configuration guide
├── env-secrets.txt                    # Reference only (gitignored)
├── eslint.config.mjs                  # ESLint flat config
├── fix-worker-imports.js              # Build utility
├── jest.config.ts                     # Jest configuration
├── LICENSE                            # License file
├── netlify.toml                       # Netlify deploy config
├── next-env.d.ts                      # Next.js type declarations
├── next.config.ts                     # Next.js config (proxy rewrites)
├── open-next.config.ts                # OpenNext (Cloudflare) config
├── package.json                       # Node dependencies
├── patch-wrangler-local.js            # Wrangler local patch utility
├── patch-wrangler.js                  # Wrangler patch utility
├── postcss.config.mjs                 # PostCSS config (Tailwind)
├── README.md                          # Project readme
├── SECURITY.md                        # Security policy
├── TROPTIONS_SITE_REBUILD_REPORT.md   # Historical rebuild report
├── TROPTIONS_SITE_REPAIR_REPORT.md    # Historical repair report
├── TROPTIONS_SYSTEM_VALIDATION_REPORT.md # Historical validation report
├── tsconfig.json                      # TypeScript config
├── vercel.json                        # Vercel config (legacy/fallback)
├── wrangler.jsonc                     # Cloudflare Workers config
│
├── data/                              # Runtime/control-plane data
│   ├── treasury-funding-log.json      # Dry-run funding log (all simulated)
│   ├── observability/                 # Observability snapshots
│   │   ├── observability-2026-04-25T20-06-24-462Z.json
│   │   └── recovery-timing-2026-04-25T20-06-23-824Z.json
│   ├── tmp/                           # Temporary working files
│   └── troptions-control-plane/       # Control-plane JSON state
│       ├── actions.json
│       ├── alerts.json
│       ├── approvals.json
│       └── (additional state files)
│
├── docs/                              # All documentation
│   ├── architecture.md
│   ├── brand-system.md
│   ├── IPFS-INTEGRATION.md
│   ├── PHASE20-GENESIS-HASH-IPFS-LOCK.md
│   ├── README.md
│   ├── repository-map.md
│   ├── TROPTIONS-CLOUD-MEMBERSHIP-NAMESPACE.md
│   ├── TROPTIONS-GENESIS-BUILD.md
│   ├── TROPTIONS-SOVEREIGN-AI.md
│   ├── xrpl-platform.md
│   ├── layer1/                        # Layer 1 / NIL / Rust docs (20 files)
│   ├── runbooks/                      # Operational runbooks (10 files)
│   ├── troptions/                     # Core Troptions docs (70+ files)
│   │   └── master-audit/              # ← THIS AUDIT OUTPUT (created this session)
│   ├── troptions-cloud/               # Cloud namespace docs (7 files)
│   └── troptions-web3/                # Web3 architecture docs (1 file)
│
├── extensions/
│   └── troptions-wallet-assistant/    # VS Code wallet assistant extension
│
├── public/                            # Static public assets
│   ├── ai.txt                         # AI capability declaration
│   ├── llms.txt                       # LLM discovery endpoint
│   ├── troptions-capabilities.json
│   ├── troptions-entity-map.json
│   ├── troptions-genesis.json         # Genesis document (locked)
│   ├── troptions-genesis.locked.json
│   ├── troptions-genesis-release.json
│   ├── troptions-knowledge.json
│   ├── troptions-proof-index.json
│   ├── assets/                        # Static images/media
│   └── troptions/                     # Public Troptions static files
│
├── scripts/                           # Operational scripts (mjs)
│   ├── backup-control-plane.mjs
│   ├── capture-recovery-timing.mjs
│   ├── check-policy-gates.mjs
│   ├── check-postgres-connection.mjs
│   ├── cutover-control-plane-to-postgres.mjs
│   ├── export-observability-snapshot.mjs
│   ├── extract-momentum-pdf.mjs       # Untracked utility
│   ├── extract-momentum-v2.mjs        # Untracked utility
│   ├── fund-treasury-wallets.mjs      # Dry-run only
│   ├── genesis-blockchain-setup.mjs
│   ├── migrate-sqlite-to-postgres.mjs
│   ├── phase20-genesis-lock.mjs
│   ├── plan-troptions-asset-provisioning.mjs
│   ├── provision-troptions-assets.mjs # Dry-run / simulation only
│   ├── restore-control-plane.mjs
│   ├── rotate-backups.mjs
│   ├── run-incident-drill.mjs
│   ├── run-production-smoke-checks.mjs
│   ├── run-rollback-drill.mjs
│   ├── validate-env.mjs
│   ├── validate-phase20.mjs
│   └── validate-troptions-asset-metadata.mjs
│
├── src/                               # Application source (Next.js 15 App Router)
│   ├── __tests__/                     # Jest test suites (39 files across 4 namespaces)
│   ├── app/                           # Next.js App Router pages + API routes
│   │   ├── api/                       # ~130 API route handlers
│   │   ├── admin/                     # Admin dashboard pages
│   │   ├── troptions/                 # Core Troptions public pages
│   │   ├── troptions-nil/             # NIL (Name, Image, Likeness) pages
│   │   ├── troptions-cloud/           # Cloud namespace pages
│   │   ├── troptions-ai/              # Sovereign AI pages
│   │   ├── troptions-live/            # Live chain dashboard
│   │   ├── troptions-old-money/       # Legacy/Old Money module
│   │   ├── troptions-portal/          # Client portal
│   │   └── ttn/                       # TTN Creator/Media platform
│   ├── components/                    # React components
│   ├── content/                       # Static content registries (~100 TS files)
│   ├── lib/                           # Engine libraries (~130 TS files)
│   └── styles/                        # Global CSS / Tailwind
│
└── troptions-rust-l1/                 # Rust Layer 1 workspace
    ├── Cargo.toml                     # Workspace manifest (28 crates)
    ├── Cargo.lock
    ├── crates/
    │   ├── agora/         # Agora governance engine
    │   ├── amm/           # AMM (automated market maker)
    │   ├── assets/        # Asset primitives
    │   ├── brands/        # Brand registry
    │   ├── bridge-stellar/ # Stellar bridge
    │   ├── bridge-xrpl/   # XRPL bridge
    │   ├── cli/           # CLI interface
    │   ├── compliance/    # Compliance rules
    │   ├── consensus/     # Consensus engine
    │   ├── control-hub/   # Control Hub integration
    │   ├── crypto/        # Standard cryptography
    │   ├── genesis/       # Genesis block logic
    │   ├── governance/    # Governance primitives
    │   ├── mbridge/       # Multi-chain bridge
    │   ├── nft/           # NFT primitives
    │   ├── nil/           # NIL protocol (with tests/)
    │   ├── node/          # Node entry point
    │   ├── pq-crypto/     # Post-quantum cryptography
    │   ├── rln/           # RLN compatibility
    │   ├── rpc/           # RPC interface
    │   ├── runtime/       # Runtime engine
    │   ├── rwa/           # Real-world asset module
    │   ├── sdk/           # SDK interface
    │   ├── stablecoin/    # Stablecoin module
    │   ├── state/         # State management
    │   ├── telemetry/     # Telemetry/metrics
    │   └── trustlines/    # Trustline management
    └── docs/
        └── layer1/        # Rust L1 documentation
```

---

## Key Count Summary

| Category | Count |
|---|---|
| Next.js App Router pages | ~150 |
| API route handlers | ~130 |
| TypeScript lib engines | ~130 |
| TypeScript content registries | ~100 |
| Jest test files | 39 |
| Rust crates | 28 |
| Documentation markdown files | 90+ |
| Operational scripts | 20+ |
