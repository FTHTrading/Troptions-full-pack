"""TROPTIONS DAO Service — port 8093, WebSocket hub, L1-backed governance."""

from __future__ import annotations

import asyncio
import os
import sys
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Header, HTTPException, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

load_dotenv()

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend" / "fth-academy"))
sys.path.insert(0, str(ROOT / "backend" / "shared"))
sys.path.insert(0, str(ROOT / "dao"))
sys.path.insert(0, str(ROOT))

from auth import verify_api_key  # noqa: E402
from dao_db import init_dao_db, list_audit  # noqa: E402
from ws_hub import dao_ws_hub  # noqa: E402

from governance.engine import GovernanceEngine  # noqa: E402
from registry.members import MemberRegistry  # noqa: E402
from treasury.view import TreasuryView  # noqa: E402
from settlement_api import SettlementSubmitBody, handle_settlement_submit  # noqa: E402
from agent_client import startup_registration  # noqa: E402
from telecom_router import router as telecom_router  # noqa: E402
from workers_ai_router import router as workers_ai_router  # noqa: E402
from x402_middleware import X402Middleware  # noqa: E402

L1_RPC_URL = os.getenv("L1_RPC_URL", "http://127.0.0.1:9944")
DAO_PORT = int(os.getenv("DAO_PORT", "8093"))

STATIC_DIR = ROOT / "frontends" / "dao-dashboard"

limiter = Limiter(key_func=get_remote_address)


class ProposalBody(BaseModel):
    proposer: str
    title: str
    description: str
    action_uri: Optional[str] = None
    signature: Optional[str] = None


class VoteBody(BaseModel):
    proposal_id: str
    voter: str
    choice: str = "for"
    signature: Optional[str] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_dao_db()
    app.state.agent_registration = await startup_registration()
    await treasury.start_polling(10.0)
    asyncio.create_task(_poll_l1())
    yield


async def _poll_l1():
    eng = GovernanceEngine(L1_RPC_URL)
    while True:
        try:
            state = eng.state()
            await dao_ws_hub.broadcast("l1_state", state.get("l1", {}))
        except Exception:
            pass
        await asyncio.sleep(5)


app = FastAPI(title="TROPTIONS DAO", version="1.1.0", lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(
    X402Middleware,
    service_name="troptions-dao",
    price_atp=os.getenv("DAO_PROPOSAL_FEE_ATP", "10000000000000000000"),
    protected_prefixes=("/dao/proposals", "/settlement/"),
)
app.include_router(telecom_router)
app.include_router(workers_ai_router)

engine = GovernanceEngine(L1_RPC_URL)
treasury = TreasuryView(L1_RPC_URL)
registry = MemberRegistry(L1_RPC_URL)


@app.get("/health")
async def health():
    state = engine.state()
    return {
        "status": "operational",
        "service": "dao",
        "port": DAO_PORT,
        "l1_reachable": state.get("l1", {}).get("block_height") is not None,
        "treasury_source": "l1_cache",
    }


@app.get("/dao/state")
async def dao_state():
    return {
        **engine.state(),
        "treasury": treasury.overview(),
        "members_count": len(registry.list_members()),
    }


@app.get("/dao/proposals")
async def dao_proposals():
    return engine.list_proposals()


@app.get("/dao/proposals/{proposal_id}/votes")
async def dao_proposal_votes(proposal_id: str):
    return engine.get_votes(proposal_id)


@app.post("/dao/proposals", dependencies=[Depends(verify_api_key)])
async def create_proposal(body: ProposalBody):
    try:
        result = engine.create_proposal(
            body.proposer,
            body.title,
            body.description,
            body.action_uri,
            body.signature,
        )
        await dao_ws_hub.broadcast("proposal_created", result)
        return result
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.post("/dao/proposals/vote", dependencies=[Depends(verify_api_key)])
async def vote_proposal(body: VoteBody):
    try:
        result = engine.vote(
            body.proposal_id, body.voter, body.choice, body.signature
        )
        await dao_ws_hub.broadcast("proposal_voted", result)
        return result
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.post("/dao/proposals/{proposal_id}/finalize", dependencies=[Depends(verify_api_key)])
async def finalize_proposal(proposal_id: str):
    return engine.finalize(proposal_id)


@app.post("/dao/proposals/{proposal_id}/execute", dependencies=[Depends(verify_api_key)])
async def execute_proposal(proposal_id: str, executor: Optional[str] = None, signature: Optional[str] = None):
    return engine.execute(proposal_id, executor, signature)


@app.get("/dao/treasury")
async def dao_treasury():
    return treasury.overview()


@app.post("/settlement/submit", dependencies=[Depends(verify_api_key)])
@limiter.limit("10/minute")
async def settlement_submit(
    request: Request,
    body: SettlementSubmitBody,
    x_api_key: Optional[str] = Header(None, alias="X-API-Key"),
    x_signature: Optional[str] = Header(None, alias="X-Signature"),
):
    return await handle_settlement_submit(
        request, body, x_api_key=x_api_key, x_signature=x_signature
    )


@app.get("/dao/members")
async def dao_members():
    return registry.list_members()


@app.get("/dao/credentials/{owner}")
async def dao_credentials(owner: str):
    return registry.credentials_for_owner(owner)


@app.get("/dao/brands")
async def dao_brands():
    return registry.brand_map()


@app.get("/dao/audit")
async def dao_audit():
    return list_audit()


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await dao_ws_hub.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        await dao_ws_hub.disconnect(websocket)


if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

    @app.get("/")
    async def dashboard():
        index = STATIC_DIR / "index.html"
        if index.exists():
            return FileResponse(index)
        return {"message": "DAO API ready", "docs": "/docs"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=DAO_PORT)
