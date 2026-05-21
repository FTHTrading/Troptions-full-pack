# BaaS API (`:8097`)

**Label:** **PIPELINE** — registers tokens and queues liquidity pool jobs; does not create live XRPL AMM pools until Exchange OS worker is wired.

## Run

```powershell
cd fiat-rails
$env:PORT = "8097"
$env:BAAS_API_KEY = "your-key"
$env:X402_GATEWAY_URL = "http://127.0.0.1:4020"
node baas-api/index.js
```

## Endpoints

| Method | Path | x402 |
|--------|------|------|
| GET | `/health` | — |
| POST | `/api/v1/tokens` | $10k setup (default) |
| POST | `/api/v1/pools` | 0.25% of `initial_liquidity` (min $250) |
| POST | `/api/v1/pools/batch` | Sum of per-pool fees |
| GET | `/api/v1/pools/jobs` | — |

Headers: `X-API-Key`, `X-402-Wallet-Address`, `X-402-Payment` (on paid calls).

Batch script: `scripts/batch-create-pools.ps1`  
Docs: `docs/technical/BAAS_BATCH_POOLS.md`
