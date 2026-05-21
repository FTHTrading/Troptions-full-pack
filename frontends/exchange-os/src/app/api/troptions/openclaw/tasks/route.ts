import { guardPortalRead, NextResponse } from "@/lib/troptions/portalApiGuards";
import { OPENCLAW_TASK_REGISTRY } from "@/content/troptions/openClawTaskRegistry";
import { OPENCLAW_BLOCKED_ACTIONS, OPENCLAW_REQUIRED_APPROVALS } from "@/content/troptions/openClawPolicyRegistry";

export async function GET(request: Request) {
  const guarded = await guardPortalRead(request);
  if (guarded instanceof NextResponse) return guarded;

  return NextResponse.json({
    ok: true,
    status: "ok",
    mode: "simulation",
    agentId: "jefe",
    taskId: "tasks-list",
    blockedActions: OPENCLAW_BLOCKED_ACTIONS,
    requiredApprovals: OPENCLAW_REQUIRED_APPROVALS,
    auditHint: "Read-only task template list.",
    nextSteps: ["Create dry-run task from template"],
    tasks: OPENCLAW_TASK_REGISTRY,
  });
}
