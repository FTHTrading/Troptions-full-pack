const crypto = require('crypto');

const tokens = new Map();
const pools = new Map();
const billingHistory = [];
const arbitrageConfigs = new Map();

/** Seed known TROPTIONS IOUs from ledger inventory (**PROVEN** supply, **PIPELINE** BaaS registration). */
function seedKnownTokens() {
  const issuer = 'rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ';
  const catalog = [
    { symbol: 'TROPTIONS', name: 'TROPTIONS', chain: 'xrpl' },
    { symbol: 'USDC', name: 'USDC (TROPTIONS IOU)', chain: 'xrpl' },
    { symbol: 'USDT', name: 'USDT (TROPTIONS IOU)', chain: 'xrpl' },
    { symbol: 'DAI', name: 'DAI (TROPTIONS IOU)', chain: 'xrpl' },
    { symbol: 'EURC', name: 'EURC (TROPTIONS IOU)', chain: 'xrpl' },
    { symbol: 'TROPTIONS-USD', name: 'TROPTIONS USD IOU rail', chain: 'xrpl' },
    { symbol: 'Alexandrite', name: 'Alexandrite / AXLUSD collateral token', chain: 'xrpl', label: 'PROJECTION' },
  ];

  for (const row of catalog) {
    const slug = row.symbol.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/_+/g, '_');
    const tokenId = row.token_id || `token_${slug}`;
    if (tokens.has(tokenId)) continue;
    tokens.set(tokenId, {
      token_id: tokenId,
      symbol: row.symbol,
      name: row.name,
      issuer,
      chain: row.chain,
      status: 'registered',
      label: row.label || 'PIPELINE',
      created_at: new Date().toISOString(),
    });
  }
}

seedKnownTokens();

function createToken(body) {
  const tokenId = `token_${crypto.randomUUID().slice(0, 8)}`;
  const record = {
    token_id: tokenId,
    symbol: body.symbol,
    name: body.name || body.symbol,
    issuer: body.issuer,
    chain: body.chain || 'xrpl',
    collateral_type: body.collateral_type,
    initial_supply: body.initial_supply,
    status: 'active',
    label: 'PIPELINE',
    created_at: new Date().toISOString(),
    setup_fee_paid_usd: body.setup_fee_paid_usd,
  };
  tokens.set(tokenId, record);
  return record;
}

function createPool(body) {
  const poolId = `pool_${crypto.randomUUID().slice(0, 8)}`;
  const record = {
    pool_id: poolId,
    token_id: body.token_id,
    base: body.base,
    counter: body.counter,
    initial_liquidity: body.initial_liquidity,
    fee_percent: body.fee_percent ?? 0.25,
    status: 'queued',
    label: 'PIPELINE',
    created_at: new Date().toISOString(),
  };
  pools.set(poolId, record);
  return record;
}

function recordBilling(entry) {
  billingHistory.push(entry);
}

module.exports = {
  tokens,
  pools,
  billingHistory,
  arbitrageConfigs,
  createToken,
  createPool,
  seedKnownTokens,
  recordBilling,
};
