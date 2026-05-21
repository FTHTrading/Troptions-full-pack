// fiat-rails/orchestrator/routes/baas.js
// Banking-as-a-Service API endpoints
const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// BaaS client store (use PostgreSQL in production)
const baasClients = new Map();

// POST /api/v1/baas/clients
// Onboard a new BaaS client
router.post('/clients', async (req, res) => {
 const { name, domain, contact_email, tier } = req.body;
 
 if (!name || !domain || !contact_email) {
 return res.status(400).json({ error: 'name, domain, and contact_email are required' });
 }

 const clientId = crypto.randomUUID();
 const apiKey = `baas_${crypto.randomBytes(16).toString('hex')}`;
 
 baasClients.set(clientId, {
 client_id: clientId,
 name,
 domain,
 contact_email,
 tier: tier || 'standard', // standard, premium, enterprise
 api_key: apiKey,
 status: 'active',
 created_at: new Date().toISOString(),
 monthly_fee: tier === 'enterprise' ? 25000 : tier === 'premium' ? 10000 : 5000,
 transaction_fee: 0.0025, // 0.25%
 volume_this_month: 0
 });

 res.status(201).json({
 client_id: clientId,
 api_key: apiKey,
 name,
 status: 'active',
 message: 'BaaS client onboarded successfully',
 endpoints: {
 payments: `/api/v1/baas/${clientId}/payments`,
 users: `/api/v1/baas/${clientId}/users`,
 transactions: `/api/v1/baas/${clientId}/transactions`
 }
 });
});

// GET /api/v1/baas/clients/:id
router.get('/clients/:id', (req, res) => {
 const client = baasClients.get(req.params.id);
 if (!client) return res.status(404).json({ error: 'Client not found' });
 
 // Don't return API key in GET
 const { api_key, ...safeClient } = client;
 res.json(safeClient);
});

// GET /api/v1/baas/clients
router.get('/clients', (req, res) => {
 const clients = Array.from(baasClients.values()).map(c => {
 const { api_key, ...safe } = c;
 return safe;
 });
 res.json({ clients, count: clients.length });
});

// POST /api/v1/baas/:clientId/payments
// Create a payment for a BaaS client
router.post('/:clientId/payments', async (req, res) => {
 const client = baasClients.get(req.params.clientId);
 if (!client) return res.status(404).json({ error: 'Client not found' });

 const { amount, currency, recipient, type } = req.body;
 
 // Validate API key
 const authKey = req.headers['x-api-key'];
 if (authKey !== client.api_key) {
 return res.status(401).json({ error: 'Invalid API key' });
 }

 // Calculate fees
 const platformFee = client.monthly_fee;
 const txnFee = amount * client.transaction_fee;
 const totalFee = platformFee + txnFee;

 const paymentId = crypto.randomUUID();
 
 res.status(201).json({
 payment_id: paymentId,
 client_id: req.params.clientId,
 status: 'pending',
 amount,
 currency,
 recipient,
 type,
 fees: {
 platform_fee: platformFee,
 transaction_fee: txnFee,
 total: totalFee
 },
 net_amount: amount - txnFee,
 message: 'Payment created. Awaiting settlement.'
 });
});

// GET /api/v1/baas/:clientId/transactions
router.get('/:clientId/transactions', (req, res) => {
 const client = baasClients.get(req.params.clientId);
 if (!client) return res.status(404).json({ error: 'Client not found' });

 // Return mock transactions
 res.json({
 client_id: req.params.clientId,
 transactions: [
 {
 id: 'txn_001',
 type: 'iou_issuance',
 amount: 10000,
 currency: 'USD',
 fee: 25.00,
 status: 'completed',
 created_at: new Date().toISOString()
 }
 ],
 total_volume: client.volume_this_month
 });
});

// GET /api/v1/baas/pricing
router.get('/pricing', (req, res) => {
 res.json({
 tiers: [
 {
 name: 'standard',
 monthly_fee: 5000,
 transaction_fee: 0.0025,
 features: ['USD IOU', 'FedWire', 'Basic compliance']
 },
 {
 name: 'premium',
 monthly_fee: 10000,
 transaction_fee: 0.0020,
 features: ['Multi-currency', 'SWIFT', 'Advanced compliance', 'Priority support']
 },
 {
 name: 'enterprise',
 monthly_fee: 25000,
 transaction_fee: 0.0015,
 features: ['Custom IOU', 'Dedicated account manager', 'White-label', 'SLA']
 }
 ]
 });
});

module.exports = router;
