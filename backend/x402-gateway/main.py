"""
TROPTIONS x402 Gateway sidecar — port 4020, SQLite ledger, Apostle correlation.
Proxies to UnyKorn credit gateway when X402_UPSTREAM is set; otherwise local verify.
"""

from __future__ import annotations

import hashlib
import json
import os
import sqlite3
import time
import uuid
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any, Dict, Optional

import httpx
from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel

from payments import create_invoice, verify_payment

try:
    from routes.x402_proxied import router as x402_proxied_router
except ImportError:
    x402_proxied_router = None

PORT = int(os.getenv("PORT", "4020"))
X402_MODE = os.getenv("X402_MODE", "staged").lower()
APOSTLE_URL = os.getenv("APOSTLE_URL", os.getenv("X402_APOSTLE_URL", "http://127.0.0.1:7332"))
X402_UPSTREAM = os.getenv("X402_UPSTREAM", "")  # e.g. http://127.0.0.1:4020 from UnyKorn package
DATA_DIR = Path(os.getenv("X402_DATA_DIR", "data/x402-gateway"))
DB_PATH = DATA_DIR / "ledger.db"


def init_db() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS receipts (
            receipt_id TEXT PRIMARY KEY,
            idempotency_key TEXT UNIQUE,
            service TEXT,
            amount_atp TEXT,
            apostle_tx_hash TEXT,
            status TEXT,
            created_at REAL
        )
        """
    )
    conn.commit()
    conn.close()


class VerifyRequest(BaseModel):
    receipt_id: str
    idempotency_key: Optional[str] = None
    expected_atp: Optional[str] = None


class PayRequest(BaseModel):
    service: str
    amount_atp: str
    payer_agent_id: Optional[str] = None
    idempotency_key: Optional[str] = None


@asynccontextmanager
async def lifespan(_app: FastAPI):
    init_db()
    if X402_MODE == "production":
        async with httpx.AsyncClient(timeout=5.0) as client:
            r = await client.get(f"{APOSTLE_URL}/health")
            if r.status_code != 200:
                raise RuntimeError(f"Apostle not reachable at {APOSTLE_URL}")
    yield


app = FastAPI(title="TROPTIONS x402 Gateway", version="1.1.0", lifespan=lifespan)

if x402_proxied_router is not None:
    app.include_router(x402_proxied_router)


@app.get("/health")
async def health():
    apostle_ok = False
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            r = await client.get(f"{APOSTLE_URL}/health")
            apostle_ok = r.status_code == 200
    except Exception:
        pass
    return {
        "status": "ok",
        "port": PORT,
        "x402_mode": X402_MODE,
        "apostle_reachable": apostle_ok,
        "upstream": X402_UPSTREAM or None,
    }


@app.get("/status")
async def status():
    conn = sqlite3.connect(DB_PATH)
    count = conn.execute("SELECT COUNT(*) FROM receipts").fetchone()[0]
    conn.close()
    return {"receipts": count, "mode": X402_MODE, "db": str(DB_PATH)}


@app.post("/v1/verify")
async def verify(body: VerifyRequest):
    if X402_UPSTREAM:
        async with httpx.AsyncClient(timeout=15.0) as client:
            r = await client.post(f"{X402_UPSTREAM}/v1/verify", json=body.model_dump())
            return r.json()

    conn = sqlite3.connect(DB_PATH)
    row = conn.execute(
        "SELECT receipt_id, amount_atp, status, apostle_tx_hash FROM receipts WHERE receipt_id = ?",
        (body.receipt_id,),
    ).fetchone()
    if not row and body.idempotency_key:
        row = conn.execute(
            "SELECT receipt_id, amount_atp, status, apostle_tx_hash FROM receipts WHERE idempotency_key = ?",
            (body.idempotency_key,),
        ).fetchone()
    conn.close()

    if not row:
        if X402_MODE == "staged":
            return {"ok": True, "staged": True, "receipt_id": body.receipt_id}
        return {"ok": False, "error": "receipt not found"}

    _, amount, status, tx_hash = row
    if body.expected_atp and amount != body.expected_atp:
        return {"ok": False, "error": "amount mismatch"}
    if status != "settled":
        return {"ok": False, "error": "not settled"}
    return {"ok": True, "receipt_id": row[0], "amount_atp": amount, "apostle_tx_hash": tx_hash}


@app.post("/v1/pay")
async def pay(body: PayRequest, x_idempotency_key: Optional[str] = Header(None, alias="X-Idempotency-Key")):
    idem = body.idempotency_key or x_idempotency_key or str(uuid.uuid4())
    receipt_id = hashlib.sha256(f"{idem}:{body.service}:{body.amount_atp}".encode()).hexdigest()[:32]

    apostle_tx = None
    if X402_MODE == "production" and body.payer_agent_id:
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                r = await client.get(f"{APOSTLE_URL}/v1/agent/{body.payer_agent_id}/balance")
                if r.status_code != 200:
                    raise HTTPException(status_code=402, detail="insufficient ATP or agent missing")
        except HTTPException:
            raise
        except Exception as exc:
            raise HTTPException(status_code=503, detail=f"apostle: {exc}") from exc
        apostle_tx = f"staged-{receipt_id}"

    conn = sqlite3.connect(DB_PATH)
    try:
        conn.execute(
            """
            INSERT INTO receipts (receipt_id, idempotency_key, service, amount_atp, apostle_tx_hash, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (receipt_id, idem, body.service, body.amount_atp, apostle_tx or "", "settled", time.time()),
        )
        conn.commit()
    except sqlite3.IntegrityError:
        pass
    conn.close()

    return {
        "ok": True,
        "receipt_id": receipt_id,
        "idempotency_key": idem,
        "amount_atp": body.amount_atp,
        "apostle_tx_hash": apostle_tx,
        "mode": X402_MODE,
    }


@app.post("/v1/needai/dispatch")
async def needai_dispatch(payload: Dict[str, Any]):
    return {"ok": True, "routed": "needai-stub", "payload_keys": list(payload.keys())}


@app.post("/v1/invoice")
async def invoice_create(body: PayRequest):
    """Create x402 invoice stub (dev)."""
    return create_invoice(body.service, body.amount_atp)


@app.post("/v1/invoice/verify")
async def invoice_verify(body: VerifyRequest):
    """Verify payment — mock true when X402_DEV_MOCK_VERIFY=true."""
    return verify_payment(body.receipt_id, body.expected_atp)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)
