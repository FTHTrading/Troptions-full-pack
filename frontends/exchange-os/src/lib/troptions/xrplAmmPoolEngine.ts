import { XRPL_AMM_POOL_REGISTRY } from "@/content/troptions/xrplAmmPoolRegistry";

export function listXrplAmmPools() {
  return XRPL_AMM_POOL_REGISTRY;
}

export function getXrplAmmPool(pair?: string) {
  if (!pair) return XRPL_AMM_POOL_REGISTRY[0] ?? null;
  return XRPL_AMM_POOL_REGISTRY.find((item) => item.pair.toLowerCase() === pair.toLowerCase()) ?? null;
}