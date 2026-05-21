export interface PaxosRailRecord {
  asset: "PYUSD" | "USDP" | "PAXG";
  issuer: "Paxos";
  role: string;
  readinessMode: "simulation-only" | "readiness-only";
  controls: readonly string[];
}

export const PAXOS_RAIL_REGISTRY: readonly PaxosRailRecord[] = [
  {
    asset: "PYUSD",
    issuer: "Paxos",
    role: "PayPal-linked payment rail evaluation",
    readinessMode: "simulation-only",
    controls: ["Provider approval", "Jurisdiction review", "Counterparty controls"],
  },
  {
    asset: "USDP",
    issuer: "Paxos",
    role: "Regulated dollar stablecoin route evaluation",
    readinessMode: "simulation-only",
    controls: ["Provider approval", "Chain support review", "Policy and legal gate"],
  },
  {
    asset: "PAXG",
    issuer: "Paxos",
    role: "Gold-linked digital asset reference and reserve/proof comparison",
    readinessMode: "readiness-only",
    controls: ["Custody review", "Commodity classification review", "Redemption policy review"],
  },
];
