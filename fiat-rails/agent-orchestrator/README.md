# Agent Orchestrator (`:4031`)

Agent Orchestration Layer for the TROPTIONS revenue stack. **All exchange-side revenue is PROJECTION** until live pools and bank rails are wired.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Service + downstream URLs |
| POST | `/agents/start` | Mark agent running (in-memory) |
| POST | `/agents/stop` | Stop agent |
| GET | `/agents/status` | One agent or all |
| POST | `/run-cycle` | Research → Risk → Execution |
| POST | `/agents/register` | Proxy to BaaS `POST /api/v1/agents` |
| POST | `/api/v1/arbitrage/multi` | Multi-x402 mesh stub (`buy_location`, `sell_location`) |

## Clients

| Module | Target |
|--------|--------|
| `mcp-client.js` | MCP at `:4731` (mock if down) |
| `x402-client.js` | `:4030` stats; regional `:4032` EU, `:4033` JP |
| `compliance-client.js` | `:4025` |
| `baas-client.js` | `:4029` |
| `arbitrage-client.js` | `:4028` |
| `orchestrator-client.js` | payment-orchestrator `:4022` |

## x402 stats

- **Canonical:** `GET http://127.0.0.1:4030/x402/stats` (alias `GET /stats`)
- **Apostle mesh (Python):** `GET http://127.0.0.1:4020/health` — separate deployment

## Run

```powershell
cd fiat-rails\agent-orchestrator
copy .env.template .env
node server.js
```

```powershell
pm2 start ../ecosystem.config.js --only agent-orchestrator
```

## Default

`DRY_RUN=true` — no live settlement without explicit `dry_run: false` and approved compliance.
