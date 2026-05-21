#!/usr/bin/env bash
set -euo pipefail
APOSTLE="${APOSTLE_CHAIN_PATH:-$HOME/apostle-chain}"
if [ ! -d "$APOSTLE" ]; then
  echo "Apostle chain not found at $APOSTLE"
  exit 1
fi
cd "$APOSTLE"
cargo build --release
echo "Start Apostle API on :7332 per upstream runbook"
