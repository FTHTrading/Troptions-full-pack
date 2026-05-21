"""Multi-chain treasury view and allocation tracking."""

from __future__ import annotations

import sys
import uuid
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend" / "shared"))

from dao_db import get_conn, init_dao_db, list_treasury, log_audit  # noqa: E402

XRPL_GATEWAY = "rPF2M1QjRj72rHdJyRqfFRTqWREBdJds3"
KENNY_POLYGON = "0x93F2a3266a81c1F3Ee2c196b90890A959bC69BD7"
EVL_POLYGON = "0x496b0802a3CB2Ce101A3F20e1dada33B78fDD806"


class TreasuryView:
    def __init__(self) -> None:
        init_dao_db()

    def overview(self) -> Dict[str, Any]:
        entries = list_treasury()
        with get_conn() as conn:
            allocations = conn.execute(
                "SELECT * FROM treasury_allocations ORDER BY created_at DESC LIMIT 20"
            ).fetchall()
        return {
            "wallets": entries,
            "allocations": [dict(a) for a in allocations],
            "spend_limits": {
                "daily_usd": 10_000,
                "proposal_max_usd": 50_000,
            },
            "settlement_hook": "L1 settlement_create for escrowed disbursements",
        }

    def propose_allocation(
        self,
        chain: str,
        asset: str,
        amount: str,
        recipient: str,
        proposal_id: Optional[str] = None,
        spend_limit_usd: Optional[float] = None,
    ) -> Dict[str, Any]:
        alloc_id = str(uuid.uuid4())
        now = datetime.utcnow().isoformat()
        with get_conn() as conn:
            conn.execute(
                """
                INSERT INTO treasury_allocations
                (id, proposal_id, chain, asset, amount, recipient, spend_limit_usd, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    alloc_id, proposal_id, chain, asset, amount, recipient,
                    spend_limit_usd, "pending", now,
                ),
            )
        log_audit("treasury_allocation", recipient, {
            "alloc_id": alloc_id, "chain": chain, "amount": amount,
        })
        return {"allocation_id": alloc_id, "status": "pending"}
