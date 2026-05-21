---
title: Institutional Counterparty Proof Package
layout: default
permalink: /technical/counterparty/PROOF_FOR_COUNTERPARTIES.html
---

# Institutional Counterparty Proof Package

**Tone:** Links and verifiable facts only — no hype.  
**Not legal advice.** This document is a technical diligence aid. Figures labeled **PROJECTION** or **PIPELINE** are illustrative, not audited financial statements.

**Configure path (2–4 weeks engineering):** [`BUILD_AVID_ON_TROPTIONS.md`](BUILD_AVID_ON_TROPTIONS.md)

---

## What exists (PROVEN)

### Polygon — community tokens

| Asset | Address | Explorer | Repo |
|-------|---------|----------|------|
| **KENNY** | `0x93F2a3266a81c1F3Ee2c196b90890A959bC69BD7` | [PolygonScan](https://polygonscan.com/token/0x93F2a3266a81c1F3Ee2c196b90890A959bC69BD7) | `contracts/polygon/KennyToken.sol` |
| **EVL** | `0xAFe185415D21671704EFaa5696dD219ACEB9fdA3` | [PolygonScan](https://polygonscan.com/token/0xAFe185415D21671704EFaa5696dD219ACEB9fdA3) | `contracts/polygon/EvolveToken.sol` |

- **Operator UI:** [fthedu.unykorn.org](https://fthedu.unykorn.org) — token pages reference contracts above.

### Polygon — Genesis World (9 contracts)

- Full table: [`../GENESIS_POLYGON_CONTRACTS.md`](../GENESIS_POLYGON_CONTRACTS.html)
- Partner repo: [github.com/FTHTrading/genesis-world](https://github.com/FTHTrading/genesis-world)
- Live app: [drunks.app](https://drunks.app)

### XRPL & Stellar — issued supply on ledger

- **Unified registry:** [`../ON_CHAIN_PROOF.md`](../ON_CHAIN_PROOF.html)
- **Verification report:** [`../XRPL_STELLAR_VERIFICATION.md`](../XRPL_STELLAR_VERIFICATION.html)

| Chain | Role | Address |
|-------|------|---------|
| XRPL | Production issuer | `rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ` |
| XRPL | Distribution | `rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt` |
| XRPL | AMM pool | `rBU6exSQHkrTog6n1F5RX8gzcUrXoniGcp` |
| Stellar | Issuer | `GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4` |
| Stellar | Distribution | `GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC` |

**Cross-chain issued supply (ledger IOUs, not market cap):** TROPTIONS ~200M, USDC **274M**, USDT 200M, EURC 100M, DAI 100M (~874M total). Do **not** cite Exchange OS desk notionals as on-chain proof.

### x402 payment mesh (health)

- [x402.unykorn.org/health](https://x402.unykorn.org/health) — operator label **CONFIRMED** (2026-05-21)
- Repo: [github.com/FTHTrading/UnyKorn-X402-aws](https://github.com/FTHTrading/UnyKorn-X402-aws)

### Monorepo, PM2 stack, Rust tests

| Item | Link / command |
|------|----------------|
| **Troptions-full-pack** | [github.com/FTHTrading/Troptions-full-pack](https://github.com/FTHTrading/Troptions-full-pack) |
| **Local quickstart** | `scripts/quickstart.ps1` · **8 PM2 services** — `FINAL_ECOSYSTEM_AUDIT.md` |
| **Rust L1** | `l1/` · `cargo test --workspace` (passes per audit 2026-05-21) |
| **Docs / investor mirror** | [fthtrading.github.io/Troptions-full-pack/](https://fthtrading.github.io/Troptions-full-pack/) |

### Live UnyKorn URLs (operator HTTP checks)

| Surface | URL | Status |
|---------|-----|--------|
| Troptions hub | [troptions.unykorn.org/troptions](https://troptions.unykorn.org/troptions) | PROVEN |
| FTH education | [fthedu.unykorn.org](https://fthedu.unykorn.org) | PROVEN |
| Token launcher | [launch.unykorn.org](https://launch.unykorn.org) | PROVEN |
| Sports / TTN | [troptionslive.unykorn.org/sports](https://troptionslive.unykorn.org/sports) | PROVEN |
| Exchange OS | [troptionsexchange.unykorn.org/exchange-os](https://troptionsexchange.unykorn.org/exchange-os) | PROVEN |
| x402 health | [x402.unykorn.org/health](https://x402.unykorn.org/health) | PROVEN |
| Genesis app | [drunks.app](https://drunks.app) | PROVEN |

Full map: [`../ECOSYSTEM_MAP.md`](../ECOSYSTEM_MAP.html) · scorecard: [`../FINAL_ECOSYSTEM_AUDIT.md`](../FINAL_ECOSYSTEM_AUDIT.html)

---

## The DAO stack — what was built

### L1 sovereign sequencer (`l1/`)

Rust node exposing JSON-RPC (default `:9944`) with:

| Module | Capability |
|--------|------------|
| **Soulbound** | Credential mint / revoke — non-transferable attestations |
| **Settlement** | HTLC-style settlement paths on L1 state |
| **Treasury** | On-chain treasury balances and disbursement RPCs |
| **Governance** | Proposals, votes, **execute** (signed submit-RPC in production branch) |

Spec: `docs/L1_SPEC.md` · persistence on `upgrade/10-production` branch (RocksDB).

### DAO service & dashboard

| Component | Path | Port |
|-----------|------|------|
| **dao-service** | `backend/dao-service/` | `:8093` — health, `/dao/state`, L1 mirror |
| **dao-dashboard** | `frontends/dao-dashboard/` | Served with dao-service |
| **Python light client** | `backend/dao-service/main.py` | Mirrors L1 governance + treasury for ops |

Guide: `docs/DAO.md` · bootstrap: `scripts/bootstrap-dao.ps1`

### Eight genesis brand domains (soulbound issuers)

Registered in `dao/registry/genesis_brands.json`:

1. TROPTIONSXCHANGE.IO — Exchange OS  
2. TROPTIONS-UNIVERSITY.COM — FTH Academy  
3. TROPTIONSTelevisionNetwork.Tv — TTN Sports  
4. HOTRCW.COM — TTN  
5. TROPTIONS.IO / TROPTIONS.ORG — Platform  
6. TheRealEstateConnections.com — Real Estate  
7. Green-N-Go.Solar — Solar Platform  

Namespaces migrate to L1 soulbounds via `scripts/migrate-namespaces-to-l1.py` (dry-run first).

### How a counterparty tokenized ecosystem configures

Executable engineering path (not self-serve mainnet in one session):

1. **Namespaces** — map brand domains → L1 soulbound issuers (`dao/registry/`, Exchange OS `locked-namespaces.ts`).  
2. **DAO realm** — proposals, voter credentials, treasury policy (`dao/governance/`, L1 `governance` crate).  
3. **Academy / TTN** — `backend/fth-academy/`, `backend/ttn-launcher/`, WC2026 hooks in Exchange OS.  
4. **Production cutover** — merge `upgrade/10-production`, signed RPC keys, TLS/nginx, compliance gates in `docs/TROPTIONS-GENESIS-BUILD.md`.

**Step-by-step configure doc:** [`BUILD_AVID_ON_TROPTIONS.md`](BUILD_AVID_ON_TROPTIONS.md) (2–4 weeks with TROPTIONS engineering; ~15 minutes is local demo only).

### SNP — constitutional namespace layer (optional satellite)

**Sovereign Namespace Protocol** — post-quantum namespace roots and verification primitives consumed by L1 migration and Exchange OS proof surfaces. Not a standalone revenue product; governs allowed names/claims.

- Repo: [github.com/FTHTrading/sovereign-namespace-protocol](https://github.com/FTHTrading/sovereign-namespace-protocol)
- Context: [`../ECOSYSTEM_MAP.md`](../ECOSYSTEM_MAP.html) § SNP

### x402 — pay-per-request for agent APIs

Metered API pricing and ATP settlement on Apostle Chain — **separate** from core DAO/L1 configure path. Optional branch `feature/x402-full-integration`; do not block ecosystem go-live on x402 unless contracted.

---

## Configure onboarding

| Phase | Duration | Outcome |
|-------|----------|---------|
| Orientation | ~15 min | Clone, quickstart, architecture read — **dev/demo only** |
| Production configure | **2–4 weeks** | Signed RPC, DAO realm, soulbound mapping, TLS, compliance sign-off |

**Canonical configure prompt:** [`BUILD_AVID_ON_TROPTIONS.md`](BUILD_AVID_ON_TROPTIONS.md)

**Prerequisites:** mutual NDA, client intake, engineering contacts both sides for keys and DNS.

---

## PENDING (say out loud)

| Item | Notes |
|------|-------|
| **ai.troptions.org** | DNS not pointed; AI edge on alternate host |
| **twin.unykorn.org** | Cloudflare origin flaky / timeout (2026-05-21) |
| **x402api.unykorn.org** | Same — re-probe before demos |
| **Full BFT L1** | Single-node sovereign sequencer today; multi-validator quorum is roadmap |
| **Public TLS on all L1 RPC** | Production nginx cutover per `docs/DEPLOY_PRODUCTION.md` |
| **Legacy XRPL gateway** `rPF2M1QjRj72rHdJyRqfFRTqWREBdJds3` | README only — superseded by production issuer `rJLMST…` |

---

## Engineering maturity (honest)

**9.5 / 10** — Polygon, genesis-world, and XRPL/Stellar issued-supply proofs verified; intermittent Cloudflare origins keep the gap. Breakdown: `FINAL_ECOSYSTEM_AUDIT.md` § Honest Scorecard.

**Not BFT mainnet today.** Do not describe current L1 as Byzantine-fault tolerant.

---

## Downloads (investor PDF HTML pack)

Print → Save as PDF from browser:

| Document | Path |
|----------|------|
| Executive summary | [`../../downloads/investor-executive-summary.html`](../../downloads/investor-executive-summary.html) |
| On-chain proof sheet | [`../../downloads/on-chain-proof-sheet.html`](../../downloads/on-chain-proof-sheet.html) |
| Infrastructure atlas | [`../../downloads/infrastructure-atlas.html`](../../downloads/infrastructure-atlas.html) |
| Opportunity & roadmap | [`../../downloads/opportunity-and-roadmap.html`](../../downloads/opportunity-and-roadmap.html) |
| One-pager (markdown) | [`../investor/ONE_PAGER.md`](../investor/ONE_PAGER.md) |

---

## Attach for diligence review

1. This file  
2. [`BUILD_AVID_ON_TROPTIONS.md`](BUILD_AVID_ON_TROPTIONS.md)  
3. [`../ON_CHAIN_PROOF.md`](../ON_CHAIN_PROOF.html)  
4. Optional: [`../investor/ONE_PAGER.md`](../investor/ONE_PAGER.md)
