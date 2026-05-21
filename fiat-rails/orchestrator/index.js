// fiat-rails/orchestrator — PM2 payment-orchestrator :4022
const express = require('express');
const morgan = require('morgan');
const wireRoutes = require('./routes/wire');
const arbitrageRoutes = require('./routes/arbitrage');

const app = express();
app.use(express.json());
app.use(morgan('combined'));

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'payment-orchestrator',
    label: process.env.ISSUER_SEED ? 'PIPELINE' : 'PIPELINE',
    port: Number(process.env.PORT) || 4022,
    issuer_seed_configured: Boolean(process.env.ISSUER_SEED),
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  });
});

app.use('/api/v1/payments', wireRoutes);
app.use('/api/v1/arbitrage', arbitrageRoutes);

app.use((err, req, res, next) => {
  console.error('Orchestrator error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const PORT = Number(process.env.PORT) || 4022;

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Payment Orchestrator listening on :${PORT}`);
    console.log(`Wire webhook: POST http://127.0.0.1:${PORT}/api/v1/payments/wire`);
    console.log(`Arbitrage: POST http://127.0.0.1:${PORT}/api/v1/arbitrage`);
  });
}

module.exports = app;
