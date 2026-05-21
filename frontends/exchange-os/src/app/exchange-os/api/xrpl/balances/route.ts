// TROPTIONS Exchange OS — XRPL Multi-Asset Balance API
// GET /exchange-os/api/xrpl/balances?address=rXXXXX
// Returns XRP + all IOU (trustline) balances for any XRPL address.

import { NextRequest, NextResponse } from "next/server";
import { xrplReadQuery } from "@/lib/exchange-os/xrpl/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function decodeHexCurrency(hex: string): string {
  if (hex.length !== 40) return hex;
  try {
    const bytes = Buffer.from(hex, "hex");
    const str = bytes.toString("ascii").replace(/\0/g, "").trim();
    if (/^[\x20-\x7E]{1,20}$/.test(str) && str.length > 0) return str;
  } catch {}
  return hex.slice(0, 8) + "…";
}

interface RawTrustLine {
  account: string;
  balance: string;
  currency: string;
  limit: string;
  limit_peer: string;
  no_ripple?: boolean;
  quality_in?: number;
  quality_out?: number;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address")?.trim();

  if (!address || !/^r[1-9A-HJ-NP-Za-km-z]{24,34}$/.test(address)) {
    return NextResponse.json({ error: "Invalid XRPL address" }, { status: 400 });
  }

  try {
    const [accountInfo, linesResult] = await Promise.all([
      xrplReadQuery("account_info", { account: address, ledger_index: "current" }),
      xrplReadQuery("account_lines", { account: address, ledger_index: "current" }),
    ]);

    const drops = (accountInfo as { account_data?: { Balance?: string } })
      ?.account_data?.Balance ?? "0";
    const xrp = parseInt(drops, 10) / 1_000_000;

    const lines: RawTrustLine[] = (linesResult as { lines?: RawTrustLine[] })?.lines ?? [];
    const iou = lines.map((line) => ({
      currency:
        line.currency.length === 40
          ? decodeHexCurrency(line.currency)
          : line.currency,
      currencyRaw: line.currency,
      issuer: line.account,
      balance: parseFloat(line.balance),
      limit: parseFloat(line.limit),
    }));

    return NextResponse.json({ address, xrp, iou, ts: new Date().toISOString() });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
