/** JS mirror of payments.py — createInvoice / verifyPayment (mock in dev). */
const crypto = require('crypto');

const DEV_MOCK = (process.env.X402_DEV_MOCK_VERIFY || 'true').toLowerCase() === 'true';

function createInvoice(service, amountAtp, amountUsd, meta = {}) {
  const invoiceId = crypto
    .createHash('sha256')
    .update(`${service}:${amountAtp}:${Date.now()}`)
    .digest('hex')
    .slice(0, 24);
  return {
    invoice_id: invoiceId,
    service,
    amount_atp: amountAtp,
    amount_usd: amountUsd,
    status: 'pending',
    pay_endpoint: '/v1/pay',
    label: 'PIPELINE',
    meta,
    disclaimer: 'PROJECTION — dev mock settlement',
  };
}

function verifyPayment(receiptId, expectedAtp) {
  if (DEV_MOCK && receiptId) {
    return { ok: true, receipt_id: receiptId, staged: true, mode: 'dev_mock', label: 'PIPELINE' };
  }
  if (!receiptId) return { ok: false, error: 'missing receipt_id' };
  return { ok: false, error: 'receipt not found' };
}

module.exports = { createInvoice, verifyPayment };
