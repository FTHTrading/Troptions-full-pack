import { NextResponse } from "next/server";
import { getDurableObservabilityExport } from "@/lib/troptions/durableObservabilityStore";
import { guardControlPlaneRequest } from "@/lib/troptions/requestGuards";

export async function GET(request: Request) {
  try {
    const guarded = await guardControlPlaneRequest(request, {
      requiredAction: "read-audit-log",
      writeAction: false,
      requireIdempotency: false,
    });
    if (guarded instanceof NextResponse) return guarded;

    const url = new URL(request.url);
    const parsedLimit = Number(url.searchParams.get("limit") ?? "500");
    const limit = Number.isFinite(parsedLimit) ? parsedLimit : 500;

    const exportData = await getDurableObservabilityExport(limit);
    return NextResponse.json({
      ok: true,
      exportedAt: new Date().toISOString(),
      limit: Math.max(1, Math.min(limit, 5000)),
      data: exportData,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 400 },
    );
  }
}
