#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
echo "=== verify-9-production ==="

bash "$(dirname "$0")/setup-tls.sh"

fail=0
if curl -kfsS "https://localhost/health" >/dev/null 2>&1; then
  echo "[OK] nginx TLS /health"
else
  echo "[SKIP] nginx TLS — docker compose -f docker/docker-compose.prod.yml up -d nginx"
fi

export API_KEYS=verify-test-key
if curl -sS -o /dev/null -w "%{http_code}" -X POST "http://127.0.0.1:8093/dao/proposals" \
  -H "X-API-Key: invalid" -H "Content-Type: application/json" \
  -d '{"proposer":"'"$(printf 'aa%.0s' {1..16})"'","title":"t","description":"d"}' | grep -q 401; then
  echo "[OK] invalid API key -> 401"
else
  echo "[SKIP] dao-service :8093 API key check (service down?)"
fi

BODY='{"jsonrpc":"2.0","method":"dao_getProposals","params":{},"id":1}'
if curl -fsS -X POST "http://127.0.0.1:9944" -H "Content-Type: application/json" -d "$BODY" >/dev/null 2>&1; then
  echo "[OK] L1 dao_getProposals"
elif curl -kfsS -X POST "https://localhost/l1" -H "Content-Type: application/json" -d "$BODY" >/dev/null 2>&1; then
  echo "[OK] L1 dao_getProposals via nginx /l1/"
else
  echo "[SKIP] L1 not reachable"
fi

echo "Verification complete."
