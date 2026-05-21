#!/usr/bin/env bash
# deploy-aws.sh — EC2 full-stack activation (PIPELINE / PROJECTION labels)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "=== TROPTIONS AWS deploy (PIPELINE) ==="

command -v node >/dev/null || { echo "Node.js required"; exit 1; }
command -v pm2 >/dev/null || { echo "npm i -g pm2 required"; exit 1; }

mkdir -p logs

(cd fiat-rails && npm install --omit=dev 2>/dev/null || npm install)
(cd agents && npm install)
(cd services/usdc-base-relay && npm install)
if [[ -n "${TELEGRAM_BOT_TOKEN:-}" ]]; then
  (cd services/telegram-bot && npm install)
else
  echo "SKIP telegram-bot npm (set TELEGRAM_BOT_TOKEN to enable)"
fi

pm2 start ecosystem.config.js --only \
  payment-orchestrator,compliance-engine,arbitrage-bot,baas-api,baas-dashboard,\
  x402-us,x402-eu,x402-jp,agent-orchestrator,mcp-server,usdc-base-relay \
  --update-env || true

sleep 3

echo "--- health ---"
curl -sf "http://127.0.0.1:8097/health" >/dev/null && echo "OK baas-api :8097" || echo "FAIL baas-api"
curl -sf "http://127.0.0.1:4100/health" >/dev/null && echo "OK agent-orchestrator :4100" || echo "FAIL agent :4100"
curl -sf "http://127.0.0.1:4101/health" >/dev/null && echo "OK mcp-server :4101" || echo "FAIL mcp"
curl -sf "http://127.0.0.1:4040/health" >/dev/null && echo "OK usdc-base-relay :4040" || echo "FAIL relay"

if [[ -n "${TELEGRAM_BOT_TOKEN:-}" ]]; then
  pm2 start ecosystem.config.js --only telegram-bot --update-env || true
fi

echo "--- trade/batch (dry_run) ---"
curl -s -X POST "http://127.0.0.1:4100/trade/batch" \
  -H 'Content-Type: application/json' \
  -d '{"symbols":["USD-IOU/EUR-IOU"],"dry_run":true}' | head -c 500
echo ""

echo "--- billing revenue (PROJECTION) ---"
curl -s "http://127.0.0.1:8097/api/v1/billing/revenue" | head -c 400
echo ""

pm2 save 2>/dev/null || true
echo "Done. Revenue figures are PROJECTION — not realized."
