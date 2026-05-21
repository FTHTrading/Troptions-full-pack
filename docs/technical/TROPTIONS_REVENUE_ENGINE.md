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
| Agent AMM / RAG yield | **PROJECTION** | Until XRPL AMM pools + MCP :4731 live |
| BaaS pool / agent fees | **PROJECTION** | `baas-api` :4029 registration only |

**Do not cite** marketing agent totals (e.g. **$791K**) as realized revenue.

## One-click activation

```powershell
cd C:\Users\Kevan\Troptions-full-pack
.\scripts\activate-troptions-revenue.ps1 -DryRun
.\scripts\deploy-agentic-floor.ps1
```

## PM2 services (revenue stack)

```powershell
pm2 start fiat-rails/ecosystem.config.js --only arbitrage-bot,baas-api,x402-gateway-v2,x402-eu,x402-jp,agent-orchestrator
pm2 start ecosystem.config.js --only x402-gateway,baas-api,agent-orchestrator,x402-eu,x402-jp
```

## Verification curls

```powershell
curl http://127.0.0.1:4031/health
curl -X POST http://127.0.0.1:4031/run-cycle -H "Content-Type: application/json" -d '{\"dry_run\":true,\"agent_id\":\"agent-demo\"}'
curl http://127.0.0.1:4030/x402/stats
curl http://127.0.0.1:4029/health
curl -X POST http://127.0.0.1:4028/execute -H "Content-Type: application/json" -d '{\"dry_run\":true}'
curl -X POST http://127.0.0.1:4031/api/v1/arbitrage/multi -H "Content-Type: application/json" -d '{\"buy_location\":\"us\",\"sell_location\":\"eu\",\"dry_run\":true}'
```

## Port reference

| Port | Service |
|------|---------|
| 4020 | backend x402-gateway (Apostle) |
| 4022 | payment-orchestrator |
| 4025 | compliance-engine |
| 4028 | arbitrage-bot |
| 4029 | baas-api |
| 4030 | x402-gateway-v2 (US) + `/x402/stats` |
| 4031 | agent-orchestrator |
| 4032 | x402-eu |
| 4033 | x402-jp |
| 4040 | baas-dashboard UI |
| 4731 | MCP server |

## PROJECTION disclaimer

All agent capital, arbitrage profit, and x402 revenue totals in dashboards are **PROJECTION** until MSB omnibus, live pools, and MCP :4731 are wired.

See [AGENTIC_RAG_AMM.md](AGENTIC_RAG_AMM.md), [MULTI_X402_MESH.md](MULTI_X402_MESH.md).
