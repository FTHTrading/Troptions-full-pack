import { NextRequest, NextResponse } from "next/server";
import { ammDeposit } from "@/lib/troptions/mintingEngine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { asset1, asset2, amount1, amount2, lpTokenAmount } = body;

    if (!asset1?.currency || !asset2?.currency) {
      return NextResponse.json({ ok: false, error: "asset1 and asset2 with currency are required" }, { status: 400 });
    }
    if (!amount1 && !lpTokenAmount) {
      return NextResponse.json({ ok: false, error: "Provide amount1 (and optionally amount2), or lpTokenAmount" }, { status: 400 });
    }
    if (asset1.currency !== "XRP" && !asset1.issuer) {
      return NextResponse.json({ ok: false, error: "asset1.issuer required for non-XRP assets" }, { status: 400 });
    }
    if (asset2.currency !== "XRP" && !asset2.issuer) {
      return NextResponse.json({ ok: false, error: "asset2.issuer required for non-XRP assets" }, { status: 400 });
    }

    const result = await ammDeposit({ asset1, asset2, amount1, amount2, lpTokenAmount });
    return NextResponse.json(result, { status: result.ok ? 200 : 500 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
