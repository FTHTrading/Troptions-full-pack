"""Staged x402 middleware — pass-through on main; no public facilitator."""

from __future__ import annotations

import os
from typing import Callable, List

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response


class X402Middleware(BaseHTTPMiddleware):
    """LOCAL_ONLY on main: does not block requests (X402_MODE=staged)."""

    def __init__(
        self,
        app,
        service_name: str = "troptions-dao",
        price_atp: str = "0",
        protected_prefixes: List[str] | None = None,
    ):
        super().__init__(app)
        self.service_name = service_name
        self.price_atp = price_atp
        self.protected_prefixes = protected_prefixes or []
        self.mode = os.getenv("X402_MODE", "staged")

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        return await call_next(request)
