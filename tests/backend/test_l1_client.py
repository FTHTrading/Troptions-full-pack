import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "backend" / "fth-academy"))

from l1_client import TroptionsL1Client  # noqa: E402


def test_client_builds_payload():
    client = TroptionsL1Client("http://127.0.0.1:9944")
    assert client.base_url == "http://127.0.0.1:9944"


def test_l1_client_has_submit_methods():
    client = TroptionsL1Client()
    assert hasattr(client, "submit_proposal_create")
    assert hasattr(client, "governance_get")
