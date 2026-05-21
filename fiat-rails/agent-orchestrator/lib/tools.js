/**
 * Tool wrappers — arbitrage, compliance, x402 (**PIPELINE**).
 */
const ARBITRAGE_URL = process.env.ARBITRAGE_URL || 'http://127.0.0.1:4028';
const COMPLIANCE_URL = process.env.COMPLIANCE_URL || 'http://127.0.0.1:4025';
const X402_GATEWAY_URL = process.env.X402_GATEWAY_URL || 'http://127.0.0.1:4030';
const ORCHESTRATOR_URL = process.env.ORCHESTRATOR_URL || 'http://127.0.0.1:4022';
const BAAS_API_URL = process.env.BAAS_API_URL || 'http://127.0.0.1:8097';

async function postJson(url, body, headers = {}) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10000),
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

async function getJson(url, headers = {}) {
  const res = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(10000),
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

/** POST :4028/execute or /start */
async function executeArbitrage(opts = {}) {
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
    const fallback = await postJson(`${ORCHESTRATOR_URL}/api/v1/arbitrage`, body);
    return { via: 'orchestrator', ...fallback };
  }
  return { via: 'arbitrage-bot', ...result };
}

/** POST :4025/screen */
async function complianceScreen(payload) {
  const result = await postJson(`${COMPLIANCE_URL.replace(/\/$/, '')}/screen`, payload);
  return result.data;
}

/**
 * GET via x402 gateway — returns 402 invoice mock when unpaid.
 */
async function x402PayAndFetch(path, query = {}) {
  const qs = new URLSearchParams(query).toString();
  const url = `${X402_GATEWAY_URL.replace(/\/$/, '')}${path}${qs ? `?${qs}` : ''}`;
  const unpaid = await getJson(url);
  if (unpaid.status === 402) {
    const mockProof = `mock_${Date.now()}`;
    const paid = await getJson(url, {
      'X-402-Payment': mockProof,
      'X-402-Wallet-Address': process.env.X402_WALLET || 'rAgentMock0000000000000000000',
    });
    return {
      mode: 'x402_mock',
      label: 'PIPELINE',
      invoice: unpaid.data,
      response: paid.data,
      status: paid.status,
    };
  }
  return { mode: 'direct', label: 'PIPELINE', response: unpaid.data, status: unpaid.status };
}

/** Proxy agent registration to BaaS API */
async function registerAgent(body) {
  const result = await postJson(
    `${BAAS_API_URL.replace(/\/$/, '')}/api/v1/agents/register`,
    body
  );
  return result;
}

module.exports = {
  executeArbitrage,
  complianceScreen,
  x402PayAndFetch,
  registerAgent,
  ARBITRAGE_URL,
  COMPLIANCE_URL,
  X402_GATEWAY_URL,
  BAAS_API_URL,
};
