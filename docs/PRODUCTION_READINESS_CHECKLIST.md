# Production readiness checklist (7.5 → 10)

**Purpose:** One-page internal tracker to close the gap between `upgrade/10-production` (~7.5/10) and counterparty-ready production (~10/10).  
**Owners:** Engineering · Ops · Bryan

---

## Merge and branch hygiene

| Done | Item | Owner |
|:----:|------|-------|
| [x] | Merge `upgrade/10-production` → `main` (persistence, signed RPC, L1 treasury/DAO, prod compose, tests) | Engineering |
| [ ] | Tag release + update `UPGRADE_REPORT.md` on `main` after merge | Engineering |
| [ ] | Keep `feature/x402-full-integration` **separate** until a client explicitly contracts x402/Apostle | Bryan |

---

## Docs and honest labeling

| Done | Item | Owner |
|:----:|------|-------|
| [ ] | No false BFT claims — README/architecture say **Sovereign Sequencer (single-node)**; BFT = Q4 2026 roadmap | Engineering |
| [ ] | Sequencer labeled consistently in `docs/ROADMAP.md`, `docs/L1_SPEC.md`, `l1/` crate comments | Engineering |
| [ ] | Counterparty pack uses `docs/counterparty/BUILD_AVID_ON_TROPTIONS.md` (no “15 min live Avid” language) | Bryan |
| [ ] | `docs/BRYAN_STATUS.md` path table current | Bryan |

---

## Runtime and dashboard

| Done | Item | Owner |
|:----:|------|-------|
| [ ] | DAO dashboard reads proposals/votes/treasury **from L1 RPC** (`dao_getProposals`, `dao_getVotes`, `treasury_getBalance`) — not SQLite-only mock | Engineering |
| [ ] | `frontends/dao-dashboard/app.js` verified against L1 on :9944 after merge | Engineering |
| [ ] | RocksDB persistence enabled (`L1_DATA_DIR`) in prod | Ops |

---

## Production deploy

| Done | Item | Owner |
|:----:|------|-------|
| [ ] | `docker/docker-compose.prod.yml` deployed via `scripts/deploy-production.ps1` / `.sh` | Ops |
| [ ] | TLS termination on nginx (`infrastructure/nginx/sites/troptions.conf`) — certs obtained (certbot flow in `docs/DEPLOY_PRODUCTION.md`) | Ops |
| [ ] | DNS A/AAAA for `dao.troptions.org`, `fthedu.unykorn.org`, etc. | Ops |
| [ ] | Prometheus :9945 scraped; Grafana dashboard `ops/grafana/dashboard.json` | Ops |

---

## Secrets and API hardening

| Done | Item | Owner |
|:----:|------|-------|
| [ ] | `SETTLEMENT_API_KEYS` set in prod (comma-separated `key_id:secret`) | Engineering |
| [ ] | `L1_PUBLIC_KEY` / signing keys in prod — dev-open settlement disabled | Engineering |
| [ ] | Signed DAO client paths tested (`submit_transaction` Ed25519) | Engineering |
| [ ] | `.env` never committed; rotate any keys used in demos | Ops |

---

## Optional integrations

| Done | Item | Owner |
|:----:|------|-------|
| [ ] | Popeye / external heartbeat monitor wired to `/health` endpoints (optional) | Ops |
| [ ] | x402/Apostle: scope doc only until client sign-off | Bryan |

---

## Pre-counterparty gate

Run before sending Bijan/Avid a production URL:

| Done | Item | Owner |
|:----:|------|-------|
| [ ] | `.\scripts\health-check-all.ps1` — all services green | Ops |
| [ ] | `cd l1 && cargo test --workspace` | Engineering |
| [ ] | `pytest tests/backend/test_settlement_api.py tests/dao/ -q` | Engineering |
| [ ] | `bash scripts/truth_labels.sh` (ships on `upgrade/10-production`; add to `main` with merge) | Engineering |
| [ ] | Bryan reviews `docs/counterparty/BIJAN_EMAIL.md` + `BUILD_AVID_ON_TROPTIONS.md` | Bryan |

---

## Maturity reference

| Branch | Score | Blocker to 10 |
|--------|-------|----------------|
| `main` (post-merge) | ~8.2 | Ops TLS, API keys, public x402 |
| `upgrade/10-production` | merged | — |
| `feature/x402-full-integration` | ~6.5 | Out of scope unless requested |

*Last updated: 2026-05-21*
