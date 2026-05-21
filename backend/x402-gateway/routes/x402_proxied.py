"""Proxied x402 resource routes (PIPELINE stubs)."""
from __future__ import annotations

import os
from typing import Any, Dict, Optional

import httpx
from fastapi import APIRouter, Header, HTTPException, Query, Request

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from payments import create_invoice, verify_payment

router = APIRouter(prefix="/x402", tags=["x402-proxied"])

ORCHESTRATOR_URL = os.getenv("ORCHESTRATOR_URL", "http://127.0.0.1:4022")
NEOBANK_URL = os.getenv("NEOBANK_URL", "http://127.0.0.1:4026")
BAAS_URL = os.getenv("BAAS_API_URL", "http://127.0.0.1:8097")


def _require_payment(x_payment: Optional[str], service: str, amount_atp: str = "1"):
    if x_payment and verify_payment(x_payment).get("ok"):
        return x_payment
    raise HTTPException(
        status_code=402,
        detail={
            "error": "payment_required",
            "invoice": create_invoice(service, amount_atp),
        },
    )


@router.get("/market-data/orderbook")
async def orderbook(
    pair: str = Query("USD-IOU/EUR-IOU"),
    x_402_payment: Optional[str] = Header(None, alias="X-402-Payment"),
):
    _require_payment(x_402_payment, "market-data/orderbook", "1")
    mid = 0.915
    return {
        "pair": pair,
        "bids": [{"price": f"{mid - 0.001:.6f}", "size": "25000"}],
        "asks": [{"price": f"{mid + 0.001:.6f}", "size": "25000"}],
        "mid": f"{mid:.6f}",
        "source": "mock",
        "label": "PIPELINE",
    }


@router.post("/exchange/place-order")
async def place_order(
    request: Request,
    x_402_payment: Optional[str] = Header(None, alias="X-402-Payment"),
):
    body = await request.json()
    _require_payment(x_402_payment, "exchange/place-order", "5")
    return {
        "ok": True,
        "order_id": f"ord_stub_{body.get('pair', 'unknown')}",
        "status": "pipeline",
        "label": "PIPELINE",
        "payload": body,
    }


@router.post("/fiat/deposit")
async def fiat_deposit(
    request: Request,
    x_402_payment: Optional[str] = Header(None, alias="X-402-Payment"),
):
    body = await request.json()
    _require_payment(x_402_payment, "fiat/deposit", "10")
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            r = await client.post(
                f"{ORCHESTRATOR_URL}/api/v1/payments/wire",
                json=body,
            )
            if r.status_code < 500:
                return {"proxied": True, "orchestrator_status": r.status_code, "body": r.json()}
    except Exception as exc:
        return {
            "proxied": False,
            "label": "PIPELINE",
            "error": str(exc),
            "stub": body,
        }
    raise HTTPException(status_code=503, detail="orchestrator unavailable")


@router.post("/cards/auth")
async def cards_auth(
    request: Request,
    x_402_payment: Optional[str] = Header(None, alias="X-402-Payment"),
):
    body = await request.json()
    _require_payment(x_402_payment, "cards/auth", "2")
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            r = await client.post(f"{NEOBANK_URL}/cards/authorize", json=body)
            return {"proxied": True, "neobank_status": r.status_code, "body": r.json()}
    except Exception:
        return {
            "authorized": True,
            "stub": True,
            "label": "PROJECTION",
            "neobank": NEOBANK_URL,
            "payload_keys": list(body.keys()),
        }


@router.post("/baas/onboard")
async def baas_onboard(
    request: Request,
    x_402_payment: Optional[str] = Header(None, alias="X-402-Payment"),
):
    body = await request.json()
    _require_payment(x_402_payment, "baas/onboard", "100")
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            r = await client.post(
                f"{BAAS_URL}/api/v1/tokens",
                json=body,
                headers={"X-402-Payment": x_402_payment or "dev-mock"},
            )
            return {"proxied": True, "baas_status": r.status_code, "body": r.json()}
    except Exception as exc:
        return {"proxied": False, "error": str(exc), "label": "PIPELINE", "stub": body}
