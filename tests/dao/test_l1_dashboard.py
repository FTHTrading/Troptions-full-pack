"""DAO dashboard reads L1-only proposal list shape."""

from __future__ import annotations

import sys
from pathlib import Path
from unittest.mock import MagicMock

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "dao"))
sys.path.insert(0, str(ROOT / "backend" / "fth-academy"))

from governance.engine import GovernanceEngine  # noqa: E402


def test_list_proposals_l1_only():
    eng = GovernanceEngine("http://127.0.0.1:9944")
    eng.l1 = MagicMock()
    eng.l1.call.return_value = [{"proposal_id": "AA", "title": "Test"}]
    out = eng.list_proposals()
    assert out["source"] == "l1_only"
    assert out["l1"][0]["title"] == "Test"
    assert "local" not in out
