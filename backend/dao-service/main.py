"""TROPTIONS DAO Service — port 8093, WebSocket hub, L1-backed governance."""

from __future__ import annotations

import asyncio
import os
import sys
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

load_dotenv()

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend" / "fth-academy"))
sys.path.insert(0, str(ROOT / "backend" / "shared"))
sys.path.insert(0, str(ROOT / "dao"))
sys.path.insert(0, str(ROOT))

from dao_db import init_dao_db, list_audit  # noqa: E402
from ws_hub import dao_ws_hub  # noqa: E402

from governance.engine import GovernanceEngine  # noqa: E402
from registry.members import MemberRegistry  # noqa: E402
from treasury.view import TreasuryView  # noqa: E402

L1_RPC_URL = os.getenv("L1_RPC_URL", "http://127.0.0.1:9944")
DAO_PORT = int(os.getenv("DAO_PORT", "8093"))

STATIC_DIR = ROOT / "frontends" / "dao-dashboard"


class ProposalBody(BaseModel):
    proposer: str
    title: str
    description: str
    action_uri: Optional[str] = None


class VoteBody(BaseModel):
    proposal_id: str
    voter: str
    choice: str = "for"


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_dao_db()
    asyncio.create_task(_poll_l1())
    yield


async def _poll_l1():
    engine = GovernanceEngine(L1_RPC_URL)
    while True:
        try:
            state = engine.state()
            await dao_ws_hub.broadcast("l1_state", state.get("l1", {}))
        except Exception:
            pass
        await asyncio.sleep(5)


app = FastAPI(title="TROPTIONS DAO", version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = GovernanceEngine(L1_RPC_URL)
treasury = TreasuryView()
registry = MemberRegistry(L1_RPC_URL)


@app.get("/health")
async def health():
    state = engine.state()
    return {
        "status": "operational",
        "service": "dao",
        "port": DAO_PORT,
        "l1_reachable": state.get("l1", {}).get("block_height") is not None,
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


@app.post("/dao/proposals")
async def create_proposal(body: ProposalBody):
    try:
        result = engine.create_proposal(
            body.proposer, body.title, body.description, body.action_uri
        )
        await dao_ws_hub.broadcast("proposal_created", result)
        return result
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.post("/dao/proposals/vote")
async def vote_proposal(body: VoteBody):
    try:
        result = engine.vote(body.proposal_id, body.voter, body.choice)
        await dao_ws_hub.broadcast("proposal_voted", result)
        return result
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.post("/dao/proposals/{proposal_id}/finalize")
async def finalize_proposal(proposal_id: str):
    return engine.finalize(proposal_id)


@app.post("/dao/proposals/{proposal_id}/execute")
async def execute_proposal(proposal_id: str):
    return engine.execute(proposal_id)


@app.get("/dao/treasury")
async def dao_treasury():
    return treasury.overview()


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
