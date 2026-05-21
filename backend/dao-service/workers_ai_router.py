"""Cloudflare Workers AI proxy — server-side only; never expose tokens to browsers."""

from __future__ import annotations

import os
from typing import Any, Dict, Optional

import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter(prefix="/ai/workers", tags=["workers-ai"])

WORKERS_AI_ENABLED = os.getenv("WORKERS_AI_ENABLED", "0").lower() in ("1", "true", "yes")
CLOUDFLARE_ACCOUNT_ID = os.getenv("CLOUDFLARE_ACCOUNT_ID", "")
WORKERS_AI_TOKEN = (
    os.getenv("WORKERS_AI_API_TOKEN")
    or os.getenv("CLOUDFLARE_WORKERS_AI_TOKEN")
    or os.getenv("CLOUDFLARE_API_TOKEN", "")
)
DEFAULT_MODEL = os.getenv(
    "WORKERS_AI_MODEL", "@cf/meta/llama-3.1-8b-instruct"
)


class WorkersAIRequest(BaseModel):
    prompt: str = Field(..., min_length=1)
    model: Optional[str] = None
    max_tokens: int = 512


@router.get("/status")
async def workers_ai_status():
    configured = bool(CLOUDFLARE_ACCOUNT_ID and WORKERS_AI_TOKEN)
    return {
        "enabled": WORKERS_AI_ENABLED,
        "configured": configured,
        "account_id_set": bool(CLOUDFLARE_ACCOUNT_ID),
        "token_set": bool(WORKERS_AI_TOKEN),
        "default_model": DEFAULT_MODEL,
        "note": "Set WORKERS_AI_ENABLED=1 and Cloudflare env vars; use DONK :8090 for tutoring.",
    }


@router.post("/run")
async def workers_ai_run(body: WorkersAIRequest):
    if not WORKERS_AI_ENABLED:
        raise HTTPException(
            status_code=503,
            detail="Workers AI disabled. Set WORKERS_AI_ENABLED=1 in .env.",
        )
    if not CLOUDFLARE_ACCOUNT_ID or not WORKERS_AI_TOKEN:
        raise HTTPException(
            status_code=503,
            detail="Missing CLOUDFLARE_ACCOUNT_ID or WORKERS_AI_API_TOKEN (see docs/deploy/secrets-setup.md).",
        )

    model = body.model or DEFAULT_MODEL
    url = (
        f"https://api.cloudflare.com/client/v4/accounts/{CLOUDFLARE_ACCOUNT_ID}"
        f"/ai/run/{model}"
    )
    payload: Dict[str, Any] = {
        "messages": [{"role": "user", "content": body.prompt}],
        "max_tokens": body.max_tokens,
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        resp = await client.post(
            url,
            headers={"Authorization": f"Bearer {WORKERS_AI_TOKEN}"},
            json=payload,
        )
    if resp.status_code >= 400:
        raise HTTPException(status_code=resp.status_code, detail=resp.text[:500])

    data = resp.json()
    result = data.get("result") if isinstance(data, dict) else data
    return {"ok": True, "model": model, "result": result}
