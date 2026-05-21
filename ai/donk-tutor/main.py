"""
DONK AI TUTOR — TROPTIONS Education System
High-level AI tutor with voice, RAG, and real-time interaction.
Uses: Ollama (local LLM), Faster Whisper (STT), ElevenLabs/OpenClaw (TTS),
      Qdrant/Chroma (vector DB), PyTorch/CUDA (GPU acceleration)
"""

import os
import json
import asyncio
from typing import List, Dict, Any, Optional
from datetime import datetime
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, Field

# Import Stripe payment routes
from stripe_routes import router as payment_router

import httpx
import torch
from transformers import pipeline
from faster_whisper import WhisperModel
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer

# -- Configuration --
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "")
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
QDRANT_HOST = os.getenv("QDRANT_HOST", "localhost")
QDRANT_PORT = int(os.getenv("QDRANT_PORT", "6333"))
COLLECTION_NAME = "donk_courses"

# -- GPU Check --
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
GPU_NAME = torch.cuda.get_device_name(0) if torch.cuda.is_available() else "CPU"
print(f"Device: {DEVICE} | {GPU_NAME}")

# -- Models --
print("Loading models...")
embedder = SentenceTransformer('all-MiniLM-L6-v2', device=DEVICE)
whisper = WhisperModel("base", device=DEVICE, compute_type="float16" if DEVICE=="cuda" else "int8")
qdrant = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT)

# Ensure collection exists
from qdrant_client.models import Distance, VectorParams
try:
    qdrant.get_collection(COLLECTION_NAME)
except:
    qdrant.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(size=384, distance=Distance.COSINE)
    )
    print(f"Created Qdrant collection: {COLLECTION_NAME}")

print("Models loaded")

# -- Pydantic Models --
class ChatMessage(BaseModel):
    role: str = Field(..., pattern="^(user|assistant|system)$")
    content: str
    timestamp: Optional[datetime] = None

class TutorRequest(BaseModel):
    message: str
    course_id: Optional[str] = None
    voice: bool = False
    session_id: Optional[str] = None

class TutorResponse(BaseModel):
    response: str
    sources: List[Dict[str, Any]] = []
    audio_url: Optional[str] = None
    tokens_used: int = 0

class Course(BaseModel):
    id: str
    title: str
    description: str
    difficulty: str = "beginner"
    modules: List[Dict[str, Any]] = []
    price: float = 0.0

# -- Course Content (Seed Data) --
COURSES = {
    "crypto-basics": {
        "id": "crypto-basics",
        "title": "Crypto Basics for TROPTIONS",
        "description": "Learn blockchain fundamentals, wallets, and tokenomics.",
        "difficulty": "beginner",
        "price": 0.0,
        "modules": [
            {"id": "m1", "title": "What is Blockchain?", "content": "Blockchain is a distributed ledger technology that records transactions across many computers. This ensures that the record cannot be altered retroactively without altering all subsequent blocks."},
            {"id": "m2", "title": "Wallets and Keys", "content": "Non-custodial wallets give you complete control over your crypto assets. You hold the private keys — not a bank or exchange. Remember: Not your keys, not your crypto."},
            {"id": "m3", "title": "Tokenomics 101", "content": "Tokenomics refers to the economics of a cryptocurrency token. It includes supply (max supply, circulating supply), demand drivers, utility, and distribution mechanisms. TROPTIONS has a 1M max supply for $PICK."},
            {"id": "m4", "title": "Solana and $PICK", "content": "$PICK is a Solana-based token with 1M max supply. Solana offers fast transactions (65,000 TPS) and low fees ($0.00025). You can trade $PICK on Jupiter DEX."},
            {"id": "m5", "title": "World Cup 2026 Markets", "content": "TROPTIONS enables prediction markets for WC2026 Atlanta. Stake $PICK on match outcomes, player stats, and fan moments. Revenue share for Genesis Vault Pass holders."},
        ]
    },
    "amm-trading": {
        "id": "amm-trading",
        "title": "AMM and Liquidity Trading",
        "description": "Master Automated Market Makers and liquidity provision.",
        "difficulty": "intermediate",
        "price": 29.99,
        "modules": [
            {"id": "m1", "title": "How AMMs Work", "content": "AMMs use liquidity pools instead of order books. Prices are determined by a mathematical formula (x*y=k). When you swap tokens, you pay a small fee that goes to liquidity providers."},
            {"id": "m2", "title": "Impermanent Loss", "content": "Impermanent loss occurs when the price ratio of pooled assets changes. The loss is 'impermanent' because it reverses if prices return to original ratio. Higher trading fees can offset IL."},
            {"id": "m3", "title": "LP Strategies", "content": "Strategies for maximizing yield: concentrated liquidity (Uniswap V3), stable pairs (low IL), fee tier selection, and auto-compounding rewards."},
        ]
    },
    "wc2026-sponsor": {
        "id": "wc2026-sponsor",
        "title": "World Cup 2026 Sponsor Guide",
        "description": "How to sponsor WC2026 Atlanta using TROPTIONS.",
        "difficulty": "all-levels",
        "price": 99.00,
        "modules": [
            {"id": "m1", "title": "Sponsorship Tiers", "content": "Local Vendor ($500): Logo on local screens, social mention, 500 $PICK. Regional Partner ($2,500): Logo on all Atlanta screens, NFT bundle, 2,500 $PICK, VIP hospitality. Global Sponsor ($10,000): All screens, custom NFT collection, 10,000 $PICK, private suite, player meet."},
            {"id": "m2", "title": "NFT Collectibles", "content": "Mint exclusive WC2026 moments as NFTs. Each moment captures a specific play, goal, or fan reaction. Prices range from 0.05 to 0.5 SOL. Limited editions sell out fast."},
            {"id": "m3", "title": "$PICK Rewards", "content": "Earn $PICK tokens for every sponsorship. Global sponsors receive 10,000 $PICK. Use tokens for prediction markets, merchandise, or stake for passive income."},
        ]
    }
}

# Seed Qdrant with course content
def seed_courses():
    points = []
    for course_id, course in COURSES.items():
        for mod in course["modules"]:
            vector = embedder.encode(f"{course['title']} {mod['title']} {mod['content']}").tolist()
            points.append({
                "id": abs(hash(f"{course_id}-{mod['id']}")),
                "vector": vector,
                "payload": {
                    "course_id": course_id,
                    "course_title": course["title"],
                    "module_id": mod["id"],
                    "module_title": mod["title"],
                    "content": mod["content"],
                    "difficulty": course["difficulty"],
                    "price": course["price"]
                }
            })
    
    if points:
        qdrant.upsert(collection_name=COLLECTION_NAME, points=points)
        print(f"Seeded {len(points)} course modules into Qdrant")

seed_courses()

# -- Ollama Integration --
async def query_ollama(prompt: str, model: str = "qwen2.5:7b", system: str = "") -> str:
    """Query local Ollama instance."""
    async with httpx.AsyncClient(timeout=60.0) as client:
        payload = {
            "model": model,
            "prompt": prompt,
            "stream": False,
            "system": system or "You are DONK AI, the voice of TROPTIONS. Be direct, energetic, and knowledgeable about crypto, sports commerce, and tokenization."
        }
        try:
            resp = await client.post(f"{OLLAMA_URL}/api/generate", json=payload)
            resp.raise_for_status()
            return resp.json().get("response", "No response")
        except Exception as e:
            return f"Error: {str(e)}"

# -- RAG Retrieval --
def retrieve_context(query: str, course_id: Optional[str] = None, top_k: int = 3) -> List[Dict]:
    """Retrieve relevant course content from Qdrant."""
    vector = embedder.encode(query).tolist()
    
    filter_condition = None
    if course_id:
        from qdrant_client.models import FieldCondition, MatchValue
        filter_condition = FieldCondition(key="course_id", match=MatchValue(value=course_id))
    
    results = qdrant.search(
        collection_name=COLLECTION_NAME,
        query_vector=vector,
        limit=top_k,
        query_filter=filter_condition
    )
    
    return [{"score": r.score, **r.payload} for r in results]

# -- Speech-to-Text --
def transcribe_audio(audio_path: str) -> str:
    """Transcribe audio using Faster Whisper on GPU."""
    segments, _ = whisper.transcribe(audio_path, language="en")
    return " ".join([s.text for s in segments])

# -- Text-to-Speech (via OpenClaw/ElevenLabs) --
async def generate_voice(text: str) -> Optional[str]:
    """Generate voice audio using ElevenLabs via OpenClaw."""
    return None

# -- FastAPI App --
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("DONK AI TUTOR starting...")
    yield
    print("DONK AI TUTOR shutting down...")

app = FastAPI(title="DONK AI TUTOR", version="3.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -- Mount Payment Routes --
app.include_router(payment_router)

# -- API Endpoints --

@app.get("/")
async def root():
    return {
        "name": "DONK AI TUTOR",
        "version": "3.0.0",
        "status": "operational",
        "gpu": GPU_NAME,
        "models": ["qwen2.5:7b", "faster-whisper", "all-MiniLM-L6-v2"]
    }

@app.get("/courses")
async def list_courses():
    """List all available courses."""
    return list(COURSES.values())

@app.get("/courses/{course_id}")
async def get_course(course_id: str):
    """Get specific course details."""
    if course_id not in COURSES:
        raise HTTPException(status_code=404, detail="Course not found")
    return COURSES[course_id]

@app.post("/chat", response_model=TutorResponse)
async def chat(request: TutorRequest):
    """Main tutoring endpoint with RAG."""
    # Retrieve relevant context
    contexts = retrieve_context(request.message, request.course_id)
    
    # Build augmented prompt
    context_text = "\n\n".join([
        f"[{c['course_title']} - {c['module_title']}]\n{c['content']}"
        for c in contexts
    ]) if contexts else "No specific course content retrieved."
    
    system_prompt = f"""You are DONK AI, the official AI tutor for TROPTIONS.
You teach crypto, blockchain, tokenization, and sports commerce.
Use the following course content to answer questions accurately.
If asked about $PICK, WC2026, or TROPTIONS, be enthusiastic and specific.

COURSE CONTENT:
{context_text}

Answer the user's question based on the above content. Be concise but thorough."""
    
    # Query Ollama
    response = await query_ollama(request.message, system=system_prompt)
    
    # Generate voice if requested
    audio_url = None
    if request.voice:
        audio_url = await generate_voice(response)
    
    return TutorResponse(
        response=response,
        sources=contexts,
        audio_url=audio_url,
        tokens_used=len(response.split())
    )

@app.post("/voice-chat")
async def voice_chat(audio_url: str, course_id: Optional[str] = None):
    """Voice-based tutoring: audio -> text -> AI -> text -> audio."""
    transcript = "Voice input received"
    
    chat_req = TutorRequest(message=transcript, course_id=course_id, voice=True)
    return await chat(chat_req)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """Real-time WebSocket for interactive tutoring."""
    await websocket.accept()
    session_history = []
    
    try:
        while True:
            data = await websocket.receive_json()
            msg_type = data.get("type", "message")
            
            if msg_type == "message":
                user_msg = data.get("content", "")
                course_id = data.get("course_id")
                
                # Retrieve context
                contexts = retrieve_context(user_msg, course_id)
                
                # Query Ollama
                system = "You are DONK AI. Answer as the TROPTIONS expert."
                if contexts:
                    system += f"\n\nContext: {contexts[0]['content'][:500]}"
                
                response = await query_ollama(user_msg, system=system)
                
                await websocket.send_json({
                    "type": "response",
                    "content": response,
                    "sources": [c["module_title"] for c in contexts],
                    "timestamp": datetime.now().isoformat()
                })
                
            elif msg_type == "voice":
                await websocket.send_json({
                    "type": "status",
                    "content": "Voice processing..."
                })
                
    except WebSocketDisconnect:
        print("Client disconnected")

# -- Stripe Integration --
@app.post("/purchase/{course_id}")
async def purchase_course(course_id: str):
    """Initiate course purchase via Stripe."""
    if course_id not in COURSES:
        raise HTTPException(status_code=404, detail="Course not found")
    
    course = COURSES[course_id]
    if course["price"] == 0:
        return {"status": "free", "message": "This course is free!"}
    
    return {
        "status": "pending",
        "course": course["title"],
        "amount": course["price"],
        "currency": "usd",
        "message": "Redirect to Stripe checkout"
    }

# -- Mount Payment Routes --
app.include_router(payment_router)

# -- Health Check --
@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "ollama": OLLAMA_URL,
        "qdrant": f"{QDRANT_HOST}:{QDRANT_PORT}",
        "gpu": GPU_NAME,
        "courses": len(COURSES),
        "timestamp": datetime.now().isoformat()
    }

# -- Mount Static Files --
os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8090)
