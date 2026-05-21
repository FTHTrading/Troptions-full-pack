---
title: Arbitrage and BaaS
layout: default
permalink: /technical/ARBITRAGE_AND_BAAS.html
---

# Arbitrage & BaaS — fiat-rails hub

**Last updated:** 2026-05-21

Cross-links for operators running **arbitrage-bot** (:4028) and **baas-api** (:8097) against the payment orchestrator (:4022) and x402 gateway (:4020).

---

## Services

| Service | Port | Path | Label |
|---------|------|------|-------|
| Payment orchestrator | 4022 | `fiat-rails/orchestrator` | **PIPELINE** |
| x402 gateway (monorepo sidecar) | 4020 | `backend/x402-gateway` | **PIPELINE** / prod on UnyKorn |
| Arbitrage bot | 4028 | `fiat-rails/arbitrage-bot` | **PIPELINE** |
| BaaS dashboard | 4029 | `fiat-rails/baas-dashboard` | **PIPELINE** |
| **BaaS API (pools/tokens)** | **8097** | `fiat-rails/baas-api` | **PIPELINE** |

---

## Arbitrage flow (**PIPELINE**)

1. Bot scans spreads via x402-gated orderbook (`arbitrage-bot/x402-client.js`).
2. Compliance screen on :4025 (when enabled).
3. `POST /api/v1/arbitrage` on orchestrator (route stub in `orchestrator/routes/arbitrage.js`).

Env template: `fiat-rails/arbitrage-bot/.env.arbitrage.template`

---

## BaaS liquidity batch (**PIPELINE**)

**Canonical doc:** [BAAS_BATCH_POOLS](BAAS_BATCH_POOLS.html)

**Quick run:**

```powershell
.\scripts\batch-create-pools.ps1 -DryRun
$env:BAAS_API_KEY = "operator-key"
.\scripts\batch-create-pools.ps1
```

**API:** `POST /api/v1/pools/batch` on :8097 — sums x402 pool setup fees, queues `data/baas-pool-jobs.json`.

---

## Shared prerequisites

- `BAAS_API_KEY` / orchestrator secrets in operator vault (never commit `.env`)
- `X-402-Wallet-Address` for ATP settlement headers
- [X402 integration](X402_INTEGRATION.html) for production vs staged verify
- [XRPL & Stellar verification](XRPL_STELLAR_VERIFICATION.html) for IOU inventory truth table

---

## Document index

| Doc | Topic |
|-----|-------|
| [BAAS_BATCH_POOLS](BAAS_BATCH_POOLS.html) | Exact POST sequence + token table |
| [MSB_FIAT_RAILS](MSB_FIAT_RAILS.html) | Capitalization tree |
| [SYSTEM_MANIFEST](SYSTEM_MANIFEST.html) | Ports & revenue labels |
| [`fiat-rails/baas-api/README`](../../fiat-rails/baas-api/README.md) | API README |
