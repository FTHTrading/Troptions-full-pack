# Telegram operator bot

Mobile command surface for BaaS API, agent orchestrator, and USDC relay stubs.

## Primary bot

**NeedAI Ada** — [@NeedAI_Ada_bot](https://t.me/NeedAI_Ada_bot)

## Secrets (local only)

Copy `.env.template` to `.env` on the host:

```bash
TELEGRAM_BOT_TOKEN=
```

`TELEGRAM_BOT_TOKEN` must live in **local `.env` only**. Never commit it to git, GitHub Pages, or documentation.

If a token was pasted in chat or committed by mistake, revoke it in [@BotFather](https://t.me/BotFather) (`/revoke`) and issue a new token.

## Run

```bash
cd services/telegram-bot
npm install
# set TELEGRAM_BOT_TOKEN in .env
node bot.js
```

Or from repo root with PM2:

```bash
pm2 start ecosystem.config.js --only telegram-bot --update-env
```

## Commands

Register with BotFather `/setcommands`:

```
start - Welcome and command list
revenue - Billing revenue stub (PROJECTION)
trade - Dry-run agent trade cycle
pools - Batch pool job status
agent - Register agent stub
deposit - USDC relay deposit stub
withdraw - USDC relay withdraw stub
setprice - BaaS global price stub (admin)
```

See `sites/investor/lib/telegram.ts` and [TELEGRAM_OPERATOR.md](../../docs/technical/TELEGRAM_OPERATOR.md).

## Investor site deep link

Build the investor site with:

```
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=NeedAI_Ada_bot
```

(`sites/investor/.env.example`)
