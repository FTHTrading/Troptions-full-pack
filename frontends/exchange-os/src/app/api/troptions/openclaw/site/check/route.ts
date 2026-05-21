import { guardPortalWrite, NextResponse, saveIdempotentResponse } from "@/lib/troptions/portalApiGuards";
import { runOpenClawSiteCheck } from "@/lib/troptions/openClawSiteManager";
import { OPENCLAW_BLOCKED_ACTIONS, OPENCLAW_REQUIRED_APPROVALS } from "@/content/troptions/openClawPolicyRegistry";

export async function POST(request: Request) {
  const guarded = await guardPortalWrite(request);
  if (guarded instanceof NextResponse) return guarded;

  const check = runOpenClawSiteCheck();
  const responseBody = {
    ok: true,
    status: "checked",
    mode: "simulation",
    agentId: "site-ops-agent",
    taskId: `site-check-${Date.now()}`,
    blockedActions: OPENCLAW_BLOCKED_ACTIONS,
    requiredApprovals: OPENCLAW_REQUIRED_APPROVALS,
    auditHint: "Site checks are read-only and do not deploy.",
    nextSteps: ["Review check results", "Prepare draft fix plan"],
    approvalRequired: false,
    check,
  };

  saveIdempotentResponse(guarded.idempotency, 200, responseBody);
  return NextResponse.json(responseBody);
}
