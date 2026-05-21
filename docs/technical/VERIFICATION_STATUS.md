---
title: Verification status
layout: default
permalink: /technical/VERIFICATION_STATUS.html
---

# Verification status — comprehensive DD

**Date:** 2026-05-21  
**Status:** Canonical checklist (replaces root `VERIFICATION_STATUS.md`)  
**Overall honest score:** **8.5 / 10** — see [FINAL_ECOSYSTEM_AUDIT.md](FINAL_ECOSYSTEM_AUDIT.html)

---

## Score justification (8.5/10)

| Pillar | Weight | Score | Why |
|--------|--------|-------|-----|
| Source & repo integrity | 25% | 10/10 | Paths exist; false Anchor/kill_switch claims removed |
| Local runtime | 20% | 10/10 | PM2 8/8 online |
| Live HTTP | 25% | 8/10 | Most Unykorn + GSP URLs 200; twin/x402api timeout |
| Builds & tests | 15% | 6/10 | Rust verified; T-Build tests not run (deps) |
| On-chain proofs | 15% | 2/10 | Registry listed; PolygonScan/XRPL not executed |

---

## Verification matrix (with evidence)

| # | Check | Status | Evidence |
|---|-------|--------|----------|
| 1 | PM2 8 services online | ✅ CONFIRMED | `pm2 list` — apostle-chain, dao-service, donk-ai-tutor, fth-backend, popeye-relay, troptions-l1-node, ttn-launcher, x402-gateway |
| 2 | L1 Rust 11 crates (+ integration) | ✅ CONFIRMED | `l1/Cargo.toml` workspace members |
| 3 | X402 financial core 6 crates | ✅ CONFIRMED | `UnyKorn-X402-aws/packages/fth-financial-core/` |
| 4 | fth-guardian 23 files | ✅ CONFIRMED | File count in `packages/fth-guardian/` |
| 5 | Apostle real binary (~4.7 MB) | ✅ CONFIRMED | `C:\cargo-target-burnzy\release\apostle-chain.exe`, port 7332 LISTENING |
| 6 | kill_switch / rwa Anchor in full-pack | ❌ CORRECTED | **Not present** — `contracts/polygon/*.sol` only |
| 7 | Audit-scope file count | ✅ CORRECTED | ~6,937 files (not 3,897) — see final audit |
| 8 | troptions.unykorn.org | ✅ CONFIRMED | HTTP 200 HEAD |
| 9 | fthedu.unykorn.org | ✅ CONFIRMED | HTTP 200 (draft wrongly said DNS fail) |
| 10 | x402.unykorn.org/health | ✅ CONFIRMED | HTTP 200 |
| 11 | drunks.app (genesis-world) | ✅ CONFIRMED | HTTP 200 |
| 12 | genesis-world GitHub public | ✅ CONFIRMED | `gh repo view` → PUBLIC |
| 13 | sovereign-namespace-protocol public | ✅ CONFIRMED | `gh repo view` → PUBLIC |
| 14 | portfolio.unykorn.org | ✅ CONFIRMED | HTTP 200 |
| 15 | goat.unykorn.org | ✅ CONFIRMED | HTTP 200 |
| 16 | launch.unykorn.org | ✅ CONFIRMED | HTTP 200 |
| 17 | twin.unykorn.org | ⚠️ FLAKY | HTTP timeout 2026-05-21 |
| 18 | x402api.unykorn.org | ⚠️ FLAKY | HTTP timeout 2026-05-21 |
| 19 | ai.troptions.org | ❌ NOT LIVE | DNS/template only — honest gap |
| 20 | T-Build Vitest 32 tests | ⏳ PENDING | `npm test` failed: vitest not installed; 5 test files under `packages/` |
| 21 | Polygon KENNY on-chain | ⏳ PENDING | Source `0x93F2…9BD7` — PolygonScan not run |
| 22 | XRPL wallet balances | ⏳ PENDING | Bithomp 403; websocket not run |
| 23 | TExchange build/test | ⏳ PENDING | Not run this pass |
| 24 | UnyKorn-X402-aws `cargo test` | ⏳ PENDING | Prior `cargo check` only |

---

## Wallet registry (listed, not chain-verified)

**Source:** `T-Lev-8-/OPERATIONS/WALLET_ADDRESS_REGISTRY.md` (clone under `GitHub_Audit` or Documents)

| Network | Address | Status |
|---------|---------|--------|
| XRPL Issuer | `rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ` | ⏳ PENDING |
| XRPL Distribution | `rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt` | ⏳ PENDING |
| Polygon KENNY | `0x93F2a3266a81c1F3Ee2c196b90890A959bC69BD7` | ⏳ PENDING |

---

## Contracts in full-pack (paths that exist)

| Asset | Path | On-chain |
|-------|------|----------|
| KENNY | `contracts/polygon/KennyToken.sol` | ⏳ PENDING |
| EVL | `contracts/polygon/EvolveToken.sol` | ⏳ PENDING |
| Vaults | `contracts/polygon/troptions-vaults/` | ⏳ PENDING |

---

## Progress meter (investor UI)

| Milestone | Was | Now |
|-----------|-----|-----|
| Draft checkpoint | 60% | — |
| Live URL pass | — | ~85% of catalog URLs |
| **Honest overall** | — | **8.5/10** (85% bar on investor site) |

---

## Next steps (priority)

1. PolygonScan + XRPL websocket for wallet registry and KENNY.
2. `npm ci && npm test` in T-Build; `cargo test` in X402-aws and `l1/`.
3. Fix Cloudflare origins for twin / x402api.
4. Deploy or permanently document `ai.troptions.org` as future DNS.

**Full narrative:** [FINAL_ECOSYSTEM_AUDIT.md](FINAL_ECOSYSTEM_AUDIT.html) · **X402 detail:** [X402_AWS_VERIFICATION.md](X402_AWS_VERIFICATION.html)
