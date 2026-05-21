import { NextResponse } from "next/server";
import { getObservabilitySnapshot } from "@/lib/troptions/observabilityEngine";
import { guardControlPlaneRequest } from "@/lib/troptions/requestGuards";

export async function GET(request: Request) {
  try {
    const guarded = await guardControlPlaneRequest(request, {
      requiredAction: "read-status",
      writeAction: false,
      requireIdempotency: false,
    });
    if (guarded instanceof NextResponse) return guarded;

    const snapshot = await getObservabilitySnapshot();
    return NextResponse.json({ ok: true, snapshot });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 400 },
    );
  }
}
