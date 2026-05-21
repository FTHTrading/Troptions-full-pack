#!/usr/bin/env bash
# Production deploy — Docker Compose (sovereign stack + nginx)
# Usage:
#   ./scripts/deploy-production.sh
#   ./scripts/deploy-production.sh --ssl   # prints certbot steps
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

COMPOSE_FILE="$ROOT/docker/docker-compose.prod.yml"
SSL=0
DRY_RUN=0

for arg in "$@"; do
  case "$arg" in
    --ssl) SSL=1 ;;
    --dry-run) DRY_RUN=1 ;;
  esac
done

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || { echo "Missing: $1" >&2; exit 1; }
}

http_health() {
  curl -sf --max-time 8 "$1" 2>/dev/null | grep -o '"status"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 || echo "down"
}

wait_l1() {
  local body='{"jsonrpc":"2.0","method":"state_get","params":{},"id":1}'
  for _ in $(seq 1 40); do
    if curl -sf -X POST -H "Content-Type: application/json" -d "$body" http://127.0.0.1:9944 | grep -q '"result"'; then
      return 0
    fi
    sleep 3
  done
  return 1
}

echo "TROPTIONS Production Deploy (Docker)"
echo "==> Checking Docker"
require_cmd docker
docker compose version >/dev/null

[[ -f "$COMPOSE_FILE" ]] || { echo "Missing $COMPOSE_FILE" >&2; exit 1; }

if [[ ! -f .env ]]; then
  if [[ -f .env.example ]]; then
    cp .env.example .env
    echo "  Created .env from .env.example — fill secrets before public exposure."
  else
    echo "  Warning: no .env or .env.example"
  fi
else
  echo "  Using existing .env (not overwritten)."
fi

if [[ "$SSL" -eq 1 ]]; then
  cat <<'EOF'

==> SSL / Let's Encrypt (manual)
  1. Point DNS for fthedu.unykorn.org, ai.troptions.org, ttn.troptions.org, dao.troptions.org to this host.
  2. Open ports 80/443; nginx: infrastructure/nginx/sites/troptions.conf
  3. certbot certonly --webroot -w /var/www/certbot -d dao.troptions.org ...
  4. Mount certs into nginx (see docs/DEPLOY_PRODUCTION.md).

EOF
fi

if [[ "$DRY_RUN" -eq 1 ]]; then
  echo "[DRY RUN] docker compose -f docker/docker-compose.prod.yml up -d --build"
  exit 0
fi

echo "==> Building and starting stack"
docker compose -f "$COMPOSE_FILE" up -d --build

echo "==> Waiting for L1 (:9944)"
if wait_l1; then echo "  L1 healthy."; else echo "  L1 not ready — check compose logs l1"; fi

echo "==> Post-deploy health checks"
for pair in "DONK:http://127.0.0.1:8090/health" "FTH:http://127.0.0.1:8091/health" "TTN:http://127.0.0.1:8092/health" "DAO:http://127.0.0.1:8093/health"; do
  name="${pair%%:*}"
  url="${pair#*:}"
  printf "  %-6s %s -> %s\n" "$name" "$url" "$(http_health "$url")"
done

echo ""
echo "--- Next ---"
echo "  Logs: docker compose -f docker/docker-compose.prod.yml logs -f"
echo "  Stop: docker compose -f docker/docker-compose.prod.yml down"
echo "  Docs: docs/DEPLOY_PRODUCTION.md"
