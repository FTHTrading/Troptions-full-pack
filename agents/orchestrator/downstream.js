const ARBITRAGE_URL = process.env.ARBITRAGE_URL || 'http://127.0.0.1:4028';
const COMPLIANCE_URL = process.env.COMPLIANCE_URL || 'http://127.0.0.1:4025';
const X402_US_URL = process.env.X402_US_URL || process.env.X402_GATEWAY_URL || 'http://127.0.0.1:4030';
const BAAS_API_URL = process.env.BAAS_API_URL || 'http://127.0.0.1:8097';

async function fetchJson(url, opts = {}) {
  const res = await fetch(url, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    signal: AbortSignal.timeout(opts.timeoutMs || 8000),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

async function pingHealth(base, name) {
  try {
    const r = await fetchJson(`${base.replace(/\/$/, '')}/health`);
    return { name, url: base, ok: r.ok, status: r.status, sample: r.data };
  } catch (err) {
    return { name, url: base, ok: false, error: err.message };
  }
}

async function screenCompliance(body) {
  try {
    const r = await fetchJson(`${COMPLIANCE_URL}/screen`, {
      method: 'POST',
      body: JSON.stringify({
        payment_id: body.payment_id || `trade_${Date.now()}`,
        sender: body.sender || body.wallet || 'agent-pipeline',
        amount: body.amount_usd ?? body.amount ?? 0,
        currency: body.currency || 'USD',
        type: 'agentic_trade',
      }),
    });
    return { via: 'compliance-engine', ...r };
  } catch (err) {
    return {
      via: 'compliance-engine',
      ok: false,
      label: 'PIPELINE',
      approved: true,
      stub: true,
      error: err.message,
    };
  }
}

async function runArbitrage(body) {
  const dry = body.dry_run !== false;
  try {
    const r = await fetchJson(`${ARBITRAGE_URL}/execute`, {
      method: 'POST',
      body: JSON.stringify({
        pair: body.pair || body.symbol || 'USD-IOU/EUR-IOU',
        spread_bps: body.spread_bps ?? 30,
        amount_usd: body.amount_usd ?? 5000,
        dry_run: dry,
      }),
    });
    return { via: 'arbitrage-bot', label: 'PIPELINE', revenue_label: 'PROJECTION', ...r };
  } catch (err) {
    return {
      via: 'arbitrage-bot',
      ok: false,
      label: 'PIPELINE',
      revenue_label: 'PROJECTION',
      dry_run: dry,
      error: err.message,
    };
  }
}

async function x402Stats() {
  try {
    const r = await fetchJson(`${X402_US_URL}/x402/stats`);
    return r.data || r;
  } catch {
    return { label: 'PIPELINE', revenue_label: 'PROJECTION', fees_usd: 0 };
  }
}

async function baasRevenue() {
  try {
    const r = await fetchJson(`${BAAS_API_URL}/api/v1/billing/revenue`);
    return r.data || r;
  } catch (err) {
    return { label: 'PIPELINE', revenue_label: 'PROJECTION', error: err.message };
  }
}

module.exports = {
  ARBITRAGE_URL,
  COMPLIANCE_URL,
  X402_US_URL,
  BAAS_API_URL,
  pingHealth,
  screenCompliance,
  runArbitrage,
  x402Stats,
  baasRevenue,
};
