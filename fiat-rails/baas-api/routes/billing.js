const express = require('express');
const { requireApiKey } = require('../lib/x402');
const { billingHistory } = require('../lib/store');

const router = express.Router();

router.get('/history', (req, res) => {
  if (!requireApiKey(req, res)) return;
  res.json({
    label: 'PROJECTION',
    disclaimer: 'Invoice history stub — PIPELINE',
    entries: billingHistory.slice(-50),
    count: billingHistory.length,
  });
});

module.exports = router;
