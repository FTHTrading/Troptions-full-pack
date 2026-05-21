import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const MOMENTS_PATH = path.join(process.cwd(), "src/data/worldcup/moments.json");
const CLAIMS_PATH = path.join(process.cwd(), "src/data/worldcup/moment_claims.json");

interface Moment {
  id: string;
  slug: string;
  type: string;
  title: string;
  description: string;
  reward: string | null;
  supply_total: number;
  supply_claimed: number;
  claim_code: string;
  status: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { claim_code, phone, email, wallet_address } = body;

    if (!claim_code) {
      return NextResponse.json({ ok: false, error: "claim_code required" }, { status: 400 });
    }

    if (!phone && !email && !wallet_address) {
      return NextResponse.json(
        { ok: false, error: "Provide at least one of: phone, email, wallet_address" },
        { status: 400 },
      );
    }

    const moments: Moment[] = JSON.parse(fs.readFileSync(MOMENTS_PATH, "utf-8"));
    const momentIdx = moments.findIndex(
      (m) => m.claim_code.toUpperCase() === claim_code.toUpperCase().trim(),
    );

    if (momentIdx === -1) {
      return NextResponse.json({ ok: false, error: "Invalid claim code" }, { status: 404 });
    }

    const moment = moments[momentIdx];

    if (moment.status !== "active") {
      return NextResponse.json({ ok: false, error: "This drop is no longer active" }, { status: 410 });
    }

    if (moment.supply_claimed >= moment.supply_total) {
      return NextResponse.json({ ok: false, error: "This drop is sold out" }, { status: 410 });
    }

    const claims: object[] = JSON.parse(fs.readFileSync(CLAIMS_PATH, "utf-8"));

    // Deduplicate: one claim per identifier per moment
    const identifier = phone ?? email ?? wallet_address;
    const alreadyClaimed = claims.some(
      (c) =>
        (c as { moment_id: string; identifier: string }).moment_id === moment.id &&
        (c as { identifier: string }).identifier === identifier,
    );

    if (alreadyClaimed) {
      return NextResponse.json(
        { ok: false, error: "You have already claimed this moment" },
        { status: 409 },
      );
    }

    const claim = {
      claim_id: crypto.randomUUID(),
      moment_id: moment.id,
      moment_slug: moment.slug,
      moment_title: moment.title,
      claim_code: claim_code.toUpperCase().trim(),
      identifier,
      phone: phone ?? null,
      email: email ?? null,
      wallet_address: wallet_address ?? null,
      claimed_at: new Date().toISOString(),
      mint_status: "not_minted",
    };

    claims.push(claim);
    moments[momentIdx].supply_claimed += 1;

    fs.writeFileSync(CLAIMS_PATH, JSON.stringify(claims, null, 2));
    fs.writeFileSync(MOMENTS_PATH, JSON.stringify(moments, null, 2));

    return NextResponse.json({
      ok: true,
      claim_id: claim.claim_id,
      moment: {
        id: moment.id,
        slug: moment.slug,
        title: moment.title,
        type: moment.type,
        reward: moment.reward,
      },
      message: "Moment claimed successfully.",
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
