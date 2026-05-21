---
title: x402 integration (Troptions-full-pack ↔ UnyKorn)
layout: default
permalink: /technical/X402_INTEGRATION.html
---

# x402 integration — Troptions-full-pack ↔ UnyKorn

**Last verified:** 2026-05-21

This document explains how the **Troptions-full-pack** monorepo relates to the **production x402 payment mesh** in [UnyKorn-X402-aws](https://github.com/FTHTrading/UnyKorn-X402-aws). They are related products, not the same deployment.

---

## Two stacks (do not conflate)

| Layer | Repository / path | Port | Role |
|-------|-------------------|------|------|
| **Production mesh** | [UnyKorn-X402-aws](https://github.com/FTHTrading/UnyKorn-X402-aws) | 4020 (gateway), 7332 (Apostle), 3100–4400 (mesh services) | Live AWS + Cloudflare: facilitator, treasury, guardian, financial core, Apostle Chain ATP settlement |
| **Monorepo sidecar** | `Troptions-full-pack/backend/x402-gateway/` | **4020** (local PM2) | Lightweight FastAPI gateway: SQLite receipts, optional proxy to UnyKorn upstream |

Public health (`https://x402.unykorn.org/health`) reflects the **UnyKorn** gateway on EC2, not the Python sidecar in this repo unless you point DNS at your own host.

---

## Protocol (Apostle Chain)

- Clients receive **HTTP 402** with payment instructions.
- Settlement uses **ATP** on **Apostle Chain** (`chain_id` **7332**).
- Proofs use **TxEnvelope** and **`X-Payment-Proof`** headers (see UnyKorn `packages/x402-credit-gateway` and `x402-book/`).

**Live surfaces (operator):**

| Surface | URL |
|---------|-----|
| Public health | https://x402.unykorn.org/health |
| Digital twin (agent mesh UI) | https://twin.unykorn.org |
| API docs | https://x402api.unykorn.org |

**Mesh services (UnyKorn repo, typical ports):**

| Service | Port |
|---------|------|
| x402 Facilitator | 3100 |
| x402 Treasury | 3200 |
| x402 Guardian | 3300 |
| x402 Financial Core (Rust) | 4400 |
| Credit gateway (public edge) | 4020 |
| Apostle Chain | 7332 |

---

## Connecting the monorepo sidecar

### Environment

```bash
# Local sidecar (Troptions-full-pack)
PORT=4020
X402_MODE=staged          # or production when Apostle is up
APOSTLE_URL=http://127.0.0.1:7332
X402_UPSTREAM=            # set to UnyKorn gateway when proxying, e.g. http://127.0.0.1:4020 on same host as UnyKorn package
```

When `X402_UPSTREAM` is set, `/v1/verify` forwards to the upstream UnyKorn credit gateway instead of using only the local SQLite ledger.

### PM2 (optional)

From repo root:

```bash
pm2 start ecosystem.config.js
```

The `x402-gateway` app runs `backend/x402-gateway/main.py` on port **4020** with `X402_GATEWAY_URL` consumed by `dao-service` (`http://127.0.0.1:4020`).

To run **UnyKorn** production gateway locally or on EC2, use the operator runbook in UnyKorn-X402-aws (`packages/x402-credit-gateway/docs/X402_OPERATOR_RUNBOOK.md`, `aws/X402_AWS_DEPLOYMENT_RUNBOOK.md`). Do not copy `.env` secrets from that repo into git.

### Staged vs production

| Mode | Sidecar behavior |
|------|------------------|
| `staged` | Local verify may return `staged: true`; Apostle optional |
| `production` | Startup checks `APOSTLE_URL/health`; pay path expects agent balances |

UnyKorn public health (2026-05-21 sample) reported `x402_mode: live`, `chain.operational: true`, `chain_id: 7332`, `real_settlement_active: true`.

---

## What lives on `main` in Troptions-full-pack

| Piece | Path |
|-------|------|
| Sidecar gateway | `backend/x402-gateway/main.py` |
| DAO middleware | `backend/dao-service/x402_middleware.py` |
| L1 registry hooks | `l1/crates/rpc/src/x402.rs` |
| Compose stub | `docker/docker-compose.x402.yml` |

**Not on main:** full facilitator/treasury/guardian/financial-core mesh — that is **UnyKorn-X402-aws** (public repo, AWS deployment in `aws/`).

---

## Investor honesty

- **CONFIRMED:** `https://x402.unykorn.org/health` returns live gateway + Apostle chain status when probed.
- **PENDING / flaky:** `twin.unykorn.org` and `x402api.unykorn.org` may return Cloudflare **522** or timeouts when the EC2 origin for those hostnames is down — re-probe before demos.
- Monorepo **:4020** sidecar is for **integration and staging**, not a substitute for the public mesh unless you operate your own edge.

---

## Related docs

- [ECOSYSTEM_MAP.md](ECOSYSTEM_MAP.html)
- [infrastructure/x402.md](infrastructure/x402.html)
- [UnyKorn-X402-aws](https://github.com/FTHTrading/UnyKorn-X402-aws) — `aws/`, `proofs/`, `packages/x402-credit-gateway/`
