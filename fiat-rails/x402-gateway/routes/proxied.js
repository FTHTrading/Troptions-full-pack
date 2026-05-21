// fiat-rails/x402-gateway/routes/proxied.js
// x402-gated proxy routes for internal services

const express = require('express');
const router = express.Router();
const axios = require('axios');

// Payment verification (mock - implement with actual LND + XRPL in production)
async function verifyPayment(paymentProof, expectedAmount) {
 // TODO: Verify Lightning preimage or XRPL tx
 return { valid: true, amount: expectedAmount };
}

// Middleware: check x402 payment
async function x402Middleware(req, res, next) {
 const paymentProof = req.headers['x-402-payment'];
 const fee = req.x402Fee || 0.001; // Default fee
 
 if (!paymentProof) {
 // Return 402 with invoice
 return res.status(402).json({
 type: 'x402-invoice',
 network: 'lightning',
 invoice: `lnbc${Math.floor(fee * 100)}n1...`,
 amount: fee.toString(),
 currency: 'USD',
 description: `API access: ${req.path}`,
 expiry: 300
 });
 }
 
 try {
 const verified = await verifyPayment(paymentProof, fee);
 if (!verified.valid) {
 return res.status(402).json({ error: 'Invalid payment proof' });
 }
 req.x402Verified = true;
 next();
 } catch (err) {
 return res.status(402).json({ error: 'Payment verification failed' });
 }
}

// GET /x402/market-data/orderbook
// Returns orderbook data after x402 payment
router.get('/market-data/orderbook', x402Middleware, async (req, res) => {
 try {
 // Proxy to Exchange OS
 const exchangeUrl = process.env.EXCHANGE_OS_URL || 'http://localhost:8091';
 const response = await axios.get(`${exchangeUrl}/api/orderbook`, {
 params: req.query,
 timeout: 5000
 });
 
 res.json({
 ...response.data,
 x402_paid: true,
 data_source: 'exchange-os'
 });
 } catch (err) {
 console.error('Exchange OS error:', err.message);
 res.status(500).json({ error: 'Failed to fetch orderbook' });
 }
});

// POST /x402/exchange/place-order
// Places order after x402 payment (0.01% fee)
router.post('/exchange/place-order', async (req, res, next) => {
 const orderAmount = parseFloat(req.body.amount) || 0;
 const fee = orderAmount * 0.0001; // 0.01%
 req.x402Fee = fee;
 
 // Run x402 middleware
 const paymentProof = req.headers['x-402-payment'];
 if (!paymentProof) {
 return res.status(402).json({
 type: 'x402-invoice',
 network: 'lightning',
 invoice: `lnbc${Math.floor(fee * 100)}n1...`,
 amount: fee.toString(),
 currency: req.body.currency || 'USD',
 description: `Order placement fee: ${orderAmount} @ 0.01%`
 });
 }
 
 next();
}, async (req, res) => {
 try {
 const exchangeUrl = process.env.EXCHANGE_OS_URL || 'http://localhost:8091';
 const response = await axios.post(`${exchangeUrl}/api/orders`, req.body, {
 timeout: 10000
 });
 
 res.json({
 ...response.data,
 x402_paid: true,
 fee_charged: req.x402Fee
 });
 } catch (err) {
 console.error('Exchange order error:', err.message);
 res.status(500).json({ error: 'Failed to place order' });
 }
});

// POST /x402/cards/auth
// Neobank card authorization with $0.02 microfee
router.post('/cards/auth', async (req, res) => {
 const fee = 0.02;
 const paymentProof = req.headers['x-402-payment'];
 
 if (!paymentProof) {
 return res.status(402).json({
 type: 'x402-invoice',
 network: 'lightning',
 invoice: `lnbc2n1...`,
 amount: fee.toString(),
 currency: 'USD',
 description: 'Card authorization fee'
 });
 }
 
 try {
 // Proxy to Neobank API
 const neobankUrl = process.env.NEOBANK_URL || 'http://localhost:4026';
 const response = await axios.post(`${neobankUrl}/cards/authorize`, req.body, {
 timeout: 5000
 });
 
 res.json({
 ...response.data,
 x402_paid: true,
 fee_charged: fee
 });
 } catch (err) {
 console.error('Neobank auth error:', err.message);
 res.status(500).json({ error: 'Card authorization failed' });
 }
});

// POST /x402/baas/onboard
// BaaS onboarding with $10K setup fee
router.post('/baas/onboard', async (req, res) => {
 const setupFee = 10000;
 const paymentProof = req.headers['x-402-payment'];
 
 if (!paymentProof) {
 return res.status(402).json({
 type: 'x402-invoice',
 network: 'lightning',
 invoice: `lnbc${setupFee * 100}n1...`,
 amount: setupFee.toString(),
 currency: 'USD',
 description: 'BaaS onboarding fee'
 });
 }
 
 try {
 // Proxy to BaaS dashboard
 const baasUrl = process.env.BAAS_URL || 'http://localhost:4029';
 const response = await axios.post(`${baasUrl}/api/v1/tokens`, req.body, {
 headers: { 'X-402-Payment': paymentProof },
 timeout: 10000
 });
 
 res.json({
 ...response.data,
 x402_paid: true,
 fee_charged: setupFee
 });
 } catch (err) {
 console.error('BaaS onboard error:', err.message);
 res.status(500).json({ error: 'Onboarding failed' });
 }
});

// POST /x402/compliance/screen — proxy to compliance-engine :4025
router.post('/compliance/screen', async (req, res) => {
 const complianceUrl = (process.env.COMPLIANCE_URL || 'http://127.0.0.1:4025').replace(/\/$/, '');
 const region = process.env.REGION || req.gatewayRegion || 'us';
 try {
 const response = await axios.post(`${complianceUrl}/screen`, req.body, { timeout: 5000 });
 res.json({
 ...response.data,
 x402_gated: true,
 gateway_region: region,
 label: response.data?.label || 'PIPELINE',
 });
 } catch (err) {
 console.error('Compliance screen error:', err.message);
 res.status(502).json({
 approved: false,
 label: 'PIPELINE',
 gateway_region: region,
 error: 'compliance_unreachable',
 message: err.message,
 });
 }
});

// GET /x402/stats
// x402 revenue statistics
router.get('/stats', (req, res) => {
 const region = process.env.REGION || req.gatewayRegion || 'us';
 res.json({
 region,
 label: 'PIPELINE',
 revenue_label: 'PROJECTION',
 total_payments: 0,
 total_revenue: 0,
 atp_price_setting: 'operator PIPELINE strategy — pools not live',
 endpoints: {
 'market-data': { fee: 0.001, calls: 0 },
 'place-order': { fee: '0.01%', calls: 0 },
 'cards-auth': { fee: 0.02, calls: 0 },
 'baas-onboard': { fee: 10000, calls: 0 },
 'compliance-screen': { fee: 0, calls: 0 },
 },
 });
});

module.exports = router;
