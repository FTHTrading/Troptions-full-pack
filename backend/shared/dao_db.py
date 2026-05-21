"""SQLite persistence for DAO proposals, votes, treasury, audit log."""

from __future__ import annotations

import json
import sqlite3
import uuid
from contextlib import contextmanager
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Generator, List, Optional

DEFAULT_DB = Path(__file__).resolve().parents[2] / "dao" / "data" / "dao_state.db"

SCHEMA = """
CREATE TABLE IF NOT EXISTS dao_proposals (
    id TEXT PRIMARY KEY,
    l1_proposal_id TEXT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    proposer TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active',
    votes_for INTEGER DEFAULT 0,
    votes_against INTEGER DEFAULT 0,
    votes_abstain INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    synced_at TEXT
);

CREATE TABLE IF NOT EXISTS dao_votes (
    id TEXT PRIMARY KEY,
    proposal_id TEXT NOT NULL,
    voter TEXT NOT NULL,
    choice TEXT NOT NULL,
    weight INTEGER DEFAULT 1,
    created_at TEXT NOT NULL,
    UNIQUE(proposal_id, voter)
);

CREATE TABLE IF NOT EXISTS treasury_entries (
    id TEXT PRIMARY KEY,
    chain TEXT NOT NULL,
    asset TEXT NOT NULL,
    address TEXT NOT NULL,
    balance_hint TEXT,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS treasury_allocations (
    id TEXT PRIMARY KEY,
    proposal_id TEXT,
    chain TEXT NOT NULL,
    asset TEXT NOT NULL,
    amount TEXT NOT NULL,
    recipient TEXT NOT NULL,
    spend_limit_usd REAL,
    status TEXT DEFAULT 'pending',
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_log (
    id TEXT PRIMARY KEY,
    action TEXT NOT NULL,
    actor TEXT,
    details TEXT,
    created_at TEXT NOT NULL
);
"""


@contextmanager
def get_conn(db_path: Path = DEFAULT_DB) -> Generator[sqlite3.Connection, None, None]:
    db_path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(db_path))
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_dao_db(db_path: Path = DEFAULT_DB) -> None:
    with get_conn(db_path) as conn:
        conn.executescript(SCHEMA)
        _seed_treasury(conn)


def _seed_treasury(conn: sqlite3.Connection) -> None:
    defaults = [
        ("xrpl", "TROPTIONS", "rPF2M1QjRj72rHdJyRqfFRTqWREBdJds3"),
        ("polygon", "KENNY", "0x93F2a3266a81c1F3Ee2c196b90890A959bC69BD7"),
        ("polygon", "EVL", "0x496b0802a3CB2Ce101A3F20e1dada33B78fDD806"),
    ]
    now = datetime.utcnow().isoformat()
    for chain, asset, address in defaults:
        conn.execute(
            """
            INSERT OR IGNORE INTO treasury_entries (id, chain, asset, address, balance_hint, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (f"{chain}-{asset}".lower(), chain, asset, address, "live", now),
        )


def log_audit(
    action: str,
    actor: Optional[str] = None,
    details: Optional[Dict[str, Any]] = None,
    db_path: Path = DEFAULT_DB,
) -> str:
    entry_id = str(uuid.uuid4())
    with get_conn(db_path) as conn:
        conn.execute(
            "INSERT INTO audit_log (id, action, actor, details, created_at) VALUES (?, ?, ?, ?, ?)",
            (entry_id, action, actor, json.dumps(details or {}), datetime.utcnow().isoformat()),
        )
    return entry_id


def upsert_proposal(
    l1_id: str,
    title: str,
    description: str,
    proposer: str,
    status: str = "Active",
    votes_for: int = 0,
    votes_against: int = 0,
    votes_abstain: int = 0,
    db_path: Path = DEFAULT_DB,
) -> str:
    row_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    with get_conn(db_path) as conn:
        conn.execute(
            """
            INSERT INTO dao_proposals
            (id, l1_proposal_id, title, description, proposer, status,
             votes_for, votes_against, votes_abstain, created_at, synced_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                row_id, l1_id, title, description, proposer, status,
                votes_for, votes_against, votes_abstain, now, now,
            ),
        )
    log_audit("proposal_upsert", proposer, {"l1_id": l1_id, "title": title}, db_path=db_path)
    return row_id


def list_proposals(db_path: Path = DEFAULT_DB) -> List[Dict[str, Any]]:
    with get_conn(db_path) as conn:
        rows = conn.execute(
            "SELECT * FROM dao_proposals ORDER BY created_at DESC"
        ).fetchall()
    return [dict(r) for r in rows]


def list_treasury(db_path: Path = DEFAULT_DB) -> List[Dict[str, Any]]:
    with get_conn(db_path) as conn:
        rows = conn.execute("SELECT * FROM treasury_entries ORDER BY chain").fetchall()
    return [dict(r) for r in rows]


def list_audit(limit: int = 50) -> List[Dict[str, Any]]:
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT * FROM audit_log ORDER BY created_at DESC LIMIT ?",
            (limit,),
        ).fetchall()
    result = []
    for r in rows:
        d = dict(r)
        d["details"] = json.loads(d.get("details") or "{}")
        result.append(d)
    return result
