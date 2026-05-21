import { routeJefeCommand } from "@/lib/troptions/jefeCommandRouter";
import { getOpenClawBridgeStatus } from "@/lib/troptions/openClawBridge";

export function getJefeBridgeStatus() {
  const openClaw = getOpenClawBridgeStatus();
  return {
    openClawStatus: openClaw.integrationStatus,
    jefeLocalMode: "active",
    specialistAgentsMode: openClaw.integrationStatus === "connected" ? "connected" : "simulated",
    actionsMode: "planning-only",
  } as const;
}

export function bridgeJefeCommand(command: string) {
  const routed = routeJefeCommand(command);
  return {
    ...routed,
    mode: "simulation",
    auditHint: "Command routed through Jefe bridge in simulation-safe mode.",
  };
}
