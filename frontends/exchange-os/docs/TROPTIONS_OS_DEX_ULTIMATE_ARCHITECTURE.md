# TROPTIONS OS — DEX Ultimate Architecture

## System Identity

**TROPTIONS IS:** Institutional Exchange OS, launch-control system, compliance/due-diligence gate, token proof packet generator, issuer/wallet authority verifier, liquidity-readiness intelligence layer, non-custodial trading interface layer, XRPL + Solana + x402 + Apostle proof and settlement intelligence system, market monitoring and alerting layer, partner onboarding and launch committee control system, institutional proof room.

**TROPTIONS IS NOT:** Exchange operator, broker/dealer, market maker, underwriter, custodian, investment adviser, token promoter, or trading guarantor.

---

## Architecture Map

```
TROPTIONS OS
├── Exchange OS App (Next.js on Cloudflare Workers via opennextjs-cloudflare)
│   ├── /exchange-os                        — Main Exchange OS home
│   ├── /exchange-os/control-center         — Institutional control center dashboard
│   ├── /exchange-os/readiness              — Readiness checklist
│   ├── /exchange-os/solana-dex-map         — Solana DEX intelligence registry
│   ├── /exchange-os/xrpl-dex-intelligence  — XRPL DEX intelligence panel
│   ├── /exchange-os/token-proof-packet     — Proof packet requirements
│   ├── /exchange-os/partner-onboarding     — 12-stage partner pipeline + committee
│   ├── /exchange-os/market-monitoring      — Monitoring alerts + route architecture
│   ├── /exchange-os/status                 — Integration status
│   └── /exchange-os/compare                — Compare vs plain DEX
│
├── API Layer (Edge Runtime, static config only)
│   ├── /api/exchange-os/operating-model    — Operating principles, risk levels, claim rules
│   ├── /api/exchange-os/token-proof-packet — Proof packet field schemas
│   ├── /api/exchange-os/solana-venues      — Solana DEX registry, competitor watchlist, stack
│   ├── /api/exchange-os/xrpl-dex          — XRPL venue registry, issuer/AMM proof schemas
│   ├── /api/exchange-os/non-custodial-route— Route flow, chain models, guarantees
│   ├── /api/exchange-os/launch-committee   — Committee reviewers, documents, blockers
│   ├── /api/exchange-os/partner-onboarding — 12-stage onboarding pipeline
│   ├── /api/exchange-os/market-monitoring  — Alert types, data sources, runbook
│   ├── /api/exchange-os/readiness          — Readiness check (existing)
│   └── /api/exchange-os/solana-dex-map     — Solana DEX map (existing)
│
├── Data Layer (TypeScript config, no live chain calls)
│   ├── exchangeOsOperatingModel.ts         — Principles, risk levels, claim rules, readiness
│   ├── exchangeOsReadiness.ts              — Readiness checklist items (existing)
│   ├── exchangeOsFeatureFlags.ts           — Feature flags (all mainnet = false by default)
│   ├── tokenProofPacketRequirements.ts     — General, Solana, XRPL proof packet schemas
│   ├── solanaDexRegistry.ts               — Core DEX, competitor, open-source stack
│   ├── xrplDexRegistry.ts                 — XRPL venues, issuer proof, AMM proof, compliance
│   ├── nonCustodialRouteModel.ts          — Route flow, chain models, guarantees
│   ├── launchCommitteeControls.ts         — Reviewers, documents, blockers, escalation
│   ├── partnerOnboarding.ts               — 12-stage pipeline, provides, refuses
│   └── marketMonitoringRequirements.ts    — Alert types, data sources, incident runbook
│
└── Component Layer (React, SSR-safe)
    ├── ExchangeTruthBanner.tsx             — Truth label banner (existing)
    ├── ReadinessCard.tsx                   — Readiness card (existing)
    ├── SolanaDexCard.tsx                   — Solana DEX card (existing)
    ├── NonCustodialFlow.tsx                — Non-custodial flow display (existing)
    ├── TokenProofPacketPanel.tsx           — Proof packet requirements panel
    ├── SolanaVenueRiskMatrix.tsx           — Solana venue risk matrix table
    ├── XrplDexIntelligencePanel.tsx        — XRPL DEX intelligence panel
    ├── NonCustodialRouteArchitecture.tsx   — Route architecture step display
    ├── LaunchCommitteeControlPanel.tsx     — Committee reviewers, blockers, escalation
    ├── PartnerOnboardingPipeline.tsx       — 12-stage pipeline display
    └── MarketMonitoringPanel.tsx           — Alert types, runbook display
```

---

## Chain Integration Architecture

### Solana
- **Token Standards:** SPL Token, Token-2022 with extensions
- **DEX Layer:** Jupiter (aggregator), Meteora DLMM, Raydium CPMM/CLMM, Orca Whirlpools, OpenBook V2, Phoenix, Drift (monitor), Lifinity, Saros
- **RPC:** Helius primary, Triton/QuickNode fallback
- **Indexer:** Helius DAS
- **Price Oracle:** Pyth Network
- **Non-custodial:** Wallet Adapter (Phantom, Backpack, Solflare)
- **Proof Events:** tx hash + slot + program logs

### XRPL
- **Native DEX:** On-ledger order book (no smart contracts)
- **AMM:** XLS-30d AMM pools
- **Trustline Model:** User-signed trustline creation
- **RPC:** XRPL.org wss, Clio historical nodes
- **Non-custodial:** XUMM / xrpl.js wallet
- **Proof Events:** tx hash + ledger index + meta
- **Issuer Proof:** Domain, xrpl.toml, account flags, master key policy

### x402 / Apostle Chain
- **Protocol:** x402 pay-per-use proof receipts
- **Signing:** Ed25519 SovereignKeyring
- **Settlement:** ATP transactions on chain_id 7332
- **Proof Events:** x402 receipt + ATP settlement hash

---

## Security Architecture

See `TROPTIONS_EXCHANGE_OS_SECURITY_MODEL.md` for full detail.

- No private keys in code, environment, or logs
- All transactions unsigned until user wallet signs
- Cloudflare WAF/DDoS in place
- Feature flags: all mainnet/trading/launch default FALSE
- Audit log retention required for all admin actions
- Incident response runbook defined

---

## Data Flow

```
User → Connect Wallet (view-only)
     → Specify Intent (read-only)
     → TROPTIONS OS queries quotes (read-only RPC/API)
     → TROPTIONS displays routes (unsigned data)
     → TROPTIONS constructs unsigned tx (data only)
     → Wallet shows tx to user (user reviews)
     → User signs in wallet (private key never leaves wallet)
     → Signed tx broadcast to chain
     → TROPTIONS reads confirmation (read-only)
     → TROPTIONS logs proof event (audit only, no custody)
     → Monitoring continues (read-only)
```

---

## Feature Flags (Production Defaults)

| Flag | Default | Description |
|------|---------|-------------|
| XRPL_MAINNET_ENABLED | false | Live XRPL mainnet queries |
| SOLANA_MAINNET_ENABLED | false | Live Solana mainnet queries |
| TOKEN_LAUNCH_ENABLED | false | Guided token launch flow |
| LIVE_TRADING_ENABLED | false | Non-custodial trading interface |
| PROOF_PACKET_GENERATION_ENABLED | false | Proof packet generation |
| PARTNER_INTAKE_ENABLED | true | Partner onboarding display |
| READINESS_PAGES_ENABLED | true | Readiness and compliance pages |
| API_STATIC_READINESS_ENABLED | true | Static API routes |
