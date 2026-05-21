import { NextResponse } from "next/server";
import { getMockLaunchChecklist } from "@/lib/troptions/infrastructure/mockData";
import { getLaunchBlockers, isChecklistComplete } from "@/lib/troptions/infrastructure/launchChecklist";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const namespaceId = searchParams.get("namespaceId") ?? "ns-troptions-main";
  const checklist = getMockLaunchChecklist(namespaceId);
  const blockers = getLaunchBlockers(checklist);
  const complete = isChecklistComplete(checklist);
  return NextResponse.json({ ok: true, checklist, blockers, complete });
}
