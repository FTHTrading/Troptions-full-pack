/**
 * Regional x402 gateway stub — proxies to Exchange OS; REGION from env.
 * Legacy stub — prefer x402-gateway-eu (:4034) and x402-gateway-jp (:4035).
 * us :4030 | eu :4034 | jp :4035 | MCP XRPL reserved :4032
 */
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 4030;
const REGION = (process.env.REGION || 'us').toLowerCase();
const EXCHANGE_OS_URL = process.env.EXCHANGE_OS_URL || 'http://127.0.0.1:8091';

const REGION_META = {
  us: { city: 'New York', code: 'NY', timezone: 'America/New_York' },
  eu: { city: 'Frankfurt', code: 'DE-FRA', timezone: 'Europe/Berlin' },
  jp: { city: 'Tokyo', code: 'JP-TYO', timezone: 'Asia/Tokyo' },
};

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: `x402-gateway-${REGION}`,
    region: REGION,
    port: PORT,
    meta: REGION_META[REGION] || { city: REGION, code: REGION },
    label: 'PIPELINE',
    upstream_exchange: EXCHANGE_OS_URL,
  });
});

app.get('/x402/stats', (req, res) => {
  res.json({
    region: REGION,
    label: 'PIPELINE',
    revenue_label: 'PROJECTION',
    total_fees_usd: 0,
    requests_paid: 0,
    atp_price_setting: 'operator PIPELINE strategy — not live',
    meta: REGION_META[REGION],
  });
});

app.get('/stats', (req, res) => res.redirect(307, '/x402/stats'));

app.get('/x402/market-data/orderbook', async (req, res) => {
  const paymentProof = req.headers['x-402-payment'];
  if (!paymentProof) {
    return res.status(402).json({
      type: 'x402-invoice',
      region: REGION,
      amount: '0.001',
      currency: 'USD',
      label: 'PIPELINE',
    });
  }
  try {
    const response = await axios.get(`${EXCHANGE_OS_URL}/api/orderbook`, {
      params: req.query,
      timeout: 5000,
    });
    res.json({
      ...response.data,
      region: REGION,
      x402_paid: true,
      label: 'PIPELINE',
    });
  } catch (err) {
    res.json({
      region: REGION,
      label: 'PIPELINE',
      stub: true,
      pair: req.query.pair || 'USD-IOU/EUR-IOU',
      bids: [],
      asks: [],
      note: err.message,
    });
  }
});

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`x402 regional gateway [${REGION}] on :${PORT}`);
  });
}

module.exports = app;
