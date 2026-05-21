import { EXCHANGE_ROUTE_REGISTRY } from "@/content/troptions/exchangeRouteRegistry";

export function listExchangeRouteEvaluations() {
  return EXCHANGE_ROUTE_REGISTRY.map((item) => ({
    ...item,
    executionMode: item.liveRoutingEnabled ? "live" : "simulation-only",
  }));
}
