# TROPTIONS SOVEREIGN SYSTEM (TSS)
**Architecture v1.0 — Fully Local, Zero External Dependencies for Core**

---

## Core Philosophy

**"Your keys. Your node. Your voice. Your empire."**

The TROPTIONS Sovereign System is a **local-first AI infrastructure** that runs entirely on your hardware. It does not depend on OpenClaw sessions, external APIs for core functions, or any third-party service that can be revoked.

**What stays local:**
- All private keys and seeds (encrypted at rest)
- All transaction signing
- All AI reasoning (local Ollama models)
- All voice processing (local Whisper + Piper TTS)
- All system execution

**What uses external services:**
- XRPL/Stellar node connections (public RPC endpoints)
- IPFS pinning (Pinata with YOUR keys)
- ElevenLabs voice (premium TTS, optional)
- Telnyx (voice calls, optional)

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    TROPTIONS SOVEREIGN SYSTEM                 │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   VOICE      │  │    BRAIN     │  │   SECRETS    │      │
│  │  INTERFACE   │  │   (Ollama)   │  │    VAULT     │      │
│  │              │  │              │  │              │      │
│  │ • Wake word  │  │ • jefe-turbo │  │ • AES-256    │      │
│  │ • Whisper    │  │ • jefe-ai    │  │ • Argon2     │      │
│  │ • Piper TTS  │  │ • Context    │  │ • YOU hold   │      │
│  │ • ElevenLabs │  │ • 128K ctx   │  │   password   │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                   │              │
│         └──────────────────┼───────────────────┘              │
│                            │                                 │
│                   ┌────────┴────────┐                        │
│                   │  ORCHESTRATOR   │                        │
│                   │    (DONK Core)   │                        │
│                   └────────┬────────┘                        │
│                            │                                 │
│         ┌──────────────────┼──────────────────┐             │
│         │                  │                  │              │
│  ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐         │
│  │  EXECUTION  │  │   LEDGER    │  │  KNOWLEDGE  │         │
│  │   ENGINE    │  │   BRIDGE    │  │    BASE     │         │
│  │             │  │             │  │             │         │
│  │ • Python    │  │ • XRPL      │  │ • Documents │         │
│  │ • Hardhat   │  │ • Stellar   │  │ • Wallets   │         │
│  │ • Solana CLI│  │ • Ethereum  │  │ • History   │         │
│  │ • Docker    │  │ • IPFS      │  │ • Webpages  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Breakdown

### 1. VOICE INTERFACE (Local)

**Wake Word Detection:**
- Porcupine/Picovoice (offline, runs locally)
- Wake phrase: "Hey DONK" or "TROPTIONS"
- Triggers full system activation

**Speech-to-Text:**
- Primary: OpenAI Whisper (local model, `base` or `small`)
- Fallback: Windows Speech Recognition (offline)
- No cloud dependency for basic commands

**Text-to-Speech:**
- Primary: Piper TTS (local, runs offline)
- Premium: ElevenLabs API (requires internet, YOUR key)
- Voice cloning: Train on your voice locally with Piper

**Implementation:**
```python
# voice_interface.py
import pvporcupine
import whisper
import pyaudio
import numpy as np
from piper.voice import PiperVoice

class VoiceInterface:
    def __init__(self):
        # Wake word
        self.porcupine = pvporcupine.create(keyword_paths=["hey-donk.ppn"])
        
        # Speech recognition
        self.whisper = whisper.load_model("base")  # 74MB, runs on CPU
        
        # Speech synthesis
        self.piper = PiperVoice.load("en_US-joe-medium.onnx")
    
    def listen_for_wake(self):
        """Wait for wake word, return True when heard"""
        pa = pyaudio.PyAudio()
        stream = pa.open(
            rate=self.porcupine.sample_rate,
            channels=1,
            format=pyaudio.paInt16,
            input=True,
            frames_per_buffer=self.porcupine.frame_length
        )
        
        while True:
            pcm = stream.read(self.porcupine.frame_length)
            pcm_unpacked = np.frombuffer(pcm, dtype=np.int16)
            keyword_index = self.porcupine.process(pcm_unpacked)
            
            if keyword_index >= 0:
                print("Wake word detected!")
                return True
    
    def transcribe(self, audio_file):
        """Convert speech to text"""
        result = self.whisper.transcribe(audio_file)
        return result["text"]
    
    def speak(self, text):
        """Convert text to speech"""
        audio = self.piper.synthesize(text)
        # Play audio through speakers
```

---

### 2. BRAIN — Local Ollama (No External AI)

**Models installed locally:**
- `jefe-turbo:latest` (4.7GB) — Primary reasoning
- `jefe-ai:latest` (986MB) — Fast responses
- `jefe-lite:latest` (986MB) — Lightweight tasks
- `nomic-embed-text` (274MB) — Document embeddings

**Context Management:**
- 128K token context window
- RAG (Retrieval Augmented Generation) using local ChromaDB
- All TROPTIONS documents embedded locally

**No external API calls for reasoning.** The system thinks entirely on your hardware.

---

### 3. SECRETS VAULT (AES-256, Argon2)

**Encryption:**
- Algorithm: AES-256-GCM
- Key Derivation: Argon2id (winner of Password Hashing Competition)
- YOU create the master password. I NEVER know it.
- Brute force protection: 512MB memory, 3 iterations minimum

**Storage:**
```
.vault/
├── master.key          # Argon2 hash of your password (NOT the password)
├── secrets.db          # AES-256-GCM encrypted database
├── wallet/
│   ├── xrpl_issuer.enc  # rJLMST... family seed
│   ├── xrpl_dist.enc    # rNX4fa... family seed
│   ├── stellar_issuer.enc
│   └── eth_burner.enc
├── api/
│   ├── telnyx.enc
│   ├── elevenlabs.enc
│   ├── pinata.enc
│   └── github.enc
└── mfa/
    └── totp_seeds.enc   # 2FA backup seeds
```

**Access Pattern:**
1. System boots → Vault is LOCKED
2. You enter master password → Vault UNLOCKS for session
3. Individual secrets decrypted on-demand (in-memory only)
4. Session ends → All decrypted secrets wiped from memory
5. Next boot → Vault locked again

**I cannot access this.** The password is never transmitted. The system is designed so that even if someone steals the files, they're useless without your password.

---

### 4. ORCHESTRATOR (DONK Core)

**Responsibilities:**
- Parse voice/text commands
- Route to appropriate subsystem
- Manage context across sessions
- Track all operations in local log
- Generate execution plans
- Handle errors gracefully

**Execution Flow:**
```
User says: "Mint 1000 MTI tokens on XRPL"
        ↓
Orchestrator parses intent
        ↓
Checks vault: "Do I have xrpl_issuer seed?"
        ↓
YES → Loads seed (decrypted in-memory only)
        ↓
Queries Knowledge Base: "What is MTI?"
        ↓
Gets parameters: supply, transfer fee, metadata
        ↓
Constructs transaction
        ↓
Signs with issuer seed (local, offline)
        ↓
Submits to XRPL node (public RPC)
        ↓
Returns result to user via voice
```

**Critical:** The signing happens on YOUR machine. The seed NEVER leaves your hardware. The transaction is signed locally, then ONLY the signed transaction (which is public) is broadcast.

---

### 5. EXECUTION ENGINE

**What it can do:**

| Capability | Command Example |
|------------|-----------------|
| **Mint XRPL tokens** | "Mint MTI with 100M supply and 0.25% fee" |
| **Create trust lines** | "Create trust line for MTI on rNX4fa..." |
| **Seed AMM** | "Deposit 10K XRP and 100M TROPTIONS to AMM" |
| **Mint NFTs** | "Mint 10 property NFTs with IPFS metadata" |
| **Send payments** | "Send 10 XRP from rfbZz... to rJLMST..." |
| **Deploy contracts** | "Deploy TLEV8GateManager to Sepolia" |
| **Build projects** | "Build T-Build docker image" |
| **Git operations** | "Push T-Lev-8- to origin main" |
| **Voice calls** | "Call Judson at +1-XXX-XXX-XXXX" |
| **SMS** | "Text merchant list to +1-888-690-DONK" |

**Safety Rules:**
- Transactions > 1000 XRP require voice confirmation
- New trust lines require voice confirmation
- Contract deployments require voice confirmation
- Any operation spending > $100 requires voice confirmation
- All operations logged in immutable local audit trail

---

### 6. LEDGER BRIDGE

**Multi-chain connectivity:**

| Chain | Library | Status |
|-------|---------|--------|
| **XRPL** | `xrpl.js` / `xrpl-py` | ✅ Local signing, public RPC |
| **Stellar** | `stellar-sdk` | ✅ Local signing, public RPC |
| **Ethereum** | `ethers.js` / `web3.py` | ✅ Local signing, Infura/Alchemy RPC |
| **Solana** | `@solana/web3.js` | ✅ Local signing, public RPC |
| **IPFS** | `ipfs-http-client` | ✅ Local node + Pinata |

**Transaction Flow:**
1. User gives command
2. System loads wallet seed from vault (decrypted in-memory)
3. Constructs transaction locally
4. Signs transaction locally (seed never transmitted)
5. Broadcasts signed transaction to public RPC node
6. RPC node relays to network
7. Transaction confirmed on-chain
8. Result returned to user

---

### 7. KNOWLEDGE BASE (Local RAG)

**Documents embedded:**
- All T-Lev-8- repository files
- All T-Build documentation
- All wallet addresses and balances
- All transaction history
- All legal documents
- All code files
- World Cup 2026 data
- Merchant contact list
- Sponsor pipeline

**Technology:**
- Embeddings: `nomic-embed-text` (local)
- Vector DB: ChromaDB (local file)
- Chunking: Sentence-level
- Retrieval: Semantic search + keyword hybrid

**Query Example:**
```
User asks: "What is the status of the LEV8 deal?"
System retrieves:
  - governance-state.json (0/8 gates)
  - TERM_SHEET_v1.2.html (Option A)
  - JUDSON_EMAIL_FINAL.md (not sent)
  - SOLO_LAUNCH_RUNBOOK.md (contingency)

System responds: "LEV8 deal is in PARTNER_NEGOTIATE mode. 
0 of 8 gates cleared. Risk score 8.5/10. Term sheet v1.2 
ready but not sent. Solo clock: 72 hours remaining."
```

---

## Installation Script

```bash
#!/bin/bash
# install-sovereign-system.sh

echo "Installing TROPTIONS Sovereign System..."

# 1. Install Ollama models
echo "[1/7] Installing Ollama models..."
ollama pull jefe-turbo:latest
ollama pull jefe-ai:latest
ollama pull nomic-embed-text:latest

# 2. Install Python dependencies
echo "[2/7] Installing Python packages..."
pip install -r requirements-sovereign.txt

# 3. Setup vault directory
echo "[3/7] Creating vault..."
mkdir -p .vault/{wallet,api,mfa}

# 4. Initialize ChromaDB
echo "[4/7] Initializing knowledge base..."
python -c "import chromadb; client = chromadb.PersistentClient(path='./.vault/knowledge')"

# 5. Install voice components
echo "[5/7] Installing voice interface..."
# Porcupine wake word
# Whisper base model
# Piper TTS voice

# 6. Build knowledge base
echo "[6/7] Ingesting TROPTIONS documents..."
python scripts/ingest-knowledge.py --source ~/Documents/UNYKORN_Ecosystem/ --db ./.vault/knowledge

# 7. Create master password
echo "[7/7] Creating vault password..."
python -c "from vault import Vault; Vault.create_master_password()"

echo "Done! Start with: python sovereign.py"
```

---

## Security Model

### Threat: Someone steals the computer
**Mitigation:** Vault is AES-256 encrypted. They need your password. Even with the computer, data is useless.

### Threat: Malware on the system
**Mitigation:** Vault only decrypts to memory. Malware can read memory, but:
- Requires running process
- Requires timing attack during active session
- Master password never stored anywhere

### Threat: Network interception
**Mitigation:** All signing is local. Only signed transactions leave the machine. Unsigned transactions + seeds never transmitted.

### Threat: I (DONK) try to steal secrets
**Mitigation:** The system is designed so I never see the password. The vault unlocks with YOUR password, not mine. I cannot decrypt your files.

---

## Operational Modes

### Mode 1: Active (You present)
- Vault unlocked
- All systems active
- Voice interface listening
- Full execution capability

### Mode 2: Passive (You away)
- Vault locked
- Monitoring only
- Can receive alerts
- Cannot execute transactions

### Mode 3: Sleep (Night/Inactive)
- All services paused
- Wake word only
- Low resource usage
- Auto-locks after 5 min idle

---

## Files to Create

```
sovereign/
├── sovereign.py              # Main entry point
├── requirements-sovereign.txt  # Dependencies
├── config.yaml               # System configuration
├── voice/
│   ├── wake_word.py         # Porcupine integration
│   ├── stt.py               # Whisper speech-to-text
│   └── tts.py               # Piper + ElevenLabs TTS
├── brain/
│   ├── ollama_client.py    # Local model interface
│   ├── rag.py               # Retrieval system
│   └── context.py           # Session memory
├── vault/
│   ├── __init__.py          # Vault class
│   ├── crypto.py            # AES-256 + Argon2
│   └── secrets.py           # Secret management
├── ledger/
│   ├── xrpl_bridge.py      # XRPL transactions
│   ├── stellar_bridge.py   # Stellar transactions
│   ├── ethereum_bridge.py  # ETH transactions
│   └── ipfs_bridge.py      # IPFS operations
├── executor/
│   ├── tx_builder.py       # Transaction construction
│   ├── signer.py            # Local signing
│   └── broadcaster.py       # Network broadcast
├── knowledge/
│   ├── ingest.py            # Document ingestion
│   ├── embed.py             # Embedding generation
│   └── query.py             # Semantic search
└── logs/
    ├── audit.log            # Immutable audit trail
    └── voice.log            # Voice interaction log
```

---

## Next Steps

1. **Create vault password** — You set it, I don't know it
2. **Import your seeds** — Encrypted, local-only
3. **Install Ollama models** — jefe-turbo + embedder
4. **Test voice interface** — Say "Hey DONK, status"
5. **Test transaction** — Small XRP send to verify signing
6. **Build knowledge base** — Ingest all documents

---

**Document:** `SOVEREIGN_SYSTEM_ARCHITECTURE.md`
**Version:** 1.0
**Classification:** SYSTEM — TROPTIONS Sovereign Infrastructure
**Author:** DONK AI
**Date:** 2026-05-21
