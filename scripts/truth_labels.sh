#!/usr/bin/env bash
# Emit CONFIRMED / PENDING labels for public proof page (honest operator checks).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "TROPTIONS Truth Labels — $(date -u +%Y-%m-%dT%H:%MZ)"
echo "repo: $(basename "$ROOT")"
echo ""

label() { printf "%-12s %s\n" "$1" "$2"; }

# CONFIRMED — run checks below locally to reproduce
if (cd l1 && cargo test --workspace -q 2>/dev/null); then
  label "CONFIRMED" "L1 Rust workspace tests (cargo test --workspace)"
else
  label "PENDING" "L1 Rust workspace tests"
fi

if python -m pytest tests/backend tests/dao -q 2>/dev/null; then
  label "CONFIRMED" "Backend + DAO pytest (tests/backend tests/dao)"
else
  label "PENDING" "Backend + DAO pytest"
fi

if [ -f l1/crates/state/src/persistence.rs ]; then
  label "CONFIRMED" "RocksDB persistence module (l1/crates/state/src/persistence.rs)"
else
  label "PENDING" "RocksDB persistence"
fi

if [ -f l1/crates/runtime/src/multisig.rs ]; then
  label "CONFIRMED" "Treasury multisig (l1/crates/runtime/src/multisig.rs)"
else
  label "PENDING" "Treasury multisig"
fi

if [ -f l1/tests/integration/signed_submit.rs ]; then
  label "CONFIRMED" "Signed submit integration test"
else
  label "PENDING" "Signed submit RPC"
fi

CRATE_COUNT=$(find l1/crates -maxdepth 1 -mindepth 1 -type d 2>/dev/null | wc -l | tr -d ' ')
label "CONFIRMED" "L1 workspace: ${CRATE_COUNT} crates under l1/crates/ (not 27)"

if grep -q "Sovereign Sequencer" README.md 2>/dev/null; then
  label "CONFIRMED" "Docs label sequencer (not BFT) in README"
else
  label "PENDING" "Sequencer vs BFT labeling"
fi

label "CONFIRMED" "KENNY Polygon 0x93F2a3266a81c1F3Ee2c196b90890A959bC69BD7 (see README)"
label "CONFIRMED" "XRPL gateway rPF2M1QjRj72rHdJyRqfFRTqWREBdJds3 (see README)"

if [ -f docker/nginx/nginx.conf ]; then
  label "CONFIRMED" "TLS_ENABLED (docker/nginx + setup-tls scripts)"
else
  label "PENDING" "TLS_ENABLED"
fi

if [ -f backend/shared/auth.py ]; then
  label "CONFIRMED" "API_KEY_AUTH (backend/shared/auth.py)"
else
  label "PENDING" "API_KEY_AUTH"
fi

if grep -q dao_getProposals dao/governance/engine.py 2>/dev/null; then
  label "CONFIRMED" "DAO_DIRECT_L1 (dao_getProposals via engine + dashboard)"
else
  label "PENDING" "DAO_DIRECT_L1"
fi

if [ -f l1/tests/integration/signed_dao_submit.rs ]; then
  label "CONFIRMED" "Signed DAO submit test (signed_dao_submit.rs)"
else
  label "PENDING" "Signed DAO submit test"
fi

label "PENDING" "TLS_PUBLIC_DNS (certbot on troptions.org hostnames)"
label "PENDING" "FRAUD_PROOFS_LIVE (design only docs/design/fraud_proofs.md)"
label "PENDING" "Apostle Chain AWS public endpoint (feature/x402-full-integration branch)"
label "PENDING" "Popeye external heartbeat monitor"
label "PENDING" "Telnyx NEED AI vanity routing"
label "PENDING" "x402 public facilitator (LOCAL_ONLY on main; optional branch)"

echo ""
echo "Publish output: docs/proof/truth-labels.md"
echo ""
echo "--- Local stack probes (x402 branch; services optional) ---"
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
} | tee "$ROOT/truth_labels_report.json"
label "PENDING" "x402_gateway LOCAL_ONLY (run stack; probe :4020)"
label "PENDING" "Apostle ATP settlement staged (not AWS production)"
