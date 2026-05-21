import { guardPortalWrite, NextResponse, saveIdempotentResponse } from "@/lib/troptions/portalApiGuards";
import { routeOpenClawAgent } from "@/lib/troptions/openClawAgentRouter";
import { OPENCLAW_BLOCKED_ACTIONS, OPENCLAW_REQUIRED_APPROVALS } from "@/content/troptions/openClawPolicyRegistry";

export async function POST(request: Request) {
  const guarded = await guardPortalWrite(request);
  if (guarded instanceof NextResponse) return guarded;

  const body = await request.json() as { message?: string };
  const message = body.message ?? "";
  const routed = routeOpenClawAgent(message);

  const responseBody = {
    ok: true,
    status: "routed",
    mode: "simulation",
    agentId: routed.id,
    taskId: `chat-${Date.now()}`,
    blockedActions: OPENCLAW_BLOCKED_ACTIONS,
    requiredApprovals: OPENCLAW_REQUIRED_APPROVALS,
    auditHint: "Chat routed to specialist in simulation mode.",
    nextSteps: ["Review response draft", "Request operator action if sensitive"],
    approvalRequired: true,
    reply: `Routed to ${routed.label}. Live execution remains disabled.`,
  };

  saveIdempotentResponse(guarded.idempotency, 200, responseBody);
  return NextResponse.json(responseBody);
}
