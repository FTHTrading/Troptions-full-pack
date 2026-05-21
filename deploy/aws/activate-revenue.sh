#!/usr/bin/env bash
# Step 5 — revenue activation curls (DRY_RUN defaults, PIPELINE / PROJECTION)
# Run after deploy/aws/setup.sh or scripts/deploy-aws.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

# Load .env without overwriting exported vars
if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

DRY_RUN="${DRY_RUN:-true}"
BAAS_API_URL="${BAAS_API_URL:-${BAAS_URL:-http://127.0.0.1:8097}}"
AGENT_ORCHESTRATOR_URL="${AGENT_ORCHESTRATOR_URL:-http://127.0.0.1:4100}"
ARBITRAGE_URL="${ARBITRAGE_URL:-http://127.0.0.1:4028}"
LEGACY_AGENT_URL="${LEGACY_AGENT_ORCHESTRATOR_URL:-http://127.0.0.1:4031}"
ISSUER_ADDRESS="${ISSUER_ADDRESS:-rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ}"

dry_json() {
  if [[ "$DRY_RUN" == "true" ]]; then echo "true"; else echo "false"; fi
}

echo "========================================"
echo "TROPTIONS AWS — Step 5 activation"
echo "========================================"
echo ""
echo "PIPELINE: crypto-native rails are stubs until MSB + live exchange."
echo "PROJECTION: \$825/hour and \$874K/month are modeled — not realized revenue."
echo "DRY_RUN=$DRY_RUN"
echo ""

echo "--- 1) Batch pools (baas-api :8097) ---"
if [[ -x "${ROOT}/scripts/batch-create-pools.sh" ]]; then
  if [[ "$DRY_RUN" == "true" ]]; then
    bash "${ROOT}/scripts/batch-create-pools.sh" --dry-run
  else
    bash "${ROOT}/scripts/batch-create-pools.sh"
  fi
else
  echo "SKIP: scripts/batch-create-pools.sh missing"
fi
echo ""

echo "--- 2) Start arbitrage bot (:4028) ---"
if [[ "$DRY_RUN" == "true" ]]; then
  echo "[DryRun] curl -s -X POST ${ARBITRAGE_URL}/start"
else
  curl -sf -X POST "${ARBITRAGE_URL}/start" >/dev/null && echo "OK arbitrage /start" || echo "WARN arbitrage /start"
fi
echo ""

echo "--- 3) Register agent (canonical :8097) ---"
reg_body=$(cat <<EOF
{"agent_id":"aws-activate-$(date +%s)","wallet":"${ISSUER_ADDRESS}","capital_troptions":0}
EOF
)
if [[ "$DRY_RUN" == "true" ]]; then
  echo "[DryRun] curl -s -X POST ${BAAS_API_URL}/api/v1/agents -H 'Content-Type: application/json' -d '${reg_body}'"
  echo "[DryRun] Legacy: curl -s -X POST ${LEGACY_AGENT_URL}/agents/register -d '...'"
else
  if curl -sf -X POST "${BAAS_API_URL}/api/v1/agents" \
    -H "Content-Type: application/json" \
    -d "$reg_body" >/dev/null; then
    echo "OK POST ${BAAS_API_URL}/api/v1/agents"
  else
    echo "WARN baas register — trying legacy ${LEGACY_AGENT_URL}/agents/register"
    curl -sf -X POST "${LEGACY_AGENT_URL}/agents/register" \
      -H "Content-Type: application/json" \
      -d "$reg_body" >/dev/null && echo "OK legacy register" || echo "SKIP register"
  fi
fi
echo ""

echo "--- 4) Trade batch (agent-orchestrator :4100) ---"
batch_body=$(printf '{"symbols":["USD-IOU/EUR-IOU","USD-IOU/JPY-IOU"],"dry_run":%s}' "$(dry_json)")
if [[ "$DRY_RUN" == "true" ]]; then
  echo "[DryRun] curl -s -X POST ${AGENT_ORCHESTRATOR_URL}/trade/batch -H 'Content-Type: application/json' -d '${batch_body}'"
  curl -s -X POST "${AGENT_ORCHESTRATOR_URL}/trade/batch" \
    -H "Content-Type: application/json" \
    -d "$batch_body" | head -c 400 || true
  echo ""
else
  curl -s -X POST "${AGENT_ORCHESTRATOR_URL}/trade/batch" \
    -H "Content-Type: application/json" \
    -d "$batch_body" | head -c 500
  echo ""
fi
echo ""

echo "--- 5) Billing revenue (PROJECTION) ---"
curl -s "${BAAS_API_URL}/api/v1/billing/revenue" | head -c 400 || true
echo ""
echo ""
echo "Port map: 8097 baas-api | 4029 dashboard | 4030/4034/4035 x402 | 4040 USDC | 4100 agent | 4101 MCP | 8443 telegram"
echo "Done. Figures are PROJECTION — not realized."
