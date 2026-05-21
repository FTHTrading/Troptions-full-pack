import { guardPortalRead, NextResponse } from "@/lib/troptions/portalApiGuards";
import { listTaskRecords } from "@/lib/troptions/controlHubStateStore";

export async function GET(request: Request) {
  const guarded = await guardPortalRead(request);
  if (guarded instanceof NextResponse) return guarded;

  const url = new URL(request.url);
  const limitParam = url.searchParams.get("limit");
  const limit = limitParam ? Math.min(Math.max(1, Number(limitParam)), 500) : 50;

  try {
    const tasks = listTaskRecords(limit);
    return NextResponse.json({ ok: true, tasks, count: tasks.length });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Tasks unavailable — persistence layer not ready." },
      { status: 503 },
    );
  }
}
