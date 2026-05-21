---
layout: default
title: AI Layer
permalink: /infrastructure/ai/
---

# AI (`ai/`)

| Component | Port | Path |
|-----------|------|------|
| **donk-tutor** | 8090 | [`ai/donk-tutor/`](https://github.com/fthtrading/Troptions-full-pack/tree/main/ai/donk-tutor) |
| **knowledge-base** | — | [`ai/knowledge-base/`](https://github.com/fthtrading/Troptions-full-pack/tree/main/ai/knowledge-base) |

## Capabilities

- RAG tutoring over Qdrant + Ollama (`:11434`)
- Optional **Cloudflare Workers AI** fallback when `WORKERS_AI_ENABLED=1` and account/token env vars are set
- **ElevenLabs** TTS when `ELEVENLABS_API_KEY` is set (`ELEVENLABS_VOICE_ID` optional)
- Whisper STT paths in donk-tutor (GPU optional)
- OpenClaw / whichway docs mirrored under `knowledge-base/openclaw-content`
- Glass site live Q&A: point `troptions-guide.js` at `http://127.0.0.1:8090` — **no API keys in browser JS**

## Dependencies

Local stack expects Ollama and optionally Qdrant — see [`docs/QUICKSTART.md`](../QUICKSTART.html) and `ecosystem.config.js`.

Secrets: [`docs/deploy/secrets-setup.md`](../deploy/secrets-setup.html).

## Maturity

**8/10** for local dev tutoring; production GPU sizing and external voice (ElevenLabs) are operator choices, not verified by CI in this repo.
