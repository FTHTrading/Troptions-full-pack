import { XRPL_LIVE_PLATFORM_REGISTRY } from "@/content/troptions/xrplLivePlatformRegistry";
import { inspectXrplDependencySecurity } from "@/lib/troptions/xrplDependencySecurityGuard";

export function getXrplLiveDataSummary() {
  return {
    mode: "live-data-read-only",
    isLiveMainnetExecutionEnabled: false,
    endpoints: XRPL_LIVE_PLATFORM_REGISTRY.endpoints,
    allowedReadOnlyMethods: XRPL_LIVE_PLATFORM_REGISTRY.allowedReadOnlyMethods,
    marketData: XRPL_LIVE_PLATFORM_REGISTRY.marketData,
    dependencySecurity: inspectXrplDependencySecurity(),
    auditHint: "Read-only market data only. Mainnet execution remains blocked.",
  } as const;
}