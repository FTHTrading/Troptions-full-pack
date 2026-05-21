// fiat-rails/baas-dashboard/api/billing.js
// x402 billing and payment history

const express = require('express');
const router = express.Router();

const invoices = new Map();
const payments = new Map();

// POST /api/v1/billing/invoices
// Create a new invoice
router.post('/invoices', (req, res) => {
 const { amount, currency, description, client_id } = req.body;
 
 const invoiceId = `inv_${Date.now()}`;
 const invoice = {
 invoice_id: invoiceId,
 amount,
 currency: currency || 'USD',
 description,
 client_id,
 status: 'pending',
 created_at: new Date().toISOString(),
 paid_at: null
 };
 
 invoices.set(invoiceId, invoice);
 
 res.status(201).json({
 invoice_id: invoiceId,
 status: 'pending',
 payment_request: {
 type: 'x402-invoice',
 network: 'lightning',
 invoice: `lnbc${amount * 100}n1...`,
 amount: amount.toString(),
 currency: currency || 'USD',
 description,
 expiry: 3600
 }
 });
});

// POST /api/v1/billing/invoices/:id/pay
// Mark invoice as paid
router.post('/invoices/:id/pay', (req, res) => {
 const invoice = invoices.get(req.params.id);
 if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
 
 invoice.status = 'paid';
 invoice.paid_at = new Date().toISOString();
 
 payments.set(req.params.id, {
 payment_id: `pay_${Date.now()}`,
 invoice_id: req.params.id,
 amount: invoice.amount,
 currency: invoice.currency,
 paid_at: invoice.paid_at
 });
 
 res.json({
 invoice_id: req.params.id,
 status: 'paid',
 amount: invoice.amount,
 paid_at: invoice.paid_at
 });
});

// GET /api/v1/billing/history
router.get('/history', (req, res) => {
 const allPayments = Array.from(payments.values());
 res.json({
 payments: allPayments,
 total: allPayments.length,
 total_revenue: allPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0)
 });
});

// GET /api/v1/billing/revenue
router.get('/revenue', (req, res) => {
 const allPayments = Array.from(payments.values());
 const monthly = {};
 
 allPayments.forEach(p => {
 const month = p.paid_at.substring(0, 7); // YYYY-MM
 if (!monthly[month]) monthly[month] = 0;
 monthly[month] += parseFloat(p.amount);
 });
 
 res.json({
 total_revenue: allPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0),
 by_month: monthly,
 breakdown: {
 setup_fees: allPayments.filter(p => p.description?.includes('setup')).reduce((s, p) => s + parseFloat(p.amount), 0),
 pool_fees: allPayments.filter(p => p.description?.includes('pool')).reduce((s, p) => s + parseFloat(p.amount), 0),
 data_fees: allPayments.filter(p => p.description?.includes('data')).reduce((s, p) => s + parseFloat(p.amount), 0)
 }
 });
});

module.exports = router;
