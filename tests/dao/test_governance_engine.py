import sys
from pathlib import Path
from unittest.mock import MagicMock, patch

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend" / "fth-academy"))
sys.path.insert(0, str(ROOT / "backend" / "shared"))
sys.path.insert(0, str(ROOT / "dao"))

from governance.engine import GovernanceEngine  # noqa: E402


def test_create_proposal_calls_l1():
    with patch("governance.engine.TroptionsL1Client") as mock_cls:
        client = MagicMock()
        client.call.return_value = {
            "proposal_id": "ABCD1234",
            "status": "Active",
            "votes_for": 0,
            "votes_against": 0,
            "votes_abstain": 0,
        }
        mock_cls.return_value = client
        eng = GovernanceEngine("http://127.0.0.1:9944")
        result = eng.create_proposal("aa" * 32, "Test", "Desc")
        assert result["proposal_id"] == "ABCD1234"
        client.call.assert_called_with(
            "submit_proposal_create",
            {
                "proposer": "aa" * 32,
                "title": "Test",
                "description": "Desc",
            },
        )
