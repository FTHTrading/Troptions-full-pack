// TROPTIONS Exchange OS — Liquidity Risk Label Derivation

import type { RiskLabelId } from "@/config/exchange-os/riskLabels";
import type { XrplAmmPool } from "@/lib/exchange-os/xrpl/types";
import type { LiquidityRisk } from "./types";

const LOW_LIQUIDITY_THRESHOLD_XRP = 500;

/** Derive liquidity risk labels from on-chain AMM pool data */
export function deriveLiquidityRiskLabels(
  ammPool: XrplAmmPool | null,
  hasOrderBook: boolean
): LiquidityRisk {
  const labelIds: RiskLabelId[] = [];

  const hasAmmPool = ammPool !== null;
  let estimatedDepthXrp: number | undefined;
  let lowLiquidity = false;

  if (!hasAmmPool && !hasOrderBook) {
    labelIds.push("LOW_LIQUIDITY");
    lowLiquidity = true;
  } else if (ammPool) {
    // Rough liquidity estimate from AMM pool asset1 balance (XRP side)
    const xrpAmount = parseFloat(ammPool.asset1?.value ?? "0");
    estimatedDepthXrp = isNaN(xrpAmount) ? 0 : xrpAmount;
    if (estimatedDepthXrp < LOW_LIQUIDITY_THRESHOLD_XRP) {
      labelIds.push("LOW_LIQUIDITY");
      lowLiquidity = true;
    }
  }

  return {
    hasAmmPool,
    hasOrderBook,
    estimatedDepthXrp,
    lowLiquidity,
    labelIds,
  };
}
