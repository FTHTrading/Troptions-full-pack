import { guardPortalWrite, NextResponse, saveIdempotentResponse } from "@/lib/troptions/portalApiGuards";
import { checkWalletReadiness } from "@/lib/troptions/jefeEngine";
import { buildJefePostEnvelope } from "@/lib/troptions/jefeApi";

export async function POST(request: Request) {
  const guarded = await guardPortalWrite(request);
  if (guarded instanceof NextResponse) return guarded;

  const readiness = checkWalletReadiness();
  const responseBody = buildJefePostEnvelope("Wallet check is support and status only.", {
    status: "checked",
    mode: "simulation",
    jefeStatus: "online",
    taskId: `jefe-wallet-${Date.now()}`,
    routedAgent: "wallet-agent",
    readiness,
  });

  saveIdempotentResponse(guarded.idempotency, 200, responseBody);
  return NextResponse.json(responseBody);
}
