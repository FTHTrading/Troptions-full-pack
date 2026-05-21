const express = require('express');
const crypto = require('crypto');
const { gatePayment, requireApiKey } = require('../lib/x402');
const { poolSetupFeeUsd } = require('../lib/fees');
const { tokens, pools, createPool } = require('../lib/store');
const { enqueuePoolJobs, listJobs } = require('../lib/jobs');

const router = express.Router();

function normalizePoolSpec(raw) {
  const token = raw.token_id ? tokens.get(raw.token_id) : null;
  const base = raw.base || token?.symbol;
  if (!raw.token_id || !base || !raw.counter) {
    return { error: 'Each pool requires token_id, base (or resolvable from token), and counter' };
  }
  if (!tokens.has(raw.token_id)) {
    return { error: `Unknown token_id: ${raw.token_id}` };
  }
  const initial = Number(raw.initial_liquidity ?? raw.counter_amount ?? 0);
  const fee = poolSetupFeeUsd(initial);
  return {
    spec: {
      token_id: raw.token_id,
      base,
      counter: raw.counter,
      initial_liquidity: initial,
      fee_percent: raw.fee_percent ?? 0.25,
      slippage_bps: raw.slippage_bps,
      orchestrator_hint: raw.orchestrator_hint,
    },
    fee_usd: fee,
  };
}

router.post('/', (req, res) => {
  if (!requireApiKey(req, res)) return;

  const parsed = normalizePoolSpec(req.body);
  if (parsed.error) return res.status(400).json({ error: parsed.error, label: 'PIPELINE' });

  if (!gatePayment(req, res, {
    service: 'baas/pool-setup',
    amount_usd: parsed.fee_usd,
    description: `Pool ${parsed.spec.base}/${parsed.spec.counter}`,
  })) {
    return;
  }

  parsed.spec._fee_usd = parsed.fee_usd;
  const queued = enqueuePoolJobs([parsed.spec], {
    batch_id: `single_${Date.now()}`,
    receipt_id: req.x402.receipt_id,
    wallet: req.x402.wallet,
  });
  const pool = createPool(parsed.spec);
  pool.job_id = queued.jobs[0].job_id;
  pool.batch_id = queued.batch_id;
  pools.set(pool.pool_id, pool);

  res.status(201).json({
    pool,
    jobs: queued.jobs,
    jobs_file: queued.jobs_file,
    label: 'PIPELINE',
    message: 'Pool job queued — XRPL AMM creation is async',
  });
});

router.post('/batch', (req, res) => {
  if (!requireApiKey(req, res)) return;

  const { pools: poolList } = req.body;
  if (!Array.isArray(poolList) || poolList.length === 0) {
    return res.status(400).json({ error: 'body.pools must be a non-empty array', label: 'PIPELINE' });
  }

  const specs = [];
  let totalFee = 0;
  for (const raw of poolList) {
    const parsed = normalizePoolSpec(raw);
    if (parsed.error) {
      return res.status(400).json({ error: parsed.error, index: specs.length, label: 'PIPELINE' });
    }
    parsed.spec._fee_usd = parsed.fee_usd;
    totalFee += parsed.fee_usd;
    specs.push(parsed.spec);
  }
  totalFee = Math.round(totalFee * 100) / 100;

  if (!gatePayment(req, res, {
    service: 'baas/pool-batch-setup',
    amount_usd: totalFee,
    description: `Batch pool setup (${specs.length} pools)`,
  })) {
    return;
  }

  const batchId = `batch_${crypto.randomUUID().slice(0, 8)}`;
  const queued = enqueuePoolJobs(specs, {
    batch_id: batchId,
    receipt_id: req.x402.receipt_id,
    wallet: req.x402.wallet,
  });

  const createdPools = specs.map((spec) => {
    const pool = createPool(spec);
    pool.batch_id = batchId;
    const job = queued.jobs.find((j) => j.token_id === spec.token_id && j.counter === spec.counter);
    if (job) pool.job_id = job.job_id;
    pools.set(pool.pool_id, pool);
    return pool;
  });

  console.log(`[baas-api] batch ${batchId}: ${specs.length} pools queued, fee $${totalFee}`);

  res.status(202).json({
    batch_id: batchId,
    pool_count: createdPools.length,
    total_fee_usd: totalFee,
    x402_receipt: req.x402.receipt_id,
    pools: createdPools,
    jobs: queued.jobs,
    jobs_file: queued.jobs_file,
    label: 'PIPELINE',
    message: 'Batch accepted — jobs queued in data/baas-pool-jobs.json',
  });
});

router.get('/jobs', (req, res) => {
  if (!requireApiKey(req, res)) return;
  const data = listJobs({ batch_id: req.query.batch_id, limit: Number(req.query.limit) || 50 });
  res.json({ ...data, label: 'PIPELINE' });
});

router.get('/', (req, res) => {
  if (!requireApiKey(req, res)) return;
  const list = Array.from(pools.values());
  res.json({ pools: list, count: list.length, label: 'PIPELINE' });
});

module.exports = router;
