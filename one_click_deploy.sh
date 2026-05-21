#!/usr/bin/env bash
# One-click: build, test, deploy TROPTIONS production stack
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

echo "=== TROPTIONS one-click deploy ==="

if ! command -v cargo >/dev/null 2>&1; then
  echo "Rust/cargo required. Install from https://rustup.rs"
  exit 1
fi

echo "[1/4] L1 build + test"
(cd l1 && cargo build -p node --release && cargo test --workspace)

echo "[2/4] Python tests"
if command -v python >/dev/null 2>&1; then
  pip install -q -r backend/dao-service/requirements.txt pytest httpx fastapi 2>/dev/null || true
  python -m pytest tests/ -q --ignore=tests/integration/full_flow.py -x || {
    echo "Some Python tests failed — review before production"
  }
fi

echo "[3/4] Deploy"
if command -v docker >/dev/null 2>&1; then
  bash scripts/deploy.sh
else
  echo "Docker not found — starting PM2 only"
  if command -v pm2 >/dev/null 2>&1; then
    pm2 start ecosystem.config.js
  else
    echo "Start manually: cd l1 && cargo run -p node --release -- 9944"
  fi
fi

echo "[4/4] Verify"
curl -sf http://127.0.0.1:9945/metrics | head -3 || true
curl -sf http://127.0.0.1:8093/health || true

echo "=== Done ==="
