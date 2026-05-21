export interface TronRailProfile {
  rail: "USDT" | "USDC";
  status: "monitored-evaluation" | "discontinued-not-default";
  routeRole: string;
  controls: readonly string[];
}

export const TRON_RAIL_REGISTRY: readonly TronRailProfile[] = [
  {
    rail: "USDT",
    status: "monitored-evaluation",
    routeRole: "Risk-scored stablecoin route evaluation and monitoring",
    controls: [
      "Wallet risk scoring",
      "Sanctions and freeze-status awareness",
      "Source and destination screening",
      "Blocked jurisdiction controls",
      "Route risk notes",
    ],
  },
  {
    rail: "USDC",
    status: "discontinued-not-default",
    routeRole: "Not a default institutional rail",
    controls: [
      "Do not route as default institutional path",
      "Require explicit provider and legal override",
    ],
  },
];
