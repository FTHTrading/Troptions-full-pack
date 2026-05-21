import { guardPortalRead, NextResponse } from "@/lib/troptions/portalApiGuards";
import { OPENCLAW_TOOL_REGISTRY } from "@/content/troptions/openClawToolRegistry";
import { OPENCLAW_BLOCKED_ACTIONS, OPENCLAW_REQUIRED_APPROVALS } from "@/content/troptions/openClawPolicyRegistry";

export async function GET(request: Request) {
  const guarded = await guardPortalRead(request);
  if (guarded instanceof NextResponse) return guarded;

  return NextResponse.json({
    ok: true,
    status: "ok",
    mode: "simulation",
    agentId: "jefe",
    taskId: "tools-list",
    blockedActions: OPENCLAW_BLOCKED_ACTIONS,
    requiredApprovals: OPENCLAW_REQUIRED_APPROVALS,
    auditHint: "Read-only tool registry list.",
    nextSteps: ["Select simulation or planning tool routes only"],
    tools: OPENCLAW_TOOL_REGISTRY,
  });
}
