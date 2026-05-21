const axios = require('axios');

const GATEWAY = process.env.X402_GATEWAY_URL || 'http://127.0.0.1:4020';

function x402Middleware(opts) {
  const { service, amount_usd, description, fee_bps } = opts;

  return async (req, res, next) => {
    const paymentHeader =
      req.headers['x-402-payment'] || req.headers['x-402-receipt'];

    if (!paymentHeader) {
      const invoiceId = `inv_${Date.now()}`;
      return res.status(402).json({
        error: 'payment_required',
        label: 'PIPELINE',
        invoice: {
          invoice_id: invoiceId,
          service,
          amount_usd,
          fee_bps: fee_bps || null,
          amount_atp: String(Math.max(1, Math.round(amount_usd / 100))),
          description: description || service,
          pay_url: `${GATEWAY}/v1/pay`,
          disclaimer: 'PROJECTION pricing — mock verify in dev',
        },
      });
    }

    try {
      const verify = await axios.post(
        `${GATEWAY}/v1/verify`,
        { receipt_id: paymentHeader },
        { timeout: 5000, validateStatus: () => true }
      );
      if (verify.data?.ok) {
        req.x402Payment = paymentHeader;
        return next();
      }
    } catch {
      /* dev fallback */
    }

    if ((process.env.X402_DEV_MOCK_VERIFY || 'true').toLowerCase() === 'true') {
      req.x402Payment = paymentHeader;
      return next();
    }

    return res.status(402).json({ error: 'payment_not_verified', receipt_id: paymentHeader });
  };
}

module.exports = { x402Middleware };
