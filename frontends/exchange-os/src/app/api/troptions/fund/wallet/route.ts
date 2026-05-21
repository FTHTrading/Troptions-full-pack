import { NextRequest, NextResponse } from "next/server";
import { fundWallet } from "@/lib/troptions/mintingEngine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { toAddress, amountXrp, memo } = body;

    if (!toAddress || typeof toAddress !== "string") {
      return NextResponse.json({ ok: false, error: "toAddress is required" }, { status: 400 });
    }
    if (!amountXrp || isNaN(parseFloat(amountXrp))) {
      return NextResponse.json({ ok: false, error: "amountXrp (numeric string) is required" }, { status: 400 });
    }
    if (parseFloat(amountXrp) <= 0) {
      return NextResponse.json({ ok: false, error: "amountXrp must be > 0" }, { status: 400 });
    }

    const result = await fundWallet({ toAddress, amountXrp: String(amountXrp), memo });
    return NextResponse.json(result, { status: result.ok ? 200 : 500 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
