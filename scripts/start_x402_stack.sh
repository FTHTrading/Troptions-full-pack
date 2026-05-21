#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export X402_MODE="${X402_MODE:-staged}"
export PORT=4020
cd "$ROOT"
docker compose -f docker/docker-compose.x402.yml up -d x402-gateway popeye-relay 2>/dev/null || true
pm2 start ecosystem.config.js --only x402-gateway,popeye-relay 2>/dev/null || true
echo "x402 gateway :4020  popeye :4021  mode=$X402_MODE"
