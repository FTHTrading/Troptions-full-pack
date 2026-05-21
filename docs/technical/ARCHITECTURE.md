---
title: Architecture
layout: default
permalink: /technical/ARCHITECTURE.html
---

# TROPTIONS Sovereign Stack Architecture

Published on GitHub Pages: `https://fthtrading.github.io/Troptions-full-pack/technical/ARCHITECTURE.html`

## Layer diagram

```
┌─────────────────────────────────────────────────────────────────┐
│  GENESIS DOMAINS (8) — TROPTIONSXCHANGE.IO, TTN.Tv, etc.        │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│  FRONTENDS                                                       │
│  exchange-os · fth-edu · ttn-tv · unified-dashboard · landing   │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS / WS
┌────────────────────────────▼────────────────────────────────────┐
│  BACKENDS + AI (PM2 — ecosystem.config.js)                       │
│  donk-ai-tutor :8090 · fth-backend :8091 · ttn-launcher :8092   │
│  dao-service :8093 · x402-gateway :4020 · popeye-relay :4021    │
│  Ollama :11434 · Qdrant :6333                                    │
└────────────────────────────┬────────────────────────────────────┘
                             │ JSON-RPC
┌────────────────────────────▼────────────────────────────────────┐
│  L1 NODE :9944 (Rust) · Prometheus metrics :9945                 │
│  Sovereign Sequencer (single-node; multi-node + fraud proofs planned) │
│  RocksDB · signed submit · on-chain DAO + treasury · multisig    │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│  EXTERNAL CHAINS                                                 │
│  Polygon (KENNY/EVL) · XRPL gateway · Solana ($PICK)             │
└─────────────────────────────────────────────────────────────────┘
```

## PM2 service map

| PM2 name | Port | Monorepo path |
|----------|------|---------------|
| `troptions-l1-node` | **9944** (RPC), **9945** (`/metrics`) | `l1/` |
| `donk-ai-tutor` | **8090** | `ai/donk-tutor/` |
| `fth-backend` | **8091** | `backend/fth-academy/` |
| `ttn-launcher` | **8092** | `backend/ttn-launcher/` |
| `dao-service` | **8093** | `backend/dao-service/` + `frontends/dao-dashboard/` |
| `x402-gateway` | **4020** | `backend/x402-gateway/` |
| `popeye-relay` | **4021** | `backend/popeye-relay/` |

Start all apps: `pm2 start ecosystem.config.js` from repo root. The [quickstart](QUICKSTART.html) script starts L1 plus core backends (8090–8093); add x402 and popeye with `pm2 start ecosystem.config.js --only x402-gateway,popeye-relay` when needed.

## Clawd / OpenClaw integration

Operational context lives under `C:\Users\Kevan\.openclaw\workspace` (clawd). PM2 processes run from the monorepo root via `ecosystem.config.js`. Knowledge artifacts from clawd are mirrored to `ai/knowledge-base/openclaw-content`; architecture notes live under `docs/` and `docs/technical/`.

## Data flows

1. **Education:** User → fth-edu / exchange-os → **fth-backend** (`:8091`) → Stripe + Ollama; certificates → IPFS (planned) + KENNY burn proof.
2. **Tutoring:** User → **donk-ai-tutor** (`:8090`) → Qdrant RAG → Ollama; optional voice via ElevenLabs.
3. **Broadcast:** Creator → ttn-launcher → namespace registry (SQLite) → L1 soulbound migration (script).
4. **Sovereign state:** Backends → `l1_client` → `state_get` / `soulbound_*` / `settlement_*` on port **9944**.
5. **DAO + payments:** **dao-service** (`:8093`) → L1 governance RPC; optional **x402-gateway** (`:4020`) for metered ATP settlement; **popeye-relay** (`:4021`) for L1-adjacent relay hooks.

## DAO layer (implemented)

See [`dao/ARCHITECTURE.md`](https://github.com/FTHTrading/Troptions-full-pack/blob/main/dao/ARCHITECTURE.md) in the repo. Runtime: **dao-service** on **8093**, FTH **fth-backend** routes under `/dao/*`, L1 `governance` crate + signed submit RPC.

## Production readiness (current)

1. **L1 bridge (fth-backend)** — `/health/l1`, `/dao/state` wired to JSON-RPC on **9944**.
2. **Persistence** — RocksDB on L1 (`L1_DATA_DIR`); SQLite audit/allocations cache only in dao-service.
3. **WebSockets** — `backend/shared/ws_hub.py` on dao-service `/ws`.
4. **x402 + popeye** — Present in `ecosystem.config.js`; enable per environment when Apostle / payment rails are up.
