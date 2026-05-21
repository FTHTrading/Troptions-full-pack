export interface RwaChainCapability {
  id: string;
  chain: string;
  capability: string;
  mode: "simulation-only" | "readiness-only" | "monitoring-only";
  blockedWithout: readonly string[];
}

export const RWA_CHAIN_CAPABILITY_REGISTRY: readonly RwaChainCapability[] = [
  {
    id: "rwa-solana-payments",
    chain: "Solana",
    capability: "RWA funding and payment intent simulation",
    mode: "simulation-only",
    blockedWithout: ["Issuer approval", "Provider approval", "Compliance approval"],
  },
  {
    id: "rwa-xrpl-routes",
    chain: "XRPL",
    capability: "Asset route and settlement readiness simulation",
    mode: "simulation-only",
    blockedWithout: ["Legal approval", "Custody approval", "Board approval"],
  },
  {
    id: "rwa-trex",
    chain: "EVM / T-REX",
    capability: "Permissioned tokenized asset readiness",
    mode: "readiness-only",
    blockedWithout: ["Identity gate", "Eligibility gate", "Transfer restriction gate"],
  },
  {
    id: "rwa-tron-monitoring",
    chain: "TRON",
    capability: "USDT route monitoring and risk controls",
    mode: "monitoring-only",
    blockedWithout: ["Wallet risk screening", "Sanctions checks", "Jurisdiction controls"],
  },
] as const;
