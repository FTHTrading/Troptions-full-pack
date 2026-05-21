import { guardPortalWrite, NextResponse, saveIdempotentResponse } from "@/lib/troptions/portalApiGuards";
import { OPENCLAW_BLOCKED_ACTIONS, OPENCLAW_REQUIRED_APPROVALS } from "@/content/troptions/openClawPolicyRegistry";

export async function POST(request: Request) {
  const guarded = await guardPortalWrite(request);
  if (guarded instanceof NextResponse) return guarded;

  const responseBody = {
    ok: true,
    status: "approval-requested",
    mode: "simulation",
    agentId: "admin-agent",
    taskId: `approval-${Date.now()}`,
    blockedActions: OPENCLAW_BLOCKED_ACTIONS,
    requiredApprovals: OPENCLAW_REQUIRED_APPROVALS,
    auditHint: "Approval request created; no approval executed.",
    nextSteps: ["Human reviewer evaluates request", "Operator updates workflow state"],
    approvalRequired: true,
  };

  saveIdempotentResponse(guarded.idempotency, 200, responseBody);
  return NextResponse.json(responseBody);
}
