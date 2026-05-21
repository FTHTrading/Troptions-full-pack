const crypto = require('crypto');

const BAAS_API_KEY = process.env.BAAS_API_KEY || '';

function requireApiKey(req, res, next) {
  if (!BAAS_API_KEY) {
    return res.status(503).json({
      error: 'BAAS_API_KEY not configured',
      label: 'PIPELINE',
      hint: 'Set BAAS_API_KEY in operator .env (never commit)',
    });
  }

  const key = req.headers['x-api-key'] || req.headers['authorization']?.replace(/^Bearer\s+/i, '');
  const sig = req.headers['x-signature'];
  const ts = req.headers['x-timestamp'];

  if (sig && ts && key === BAAS_API_KEY) {
    const body = JSON.stringify(req.body || {});
    const expected = crypto
      .createHmac('sha256', BAAS_API_KEY)
      .update(`${ts}.${body}`)
      .digest('hex');
    if (sig === expected) return next();
    return res.status(401).json({ error: 'Invalid HMAC signature' });
  }

  if (key === BAAS_API_KEY) return next();

  return res.status(401).json({ error: 'Invalid or missing API key' });
}

module.exports = { requireApiKey };
