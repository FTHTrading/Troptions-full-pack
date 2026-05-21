import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";
import { AI_DISCLAIMER } from "@/content/troptions/aiSearchRegistry";

export async function GET() {
  const data = JSON.parse(
    readFileSync(path.join(process.cwd(), "public", "troptions-proof-index.json"), "utf-8")
  );
  return NextResponse.json({ ok: true, disclaimer: AI_DISCLAIMER, ...data });
}
