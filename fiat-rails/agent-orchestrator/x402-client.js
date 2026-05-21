/**
 * x402 gateway client — fiat-rails :4030 (stats); Apostle mesh :4020 documented in README.
 */
const X402_V2_URL = process.env.X402_GATEWAY_URL || 'http://127.0.0.1:4030';
const X402_MESH_URL = process.env.X402_MESH_URL || 'http://127.0.0.1:4020';

const REGION_GATEWAYS = {
  us: process.env.X402_US_URL || 'http://127.0.0.1:4030',
  eu: process.env.X402_EU_URL || 'http://127.0.0.1:4034',
  jp: process.env.X402_JP_URL || 'http://127.0.0.1:4035',
};

async function getJson(url, headers = {}) {
  const res = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(10000),
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

/** Canonical stats: GET :4030/x402/stats (alias GET :4030/stats) */
async function getStats(region = 'us') {
  const base = (REGION_GATEWAYS[region] || X402_V2_URL).replace(/\/$/, '');
  const paths = ['/x402/stats', '/stats'];
  for (const p of paths) {
    const r = await getJson(`${base}${p}`);
    if (r.ok) {
      return { region, gateway: base, path: p, ...r.data, label: 'PIPELINE' };
    }
  }
  return {
    region,
    gateway: base,
    label: 'PIPELINE',
    revenue_label: 'PROJECTION',
    total_fees_usd: 0,
    requests_paid: 0,
    note: 'Stats stub — counters at zero until live x402 settlement',
  };
}

async function payAndFetch(path, query = {}, region = 'us') {
  const base = (REGION_GATEWAYS[region] || X402_V2_URL).replace(/\/$/, '');
  const qs = new URLSearchParams(query).toString();
  const url = `${base}${path}${qs ? `?${qs}` : ''}`;
  const unpaid = await getJson(url);
  if (unpaid.status === 402) {
    const mockProof = `mock_${Date.now()}`;
    const paid = await getJson(url, {
      'X-402-Payment': mockProof,
      'X-402-Wallet-Address': process.env.X402_WALLET || 'rAgentMock0000000000000000000',
    });
    return {
      mode: 'x402_mock',
      region,
      label: 'PIPELINE',
      invoice: unpaid.data,
      response: paid.data,
      status: paid.status,
    };
  }
  return { mode: 'direct', region, label: 'PIPELINE', response: unpaid.data, status: unpaid.status };
}

module.exports = {
  getStats,
  payAndFetch,
  X402_V2_URL,
  X402_MESH_URL,
  REGION_GATEWAYS,
};
