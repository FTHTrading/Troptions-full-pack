import { guardPortalRead, NextResponse } from "@/lib/troptions/portalApiGuards";
import { OPENCLAW_AGENT_REGISTRY } from "@/content/troptions/openClawAgentRegistry";
import { OPENCLAW_BLOCKED_ACTIONS, OPENCLAW_REQUIRED_APPROVALS } from "@/content/troptions/openClawPolicyRegistry";

export async function GET(request: Request) {
  const guarded = await guardPortalRead(request);
  if (guarded instanceof NextResponse) return guarded;

  return NextResponse.json({
    ok: true,
    status: "ok",
    mode: "simulation",
    agentId: "jefe",
    taskId: "agents-list",
    blockedActions: OPENCLAW_BLOCKED_ACTIONS,
    requiredApprovals: OPENCLAW_REQUIRED_APPROVALS,
    auditHint: "Read-only agent registry list.",
    nextSteps: ["Route a task to a specialist agent if needed"],
    agents: OPENCLAW_AGENT_REGISTRY,
  });
}
