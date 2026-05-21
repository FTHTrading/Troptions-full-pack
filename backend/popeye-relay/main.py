"""Popeye relay — stale agent detection (5min), port 4021."""

from __future__ import annotations

import os
import time
from typing import Any, Dict, List

import httpx
from fastapi import FastAPI

app = FastAPI(title="Popeye Relay", version="1.0.0")

L1_RPC_URL = os.getenv("L1_RPC_URL", "http://127.0.0.1:9944")
STALE_SECONDS = int(os.getenv("POPEYE_STALE_SECONDS", "300"))


async def l1_agent_list() -> List[Dict[str, Any]]:
    payload = {"jsonrpc": "2.0", "method": "agent_list", "params": {}, "id": 1}
    async with httpx.AsyncClient(timeout=10.0) as client:
        r = await client.post(L1_RPC_URL, json=payload)
        data = r.json()
    result = data.get("result", [])
    return result if isinstance(result, list) else []


@app.get("/health")
async def health():
    return {"status": "ok", "service": "popeye-relay", "stale_threshold_sec": STALE_SECONDS}


@app.get("/agents/stale")
async def stale_agents():
    now = int(time.time())
    agents = await l1_agent_list()
    stale = []
    for a in agents:
        hb = a.get("last_heartbeat", 0)
        if now - hb > STALE_SECONDS:
            stale.append({**a, "stale_for_sec": now - hb})
    return {"count": len(stale), "agents": stale, "checked_at": now}


@app.post("/agents/heartbeat-all")
async def heartbeat_probe():
    """Report agents needing heartbeat (does not call Apostle)."""
    stale = (await stale_agents())["agents"]
    return {"needs_heartbeat": [a.get("agent_id") for a in stale]}


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("POPEYE_PORT", "4021"))
    uvicorn.run(app, host="0.0.0.0", port=port)
