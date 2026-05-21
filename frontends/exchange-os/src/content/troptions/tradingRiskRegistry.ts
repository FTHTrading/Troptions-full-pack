export interface TradingRiskRecord {
  controlId: string;
  preTradeRiskCheck: boolean;
  postTradeRiskCheck: boolean;
  maxNotionalLimit: number;
  maxDailyVolume: number;
  maxSlippageBps: number;
  venueAllowlist: string[];
  assetAllowlist: string[];
  jurisdictionBlocklist: string[];
  sanctionsBlock: boolean;
  volatilityHalt: boolean;
  killSwitch: boolean;
  manualApprovalRequired: boolean;
}

export const TRADING_RISK_REGISTRY: TradingRiskRecord[] = [
  {
    controlId: "TRISK-001",
    preTradeRiskCheck: true,
    postTradeRiskCheck: true,
    maxNotionalLimit: 500000,
    maxDailyVolume: 3000000,
    maxSlippageBps: 90,
    venueAllowlist: ["Coinbase Prime", "Kraken"],
    assetAllowlist: ["USDC", "EURC", "XRP", "USD.rIssuer"],
    jurisdictionBlocklist: ["KP", "IR", "SY"],
    sanctionsBlock: true,
    volatilityHalt: true,
    killSwitch: true,
    manualApprovalRequired: true,
  },
];
