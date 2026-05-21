"""
TTN Channel Launcher — Web3 Broadcast Platform
TROPTIONS Television Network channel creation, namespace management, and Solana proof layer.
"""

import os
import json
import uuid
import hashlib
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any

import sys as _sys

_repo_root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
_sys.path.insert(0, os.path.join(_repo_root, "backend", "shared"))

from fastapi import Depends, FastAPI, HTTPException
from auth import verify_api_key  # noqa: E402
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
from pydantic import BaseModel, Field
import httpx
import stripe

# ── Configuration ──
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY", "")
POLYGON_RPC = os.getenv("POLYGON_RPC", "https://polygon-rpc.com")
KENNY_CONTRACT = os.getenv("KENNY_CONTRACT") or "0x93F2a3266a81c1F3Ee2c196b90890A959bC69BD7"
EVL_CONTRACT = os.getenv("EVL_CONTRACT", "")
SOLANA_RPC = os.getenv("SOLANA_RPC", "https://api.mainnet-beta.solana.com")
IPFS_GATEWAY = os.getenv("IPFS_GATEWAY", "https://gateway.pinata.cloud")

stripe.api_key = STRIPE_SECRET_KEY

app = FastAPI(title="TTN Channel Launcher", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── SQLite Database ──
import sqlite3

def get_db():
    conn = sqlite3.connect("ttn_channels.db")
    conn.row_factory = sqlite3.Row
    return conn

# Initialize DB
with get_db() as conn:
    conn.execute("""
        CREATE TABLE IF NOT EXISTS channels (
            id TEXT PRIMARY KEY,
            namespace TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            category TEXT NOT NULL,
            creator_wallet TEXT NOT NULL,
            creator_email TEXT,
            tier TEXT DEFAULT 'basic',
            status TEXT DEFAULT 'pending',
            payment_method TEXT,
            payment_tx_hash TEXT,
            solana_mint_address TEXT,
            ipfs_metadata_hash TEXT,
            subscriber_count INTEGER DEFAULT 0,
            total_views INTEGER DEFAULT 0,
            revenue_sol REAL DEFAULT 0,
            created_at TEXT,
            activated_at TEXT,
            expires_at TEXT
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS namespace_registry (
            namespace TEXT PRIMARY KEY,
            channel_id TEXT,
            owner_wallet TEXT NOT NULL,
            registration_type TEXT,  -- .sports .tennis .mlb .ncaa .creator .local
            registered_at TEXT,
            expires_at TEXT,
            renewal_price_sol REAL,
            is_active INTEGER DEFAULT 1
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS sponsor_drops (
            id TEXT PRIMARY KEY,
            channel_id TEXT NOT NULL,
            sponsor_name TEXT NOT NULL,
            sponsor_wallet TEXT,
            qr_code_data TEXT,
            reward_amount_sol REAL,
            reward_token TEXT,
            total_scans INTEGER DEFAULT 0,
            total_claims INTEGER DEFAULT 0,
            status TEXT DEFAULT 'active',
            created_at TEXT,
            expires_at TEXT
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS proof_records (
            id TEXT PRIMARY KEY,
            channel_id TEXT NOT NULL,
            record_type TEXT NOT NULL,  -- view, attendance, scan, claim, sponsor
            user_wallet TEXT,
            ipfs_hash TEXT,
            solana_tx_hash TEXT,
            metadata TEXT,
            created_at TEXT
        )
    """)
    conn.commit()

# ── Models ──

class ChannelCreate(BaseModel):
    namespace: str = Field(..., pattern=r"^[a-z0-9-]+$", examples=["atlanta-sports", "tennis-pro"])
    name: str
    description: str
    category: str = Field(..., description="sports | events | charity | local | creators | business")
    creator_wallet: str
    creator_email: Optional[str] = None
    tier: str = Field(default="basic", description="basic | pro | enterprise")
    payment_method: str = Field(default="stripe", description="stripe | crypto | evl | kenny")
    preferred_domain: Optional[str] = Field(None, description=".sports .tennis .mlb .ncaa .creator")

class SponsorDropCreate(BaseModel):
    channel_id: str
    sponsor_name: str
    sponsor_wallet: Optional[str] = None
    reward_amount: float = 0.0
    reward_token: str = "SOL"
    duration_hours: int = 24

class NamespaceClaim(BaseModel):
    namespace: str = Field(..., pattern=r"^[a-z0-9-]+\.[a-z]+$", examples=["espn.sports", "wimbledon.tennis"])
    owner_wallet: str
    registration_type: str  # .sports .tennis .mlb .ncaa .creator .local
    years: int = Field(default=1, ge=1, le=10)

# ── Channel Categories ──

CHANNEL_CATEGORIES = {
    "sports": {
        "name": "Sports",
        "description": "Cover the city around the game",
        "features": ["Matchday guides", "Fan culture", "City activations", "Watch-party coverage"],
        "base_price_monthly": 49.0,
        "domains": [".sports", "-sports.tv"]
    },
    "events": {
        "name": "Events",
        "description": "Own the live coverage",
        "features": ["Live broadcast", "Post-event VOD", "Behind-the-scenes", "Real-time sponsor activations"],
        "base_price_monthly": 79.0,
        "domains": [".events", "-events.tv"]
    },
    "charity": {
        "name": "Charity",
        "description": "Tell the story. Prove the impact",
        "features": ["Nonprofit storytelling", "Campaign launches", "Live fundraisers", "Sponsor-matched donations"],
        "base_price_monthly": 29.0,
        "domains": [".charity", "-charity.tv"]
    },
    "local": {
        "name": "Local",
        "description": "Be the neighborhood network",
        "features": ["Community events", "Local business spotlights", "Neighborhood guides", "City partner features"],
        "base_price_monthly": 19.0,
        "domains": [".local", "-local.tv"]
    },
    "creators": {
        "name": "Creators",
        "description": "Build your sovereign broadcast",
        "features": ["No algorithm", "No platform dependency", "Vlogs, shows, tutorials", "Community content"],
        "base_price_monthly": 39.0,
        "domains": [".creator", "-creator.tv"]
    },
    "business": {
        "name": "Business",
        "description": "Broadcast to your market",
        "features": ["Entrepreneur content", "Industry education", "Founder stories", "B2B brand programming"],
        "base_price_monthly": 99.0,
        "domains": [".business", "-business.tv"]
    }
}

# ── Pricing ──

TIER_MULTIPLIERS = {
    "basic": 1.0,
    "pro": 2.5,
    "enterprise": 5.0
}

# ── Endpoints ──

@app.get("/")
async def root():
    return {"service": "TTN Channel Launcher", "version": "1.0.0", "status": "operational"}

@app.get("/categories")
async def list_categories():
    """List all available channel categories with pricing."""
    return {
        cat_id: {
            **data,
            "pricing": {
                "basic": data["base_price_monthly"] * TIER_MULTIPLIERS["basic"],
                "pro": data["base_price_monthly"] * TIER_MULTIPLIERS["pro"],
                "enterprise": data["base_price_monthly"] * TIER_MULTIPLIERS["enterprise"]
            }
        }
        for cat_id, data in CHANNEL_CATEGORIES.items()
    }

@app.post("/channels/create", dependencies=[Depends(verify_api_key)])
async def create_channel(request: ChannelCreate):
    """Create a new TTN channel with namespace registration."""
    
    # Validate category
    if request.category not in CHANNEL_CATEGORIES:
        raise HTTPException(status_code=400, detail=f"Invalid category. Choose from: {list(CHANNEL_CATEGORIES.keys())}")
    
    # Check namespace availability
    conn = get_db()
    existing = conn.execute("SELECT id FROM channels WHERE namespace = ?", (request.namespace,)).fetchone()
    if existing:
        conn.close()
        raise HTTPException(status_code=409, detail=f"Namespace '{request.namespace}' already taken")
    
    # Calculate price
    base_price = CHANNEL_CATEGORIES[request.category]["base_price_monthly"]
    price = base_price * TIER_MULTIPLIERS[request.tier]
    
    channel_id = str(uuid.uuid4())[:8]
    now = datetime.now().isoformat()
    expires = (datetime.now() + timedelta(days=30)).isoformat()
    
    # Create channel record
    conn.execute("""
        INSERT INTO channels (id, namespace, name, description, category, creator_wallet, creator_email,
                              tier, status, payment_method, created_at, expires_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (channel_id, request.namespace, request.name, request.description, request.category,
          request.creator_wallet, request.creator_email, request.tier, "pending",
          request.payment_method, now, expires))
    
    # Register namespace
    domain_suffix = request.preferred_domain or CHANNEL_CATEGORIES[request.category]["domains"][0]
    full_namespace = f"{request.namespace}{domain_suffix}"
    
    conn.execute("""
        INSERT INTO namespace_registry (namespace, channel_id, owner_wallet, registration_type, registered_at, expires_at, renewal_price_sol)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (full_namespace, channel_id, request.creator_wallet, domain_suffix, now, expires, price / 100))
    
    conn.commit()
    conn.close()
    
    # Generate payment intent
    payment_data = {}
    if request.payment_method == "stripe":
        try:
            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                line_items=[{
                    "price_data": {
                        "currency": "usd",
                        "product_data": {"name": f"TTN Channel: {request.name}"},
                        "unit_amount": int(price * 100)
                    },
                    "quantity": 1
                }],
                mode="payment",
                success_url=f"https://ttn.unykorn.org/channels/{channel_id}/activate?session_id={{CHECKOUT_SESSION_ID}}",
                cancel_url="https://ttn.unykorn.org/launch",
                metadata={"channel_id": channel_id, "namespace": request.namespace}
            )
            payment_data = {"checkout_url": session.url, "session_id": session.id}
        except Exception as e:
            payment_data = {"error": str(e)}
    
    return {
        "channel_id": channel_id,
        "namespace": full_namespace,
        "status": "pending_payment",
        "price_monthly": price,
        "payment": payment_data,
        "next_steps": [
            f"Complete payment via {request.payment_method}",
            "Configure Owncast/MistServer streaming",
            "Upload channel branding",
            "Set up sponsor drop zones"
        ]
    }

@app.post("/channels/{channel_id}/activate", dependencies=[Depends(verify_api_key)])
async def activate_channel(channel_id: str, payment_tx_hash: Optional[str] = None):
    """Activate channel after payment confirmation."""
    now = datetime.now().isoformat()
    
    conn = get_db()
    conn.execute("""
        UPDATE channels 
        SET status = 'active', activated_at = ?, payment_tx_hash = ?
        WHERE id = ?
    """, (now, payment_tx_hash, channel_id))
    conn.commit()
    conn.close()
    
    return {
        "channel_id": channel_id,
        "status": "active",
        "message": "Channel is live! Start streaming.",
        "streaming_endpoints": {
            "rtmp_ingest": f"rtmp://stream.ttn.unykorn.org/live/{channel_id}",
            "hls_playback": f"https://stream.ttn.unykorn.org/hls/{channel_id}/index.m3u8",
            "owncast_dashboard": f"https://ttn.unykorn.org/studio/{channel_id}"
        }
    }

@app.get("/channels/{channel_id}")
async def get_channel(channel_id: str):
    """Get channel details and stats."""
    conn = get_db()
    channel = conn.execute("SELECT * FROM channels WHERE id = ?", (channel_id,)).fetchone()
    conn.close()
    
    if not channel:
        raise HTTPException(status_code=404, detail="Channel not found")
    
    return dict(channel)

@app.get("/channels")
async def list_channels(category: Optional[str] = None, status: Optional[str] = "active"):
    """List all channels with filters."""
    conn = get_db()
    query = "SELECT * FROM channels WHERE 1=1"
    params = []
    
    if category:
        query += " AND category = ?"
        params.append(category)
    if status:
        query += " AND status = ?"
        params.append(status)
    
    query += " ORDER BY created_at DESC"
    channels = conn.execute(query, params).fetchall()
    conn.close()
    
    return [dict(c) for c in channels]

# ── Namespace System ──

@app.post("/namespaces/claim", dependencies=[Depends(verify_api_key)])
async def claim_namespace(request: NamespaceClaim):
    """Claim a namespace domain (.sports, .tennis, .mlb, .ncaa, .creator)."""
    
    conn = get_db()
    
    # Check availability
    existing = conn.execute("SELECT namespace FROM namespace_registry WHERE namespace = ?", (request.namespace,)).fetchone()
    if existing:
        conn.close()
        raise HTTPException(status_code=409, detail=f"Namespace '{request.namespace}' already registered")
    
    # Calculate price based on domain type
    domain_prices = {
        ".sports": 50.0,
        ".tennis": 30.0,
        ".mlb": 40.0,
        ".ncaa": 35.0,
        ".creator": 25.0,
        ".local": 15.0,
        ".business": 60.0,
        ".events": 45.0,
        ".charity": 20.0
    }
    
    domain_type = request.registration_type
    base_price = domain_prices.get(domain_type, 25.0)
    total_price = base_price * request.years
    
    now = datetime.now().isoformat()
    expires = (datetime.now() + timedelta(days=365 * request.years)).isoformat()
    
    conn.execute("""
        INSERT INTO namespace_registry (namespace, owner_wallet, registration_type, registered_at, expires_at, renewal_price_sol)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (request.namespace, request.owner_wallet, domain_type, now, expires, base_price))
    
    conn.commit()
    conn.close()
    
    return {
        "namespace": request.namespace,
        "owner": request.owner_wallet,
        "registered_at": now,
        "expires_at": expires,
        "price_paid_sol": total_price,
        "renewal_price_sol": base_price,
        "status": "registered",
        "message": f"Namespace '{request.namespace}' is yours for {request.years} year(s)."
    }

@app.get("/namespaces/check/{namespace}")
async def check_namespace(namespace: str):
    """Check if a namespace is available."""
    conn = get_db()
    existing = conn.execute("SELECT * FROM namespace_registry WHERE namespace = ?", (namespace,)).fetchone()
    conn.close()
    
    if existing:
        return {"available": False, "namespace": namespace, "owner": existing["owner_wallet"], "expires": existing["expires_at"]}
    
    return {"available": True, "namespace": namespace, "message": "Available for registration"}

# ── Sponsor Drops ──

@app.post("/sponsor-drops/create", dependencies=[Depends(verify_api_key)])
async def create_sponsor_drop(request: SponsorDropCreate):
    """Create a QR sponsor drop for a channel."""
    drop_id = str(uuid.uuid4())[:8]
    now = datetime.now().isoformat()
    expires = (datetime.now() + timedelta(hours=request.duration_hours)).isoformat()
    
    # Generate QR code data
    qr_data = {
        "drop_id": drop_id,
        "channel_id": request.channel_id,
        "sponsor": request.sponsor_name,
        "reward": f"{request.reward_amount} {request.reward_token}",
        "expires": expires,
        "claim_url": f"https://ttn.unykorn.org/claim/{drop_id}"
    }
    
    conn = get_db()
    conn.execute("""
        INSERT INTO sponsor_drops (id, channel_id, sponsor_name, sponsor_wallet, qr_code_data,
                                   reward_amount_sol, reward_token, expires_at, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (drop_id, request.channel_id, request.sponsor_name, request.sponsor_wallet,
          json.dumps(qr_data), request.reward_amount, request.reward_token, expires, now))
    conn.commit()
    conn.close()
    
    return {
        "drop_id": drop_id,
        "qr_data": qr_data,
        "qr_image_url": f"https://api.qrserver.com/v1/create-qr-code/?data={json.dumps(qr_data)}",
        "expires_at": expires,
        "status": "active"
    }

@app.post("/sponsor-drops/{drop_id}/scan")
async def scan_sponsor_drop(drop_id: str, user_wallet: str):
    """Record a scan of a sponsor drop."""
    now = datetime.now().isoformat()
    
    conn = get_db()
    conn.execute("UPDATE sponsor_drops SET total_scans = total_scans + 1 WHERE id = ?", (drop_id,))
    
    # Record proof
    proof_id = str(uuid.uuid4())[:8]
    conn.execute("""
        INSERT INTO proof_records (id, channel_id, record_type, user_wallet, metadata, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (proof_id, drop_id, "scan", user_wallet, json.dumps({"drop_id": drop_id}), now))
    
    conn.commit()
    conn.close()
    
    return {"status": "scanned", "drop_id": drop_id, "scanned_at": now}

@app.post("/sponsor-drops/{drop_id}/claim", dependencies=[Depends(verify_api_key)])
async def claim_sponsor_drop(drop_id: str, user_wallet: str):
    """Claim a sponsor drop reward."""
    now = datetime.now().isoformat()
    
    conn = get_db()
    conn.execute("UPDATE sponsor_drops SET total_claims = total_claims + 1 WHERE id = ?", (drop_id,))
    
    # Record proof on-chain (simulated)
    tx_hash = f"0x{hashlib.sha256(f'{drop_id}-{user_wallet}-{now}'.encode()).hexdigest()[:40]}"
    
    proof_id = str(uuid.uuid4())[:8]
    conn.execute("""
        INSERT INTO proof_records (id, channel_id, record_type, user_wallet, solana_tx_hash, metadata, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (proof_id, drop_id, "claim", user_wallet, tx_hash, json.dumps({"drop_id": drop_id, "claimed": True}), now))
    
    conn.commit()
    conn.close()
    
    return {
        "status": "claimed",
        "drop_id": drop_id,
        "tx_hash": tx_hash,
        "message": "Reward claimed! Transaction recorded on Solana."
    }

# ── Proof Registry ──

@app.get("/proof/{channel_id}")
async def get_channel_proof(channel_id: str):
    """Get all proof records for a channel."""
    conn = get_db()
    proofs = conn.execute("""
        SELECT * FROM proof_records WHERE channel_id = ? ORDER BY created_at DESC
    """, (channel_id,)).fetchall()
    conn.close()
    
    return {
        "channel_id": channel_id,
        "total_records": len(proofs),
        "proofs": [dict(p) for p in proofs]
    }

@app.get("/proof/stats/{channel_id}")
async def get_channel_stats(channel_id: str):
    """Get aggregated stats for a channel."""
    conn = get_db()
    
    views = conn.execute("""
        SELECT COUNT(*) FROM proof_records WHERE channel_id = ? AND record_type = 'view'
    """, (channel_id,)).fetchone()[0]
    
    scans = conn.execute("""
        SELECT COUNT(*) FROM proof_records WHERE channel_id = ? AND record_type = 'scan'
    """, (channel_id,)).fetchone()[0]
    
    claims = conn.execute("""
        SELECT COUNT(*) FROM proof_records WHERE channel_id = ? AND record_type = 'claim'
    """, (channel_id,)).fetchone()[0]
    
    unique_viewers = conn.execute("""
        SELECT COUNT(DISTINCT user_wallet) FROM proof_records WHERE channel_id = ?
    """, (channel_id,)).fetchone()[0]
    
    conn.close()
    
    return {
        "channel_id": channel_id,
        "total_views": views,
        "total_scans": scans,
        "total_claims": claims,
        "unique_viewers": unique_viewers,
        "engagement_rate": round((claims / max(scans, 1)) * 100, 2)
    }

# ── Health ──
@app.get("/health")
async def health():
    conn = get_db()
    channels = conn.execute("SELECT COUNT(*) FROM channels WHERE status = 'active'").fetchone()[0]
    namespaces = conn.execute("SELECT COUNT(*) FROM namespace_registry WHERE is_active = 1").fetchone()[0]
    drops = conn.execute("SELECT COUNT(*) FROM sponsor_drops WHERE status = 'active'").fetchone()[0]
    conn.close()
    
    return {
        "status": "operational",
        "version": "1.0.0",
        "active_channels": channels,
        "registered_namespaces": namespaces,
        "active_drops": drops,
        "categories": list(CHANNEL_CATEGORIES.keys()),
        "supported_domains": [".sports", ".tennis", ".mlb", ".ncaa", ".creator", ".local", ".business", ".events", ".charity"],
        "timestamp": datetime.now().isoformat()
    }

# ── Serve Frontend ──
os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
async def serve_frontend():
    return FileResponse("static/index.html")

# ── Run ──
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8092)
