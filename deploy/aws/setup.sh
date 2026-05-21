#!/usr/bin/env bash
# TROPTIONS AWS live activation — run on Ubuntu EC2 from repo root or via curl pipe.
# PIPELINE / PROJECTION: stubs until MSB + live exchange; revenue figures are modeled.
set -euo pipefail

echo "========================================"
echo "TROPTIONS AWS SETUP (PIPELINE)"
echo "========================================"
echo ""
echo "Before this script: install apt deps (Node 20, git, python3, pip, jq, build-essential):"
echo "  sudo apt update && sudo apt install -y curl git python3 python3-pip python3-venv jq build-essential"
echo "  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"
echo "  sudo apt install -y nodejs && sudo npm install -g pm2"
echo ""

# Resolve repo root (pipe install vs existing clone)
if [[ -f "$(dirname "$0")/../../ecosystem.config.js" ]]; then
  ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
elif [[ -f "./ecosystem.config.js" ]]; then
  ROOT="$(pwd)"
else
  REPO_URL="${TROPTIONS_REPO_URL:-https://github.com/FTHTrading/Troptions-full-pack.git}"
  INSTALL_DIR="${TROPTIONS_INSTALL_DIR:-$HOME/Troptions-full-pack}"
  if [[ -d "$INSTALL_DIR/.git" ]]; then
    echo "Pulling existing clone: $INSTALL_DIR"
    git -C "$INSTALL_DIR" pull --ff-only
    ROOT="$INSTALL_DIR"
  else
    echo "Cloning $REPO_URL -> $INSTALL_DIR"
    git clone "$REPO_URL" "$INSTALL_DIR"
    ROOT="$INSTALL_DIR"
  fi
fi

cd "$ROOT"
echo "Repo root: $ROOT"
mkdir -p logs

# .env from template (never overwrite)
ENV_TEMPLATE="${ROOT}/deploy/aws/.env.aws.template"
if [[ ! -f .env ]]; then
  if [[ -f "$ENV_TEMPLATE" ]]; then
    cp "$ENV_TEMPLATE" .env
    echo "Created .env from deploy/aws/.env.aws.template — edit secrets on host."
  elif [[ -f config/multi-gateway.env.template ]]; then
    cp config/multi-gateway.env.template .env
    echo "Created .env from config/multi-gateway.env.template"
  else
    echo "WARN: no .env template found — create .env manually."
  fi
else
  echo "Keeping existing .env (not overwritten)."
fi

echo ""
echo "--- npm install ---"
if [[ -f package.json ]]; then
  npm install --omit=dev 2>/dev/null || npm install || true
fi

(cd fiat-rails && npm install --omit=dev 2>/dev/null || npm install)
(cd agents && npm install)
(cd services/usdc-base-relay && npm install)

if [[ -n "${TELEGRAM_BOT_TOKEN:-}" ]] || grep -q '^TELEGRAM_BOT_TOKEN=.\+' .env 2>/dev/null; then
  (cd services/telegram-bot && npm install)
else
  echo "SKIP telegram-bot npm until TELEGRAM_BOT_TOKEN is set in .env"
fi

if [[ -f fiat-rails/compliance-engine/requirements.txt ]]; then
  echo ""
  echo "--- compliance-engine pip (optional venv) ---"
  if [[ ! -d fiat-rails/compliance-engine/.venv ]]; then
    python3 -m venv fiat-rails/compliance-engine/.venv
  fi
  # shellcheck disable=SC1091
  source fiat-rails/compliance-engine/.venv/bin/activate
  pip install -q -r fiat-rails/compliance-engine/requirements.txt
  deactivate
fi

command -v pm2 >/dev/null || { echo "pm2 required: sudo npm install -g pm2"; exit 1; }

PM2_ONLY="payment-orchestrator,compliance-engine,arbitrage-bot,baas-api,baas-dashboard,x402-us,x402-eu,x402-jp,agent-orchestrator,mcp-server,usdc-base-relay"

echo ""
echo "--- pm2 start (AWS revenue mesh) ---"
pm2 start ecosystem.config.js --only "$PM2_ONLY" --update-env || true

if [[ -n "${TELEGRAM_BOT_TOKEN:-}" ]] || grep -q '^TELEGRAM_BOT_TOKEN=.\+' .env 2>/dev/null; then
  pm2 start ecosystem.config.js --only telegram-bot --update-env || true
fi

sleep 3
pm2 save 2>/dev/null || true

PUBLIC_IP="${PUBLIC_IP:-$(curl -sf http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo 'YOUR_EC2_PUBLIC_IP')}"

echo ""
echo "========================================"
echo "SETUP COMPLETE — verification (localhost)"
echo "========================================"
curl -sf "http://127.0.0.1:8097/health" >/dev/null && echo "OK  baas-api              :8097" || echo "FAIL baas-api :8097"
curl -sf "http://127.0.0.1:4029/health" >/dev/null 2>&1 && echo "OK  baas-dashboard (UI)  :4029" || echo "SKIP baas-dashboard :4029"
curl -sf "http://127.0.0.1:4030/health" >/dev/null && echo "OK  x402-us              :4030" || echo "FAIL x402-us :4030"
curl -sf "http://127.0.0.1:4034/health" >/dev/null && echo "OK  x402-eu              :4034" || echo "FAIL x402-eu :4034"
curl -sf "http://127.0.0.1:4035/health" >/dev/null && echo "OK  x402-jp              :4035" || echo "FAIL x402-jp :4035"
curl -sf "http://127.0.0.1:4100/health" >/dev/null && echo "OK  agent-orchestrator   :4100" || echo "FAIL agent :4100"
curl -sf "http://127.0.0.1:4101/health" >/dev/null && echo "OK  mcp-server stub      :4101" || echo "FAIL mcp :4101"
curl -sf "http://127.0.0.1:4040/health" >/dev/null && echo "OK  usdc-base-relay      :4040" || echo "FAIL usdc :4040"
curl -sf "http://127.0.0.1:8443/health" >/dev/null 2>&1 && echo "OK  telegram-bot         :8443" || echo "SKIP telegram :8443 (token?)"

echo ""
echo "========================================"
echo "Step 5 — activation (DRY_RUN safe)"
echo "========================================"
echo "  bash deploy/aws/activate-revenue.sh"
echo ""
echo "Manual curls (replace host; PROJECTION labels apply):"
echo ""
echo "# Batch pools → baas-api :8097 (NOT :4029)"
echo "  bash scripts/batch-create-pools.sh --dry-run"
echo ""
echo "# Arbitrage"
echo "  curl -s -X POST http://127.0.0.1:4028/start"
echo ""
echo "# Register agent — canonical"
echo "  curl -s -X POST http://127.0.0.1:8097/api/v1/agents \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"agent_id\":\"ec2-demo\",\"wallet\":\"rDemo\",\"capital_troptions\":0}'"
echo ""
echo "# Register agent — legacy fiat orchestrator"
echo "  curl -s -X POST http://127.0.0.1:4031/agents/register \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"agent_id\":\"ec2-demo\",\"wallet_address\":\"rDemo\",\"capital_troptions\":0}'"
echo ""
echo "# Trade batch — AWS orchestrator :4100"
echo "  curl -s -X POST http://127.0.0.1:4100/trade/batch \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"symbols\":[\"USD-IOU/EUR-IOU\"],\"dry_run\":true}'"
echo ""
echo "# Billing revenue (PROJECTION)"
echo "  curl -s http://127.0.0.1:8097/api/v1/billing/revenue | head -c 400"
echo ""
echo "# x402 stats"
echo "  curl -s http://127.0.0.1:4030/x402/stats | head -c 400"
echo ""
echo "Public smoke (after security group opens ports):"
echo "  curl -s http://${PUBLIC_IP}:8097/health"
echo "  curl -s http://${PUBLIC_IP}:4030/x402/stats"
echo ""
echo "PIPELINE: crypto-native = stubs. PROJECTION: \$825/hr ≠ realized revenue."
echo "Docs: docs/technical/AWS_ACTIVATION_RUNBOOK.md"
echo "pm2 status"
