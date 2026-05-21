// services/telegram-bot/bot.js — operator bot (:8443)
// Requires TELEGRAM_BOT_TOKEN (never commit). All revenue replies: PIPELINE/PROJECTION.
const TelegramBot = require('node-telegram-bot-api');

const PORT = Number(process.env.PORT) || 8443;
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const BAAS_URL = process.env.BAAS_API_URL || 'http://127.0.0.1:8097';
const AGENT_URL = process.env.AGENT_ORCHESTRATOR_URL || 'http://127.0.0.1:4100';
const RELAY_URL = process.env.USDC_RELAY_URL || 'http://127.0.0.1:4040';

const LABEL = 'PIPELINE';
const REVENUE_LABEL = 'PROJECTION';

async function fetchJson(url, opts = {}) {
  const res = await fetch(url, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    signal: AbortSignal.timeout(8000),
  });
  return res.json().catch(() => ({}));
}

function projectionReply(text) {
  return `${text}\n\n_${REVENUE_LABEL}: not realized revenue. 10/10 score and $874K/mo are PIPELINE models._`;
}

if (!TOKEN) {
  console.error('[telegram-bot] TELEGRAM_BOT_TOKEN required — exiting (no secrets in repo)');
  process.exit(1);
}

const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    projectionReply(
      'TROPTIONS operator bot (PIPELINE).\n' +
        '/trade — agent trade cycle\n' +
        '/revenue — billing PROJECTION\n' +
        '/pools — batch pool status\n' +
        '/agent — register agent stub\n' +
        '/deposit /withdraw — USDC relay stub\n' +
        '/setprice — BaaS price stub'
    )
  );
});

bot.onText(/\/trade(?:\s+(.+))?/, async (msg, match) => {
  const symbol = (match[1] || 'USD-IOU/EUR-IOU').trim();
  try {
    const data = await fetchJson(`${AGENT_URL}/trade`, {
      method: 'POST',
      body: JSON.stringify({ symbol, dry_run: true }),
    });
    bot.sendMessage(msg.chat.id, projectionReply(`Trade cycle (${symbol}):\n\`\`\`\n${JSON.stringify(data, null, 2).slice(0, 3500)}\n\`\`\``), {
      parse_mode: 'Markdown',
    });
  } catch (err) {
    bot.sendMessage(msg.chat.id, `Trade failed: ${err.message}`);
  }
});

bot.onText(/\/revenue/, async (msg) => {
  try {
    const data = await fetchJson(`${BAAS_URL}/api/v1/billing/revenue`);
    bot.sendMessage(msg.chat.id, projectionReply(`Billing revenue stub:\n\`\`\`\n${JSON.stringify(data, null, 2)}\n\`\`\``), {
      parse_mode: 'Markdown',
    });
  } catch (err) {
    bot.sendMessage(msg.chat.id, `Revenue fetch failed: ${err.message}`);
  }
});

bot.onText(/\/pools/, async (msg) => {
  try {
    const data = await fetchJson(`${BAAS_URL}/api/v1/pools/jobs`);
    bot.sendMessage(msg.chat.id, projectionReply(`Pool jobs:\n\`\`\`\n${JSON.stringify(data, null, 2).slice(0, 3000)}\n\`\`\``), {
      parse_mode: 'Markdown',
    });
  } catch (err) {
    bot.sendMessage(msg.chat.id, projectionReply(`Pools: start baas-api on :8097 — ${err.message}`));
  }
});

bot.onText(/\/agent(?:\s+(\S+))?/, async (msg, match) => {
  const agentId = match[1] || `tg_${msg.chat.id}`;
  try {
    const data = await fetchJson(`${BAAS_URL}/api/v1/agents`, {
      method: 'POST',
      body: JSON.stringify({
        agent_id: agentId,
        wallet: 'rTelegramPipeline000000000000000000',
        capital_troptions: 0,
      }),
    });
    bot.sendMessage(msg.chat.id, projectionReply(`Agent registered:\n\`\`\`\n${JSON.stringify(data, null, 2)}\n\`\`\``), {
      parse_mode: 'Markdown',
    });
  } catch (err) {
    bot.sendMessage(msg.chat.id, `Agent register failed: ${err.message}`);
  }
});

bot.onText(/\/deposit(?:\s+(\S+))?/, async (msg, match) => {
  const amount = match[1] || '100';
  try {
    const data = await fetchJson(`${RELAY_URL}/deposit`, {
      method: 'POST',
      body: JSON.stringify({ amount_usdc: amount, label: LABEL }),
    });
    bot.sendMessage(msg.chat.id, projectionReply(`Deposit stub:\n\`\`\`\n${JSON.stringify(data, null, 2)}\n\`\`\``), {
      parse_mode: 'Markdown',
    });
  } catch (err) {
    bot.sendMessage(msg.chat.id, `Deposit failed: ${err.message}`);
  }
});

bot.onText(/\/withdraw(?:\s+(\S+))?/, async (msg, match) => {
  const amount = match[1] || '50';
  try {
    const data = await fetchJson(`${RELAY_URL}/withdraw`, {
      method: 'POST',
      body: JSON.stringify({ amount_usdc: amount, label: LABEL }),
    });
    bot.sendMessage(msg.chat.id, projectionReply(`Withdraw stub:\n\`\`\`\n${JSON.stringify(data, null, 2)}\n\`\`\``), {
      parse_mode: 'Markdown',
    });
  } catch (err) {
    bot.sendMessage(msg.chat.id, `Withdraw failed: ${err.message}`);
  }
});

bot.onText(/\/setprice(?:\s+(\S+))?(?:\s+(\S+))?/, async (msg, match) => {
  const tokenId = match[1] || 'TROPTIONS';
  const price = match[2] || '1.00';
  try {
    const data = await fetchJson(`${BAAS_URL}/api/v1/tokens/${encodeURIComponent(tokenId)}/price`, {
      method: 'POST',
      body: JSON.stringify({ price_usd: price, label: LABEL, revenue_label: REVENUE_LABEL }),
    });
    bot.sendMessage(msg.chat.id, projectionReply(`Set price (PIPELINE):\n\`\`\`\n${JSON.stringify(data, null, 2)}\n\`\`\``), {
      parse_mode: 'Markdown',
    });
  } catch (err) {
    bot.sendMessage(
      msg.chat.id,
      projectionReply(`setprice stub — POST ${BAAS_URL}/api/v1/tokens/${tokenId}/price — ${err.message}`)
    );
  }
});

console.log(`[telegram-bot] polling started (health port ref ${PORT}) label=${LABEL}`);
