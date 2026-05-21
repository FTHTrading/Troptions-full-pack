---
title: AWS Full Stack Activation
layout: default
permalink: /technical/AWS_ACTIVATION_RUNBOOK.html
---

# AWS Full Stack Activation Runbook

**Status:** PIPELINE — services respond with stubs until MSB + live exchange  
**Date:** 2026-05-21

## Honesty labels (required in all operator comms)

| Claim | Label | Meaning |
|-------|-------|---------|
| 10/10 agent score | **PIPELINE** | Readiness model, not audit score |
| $874K/month | **PROJECTION** | Modeled revenue, not bank deposits |
| Revenue in seconds | **PIPELINE** | API may return JSON fast; dollars are **not** realized |

**Do not** present PROJECTION figures to investors or regulators as realized revenue.

## 17-service port map (canonical)

| Port | Service | Path |
|------|---------|------|
| 4020 | backend x402-gateway (Apostle) | `backend/x402-gateway/` |
| 4021 | popeye-relay | `backend/popeye-relay/` |
| 4022 | payment-orchestrator | `fiat-rails/orchestrator/` |
| 4023 | fedwire-adapter | `fiat-rails/fedwire-adapter/` |
| 4024 | swift-bridge | `fiat-rails/swift-bridge/` |
| 4025 | compliance-engine | `fiat-rails/compliance-engine/` |
| 4026 | neobank-api | `fiat-rails/neobank-api/` |
| 4027 | iou-reserve-monitor | `fiat-rails/iou-reserve-monitor/` |
| 4028 | arbitrage-bot | `fiat-rails/arbitrage-bot/` |
| 4029 | baas-dashboard (UI) | `fiat-rails/baas-dashboard/` |
| 4030 | x402-us | `fiat-rails/x402-gateway/` |
| 4031 | agent-orchestrator (legacy) | `fiat-rails/agent-orchestrator/` |
| 4034 | x402-eu | `fiat-rails/x402-gateway-eu/` |
| 4035 | x402-jp | `fiat-rails/x402-gateway-jp/` |
| 4040 | usdc-base-relay | `services/usdc-base-relay/` |
| 4100 | agent-orchestrator (AWS) | `agents/orchestrator/` |
| 4101 | mcp-server stub | `agents/mcp-server/` |
| 8097 | baas-api | `fiat-rails/baas-api/` |
| 8443 | telegram-bot | `services/telegram-bot/` |

Core backends (optional on same host): 8090 donk, 8091 fth-backend, 8092 ttn, 8093 dao, 9944 L1.

## EC2 setup

1. **Instance:** Ubuntu 22.04+ or Amazon Linux 2023, 4 vCPU / 8 GB RAM minimum for full mesh.
2. **Node:** `curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt install -y nodejs`
3. **PM2:** `sudo npm i -g pm2`
4. **Clone:** `git clone https://github.com/fthtrading/Troptions-full-pack.git && cd Troptions-full-pack`
5. **Deps:**
   ```bash
   cd fiat-rails && npm install
   cd ../agents && npm install
   cd ../services/usdc-base-relay && npm install
   cd ../services/telegram-bot && npm install
   ```
6. **Secrets (never commit):** export on host only:
   - `TELEGRAM_BOT_TOKEN` — from @BotFather
   - `BAAS_API_KEY` — if enforcing BaaS key
   - No wallet seeds in repo

## Security group (inbound)

| Port | Purpose |
|------|---------|
| 22 | SSH (restrict to your IP) |
| 4029 | BaaS dashboard (optional public) |
| 4030 | x402 US health (internal preferred) |
| 8443 | Telegram webhook if used (polling needs outbound only) |

Keep **4022–4035, 4040, 4100–4101, 8097** on private subnet / localhost unless hardened.

## PM2 activation sequence

```bash
cd /opt/Troptions-full-pack
mkdir -p logs
pm2 start ecosystem.config.js
pm2 save
```

**AWS-only subset:**

```bash
pm2 start ecosystem.config.js --only \
  payment-orchestrator,compliance-engine,arbitrage-bot,baas-api,baas-dashboard,\
  x402-us,x402-eu,x402-jp,agent-orchestrator,mcp-server,usdc-base-relay
```

Set `TELEGRAM_BOT_TOKEN` then:

```bash
pm2 start ecosystem.config.js --only telegram-bot
```

## Verification curls

```bash
curl -s http://127.0.0.1:4100/health | jq .
curl -s -X POST http://127.0.0.1:4100/trade/batch \
  -H 'Content-Type: application/json' \
  -d '{"symbols":["USD-IOU/EUR-IOU"],"dry_run":true}'
curl -s http://127.0.0.1:4101/tools | jq .
curl -s http://127.0.0.1:4040/health | jq .
curl -s http://127.0.0.1:8097/api/v1/billing/revenue | jq .
curl -s http://127.0.0.1:4030/x402/stats | jq .
```

## Telegram setup

1. Create bot via @BotFather → copy token.
2. On EC2: `export TELEGRAM_BOT_TOKEN='...'` (or PM2 ecosystem env).
3. `pm2 restart telegram-bot`
4. Commands: `/start`, `/trade`, `/revenue`, `/pools`, `/agent`, `/deposit`, `/withdraw`, `/setprice`
5. All replies include **PROJECTION** disclaimer.

## USDC Base relay

- Health: `GET :4040/health`
- Stub mint: `POST :4040/mint` — **PIPELINE** until Circle/Base treasury
- Telegram `/deposit` and `/withdraw` proxy here

## Windows one-liner

```powershell
.\scripts\activate-full-stack.ps1 -DryRun
```

## AWS one-liner

```bash
./scripts/deploy-aws.sh
```

## Related docs

- [X402_GLOBAL_MESH](X402_GLOBAL_MESH.html)
- [TROPTIONS_REVENUE_ENGINE](TROPTIONS_REVENUE_ENGINE.html)
- [BAAS_BATCH_POOLS](BAAS_BATCH_POOLS.html)
