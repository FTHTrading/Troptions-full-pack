"""Apostle + L1 agent registration on dao-service startup."""

from __future__ import annotations

import os
from typing import Any, Dict, Optional

import httpx

APOSTLE_URL = os.getenv("APOSTLE_URL", "http://127.0.0.1:7332")
L1_RPC_URL = os.getenv("L1_RPC_URL", "http://127.0.0.1:9944")
DAO_AGENT_LABEL = os.getenv("DAO_AGENT_LABEL", "troptions-dao-service")
DAO_AGENT_PORT = int(os.getenv("DAO_PORT", "8093"))


async def apostle_health() -> Dict[str, Any]:
    async with httpx.AsyncClient(timeout=5.0) as client:
        r = await client.get(f"{APOSTLE_URL}/health")
        return {"status_code": r.status_code, "body": r.json() if r.status_code == 200 else r.text}


async def register_apostle_agent(label: str = DAO_AGENT_LABEL) -> Dict[str, Any]:
    payload = {"label": label, "capabilities": ["governance", "settlement", "x402"]}
    async with httpx.AsyncClient(timeout=15.0) as client:
        r = await client.post(f"{APOSTLE_URL}/v1/agents/register", json=payload)
        if r.status_code not in (200, 201):
            return {"ok": False, "error": r.text, "status": r.status_code}
        return {"ok": True, **r.json()}


async def register_l1_agent(agent_id: str, label: str, port: int) -> Dict[str, Any]:
    payload = {
        "jsonrpc": "2.0",
        "method": "agent_register",
        "params": {"agent_id": agent_id, "label": label, "service_port": port},
        "id": 1,
    }
    async with httpx.AsyncClient(timeout=10.0) as client:
        r = await client.post(L1_RPC_URL, json=payload)
        return r.json()


async def startup_registration() -> Dict[str, Any]:
    """Register dao-service on Apostle and L1 agent registry."""
    out: Dict[str, Any] = {"apostle": None, "l1": None}
    try:
        out["apostle_health"] = await apostle_health()
    except Exception as exc:
        out["apostle_health"] = {"error": str(exc)}

    try:
        reg = await register_apostle_agent()
        out["apostle"] = reg
        agent_id = reg.get("agent_id") or reg.get("id") or ""
        if agent_id.startswith("agent:"):
            agent_id = agent_id.split(":", 1)[1]
        if agent_id:
            out["l1"] = await register_l1_agent(agent_id, DAO_AGENT_LABEL, DAO_AGENT_PORT)
    except Exception as exc:
        out["apostle"] = {"ok": False, "error": str(exc)}
    return out
