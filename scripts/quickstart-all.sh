#!/usr/bin/env bash
# Start full TROPTIONS sovereign stack in dependency order (Linux/macOS).
# Usage: ./scripts/quickstart-all.sh [--dry-run]
set -euo pipefail

DRY_RUN=0
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

step() { echo -e "\n==> $*"; }
require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing prerequisite: $1" >&2
    exit 1
  fi
  command -v "$1"
}

wait_l1_health() {
  local timeout="${1:-90}" body='{"jsonrpc":"2.0","method":"state_get","params":{},"id":1}'
  local i=0
  while (( i < timeout )); do
    if curl -sf -m 3 -X POST http://127.0.0.1:9944 \
      -H 'Content-Type: application/json' -d "$body" | grep -q '"result"'; then
      return 0
    fi
    sleep 2
    ((i += 2))
  done
  return 1
}

http_health() {
  curl -sf -m 5 "$1" 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('status','ok'))" 2>/dev/null || echo "down"
}

echo "TROPTIONS Full Stack Quickstart"
[[ "$DRY_RUN" -eq 1 ]] && echo "[DRY RUN] No processes will be started."

step "Checking prerequisites"
PM2=$(require_cmd pm2)
PYTHON=$(require_cmd python3)
CARGO=$(require_cmd cargo)
echo "  pm2:    $PM2"
echo "  python: $PYTHON"
echo "  cargo:  $CARGO"

L1_BIN="${L1_NODE_BIN:-$ROOT/l1/target/release/troptions-node}"
if [[ ! -x "$L1_BIN" && -x "$ROOT/l1/target/release/troptions-node.exe" ]]; then
  L1_BIN="$ROOT/l1/target/release/troptions-node.exe"
fi
echo "  L1 bin: $L1_BIN"

if [[ ! -f .env ]]; then
  if [[ "$DRY_RUN" -eq 1 ]]; then
    echo "  Would copy .env.example -> .env"
  else
    cp .env.example .env
    echo "  Created .env from .env.example — fill secrets locally."
  fi
fi

ECOSYSTEM="$ROOT/ecosystem.config.js"
[[ -f "$ECOSYSTEM" ]] || { echo "Missing ecosystem.config.js" >&2; exit 1; }

if [[ "$DRY_RUN" -eq 1 ]]; then
  step "Would install Python deps"
  step "Would build L1: cargo build -p node --release"
  step "Would pm2 start troptions-l1-node, wait :9944"
  step "Would pm2 start donk-ai-tutor, fth-backend, ttn-launcher, dao-service"
  exit 0
fi

step "Installing Python dependencies"
pip install -q -r backend/fth-academy/requirements.txt
pip install -q -r backend/dao-service/requirements.txt
pip install -q -r ai/donk-tutor/requirements.txt
pip install -q -r backend/ttn-launcher/requirements.txt

step "Initializing DAO SQLite"
PYTHONPATH=backend/shared python3 -c "from dao_db import init_dao_db; init_dao_db(); print('dao_state.db ready')"

if [[ ! -x "$L1_BIN" ]]; then
  step "Building L1 node (release)"
  (cd l1 && cargo build -p node --release)
  export L1_NODE_BIN="$ROOT/l1/target/release/troptions-node"
fi

mkdir -p logs

step "Starting L1 node (port 9944)"
pm2 delete troptions-l1-node 2>/dev/null || true
export L1_NODE_BIN="${L1_NODE_BIN:-$ROOT/l1/target/release/troptions-node}"
pm2 start "$ECOSYSTEM" --only troptions-l1-node

step "Waiting for L1 health on :9944"
if ! wait_l1_health 90; then
  echo "L1 did not become healthy. Check: pm2 logs troptions-l1-node" >&2
  exit 1
fi
echo "  L1 is healthy."

step "Starting backends and DAO (8090-8093)"
for app in donk-ai-tutor fth-backend ttn-launcher dao-service; do
  pm2 delete "$app" 2>/dev/null || true
  pm2 start "$ECOSYSTEM" --only "$app"
  sleep 1
done
pm2 save >/dev/null || true

step "Service status"
printf "\n%-14s %-36s %s\n" "SERVICE" "URL" "STATUS"
printf "%-14s %-36s %s\n" "L1" "http://127.0.0.1:9944" "$(wait_l1_health 5 && echo ok || echo down)"
printf "%-14s %-36s %s\n" "DONK" "http://127.0.0.1:8090/health" "$(http_health http://127.0.0.1:8090/health)"
printf "%-14s %-36s %s\n" "FTH" "http://127.0.0.1:8091/health" "$(http_health http://127.0.0.1:8091/health)"
printf "%-14s %-36s %s\n" "TTN" "http://127.0.0.1:8092/health" "$(http_health http://127.0.0.1:8092/health)"
printf "%-14s %-36s %s\n" "DAO" "http://127.0.0.1:8093/health" "$(http_health http://127.0.0.1:8093/health)"

echo ""
echo "--- URLs ---"
echo "  L1 RPC:     http://127.0.0.1:9944"
echo "  DONK:       http://127.0.0.1:8090/health"
echo "  FTH:        http://127.0.0.1:8091/health"
echo "  TTN:        http://127.0.0.1:8092/health"
echo "  DAO:        http://127.0.0.1:8093"
echo "PM2: pm2 status | pm2 logs"
