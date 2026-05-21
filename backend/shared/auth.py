"""Shared API key verification for FastAPI write routes."""

from __future__ import annotations

import os
from typing import Optional, Set

from fastapi import Header, HTTPException


def get_valid_api_keys() -> Set[str]:
    """Collect secrets from API_KEYS (comma-separated) and SETTLEMENT_API_KEYS (key_id:secret)."""
    keys: Set[str] = set()
    for part in os.getenv("API_KEYS", "").split(","):
        part = part.strip()
        if part:
            keys.add(part)
    legacy = os.getenv("SETTLEMENT_API_KEY", "").strip()
    if legacy:
        keys.add(legacy)
    for part in os.getenv("SETTLEMENT_API_KEYS", "").split(","):
        part = part.strip()
        if not part:
            continue
        if ":" in part:
            _, secret = part.split(":", 1)
            keys.add(secret.strip())
        else:
            keys.add(part)
    return keys


def api_keys_configured() -> bool:
    return bool(get_valid_api_keys())


async def verify_api_key(
    x_api_key: Optional[str] = Header(None, alias="X-API-Key"),
) -> None:
    """
    Require X-API-Key when API_KEYS or SETTLEMENT_API_KEYS is set.
    Dev mode: no keys configured â†’ allow (document in .env.example).
    """
    valid = get_valid_api_keys()
    if not valid:
        return
    if not x_api_key or x_api_key not in valid:
        raise HTTPException(status_code=401, detail="Invalid or missing X-API-Key")
