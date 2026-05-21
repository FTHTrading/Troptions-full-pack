"""Telnyx webhook + NEED AI / CLAWD dispatch with x402 ATP path."""

from __future__ import annotations

import os
from typing import Any, Dict, Optional

from fastapi import APIRouter, Header, HTTPException, Request
from pydantic import BaseModel

from x402_middleware import X402_MODE, verify_payment

router = APIRouter(prefix="/telecom", tags=["telecom"])

TELNYX_WEBHOOK_SECRET = os.getenv("TELNYX_WEBHOOK_SECRET", "")
TELECOM_DRY_RUN = os.getenv("TELECOM_DRY_RUN", "true").lower() in ("1", "true", "yes")
CLAWD_WORKSPACE = os.getenv("CLAWD_WORKSPACE", r"C:\Users\Kevan\.openclaw\workspace")
NEEDAI_DISPATCH_URL = os.getenv("NEEDAI_DISPATCH_URL", "http://127.0.0.1:4020/v1/needai/dispatch")
TELECOM_FEE_ATP = os.getenv("TELECOM_FEE_ATP", "500000000000000000")  # 0.5 ATP


class TelnyxEvent(BaseModel):
    event_type: str = ""
    payload: Dict[str, Any] = {}


def classify_call(event_type: str, payload: Dict[str, Any]) -> str:
    if "answered" in event_type:
        return "answered"
    if "hangup" in event_type:
        return "hangup"
    if "recording" in event_type:
        return "recording"
    return "unknown"


@router.get("/health")
async def telecom_health():
    return {
        "status": "ok",
        "dry_run": TELECOM_DRY_RUN,
        "x402_mode": X402_MODE,
        "clawd_workspace": CLAWD_WORKSPACE,
    }


@router.post("/telnyx/webhook")
async def telnyx_webhook(
    request: Request,
    body: TelnyxEvent,
    x_payment_receipt: Optional[str] = Header(None, alias="X-Payment-Receipt"),
):
    if TELNYX_WEBHOOK_SECRET:
        sig = request.headers.get("telnyx-signature-ed25519", "")
        if not sig and not TELECOM_DRY_RUN:
            raise HTTPException(status_code=401, detail="missing telnyx signature")

    category = classify_call(body.event_type, body.payload)
    dispatch = {"category": category, "agent": "needai-router", "dry_run": TELECOM_DRY_RUN}

    if X402_MODE == "production" and not TELECOM_DRY_RUN:
        if not x_payment_receipt:
            raise HTTPException(status_code=402, detail="ATP payment required for telecom dispatch")
        pay = await verify_payment(x_payment_receipt, expected_atp=TELECOM_FEE_ATP)
        if not pay.get("ok"):
            raise HTTPException(status_code=402, detail=pay)
        dispatch["x402"] = pay

    if TELECOM_DRY_RUN:
        dispatch["note"] = "DRY_RUN — no outbound Telnyx or agent call"
        return {"ok": True, "dispatch": dispatch}

    import httpx

    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            r = await client.post(NEEDAI_DISPATCH_URL, json={"event": body.model_dump(), "category": category})
            dispatch["needai_status"] = r.status_code
            dispatch["needai_body"] = r.json() if r.headers.get("content-type", "").startswith("application/json") else r.text
        except Exception as exc:
            dispatch["needai_error"] = str(exc)

    return {"ok": True, "dispatch": dispatch}
