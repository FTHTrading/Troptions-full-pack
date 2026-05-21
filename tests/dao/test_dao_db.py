import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend" / "shared"))

from dao_db import init_dao_db, list_treasury, upsert_proposal  # noqa: E402


def test_treasury_seed(tmp_path):
    db = tmp_path / "test_dao.db"
    init_dao_db(db)
    entries = list_treasury(db)
    assert len(entries) >= 3
    chains = {e["chain"] for e in entries}
    assert "xrpl" in chains
    assert "polygon" in chains


def test_upsert_proposal(tmp_path):
    db = tmp_path / "test_dao.db"
    init_dao_db(db)
    row_id = upsert_proposal("l1id", "Title", "Body", "proposer1", db_path=db)
    assert row_id
