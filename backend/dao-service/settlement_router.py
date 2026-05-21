"""Settlement HTTP API — X-API-Key, X-Signature, rate limited."""

from __future__ import annotations

import hashlib
import hmac
import os
import time
from typing import Optional

from fastapi import APIRouter, Header, HTTPException, Request
from pydantic import BaseModel, Field
from slowapi import Limiter
from slowapi.util import get_remote_address

from x402_middleware import X402_MODE, verify_payment

limiter = Limiter(key_func=get_remote_address)
router = APIRouter(prefix="/settlement", tags=["settlement"])

SETTLEMENT_API_KEY = os.getenv("SETTLEMENT_API_KEY", "")
SETTLEMENT_HMAC_SECRET = os.getenv("SETTLEMENT_HMAC_SECRET", "")
SETTLEMENT_FEE_ATP = os.getenv("SETTLEMENT_FEE_ATP", "1000000000000000000")
L1_RPC_URL = os.getenv("L1_RPC_URL", "http://127.0.0.1:9944")


class SettlementCreate(BaseModel):
    creator: str = Field(..., min_length=64, max_length=64)
    asset: str = "TROPTIONS"
    amount: str
    recipient: str
    condition: str = "manual_release"
    expires_at: Optional[int] = None
    idempotency_key: Optional[str] = None


def _verify_api_key(key: Optional[str]) -> None:
    if not SETTLEMENT_API_KEY:
        return
    if not key or not hmac.compare_digest(key, SETTLEMENT_API_KEY):
        raise HTTPException(status_code=401, detail="invalid api key")


def _verify_signature(body: bytes, signature: Optional[str], timestamp: Optional[str]) -> None:
    if not SETTLEMENT_HMAC_SECRET:
        return
    if not signature or not timestamp:
        raise HTTPException(status_code=401, detail="missing signature or timestamp")
    try:
        ts = int(timestamp)
    except ValueError:
        raise HTTPException(status_code=401, detail="invalid timestamp")
    if abs(time.time() - ts) > 300:
        raise HTTPException(status_code=401, detail="timestamp skew")
    msg = f"{timestamp}.".encode() + body
    expected = hmac.new(
        SETTLEMENT_HMAC_SECRET.encode(),
        msg,
        hashlib.sha256,
    ).hexdigest()
    if not hmac.compare_digest(expected, signature):
        raise HTTPException(status_code=401, detail="invalid signature")


@router.get("/health")
async def settlement_health():
    return {"status": "ok", "service": "settlement", "x402_mode": X402_MODE}


@router.post("/create")
@limiter.limit("30/minute")
async def create_settlement(
    request: Request,
    body: SettlementCreate,
    x_api_key: Optional[str] = Header(None, alias="X-API-Key"),
    x_signature: Optional[str] = Header(None, alias="X-Signature"),
    x_timestamp: Optional[str] = Header(None, alias="X-Timestamp"),
    x_payment_receipt: Optional[str] = Header(None, alias="X-Payment-Receipt"),
):
    raw = await request.body()
    _verify_api_key(x_api_key)
    _verify_signature(raw, x_signature, x_timestamp)

    if X402_MODE == "production":
        if not x_payment_receipt:
            raise HTTPException(status_code=402, detail="payment required (1 ATP)")
        pay = await verify_payment(x_payment_receipt, body.idempotency_key, SETTLEMENT_FEE_ATP)
        if not pay.get("ok"):
            raise HTTPException(status_code=402, detail=pay)

    import httpx

    payload = {
        "jsonrpc": "2.0",
        "method": "settlement_create",
        "params": {
            "creator": body.creator,
            "asset": body.asset,
            "amount": body.amount,
            "recipient": body.recipient,
            "condition": body.condition,
        },
        "id": 1,
    }
    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.post(L1_RPC_URL, json=payload)
        data = resp.json()
    if "error" in data:
        raise HTTPException(status_code=400, detail=data["error"])
    return {"ok": True, "result": data.get("result"), "fee_atp": SETTLEMENT_FEE_ATP}
