#!/usr/bin/env python3
"""
Migrate TTN namespace registry rows into TROPTIONS L1 soulbound credentials.

Reads ttn_channels.db (TTN launcher) and mints soulbound metadata via L1 RPC
when submit endpoints are available. Today: dry-run + JSON export for review.
"""

from __future__ import annotations

import argparse
import json
import sqlite3
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "backend" / "fth-academy"))

from l1_client import TroptionsL1Client  # noqa: E402

DEFAULT_DB = ROOT / "backend" / "ttn-launcher" / "ttn_channels.db"


def load_namespaces(db_path: Path) -> list[dict]:
    if not db_path.exists():
        return []
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    rows = conn.execute(
        """
        SELECT namespace, channel_id, owner_wallet, registration_type,
               registered_at, expires_at, is_active
        FROM namespace_registry
        WHERE is_active = 1
        ORDER BY registered_at ASC
        """
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def main() -> int:
    parser = argparse.ArgumentParser(description="Migrate TTN namespaces to L1 soulbound")
    parser.add_argument("--db", type=Path, default=DEFAULT_DB)
    parser.add_argument("--dry-run", action="store_true", default=True)
    parser.add_argument("--apply", action="store_true", help="Perform L1 writes (when implemented)")
    parser.add_argument("--out", type=Path, default=ROOT / "scripts" / "namespace-migration-preview.json")
    args = parser.parse_args()

    namespaces = load_namespaces(args.db)
    client = TroptionsL1Client()
    try:
        state = client.state_get()
    except Exception as exc:
        state = {"error": str(exc), "reachable": False}

    preview = {
        "namespace_count": len(namespaces),
        "l1_state": state,
        "namespaces": namespaces,
        "note": "L1 submit for soulbound mint is not yet wired in RPC; use dry-run until enabled.",
    }

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(preview, indent=2), encoding="utf-8")
    print(f"Wrote preview: {args.out} ({len(namespaces)} namespaces)")

    if args.apply and not args.dry_run:
        print("Apply mode requested but L1 write RPC is not exposed yet — export only.")
        return 2

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
