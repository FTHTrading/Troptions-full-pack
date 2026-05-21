// fiat-rails/baas-dashboard/server.js
// Main BaaS Dashboard server with x402 integration

const express = require('express');
const app = express();
app.use(express.json());

// Import routes
const tokenRoutes = require('./api/tokens');
const billingRoutes = require('./api/billing');

// Health check
app.get('/health', (req, res) => {
 res.json({ status: 'ok', service: 'baas-dashboard', port: 4029, version: '1.0.0' });
});

// API routes
app.use('/api/v1/tokens', tokenRoutes);
app.use('/api/v1/billing', billingRoutes);

// Dashboard overview
app.get('/api/v1/dashboard', (req, res) => {
 res.json({
 status: 'active',
 services: {
 tokens: 'online',
 pools: 'online',
 billing: 'online',
 arbitrage: 'online'
 },
 endpoints: {
 tokens: '/api/v1/tokens',
 pools: '/api/v1/tokens/:id/pools',
 revenue: '/api/v1/tokens/:id/revenue',
 billing: '/api/v1/billing/history',
 pricing: '/api/v1/billing/pricing'
 }
 });
});

// Pricing tiers
app.get('/api/v1/billing/pricing', (req, res) => {
 res.json({
 tiers: [
 {
 name: 'standard',
 monthly_fee: 5000,
 transaction_fee: 0.0025,
 features: ['USD IOU', 'FedWire', 'Basic compliance', '1 pool']
 },
 {
 name: 'premium',
 monthly_fee: 10000,
 transaction_fee: 0.0020,
 features: ['Multi-currency', 'SWIFT', 'Advanced compliance', '10 pools', 'Priority support']
 },
 {
 name: 'enterprise',
 monthly_fee: 25000,
 transaction_fee: 0.0015,
 features: ['Custom IOU', 'Dedicated account manager', 'White-label', 'SLA', 'Unlimited pools']
 }
 ]
 });
});

// Error handler
app.use((err, req, res, next) => {
 console.error('BaaS Dashboard error:', err);
 res.status(500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 4029;
app.listen(PORT, () => {
 console.log(`BaaS Dashboard running on port ${PORT}`);
 console.log('Endpoints:');
 console.log('  POST /api/v1/tokens           - Onboard token ($10K setup)');
 console.log('  POST /api/v1/tokens/:id/pools - Create liquidity pool');
 console.log('  GET  /api/v1/tokens/:id/revenue - Revenue dashboard');
 console.log('  GET  /api/v1/billing/history  - Payment history');
 console.log('  GET  /api/v1/billing/pricing  - Pricing tiers');
});

module.exports = app;
