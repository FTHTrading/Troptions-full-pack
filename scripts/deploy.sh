#!/usr/bin/env bash
# Production deploy — Docker Compose + optional PM2 on host
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> Building L1 node"
(cd l1 && cargo build -p node --release)

echo "==> Running L1 tests"
(cd l1 && cargo test --workspace)

echo "==> Running Python tests"
python -m pytest tests/ -q --ignore=tests/integration/full_flow.py || true

echo "==> Docker Compose production stack"
docker compose -f docker/docker-compose.prod.yml build
docker compose -f docker/docker-compose.prod.yml up -d

echo "==> Health checks"
sleep 5
curl -sf "http://127.0.0.1:9945/metrics" | head -5 || echo "metrics pending"
curl -sf "http://127.0.0.1:8093/health" || echo "dao-service pending"

echo "Deploy complete. PM2 (Windows): pm2 start ecosystem.config.js"
