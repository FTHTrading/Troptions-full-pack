/**
 * POST trade intents to payment-orchestrator arbitrage pipeline.
 */
const axios = require('axios');

const ORCHESTRATOR_URL = process.env.ORCHESTRATOR_URL || 'http://127.0.0.1:4022';

/**
 * @param {object} payload
 * @returns {Promise<object>}
 */
async function submitArbitrage(payload) {
  const res = await axios.post(
    `${ORCHESTRATOR_URL}/api/v1/arbitrage`,
    payload,
    { timeout: 15000, validateStatus: () => true }
  );
  if (res.status >= 400) {
    const err = new Error(res.data?.error || `orchestrator ${res.status}`);
    err.status = res.status;
    err.body = res.data;
    throw err;
  }
  return res.data;
}

module.exports = { submitArbitrage };
