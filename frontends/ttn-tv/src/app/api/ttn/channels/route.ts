import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const data = fs.readFileSync(
    path.join(process.cwd(), "src/data/ttn/channels.json"),
    "utf-8",
  );
  return NextResponse.json(JSON.parse(data));
}
