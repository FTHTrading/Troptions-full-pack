#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "=== TROPTIONS DAO Bootstrap ==="
[ -f .env ] || cp .env.example .env

pip install -q -r backend/fth-academy/requirements.txt
pip install -q -r backend/dao-service/requirements.txt
pip install -q -r ai/donk-tutor/requirements.txt
pip install -q -r backend/ttn-launcher/requirements.txt

PYTHONPATH=backend/shared python -c "from dao_db import init_dao_db; init_dao_db(); print('dao_state.db ready')"

cd l1 && cargo build -p node --release && cd "$ROOT"

pm2 start ecosystem.config.js || true
echo "Dashboard: http://127.0.0.1:8093"
echo "L1 RPC: http://127.0.0.1:9944"
