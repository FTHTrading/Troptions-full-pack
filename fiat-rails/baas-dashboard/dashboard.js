// fiat-rails/baas-dashboard/dashboard.js
const express = require('express');
const app = express();
app.use(express.json());

// In-memory client data
const clients = new Map();
const payments = new Map();

// Health check
app.get('/health', (req, res) => {
 res.json({ status: 'ok', service: 'baas-dashboard', port: 4029 });
});

// GET /dashboard - Main dashboard data
app.get('/dashboard', (req, res) => {
 const clientList = Array.from(clients.values());
 const totalVolume = Array.from(payments.values()).reduce((sum, p) => sum + p.amount, 0);
 const totalFees = Array.from(payments.values()).reduce((sum, p) => sum + (p.fee || 0), 0);
 
 res.json({
 clients: {
 total: clientList.length,
 active: clientList.filter(c => c.status === 'active').length,
 list: clientList
 },
 payments: {
 total: payments.size,
 volume: totalVolume,
 fees_collected: totalFees
 },
 revenue: {
 platform_fees: totalFees,
 transaction_fees: totalFees * 0.4, // Approximate
 total: totalFees * 1.4
 }
 });
});

// POST /clients - Onboard client
app.post('/clients', (req, res) => {
 const { name, tier = 'standard' } = req.body;
 const clientId = `baas_${Date.now()}`;
 
 clients.set(clientId, {
 client_id: clientId,
 name,
 tier,
 status: 'active',
 api_key: `key_${Math.random().toString(36).substring(2)}`,
 created_at: new Date().toISOString()
 });
 
 res.status(201).json({ client_id: clientId, status: 'active' });
});

// GET /clients
app.get('/clients', (req, res) => {
 res.json({ clients: Array.from(clients.values()) });
});

const PORT = process.env.PORT || 4029;
app.listen(PORT, () => {
 console.log(`BaaS Dashboard running on port ${PORT}`);
});
