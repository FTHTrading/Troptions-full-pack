import { guardPortalRead, NextResponse } from "@/lib/troptions/portalApiGuards";
import { OPENCLAW_AGENT_REGISTRY } from "@/content/troptions/openClawAgentRegistry";
import { OPENCLAW_BLOCKED_ACTIONS, OPENCLAW_REQUIRED_APPROVALS } from "@/content/troptions/openClawPolicyRegistry";
import { getOpenClawBridgeStatus } from "@/lib/troptions/openClawBridge";

export async function GET(request: Request) {
  const guarded = await guardPortalRead(request);
  if (guarded instanceof NextResponse) return guarded;

  const bridge = getOpenClawBridgeStatus();
  return NextResponse.json({
    ok: true,
    status: bridge.integrationStatus,
    mode: "simulation",
    agentId: "jefe",
    taskId: "status-check",
    blockedActions: OPENCLAW_BLOCKED_ACTIONS,
    requiredApprovals: OPENCLAW_REQUIRED_APPROVALS,
    auditHint: "Read-only OpenClaw status.",
    nextSteps: bridge.integrationStatus === "connected" ? ["Run dashboard checks"] : ["Use local simulation mode", "Review setup instructions"],
    agentsDiscovered: OPENCLAW_AGENT_REGISTRY.length,
    discoveredItems: bridge.discoveredItems,
  });
}
