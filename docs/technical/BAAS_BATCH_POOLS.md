---
title: BaaS batch liquidity pools
layout: default
permalink: /technical/BAAS_BATCH_POOLS.html
---

# BaaS batch liquidity pools — API call sequence

**Audience:** Operators wiring Exchange OS / fiat-rails liquidity.  
**Last updated:** 2026-05-21  
**Service:** `fiat-rails/baas-api` on **:8097** (**PIPELINE**)

**Truth labels:** **PROVEN** = ledger issuance exists · **PIPELINE** = BaaS API + job queue (no live AMM until worker runs) · **PROJECTION** = Alexandrite collateral economics

See also: [Arbitrage & BaaS hub](ARBITRAGE_AND_BAAS.html) · [System manifest](SYSTEM_MANIFEST.html) · [XRPL verification](XRPL_STELLAR_VERIFICATION.html)

---

## Prerequisites

| Requirement | Purpose |
|-------------|---------|
| `BAAS_API_KEY` | `X-API-Key` on all mutating routes (optional in dev if unset) |
| `X-402-Wallet-Address` | Payer XRPL/ATP wallet for x402 settlement |
| Payment orchestrator **:4022** | Wire → IOU rail (health check before batch) |
| x402 gateway **:4020** | `GET /health` — baas-api `/health` reports reachability |
| `node fiat-rails/baas-api/index.js` | BaaS API listening on **8097** |

```powershell
cd fiat-rails
$env:PORT = "8097"
$env:BAAS_API_KEY = "operator-key"
$env:X402_GATEWAY_URL = "http://127.0.0.1:4020"
node baas-api/index.js
```

---

## Token inventory (repo truth)

| Symbol | XRPL issuer | Label | Notes |
|--------|-------------|-------|-------|
| TROPTIONS | `rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ` | **PROVEN** IOU | ~100M XRPL leg |
| USDC | same | **PROVEN** IOU | TROPTIONS-issued, **not** Circle native |
| USDT | same | **PROVEN** IOU | |
| DAI | same | **PROVEN** IOU | |
| EURC | same | **PROVEN** IOU | |
| TROPTIONS-USD | same | **PIPELINE** rail | Fiat-backed label when MSB live |
| Alexandrite / AXLUSD | same (placeholder) | **PROJECTION** | Gem collateral playbook — not ledger-minted at scale |
| KENNY / EVL | Polygon mainnet | **PROVEN** (separate chain) | Use `docs/technical/GENESIS_POLYGON_CONTRACTS.html` — **not** this XRPL batch |

Distribution treasury: `rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt` · AMM ops wallet: `rBU6exSQHkrTog6n1F5RX8gzcUrXoniGcp`

---

## Exact call sequence (one-shot batch)

### 0. Health

```http
GET http://127.0.0.1:8097/health
GET http://127.0.0.1:4022/health
GET http://127.0.0.1:4020/health
```

### 1. Register token (per new asset) — **402 then pay**

Only needed for assets **not** pre-seeded in baas-api (`token_usdc`, `token_eurc`, etc. are seeded).

```http
POST http://127.0.0.1:8097/api/v1/tokens
X-API-Key: {BAAS_API_KEY}
X-402-Wallet-Address: {wallet}
Content-Type: application/json

{
  "symbol": "Alexandrite",
  "name": "Alexandrite collateral IOU",
  "issuer": "rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ",
  "chain": "xrpl"
}
```

**Response (no payment):** `402` + `x402-invoice` (~$10,000 default setup fee).

**Retry with:**

```http
X-402-Payment: {receipt_or_tx_envelope_id}
```

**Response (paid):** `201` + `token_id`.

### 2. Create pool (single) — **402 then pay**

```http
POST http://127.0.0.1:8097/api/v1/pools
X-API-Key: {BAAS_API_KEY}
X-402-Wallet-Address: {wallet}
Content-Type: application/json

{
  "token_id": "token_usdc",
  "base": "USDC",
  "counter": "TROPTIONS-USD",
  "initial_liquidity": 2500000,
  "fee_percent": 0.25
}
```

Fee: **0.25%** of `initial_liquidity` (minimum **$250**). Job appended to `fiat-rails/baas-api/data/baas-pool-jobs.json`.

### 3. Batch all pools — **recommended one-shot**

```http
POST http://127.0.0.1:8097/api/v1/pools/batch
X-API-Key: {BAAS_API_KEY}
X-402-Wallet-Address: {wallet}
Content-Type: application/json

{
  "pools": [
    { "token_id": "token_troptions_usd", "base": "TROPTIONS-USD", "counter": "EUR-IOU", "initial_liquidity": 1000000 },
    { "token_id": "token_alexandrite", "base": "Alexandrite", "counter": "TROPTIONS-USD", "initial_liquidity": 500000 },
    { "token_id": "token_usdc", "base": "USDC", "counter": "TROPTIONS-USD", "initial_liquidity": 2500000 },
    { "token_id": "token_eurc", "base": "EURC", "counter": "TROPTIONS-USD", "initial_liquidity": 1000000 }
  ]
}
```

| Step | Payment header | Response |
|------|----------------|----------|
| First POST | omitted | `402` — `amount_usd` = **sum** of per-pool fees |
| Second POST | `X-402-Payment: …` | `202` — `batch_id`, `jobs[]`, writes `baas-pool-jobs.json` |

### 4. Poll jobs

```http
GET http://127.0.0.1:8097/api/v1/pools/jobs?batch_id={batch_id}
X-API-Key: {BAAS_API_KEY}
```

---

## Operator script

```powershell
# Quote fees (DryRun prints curl)
.\scripts\batch-create-pools.ps1 -DryRun

# Live: 402 invoice then auto-retry with staged payment header
$env:BAAS_API_KEY = "operator-key"
.\scripts\batch-create-pools.ps1
```

Config template: `config/pool-batch.example.json` → copy to `config/pool-batch.json`.

---

## Honest pipeline labels

| Step | Label |
|------|-------|
| IOUs exist on XRPL/Stellar | **PROVEN** |
| BaaS token/pool HTTP API | **PIPELINE** |
| x402 fee collection | **PIPELINE** (staged verify) |
| Job queue file | **PIPELINE** |
| XRPL AMM / Exchange OS pool creation | **PIPELINE** (async worker TBD) |
| Alexandrite collateral redemption | **PROJECTION** |

Do **not** describe batch `202` as live tradable liquidity until AMM accounts show pool state on explorer.

---

## Fee defaults

| Action | Default |
|--------|---------|
| Token setup | $10,000 (`BAAS_TOKEN_SETUP_FEE_USD`) |
| Pool setup | 0.25% of `initial_liquidity`, min $250 |
| Batch | Sum of pool lines |

---

## curl one-liner (batch, staged payment)

```bash
curl -s -X POST http://127.0.0.1:8097/api/v1/pools/batch \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $BAAS_API_KEY" \
  -H "X-402-Wallet-Address: rfbZzM6SGZHbfxrg85vyeKSEMMQCfNXTNw" \
  -H "X-402-Payment: baas_batch_$(date +%s)" \
  -d '{"pools":[{"token_id":"token_usdc","base":"USDC","counter":"TROPTIONS-USD","initial_liquidity":2500000}]}'
```
