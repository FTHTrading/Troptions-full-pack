---
title: Verification status
layout: default
permalink: /technical/VERIFICATION_STATUS.html
---

# Verification status

**Last run:** 2026-05-21 (agent + operator baseline)  
**Overall:** ~**68%** complete (was 60% before genesis-world public + live URL checks)

Re-run non-key checks: [`scripts/verify-ecosystem-links.ps1`](../../scripts/verify-ecosystem-links.ps1)

---

## Priority order (what moves the bar fastest)

1. **Live URLs** — `curl` / HTTP HEAD (no keys)
2. **Repo builds & tests** — `cargo test`, `npm test`, `npm run build`
3. **On-chain** — PolygonScan V2, Bithomp, XRPL balance proof (needs `POLYGONSCAN_API_KEY` optional in `.env.example`)

---

## CONFIRMED

| Check | Evidence | Last check |
|-------|----------|------------|
| PM2 stack | 8/8 online: `apostle-chain`, `dao-service`, `donk-ai-tutor`, `fth-backend`, `popeye-relay`, `troptions-l1-node`, `ttn-launcher`, `x402-gateway` | 2026-05-21 |
| Apostle process | `apostle-chain` PM2 online on :7332 (HTTP responds; health path not standardized) | 2026-05-21 |
| Troptions-full-pack contracts | Source in `contracts/polygon/` (KENNY, EVL, vaults) | 2026-05-21 |
| **genesis-world public** | `gh repo view` → **PUBLIC**; cloned `C:\Users\Kevan\genesis-world` | 2026-05-21 |
| genesis-world build | `cargo test --workspace` — exit 0 (workspace compiles; many crates 0 unit tests) | 2026-05-21 |
| drunks.app | HTTP 200 | 2026-05-21 |
| gsp-api Worker | `https://gsp-api.kevanbtc.workers.dev/api/health` → 200 `status: ok` | 2026-05-21 |
| troptions.unykorn.org DNS | `nslookup` → Cloudflare addresses | 2026-05-21 |
| T-Lev-8- | `C:\Users\Kevan\Documents\UNYKORN_Ecosystem\T-Lev-8-` and `Documents\GitHub\T-Lev-8-` | 2026-05-21 |
| T-Build | `C:\Users\Kevan\Documents\UNYKORN_Ecosystem\T-Build` | 2026-05-21 |
| aurora-site | `C:\Users\Kevan\Documents\UNYKORN_Ecosystem\aurora-site` | 2026-05-21 |
| impact-site | `C:\Users\Kevan\Documents\UNYKORN_Ecosystem\impact-site` | 2026-05-21 |
| TExchange | `C:\Users\Kevan\GitHub_Audit\TExchange` (2092+ files) | 2026-05-21 |
| x402.unykorn.org | HTTP 200 health (prior curl) | 2026-05-21 |
| Unykorn live surfaces | See [ECOSYSTEM_MAP](ECOSYSTEM_MAP.html) live table | 2026-05-21 |

---

## VERIFIED THIS RUN (2026-05-21)

| Check | Result | Notes |
|-------|--------|-------|
| `nslookup troptions.unykorn.org` | OK | Resolves to Cloudflare |
| `nslookup aurora.unykorn.org` | NXDOMAIN | Use GitHub Pages URL until DNS fixed |
| `nslookup impact.unykorn.org` | NXDOMAIN | Same |
| `nslookup ai.troptions.org` | NXDOMAIN | Future DNS |
| `curl drunks.app` | HTTP 200 | GSP dashboard live |
| `curl gsp-api /api/health` | HTTP 200 | Worker operational |
| `cargo test --workspace` (genesis-world) | PASS | Exit 0 |
| `gh repo view genesis-world` | PUBLIC | No auth required |
| PM2 `list` | 8/8 online | Local operator machine |
| Moltbot `:3402` | Not running | Start per genesis-world README for local x402 demo |
| T-Build `npm test` | BLOCKED | `vitest` missing — run `npm install` in T-Build before re-test |
| TExchange `npm run build` | NOT RUN | Path confirmed; build deferred this run |

---

## PENDING (needs keys or operator action)

| Check | Blocker | Label for investors |
|-------|---------|---------------------|
| PolygonScan contract verify | `POLYGONSCAN_API_KEY` (optional) | KENNY/EVL/GSP contracts — verify on PolygonScan |
| Bithomp / XRPL balances | API 403 / rate limits | Wallet registry listed; third-party proof pending |
| Exchange OS **$175M desk** | XRPL + PDF attestation only | **Operator attestation until PolygonScan + Bithomp proof** |
| GSP on-chain (9 + 15 NFT) | PolygonScan API | Addresses in genesis-world README — verify on PolygonScan |
| impact-site Pages | Deploy branch / 404 | DNS + Pages fix |
| aurora.unykorn.org | DNS not created | Pages URL works |
| T-Build tests | `npm install` + vitest | Re-run after deps |
| TExchange build | `npm install && npm run build` | Scheduled next pass |

---

## For Bryan — Option A vs B

| Option | Action | Unblocks |
|--------|--------|----------|
| **A — Keys** | Provide `POLYGONSCAN_API_KEY` (read-only) + Bithomp/XRPL explorer access if available | On-chain verification → ~85%+ |
| **B — Continue without keys** | DNS fixes (aurora/impact), T-Build `npm install`, TExchange build, start Moltbot locally, standardize Apostle `/health` | Repo + URL bar → ~75% |

**Recommendation:** Option **B** this week (no secrets in repo); Option **A** when ready for investor-grade on-chain proofs.

---

## Related

- [ECOSYSTEM_MAP](ECOSYSTEM_MAP.html)
- [Truth labels](../proof/truth-labels.html)
- Investor site — section **Verification**
