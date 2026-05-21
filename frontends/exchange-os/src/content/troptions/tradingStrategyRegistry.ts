export interface TradingStrategyRecord {
  strategyId: string;
  strategyType:
    | "treasury-rebalance"
    | "stablecoin-conversion"
    | "xrpl-amm-route-optimizer"
    | "fx-hedge-simulation"
    | "liquidity-routing"
    | "rwa-redemption-liquidity-model"
    | "spread-monitor"
    | "vwap-simulation"
    | "twap-simulation"
    | "risk-off-liquidation-simulation";
  maxLossThreshold: number;
  maxDailyVolume: number;
  approvedVenues: string[];
  restrictedAssets: string[];
  jurisdictionRestrictions: string[];
  killSwitch: boolean;
  simulationMode: boolean;
  liveExecutionEnabled: boolean;
}

export const TRADING_STRATEGY_REGISTRY: TradingStrategyRecord[] = [
  {
    strategyId: "ALG-001",
    strategyType: "treasury-rebalance",
    maxLossThreshold: 250000,
    maxDailyVolume: 2000000,
    approvedVenues: ["Coinbase Prime"],
    restrictedAssets: ["unapproved-private-units"],
    jurisdictionRestrictions: ["US-sanctioned regions blocked"],
    killSwitch: true,
    simulationMode: true,
    liveExecutionEnabled: false,
  },
];
