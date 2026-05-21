import { createUnsignedTestnetPayment } from "@/lib/troptions/xrplTestnetExecutionEngine";
import { guardPortalWrite, NextResponse, saveIdempotentResponse } from "@/lib/troptions/portalApiGuards";
import { assertNoSensitiveXrplInputs, buildXrplApiEnvelope } from "@/lib/troptions/xrplPlatformApiUtils";

export async function POST(request: Request) {
  const guarded = await guardPortalWrite(request);
  if (guarded instanceof NextResponse) return guarded;

  const body = await request.json() as Record<string, unknown> & { account?: string; destination?: string; amount?: string };
  assertNoSensitiveXrplInputs(body);

  const responseBody = buildXrplApiEnvelope({
    mode: "testnet-unsigned-payment",
    payload: createUnsignedTestnetPayment({ account: body.account ?? "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh", destination: body.destination, amount: body.amount }),
    blockedReason: "Unsigned testnet payload only.",
    requiredApprovals: ["Operator auth", "Idempotency key", "External signer"],
    auditHint: "No signing or submission performed.",
  });

  saveIdempotentResponse(guarded.idempotency, 200, responseBody);
  return NextResponse.json(responseBody);
}