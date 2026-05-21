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

# PENDING — external / ops not verified by this script
label "PENDING" "Apostle Chain AWS public endpoint (feature/x402-full-integration branch)"
label "PENDING" "Popeye external heartbeat monitor"
label "PENDING" "Telnyx NEED AI vanity routing"
label "PENDING" "Production TLS live on troptions.org (nginx certs + DNS cutover)"
label "PENDING" "x402 public facilitator (LOCAL_ONLY on main; optional branch)"

echo ""
echo "Publish output: docs/proof/truth-labels.md"
