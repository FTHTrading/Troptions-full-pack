"""Authenticated settlement submit — forwards signed txs to L1."""

from __future__ import annotations

import hashlib
import json
import os
from typing import Any, Dict, List, Optional

from fastapi import Header, HTTPException, Request
from pydantic import BaseModel, Field

from l1_client import L1ClientError, TroptionsL1Client

try:
    from crypto_verify import verify_ed25519_hex  # type: ignore
except ImportError:
    verify_ed25519_hex = None


def _settlement_hash(payload: Dict[str, Any]) -> bytes:
    canonical = json.dumps(payload, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(canonical.encode()).digest()


class SettlementSubmitBody(BaseModel):
    operations: List[Dict[str, Any]]
    signer: str = Field(..., description="32-byte hex account id")
    signature: str = Field(..., description="64-byte hex Ed25519 signature over operations JSON")
    settlement_meta: Optional[Dict[str, Any]] = None


async def handle_settlement_submit(
    request: Request,
    body: SettlementSubmitBody,
    x_api_key: Optional[str] = Header(None, alias="X-API-Key"),
    x_signature: Optional[str] = Header(None, alias="X-Signature"),
) -> Dict[str, Any]:
    l1_pubkey = os.getenv("L1_PUBLIC_KEY", "")
    meta = body.settlement_meta or {}
    settlement_digest = _settlement_hash(
        {"operations": body.operations, "signer": body.signer, "meta": meta}
    )

    if x_signature:
        if not l1_pubkey:
            raise HTTPException(
                status_code=503,
                detail="L1_PUBLIC_KEY not configured for settlement signature verify",
            )
        ok = _verify_settlement_sig(settlement_digest, x_signature, l1_pubkey)
        if not ok:
            raise HTTPException(status_code=401, detail="Invalid X-Signature on settlement hash")

    l1_url = os.getenv("L1_RPC_URL", "http://127.0.0.1:9944")
    client = TroptionsL1Client(l1_url)
    tx = {
        "operations": body.operations,
        "signer": body.signer,
        "signature": body.signature,
    }
    try:
        result = client.call("submit_transaction", tx)
    except L1ClientError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return {
        "status": "submitted",
        "settlement_hash": settlement_digest.hex(),
        "l1": result,
    }


def _verify_settlement_sig(digest: bytes, sig_hex: str, pubkey_hex: str) -> bool:
    try:
        from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey

        pk = bytes.fromhex(pubkey_hex.replace("0x", ""))
        sig = bytes.fromhex(sig_hex.replace("0x", ""))
        if len(pk) != 32 or len(sig) != 64:
            return False
        Ed25519PublicKey.from_public_bytes(pk).verify(sig, digest)
        return True
    except Exception:
        return False
