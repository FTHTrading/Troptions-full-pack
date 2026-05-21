import { getOpenClawBridgeStatus } from "@/lib/troptions/openClawBridge";
import { getOpenClawX402Readiness } from "@/lib/troptions/openClawX402Engine";
import { getXrplMainnetReadinessGate } from "@/lib/troptions/xrplMainnetReadinessGate";

export function summarizeJefeStatus() {
  const openClaw = getOpenClawBridgeStatus();
  const x402 = getOpenClawX402Readiness();
  const xrpl = getXrplMainnetReadinessGate();

  return {
    jefeStatus: "online",
    mode: "simulation",
    openClawStatus: openClaw.integrationStatus,
    x402Readiness: x402.report.overallStatus,
    xrplMainnetEnabled: xrpl.isLiveMainnetExecutionEnabled,
    blockedReasons: [
      "Approvals pending for live execution",
      "Simulation-first safety policy active",
    ],
    nextSteps: [
      "Review pending approvals",
      "Run safe site audit",
      "Prepare operator task plan",
    ],
  };
}
