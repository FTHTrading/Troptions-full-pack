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

    def governance_get(self) -> Dict[str, Any]:
        return self.call("governance_get")

    def proposal_list(self) -> Any:
        return self.call("proposal_list")

    def proposal_get(self, proposal_id: str) -> Dict[str, Any]:
        return self.call("proposal_get", {"proposal_id": proposal_id})

    def submit_soulbound_mint(
        self,
        issuer: str,
        owner: str,
        metadata_uri: Optional[str] = None,
        nonce: int = 0,
    ) -> Dict[str, Any]:
        params: Dict[str, Any] = {"issuer": issuer, "owner": owner, "nonce": nonce}
        if metadata_uri:
            params["metadata_uri"] = metadata_uri
        return self.call("submit_soulbound_mint", params)

    def submit_namespace_register(
        self,
        namespace: str,
        owner: str,
        brand_domain: Optional[str] = None,
    ) -> Dict[str, Any]:
        params: Dict[str, Any] = {"namespace": namespace, "owner": owner}
        if brand_domain:
            params["brand_domain"] = brand_domain
        return self.call("submit_namespace_register", params)

    def submit_proposal_create(
        self,
        proposer: str,
        title: str,
        description: str,
        action_uri: Optional[str] = None,
    ) -> Dict[str, Any]:
        params: Dict[str, Any] = {
            "proposer": proposer,
            "title": title,
            "description": description,
        }
        if action_uri:
            params["action_uri"] = action_uri
        return self.call("submit_proposal_create", params)

    def submit_proposal_vote(
        self, proposal_id: str, voter: str, choice: str = "for"
    ) -> Dict[str, Any]:
        return self.call(
            "submit_proposal_vote",
            {"proposal_id": proposal_id, "voter": voter, "choice": choice},
        )

    def treasury_get_balance(self, chain: str, asset: str) -> Dict[str, Any]:
        return self.call("treasury_getBalance", {"chain": chain, "asset": asset})

    def dao_get_proposals(self) -> Any:
        return self.call("dao_getProposals")

    def dao_get_votes(self, proposal_id: str) -> Any:
        return self.call("dao_getVotes", {"proposal_id": proposal_id})

    def submit_transaction(self, tx: Dict[str, Any]) -> Dict[str, Any]:
        return self.call("submit_transaction", tx)


def get_l1_client() -> TroptionsL1Client:
    return TroptionsL1Client()
