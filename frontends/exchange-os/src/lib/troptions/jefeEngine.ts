import { JEFE_BLOCKED_ACTIONS } from "@/content/troptions/jefePolicyRegistry";
import { bridgeJefeCommand, getJefeBridgeStatus } from "@/lib/troptions/jefeAgentBridge";
import { routeJefeCommand } from "@/lib/troptions/jefeCommandRouter";
import { summarizeJefeStatus } from "@/lib/troptions/jefeStatusSummarizer";
import { createJefeTaskPlan } from "@/lib/troptions/jefeTaskPlanner";
import { getOpenClawX402Readiness } from "@/lib/troptions/openClawX402Engine";
import { getXrplMainnetReadinessGate } from "@/lib/troptions/xrplMainnetReadinessGate";

export function getFastStatus() {
  return {
    ...summarizeJefeStatus(),
    bridge: getJefeBridgeStatus(),
  };
}

export function routeCommand(command: string) {
  return bridgeJefeCommand(command);
}

export function createTaskPlan(objective: string) {
  const routed = routeJefeCommand(objective);
  return createJefeTaskPlan({ objective, routedAgent: routed.routedAgent });
}

export function summarizeBlockers() {
  return {
    mode: "simulation",
    blockedActions: JEFE_BLOCKED_ACTIONS,
    blockerSummary: [
      "Live trading remains blocked",
      "Live x402 remains blocked",
      "Approvals for POF/SBLC/RWA remain human-only",
    ],
  };
}

export function summarizeNextSteps() {
  return {
    mode: "simulation",
    nextSteps: [
      "Run safe site checks",
      "Collect x402 and XRPL readiness summaries",
      "Draft remediation checklist",
      "Request human review for sensitive workflows",
    ],
  };
}

export function checkX402Readiness() {
  return getOpenClawX402Readiness();
}

export function checkXrplReadiness() {
  return getXrplMainnetReadinessGate();
}

export function checkWalletReadiness() {
  return {
    mode: "simulation",
    status: "request-only",
    blockedReasons: [
      "Live sends are disabled",
      "Funding actions require operator approval",
      "No on-chain signing in dashboard mode",
    ],
  };
}

export function checkSiteHealth() {
  return {
    mode: "simulation",
    status: "healthy-with-review-items",
    checks: ["routes", "links", "metadata", "narration", "sitemap"],
    didDeploy: false,
  };
}
