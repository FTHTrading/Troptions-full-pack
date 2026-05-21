// fiat-rails/arbitrage-bot — PM2 arbitrage-bot :4028
const express = require('express');
const arbitrator = require('./arbitrator');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'arbitrage-bot',
    port: Number(process.env.PORT) || 4028,
    dry_run: (process.env.DRY_RUN || 'true').toLowerCase() === 'true',
    label: 'PIPELINE',
  });
});

app.get('/status', (req, res) => res.json(arbitrator.getStatus()));

app.post('/start', (req, res) => {
  const interval = Number(req.body?.interval_ms) || 15000;
  arbitrator.startWatch(interval);
  res.json({ status: 'started', ...arbitrator.getStatus() });
});

app.post('/stop', (req, res) => {
  arbitrator.stopWatch();
  res.json({ status: 'stopped' });
});

app.post('/scan', async (req, res) => {
  try {
    const results = await arbitrator.runScan();
    res.json({ scanned: true, results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/trades', (req, res) => {
  res.json({ trades: arbitrator.getTrades(50), label: 'PIPELINE' });
});

const PORT = Number(process.env.PORT) || 4028;

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Arbitrage bot listening on :${PORT} DRY_RUN=${process.env.DRY_RUN || 'true'}`);
  });
}

module.exports = app;
