/**
 * Shared x402 gateway v2 factory — US :4030, EU :4034, JP :4035 (MCP XRPL :4032)
 */
const express = require('express');
const proxiedRoutes = require('./routes/proxied');

const REGION_META = {
  us: { city: 'New York', code: 'US-NYC', base_currency: 'USD', default_port: 4030 },
  eu: { city: 'Frankfurt', code: 'EU-FRA', base_currency: 'EUR', default_port: 4034 },
  jp: { city: 'Tokyo', code: 'JP-TYO', base_currency: 'JPY', default_port: 4035 },
};

function createGatewayApp(options = {}) {
  const region = (options.region || process.env.REGION || 'us').toLowerCase();
  const meta = REGION_META[region] || {
    city: region,
    code: region.toUpperCase(),
    base_currency: process.env.BASE_CURRENCY || 'USD',
    default_port: 4030,
  };
  const port = Number(options.port || process.env.PORT || meta.default_port);

  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    req.gatewayRegion = region;
    next();
  });

  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: region === 'us' ? 'x402-gateway-v2' : `x402-gateway-${region}`,
      region,
      port,
      version: '2.0.0',
      base_currency: process.env.BASE_CURRENCY || meta.base_currency,
      issuer_hint: process.env.ISSUER_HINT || '',
      exchange_os_url: process.env.EXCHANGE_OS_URL || 'http://127.0.0.1:8091',
      compliance_url: process.env.COMPLIANCE_URL || 'http://127.0.0.1:4025',
      label: 'PIPELINE',
      meta,
    });
  });

  app.use('/x402', proxiedRoutes);
  app.get('/stats', (_req, res) => res.redirect(307, '/x402/stats'));

  app.get('/status', (_req, res) => {
    res.json({
      mode: 'production',
      region,
      apostle_connected: region === 'us',
      networks: ['lightning', 'xrpl'],
      total_payments_processed: 0,
      label: 'PIPELINE',
    });
  });

  return { app, region, port, meta };
}

function listenGateway(options = {}) {
  const { app, region, port } = createGatewayApp(options);
  app.listen(port, '0.0.0.0', () => {
    console.log(`x402 Gateway [${region}] v2.0 on :${port}`);
    console.log('  GET  /x402/market-data/orderbook');
    console.log('  POST /x402/exchange/place-order');
    console.log('  POST /x402/cards/auth');
    console.log('  POST /x402/baas/onboard');
    console.log('  POST /x402/compliance/screen');
    console.log('  GET  /x402/stats');
  });
  return app;
}

module.exports = { createGatewayApp, listenGateway, REGION_META };
