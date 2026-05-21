// fiat-rails/neobank-api/server.js
const express = require('express');
const app = express();
app.use(express.json());

// In-memory user store (use PostgreSQL in production)
const users = new Map();
const accounts = new Map();
const cards = new Map();
const transactions = new Map();

// Health check
app.get('/health', (req, res) => {
 res.json({ status: 'ok', service: 'neobank-api', port: 4026 });
});

// POST /accounts - Create account
app.post('/accounts', (req, res) => {
 const { user_id, account_type = 'checking' } = req.body;
 const accountId = `acc_${Date.now()}`;
 const routingNumber = process.env.FEDWIRE_ROUTING || '021000021';
 
 accounts.set(accountId, {
 account_id: accountId,
 user_id,
 account_type,
 routing_number: routingNumber,
 balance_usd: 0,
 balance_iou: 0,
 status: 'active',
 created_at: new Date().toISOString()
 });
 
 res.status(201).json({
 account_id: accountId,
 user_id,
 routing_number: routingNumber,
 status: 'active',
 message: 'Account created'
 });
});

// GET /accounts/:id
app.get('/accounts/:id', (req, res) => {
 const account = accounts.get(req.params.id);
 if (!account) return res.status(404).json({ error: 'Account not found' });
 res.json(account);
});

// POST /cards - Issue debit card
app.post('/cards', (req, res) => {
 const { account_id, card_type = 'virtual' } = req.body;
 const cardId = `card_${Date.now()}`;
 
 cards.set(cardId, {
 card_id: cardId,
 account_id,
 card_type,
 last_four: Math.floor(1000 + Math.random() * 8999).toString(),
 status: 'active',
 issued_at: new Date().toISOString()
 });
 
 res.status(201).json({
 card_id: cardId,
 account_id,
 last_four: cards.get(cardId).last_four,
 status: 'active'
 });
});

// POST /cards/authorize - Authorize card transaction
app.post('/cards/authorize', async (req, res) => {
 const { card_id, amount, merchant } = req.body;
 
 const card = cards.get(card_id);
 if (!card) return res.status(404).json({ error: 'Card not found' });
 
 const account = accounts.get(card.account_id);
 if (!account) return res.status(404).json({ error: 'Account not found' });
 
 // Check balance
 if (account.balance_iou < amount) {
 return res.status(402).json({ error: 'Insufficient funds', balance: account.balance_iou });
 }
 
 // Reserve funds (lock)
 account.balance_iou -= amount;
 account.reserved = (account.reserved || 0) + amount;
 
 const txnId = `txn_${Date.now()}`;
 transactions.set(txnId, {
 txn_id: txnId,
 card_id,
 account_id: card.account_id,
 amount,
 merchant,
 status: 'authorized',
 created_at: new Date().toISOString()
 });
 
 res.json({
 authorized: true,
 txn_id: txnId,
 amount,
 balance_remaining: account.balance_iou
 });
});

// GET /transactions
app.get('/transactions', (req, res) => {
 const all = Array.from(transactions.values()).slice(0, 50);
 res.json({ transactions: all });
});

const PORT = process.env.PORT || 4026;
app.listen(PORT, () => {
 console.log(`Neobank API running on port ${PORT}`);
});
