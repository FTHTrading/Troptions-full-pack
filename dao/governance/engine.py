"""Governance engine — L1 light client proxy (no SQLite writes for proposals/votes)."""

from __future__ import annotations

import sys
from pathlib import Path
from typing import Any, Dict, List, Optional

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend" / "fth-academy"))
sys.path.insert(0, str(ROOT / "backend" / "shared"))

from dao_db import init_dao_db, log_audit  # noqa: E402
from l1_client import L1ClientError, TroptionsL1Client  # noqa: E402


class GovernanceEngine:
    """Proxies governance to L1; SQLite used for audit log only."""

    def __init__(self, l1_url: Optional[str] = None):
        self.l1 = TroptionsL1Client(l1_url) if l1_url else TroptionsL1Client()
        init_dao_db()

    def state(self) -> Dict[str, Any]:
        try:
            l1_state = self.l1.state_get()
            gov = self.l1.governance_get()
        except L1ClientError as exc:
            l1_state = {"reachable": False, "error": str(exc)}
            gov = {}
        return {
            "l1": l1_state,
            "governance": gov,
            "source": "l1_only",
        }

    def list_proposals(self) -> Dict[str, Any]:
        try:
            remote = self.l1.call("dao_getProposals") or self.l1.proposal_list() or []
        except L1ClientError:
            remote = []
        return {"l1": remote, "source": "l1_only"}

    def create_proposal(
        self,
        proposer: str,
        title: str,
        description: str,
        action_uri: Optional[str] = None,
        signature: Optional[str] = None,
    ) -> Dict[str, Any]:
        if signature:
            params: Dict[str, Any] = {
                "proposer": proposer,
                "title": title,
                "description": description,
                "signature": signature,
            }
            if action_uri:
                params["action_uri"] = action_uri
            result = self.l1.call("dao_submit_proposal", params)
        else:
            result = self.l1.submit_proposal_create(
                proposer, title, description, action_uri
            )
        log_audit("proposal_create", proposer, result)
        return result

    def vote(
        self,
        proposal_id: str,
        voter: str,
        choice: str = "for",
        signature: Optional[str] = None,
    ) -> Dict[str, Any]:
        if signature:
            result = self.l1.call(
                "dao_cast_vote",
                {
                    "proposal_id": proposal_id,
                    "voter": voter,
                    "choice": choice,
                    "signature": signature,
                },
            )
        else:
            result = self.l1.submit_proposal_vote(proposal_id, voter, choice)
        log_audit("proposal_vote", voter, result)
        return result

    def finalize(self, proposal_id: str) -> Dict[str, Any]:
        result = self.l1.call("submit_proposal_finalize", {"proposal_id": proposal_id})
        log_audit("proposal_finalize", None, result)
        return result

    def execute(
        self, proposal_id: str, executor: Optional[str] = None, signature: Optional[str] = None
    ) -> Dict[str, Any]:
        if signature and executor:
            result = self.l1.call(
                "dao_execute",
                {
                    "proposal_id": proposal_id,
                    "executor": executor,
                    "signature": signature,
                },
            )
        else:
            result = self.l1.call("submit_proposal_execute", {"proposal_id": proposal_id})
        log_audit("proposal_execute", executor, result)
        return result

    def get_votes(self, proposal_id: str) -> List[Dict[str, Any]]:
        return self.l1.call("dao_getVotes", {"proposal_id": proposal_id}) or []
