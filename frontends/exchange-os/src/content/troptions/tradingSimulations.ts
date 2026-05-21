export interface TradingSimulation {
  id: string;
  type: "xrpl-amm" | "settlement-route" | "slippage" | "liquidity";
  label: string;
  description: string;
  parameters: Record<string, string>;
  simulationOnly: true;
}

export const TRADING_SIMULATIONS: TradingSimulation[] = [
  {
    id: "xrpl-amm-slippage",
    type: "xrpl-amm",
    label: "XRPL AMM Slippage Estimate",
    description: "Estimate trade slippage for a given input amount on XRPL native AMM.",
    parameters: { inputAmount: "string (drops or token amount)", inputAsset: "XRP|token", outputAsset: "XRP|token", poolDepth: "string (estimated liquidity)" },
    simulationOnly: true,
  },
  {
    id: "settlement-route",
    type: "settlement-route",
    label: "Settlement Route Simulation",
    description: "Simulate optimal settlement route across available rails.",
    parameters: { amount: "string", asset: "string", fromJurisdiction: "string", toJurisdiction: "string" },
    simulationOnly: true,
  },
  {
    id: "liquidity-depth",
    type: "liquidity",
    label: "Liquidity Depth Model",
    description: "Model available liquidity for a given asset pair.",
    parameters: { assetPair: "string", notionalUSD: "string" },
    simulationOnly: true,
  },
];

export const TRADING_DISCLAIMER =
  "All trading simulations are for modeling purposes only. No trades are executed. Troptions is not a broker-dealer, exchange, or trading venue. Subject to provider, legal, compliance, custody, jurisdiction, and board approval gates.";

export const TRADING_BLOCKED_ACTIONS = [
  "execute_trade",
  "place_order",
  "cancel_order",
  "transfer_funds",
  "sign_xrpl_transaction",
  "submit_xrpl_offer",
];
