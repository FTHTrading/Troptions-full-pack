/**
 * GET  /api/ipfs/pin?cid=<CID>   — check pin status
 * POST /api/ipfs/pin              — pin a CID
 *   Body: { cid: string }
 *
 * ╔═══════════════════════════════════════════════════════════╗
 * ║  Proxies to 127.0.0.1:5001 (local Kubo only).            ║
 * ║  Do NOT expose port 5001 publicly.                        ║
 * ╚═══════════════════════════════════════════════════════════╝
 */
import { NextRequest, NextResponse } from "next/server";
import { ipfsIsPinned, ipfsPin, isValidCid } from "@/lib/troptions/ipfsService";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (process.env.IPFS_LOCAL_ENABLED !== "true") {
    return NextResponse.json(
      { ok: false, error: "IPFS integration disabled" },
      { status: 503 },
    );
  }

  const cid = req.nextUrl.searchParams.get("cid") ?? "";
  if (!isValidCid(cid)) {
    return NextResponse.json(
      { ok: false, error: `Invalid or missing CID: ${cid}` },
      { status: 400 },
    );
  }

  const result = await ipfsIsPinned(cid);
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}

export async function POST(req: NextRequest) {
  if (process.env.IPFS_LOCAL_ENABLED !== "true") {
    return NextResponse.json(
      { ok: false, error: "IPFS integration disabled" },
      { status: 503 },
    );
  }

  let body: { cid?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const cid = body.cid ?? "";
  if (!isValidCid(cid)) {
    return NextResponse.json(
      { ok: false, error: `Invalid CID: ${cid}` },
      { status: 400 },
    );
  }

  const result = await ipfsPin(cid);
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
