import { NextRequest, NextResponse } from "next/server";
import {
  getTreasurySnapshot,
  getTreasuryTopologySnapshot,
} from "@/lib/troptions/treasuryEngine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/troptions/treasury
 *
 * Query params:
 *   mode=topology  — return topology only (fast, no chain queries)
 *   (default)      — return full live snapshot (queries XRPL + Stellar in parallel)
 *
 * SAFETY: read-only. No signing, no broadcasting.
 */
export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get("mode");

  if (mode === "topology") {
    return NextResponse.json(getTreasuryTopologySnapshot(), {
      headers: { "Cache-Control": "no-store" },
    });
  }

  try {
    const snapshot = await getTreasurySnapshot();
    return NextResponse.json(snapshot, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: "treasury_snapshot_failed",
        message: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
