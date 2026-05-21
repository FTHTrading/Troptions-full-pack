import { guardPortalRead, NextResponse } from "@/lib/troptions/portalApiGuards";
import { listRecommendationRecords } from "@/lib/troptions/controlHubStateStore";

export async function GET(request: Request) {
  const guarded = await guardPortalRead(request);
  if (guarded instanceof NextResponse) return guarded;

  const url = new URL(request.url);
  const limitParam = url.searchParams.get("limit");
  const limit = limitParam ? Math.min(Math.max(1, Number(limitParam)), 500) : 50;

  try {
    const recommendations = listRecommendationRecords(undefined, limit);
    return NextResponse.json({ ok: true, recommendations, count: recommendations.length });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Recommendations unavailable — persistence layer not ready." },
      { status: 503 },
    );
  }
}
