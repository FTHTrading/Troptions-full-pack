"""Shared x402 middleware for FastAPI services (staged default; production enforces ATP)."""

from __future__ import annotations

import os
import sys
from pathlib import Path
from typing import Callable, List, Optional

import httpx
from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

_DAO = Path(__file__).resolve().parent
sys.path.insert(0, str(_DAO.parent / "shared"))
from auth import api_keys_configured, get_valid_api_keys  # noqa: E402

X402_GATEWAY_URL = os.getenv("X402_GATEWAY_URL", "http://127.0.0.1:4020")
X402_MODE = os.getenv("X402_MODE", "staged").lower()
X402_SKIP_PATHS = {"/health", "/docs", "/openapi.json", "/redoc", "/ws"}


def payment_required_response(service: str, price_atp: str, description: str) -> JSONResponse:
    return JSONResponse(
        status_code=402,
        content={
            "error": "payment_required",
            "service": service,
            "price_atp": price_atp,
            "currency": "ATP",
            "decimals": 18,
            "description": description,
            "gateway": X402_GATEWAY_URL,
            "payment_header": "X-Payment-Receipt",
            "idempotency_header": "X-Idempotency-Key",
        },
        headers={"Payment-Required": "ATP"},
    )


async def verify_payment(
    receipt_id: str,
    idempotency_key: Optional[str] = None,
    expected_atp: Optional[str] = None,
) -> dict:
    """Verify settlement via x402 gateway (Apostle correlation)."""
    payload = {"receipt_id": receipt_id}
    if idempotency_key:
        payload["idempotency_key"] = idempotency_key
    if expected_atp:
        payload["expected_atp"] = expected_atp
    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.post(f"{X402_GATEWAY_URL}/v1/verify", json=payload)
        if resp.status_code != 200:
            return {"ok": False, "error": resp.text}
        return resp.json()


class X402Middleware(BaseHTTPMiddleware):
    """HTTP 402 for unpaid mutating routes when X402_MODE=production; API keys enforced first."""

    def __init__(
        self,
        app,
        service_name: str = "troptions-dao",
        price_atp: str = "0",
        protected_prefixes: Optional[List[str]] = None,
    ):
        super().__init__(app)
        self.service_name = service_name
        self.price_atp = price_atp
        self.protected_prefixes = tuple(protected_prefixes or ("/dao/proposals", "/settlement/"))

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        if X402_MODE != "production":
            return await call_next(request)

        path = request.url.path
        if path in X402_SKIP_PATHS or request.method in ("GET", "HEAD", "OPTIONS"):
            return await call_next(request)

        if not any(path.startswith(p) for p in self.protected_prefixes):
            return await call_next(request)

        if api_keys_configured():
            api_key = request.headers.get("X-API-Key") or request.headers.get("x-api-key")
            valid = get_valid_api_keys()
            if not api_key or api_key not in valid:
                return JSONResponse(
                    status_code=401,
                    content={"detail": "Invalid or missing X-API-Key"},
                )

        receipt = request.headers.get("X-Payment-Receipt") or request.headers.get("x-payment-receipt")
        if not receipt:
            return payment_required_response(
                self.service_name,
                self.price_atp,
                f"ATP payment required for {self.service_name}",
            )

        idem = request.headers.get("X-Idempotency-Key")
        result = await verify_payment(receipt, idem, self.price_atp)
        if not result.get("ok"):
            return JSONResponse(status_code=402, content={"error": "payment_invalid", "detail": result})

        request.state.x402_receipt = result
        return await call_next(request)
