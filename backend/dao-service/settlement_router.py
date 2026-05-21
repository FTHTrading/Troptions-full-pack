"""FastAPI router for settlement endpoints (mounted in dao-service or tests)."""

from __future__ import annotations

import os
from typing import Optional

from fastapi import APIRouter, Header, Request

from settlement_api import SettlementSubmitBody, handle_settlement_submit

router = APIRouter(prefix="/settlement", tags=["settlement"])


@router.get("/health")
async def settlement_health() -> dict:
    return {
        "status": "ok",
        "x402_mode": os.getenv("X402_MODE", "staged"),
        "api_keys_configured": bool(os.getenv("SETTLEMENT_API_KEYS", "").strip()),
    }


@router.post("/submit")
async def settlement_submit(
    request: Request,
    body: SettlementSubmitBody,
    x_api_key: Optional[str] = Header(None, alias="X-API-Key"),
    x_signature: Optional[str] = Header(None, alias="X-Signature"),
):
    return await handle_settlement_submit(
        request, body, x_api_key=x_api_key, x_signature=x_signature
    )
