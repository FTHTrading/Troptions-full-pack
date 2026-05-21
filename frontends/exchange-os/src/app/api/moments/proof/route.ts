import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const MOMENTS_PATH = path.join(process.cwd(), "src/data/worldcup/moments.json");
const CLAIMS_PATH = path.join(process.cwd(), "src/data/worldcup/moment_claims.json");
const RECEIPTS_PATH = path.join(process.cwd(), "src/data/worldcup/mint_receipts.json");

export async function GET() {
  try {
    const moments = JSON.parse(fs.readFileSync(MOMENTS_PATH, "utf-8"));
    const claims = JSON.parse(fs.readFileSync(CLAIMS_PATH, "utf-8"));
    const receipts = JSON.parse(fs.readFileSync(RECEIPTS_PATH, "utf-8"));

    const total_supply = moments.reduce((a: number, m: { supply_total: number }) => a + m.supply_total, 0);
    const total_claimed = moments.reduce((a: number, m: { supply_claimed: number }) => a + m.supply_claimed, 0);
    const minted = receipts.filter((r: { status: string }) => r.status === "minted").length;

    const by_type: Record<string, number> = {};
    for (const m of moments) {
      by_type[m.type] = (by_type[m.type] ?? 0) + m.supply_claimed;
    }

    return NextResponse.json({
      ok: true,
      proof: {
        moments_active: moments.filter((m: { status: string }) => m.status === "active").length,
        moments_total: moments.length,
        total_supply,
        total_claimed,
        total_minted: minted,
        total_claims_file: claims.length,
        by_type,
        generated_at: new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not load proof data" }, { status: 500 });
  }
}
