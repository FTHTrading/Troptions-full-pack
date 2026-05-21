import { getXrplOrderBook, listXrplOrderBooks } from "@/lib/troptions/xrplOrderBookEngine";
import { guardPortalRead, NextResponse } from "@/lib/troptions/portalApiGuards";
import { buildXrplApiEnvelope } from "@/lib/troptions/xrplPlatformApiUtils";

export async function GET(request: Request) {
  const guarded = await guardPortalRead(request);
  if (guarded instanceof NextResponse) return guarded;
  const url = new URL(request.url);
  const pair = url.searchParams.get("pair") ?? undefined;
  return NextResponse.json(buildXrplApiEnvelope({ mode: "order-book-read-only", orderBook: pair ? getXrplOrderBook(pair) : listXrplOrderBooks(), blockedReason: "Execution disabled.", requiredApprovals: [], auditHint: "Read-only order-book data." }));
}