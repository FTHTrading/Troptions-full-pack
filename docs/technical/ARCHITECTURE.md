# TROPTIONS Sovereign Stack Architecture

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
│  BACKENDS + AI                                                   │
│  fth-academy :8091 · ttn-launcher :8092 · donk-tutor :8090      │
│  Ollama :11434 · Qdrant :6333                                    │
└────────────────────────────┬────────────────────────────────────┘
                             │ JSON-RPC
┌────────────────────────────▼────────────────────────────────────┐
│  L1 NODE :9944 (Rust) · metrics :9945                            │
│  Sovereign Sequencer (single-node; multi-node + fraud proofs planned) │
│  RocksDB · signed submit · on-chain DAO + treasury · multisig    │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│  EXTERNAL CHAINS                                                 │
│  Polygon (KENNY/EVL) · XRPL gateway · Solana ($PICK)             │
└─────────────────────────────────────────────────────────────────┘
```

## Clawd / OpenClaw integration

Operational services run with `exec_cwd` under `C:\Users\Kevan\.openclaw\workspace` (PM2). Knowledge artifacts from clawd are copied to `ai/knowledge-base/openclaw-content` and architecture notes in `docs/`.

## Data flows

1. **Education:** User → fth-edu / exchange-os → fth-academy → Stripe + Ollama; certificates → IPFS (planned) + KENNY burn proof.
2. **Tutoring:** User → donk-tutor → Qdrant RAG → Ollama; optional voice via ElevenLabs.
3. **Broadcast:** Creator → ttn-launcher → namespace registry (SQLite) → L1 soulbound migration (script).
4. **Sovereign state:** Backends → `l1_client` → `state_get` / `soulbound_*` / `settlement_*` on port 9944.

## DAO layer (implemented)

See `dao/ARCHITECTURE.md`. Services: `dao-service:8093`, FTH `/dao/*`, L1 `governance` crate + submit RPC.

## Recommended build order

1. ~~L1 bridge in fth-backend~~ — `/health/l1`, `/dao/state` wired.
2. **Persistence** — RocksDB on L1 (`L1_DATA_DIR`); SQLite audit/allocations cache only in dao-service.
3. ~~WebSockets~~ — `backend/shared/ws_hub.py` on DAO service `/ws`.
