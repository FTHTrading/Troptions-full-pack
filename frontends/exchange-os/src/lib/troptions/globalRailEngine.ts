import { GLOBAL_RAIL_REGISTRY } from "@/content/troptions/globalRailRegistry";

export function getGlobalRailDashboard() {
  const pending = GLOBAL_RAIL_REGISTRY.filter((item) => item.status === "pending").length;
  const approved = GLOBAL_RAIL_REGISTRY.filter((item) => item.status === "approved").length;

  return {
    stats: {
      total: GLOBAL_RAIL_REGISTRY.length,
      pending,
      approved,
    },
    rails: GLOBAL_RAIL_REGISTRY,
  };
}
