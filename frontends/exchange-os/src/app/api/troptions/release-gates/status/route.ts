import { NextResponse } from "next/server";
import { getReleaseGateStatus } from "@/lib/troptions/releaseGateEngine";
import { guardControlPlaneRequest } from "@/lib/troptions/requestGuards";

export async function GET(request: Request) {
  try {
    const guarded = await guardControlPlaneRequest(request, {
      requiredAction: "read-status",
      writeAction: false,
      requireIdempotency: false,
    });
    if (guarded instanceof NextResponse) return guarded;

    const status = getReleaseGateStatus();
    return NextResponse.json({ ok: true, status });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 400 });
  }
}
