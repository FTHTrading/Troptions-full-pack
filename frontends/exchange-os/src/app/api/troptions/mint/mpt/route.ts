import { NextRequest, NextResponse } from "next/server";
import { mintMpt } from "@/lib/troptions/mintingEngine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, ticker, maxSupply, assetScale, transferFee, transferable, tradeable, clawback } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ ok: false, error: "name is required" }, { status: 400 });
    }
    if (!ticker || typeof ticker !== "string") {
      return NextResponse.json({ ok: false, error: "ticker is required" }, { status: 400 });
    }
    if (!maxSupply || typeof maxSupply !== "string") {
      return NextResponse.json({ ok: false, error: "maxSupply (string) is required" }, { status: 400 });
    }
    if (transferFee !== undefined && (transferFee < 0 || transferFee > 50000)) {
      return NextResponse.json({ ok: false, error: "transferFee must be 0–50000" }, { status: 400 });
    }
    if (assetScale !== undefined && (assetScale < 0 || assetScale > 15)) {
      return NextResponse.json({ ok: false, error: "assetScale must be 0–15" }, { status: 400 });
    }

    const result = await mintMpt({ name, ticker, maxSupply, assetScale, transferFee, transferable, tradeable, clawback });
    return NextResponse.json(result, { status: result.ok ? 200 : 500 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
