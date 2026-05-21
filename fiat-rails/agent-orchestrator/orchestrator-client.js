const ORCHESTRATOR_URL = process.env.ORCHESTRATOR_URL || 'http://127.0.0.1:4022';

async function postJson(path, body) {
  const res = await fetch(`${ORCHESTRATOR_URL.replace(/\/$/, '')}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10000),
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

async function executeArbitrage(opts = {}) {
  return postJson('/api/v1/arbitrage', {
    pair: opts.pair || 'USD-IOU/EUR-IOU',
    spread_bps: opts.spread_bps ?? 30,
    amount_usd: opts.amount_usd ?? 5000,
    dry_run: opts.dry_run !== false,
  });
}

module.exports = { executeArbitrage, postJson, ORCHESTRATOR_URL };
