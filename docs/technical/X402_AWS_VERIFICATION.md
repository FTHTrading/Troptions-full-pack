---
title: UnyKorn X402 AWS verification
layout: default
permalink: /technical/X402_AWS_VERIFICATION.html
---

# UnyKorn-X402-aws — verification report

**Date:** 2026-05-21 (verified)  
**Repo:** [FTHTrading/UnyKorn-X402-aws](https://github.com/FTHTrading/UnyKorn-X402-aws)  
**Local clone:** `C:\Users\Kevan\GitHub_Audit\UnyKorn-X402-aws` (867 files)

---

## Production vs monorepo sidecar

| Surface | Where | Status |
|---------|-------|--------|
| **Public mesh** | UnyKorn-X402-aws on AWS + Cloudflare | ✅ [x402.unykorn.org/health](https://x402.unykorn.org/health) → **HTTP 200** (2026-05-21) |
| **Monorepo sidecar** | `Troptions-full-pack/backend/x402-gateway/` (:4020) | Staged/proxy; not the public mesh unless you deploy and point DNS |

Do not conflate the two in investor materials.

---

## Rust financial core

**Path:** `packages/fth-financial-core/`

| Crate | Role |
|-------|------|
| `fth-types` | Core types |
| `fth-ledger` | Ledger |
| `fth-risk` | Risk engine |
| `fth-settlement` | Settlement |
| `fth-vault` | Vault |
| `fth-api` | HTTP API (Axum) |

**Count:** 6 workspace crates (+ optional `services/rust-signer` elsewhere in repo).  
**Build:** Prior audit recorded `cargo check` pass (~19s). Re-run before release tags.

---

## fth-guardian

| Claim | Evidence |
|-------|----------|
| 23 files in package | ✅ **Confirmed** — `packages/fth-guardian/` (routes, 7 daemons, core modules) |

---

## Package inventory (source exists)

| Component | Files (approx.) | Verified |
|-----------|-----------------|----------|
| fth-financial-core | 45 | ✅ builds |
| fth-guardian | 23 | ✅ |
| fth-metering | 6 | ✅ |
| fth-x402-facilitator | 38 | ✅ |
| fth-x402-gateway | 11 | ✅ |
| fth-x402-treasury | 12 | ✅ |
| unyKorn-contracts | 39 | ✅ |
| unyKorn-wallet | 39 | ✅ |
| x402-agent-ecosystem | 10 | ✅ |
| db/migrations-x402 | 20 | ✅ |
| aws/docker, aws/terraform | 15 + 17 | ✅ |

---

## Live endpoints (2026-05-21)

| Endpoint | DNS | HTTP HEAD | Notes |
|----------|-----|-----------|-------|
| x402.unykorn.org/health | ✅ | **200** | Primary health — use in demos |
| twin.unykorn.org | ✅ | timeout | Agent mesh UI — origin flaky |
| x402api.unykorn.org | ✅ | timeout | API docs — re-probe |
| troptions.unykorn.org | ✅ | **200** | Related brand hub |

**CORRECTED:** Draft audit reported all HTTP as timeout; production health and several Unykorn hosts respond **200** from this machine.

---

## README claims vs evidence

| Claim | Status |
|-------|--------|
| Rust financial core (6 crates) | ✅ CONFIRMED |
| Guardian daemons (7) | ✅ Code in `fth-guardian/src/daemons/` |
| PostgreSQL migrations | ✅ `db/migrations-x402/` |
| 35 AI agents live | ⚠️ Code only — not counted live |
| 3,200+ transactions | ⚠️ No log verified in repo |
| 2.86M ATP | ⚠️ Not verified on-chain in this pass |
| 66 GitHub deployments | ⚠️ GitHub UI — not re-fetched here |

---

## Apostle chain (local + mesh)

- PM2 `apostle-chain` → `C:\cargo-target-burnzy\release\apostle-chain.exe` (~**4.7 MB**)
- Listens **:7332** — referenced by monorepo `ecosystem.config.js` (`APOSTLE_URL`)
- Public health JSON should report `chain_id: 7332` when mesh is live

---

## Next actions

1. `npm run x402:smoke` (or repo-documented smoke) from UnyKorn-X402-aws after `npm ci`.
2. Cloudflare origin check for `twin` and `x402api`.
3. Snowtrace / Apostle ledger spot-check for ATP claims if marketing uses numbers.

See also [X402_INTEGRATION.md](X402_INTEGRATION.html) and [FINAL_ECOSYSTEM_AUDIT.md](FINAL_ECOSYSTEM_AUDIT.html).
