---
title: Multi-x402 Global Mesh
layout: default
permalink: /technical/MULTI_X402_MESH.html
---

# Multi-x402 Global Mesh

**Status:** PIPELINE (regional stubs respond; revenue is **PROJECTION**)  
**Date:** 2026-05-21

## Regional gateways

| Region | City | Port | PM2 name | Path |
|--------|------|------|----------|------|
| **US** | New York (NY) | **4030** | `x402-gateway-v2` | `fiat-rails/x402-gateway/` |
| **EU** | Frankfurt | **4032** | `x402-eu` | `fiat-rails/x402-gateway-regional/` (`REGION=eu`) |
| **JP** | Tokyo | **4033** | `x402-jp` | `fiat-rails/x402-gateway-regional/` (`REGION=jp`) |

**Apostle mesh (legacy Python):** `backend/x402-gateway` on **:4020** — not the same as fiat-rails v2 unless DNS is repointed.

## Stats endpoints

| Gateway | Stats URL |
|---------|-----------|
| US (canonical) | `GET http://127.0.0.1:4030/x402/stats` or `GET /stats` |
| EU | `GET http://127.0.0.1:4032/x402/stats` |
| JP | `GET http://127.0.0.1:4033/x402/stats` |
| Apostle mesh | `GET http://127.0.0.1:4020/health` (sidecar; separate counters) |

All counters default to **zero** until live ATP settlement — label **PROJECTION**.

## ATP price setting

ATP and x402 fee tiers are an **operator PIPELINE strategy** (not automated in this repo):

1. Configure regional `REGION` + upstream `EXCHANGE_OS_URL`
2. Set PASS tier / OpenMeter pricing in x402 facilitator (external)
3. Agent orchestrator reads stats only — does not set ATP prices live

## Multi-region arbitrage (orchestrator)

```bash
curl -X POST http://127.0.0.1:4031/api/v1/arbitrage/multi \
  -H "Content-Type: application/json" \
  -d '{"buy_location":"us","sell_location":"eu","pair":"USD-IOU/EUR-IOU","amount_usd":5000,"dry_run":true}'
```

Returns **PROJECTION** spread estimate; no live cross-gateway settlement in stub mode.

## Agent revenue (honesty)

| Metric | Label |
|--------|-------|
| Regional x402 fee counters | **PROJECTION** (zero until live) |
| Multi-mesh arbitrage PnL | **PROJECTION** |
| Marketing totals (e.g. $791K) | **NOT FACT** — do not cite as realized |

## Activation

```powershell
.\scripts\setup-second-x402.ps1
.\scripts\deploy-agentic-floor.ps1
```

See [AGENTIC_RAG_AMM.md](AGENTIC_RAG_AMM.md), [TROPTIONS_REVENUE_ENGINE.md](TROPTIONS_REVENUE_ENGINE.md).
