"""x402 payment stubs — createInvoice / verifyPayment (mock true in dev)."""
from __future__ import annotations

import hashlib
import os
import time
import uuid
from typing import Any, Dict, Optional

X402_DEV_MOCK = os.getenv("X402_DEV_MOCK_VERIFY", "true").lower() == "true"


def create_invoice(
    service: str,
    amount_atp: str,
    amount_usd: Optional[float] = None,
    meta: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    invoice_id = hashlib.sha256(f"{service}:{amount_atp}:{time.time()}".encode()).hexdigest()[:24]
    return {
        "invoice_id": invoice_id,
        "service": service,
        "amount_atp": amount_atp,
        "amount_usd": amount_usd,
        "status": "pending",
        "pay_endpoint": "/v1/pay",
        "label": "PIPELINE",
        "meta": meta or {},
        "disclaimer": "PROJECTION — dev mock settlement",
    }


def verify_payment(receipt_id: str, expected_atp: Optional[str] = None) -> Dict[str, Any]:
    if X402_DEV_MOCK and receipt_id:
        return {
            "ok": True,
            "receipt_id": receipt_id,
            "staged": True,
            "mode": "dev_mock",
            "label": "PIPELINE",
        }
    if not receipt_id:
        return {"ok": False, "error": "missing receipt_id"}
    return {
        "ok": False,
        "error": "receipt not found",
        "hint": "POST /v1/pay first or enable X402_DEV_MOCK_VERIFY",
    }
