import { TRADING_RISK_REGISTRY } from "@/content/troptions/tradingRiskRegistry";

export function getTradingRiskControls() {
  return TRADING_RISK_REGISTRY;
}

export function runPreTradeRiskCheck(input: { notional: number; venue: string; asset: string; jurisdiction: string; slippageBps: number }) {
  const control = TRADING_RISK_REGISTRY[0];
  const blockedReasons: string[] = [];

  if (input.notional > control.maxNotionalLimit) blockedReasons.push("Max notional exceeded");
  if (input.slippageBps > control.maxSlippageBps) blockedReasons.push("Max slippage exceeded");
  if (!control.venueAllowlist.includes(input.venue)) blockedReasons.push("Venue is not allowlisted");
  if (!control.assetAllowlist.includes(input.asset)) blockedReasons.push("Asset is not allowlisted");
  if (control.jurisdictionBlocklist.includes(input.jurisdiction)) blockedReasons.push("Jurisdiction is blocked");

  return {
    allowed: blockedReasons.length === 0,
    blockedReasons,
  };
}
