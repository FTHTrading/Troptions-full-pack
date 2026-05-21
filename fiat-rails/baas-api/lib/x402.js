/**
 * x402 gate — returns 402 invoice or accepts X-402-Payment (**PIPELINE** stub verify).
 */
const crypto = require('crypto');

const GATEWAY = process.env.X402_GATEWAY_URL || 'http://127.0.0.1:4020';

function requireApiKey(req, res) {
  const expected = process.env.BAAS_API_KEY;
  if (!expected) return true;
  const key = req.headers['x-api-key'] || req.headers['authorization']?.replace(/^Bearer\s+/i, '');
  if (key !== expected) {
    res.status(401).json({ error: 'Invalid or missing BAAS_API_KEY', label: 'PIPELINE' });
    return false;
  }
  return true;
}

function walletHeader(req) {
  return req.headers['x-402-wallet-address'] || req.headers['x-402-wallet'] || null;
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {{ service: string, amount_usd: number, description: string }} invoiceMeta
 * @returns {boolean} true if request may proceed (payment present or fees waived in dev)
 */
function gatePayment(req, res, invoiceMeta) {
  const payment = req.headers['x-402-payment'] || req.headers['x-payment-proof'];
  const wallet = walletHeader(req);

  if (!payment) {
    const amountUsd = invoiceMeta.amount_usd;
    res.status(402).json({
      type: 'x402-invoice',
      label: 'PIPELINE',
      network: 'apostle-atp',
      gateway: GATEWAY,
      service: invoiceMeta.service,
      amount_usd: amountUsd,
      amount_atp: String(Math.ceil(amountUsd)),
      currency: 'USD',
      description: invoiceMeta.description,
      wallet_required: true,
      headers_required: ['X-402-Wallet-Address', 'X-402-Payment', 'X-API-Key'],
      expiry_seconds: 3600,
    });
    return false;
  }

  if (!wallet && process.env.BAAS_REQUIRE_WALLET !== 'false') {
    res.status(400).json({
      error: 'X-402-Wallet-Address required when paying',
      label: 'PIPELINE',
    });
    return false;
  }

  req.x402 = {
    receipt_id: payment,
    wallet: wallet || 'unknown',
    verified: true,
    mode: process.env.X402_MODE || 'staged',
  };
  return true;
}

function newReceiptId(prefix) {
  return `${prefix}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}

module.exports = { gatePayment, requireApiKey, walletHeader, newReceiptId, GATEWAY };
