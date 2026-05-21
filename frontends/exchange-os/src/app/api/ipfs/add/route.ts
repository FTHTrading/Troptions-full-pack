/**
 * POST /api/ipfs/add
 *
 * Adds a JSON document to the local IPFS node and optionally pins it.
 * Returns CID, ipfs:// URI, local gateway URL, and size.
 *
 * Request body (JSON):
 *   { content: unknown, filename?: string, pin?: boolean }
 *
 * ╔═══════════════════════════════════════════════════════════╗
 * ║  Server-side only. Proxies to 127.0.0.1:5001 (local).    ║
 * ║  Do NOT call this from a public-facing unauthenticated    ║
 * ║  endpoint without rate limiting and auth guards.          ║
 * ╚═══════════════════════════════════════════════════════════╝
 */
import { NextRequest, NextResponse } from "next/server";
import { ipfsAddJson, ipfsPin } from "@/lib/troptions/ipfsService";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (process.env.IPFS_LOCAL_ENABLED !== "true") {
    return NextResponse.json(
      { ok: false, error: "IPFS integration disabled (IPFS_LOCAL_ENABLED not set)" },
      { status: 503 },
    );
  }

  let body: { content?: unknown; filename?: string; pin?: boolean };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.content === undefined || body.content === null) {
    return NextResponse.json({ ok: false, error: "content is required" }, { status: 400 });
  }

  const filename = typeof body.filename === "string" ? body.filename : "document.json";
  const shouldPin = body.pin !== false; // default: pin=true

  const addResult = await ipfsAddJson(body.content, filename);
  if (!addResult.ok) {
    return NextResponse.json(addResult, { status: 502 });
  }

  let pinned = false;
  if (shouldPin && addResult.cid) {
    const pinResult = await ipfsPin(addResult.cid);
    pinned = pinResult.pinned ?? false;
  }

  return NextResponse.json({ ...addResult, pinned }, { status: 200 });
}
