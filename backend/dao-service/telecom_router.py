"""Telnyx webhook + NEED AI dispatch — dry-run when API key missing."""

from __future__ import annotations

import os
from typing import Any, Dict, Optional

import httpx
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

router = APIRouter(prefix="/telecom", tags=["telecom"])

TELNYX_API_KEY = os.getenv("TELNYX_API_KEY", "")
TELNYX_PUBLIC_KEY = os.getenv("TELNYX_PUBLIC_KEY", "")
TELNYX_WEBHOOK_SECRET = os.getenv("TELNYX_WEBHOOK_SECRET", "")
TELECOM_DRY_RUN = os.getenv("TELECOM_DRY_RUN", "true").lower() in ("1", "true", "yes")
NEEDAI_DISPATCH_URL = os.getenv(
    "NEEDAI_DISPATCH_URL", "http://127.0.0.1:4020/v1/needai/dispatch"
)

if not TELNYX_API_KEY:
    TELECOM_DRY_RUN = True


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
        "telnyx_api_key_set": bool(TELNYX_API_KEY),
        "telnyx_public_key_set": bool(TELNYX_PUBLIC_KEY),
        "webhook_secret_set": bool(TELNYX_WEBHOOK_SECRET),
        "needai_dispatch_url": NEEDAI_DISPATCH_URL,
    }


@router.post("/telnyx/webhook")
async def telnyx_webhook(request: Request, body: TelnyxEvent):
    if TELNYX_WEBHOOK_SECRET:
        sig = request.headers.get("telnyx-signature-ed25519", "")
        if not sig and not TELECOM_DRY_RUN:
            raise HTTPException(status_code=401, detail="missing telnyx signature")

    category = classify_call(body.event_type, body.payload)
    dispatch: Dict[str, Any] = {
        "category": category,
        "agent": "needai-router",
        "dry_run": TELECOM_DRY_RUN,
    }

    if TELECOM_DRY_RUN:
        dispatch["note"] = (
            "DRY_RUN — set TELNYX_API_KEY and TELECOM_DRY_RUN=false for outbound dispatch"
        )
        return {"ok": True, "dispatch": dispatch}

    if not TELNYX_API_KEY:
        dispatch["note"] = "TELNYX_API_KEY missing — staying in dry-run"
        dispatch["dry_run"] = True
        return {"ok": True, "dispatch": dispatch}

    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            r = await client.post(
                NEEDAI_DISPATCH_URL,
                json={"event": body.model_dump(), "category": category},
                headers={"Authorization": f"Bearer {TELNYX_API_KEY}"},
            )
            dispatch["needai_status"] = r.status_code
            ct = r.headers.get("content-type", "")
            dispatch["needai_body"] = r.json() if ct.startswith("application/json") else r.text
        except Exception as exc:
            dispatch["needai_error"] = str(exc)

    return {"ok": True, "dispatch": dispatch}
