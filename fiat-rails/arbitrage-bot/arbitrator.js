/**
 * Arbitrage watch loop — compliance gate, x402 orderbook, orchestrator execution.
 */
const axios = require('axios');
const { fetchOrderbook } = require('./x402-client');
const { submitArbitrage } = require('./orchestrator-client');

const DRY_RUN = (process.env.DRY_RUN || 'true').toLowerCase() === 'true';
const MIN_SPREAD_BPS = Number(process.env.MIN_SPREAD_BPS || 25);
const MAX_POSITION_USD = Number(process.env.MAX_POSITION_USD || 50000);
const PROFIT_REINVEST_RATIO = Number(process.env.PROFIT_REINVEST_RATIO || 0.5);
const WATCH_PAIRS = (process.env.WATCH_PAIRS || 'USD-IOU/EUR-IOU,USD-IOU/JPY-IOU')
  .split(',')
  .map((p) => p.trim())
  .filter(Boolean);
const COMPLIANCE_URL = process.env.COMPLIANCE_URL || 'http://127.0.0.1:4025';

const state = {
  running: false,
  scanCount: 0,
  trades: [],
  lastScan: null,
};

function spreadBps(bid, ask) {
  const b = Number(bid);
  const a = Number(ask);
  if (!b || !a) return 0;
  const mid = (b + a) / 2;
  return Math.round(((a - b) / mid) * 10000);
}

async function complianceCheck(pair, amountUsd) {
  try {
    const res = await axios.post(
      `${COMPLIANCE_URL}/screen`,
      {
        payment_id: `arb_${Date.now()}`,
        sender: { name: 'arbitrage-bot', country: 'US' },
        amount: amountUsd,
        currency: 'USD',
        wire_ref: `ARB-${pair}`,
      },
      { timeout: 5000 }
    );
    return { approved: res.data?.approved !== false, label: res.data?.label || 'PIPELINE' };
  } catch (err) {
    console.warn('[arbitrator] compliance unreachable, blocking trade:', err.message);
    return { approved: false, label: 'PIPELINE', reason: err.message };
  }
}

async function scanPair(pair) {
  const { orderbook, mock } = await fetchOrderbook(pair);
  const bid = orderbook.bids?.[0]?.price;
  const ask = orderbook.asks?.[0]?.price;
  const bps = spreadBps(bid, ask);

  if (bps < MIN_SPREAD_BPS) {
    return { pair, bps, action: 'skip', reason: `spread ${bps} < min ${MIN_SPREAD_BPS} bps` };
  }

  const amountUsd = Math.min(MAX_POSITION_USD, 10000);
  const comp = await complianceCheck(pair, amountUsd);
  if (!comp.approved) {
    return { pair, bps, action: 'hold', reason: 'compliance', label: comp.label };
  }

  const payload = {
    pair,
    spread_bps: bps,
    amount_usd: amountUsd,
    dry_run: DRY_RUN,
    orderbook_mid: orderbook.mid,
    profit_reinvest_ratio: PROFIT_REINVEST_RATIO,
    mock_orderbook: mock,
  };

  if (DRY_RUN) {
    const trade = {
      id: `dry_${Date.now()}`,
      pair,
      spread_bps: bps,
      amount_usd: amountUsd,
      profit_usd: Number((amountUsd * (bps / 10000) * 0.5).toFixed(2)),
      dry_run: true,
      label: 'PIPELINE',
      executed_at: new Date().toISOString(),
    };
    state.trades.push(trade);
    return { pair, bps, action: 'dry_run', trade };
  }

  const result = await submitArbitrage(payload);
  const trade = {
    id: result.arbitrage_id || `arb_${Date.now()}`,
    pair,
    spread_bps: bps,
    amount_usd: amountUsd,
    profit_usd: result.profit_usd,
    label: result.label || 'PIPELINE',
    executed_at: new Date().toISOString(),
  };
  state.trades.push(trade);
  return { pair, bps, action: 'executed', trade, result };
}

async function runScan() {
  state.scanCount += 1;
  state.lastScan = new Date().toISOString();
  const results = [];

  for (const pair of WATCH_PAIRS) {
    try {
      const r = await scanPair(pair);
      results.push(r);
      if (r.trade) {
        console.log(
          `[arbitrator] ${r.action} ${pair} spread=${r.bps}bps profit=${r.trade.profit_usd} DRY_RUN=${DRY_RUN}`
        );
      }
    } catch (err) {
      console.error(`[arbitrator] ${pair} error:`, err.message);
      results.push({ pair, action: 'error', error: err.message });
    }
  }

  return results;
}

function startWatch(intervalMs = 15000) {
  if (state.running) return state;
  state.running = true;

  const tick = async () => {
    if (!state.running) return;
    await runScan().catch((e) => console.error('[arbitrator] scan failed:', e.message));
    if (state.running) setTimeout(tick, intervalMs);
  };

  tick();
  return state;
}

function stopWatch() {
  state.running = false;
  return state;
}

function getStatus() {
  const profitToday = state.trades.reduce((s, t) => s + (t.profit_usd || 0), 0);
  return {
    running: state.running,
    dry_run: DRY_RUN,
    scan_count: state.scanCount,
    trades_executed: state.trades.length,
    profit_today: profitToday,
    watch_pairs: WATCH_PAIRS,
    min_spread_bps: MIN_SPREAD_BPS,
    max_position_usd: MAX_POSITION_USD,
    label: 'PIPELINE',
    disclaimer: 'PROJECTION — not live trading until MSB omnibus live',
    last_scan: state.lastScan,
  };
}

function getTrades(limit = 20) {
  return state.trades.slice(-limit);
}

module.exports = {
  startWatch,
  stopWatch,
  runScan,
  getStatus,
  getTrades,
  state,
};
