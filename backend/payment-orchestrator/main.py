"""Payment orchestrator stub — fiat/crypto routing (PIPELINE until bank rails wired)."""

from __future__ import annotations

import os

from fastapi import FastAPI

app = FastAPI(title="Payment Orchestrator", version="0.1.0-pipeline")

LABEL = "PIPELINE"
PORT = int(os.getenv("PORT", os.getenv("PAYMENT_ORCHESTRATOR_PORT", "4022")))


@app.get("/health")
async def health():
    return {
        "status": "pipeline",
        "service": "payment-orchestrator",
        "label": LABEL,
        "port": PORT,
        "rails": {
            "msb": "pipeline",
            "fedwire": "pipeline",
            "swift": "pipeline",
            "stripe_academy": "proven_elsewhere",
        },
        "message": "Stub only — FedWire/SWIFT/ACH not connected",
    }


@app.post("/api/banking/deposit")
async def deposit_stub():
    return {"label": LABEL, "result": "not_implemented"}


@app.post("/api/banking/withdraw")
async def withdraw_stub():
    return {"label": LABEL, "result": "not_implemented"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=PORT)
