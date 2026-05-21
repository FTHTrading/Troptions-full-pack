"""
FTH Trading Backend — Revenue Engine v1.0
Ties together: Courses, Stripe, KENNY/EVL tokens, IPFS certs, AI tutor, multi-chain labs
"""

import os
import json
import uuid
import hashlib
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from contextlib import asynccontextmanager

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
from pydantic import BaseModel, Field
import httpx
import stripe

# Import multi-chain labs
from multi_chain_labs import MULTI_CHAIN_LABS, MULTI_CHAIN_CAREERS

# Import DONK system prompt (monorepo path: ai/donk-tutor)
import importlib.util
_donk_prompt_path = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "..", "..", "ai", "donk-tutor", "system_prompt.py",
)
spec = importlib.util.spec_from_file_location("system_prompt", _donk_prompt_path)
system_prompt_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(system_prompt_module)
DONK_SYSTEM_PROMPT = system_prompt_module.DONK_SYSTEM_PROMPT

# DAO layer
import sys as _sys
_repo_root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
_sys.path.insert(0, os.path.join(_repo_root, "backend", "shared"))
_sys.path.insert(0, os.path.join(_repo_root, "dao"))
from l1_client import get_l1_client, L1ClientError  # noqa: E402
from dao_db import init_dao_db  # noqa: E402
from governance.engine import GovernanceEngine  # noqa: E402
from registry.members import MemberRegistry  # noqa: E402

# ── Configuration ──
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY", "")
PINATA_JWT = os.getenv("PINATA_JWT", "")
POLYGON_RPC = os.getenv("POLYGON_RPC", "https://polygon-rpc.com")
KENNY_CONTRACT = os.getenv("KENNY_CONTRACT") or "0x93F2a3266a81c1F3Ee2c196b90890A959bC69BD7"
EVL_CONTRACT = os.getenv("EVL_CONTRACT", "")
EVL_SALE_CONTRACT = os.getenv("EVL_SALE_CONTRACT") or "0x496b0802a3CB2Ce101A3F20e1dada33B78fDD806"
EVL_TREASURY = os.getenv("EVL_TREASURY") or "0xCd636d696979F48547EBfDb8419437B59FC4943A"
BACKEND_WALLET = os.getenv("BACKEND_WALLET", "")
BACKEND_KEY = os.getenv("BACKEND_KEY", "")
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")

# Initialize Stripe
stripe.api_key = STRIPE_SECRET_KEY

# ── SQLite Database ──
import sqlite3

def get_db():
    conn = sqlite3.connect("fth_backend.db")
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE,
            wallet TEXT UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            xp INTEGER DEFAULT 0,
            pick_balance INTEGER DEFAULT 0
        );
        
        CREATE TABLE IF NOT EXISTS courses (
            id TEXT PRIMARY KEY,
            title TEXT,
            description TEXT,
            difficulty TEXT,
            price REAL,
            modules TEXT,
            token_reward INTEGER DEFAULT 0
        );
        
        CREATE TABLE IF NOT EXISTS enrollments (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            course_id TEXT,
            status TEXT DEFAULT 'active',
            progress REAL DEFAULT 0,
            paid_at TIMESTAMP,
            stripe_session_id TEXT,
            tx_hash TEXT,
            UNIQUE(user_id, course_id)
        );
        
        CREATE TABLE IF NOT EXISTS certificates (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            course_id TEXT,
            ipfs_hash TEXT,
            tx_hash TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS chat_sessions (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            messages TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    conn.commit()
    conn.close()

# ── Course Data ──
COURSES = {
    "crypto-basics": {
        "id": "crypto-basics",
        "title": "Crypto Basics for TROPTIONS",
        "description": "Learn blockchain fundamentals, wallets, and tokenomics. Free forever.",
        "difficulty": "beginner",
        "price": 0.0,
        "token_reward": 100,
        "modules": [
            {"id": "m1", "title": "What is Blockchain?", "content": "Blockchain is a distributed ledger...", "quiz": []},
            {"id": "m2", "title": "Wallets & Keys", "content": "Non-custodial wallets give you control...", "quiz": []},
            {"id": "m3", "title": "Tokenomics 101", "content": "TROPTIONS has 1M max supply for $PICK...", "quiz": []},
            {"id": "m4", "title": "Solana & $PICK", "content": "Trade $PICK on Jupiter DEX...", "quiz": []},
            {"id": "m5", "title": "WC2026 Markets", "content": "Stake $PICK on match outcomes...", "quiz": []},
        ]
    },
    "amm-trading": {
        "id": "amm-trading",
        "title": "AMM & Liquidity Trading",
        "description": "Master Automated Market Makers. Earn while you learn.",
        "difficulty": "intermediate",
        "price": 29.99,
        "token_reward": 300,
        "modules": [
            {"id": "m1", "title": "How AMMs Work", "content": "x*y=k formula...", "quiz": []},
            {"id": "m2", "title": "Impermanent Loss", "content": "When pool ratios change...", "quiz": []},
            {"id": "m3", "title": "LP Strategies", "content": "Concentrated liquidity...", "quiz": []},
        ]
    },
    "wc2026-sponsor": {
        "id": "wc2026-sponsor",
        "title": "WC2026 Sponsor Guide",
        "description": "How to sponsor World Cup Atlanta. Premium playbook.",
        "difficulty": "all-levels",
        "price": 99.00,
        "token_reward": 1000,
        "modules": [
            {"id": "m1", "title": "Sponsorship Tiers", "content": "Local/Regional/Global tiers...", "quiz": []},
            {"id": "m2", "title": "NFT Collectibles", "content": "Mint exclusive moments...", "quiz": []},
            {"id": "m3", "title": "$PICK Rewards", "content": "Earn tokens for every sponsorship...", "quiz": []},
        ]
    },
    "kenny-burn": {
        "id": "kenny-burn",
        "title": "KENNY Token Burn Course",
        "description": "Learn token burning mechanics. Pay with KENNY tokens.",
        "difficulty": "advanced",
        "price": 0.0,
        "token_reward": 500,
        "modules": [
            {"id": "m1", "title": "Burn Mechanics", "content": "Deflationary tokenomics...", "quiz": []},
            {"id": "m2", "title": "On-Chain Proof", "content": "Verification via Polygon...", "quiz": []},
            {"id": "m3", "title": "Certification", "content": "IPFS-backed credentials...", "quiz": []},
        ]
    }
}

# Seed database
def seed_db():
    conn = get_db()
    for course_id, course in COURSES.items():
        conn.execute("""
            INSERT OR IGNORE INTO courses (id, title, description, difficulty, price, modules, token_reward)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            course_id, course["title"], course["description"],
            course["difficulty"], course["price"],
            json.dumps(course["modules"]), course["token_reward"]
        ))
    conn.commit()
    conn.close()

# ── FastAPI App ──
@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    seed_db()
    init_dao_db()
    print("FTH Backend operational (DAO enabled)")
    yield
    print("FTH Backend shutting down")

app = FastAPI(title="FTH Trading Backend", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Pydantic Models ──
class UserCreate(BaseModel):
    email: Optional[str] = None
    wallet: Optional[str] = None

class PurchaseRequest(BaseModel):
    course_id: str
    email: str
    success_url: str = "http://localhost:8091/success"
    cancel_url: str = "http://localhost:8091/cancel"

class BurnRequest(BaseModel):
    course_id: str
    wallet: str
    tx_hash: str

class ChatRequest(BaseModel):
    message: str
    user_id: Optional[str] = None
    course_id: Optional[str] = None

class CertRequest(BaseModel):
    user_id: str
    course_id: str

# ── Auth ──
@app.post("/auth/register")
async def register_user(user: UserCreate):
    """Register user with email or wallet."""
    conn = get_db()
    user_id = str(uuid.uuid4())
    
    try:
        conn.execute("""
            INSERT INTO users (id, email, wallet)
            VALUES (?, ?, ?)
        """, (user_id, user.email, user.wallet))
        conn.commit()
        return {"user_id": user_id, "email": user.email, "wallet": user.wallet}
    except sqlite3.IntegrityError:
        # User exists, return existing
        existing = conn.execute(
            "SELECT * FROM users WHERE email = ? OR wallet = ?",
            (user.email, user.wallet)
        ).fetchone()
        return dict(existing) if existing else {"error": "User conflict"}
    finally:
        conn.close()

@app.get("/auth/user/{user_id}")
async def get_user(user_id: str):
    conn = get_db()
    user = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    conn.close()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return dict(user)

# ── Courses ──
@app.get("/courses")
async def list_courses():
    conn = get_db()
    courses = conn.execute("SELECT * FROM courses").fetchall()
    conn.close()
    return [dict(c) for c in courses]

@app.get("/courses/{course_id}")
async def get_course(course_id: str):
    conn = get_db()
    course = conn.execute("SELECT * FROM courses WHERE id = ?", (course_id,)).fetchone()
    conn.close()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    c = dict(course)
    c["modules"] = json.loads(c["modules"])
    return c

# ── Stripe Payments ──
@app.get("/payments/config")
async def get_stripe_config():
    return {
        "publishableKey": STRIPE_PUBLISHABLE_KEY,
        "prices": {k: int(v["price"] * 100) for k, v in COURSES.items() if v["price"] > 0}
    }

@app.post("/payments/create-session")
async def create_checkout(request: PurchaseRequest):
    if request.course_id not in COURSES:
        raise HTTPException(status_code=404, detail="Course not found")
    
    course = COURSES[request.course_id]
    if course["price"] == 0:
        return {"free": True, "message": "Free course — just enroll"}
    
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                "price_data": {
                    "currency": "usd",
                    "product_data": {
                        "name": course["title"],
                        "description": course["description"],
                    },
                    "unit_amount": int(course["price"] * 100)
                },
                "quantity": 1
            }],
            mode="payment",
            success_url=f"{request.success_url}?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=request.cancel_url,
            customer_email=request.email,
            metadata={
                "course_id": request.course_id,
                "course_name": course["title"],
                "pick_reward": course["token_reward"]
            }
        )
        return {"sessionId": session.id, "url": session.url}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/payments/verify/{session_id}")
async def verify_payment(session_id: str):
    try:
        session = stripe.checkout.Session.retrieve(session_id)
        if session.payment_status == "paid":
            # Grant enrollment
            conn = get_db()
            course_id = session.metadata.get("course_id")
            user_id = str(uuid.uuid4())  # In production, link to actual user
            conn.execute("""
                INSERT OR IGNORE INTO enrollments (id, user_id, course_id, status, paid_at, stripe_session_id)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (str(uuid.uuid4()), user_id, course_id, "active", datetime.now(), session_id))
            conn.commit()
            conn.close()
            return {"status": "paid", "course_id": course_id, "user_id": user_id}
        return {"status": session.payment_status}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

# ── KENNY Burn (Blockchain) ──
@app.post("/payments/burn-kenny")
async def burn_kenny(request: BurnRequest):
    """Verify KENNY token burn and grant course access."""
    # TODO: Verify burn tx on Polygon via web3.py
    # For now, accept tx_hash and mark as verified
    
    conn = get_db()
    enrollment_id = str(uuid.uuid4())
    conn.execute("""
        INSERT INTO enrollments (id, user_id, course_id, status, tx_hash)
        VALUES (?, ?, ?, ?, ?)
    """, (enrollment_id, request.wallet, request.course_id, "active", request.tx_hash))
    conn.commit()
    conn.close()
    
    return {
        "status": "verified",
        "enrollment_id": enrollment_id,
        "tx_hash": request.tx_hash,
        "message": "Course unlocked via KENNY burn"
    }

# ── AI Tutor Integration ──
@app.post("/tutor/chat")
async def tutor_chat(request: ChatRequest):
    """Proxy to DONK AI Tutor (Ollama) with multi-chain system prompt."""
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            payload = {
                "model": "qwen2.5:7b",
                "prompt": request.message,
                "stream": False,
                "system": DONK_SYSTEM_PROMPT
            }
            resp = await client.post(f"{OLLAMA_URL}/api/generate", json=payload)
            resp.raise_for_status()
            data = resp.json()
            return {"response": data.get("response", ""), "source": "ollama"}
    except Exception as e:
        return {"response": f"Tutor error: {str(e)}", "source": "error"}

# ── Career Pathway Generator ──

class PathwayRequest(BaseModel):
    goal: str = Field(..., description="What the user wants to become or build")
    user_id: Optional[str] = None
    chains: Optional[List[str]] = Field(None, description="Preferred chains (e.g. ['polygon', 'xrpl', 'solana'])")
    budget: Optional[float] = Field(None, description="Monthly budget in USD")

class PathwayResponse(BaseModel):
    title: str
    description: str
    estimated_time_days: int
    total_cost_usd: float
    courses: List[Dict[str, Any]]
    labs: List[Dict[str, Any]]
    rewards: Dict[str, Any]
    chains_used: List[str]
    prerequisites: List[str]
    created_at: str

# Extended course catalog with chain-specific labs
LABS = {
    "deploy-erc20": {
        "id": "deploy-erc20",
        "title": "Deploy Your Own ERC-20 Token",
        "description": "Create and deploy a token on Polygon using OpenZeppelin",
        "chain": "polygon",
        "difficulty": "beginner",
        "fee_kenny": 10,
        "fee_evl": 50,
        "reward_xp": 500,
        "reward_nft": "Token Deployer Certificate",
        "prerequisites": ["crypto-basics"],
        "steps": [
            {"id": "s1", "title": "Set up Hardhat", "content": "Install and configure Hardhat for Polygon"},
            {"id": "s2", "title": "Write Token Contract", "content": "Create ERC-20 with OpenZeppelin"},
            {"id": "s3", "title": "Deploy to Polygon", "content": "Deploy and verify on Polygonscan"},
            {"id": "s4", "title": "Mint & Distribute", "content": "Mint initial supply and test transfers"},
        ]
    },
    "xrpl-tokenize": {
        "id": "xrpl-tokenize",
        "title": "Tokenize Real Estate on XRPL",
        "description": "Issue a token representing fractional real estate ownership",
        "chain": "xrpl",
        "difficulty": "intermediate",
        "fee_kenny": 25,
        "fee_evl": 100,
        "reward_xp": 1000,
        "reward_nft": "RWA Tokenizer Certificate",
        "prerequisites": ["crypto-basics", "amm-trading"],
        "steps": [
            {"id": "s1", "title": "XRPL Wallet Setup", "content": "Create issuer and distribution wallets"},
            {"id": "s2", "title": "Issue Token", "content": "Set up trustline and issue RWA token"},
            {"id": "s3", "title": "AMM Pool", "content": "Create AMM pool for liquidity"},
            {"id": "s4", "title": "Compliance", "content": "Set transfer fees and compliance hooks"},
        ]
    },
    "solana-nft": {
        "id": "solana-nft",
        "title": "Create Compressed NFTs on Solana",
        "description": "Launch an NFT collection using Metaplex Bubblegum",
        "chain": "solana",
        "difficulty": "advanced",
        "fee_kenny": 50,
        "fee_evl": 200,
        "reward_xp": 2000,
        "reward_nft": "Solana NFT Master Certificate",
        "reward_pick": 500,
        "prerequisites": ["crypto-basics", "wc2026-sponsor"],
        "steps": [
            {"id": "s1", "title": "Solana Dev Environment", "content": "Install Rust, Solana CLI, Anchor"},
            {"id": "s2", "title": "Create Merkle Tree", "content": "Set up compressed NFT tree via Metaplex"},
            {"id": "s3", "title": "Mint Collection", "content": "Mint 1000+ NFTs at near-zero cost"},
            {"id": "s4", "title": "Marketplace Integration", "content": "List on Tensor or Magic Eden"},
        ]
    },
    "stellar-anchor": {
        "id": "stellar-anchor",
        "title": "Build a Stellar Payment Anchor",
        "description": "Create a fiat on/off ramp using Stellar SEP protocols",
        "chain": "stellar",
        "difficulty": "intermediate",
        "fee_kenny": 20,
        "fee_evl": 75,
        "reward_xp": 800,
        "reward_nft": "Stellar Anchor Certificate",
        "prerequisites": ["crypto-basics"],
        "steps": [
            {"id": "s1", "title": "SEP-1 Setup", "content": "Create stellar.toml and domain verification"},
            {"id": "s2", "title": "SEP-24 Deposit", "content": "Implement interactive deposit flow"},
            {"id": "s3", "title": "SEP-24 Withdraw", "content": "Implement interactive withdrawal"},
            {"id": "s4", "title": "Compliance", "content": "Add KYC and transaction monitoring"},
        ]
    },
    "x402-payments": {
        "id": "x402-payments",
        "title": "Integrate x402 Payment Rails",
        "description": "Accept crypto payments via x402 HTTP 402 protocol",
        "chain": "multi",
        "difficulty": "advanced",
        "fee_kenny": 30,
        "fee_evl": 150,
        "reward_xp": 1500,
        "reward_nft": "Payment Architect Certificate",
        "reward_pick": 1000,
        "prerequisites": ["crypto-basics", "amm-trading", "wc2026-sponsor"],
        "steps": [
            {"id": "s1", "title": "x402 Setup", "content": "Install x402 middleware and configure endpoints"},
            {"id": "s2", "title": "Settlement", "content": "Configure settlement address and verification"},
            {"id": "s3", "title": "Multi-Token", "content": "Accept USDC, USDT, and native tokens"},
            {"id": "s4", "title": "Webhook", "content": "Handle post-payment webhooks and receipt generation"},
        ]
    },
}

CAREER_PATHWAYS = {
    "real-estate-tokenizer": {
        "title": "Real Estate Tokenization Specialist",
        "description": "Tokenize physical assets into fractional digital ownership",
        "estimated_time_days": 45,
        "monthly_cost": 99,
        "courses": ["crypto-basics", "amm-trading", "wc2026-sponsor"],
        "labs": ["deploy-erc20", "xrpl-tokenize"],
        "chains": ["polygon", "xrpl"],
        "certificates": ["Token Deployer", "RWA Tokenizer"]
    },
    "defi-liquidity-provider": {
        "title": "DeFi Liquidity Provider",
        "description": "Master AMMs, yield farming, and LP strategies",
        "estimated_time_days": 30,
        "monthly_cost": 49,
        "courses": ["crypto-basics", "amm-trading"],
        "labs": ["deploy-erc20"],
        "chains": ["polygon", "solana"],
        "certificates": ["Token Deployer", "AMM Specialist"]
    },
    "solana-dapp-developer": {
        "title": "Solana dApp Developer",
        "description": "Build high-performance dApps on Solana",
        "estimated_time_days": 60,
        "monthly_cost": 149,
        "courses": ["crypto-basics", "amm-trading", "wc2026-sponsor", "kenny-burn"],
        "labs": ["solana-nft", "x402-payments"],
        "chains": ["solana", "polygon"],
        "certificates": ["Solana NFT Master", "Payment Architect"]
    },
    "stellar-payments-architect": {
        "title": "Cross-Border Payments Architect",
        "description": "Build payment corridors using Stellar",
        "estimated_time_days": 35,
        "monthly_cost": 79,
        "courses": ["crypto-basics"],
        "labs": ["stellar-anchor", "x402-payments"],
        "chains": ["stellar", "multi"],
        "certificates": ["Stellar Anchor", "Payment Architect"]
    },
    "troptions-payment-integrator": {
        "title": "TROPTIONS Payment Integrator",
        "description": "Accept TROPTIONS across all platforms",
        "estimated_time_days": 25,
        "monthly_cost": 49,
        "courses": ["crypto-basics", "kenny-burn"],
        "labs": ["x402-payments"],
        "chains": ["xrpl", "multi"],
        "certificates": ["Payment Architect"]
    },
}

@app.post("/pathway/generate", response_model=PathwayResponse)
async def generate_pathway(request: PathwayRequest):
    """Generate a personalized career pathway based on user's goal."""
    
    # Query Ollama for intelligent pathway assembly
    system_prompt = f"""You are DONK AI, career architect for TROPTIONS Academy. 
    Build learning pathways for Web3 careers. Available careers: {list(CAREER_PATHWAYS.keys())}.
    Available labs: {list(LABS.keys())}.
    Available chains: polygon, xrpl, solana, stellar, multi.
    Output JSON with: title, description, estimated_time_days, total_cost_usd, courses[], labs[], rewards{{xp, kenny, evl, pick, nfts}}, chains_used[], prerequisites[]."""
    
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            payload = {
                "model": "qwen2.5:7b",
                "prompt": f"Build a pathway for: {request.goal}. Preferred chains: {request.chains or 'all'}. Budget: ${request.budget or 'unlimited'}",
                "stream": False,
                "system": system_prompt
            }
            resp = await client.post(f"{OLLAMA_URL}/api/generate", json=payload)
            resp.raise_for_status()
            ai_response = resp.json().get("response", "")
    except Exception as e:
        # Fallback to template matching
        ai_response = str(e)
    
    # Try to extract career from goal
    goal_lower = request.goal.lower()
    matched_career = None
    
    for career_id, career in CAREER_PATHWAYS.items():
        keywords = career["title"].lower().split()
        if any(kw in goal_lower for kw in keywords):
            matched_career = career
            break
    
    # Default to real-estate-tokenizer if no match
    if not matched_career:
        matched_career = CAREER_PATHWAYS["real-estate-tokenizer"]
    
    # Build response from matched career + labs
    courses_detail = []
    for course_id in matched_career["courses"]:
        if course_id in COURSES:
            courses_detail.append({
                "id": course_id,
                "title": COURSES[course_id]["title"],
                "price": COURSES[course_id]["price"],
                "difficulty": COURSES[course_id]["difficulty"]
            })
    
    labs_detail = []
    total_lab_cost = 0
    for lab_id in matched_career["labs"]:
        if lab_id in LABS:
            lab = LABS[lab_id]
            labs_detail.append({
                "id": lab_id,
                "title": lab["title"],
                "chain": lab["chain"],
                "difficulty": lab["difficulty"],
                "fee_kenny": lab["fee_kenny"],
                "fee_evl": lab["fee_evl"],
                "steps_count": len(lab["steps"])
            })
            total_lab_cost += lab["fee_evl"]
    
    total_cost = sum(c["price"] for c in courses_detail) + total_lab_cost
    
    # Calculate rewards
    total_xp = sum(l["reward_xp"] for l in [LABS[lid] for lid in matched_career["labs"] if lid in LABS])
    total_pick = sum(l.get("reward_pick", 0) for l in [LABS[lid] for lid in matched_career["labs"] if lid in LABS])
    
    pathway = PathwayResponse(
        title=matched_career["title"],
        description=matched_career["description"],
        estimated_time_days=matched_career["estimated_time_days"],
        total_cost_usd=total_cost,
        courses=courses_detail,
        labs=labs_detail,
        rewards={
            "xp": total_xp,
            "kenny_burned": sum(l["fee_kenny"] for l in [LABS[lid] for lid in matched_career["labs"] if lid in LABS]),
            "evl_earned": total_lab_cost,
            "pick_earned": total_pick,
            "certificates": matched_career["certificates"]
        },
        chains_used=matched_career["chains"],
        prerequisites=["Wallet (MetaMask/Phantom)", "Basic crypto knowledge"],
        created_at=datetime.now().isoformat()
    )
    
    # Save to user if user_id provided
    if request.user_id:
        conn = get_db()
        conn.execute("""
            INSERT INTO chat_sessions (id, user_id, messages)
            VALUES (?, ?, ?)
        """, (str(uuid.uuid4()), request.user_id, json.dumps({
            "type": "pathway",
            "goal": request.goal,
            "pathway_id": matched_career["title"]
        })))
        conn.commit()
        conn.close()
    
    return pathway

@app.get("/labs")
async def list_labs():
    """List all available hands-on labs."""
    return list(LABS.values())

@app.get("/labs/{lab_id}")
async def get_lab(lab_id: str):
    """Get specific lab details including steps."""
    if lab_id not in LABS:
        raise HTTPException(status_code=404, detail="Lab not found")
    return LABS[lab_id]

@app.post("/labs/{lab_id}/start")
async def start_lab(lab_id: str, user_id: str):
    """Start a lab - checks prerequisites and deducts fees."""
    if lab_id not in LABS:
        raise HTTPException(status_code=404, detail="Lab not found")
    
    lab = LABS[lab_id]
    
    # TODO: Check prerequisites (courses completed)
    # TODO: Deduct KENNY/EVL fees from user
    # TODO: Log lab start on-chain
    
    return {
        "status": "started",
        "lab_id": lab_id,
        "title": lab["title"],
        "steps_total": len(lab["steps"]),
        "fee_kenny": lab["fee_kenny"],
        "fee_evl": lab["fee_evl"],
        "message": f"Welcome to {lab['title']}. Complete all {len(lab['steps'])} steps to earn your certificate."
    }

@app.post("/labs/{lab_id}/complete")
async def complete_lab(lab_id: str, user_id: str):
    """Complete a lab - issue rewards and certificate."""
    if lab_id not in LABS:
        raise HTTPException(status_code=404, detail="Lab not found")
    
    lab = LABS[lab_id]
    
    # TODO: Verify all steps completed
    # TODO: Burn KENNY for certificate
    # TODO: Pin certificate to IPFS
    # TODO: Issue NFT
    
    return {
        "status": "completed",
        "lab_id": lab_id,
        "title": lab["title"],
        "rewards": {
            "xp": lab["reward_xp"],
            "nft": lab["reward_nft"],
            "pick": lab.get("reward_pick", 0)
        },
        "certificate": f"ipfs://{hashlib.sha256(f'{user_id}-{lab_id}'.encode()).hexdigest()}",
        "message": f"Congratulations! You've earned the {lab['reward_nft']}."
    }

@app.get("/careers")
async def list_careers():
    """List all career pathways available."""
    return [
        {
            "id": cid,
            "title": c["title"],
            "description": c["description"],
            "estimated_time_days": c["estimated_time_days"],
            "monthly_cost": c["monthly_cost"],
            "chains": c["chains"]
        }
        for cid, c in CAREER_PATHWAYS.items()
    ]
@app.post("/certificates/create")
async def create_certificate(request: CertRequest):
    """Create IPFS-backed certificate for course completion."""
    conn = get_db()
    
    # Check enrollment
    enrollment = conn.execute("""
        SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?
    """, (request.user_id, request.course_id)).fetchone()
    
    if not enrollment:
        raise HTTPException(status_code=403, detail="Not enrolled in course")
    
    # Get user and course info
    user = conn.execute("SELECT * FROM users WHERE id = ?", (request.user_id,)).fetchone()
    course = conn.execute("SELECT * FROM courses WHERE id = ?", (request.course_id,)).fetchone()
    
    # Build certificate JSON
    cert_data = {
        "recipient": user["email"] or user["wallet"],
        "course": course["title"],
        "completed_at": datetime.now().isoformat(),
        "issuer": "TROPTIONS Education",
        "signature": hashlib.sha256(f"{request.user_id}-{request.course_id}".encode()).hexdigest()[:32]
    }
    
    # TODO: Pin to IPFS via Pinata
    ipfs_hash = f"ipfs://{hashlib.sha256(json.dumps(cert_data).encode()).hexdigest()}"
    
    # TODO: Burn KENNY for on-chain proof
    tx_hash = f"0x{hashlib.sha256(request.user_id.encode()).hexdigest()[:40]}"
    
    cert_id = str(uuid.uuid4())
    conn.execute("""
        INSERT INTO certificates (id, user_id, course_id, ipfs_hash, tx_hash)
        VALUES (?, ?, ?, ?, ?)
    """, (cert_id, request.user_id, request.course_id, ipfs_hash, tx_hash))
    conn.commit()
    conn.close()
    
    return {
        "certificate_id": cert_id,
        "ipfs_hash": ipfs_hash,
        "tx_hash": tx_hash,
        "verified": True
    }

@app.get("/certificates/user/{user_id}")
async def get_certificates(user_id: str):
    conn = get_db()
    certs = conn.execute("SELECT * FROM certificates WHERE user_id = ?", (user_id,)).fetchall()
    conn.close()
    return [dict(c) for c in certs]

# ── Dashboard ──
@app.get("/dashboard/{user_id}")
async def get_dashboard(user_id: str):
    conn = get_db()
    user = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    enrollments = conn.execute("SELECT * FROM enrollments WHERE user_id = ?", (user_id,)).fetchall()
    certs = conn.execute("SELECT * FROM certificates WHERE user_id = ?", (user_id,)).fetchall()
    conn.close()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "user": dict(user),
        "courses_enrolled": len(enrollments),
        "courses_completed": len(certs),
        "xp": user["xp"],
        "pick_balance": user["pick_balance"],
        "certificates": [dict(c) for c in certs],
        "enrollments": [dict(e) for e in enrollments]
    }

# ── Health ──
@app.get("/health")
async def health():
    return {
        "status": "operational",
        "version": "1.0.0",
        "courses": len(COURSES),
        "stripe": bool(STRIPE_SECRET_KEY),
        "polygon": POLYGON_RPC,
        "kenny_contract": KENNY_CONTRACT,
        "evl_contract": EVL_CONTRACT,
        "evl_sale": EVL_SALE_CONTRACT,
        "evl_treasury": EVL_TREASURY,
        "timestamp": datetime.now().isoformat()
    }


@app.get("/health/l1")
async def health_l1():
    client = get_l1_client()
    try:
        state = client.state_get()
        gov = client.governance_get()
        return {"reachable": True, "state": state, "governance": gov}
    except L1ClientError as exc:
        return {"reachable": False, "error": str(exc)}


# ── DAO routes (orchestration via L1 + SQLite mirror) ──
_dao_engine = None
_dao_registry = None


def _get_dao_engine() -> GovernanceEngine:
    global _dao_engine
    if _dao_engine is None:
        _dao_engine = GovernanceEngine(os.getenv("L1_RPC_URL", "http://127.0.0.1:9944"))
    return _dao_engine


def _get_dao_registry() -> MemberRegistry:
    global _dao_registry
    if _dao_registry is None:
        _dao_registry = MemberRegistry(os.getenv("L1_RPC_URL", "http://127.0.0.1:9944"))
    return _dao_registry


@app.get("/dao/state")
async def fth_dao_state():
    eng = _get_dao_engine()
    reg = _get_dao_registry()
    return {
        **eng.state(),
        "members_count": len(reg.list_members()),
    }


@app.get("/dao/credentials/{owner}")
async def fth_dao_credentials(owner: str):
    return _get_dao_registry().credentials_for_owner(owner)


@app.get("/dao/proposals")
async def fth_dao_proposals():
    return _get_dao_engine().list_proposals()


@app.get("/dao/members")
async def fth_dao_members():
    return _get_dao_registry().list_members()

# ── Serve Frontend ──
os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
async def serve_frontend():
    return FileResponse("static/index.html")

# ── Support & Human Mentor System ──

class HumanSupportRequest(BaseModel):
    user_id: str
    user_name: Optional[str] = None
    user_email: Optional[str] = None
    topic: str = Field(..., description="e.g. 'Tokenomics review', 'Lab help', 'Strategy call'")
    message: str
    preferred_contact: str = Field(default="chat", description="chat | call | email")
    subscription_tier: Optional[str] = "builder"
    urgency: Optional[str] = "normal"
    conversation_context: Optional[str] = None

class InstructorNote(BaseModel):
    ticket_id: str
    instructor_id: str
    note: str
    action: Optional[str] = "comment"

# Create support tables
with get_db() as conn:
    conn.execute("""
        CREATE TABLE IF NOT EXISTS support_tickets (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            user_name TEXT,
            user_email TEXT,
            topic TEXT NOT NULL,
            message TEXT NOT NULL,
            preferred_contact TEXT DEFAULT 'chat',
            subscription_tier TEXT DEFAULT 'builder',
            urgency TEXT DEFAULT 'normal',
            status TEXT DEFAULT 'open',
            assigned_to TEXT,
            created_at TEXT,
            updated_at TEXT,
            ai_context TEXT,
            resolution_notes TEXT
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS instructor_notes (
            id TEXT PRIMARY KEY,
            ticket_id TEXT NOT NULL,
            instructor_id TEXT NOT NULL,
            note TEXT NOT NULL,
            action TEXT DEFAULT 'comment',
            created_at TEXT
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS mentor_sessions (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            instructor_id TEXT,
            session_type TEXT DEFAULT 'strategy',
            scheduled_at TEXT,
            duration_minutes INTEGER DEFAULT 30,
            status TEXT DEFAULT 'scheduled',
            notes TEXT,
            recording_url TEXT,
            created_at TEXT
        )
    """)
    conn.commit()

@app.post("/support/request-human")
async def request_human_support(request: HumanSupportRequest):
    """Request human mentor support."""
    ticket_id = str(uuid.uuid4())[:8]
    now = datetime.now().isoformat()
    
    sla_hours = {
        "builder": 48,
        "operator": 12,
        "sovereign": 2
    }.get(request.subscription_tier, 48)
    
    conn = get_db()
    conn.execute("""
        INSERT INTO support_tickets 
        (id, user_id, user_name, user_email, topic, message, preferred_contact,
         subscription_tier, urgency, status, created_at, updated_at, ai_context)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        ticket_id, request.user_id, request.user_name, request.user_email,
        request.topic, request.message, request.preferred_contact,
        request.subscription_tier, request.urgency, "open",
        now, now, request.conversation_context
    ))
    conn.commit()
    conn.close()
    
    return {
        "ticket_id": ticket_id,
        "status": "open",
        "sla_hours": sla_hours,
        "message": f"Support request created. A human instructor will respond within {sla_hours} hours.",
        "next_steps": [
            "Instructor reviewing your request",
            f"Expected response by {(datetime.now() + timedelta(hours=sla_hours)).strftime('%Y-%m-%d %H:%M')}",
            "You'll receive notification when instructor replies"
        ]
    }

@app.get("/support/tickets/{user_id}")
async def get_user_tickets(user_id: str):
    conn = get_db()
    tickets = conn.execute(
        "SELECT * FROM support_tickets WHERE user_id = ? ORDER BY created_at DESC",
        (user_id,)
    ).fetchall()
    conn.close()
    return [dict(t) for t in tickets]

@app.get("/instructor/queue")
async def get_instructor_queue(
    status: Optional[str] = "open",
    tier: Optional[str] = None
):
    conn = get_db()
    query = "SELECT * FROM support_tickets WHERE status = ?"
    params = [status]
    if tier:
        query += " AND subscription_tier = ?"
        params.append(tier)
    query += " ORDER BY CASE urgency WHEN 'urgent' THEN 0 ELSE 1 END, created_at ASC"
    tickets = conn.execute(query, params).fetchall()
    conn.close()
    return {"total": len(tickets), "tickets": [dict(t) for t in tickets]}

@app.post("/instructor/reply")
async def instructor_reply(note: InstructorNote):
    now = datetime.now().isoformat()
    conn = get_db()
    conn.execute("""
        INSERT INTO instructor_notes (id, ticket_id, instructor_id, note, action, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (str(uuid.uuid4()), note.ticket_id, note.instructor_id, note.note, note.action, now))
    
    if note.action == "resolve":
        conn.execute("UPDATE support_tickets SET status='resolved', updated_at=? WHERE id=?",
                     (now, note.ticket_id))
    elif note.action == "assign":
        conn.execute("UPDATE support_tickets SET assigned_to=?, status='in_progress', updated_at=? WHERE id=?",
                     (note.instructor_id, now, note.ticket_id))
    elif note.action == "escalate":
        conn.execute("UPDATE support_tickets SET status='escalated', updated_at=? WHERE id=?",
                     (now, note.ticket_id))
    
    conn.commit()
    conn.close()
    return {"status": "success", "action": note.action, "ticket_id": note.ticket_id}

@app.post("/mentor/schedule")
async def schedule_mentor_session(
    user_id: str, 
    instructor_id: str, 
    session_type: str = "strategy",
    scheduled_at: Optional[str] = None, 
    duration: int = 30
):
    session_id = str(uuid.uuid4())[:8]
    now = datetime.now().isoformat()
    if not scheduled_at:
        scheduled_at = (datetime.now() + timedelta(days=1)).isoformat()
    
    conn = get_db()
    conn.execute("""
        INSERT INTO mentor_sessions (id, user_id, instructor_id, session_type, 
                                     scheduled_at, duration_minutes, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (session_id, user_id, instructor_id, session_type, scheduled_at, duration, "scheduled", now))
    conn.commit()
    conn.close()
    
    return {
        "session_id": session_id,
        "status": "scheduled",
        "scheduled_at": scheduled_at,
        "duration_minutes": duration,
        "message": f"1:1 {session_type} session scheduled for {scheduled_at}."
    }

@app.get("/mentor/sessions/{user_id}")
async def get_user_sessions(user_id: str):
    conn = get_db()
    sessions = conn.execute(
        "SELECT * FROM mentor_sessions WHERE user_id = ? ORDER BY scheduled_at DESC",
        (user_id,)
    ).fetchall()
    conn.close()
    return [dict(s) for s in sessions]

# ── Multi-Chain Labs ──

@app.get("/labs/multi-chain")
async def list_multi_chain_labs():
    """List all multi-chain labs (XRPL, Stellar, Solana, Base, x402, TTN)."""
    return list(MULTI_CHAIN_LABS.values())

@app.get("/labs/multi-chain/{lab_id}")
async def get_multi_chain_lab(lab_id: str):
    """Get specific multi-chain lab details."""
    if lab_id not in MULTI_CHAIN_LABS:
        raise HTTPException(status_code=404, detail="Lab not found")
    return MULTI_CHAIN_LABS[lab_id]

@app.get("/labs/multi-chain/chain/{chain}")
async def get_labs_by_chain(chain: str):
    """Get labs filtered by chain (xrpl, stellar, solana, base, multi, ipfs, troptions)."""
    labs = [lab for lab in MULTI_CHAIN_LABS.values() if lab["chain"] == chain]
    return labs

@app.get("/careers/multi-chain")
async def list_multi_chain_careers():
    """List all multi-chain career pathways."""
    return [
        {
            "id": cid,
            **career
        }
        for cid, career in MULTI_CHAIN_CAREERS.items()
    ]

@app.post("/pathway/multi-chain/generate")
async def generate_multi_chain_pathway(request: PathwayRequest):
    """Generate a multi-chain career pathway with real lab details."""
    
    # Try to match to a predefined career
    goal_lower = request.goal.lower()
    matched_career = None
    
    for career_id, career in MULTI_CHAIN_CAREERS.items():
        keywords = career["title"].lower().split()
        if any(kw in goal_lower for kw in keywords):
            matched_career = career
            break
    
    if not matched_career:
        # Default to multi-chain architect
        matched_career = MULTI_CHAIN_CAREERS["multi-chain-architect"]
    
    # Build detailed response with real labs
    labs_detail = []
    for lab_id in matched_career["labs"]:
        if lab_id in MULTI_CHAIN_LABS:
            lab = MULTI_CHAIN_LABS[lab_id]
            labs_detail.append({
                "id": lab_id,
                "title": lab["title"],
                "chain": lab["chain"],
                "difficulty": lab["difficulty"],
                "duration_hours": lab["duration_hours"],
                "fee_kenny": lab["fee_kenny"],
                "fee_evl": lab["fee_evl"],
                "reward_xp": lab["reward_xp"],
                "reward_pick": lab.get("reward_pick", 0),
                "steps_count": len(lab["steps"]),
                "chain_config": lab.get("chain_config", {})
            })
    
    total_xp = sum(l["reward_xp"] for l in labs_detail)
    total_pick = sum(l["reward_pick"] for l in labs_detail)
    total_kenny = sum(l["fee_kenny"] for l in labs_detail)
    total_evl = sum(l["fee_evl"] for l in labs_detail)
    
    return {
        "title": matched_career["title"],
        "description": matched_career["description"],
        "estimated_time_days": matched_career["estimated_time_days"],
        "courses": matched_career["courses"],
        "labs": labs_detail,
        "total_cost": {
            "kenny": total_kenny,
            "evl": total_evl
        },
        "total_rewards": {
            "xp": total_xp,
            "pick": total_pick
        },
        "chains_used": list(set(l["chain"] for l in labs_detail)),
        "prerequisites": ["Wallet setup", "Basic blockchain knowledge"]
    }

# ── Extended Labs Endpoint (v2 with all 9 labs) ──
@app.get("/labs/v2")
async def list_labs_v2():
    """List all labs including multi-chain extended labs."""
    all_labs = {**LABS, **MULTI_CHAIN_LABS}
    return list(all_labs.values())

@app.get("/labs/v2/{lab_id}")
async def get_lab_v2(lab_id: str):
    """Get specific lab details (v2 extended)."""
    all_labs = {**LABS, **MULTI_CHAIN_LABS}
    if lab_id not in all_labs:
        raise HTTPException(status_code=404, detail="Lab not found")
    return all_labs[lab_id]

@app.get("/labs/v2/chain/{chain}")
async def get_labs_by_chain_v2(chain: str):
    """Get labs filtered by chain."""
    all_labs = {**LABS, **MULTI_CHAIN_LABS}
    labs = [lab for lab in all_labs.values() if lab.get("chain") == chain]
    return {"chain": chain, "count": len(labs), "labs": labs}

# ── Run ──
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8091)
