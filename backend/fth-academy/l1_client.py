"""
TROPTIONS L1 JSON-RPC client (port 9944).
Methods: state_get, soulbound_get, soulbound_by_owner, settlement_get, balance_get
"""

from __future__ import annotations

import os
from typing import Any, Dict, List, Optional

import httpx

L1_RPC_URL = os.getenv("L1_RPC_URL", "http://127.0.0.1:9944")


class L1ClientError(Exception):
    pass


class TroptionsL1Client:
    def __init__(self, base_url: str = L1_RPC_URL, timeout: float = 30.0):
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self._id = 0

    def _next_id(self) -> int:
        self._id += 1
        return self._id

    def call(self, method: str, params: Optional[Dict[str, Any]] = None) -> Any:
        payload = {
            "jsonrpc": "2.0",
            "method": method,
            "params": params or {},
            "id": self._next_id(),
        }
        with httpx.Client(timeout=self.timeout) as client:
            resp = client.post(self.base_url, json=payload)
            resp.raise_for_status()
            data = resp.json()

        if "error" in data:
            err = data["error"]
            raise L1ClientError(err.get("message", str(err)))
        return data.get("result")

    def state_get(self) -> Dict[str, Any]:
        return self.call("state_get")

    def soulbound_get(self, token_id: str) -> Dict[str, Any]:
        return self.call("soulbound_get", {"token_id": token_id})

    def soulbound_by_owner(self, owner: str) -> List[Dict[str, Any]]:
        result = self.call("soulbound_by_owner", {"owner": owner})
        return result if isinstance(result, list) else [result]

    def settlement_get(self, settlement_id: str) -> Dict[str, Any]:
        return self.call("settlement_get", {"settlement_id": settlement_id})

    def balance_get(self, account: str, asset: str = "NATIVE") -> Dict[str, Any]:
        return self.call("balance_get", {"account": account, "asset": asset})


def get_l1_client() -> TroptionsL1Client:
    return TroptionsL1Client()
