import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const MOMENTS_PATH = path.join(process.cwd(), "src/data/worldcup/moments.json");

export async function GET() {
  try {
    const raw = fs.readFileSync(MOMENTS_PATH, "utf-8");
    const moments = JSON.parse(raw);
    return NextResponse.json({ ok: true, moments });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not load moments" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      id, slug, type, title, description, reward, supply_total,
      claim_code, sponsor_name, charity_name, mint_enabled,
    } = body;

    if (!id || !slug || !type || !title || !claim_code) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields: id, slug, type, title, claim_code" },
        { status: 400 },
      );
    }

    const raw = fs.readFileSync(MOMENTS_PATH, "utf-8");
    const moments = JSON.parse(raw);

    const exists = moments.find((m: { id: string; slug: string }) => m.id === id || m.slug === slug);
    if (exists) {
      return NextResponse.json({ ok: false, error: "Moment with this id or slug already exists" }, { status: 409 });
    }

    const newMoment = {
      id,
      slug,
      type,
      title,
      description: description ?? "",
      reward: reward ?? null,
      supply_total: supply_total ?? 1000,
      supply_claimed: 0,
      claim_code,
      sponsor_name: sponsor_name ?? null,
      charity_name: charity_name ?? null,
      mint_enabled: mint_enabled ?? false,
      status: "active",
      created_at: new Date().toISOString(),
    };

    moments.push(newMoment);
    fs.writeFileSync(MOMENTS_PATH, JSON.stringify(moments, null, 2));

    return NextResponse.json({ ok: true, moment: newMoment });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
