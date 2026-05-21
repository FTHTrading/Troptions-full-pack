// fiat-rails/x402-gateway/server.js
// x402 Gateway with paid proxy routes

const express = require('express');
const app = express();
app.use(express.json());

const proxiedRoutes = require('./routes/proxied');

// Health check
app.get('/health', (req, res) => {
 res.json({ status: 'ok', service: 'x402-gateway', port: 4030, version: '2.0.0' });
});

// Mount proxied routes
app.use('/x402', proxiedRoutes);

// Alias — curl http://127.0.0.1:4030/stats (same payload as /x402/stats)
app.get('/stats', (req, res) => res.redirect(307, '/x402/stats'));

// Legacy x402 endpoints (compatibility)
app.get('/status', (req, res) => {
 res.json({
 mode: 'production',
 apostle_connected: true,
 networks: ['lightning', 'xrpl'],
 total_payments_processed: 0
 });
});

const PORT = process.env.PORT || 4030;
app.listen(PORT, () => {
 console.log(`x402 Gateway v2.0 running on port ${PORT}`);
 console.log('Endpoints:');
 console.log('  GET  /x402/market-data/orderbook  - Orderbook data (paid)');
 console.log('  POST /x402/exchange/place-order   - Place order (0.01% fee)');
 console.log('  POST /x402/cards/auth             - Card auth ($0.02 fee)');
 console.log('  POST /x402/baas/onboard           - BaaS onboarding ($10K)');
 console.log('  GET  /x402/stats                  - Revenue stats');
});

module.exports = app;
