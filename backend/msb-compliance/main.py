"""MSB compliance engine stub — AML/KYC/OFAC screening (PIPELINE until providers wired)."""

from __future__ import annotations

import os

from fastapi import FastAPI

app = FastAPI(title="MSB Compliance", version="0.1.0-pipeline")

LABEL = "PIPELINE"
PORT = int(os.getenv("PORT", os.getenv("MSB_COMPLIANCE_PORT", "4098")))


@app.get("/health")
async def health():
    return {
        "status": "pipeline",
        "service": "msb-compliance",
        "label": LABEL,
        "port": PORT,
        "message": "Stub only — wire OFAC/KYC providers before production",
    }


@app.post("/api/compliance/screen")
async def screen_stub():
    return {
        "label": LABEL,
        "result": "not_implemented",
        "message": "Compliance screening PIPELINE — connect provider keys in env",
    }


@app.post("/api/compliance/kyc")
async def kyc_stub():
    return {"label": LABEL, "result": "not_implemented"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=PORT)
