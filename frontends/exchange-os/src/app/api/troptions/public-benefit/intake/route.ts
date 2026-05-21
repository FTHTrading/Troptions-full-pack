import { NextResponse } from "next/server";
import { guardControlPlaneRequest, saveIdempotentResponse } from "@/lib/troptions/requestGuards";
import { trackControlPlaneEvent } from "@/lib/troptions/monitoring";
import { simulatePublicBenefitIntake } from "@/lib/troptions/publicBenefitRailEngine";

export async function POST(request: Request) {
  let idempotency: Parameters<typeof saveIdempotentResponse>[0];
  try {
    const guarded = await guardControlPlaneRequest(request, {
      requiredAction: "request-approval",
      writeAction: true,
      requireIdempotency: true,
    });
    if (guarded instanceof NextResponse) return guarded;
    idempotency = guarded.idempotency;

    const body = (await request.json()) as { organizationName?: string; programType?: string; contactEmail?: string };
    const result = simulatePublicBenefitIntake({
      organizationName: body.organizationName ?? "unknown",
      programType: body.programType ?? "prevention-support",
      contactEmail: body.contactEmail ?? "unknown@example.org",
    });

    trackControlPlaneEvent("public_benefit_intake_simulated", "info", {
      actorId: guarded.auth.actorId,
      actorRole: guarded.auth.actorRole,
      routeKey: new URL(request.url).pathname,
      simulationOnly: true,
    });

    saveIdempotentResponse(idempotency, 200, result);
    return NextResponse.json(result);
  } catch (error) {
    const responseBody = { ok: false, error: (error as Error).message, blockedReasons: ["Simulation request failed"] };
    saveIdempotentResponse(idempotency, 400, responseBody);
    return NextResponse.json(responseBody, { status: 400 });
  }
}
