// fiat-rails/orchestrator/routes/redeem.js
// IOU Burn → Fiat Wire (redemption flow)
const express = require('express');
const router = express.Router();
const axios = require('axios');
const crypto = require('crypto');

const COMPLIANCE_URL = process.env.COMPLIANCE_URL || 'http://localhost:4025';
const FEDWIRE_ADAPTER = process.env.FEDWIRE_ADAPTER || 'http://localhost:4023';
const SWIFT_BRIDGE = process.env.SWIFT_BRIDGE || 'http://localhost:4024';
const ISSUER_ADDRESS = process.env.ISSUER_ADDRESS || 'rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ';

const redemptions = new Map();

// POST /api/v1/payments/redeem
// User wants to redeem IOU for fiat
router.post('/redeem', async (req, res) => {
 const { iou_amount, currency, user_address, bank_account, wire_instructions } = req.body;

 if (!iou_amount || !currency || !user_address || !bank_account) {
 return res.status(400).json({ error: 'iou_amount, currency, user_address, and bank_account are required' });
 }

 const redemptionId = crypto.randomUUID();
 redemptions.set(redemptionId, {
 status: 'pending',
 iou_amount,
 currency,
 user_address,
 bank_account,
 wire_instructions,
 created: new Date().toISOString()
 });

 try {
 console.log(`[${redemptionId}] Processing redemption: ${iou_amount} ${currency}`);

 // 1. Verify user holds the IOU (call XRPL)
 // TODO: Implement XRPL balance check
 
 // 2. Compliance check
 const compRes = await axios.post(`${COMPLIANCE_URL}/screen`, {
 payment_id: redemptionId,
 sender: { address: user_address },
 amount: iou_amount,
 currency,
 type: 'redemption'
 }, { timeout: 5000 });

 if (!compRes.data.approved) {
 redemptions.get(redemptionId).status = 'compliance_hold';
 return res.status(422).json({
 redemption_id: redemptionId,
 status: 'compliance_hold',
 message: compRes.data.reason
 });
 }

 // 3. Calculate redemption fee (0.25%)
 const fee = iou_amount * 0.0025;
 const net_amount = iou_amount - fee;

 // 4. Initiate wire via FedWire adapter
 const wireResult = await axios.post(`${FEDWIRE_ADAPTER}/send`, {
 amount: net_amount,
 currency,
 recipient_account: bank_account,
 wire_instructions,
 reference: `Redemption ${redemptionId}`
 }, { timeout: 10000 });

 // 5. Burn IOU on XRPL (TODO: implement actual burn)
 // For now, mark as burned
 
 redemptions.get(redemptionId).status = 'wire_sent';
 redemptions.get(redemptionId).wire_reference = wireResult.data.wire_ref;
 redemptions.get(redemptionId).fee = fee;
 redemptions.get(redemptionId).net_amount = net_amount;
 redemptions.get(redemptionId).sent_at = new Date().toISOString();

 return res.status(201).json({
 redemption_id: redemptionId,
 status: 'wire_sent',
 wire_reference: wireResult.data.wire_ref,
 gross_amount: iou_amount,
 fee: fee,
 net_amount: net_amount,
 currency,
 message: `Wire sent for ${net_amount} ${currency}. Fee: ${fee} ${currency}`
 });

 } catch (err) {
 console.error(`[${redemptionId}] Redemption failed:`, err.message);
 redemptions.get(redemptionId).status = 'failed';
 redemptions.get(redemptionId).error = err.message;
 return res.status(500).json({
 redemption_id: redemptionId,
 status: 'failed',
 error: err.message
 });
 }
});

// GET /api/v1/payments/redeem/:id
router.get('/redeem/:id', (req, res) => {
 const r = redemptions.get(req.params.id);
 if (!r) return res.status(404).json({ error: 'Redemption not found' });
 res.json({ redemption_id: req.params.id, ...r });
});

module.exports = router;
