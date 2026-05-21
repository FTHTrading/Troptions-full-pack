# What is built (honest inventory)

Condensed snapshot for investors and operators. **Last updated:** 2026-05-21.

## Live public surfaces (verified)

| Surface | URL |
|---------|-----|
| Institutional / Exchange OS hub | https://troptions.unykorn.org/troptions |
| TTN sports / WC26 | https://troptionslive.unykorn.org/sports |
| Solana token launcher | https://launch.unykorn.org |
| FTH Academy (Stripe tiers) | https://fthedu.unykorn.org |

## Not deployed on troptions.org DNS

- `ai.troptions.org`, `ttn.troptions.org`, `dao.troptions.org` — nginx templates only; **future DNS when operator enables**.
- Public AI tutor / DAO edge: run locally via quickstart or point DNS when ready.

## x402 (honest split)

| Item | Status |
|------|--------|
| `backend/x402-gateway/` on **main** | Code present; default **LOCAL_ONLY** / staged |
| https://x402.unykorn.org/health | **Live** on UnyKorn AWS — separate from Troptions L1 mainnet posture |

## Sovereign L1 (repo-verified)

- **11** Rust crates under `l1/crates/` (+ integration tests crate)
- RocksDB persistence, treasury multisig, signed RPC submit tests
- **~28** Rust workspace tests; **13** pytest (backend + DAO)
- Single-node **Sovereign Sequencer** (not BFT) — labeled in README
- Gaps: public TLS on troptions.org hostnames, fraud proofs (design only), multi-node sequencer

## Contracts (paths that exist)

| Asset | Location / note |
|-------|-----------------|
| KENNY Polygon | `contracts/polygon/KennyToken.sol` — mainnet `0x93F2…9BD7` |
| EVL / sale stubs | `contracts/polygon/EvolveToken*.sol` |
| Vaults | `contracts/polygon/troptions-vaults/TroptionsGatewayVault.sol`, `TroptionsUSDCVault.sol` |
| XRPL Exchange OS | `contracts/xrpl/exchange-os-*` |
| Solana launcher scripts | `contracts/solana/scripts/` |
| **kill_switch** | **Not present** in repo — do not claim |

## Revenue posture (honest)

| Pillar | Status |
|--------|--------|
| Academy $19 / $49 / $149 | **Live** (fthedu.unykorn.org) |
| Sports WC26 $500–$10K tiers | **Pipeline** |
| Exchange / desk | **Attestation** — link proofs; no unverified $175M as fact |
| launch.unykorn.org | **Live** |
| T-Lev-8 deal room | https://fthtrading.github.io/T-Lev-8-/ |

## Engineering maturity

**9.0 / 10** on `main` (production hardening). See [truth labels](proof/truth-labels.html) and [`assets/data/truth-labels.json`](assets/data/truth-labels.json).

## Site

Primary investor landing: **`docs/index.html`** (static; takes precedence over Jekyll home). Full documentation: Jekyll subpages under `/executive/`, `/proof/`, `/infrastructure/`.
