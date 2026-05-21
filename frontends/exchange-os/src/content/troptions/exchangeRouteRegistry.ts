export interface ExchangeRouteRecord {
  routeId: string;
  providerType:
    | "Coinbase Prime"
    | "Kraken"
    | "Gemini"
    | "Bitstamp"
    | "Binance US"
    | "Anchorage"
    | "BitGo"
    | "OTC desk"
    | "market maker"
    | "FX provider"
    | "stablecoin issuer"
    | "custodial exchange";
  venueRisk: "low" | "medium" | "high";
  jurisdictionRestrictions: string[];
  custodyModel: string;
  settlementTimeHours: number;
  feesBps: number;
  approvalStatus: "pending" | "approved" | "blocked";
  liveRoutingEnabled: boolean;
}

export const EXCHANGE_ROUTE_REGISTRY: ExchangeRouteRecord[] = [
  {
    routeId: "EX-001",
    providerType: "Coinbase Prime",
    venueRisk: "medium",
    jurisdictionRestrictions: ["US only", "Institutional onboarding required"],
    custodyModel: "third-party qualified custody",
    settlementTimeHours: 24,
    feesBps: 35,
    approvalStatus: "pending",
    liveRoutingEnabled: false,
  },
];
