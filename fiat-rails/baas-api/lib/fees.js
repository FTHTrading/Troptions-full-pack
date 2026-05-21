/** Fee schedule — **PIPELINE** until Apostle settlement is wired. */
const TOKEN_SETUP_FEE_USD = Number(process.env.BAAS_TOKEN_SETUP_FEE_USD || 10000);
const POOL_SETUP_RATE = Number(process.env.BAAS_POOL_SETUP_RATE || 0.0025);
const POOL_SETUP_MIN_USD = Number(process.env.BAAS_POOL_SETUP_MIN_USD || 250);

function poolSetupFeeUsd(initialLiquidity) {
  const base = Number(initialLiquidity) || 0;
  const fee = Math.max(base * POOL_SETUP_RATE, POOL_SETUP_MIN_USD);
  return Math.round(fee * 100) / 100;
}

function tokenSetupFeeUsd() {
  return TOKEN_SETUP_FEE_USD;
}

module.exports = { TOKEN_SETUP_FEE_USD, POOL_SETUP_RATE, poolSetupFeeUsd, tokenSetupFeeUsd };
