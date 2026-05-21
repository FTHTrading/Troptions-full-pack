const ARBITRAGE_URL = process.env.ARBITRAGE_URL || 'http://127.0.0.1:4028';
const orchestrator = require('./orchestrator-client');

async function postJson(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10000),
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

async function execute(opts = {}) {
  const path = opts.path === 'start' ? '/start' : '/execute';
  const url = `${ARBITRAGE_URL.replace(/\/$/, '')}${path}`;
  const body =
    path === '/start'
      ? { interval_ms: opts.interval_ms || 15000 }
      : {
          pair: opts.pair || 'USD-IOU/EUR-IOU',
          spread_bps: opts.spread_bps ?? 30,
          amount_usd: opts.amount_usd ?? 5000,
          dry_run: opts.dry_run !== false,
        };
  const result = await postJson(url, body);
  if (!result.ok && path === '/execute') {
    const fallback = await orchestrator.executeArbitrage(opts);
    return { via: 'payment-orchestrator', ...fallback };
  }
  return { via: 'arbitrage-bot', ...result };
}

const REGION_PORTS = { us: 4030, eu: 4034, jp: 4035 };

function gatewayForRegion(region) {
  const r = (region || 'us').toLowerCase();
  const envKey = `X402_${r.toUpperCase()}_URL`;
  if (process.env[envKey]) return process.env[envKey];
  const port = REGION_PORTS[r] || 4030;
  return `http://127.0.0.1:${port}`;
}

/** Multi-region x402 arbitrage — PIPELINE stub */
async function multiRegion({
  buy,
  sell,
  buy_location,
  sell_location,
  pair,
  amount_usd,
  dry_run = true,
}) {
  const buyR = (buy || buy_location || 'us').toLowerCase();
  const sellR = (sell || sell_location || 'eu').toLowerCase();
  if (!['us', 'eu', 'jp'].includes(buyR) || !['us', 'eu', 'jp'].includes(sellR)) {
    return {
      label: 'PIPELINE',
      error: 'invalid_gateway',
      message: 'buy/sell must be us|eu|jp',
    };
  }
  return {
    label: 'PIPELINE',
    revenue_label: 'PROJECTION',
    dry_run,
    buy: buyR,
    sell: sellR,
    buy_location: buyR,
    sell_location: sellR,
    pair: pair || 'USD-IOU/EUR-IOU',
    amount_usd: amount_usd ?? 5000,
    spread_bps_estimated: 12,
    projected_fee_usd: 0,
    note: 'Multi-x402 mesh arbitrage is modeled only until regional gateways settle live ATP',
    legs: [
      { leg: 'buy', region: buyR, gateway: gatewayForRegion(buyR) },
      { leg: 'sell', region: sellR, gateway: gatewayForRegion(sellR) },
    ],
  };
}

module.exports = { execute, multiRegion, ARBITRAGE_URL };
