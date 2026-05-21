---
title: Multi-x402 Global Mesh
layout: default
permalink: /technical/MULTI_X402_MESH.html
---

# Multi-x402 Global Mesh

**Status:** PIPELINE · Revenue labels: **PROJECTION** (not realized; do not cite $791K-style totals as fact)  
**Date:** 2026-05-21

## Regional gateways (NY / Frankfurt / Tokyo)

| Region | City | Port | PM2 name | Path |
|--------|------|------|----------|------|
| **US** | New York (NY) | **4030** | `x402-gateway-v2` | `fiat-rails/x402-gateway/` |
| **EU** | Frankfurt | **4032** | `x402-gateway-eu` | `fiat-rails/x402-gateway-eu/` |
| **JP** | Tokyo | **4033** | `x402-gateway-jp` | `fiat-rails/x402-gateway-jp/` |
| Orchestrator | — | **4031** | `agent-orchestrator` | not a gateway |
| MCP | — | **4731** | external | ledger tools (mock when down) |
| Apostle mesh | — | **4020** | `x402-gateway` (Python) | separate from fiat-rails v2 |

## Stats

| Gateway | URL |
|---------|-----|
| US | `GET http://127.0.0.1:4030/x402/stats` (alias `/stats`) |
| EU | `GET http://127.0.0.1:4032/x402/stats` |
| JP | `GET http://127.0.0.1:4033/x402/stats` |

## ATP price setting

ATP and metered fees are an **operator PIPELINE strategy** — configure PASS tiers / OpenMeter externally. Regional gateways proxy to Exchange OS; they do not auto-set live ATP prices in this repo.

## Multi-region arbitrage

```bash
curl -X POST http://127.0.0.1:4031/api/v1/arbitrage/multi \
  -H "Content-Type: application/json" \
  -d '{"buy_location":"us","sell_location":"eu","pair":"USD-IOU/EUR-IOU","amount_usd":5000,"dry_run":true}'
```

Response is **PROJECTION** until cross-gateway settlement is live.

## PROJECTION revenue

| Metric | Label |
|--------|-------|
| Regional x402 counters | **PROJECTION** (default zero) |
| Multi-mesh arb PnL | **PROJECTION** |
| Agent dashboards | **PROJECTION** |

## Setup

```powershell
.\scripts\setup-second-x402.ps1
.\scripts\deploy-agentic-floor.ps1
.\scripts\activate-troptions-revenue.ps1 -DryRun
```

See [AGENTIC_RAG_AMM.md](AGENTIC_RAG_AMM.md), [TROPTIONS_REVENUE_ENGINE.md](TROPTIONS_REVENUE_ENGINE.md).
