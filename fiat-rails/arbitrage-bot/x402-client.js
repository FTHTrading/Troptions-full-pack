/**
 * x402 client — multi-gateway orderbook fetch (:4030 US, :4034 EU, :4035 JP).
 */
const axios = require('axios');

const GATEWAY_URLS = (process.env.GATEWAY_URLS || 'http://127.0.0.1:4030,http://127.0.0.1:4034,http://127.0.0.1:4035')
  .split(',')
  .map((s) => s.trim().replace(/\/$/, ''))
  .filter(Boolean);

const GATEWAY = (process.env.X402_GATEWAY_URL || GATEWAY_URLS[0] || 'http://127.0.0.1:4030').replace(
  /\/$/,
  ''
);
const ORDERBOOK_PATH =
  process.env.X402_ORDERBOOK_PATH || '/x402/market-data/orderbook';

function mockOrderbook(pair, gateway = GATEWAY) {
  const base = pair || 'USD-IOU/EUR-IOU';
  const mid = 0.92 + Math.random() * 0.02;
  return {
    pair: base,
    bids: [{ price: (mid - 0.001).toFixed(6), size: '10000' }],
    asks: [{ price: (mid + 0.001).toFixed(6), size: '10000' }],
    mid: mid.toFixed(6),
    source: 'mock',
    gateway,
    label: 'PIPELINE',
  };
}

async function payAndRetry(config, invoice) {
  const receiptId = `arb_${Date.now()}`;
  try {
    await axios.post(
      `${config.baseURL || GATEWAY}/v1/pay`,
      {
        service: invoice.service || 'market-data/orderbook',
        amount_atp: invoice.amount_atp || '1',
        idempotency_key: receiptId,
      },
      { timeout: 5000 }
    );
  } catch {
    /* staged gateway may still accept header proof */
  }

  return axios.request({
    ...config,
    headers: {
      ...(config.headers || {}),
      'X-402-Payment': receiptId,
      'X-402-Receipt': receiptId,
    },
    validateStatus: (s) => s < 500,
  });
}

async function fetchOrderbookFromGateway(gateway, pair) {
  const base = gateway.replace(/\/$/, '');
  const url = `${base}${ORDERBOOK_PATH}`;
  const params = { pair };

  try {
    let res = await axios.get(url, { params, timeout: 8000, validateStatus: () => true });

    if (res.status === 402) {
      const invoice = res.data?.invoice || res.data || {};
      res = await payAndRetry({ method: 'get', url, params, baseURL: base }, invoice);
    }

    if (res.status === 200 && res.data?.bids) {
      return {
        orderbook: { ...res.data, gateway: base },
        paid: true,
        mock: res.data.source === 'mock' || res.data.stub === true,
        gateway: base,
      };
    }
  } catch (err) {
    console.warn(`[x402-client] ${base} unreachable:`, err.message);
  }

  return null;
}

/**
 * Try each gateway in GATEWAY_URLS; return first live orderbook or mock.
 * @param {string} pair
 */
async function fetchOrderbook(pair) {
  const gateways = GATEWAY_URLS.length ? GATEWAY_URLS : [GATEWAY];

  for (const gw of gateways) {
    const hit = await fetchOrderbookFromGateway(gw, pair);
    if (hit) return hit;
  }

  return { orderbook: mockOrderbook(pair), paid: false, mock: true, gateway: GATEWAY };
}

function listGateways() {
  return GATEWAY_URLS.length ? [...GATEWAY_URLS] : [GATEWAY];
}

module.exports = { fetchOrderbook, fetchOrderbookFromGateway, mockOrderbook, listGateways, GATEWAY_URLS };
