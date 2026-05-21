# AWS EC2 activation (Ubuntu)

**Labels:** PIPELINE (stubs) · PROJECTION ($825/hr modeled, not bank deposits)

## Prerequisites (once per instance)

```bash
sudo apt update && sudo apt install -y curl git python3 python3-pip python3-venv jq build-essential
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

Open security group inbound (minimum): **22**, **4029**, **4030**, **4034**, **4035**, **4040**, **4100**, **4101**, **8097**, **8443** (harden before public).

## Option A — curl pipe (no clone)

```bash
curl -fsSL https://raw.githubusercontent.com/FTHTrading/Troptions-full-pack/main/deploy/aws/setup.sh | bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/FTHTrading/Troptions-full-pack/main/deploy/aws/activate-revenue.sh)"
```

## Option B — git clone one-liner (matches operator docs)

```bash
git clone https://github.com/FTHTrading/Troptions-full-pack.git &&
cd Troptions-full-pack &&
npm install &&
cp config/multi-gateway.env.template .env &&
pm2 start ecosystem.config.js --only payment-orchestrator,compliance-engine,arbitrage-bot,baas-api,baas-dashboard,x402-us,x402-eu,x402-jp,agent-orchestrator,mcp-server,usdc-base-relay &&
pm2 save &&
./scripts/activate-revenue.sh
```

Edit `.env` on the host for `TELEGRAM_BOT_TOKEN`, `ISSUER_SEED`, `BAAS_API_KEY` (never commit).

## npm install scope

Root `npm install` runs `postinstall` and installs **fiat-rails**, **agents** (orchestrator + MCP), and **services/usdc-base-relay**. `deploy/aws/setup.sh` also installs **telegram-bot** when `TELEGRAM_BOT_TOKEN` is set.

## Live vs dry-run

| Variable | Effect |
|----------|--------|
| default | `DRY_RUN=true` — safe pool quotes, dry trade batch |
| `LIVE=1` | Live pool POSTs, `dry_run: false` on trade batch |

```bash
LIVE=1 ./scripts/activate-revenue.sh
```

## Raw script URLs (GitHub)

- Setup: `https://raw.githubusercontent.com/FTHTrading/Troptions-full-pack/main/deploy/aws/setup.sh`
- Activation: `https://raw.githubusercontent.com/FTHTrading/Troptions-full-pack/main/scripts/activate-revenue.sh`

Full runbook: [docs/technical/AWS_ACTIVATION_RUNBOOK.md](../../docs/technical/AWS_ACTIVATION_RUNBOOK.md)
