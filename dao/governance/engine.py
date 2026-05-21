"""Governance engine — L1-backed proposal lifecycle with SQLite mirror."""

from __future__ import annotations

import sys
from pathlib import Path
from typing import Any, Dict, List, Optional

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend" / "fth-academy"))
sys.path.insert(0, str(ROOT / "backend" / "shared"))

from dao_db import init_dao_db, list_proposals, log_audit, upsert_proposal  # noqa: E402
from l1_client import L1ClientError, TroptionsL1Client  # noqa: E402


class GovernanceEngine:
    def __init__(self, l1_url: Optional[str] = None):
        self.l1 = TroptionsL1Client(l1_url) if l1_url else TroptionsL1Client()
        init_dao_db()

    def state(self) -> Dict[str, Any]:
        try:
            l1_state = self.l1.state_get()
            gov = self.l1.call("governance_get")
        except L1ClientError as exc:
            l1_state = {"reachable": False, "error": str(exc)}
            gov = {}
        return {
            "l1": l1_state,
            "governance": gov,
            "proposals_local": list_proposals(),
        }

    def list_proposals(self) -> List[Dict[str, Any]]:
        try:
            remote = self.l1.call("proposal_list") or []
        except L1ClientError:
            remote = []
        local = list_proposals()
        return {"l1": remote, "local": local}

    def create_proposal(
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
        result = self.l1.call("submit_proposal_create", params)
        l1_id = result.get("proposal_id", "")
        upsert_proposal(
            l1_id,
            title,
            description,
            proposer,
            status=result.get("status", "Active"),
            votes_for=int(result.get("votes_for", 0)),
            votes_against=int(result.get("votes_against", 0)),
            votes_abstain=int(result.get("votes_abstain", 0)),
        )
        log_audit("proposal_create", proposer, result)
        return result

    def vote(self, proposal_id: str, voter: str, choice: str = "for") -> Dict[str, Any]:
        result = self.l1.call(
            "submit_proposal_vote",
            {"proposal_id": proposal_id, "voter": voter, "choice": choice},
        )
        log_audit("proposal_vote", voter, result)
        return result

    def finalize(self, proposal_id: str) -> Dict[str, Any]:
        result = self.l1.call("submit_proposal_finalize", {"proposal_id": proposal_id})
        log_audit("proposal_finalize", None, result)
        return result

    def execute(self, proposal_id: str) -> Dict[str, Any]:
        result = self.l1.call("submit_proposal_execute", {"proposal_id": proposal_id})
        log_audit("proposal_execute", None, result)
        return result
