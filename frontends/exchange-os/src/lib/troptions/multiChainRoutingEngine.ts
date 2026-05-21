import { MULTI_CHAIN_REGISTRY, type ChainId } from "@/content/troptions/multiChainRegistry";

export interface MultiChainRouteRequest {
  chainId: ChainId;
  stablecoin: string;
  amount: string;
  liveExecutionRequested?: boolean;
}

export function simulateMultiChainRoute(request: MultiChainRouteRequest) {
  const chain = MULTI_CHAIN_REGISTRY.find((item) => item.chainId === request.chainId);
  if (!chain) {
    return {
      ok: false,
      simulationOnly: true,
      blockedReasons: ["Unknown chain configuration"],
    };
  }

  const blockedReasons = [...chain.blockedByDefault];
  if (request.liveExecutionRequested) {
    blockedReasons.push("Live execution is disabled by policy");
  }

  return {
    ok: false,
    simulationOnly: true,
    blockedReasons,
    routePlan: {
      chain: chain.displayName,
      stablecoin: request.stablecoin,
      amount: request.amount,
      mode: chain.supportMode,
    },
  };
}
