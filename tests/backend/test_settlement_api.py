"""Settlement API tests (dao-service router)."""

import os
import sys
from pathlib import Path

import pytest
from httpx import ASGITransport, AsyncClient

os.environ.setdefault("SETTLEMENT_API_KEY", "")
os.environ.setdefault("SETTLEMENT_HMAC_SECRET", "")
os.environ.setdefault("X402_MODE", "staged")

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend" / "dao-service"))


@pytest.mark.asyncio
async def test_settlement_health():
    from fastapi import FastAPI
    from settlement_router import router as settlement_router

    app = FastAPI()
    app.include_router(settlement_router)
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        r = await client.get("/settlement/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"
