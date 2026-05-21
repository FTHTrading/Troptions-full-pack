#!/usr/bin/env bash
# TROPTIONS full deploy — L1, Apostle, x402, PM2, truth labels
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "== Build L1 =="
cd l1 && cargo build --release -p node && cd ..

echo "== Apostle (optional) =="
if [ -x scripts/deploy_apostle.sh ]; then bash scripts/deploy_apostle.sh || true; fi

echo "== x402 stack =="
export X402_MODE="${X402_MODE:-production}"
bash scripts/start_x402_stack.sh || true

echo "== PM2 ecosystem =="
command -v pm2 >/dev/null && pm2 start ecosystem.config.js || echo "pm2 not installed — start services manually"

echo "== Docker prod (optional) =="
command -v docker >/dev/null && docker compose -f docker/docker-compose.prod.yml up -d --build || true

echo "== Truth labels =="
bash scripts/truth_labels.sh || true

echo "Done. See X402_INTEGRATION_REPORT.md"
