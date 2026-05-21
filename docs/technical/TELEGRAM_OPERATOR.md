---
title: Telegram operator — NeedAI Ada
layout: default
permalink: /technical/TELEGRAM_OPERATOR.html
---

# Telegram operator — NeedAI Ada

**Bot:** [@NeedAI_Ada_bot](https://t.me/NeedAI_Ada_bot) (NeedAI Ada)

## Token security

- Put `TELEGRAM_BOT_TOKEN` in **host `.env` only** (`services/telegram-bot/.env` or root `.env`).
- **Never** commit the token to the repo, GitHub Pages build, or docs.
- If a token was pasted in chat, email, or a ticket: **revoke immediately** in [@BotFather](https://t.me/BotFather) → `/revoke`, then create a new token and update the host `.env` only.

## BotFather

1. Open [@BotFather](https://t.me/BotFather).
2. For a new bot: `/newbot`. For an existing bot: select **NeedAI Ada** / `@NeedAI_Ada_bot`.
3. `/setcommands` — paste the command list from `services/telegram-bot/README.md`.
4. Copy token to local `.env` as `TELEGRAM_BOT_TOKEN`.

## Stack

```bash
pm2 start ecosystem.config.js --only telegram-bot --update-env
```

Requires `baas-api` on `:8097` for `/revenue`, `/pools`, `/agent`, `/setprice`.

## Investor site

Public deep link (no secrets):

```env
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=NeedAI_Ada_bot
```

Set at **build** time (`sites/investor/.env.example`). Pages: [Telegram setup](https://fthtrading.github.io/Troptions-full-pack/telegram/), [Command Center](https://fthtrading.github.io/Troptions-full-pack/command-center/).

## Commands (summary)

| Command | Label |
|---------|--------|
| `/start` | PIPELINE |
| `/revenue` | PROJECTION |
| `/trade` | PROJECTION |
| `/pools`, `/agent`, `/deposit`, `/withdraw`, `/setprice` | PIPELINE |

Implementation: `services/telegram-bot/bot.js`.
