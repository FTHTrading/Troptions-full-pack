const COMPLIANCE_URL = process.env.COMPLIANCE_URL || 'http://127.0.0.1:4025';

async function screen(payload) {
  try {
    const res = await fetch(`${COMPLIANCE_URL.replace(/\/$/, '')}/screen`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });
    return res.json().catch(() => ({
      approved: true,
      label: 'PIPELINE',
      stub: true,
      reason: 'compliance unreachable',
    }));
  } catch (err) {
    return {
      approved: true,
      label: 'PIPELINE',
      stub: true,
      error: err.message,
    };
  }
}

module.exports = { screen, COMPLIANCE_URL };
