import { discoverOpenClawPaths, getSafeOpenClawPathLabels } from "@/lib/troptions/openClawDiscoveryEngine";

export function getOpenClawDiscoverySummary() {
  const discovered = discoverOpenClawPaths();
  return {
    discoveredCount: discovered.length,
    discovered: getSafeOpenClawPathLabels(discovered),
  };
}
