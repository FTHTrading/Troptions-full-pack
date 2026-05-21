import os

SERVICE_PORTS = {
    "donk_tutor": int(os.getenv("DONK_PORT", "8090")),
    "fth_academy": int(os.getenv("FTH_PORT", "8091")),
    "ttn_launcher": int(os.getenv("TTN_PORT", "8092")),
    "l1_node": int(os.getenv("L1_PORT", "9944")),
}

L1_RPC_URL = os.getenv("L1_RPC_URL", f"http://127.0.0.1:{SERVICE_PORTS['l1_node']}")
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
QDRANT_HOST = os.getenv("QDRANT_HOST", "localhost")
QDRANT_PORT = int(os.getenv("QDRANT_PORT", "6333"))
