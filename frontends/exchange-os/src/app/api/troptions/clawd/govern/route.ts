import { NextResponse } from "next/server";
import { evaluateClawdIntent } from "@/lib/troptions/clawdGovernanceAdapter";
import {
  createTaskRecord,
  createSimulationRecord,
  createApprovalRecord,
  createAuditRecord,
  createBlockedActionRecord,
} from "@/lib/troptions/controlHubStateStore";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ ok: false, error: "Authorization required" }, { status: 401 });
  }

  const idempotencyKey = request.headers.get("idempotency-key");
  if (!idempotencyKey) {
    return NextResponse.json({ ok: false, error: "idempotency-key header required" }, { status: 400 });
  }

  let body: { intent?: string; context?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.intent || typeof body.intent !== "string" || body.intent.trim().length === 0) {
    return NextResponse.json({ ok: false, error: "intent field required" }, { status: 400 });
  }

  if (body.intent.trim().length > 500) {
    return NextResponse.json({ ok: false, error: "intent must be 500 characters or fewer" }, { status: 400 });
  }

  const governed = evaluateClawdIntent(body.intent.trim());

  // ─── persist governance state ─────────────────────────────────────────────
  let taskId: string | null = null;
  let auditRecordId: string | null = null;
  let persisted = false;

  try {
    // Determine task status from evaluation outcome
    const taskStatus =
      governed.blocked.length > 0
        ? "blocked"
        : governed.requiresApproval
          ? "needs_approval"
          : "simulated";

    const task = createTaskRecord({
      intent: governed.intent,
      status: taskStatus,
      auditToken: governed.auditToken,
      routedTo: governed.routedTo,
      requiresApproval: governed.requiresApproval,
    });
    taskId = task.id;

    createSimulationRecord({
      taskId: task.id,
      simulationJson: JSON.stringify({
        ok: governed.ok,
        simulationOnly: governed.simulationOnly,
        intent: governed.intent,
        allowed: governed.allowed,
        blocked: governed.blocked,
        appliedConstraints: governed.appliedConstraints,
        routedTo: governed.routedTo,
        requiresApproval: governed.requiresApproval,
        routingReason: governed.routingReason,
        plan: governed.plan,
        auditToken: governed.auditToken,
      }),
    });

    if (governed.requiresApproval) {
      createApprovalRecord({
        taskId: task.id,
        requiredFor: `Intent: ${governed.intent}`,
        status: "pending",
      });
    }

    for (const blocked of governed.blocked) {
      createBlockedActionRecord({
        taskId: task.id,
        capabilityId: blocked.id,
        reason: blocked.reason ?? "Blocked by capability policy",
      });
    }

    const audit = createAuditRecord({
      taskId: task.id,
      auditToken: governed.auditToken,
      intent: governed.intent,
      actionType: "govern-intent-evaluation",
      outcome: taskStatus,
      blockedCount: governed.blocked.length,
      requiresApproval: governed.requiresApproval,
    });
    auditRecordId = audit.id;

    persisted = true;
  } catch {
    // Persistence failure is non-fatal — governance result is still returned.
    // No unsafe execution is enabled on failure.
    persisted = false;
  }

  return NextResponse.json({
    ok: governed.ok,
    simulationOnly: governed.simulationOnly,
    intent: governed.intent,
    allowed: governed.allowed,
    blocked: governed.blocked,
    constraints: governed.appliedConstraints,
    routedTo: governed.routedTo,
    requiresApproval: governed.requiresApproval,
    routingReason: governed.routingReason,
    plan: governed.plan,
    auditToken: governed.auditToken,
    taskId,
    persisted,
    auditRecordId,
  });
}
