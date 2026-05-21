import { PAXOS_RAIL_REGISTRY } from "@/content/troptions/paxosRailRegistry";

export function getPaxosRailSummary() {
  return {
    assets: PAXOS_RAIL_REGISTRY,
  };
}

export function simulatePaxosRail(asset: "PYUSD" | "USDP" | "PAXG", amount: string) {
  const profile = PAXOS_RAIL_REGISTRY.find((item) => item.asset === asset);
  if (!profile) {
    return {
      ok: false,
      simulationOnly: true,
      blockedReasons: ["Unsupported Paxos asset"],
    };
  }

  return {
    ok: false,
    simulationOnly: true,
    blockedReasons: ["Provider approval required", "Jurisdiction and custody checks required"],
    rail: {
      asset: profile.asset,
      role: profile.role,
      amount,
    },
  };
}
