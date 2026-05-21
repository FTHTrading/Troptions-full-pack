"""Optional Apostle/agent registration stub on main (full impl on x402 branch)."""

from __future__ import annotations

from typing import Any, Dict


async def startup_registration() -> Dict[str, Any]:
    return {"registered": False, "mode": "stub"}
