#!/usr/bin/env bash
# Batch-create BaaS liquidity pools from config/pool-batch.json
# Usage: ./scripts/batch-create-pools.sh [--dry-run] [--config path]
set -euo pipefail

DRY_RUN=false
CONFIG=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run|-n) DRY_RUN=true; shift ;;
    --config) CONFIG="${2:?}"; shift 2 ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -z "$CONFIG" ]]; then
  CONFIG="${ROOT}/config/pool-batch.json"
  if [[ ! -f "$CONFIG" ]]; then
    CONFIG="${ROOT}/config/pool-batch.example.json"
    echo "Using example config: $CONFIG"
    echo "Copy to config/pool-batch.json to customize."
  fi
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required (sudo apt install -y jq)"
  exit 1
fi

base_url="$(jq -r '.baas_url // "http://127.0.0.1:8097"' "$CONFIG")"
wallet="$(jq -r '.x402_wallet // empty' "$CONFIG")"
if [[ -z "$wallet" && -n "${X402_WALLET_ADDRESS:-}" ]]; then
  wallet="$X402_WALLET_ADDRESS"
fi

api_key="${BAAS_API_KEY:-}"

echo ""
echo "=== BaaS batch pool setup ==="
echo "Config: $CONFIG"
echo "Target: $base_url"
echo "DryRun: $DRY_RUN"
echo ""

if [[ -z "$api_key" ]]; then
  echo "WARN: BAAS_API_KEY not set — API may reject if server enforces key."
fi
if [[ -z "$wallet" ]]; then
  echo "WARN: Set x402_wallet in config or X402_WALLET_ADDRESS env."
fi

health_url="${base_url%/}/health"
echo "GET $health_url"

if [[ "$DRY_RUN" == true ]]; then
  echo "  [DryRun] curl -sf \"$health_url\""
else
  if ! curl -sf "$health_url" >/dev/null; then
    echo "  health failed"
    echo "Start baas-api: cd fiat-rails; PORT=8097 node baas-api/index.js"
    exit 1
  fi
  echo "  health OK"
fi

skip_tokens="$(jq -r '.skip_token_registration // true' "$CONFIG")"
if [[ "$skip_tokens" != "true" ]]; then
  echo ""
  echo "POST ${base_url%/}/api/v1/tokens"
  echo "  Step: 402 invoice, then retry with X-402-Payment"
  if [[ "$DRY_RUN" == true ]]; then
    jq -c '.tokens[]?' "$CONFIG" | while read -r t; do
      echo "  [DryRun] curl -X POST ${base_url%/}/api/v1/tokens -H 'X-API-Key: ...' -d '$t'"
    done
  else
    echo "  Skipping live token POST — pay x402 to register when ready."
  fi
fi

batch_url="${base_url%/}/api/v1/pools/batch"
body_file="$(mktemp)"
jq '{ pools: [.pools[] | {
  token_id: .token_id,
  base: .base,
  counter: .counter,
  initial_liquidity: .initial_liquidity,
  fee_percent: .fee_percent
}] }' "$CONFIG" >"$body_file"

pool_count="$(jq '.pools | length' "$CONFIG")"
echo ""
echo "POST $batch_url"
echo "Pools: $pool_count"

hdr=(-H "Content-Type: application/json")
[[ -n "$api_key" ]] && hdr+=(-H "X-API-Key: $api_key")
[[ -n "$wallet" ]] && hdr+=(-H "X-402-Wallet-Address: $wallet")

if [[ "$DRY_RUN" == true ]]; then
  echo ""
  echo "[DryRun] Step 1: quote fees (expect HTTP 402)"
  echo "curl -s -X POST \"$batch_url\" \\"
  echo "  -H \"Content-Type: application/json\" \\"
  echo "  -H \"X-API-Key: \$BAAS_API_KEY\" \\"
  echo "  -H \"X-402-Wallet-Address: $wallet\" \\"
  echo "  -d @\"$body_file\""
  echo ""
  echo "[DryRun] Step 2: submit with payment"
  echo "curl -s -X POST \"$batch_url\" \\"
  echo "  ... -H \"X-402-Payment: baas_batch_\$(date +%Y%m%d%H%M%S)\" \\"
  echo "  -d @\"$body_file\""
  echo ""
  echo "[DryRun] Check jobs:"
  echo "curl -s \"${base_url%/}/api/v1/pools/jobs\" -H \"X-API-Key: \$BAAS_API_KEY\""
  rm -f "$body_file"
  exit 0
fi

http_code="$(curl -s -o /tmp/baas-batch-resp.json -w "%{http_code}" -X POST "$batch_url" "${hdr[@]}" -d @"$body_file" || true)"

if [[ "$http_code" == "201" || "$http_code" == "202" ]]; then
  echo "Batch accepted:"
  head -c 500 /tmp/baas-batch-resp.json
  echo ""
  rm -f "$body_file" /tmp/baas-batch-resp.json
  exit 0
fi

if [[ "$http_code" == "402" ]]; then
  echo "402 invoice — pay via x402 then re-run with X-402-Payment"
  head -c 500 /tmp/baas-batch-resp.json
  echo ""
  pay_hdr=("${hdr[@]}" -H "X-402-Payment: baas_batch_$(date +%Y%m%d%H%M%S)")
  curl -s -X POST "$batch_url" "${pay_hdr[@]}" -d @"$body_file" | head -c 500
  echo ""
  rm -f "$body_file" /tmp/baas-batch-resp.json
  exit 0
fi

echo "Unexpected HTTP $http_code"
cat /tmp/baas-batch-resp.json 2>/dev/null || true
rm -f "$body_file" /tmp/baas-batch-resp.json
exit 1
