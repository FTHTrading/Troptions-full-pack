/**
 * XRPL IOU issuance — production when ISSUER_SEED is set; PIPELINE mock otherwise.
 * NEVER commit seeds. Load from fiat-rails/.env only.
 */
const crypto = require('crypto');
const xrpl = require('xrpl');

const DEFAULT_CURRENCY = 'USD';
const DEFAULT_ISSUER = process.env.ISSUER_ADDRESS || 'rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ';
const XRPL_WS = process.env.XRPL_WS || 'wss://xrplcluster.com';

/**
 * @param {object} opts
 * @param {string} [opts.issuerSeed] — overrides env ISSUER_SEED
 * @param {string} opts.recipient — XRPL destination address
 * @param {string} opts.value — decimal amount string
 * @param {string} [opts.currency] — 3-char or hex currency code
 * @param {string} [opts.memo]
 */
async function issueIou(opts) {
  const {
    issuerSeed = process.env.ISSUER_SEED,
    recipient,
    value,
    currency = DEFAULT_CURRENCY,
    memo,
  } = opts;

  if (!recipient || value == null) {
    const err = new Error('recipient and value are required');
    err.step = 'validate';
    throw err;
  }

  if (!issuerSeed) {
    return {
      tx_hash: `PIPELINE_${crypto.randomBytes(16).toString('hex')}`,
      status: 'pipeline',
      label: 'PIPELINE',
      issuer: DEFAULT_ISSUER,
      simulated: true,
      message: 'ISSUER_SEED not set — no on-chain mint (orchestrator PIPELINE mode)',
    };
  }

  const client = new xrpl.Client(XRPL_WS);
  await client.connect();

  try {
    const wallet = xrpl.Wallet.fromSeed(issuerSeed);
    const currencyCode =
      currency.length === 3 ? currency : xrpl.convertStringToHex(currency).slice(0, 40);

    const payment = {
      TransactionType: 'Payment',
      Account: wallet.address,
      Destination: recipient,
      Amount: {
        currency: currencyCode,
        value: String(value),
        issuer: wallet.address,
      },
    };

    if (memo) {
      payment.Memos = [
        {
          Memo: {
            MemoData: xrpl.convertStringToHex(String(memo).slice(0, 120)),
          },
        },
      ];
    }

    const prepared = await client.autofill(payment);
    const signed = wallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);

    const meta = result.result.meta;
    const ok =
      typeof meta === 'string'
        ? meta.startsWith('tes')
        : meta?.TransactionResult === 'tesSUCCESS';

    if (!ok) {
      const err = new Error(
        `XRPL payment failed: ${typeof meta === 'object' ? meta.TransactionResult : meta}`
      );
      err.step = 'xrpl_submit';
      throw err;
    }

    return {
      tx_hash: result.result.hash,
      status: 'tesSUCCESS',
      label: 'PROVEN',
      issuer: wallet.address,
      simulated: false,
    };
  } finally {
    await client.disconnect();
  }
}

module.exports = { issueIou };
