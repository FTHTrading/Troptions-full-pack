import { NextResponse } from "next/server";

export const revalidate = 60;

export async function GET() {
  try {
    const resp = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ripple,stellar&vs_currencies=usd",
      { next: { revalidate: 60 }, signal: AbortSignal.timeout(8000) }
    );
    if (!resp.ok) throw new Error(`CoinGecko ${resp.status}`);
    const data = await resp.json() as Record<string, { usd?: number }>;
    return NextResponse.json({
      ok: true,
      xrp: data.ripple?.usd ?? null,
      xlm: data.stellar?.usd ?? null,
      lastUpdated: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({
      ok: false,
      xrp: null,
      xlm: null,
      error: String(err),
      lastUpdated: new Date().toISOString(),
    });
  }
}
