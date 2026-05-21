---
title: AWS Full Stack Activation
layout: default
permalink: /technical/AWS_ACTIVATION_RUNBOOK.html
---

# AWS Full Stack Activation Runbook

**Status:** PIPELINE — services respond with stubs until MSB + live exchange  
**Date:** 2026-05-21

> **Honesty banner (required in all operator comms)**  
> **Crypto-native** rails (x402, BaaS pools, USDC relay, agent trades) = **PIPELINE** stubs until MSB + bank/exchange partners are live.  
> **$825/hour** first-hour table and **$874K/month** run-rate = **PROJECTION** — modeled API math, **not** realized bank deposits.  
> Do **not** present PROJECTION figures to investors or regulators as realized revenue.

## Honesty labels

| Claim | Label | Meaning |
|-------|-------|---------|
| 10/10 agent score | **PIPELINE** | Readiness model, not audit score |
| $874K/month, $825/hour | **PROJECTION** | Modeled revenue, not bank deposits |
| Revenue in seconds | **PIPELINE** | API may return JSON fast; dollars are **not** realized |

## Canonical port map (AWS)

| Port | Service | Path |
|------|---------|------|
| 4022 | payment-orchestrator | `fiat-rails/orchestrator/` |
| 4025 | compliance-engine | `fiat-rails/compliance-engine/` |
| 4028 | arbitrage-bot | `fiat-rails/arbitrage-bot/` |
| **4029** | **baas-dashboard (UI only)** | `fiat-rails/baas-dashboard/` |
| **4030** | **x402-us** | `fiat-rails/x402-gateway/` |
| 4031 | agent-orchestrator (**legacy**) | `fiat-rails/agent-orchestrator/` |
| **4034** | **x402-eu** | `fiat-rails/x402-gateway-eu/` |
| **4035** | **x402-jp** | `fiat-rails/x402-gateway-jp/` |
| **4040** | **usdc-base-relay** | `services/usdc-base-relay/` |
| **4100** | **agent-orchestrator (AWS)** | `agents/orchestrator/` |
| **4101** | **mcp-server stub** | `agents/mcp-server/` |
| **8097** | **baas-api** (agents, pools, billing) | `fiat-rails/baas-api/` |
| **8443** | **telegram-bot** | `services/telegram-bot/` |

**Common mistakes**

- Pointing BaaS API calls at **:4029** — that is the **dashboard UI**; API is **:8097**.
- Assigning EU/JP x402 to **:4031** / **:4032** — regional gateways are **:4034** and **:4035**.
- Confusing **:4101** (MCP stub) with EU gateway — use **:4034** for EU x402.

### Agent registration (two paths)

| Endpoint | Port | Notes |
|----------|------|-------|
| `POST /api/v1/agents/register` | **8097** | **Canonical** BaaS registration |
| `POST /api/v1/agents` | **8097** | Alias (same handler) |
| `POST /agents/register` | **4031** | Legacy fiat `agent-orchestrator` proxy |

## One-liner (fresh Ubuntu EC2)

**Prerequisites:** Node 20, `pm2` global, `git`, `python3`, `pip`, `jq` — see [deploy/aws/README.md](../../deploy/aws/README.md).

**Pipe install (no clone):**

```bash
curl -fsSL https://raw.githubusercontent.com/FTHTrading/Troptions-full-pack/main/deploy/aws/setup.sh | bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/FTHTrading/Troptions-full-pack/main/scripts/activate-revenue.sh)"
```

**Git clone (exact operator block):**

```bash
git clone https://github.com/FTHTrading/Troptions-full-pack.git &&
cd Troptions-full-pack &&
npm install &&
cp config/multi-gateway.env.template .env &&
pm2 start ecosystem.config.js --only payment-orchestrator,compliance-engine,arbitrage-bot,baas-api,baas-dashboard,x402-us,x402-eu,x402-jp,agent-orchestrator,mcp-server,usdc-base-relay &&
pm2 save &&
./scripts/activate-revenue.sh
```

Edit `.env` on the host (`cp config/multi-gateway.env.template .env` or `setup.sh` creates `.env` only if missing).

## EC2 setup (manual)

1. **Instance:** Ubuntu 22.04+, 4 vCPU / 8 GB RAM minimum.
2. **Deps:** Node 20, `pm2`, `git`, `python3`, `pip`, `jq`.
3. **Clone:** `git clone https://github.com/FTHTrading/Troptions-full-pack.git && cd Troptions-full-pack`
4. **Or run:** `bash deploy/aws/setup.sh` from clone (same as curl pipe).
5. **Secrets (never commit):** `TELEGRAM_BOT_TOKEN`, `BAAS_API_KEY`, issuer seeds — see `deploy/aws/.env.aws.template`.

## Security group (inbound)

| Port | Purpose |
|------|---------|
| 22 | SSH (restrict to your IP) |
| 4029 | BaaS dashboard UI (optional public) |
| 4030 | x402 US health (prefer internal) |
| **4034** | x402 EU (if exposing region) |
| **4035** | x402 JP (if exposing region) |
| **4040** | USDC Base relay health |
| **4100** | AWS agent-orchestrator (harden before public) |
| **4101** | MCP stub tools |
| **8097** | baas-api (harden before public) |
| **8443** | Telegram webhook (polling needs outbound only) |

Keep **4022–4028, 4031** on localhost/private unless hardened.

## PM2 activation

```bash
cd /opt/Troptions-full-pack   # or ~/Troptions-full-pack
mkdir -p logs
bash deploy/aws/setup.sh
# or subset only:
pm2 start ecosystem.config.js --only \
  payment-orchestrator,compliance-engine,arbitrage-bot,baas-api,baas-dashboard,\
  x402-us,x402-eu,x402-jp,agent-orchestrator,mcp-server,usdc-base-relay
pm2 save
```

With `TELEGRAM_BOT_TOKEN` in `.env`:

```bash
pm2 start ecosystem.config.js --only telegram-bot --update-env
```

## Step 5 — activate revenue (DRY_RUN default)

```bash
bash deploy/aws/activate-revenue.sh
# or
bash scripts/activate-revenue.sh
```

Equivalent manual curls:

```bash
# 1) Batch pools (8097)
bash scripts/batch-create-pools.sh --dry-run

# 2) Arbitrage
curl -s -X POST http://127.0.0.1:4028/start

# 3) Register agent — canonical (:8097, NOT :4029 dashboard or :4033)
curl -s -X POST http://127.0.0.1:8097/api/v1/agents/register \
  -H 'Content-Type: application/json' \
  -d '{"agent_id":"ec2-demo","wallet":"rYourIssuer","capital_troptions":0}'

# 3b) Legacy
curl -s -X POST http://127.0.0.1:4031/agents/register \
  -H 'Content-Type: application/json' \
  -d '{"agent_id":"ec2-demo","wallet_address":"rYourIssuer","capital_troptions":0}'

# 4) Trade batch (4100) — dry_run until live
curl -s -X POST http://127.0.0.1:4100/trade/batch \
  -H 'Content-Type: application/json' \
  -d '{"symbols":["USD-IOU/EUR-IOU"],"dry_run":true}'

# 5) Billing (PROJECTION)
curl -s http://127.0.0.1:8097/api/v1/billing/revenue | jq .
```

## Verification curls

```bash
curl -s http://127.0.0.1:8097/health | jq .
curl -s http://127.0.0.1:4100/health | jq .
curl -s http://127.0.0.1:4101/tools | jq .
curl -s http://127.0.0.1:4040/health | jq .
curl -s http://127.0.0.1:4030/x402/stats | jq .
curl -s http://127.0.0.1:4034/health | jq .
curl -s http://127.0.0.1:4035/health | jq .
```

## Telegram

1. @BotFather → `TELEGRAM_BOT_TOKEN` in `.env`
2. `pm2 restart telegram-bot`
3. Commands: `/start`, `/trade`, `/revenue`, `/pools` — replies include **PROJECTION** disclaimer

## Windows

```powershell
.\scripts\activate-full-stack.ps1 -DryRun
```

## npm install

Root `npm install` is sufficient for AWS floor services: `postinstall` installs **fiat-rails**, **agents**, and **usdc-base-relay**. `deploy/aws/setup.sh` also runs those paths explicitly and adds **telegram-bot** when `TELEGRAM_BOT_TOKEN` is set.

## Related docs

- [deploy/aws/README.md](../../deploy/aws/README.md)
- [X402_GLOBAL_MESH](X402_GLOBAL_MESH.html)
- [BAAS_BATCH_POOLS](BAAS_BATCH_POOLS.html)
