// Wire deposit → IOU mint (core business path)
const express = require('express');
const router = express.Router();
const axios = require('axios');
const crypto = require('crypto');
const { issueIou } = require('../lib/issueIou');

const COMPLIANCE_URL = process.env.COMPLIANCE_URL || 'http://127.0.0.1:4025';
const FEDWIRE_ADAPTER = process.env.FEDWIRE_ADAPTER || 'http://127.0.0.1:4023';
const ISSUER_ADDRESS = process.env.ISSUER_ADDRESS || 'rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ';

const payments = new Map();

// POST /api/v1/payments/wire — bank webhook when wire is received
router.post('/wire', async (req, res) => {
  const { source_wire_ref, amount, currency, sender_info, recipient_address, reference } =
    req.body;

  if (!amount || !currency || !recipient_address) {
    return res.status(400).json({
      error: 'amount, currency, and recipient_address are required',
    });
  }

  const paymentId = crypto.randomUUID();
  payments.set(paymentId, {
    status: 'pending',
    amount,
    currency,
    recipient_address,
    sender_info,
    source_wire_ref,
    reference,
    created: new Date().toISOString(),
  });

  try {
    const compRes = await axios.post(
      `${COMPLIANCE_URL}/screen`,
      {
        payment_id: paymentId,
        sender: sender_info || {},
        amount,
        currency,
        wire_ref: source_wire_ref,
      },
      { timeout: 5000 }
    );

    if (!compRes.data.approved) {
      payments.get(paymentId).status = 'compliance_hold';
      return res.status(422).json({
        payment_id: paymentId,
        status: 'compliance_hold',
        label: compRes.data.label || 'PIPELINE',
        message: compRes.data.reason || 'Compliance check failed',
      });
    }

    await axios.post(
      `${FEDWIRE_ADAPTER}/verify`,
      { wire_ref: source_wire_ref, amount, currency },
      { timeout: 10000 }
    );

    const iouResult = await issueIou({
      recipient: recipient_address,
      value: String(amount),
      currency,
      memo: `IOU issuance for wire ${source_wire_ref || paymentId}`,
    });

    const record = payments.get(paymentId);
    record.status = 'iou_issued';
    record.iou_tx_hash = iouResult.tx_hash;
    record.wire_reference = source_wire_ref;
    record.compliance_check = compRes.data;
    record.issued_at = new Date().toISOString();
    record.label = iouResult.label || (iouResult.simulated ? 'PIPELINE' : 'PROVEN');

    notifyExchangeOS(paymentId, record).catch((err) => {
      console.error(`[${paymentId}] Exchange OS notify failed:`, err.message);
    });

    return res.status(201).json({
      payment_id: paymentId,
      status: 'iou_issued',
      label: record.label,
      iou_tx_hash: iouResult.tx_hash,
      issuer: ISSUER_ADDRESS,
      amount,
      currency,
      recipient_address,
      message: `Issued ${amount} ${currency} IOU to ${recipient_address}`,
      wire_reference: source_wire_ref,
      pipeline: iouResult.simulated === true,
    });
  } catch (err) {
    const record = payments.get(paymentId);
    if (record) {
      record.status = 'failed';
      record.error = err.message;
    }
    return res.status(500).json({
      payment_id: paymentId,
      status: 'failed',
      error: err.message,
      step: err.step || 'unknown',
    });
  }
});

// GET /api/v1/payments/:id
router.get('/:id', (req, res) => {
  const p = payments.get(req.params.id);
  if (!p) return res.status(404).json({ error: 'Payment not found' });
  res.json({ payment_id: req.params.id, ...p });
});

router.get('/', (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const status = req.query.status;

  let allPayments = Array.from(payments.entries()).map(([id, data]) => ({
    payment_id: id,
    ...data,
  }));

  if (status) {
    allPayments = allPayments.filter((p) => p.status === status);
  }

  allPayments.sort((a, b) => new Date(b.created) - new Date(a.created));
  const start = (page - 1) * limit;

  res.json({
    payments: allPayments.slice(start, start + limit),
    total: allPayments.length,
    page,
    limit,
    status_filter: status || 'all',
  });
});

async function notifyExchangeOS(paymentId, payment) {
  const exchangeUrl = process.env.EXCHANGE_OS_URL;
  if (!exchangeUrl) return;

  await axios.post(
    `${exchangeUrl}/api/internal/deposit`,
    {
      payment_id: paymentId,
      user_address: payment.recipient_address,
      amount: payment.amount,
      currency: payment.currency,
      tx_hash: payment.iou_tx_hash,
    },
    { timeout: 5000 }
  );
}

module.exports = router;
