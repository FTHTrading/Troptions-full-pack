#!/usr/bin/env bash
# TROPTIONS truth labels — probe local proof stack
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REPORT="$ROOT/truth_labels_report.json"

probe() {
  local name="$1" url="$2" method="${3:-GET}" body="${4:-}"
  local label="UNREACHABLE" code="-"
  if [ "$method" = "GET" ]; then
    if resp=$(curl -sf -m 5 "$url" 2>/dev/null); then
      code=200
      echo "$resp" | grep -q '"status"\|"ok"\|block_height' && label=CONFIRMED || label=DEGRADED
    fi
  else
    if resp=$(curl -sf -m 5 -X POST -H "Content-Type: application/json" -d "$body" "$url" 2>/dev/null); then
      code=200
      echo "$resp" | grep -q 'block_height' && label=CONFIRMED || label=DEGRADED
    fi
  fi
  printf '{"service":"%s","url":"%s","label":"%s","code":"%s"}\n' "$name" "$url" "$label" "$code"
}

{
  probe "Apostle" "http://127.0.0.1:7332/health"
  probe "x402 Gateway" "http://127.0.0.1:4020/health"
  probe "Popeye" "http://127.0.0.1:4021/health"
  probe "L1 RPC" "http://127.0.0.1:9944" POST '{"jsonrpc":"2.0","method":"state_get","params":{},"id":1}'
  probe "Donk" "http://127.0.0.1:8090/health"
  probe "FTH" "http://127.0.0.1:8091/health"
  probe "TTN" "http://127.0.0.1:8092/health"
  probe "DAO" "http://127.0.0.1:8093/health"
} | tee "$REPORT"
echo "Wrote $REPORT"
