import { NextResponse } from "next/server";
import { fetchChainLiveData } from "@/lib/troptions/chainLiveData";

export const revalidate = 60;

export async function GET() {
  const data = await fetchChainLiveData();
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
  });
}
