import { STABLECOIN_RAIL_REGISTRY, type StablecoinRailRecord } from "@/content/troptions/stablecoinRailRegistry";

export function listStablecoinRoutes() {
  return STABLECOIN_RAIL_REGISTRY;
}

export function canLaunchPublicStableUnit(route: StablecoinRailRecord) {
  if (!route.requiresLicensingApproval) {
    return { allowed: true, blockedReasons: [] as string[] };
  }

  return {
    allowed: false,
    blockedReasons: ["Licensing approval is required for public launch"],
  };
}
