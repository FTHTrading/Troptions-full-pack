#!/usr/bin/env bash
# Step 5 — revenue activation (health wait → pools → arbitrage → register → trade batch)
# DRY_RUN=true by default; set LIVE=1 for non-dry trade batch and live pool POSTs.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

if [[ "${LIVE:-0}" == "1" ]]; then
  export DRY_RUN=false
fi
DRY_RUN="${DRY_RUN:-true}"

BAAS_API_URL="${BAAS_API_URL:-${BAAS_URL:-http://127.0.0.1:8097}}"
AGENT_ORCHESTRATOR_URL="${AGENT_ORCHESTRATOR_URL:-http://127.0.0.1:4100}"
ARBITRAGE_URL="${ARBITRAGE_URL:-http://127.0.0.1:4028}"
ISSUER_ADDRESS="${ISSUER_ADDRESS:-rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ}"

dry_json() {
  if [[ "$DRY_RUN" == "true" ]]; then echo "true"; else echo "false"; fi
}

wait_health() {
  local url="$1"
  local label="$2"
  local max="${3:-90}"
  local waited=0
  echo "Waiting for ${label} (${url})..."
  while (( waited < max )); do
    if curl -sf "$url" >/dev/null 2>&1; then
      echo "  OK ${label}"
      return 0
    fi
    sleep 2
    waited=$((waited + 2))
  done
  echo "  WARN ${label} not healthy after ${max}s"
  return 1
}

echo "========================================"
echo "TROPTIONS — activate revenue (Step 5)"
echo "========================================"
echo ""
echo "PIPELINE: crypto-native rails are stubs until MSB + live exchange."
echo "PROJECTION: \$825/hour and \$874K/month are modeled — NOT realized revenue."
echo "Do NOT tell users \"\$825 in wallet\" — API returns PROJECTION JSON only."
echo "DRY_RUN=$DRY_RUN (set LIVE=1 to attempt live POSTs)"
echo ""

echo "--- Health wait (key ports) ---"
wait_health "${BAAS_API_URL%/}/health" "baas-api :8097" 90 || true
wait_health "${ARBITRAGE_URL%/}/health" "arbitrage :4028" 60 || true
wait_health "${AGENT_ORCHESTRATOR_URL%/}/health" "agent-orchestrator :4100" 90 || true
wait_health "http://127.0.0.1:4030/health" "x402-us :4030" 60 || true
echo ""

echo "--- 1) Batch pools (baas-api :8097) ---"
if [[ -x "${ROOT}/scripts/batch-create-pools.sh" ]]; then
  if [[ "$DRY_RUN" == "true" ]]; then
    bash "${ROOT}/scripts/batch-create-pools.sh" --dry-run
  else
    bash "${ROOT}/scripts/batch-create-pools.sh"
  fi
else
  echo "SKIP: scripts/batch-create-pools.sh missing — manual:"
  echo "  curl -s -X POST ${BAAS_API_URL}/api/v1/pools/batch -H 'Content-Type: application/json' -d '{\"pools\":[]}'"
fi
echo ""

echo "--- 2) Start arbitrage bot (:4028) ---"
if [[ "$DRY_RUN" == "true" ]]; then
  echo "[DryRun] curl -s -X POST ${ARBITRAGE_URL}/start"
else
  curl -sf -X POST "${ARBITRAGE_URL}/start" >/dev/null && echo "OK arbitrage /start" || echo "WARN arbitrage /start"
fi
echo ""

echo "--- 3) Register agent (canonical :8097/api/v1/agents/register) ---"
reg_body=$(cat <<EOF
{"agent_id":"aws-activate-$(date +%s)","wallet":"${ISSUER_ADDRESS}","capital_troptions":0}
EOF
)
register_url="${BAAS_API_URL%/}/api/v1/agents/register"
if [[ "$DRY_RUN" == "true" ]]; then
  echo "[DryRun] curl -s -X POST ${register_url} -H 'Content-Type: application/json' -d '${reg_body}'"
else
  if curl -sf -X POST "${register_url}" \
    -H "Content-Type: application/json" \
    -d "$reg_body" >/dev/null; then
    echo "OK POST ${register_url}"
  else
    echo "WARN ${register_url} — trying POST ${BAAS_API_URL%/}/api/v1/agents"
    curl -sf -X POST "${BAAS_API_URL%/}/api/v1/agents" \
      -H "Content-Type: application/json" \
      -d "$reg_body" >/dev/null && echo "OK fallback /api/v1/agents" || echo "SKIP register"
  fi
fi
echo ""

echo "--- 4) Trade batch (agent-orchestrator :4100) ---"
batch_body=$(printf '{"symbols":["USD-IOU/EUR-IOU","USD-IOU/JPY-IOU"],"dry_run":%s}' "$(dry_json)")
echo "POST ${AGENT_ORCHESTRATOR_URL}/trade/batch dry_run=$(dry_json)"
curl -s -X POST "${AGENT_ORCHESTRATOR_URL}/trade/batch" \
  -H "Content-Type: application/json" \
  -d "$batch_body" | head -c 500 || true
echo ""
echo ""

echo "--- 5) Billing revenue (PROJECTION) ---"
curl -s "${BAAS_API_URL%/}/api/v1/billing/revenue" | head -c 400 || true
echo ""
echo ""

echo "--- Telegram ---"
if [[ -n "${TELEGRAM_BOT_TOKEN:-}" ]]; then
  echo "TELEGRAM_BOT_TOKEN is set — ensure pm2 telegram-bot is running (:8443)."
  echo "Commands: /start /trade /revenue /pools (replies include PROJECTION disclaimer)."
else
  echo "Set TELEGRAM_BOT_TOKEN in .env, then: pm2 start ecosystem.config.js --only telegram-bot --update-env"
fi
echo ""
echo "Port map: 8097 baas-api | 4029 dashboard | 4030/4034/4035 x402 | 4040 USDC | 4100 agent | 4101 MCP | 8443 telegram"
echo "Done. All dollar figures are PROJECTION — not guaranteed wallet balance."
