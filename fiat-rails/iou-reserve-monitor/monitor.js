// fiat-rails/iou-reserve-monitor/monitor.js
const express = require('express');
const app = express();

// In-memory metrics (use Prometheus/Grafana in production)
let iouIssued = 0;
let fiatReserve = 0;
let lastCheck = null;

// Health check
app.get('/health', (req, res) => {
 res.json({ status: 'ok', service: 'iou-reserve-monitor', port: 4027 });
});

// GET /metrics - Prometheus-compatible metrics
app.get('/metrics', (req, res) => {
 const metrics = `
# HELP iou_total_issued Total IOU issued
# TYPE iou_total_issued gauge
iou_total_issued ${iouIssued}

# HELP fiat_reserve_total Total fiat reserve in USD
# TYPE fiat_reserve_total gauge
fiat_reserve_total ${fiatReserve}

# HELP iou_reserve_ratio Ratio of IOU to fiat reserve
# TYPE iou_reserve_ratio gauge
iou_reserve_ratio ${fiatReserve > 0 ? (iouIssued / fiatReserve).toFixed(4) : 0}

# HELP last_reserve_check Timestamp of last reserve check
# TYPE last_reserve_check gauge
last_reserve_check ${lastCheck ? new Date(lastCheck).getTime() / 1000 : 0}
`;
 res.set('Content-Type', 'text/plain');
 res.send(metrics);
});

// GET /status - Reserve status
app.get('/status', (req, res) => {
 const ratio = fiatReserve > 0 ? iouIssued / fiatReserve : 0;
 const healthy = ratio <= 1.0; // Should be 1:1 backed
 
 res.json({
 status: healthy ? 'healthy' : 'under_collateralized',
 iou_issued: iouIssued,
 fiat_reserve: fiatReserve,
 ratio: ratio.toFixed(4),
 backing_percentage: (ratio * 100).toFixed(2) + '%',
 last_check: lastCheck,
 issuer_address: process.env.ISSUER_ADDRESS || 'rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ'
 });
});

// POST /update - Update reserve data (called by orchestrator)
app.post('/update', (req, res) => {
 const { iou_amount, fiat_amount } = req.body;
 if (iou_amount !== undefined) iouIssued = iou_amount;
 if (fiat_amount !== undefined) fiatReserve = fiat_amount;
 lastCheck = new Date().toISOString();
 
 res.json({
 updated: true,
 iou_issued: iouIssued,
 fiat_reserve: fiatReserve,
 ratio: fiatReserve > 0 ? (iouIssued / fiatReserve).toFixed(4) : 0
 });
});

// Simulate checking XRPL for actual IOU supply
async function checkXrplReserve() {
 // In production: query XRPL for actual issued IOUs
 console.log('Checking XRPL reserve...');
 // Would call: xrpl.account_lines(issuer_address)
}

const PORT = process.env.PORT || 4027;
app.listen(PORT, () => {
 console.log(`IOU Reserve Monitor running on port ${PORT}`);
 console.log('Metrics: http://localhost:' + PORT + '/metrics');
});
