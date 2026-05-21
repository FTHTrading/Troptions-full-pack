# HTTP API Map (live services)

## DONK AI Tutor — `:8090`

| Method | Path | Notes |
|--------|------|-------|
| GET | `/health` | GPU, Qdrant, Ollama status |
| GET | `/courses` | Course catalog |
| POST | `/chat` | RAG + Ollama tutoring |
| WS | `/ws` | Real-time tutor |

## FTH Academy (fth-backend) — `:8091`

| Method | Path | Notes |
|--------|------|-------|
| GET | `/health` | Stripe, Polygon, contracts |
| GET | `/courses` | SQLite-backed catalog |
| POST | `/payments/create-session` | Stripe Checkout |
| POST | `/tutor/chat` | Proxies Ollama + DONK prompt |
| POST | `/pathway/generate` | Career pathways |
| GET | `/labs/v2` | Multi-chain labs |
| POST | `/support/request-human` | Mentor tickets |

**Planned:** `GET /l1/state` using `l1_client.py`.

## TTN Launcher — `:8092`

| Method | Path | Notes |
|--------|------|-------|
| GET | `/health` | Channels, namespaces |
| POST | `/channels/create` | New broadcast channel |
| POST | `/namespaces/claim` | `.sports`, `.tennis`, etc. |
| POST | `/sponsor-drops/create` | QR sponsor drops |
| GET | `/proof/{channel_id}` | Proof registry |

## L1 Node — `:9944`

JSON-RPC only (see `docs/L1_SPEC.md`).
