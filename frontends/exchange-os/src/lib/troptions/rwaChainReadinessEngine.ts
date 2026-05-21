import { RWA_CHAIN_CAPABILITY_REGISTRY } from "@/content/troptions/rwaChainCapabilityRegistry";

export function getRwaChainReadinessSummary() {
  return {
    capabilities: RWA_CHAIN_CAPABILITY_REGISTRY,
    readinessMode: "simulation-and-readiness-only",
  };
}
