---
title: TROPTIONS Revenue Engine
layout: default
permalink: /technical/TROPTIONS_REVENUE_ENGINE.html
---

# TROPTIONS Revenue Engine

**Truth labels:** PROVEN = responds today · PIPELINE = wired stub · PROJECTION = modeled dollars

## Earning today

| Stream | Label | Notes |
|--------|-------|-------|
| FTH Academy / Stripe | **PROVEN** | Separate `backend/fth-academy` product |
| Fiat rails health + agent cycle | **PROVEN** | Stubs return JSON |
| Arbitrage bot profit | **PIPELINE** | `DRY_RUN=true` default on :4028 |
| x402 gateway fees | **PIPELINE** | 402 invoices; counters at zero |
| Agent AMM / RAG yield | **PROJECTION** | Until XRPL AMM pools + MCP :4032 live |
| BaaS pool fees | **PROJECTION** | `baas-api` registration only |

**“Earning today”** in investor materials must say **PIPELINE** for exchange-side revenue until pools are live. Academy Stripe remains the only **PROVEN** recurring software revenue in this monorepo.

## One-click activation

```powershell
cd C:\Users\Kevan\Troptions-full-pack
.\scripts\activate-troptions-revenue.ps1 -DryRun
```

## PM2 services (revenue stack)

```powershell
pm2 start fiat-rails/ecosystem.config.js --only arbitrage-bot,baas-api,x402-gateway-v2,baas-dashboard,agent-orchestrator
pm2 start ecosystem.config.js --only x402-gateway,baas-api,agent-orchestrator
```

## Verification curls

```powershell
curl http://127.0.0.1:4031/health
curl -X POST http://127.0.0.1:4031/run-cycle -H "Content-Type: application/json" -d '{\"dry_run\":true}'
curl http://127.0.0.1:4030/x402/stats
curl http://127.0.0.1:8097/health
curl -X POST http://127.0.0.1:4028/execute -H "Content-Type: application/json" -d '{\"dry_run\":true}'
```

## Port reference

| Port | Service |
|------|---------|
| 4020 | backend x402-gateway (Apostle) |
| 4022 | payment-orchestrator |
| 4025 | compliance-engine |
| 4028 | arbitrage-bot |
| 4029 | baas-dashboard |
| 4030 | x402-gateway-v2 + `/x402/stats` |
| 4031 | agent-orchestrator |
| 4032 | MCP XRPL (external) |
| 8097 | baas-api |

## PROJECTION disclaimer

All agent capital, arbitrage profit, and x402 revenue totals in dashboards are **PROJECTION** until:

1. MSB omnibus and bank credentials are wired (fiat rails)
2. Exchange OS liquidity pools are live
3. MCP XRPL server is installed and reachable on :4032

Do not commit wallet seeds or issuer secrets. See `.gitignore` patterns.
