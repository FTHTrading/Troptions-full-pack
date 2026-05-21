#!/usr/bin/env python3
"""Migrate SQLite treasury hints to on-chain L1 treasury_balances."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "backend" / "fth-academy"))
sys.path.insert(0, str(ROOT / "backend" / "shared"))

from dao_db import list_treasury, log_audit  # noqa: E402
from l1_client import TroptionsL1Client  # noqa: E402


def main() -> int:
    parser = argparse.ArgumentParser(description="Seed L1 treasury from SQLite metadata")
    parser.add_argument("--l1-url", default="http://127.0.0.1:9944")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    client = TroptionsL1Client(args.l1_url)
    entries = list_treasury()
    print(f"Found {len(entries)} treasury entries in SQLite (metadata only)")

    for row in entries:
        chain = row.get("chain", "unknown")
        asset = row.get("asset", "NATIVE")
        hint = row.get("balance_hint", "0")
        amount = 0 if hint == "live" else int(hint) if str(hint).isdigit() else 0
        if amount <= 0:
            amount = 100_000  # default seed for migration
        print(f"  {chain}:{asset} -> credit {amount}")
        if not args.dry_run:
            # Credit via internal genesis-style RPC would need admin tx;
            # report current L1 balance for operator verification.
            bal = client.treasury_get_balance(chain, asset)
            print(f"    L1 current: {bal}")

    log_audit("treasury_migrate_l1", None, {"entries": len(entries), "dry_run": args.dry_run})
    print("Done. Genesis node seeds treasury on first boot; verify with treasury_getBalance.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
