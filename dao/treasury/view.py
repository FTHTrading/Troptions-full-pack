"""Treasury view — read-only cache from L1 (refreshed every 10s)."""

from __future__ import annotations

import asyncio
import sys
import uuid
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend" / "fth-academy"))
sys.path.insert(0, str(ROOT / "backend" / "shared"))

from dao_db import get_conn, init_dao_db, log_audit  # noqa: E402
from l1_client import L1ClientError, TroptionsL1Client  # noqa: E402

DEFAULT_CHAINS = [
    ("xrpl", "TROPTIONS"),
    ("polygon", "KENNY"),
    ("polygon", "EVL"),
]


class TreasuryView:
    def __init__(self, l1_url: Optional[str] = None) -> None:
        init_dao_db()
        self.l1 = TroptionsL1Client(l1_url) if l1_url else TroptionsL1Client()
        self._cache: Dict[str, Any] = {"wallets": [], "source": "l1", "updated_at": None}
        self._task: Optional[asyncio.Task] = None

    async def start_polling(self, interval: float = 10.0) -> None:
        if self._task is None:
            self._task = asyncio.create_task(self._poll_loop(interval))

    async def _poll_loop(self, interval: float) -> None:
        while True:
            self.refresh_from_l1()
            await asyncio.sleep(interval)

    def refresh_from_l1(self) -> None:
        wallets: List[Dict[str, Any]] = []
        for chain, asset in DEFAULT_CHAINS:
            try:
                bal = self.l1.call(
                    "treasury_getBalance", {"chain": chain, "asset": asset}
                )
                wallets.append(
                    {
                        "chain": chain,
                        "asset": asset,
                        "balance": bal.get("balance", "0"),
                        "source": "l1_state",
                    }
                )
            except L1ClientError:
                wallets.append(
                    {
                        "chain": chain,
                        "asset": asset,
                        "balance": "0",
                        "source": "l1_unreachable",
                    }
                )
        self._cache = {
            "wallets": wallets,
            "source": "l1",
            "updated_at": datetime.utcnow().isoformat(),
        }

    def overview(self) -> Dict[str, Any]:
        if not self._cache.get("updated_at"):
            self.refresh_from_l1()
        with get_conn() as conn:
            allocations = conn.execute(
                "SELECT * FROM treasury_allocations ORDER BY created_at DESC LIMIT 20"
            ).fetchall()
        return {
            **self._cache,
            "allocations": [dict(a) for a in allocations],
            "spend_limits": {
                "daily_usd": 10_000,
                "proposal_max_usd": 50_000,
                "multisig_above": 1000,
            },
            "settlement_hook": "POST /settlement/submit (authenticated)",
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
                    alloc_id,
                    proposal_id,
                    chain,
                    asset,
                    amount,
                    recipient,
                    spend_limit_usd,
                    "pending",
                    now,
                ),
            )
        log_audit(
            "treasury_allocation",
            recipient,
            {"alloc_id": alloc_id, "chain": chain, "amount": amount},
        )
        return {"allocation_id": alloc_id, "status": "pending"}
