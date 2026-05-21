import { guardPortalWrite, NextResponse, saveIdempotentResponse } from "@/lib/troptions/portalApiGuards";
import { simulateOpenClawX402PaymentIntent } from "@/lib/troptions/openClawX402Engine";
import { OPENCLAW_BLOCKED_ACTIONS, OPENCLAW_REQUIRED_APPROVALS } from "@/content/troptions/openClawPolicyRegistry";

export async function POST(request: Request) {
  const guarded = await guardPortalWrite(request);
  if (guarded instanceof NextResponse) return guarded;

  const body = await request.json() as { amount?: string; currency?: string; payer?: string; payee?: string };
  const simulation = simulateOpenClawX402PaymentIntent({
    amount: body.amount ?? "0",
    currency: body.currency ?? "USD",
    payer: body.payer ?? "payer",
    payee: body.payee ?? "payee",
    idempotencyKey: guarded.idempotency?.idempotencyKey ?? "",
  });

  const responseBody = {
    ok: true,
    status: "simulated",
    mode: "simulation",
    agentId: "x402-agent",
    taskId: `x402-${Date.now()}`,
    blockedActions: OPENCLAW_BLOCKED_ACTIONS,
    requiredApprovals: OPENCLAW_REQUIRED_APPROVALS,
    auditHint: "x402 payment intent simulation only.",
    nextSteps: ["Review blocked reasons", "Request provider/compliance approval if needed"],
    approvalRequired: true,
    simulation,
  };

  saveIdempotentResponse(guarded.idempotency, 200, responseBody);
  return NextResponse.json(responseBody);
}
