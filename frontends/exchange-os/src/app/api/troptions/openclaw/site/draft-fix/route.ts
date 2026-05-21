import { guardPortalWrite, NextResponse, saveIdempotentResponse } from "@/lib/troptions/portalApiGuards";
import { draftOpenClawSiteFix } from "@/lib/troptions/openClawSiteManager";
import { OPENCLAW_BLOCKED_ACTIONS, OPENCLAW_REQUIRED_APPROVALS } from "@/content/troptions/openClawPolicyRegistry";

export async function POST(request: Request) {
  const guarded = await guardPortalWrite(request);
  if (guarded instanceof NextResponse) return guarded;

  const body = await request.json() as { issue?: string };
  const draft = draftOpenClawSiteFix({ issue: body.issue ?? "General site issue" });

  const responseBody = {
    ok: true,
    status: "drafted",
    mode: "planning",
    agentId: "site-ops-agent",
    taskId: `site-draft-${Date.now()}`,
    blockedActions: OPENCLAW_BLOCKED_ACTIONS,
    requiredApprovals: OPENCLAW_REQUIRED_APPROVALS,
    auditHint: "Draft plan only. No deployment or secret changes performed.",
    nextSteps: ["Review draft plan", "Convert to approved implementation task"],
    approvalRequired: true,
    draft,
  };

  saveIdempotentResponse(guarded.idempotency, 200, responseBody);
  return NextResponse.json(responseBody);
}
