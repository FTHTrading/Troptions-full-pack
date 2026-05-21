/**
 * On x402 paid — log PIPELINE stubs to ttn-launcher / exchange (no live settlement).
 */
const axios = require('axios');

const TTN = process.env.TTN_LAUNCHER_URL || 'http://127.0.0.1:8092';
const EXCHANGE = process.env.EXCHANGE_OS_URL || 'http://127.0.0.1:8091';

async function notifyDownstream(kind, meta) {
  console.log(`[baas-api] PIPELINE paid: ${kind}`, meta);

  for (const [name, url] of [
    ['ttn-launcher', `${TTN}/api/internal/baas-stub`],
    ['exchange', `${EXCHANGE}/api/internal/baas-stub`],
  ]) {
    try {
      await axios.post(url, { kind, ...meta, label: 'PIPELINE' }, {
        timeout: 3000,
        validateStatus: () => true,
      });
    } catch {
      console.log(`[baas-api] ${name} stub unreachable (log only)`);
    }
  }
}

module.exports = { notifyDownstream };
