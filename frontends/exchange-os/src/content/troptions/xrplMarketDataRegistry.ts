export interface XrplMarketDataRecord {
  readonly id: string;
  readonly pair: string;
  readonly venue: "XRPL DEX" | "XRPL AMM" | "Pathfinding";
  readonly lastPrice: string;
  readonly change24h: string;
  readonly volume24h: string;
  readonly status: "live-read-only" | "simulated-live";
  readonly risk: "low" | "medium" | "high";
}

export const XRPL_MARKET_DATA_REGISTRY: readonly XrplMarketDataRecord[] = [
  { id: "md-troptions-dex", pair: "XRP / TROPTIONS", venue: "XRPL DEX", lastPrice: "0.0025", change24h: "+0.0%", volume24h: "simulated", status: "simulated-live", risk: "low" },
  { id: "md-troptions-amm", pair: "TROPTIONS / XRP", venue: "XRPL AMM", lastPrice: "400.00", change24h: "+0.0%", volume24h: "simulated", status: "simulated-live", risk: "low" },
  { id: "md-1", pair: "XRP / LEGACY-TOKEN", venue: "XRPL DEX", lastPrice: "0.8420", change24h: "+2.1%", volume24h: "1.24M XRP", status: "simulated-live", risk: "medium" },
  { id: "md-2", pair: "XRP / SOVBND", venue: "XRPL DEX", lastPrice: "0.1160", change24h: "-0.4%", volume24h: "420k XRP", status: "simulated-live", risk: "medium" },
  { id: "md-3", pair: "LEGACY-TOKEN / XRP", venue: "XRPL AMM", lastPrice: "1.1860", change24h: "+0.8%", volume24h: "980k XRP eq", status: "simulated-live", risk: "medium" },
  { id: "md-4", pair: "USDF / XRP", venue: "Pathfinding", lastPrice: "1.0004", change24h: "+0.0%", volume24h: "2.8M routed", status: "simulated-live", risk: "low" },
];