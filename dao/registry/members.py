"""Bridge TTN namespaces + FTH enrollments to L1 soulbound credentials."""

from __future__ import annotations

import json
import sqlite3
import sys
from hashlib import sha256
from pathlib import Path
from typing import Any, Dict, List, Optional

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend" / "fth-academy"))
sys.path.insert(0, str(ROOT / "backend" / "shared"))

from dao_db import log_audit  # noqa: E402
from l1_client import L1ClientError, TroptionsL1Client  # noqa: E402

GENESIS_BRANDS = Path(__file__).parent / "genesis_brands.json"
TTN_DB = ROOT / "backend" / "ttn-launcher" / "ttn_channels.db"
FTH_DB = ROOT / "backend" / "fth-academy" / "fth_backend.db"


class MemberRegistry:
    def __init__(self, l1_url: Optional[str] = None) -> None:
        self.l1 = TroptionsL1Client(l1_url) if l1_url else TroptionsL1Client()
        self.brands = json.loads(GENESIS_BRANDS.read_text(encoding="utf-8"))

    def brand_map(self) -> List[Dict[str, str]]:
        return self.brands.get("issuers", [])

    def _derive_account(self, seed: str) -> str:
        return sha256(seed.encode()).hexdigest()

    def credentials_for_owner(self, owner_hex: str) -> List[Dict[str, Any]]:
        try:
            return self.l1.soulbound_by_owner(owner_hex)
        except L1ClientError:
            return []

    def list_members(self) -> List[Dict[str, Any]]:
        members: Dict[str, Dict[str, Any]] = {}

        if TTN_DB.exists():
            conn = sqlite3.connect(TTN_DB)
            conn.row_factory = sqlite3.Row
            try:
                rows = conn.execute(
                    "SELECT namespace, owner_wallet FROM namespace_registry WHERE is_active = 1"
                ).fetchall()
                for row in rows:
                    wallet = row["owner_wallet"] or self._derive_account(row["namespace"])
                    members[wallet] = {
                        "owner": wallet,
                        "namespace": row["namespace"],
                        "source": "ttn",
                    }
            finally:
                conn.close()

        if FTH_DB.exists():
            conn = sqlite3.connect(FTH_DB)
            conn.row_factory = sqlite3.Row
            try:
                rows = conn.execute(
                    "SELECT user_id, email, wallet FROM users"
                ).fetchall()
                for row in rows:
                    key = row["wallet"] or self._derive_account(row["user_id"])
                    members.setdefault(key, {"owner": key, "source": "fth"})
                    members[key]["enrollment_id"] = row["user_id"]
                    members[key]["email"] = row["email"]
            finally:
                conn.close()

        result = []
        for m in members.values():
            owner = m["owner"]
            creds = self.credentials_for_owner(owner)
            m["soulbound_count"] = len(creds)
            m["credentials"] = creds
            result.append(m)
        return result

    def register_namespace(
        self,
        namespace: str,
        owner_hex: str,
        brand_domain: Optional[str] = None,
    ) -> Dict[str, Any]:
        result = self.l1.call(
            "submit_namespace_register",
            {
                "namespace": namespace,
                "owner": owner_hex,
                "brand_domain": brand_domain,
            },
        )
        log_audit("namespace_register", owner_hex, result)
        return result
