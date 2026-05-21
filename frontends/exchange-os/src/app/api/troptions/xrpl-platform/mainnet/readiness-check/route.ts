import { getXrplMainnetReadinessGate } from "@/lib/troptions/xrplMainnetReadinessGate";
import { guardPortalWrite, NextResponse, saveIdempotentResponse } from "@/lib/troptions/portalApiGuards";
import { assertNoSensitiveXrplInputs, buildXrplApiEnvelope } from "@/lib/troptions/xrplPlatformApiUtils";

export async function POST(request: Request) {
  const guarded = await guardPortalWrite(request);
  if (guarded instanceof NextResponse) return guarded;
  const body = await request.json() as Record<string, unknown>;
  assertNoSensitiveXrplInputs(body);

  const gate = getXrplMainnetReadinessGate();
  const responseBody = buildXrplApiEnvelope({
    mode: gate.mode,
    blockedReason: gate.blockedReason,
    requiredApprovals: gate.requiredApprovals,
    blockedTransactionTypes: gate.blockedTransactionTypes,
    auditHint: gate.auditHint,
  });

  saveIdempotentResponse(guarded.idempotency, 200, responseBody);
  return NextResponse.json(responseBody);
}