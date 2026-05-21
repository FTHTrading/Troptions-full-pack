const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '..', 'data');
const JOBS_FILE = path.join(DATA_DIR, 'baas-pool-jobs.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJobs() {
  ensureDataDir();
  if (!fs.existsSync(JOBS_FILE)) {
    return { jobs: [], updated_at: null };
  }
  try {
    return JSON.parse(fs.readFileSync(JOBS_FILE, 'utf8'));
  } catch {
    return { jobs: [], updated_at: null };
  }
}

function writeJobs(store) {
  ensureDataDir();
  store.updated_at = new Date().toISOString();
  fs.writeFileSync(JOBS_FILE, JSON.stringify(store, null, 2), 'utf8');
}

/**
 * Queue pool creation jobs (**PIPELINE** — XRPL AMM wiring is async stub).
 * @param {Array<object>} poolSpecs
 * @param {{ batch_id: string, receipt_id?: string, wallet?: string }} meta
 */
function enqueuePoolJobs(poolSpecs, meta) {
  const store = readJobs();
  const batchId = meta.batch_id || `batch_${Date.now()}`;
  const created = [];

  for (const spec of poolSpecs) {
    const jobId = `job_${crypto.randomUUID()}`;
    const job = {
      job_id: jobId,
      batch_id: batchId,
      status: 'queued',
      label: 'PIPELINE',
      token_id: spec.token_id,
      base: spec.base,
      counter: spec.counter,
      initial_liquidity: spec.initial_liquidity,
      fee_usd: spec._fee_usd,
      x402_receipt: meta.receipt_id || null,
      wallet: meta.wallet || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      orchestrator_url: process.env.ORCHESTRATOR_URL || 'http://127.0.0.1:4022',
      note: 'Queued for Exchange OS / XRPL AMM — not on-ledger until worker runs',
    };
    store.jobs.push(job);
    created.push(job);
  }

  writeJobs(store);
  return { batch_id: batchId, jobs: created, jobs_file: JOBS_FILE };
}

function listJobs({ batch_id, limit = 50 } = {}) {
  const store = readJobs();
  let jobs = store.jobs || [];
  if (batch_id) jobs = jobs.filter((j) => j.batch_id === batch_id);
  return { jobs: jobs.slice(-limit), updated_at: store.updated_at };
}

module.exports = { enqueuePoolJobs, listJobs, JOBS_FILE };
