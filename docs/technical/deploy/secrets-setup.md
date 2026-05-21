---
layout: default
title: Secrets setup (Bryan)
permalink: /deploy/secrets-setup/
---

# Secrets setup — Bryan / operators

**Never** commit `.env`, Desktop credential `.txt` files, or API tokens into this repository. Use `.env.example` for variable names only.

## One-command local setup (Windows)

From repo root:

```powershell
.\scripts\setup-local-env.ps1
.\scripts\setup-cloudflare-env.ps1
```

**`setup-local-env.ps1`:**

1. Copies `.env.example` → `.env` (`.env` is gitignored).
2. Reads **local Desktop paths only** (not tracked in git):
   - Workers AI token file → `CLOUDFLARE_WORKERS_AI_TOKEN` / `WORKERS_AI_API_TOKEN` (3rd `cfut_…` token = **Edit Cloudflare Workers API**).
   - `tele2 api.txt` → `TELNYX_API_KEY`.
   - `eleven labs.txt` → `ELEVENLABS_API_KEY`.
3. Leaves `TELECOM_DRY_RUN=true` and `WORKERS_AI_ENABLED=0` until you opt in.

**`setup-cloudflare-env.ps1`:**

1. Reads **Read all resources** token from `OneDrive - FTH Trading\11-Downloads\Read all resources API token was su.txt` (or pass a custom path).
2. Sets `CLOUDFLARE_API_TOKEN` in `.env` for zone/DNS/tunnel work (see [CLOUDFLARE_ORIGIN_FIX.md](../CLOUDFLARE_ORIGIN_FIX.md)).
3. Sets `CLOUDFLARE_ACCOUNT_ID` only if present in the source file or already in the shell environment.

Add **`CLOUDFLARE_ACCOUNT_ID`** manually (Cloudflare dashboard → account ID) when not in the credential file.

## Environment variable map

| Variable | Service | Used by |
|----------|---------|---------|
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare | `ai/donk-tutor`, `backend/dao-service/workers_ai_router.py`, Exchange OS image route |
| `CLOUDFLARE_API_TOKEN` | Zone/DNS/tunnel admin | Operator API scripts; origin fix runbook — **not** Workers AI inference |
| `CLOUDFLARE_WORKERS_AI_TOKEN` or `WORKERS_AI_API_TOKEN` | Workers AI | Same (Bearer token for `api.cloudflare.com`) |
| `WORKERS_AI_ENABLED` | Feature flag | Set `1` to allow Workers AI fallback / dao proxy |
| `WORKERS_AI_MODEL` | Model id | Default `@cf/meta/llama-3.1-8b-instruct` |
| `ELEVENLABS_API_KEY` | ElevenLabs TTS | `ai/donk-tutor` (`xi-api-key` header) |
| `ELEVENLABS_VOICE_ID` | Voice | Optional; default Josh voice id in code |
| `TELNYX_API_KEY` | Telnyx REST | `backend/dao-service/telecom_router.py` |
| `TELNYX_PUBLIC_KEY` | Webhook verify | Optional Ed25519 public key |
| `TELNYX_WEBHOOK_SECRET` | Webhook | Signature header validation |
| `TELNYX_FROM_NUMBER` | Outbound | Document for NEED AI ops |
| `TELECOM_DRY_RUN` | Safety | `true` until Telnyx + dispatch tested |
| `NEEDAI_DISPATCH_URL` | NEED AI | Upstream dispatch when dry-run off |

## Glass showcase / GitHub Pages

- **Live AI Q&A:** run `donk-tutor` on **`http://127.0.0.1:8090`**, then set Ask panel API base to that URL (`?api=` or localStorage). See `docs/assets/js/troptions-guide.js`.
- **Do not** embed Cloudflare, Telnyx, or ElevenLabs keys in static JS. All provider calls stay server-side.

## Verify no secrets in git

```powershell
git grep -E "cfut_|KEY019|sk_[a-zA-Z0-9]{20,}" -- . ":(exclude).env.example" ":(exclude)frontends/fth-edu/.env.example"
```

Expect only placeholders (`sk_live_YOUR_KEY_HERE`, etc.).

## Production

- Store secrets in host env, PM2 ecosystem env, or Cloudflare/Vercel secret stores — not in `wrangler.toml` or committed files.
- Keep `TELECOM_DRY_RUN=true` on staging until Telnyx webhooks and NEED AI dispatch are signed off.
