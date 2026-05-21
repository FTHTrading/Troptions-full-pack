import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const MOMENTS_PATH = path.join(process.cwd(), "src/data/worldcup/moments.json");

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const raw = fs.readFileSync(MOMENTS_PATH, "utf-8");
    const moments = JSON.parse(raw);
    const moment = moments.find(
      (m: { id: string; slug: string }) => m.id === id || m.slug === id,
    );
    if (!moment) {
      return NextResponse.json({ ok: false, error: "Moment not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, moment });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not load moment" }, { status: 500 });
  }
}
