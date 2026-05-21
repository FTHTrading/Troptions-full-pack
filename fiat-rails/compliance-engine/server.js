const { createHealthApp } = require('../shared/health-server');

const STRICT = String(process.env.COMPLIANCE_STRICT || '').toLowerCase() === 'true';

function screenHandler(req, res) {
  if (STRICT) {
    return res.status(422).json({
      approved: false,
      label: 'PIPELINE',
      service: 'compliance-engine',
      reason: 'COMPLIANCE_STRICT=true — hold for manual review',
    });
  }

  return res.json({
    approved: true,
    label: 'PIPELINE',
    service: 'compliance-engine',
    mode: 'dev_stub',
    message: 'OFAC/KYC providers not wired — dev auto-approve',
  });
}

createHealthApp('compliance-engine', (app) => {
  app.post('/screen', screenHandler);
  app.post('/api/compliance/screen', screenHandler);

  app.post('/api/compliance/kyc', (_req, res) => {
    res.status(501).json({ label: 'PIPELINE', service: 'compliance-engine', result: 'not_implemented' });
  });
});
