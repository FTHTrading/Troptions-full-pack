import { NextResponse } from "next/server";
import { Client } from "xrpl";

// TROPTIONS on XRPL — non-standard 9-char currency code encoded as 20-byte hex
const TROPTIONS_HEX = "54524F5054494F4E530000000000000000000000";
const XRPL_NODE = process.env.XRPL_NODE || "wss://xrplcluster.com";
const TROPTIONS_ISSUER = process.env.XRPL_TREASURY_ADDRESS || "";

// Cache for 30s — read-only market data
export const revalidate = 30;

export async function GET() {
  if (!TROPTIONS_ISSUER) {
    return NextResponse.json(
      { ok: false, error: "XRPL_TREASURY_ADDRESS not configured" },
      { status: 500 }
    );
  }

  const client = new Client(XRPL_NODE);
  try {
    await client.connect();

    const [bidsResp, asksResp] = await Promise.all([
      // Bids: accounts offering TROPTIONS, wanting XRP (TROPTIONS sellers on book)
      client.request({
        command: "book_offers",
        taker_pays: { currency: "XRP" },
        taker_gets: { currency: TROPTIONS_HEX, issuer: TROPTIONS_ISSUER },
        limit: 10,
      }),
      // Asks: accounts offering XRP, wanting TROPTIONS (XRP sellers / TROPTIONS buyers on book)
      client.request({
        command: "book_offers",
        taker_pays: { currency: TROPTIONS_HEX, issuer: TROPTIONS_ISSUER },
        taker_gets: { currency: "XRP" },
        limit: 10,
      }),
    ]);

    const bids = bidsResp.result.offers ?? [];
    const asks = asksResp.result.offers ?? [];

    // Extract best bid/ask prices
    // bids[0] = best offer for TROPTIONS (paying XRP) → price = TakerGets(TROPTIONS) / TakerPays(XRP drops)
    // asks[0] = best offer selling TROPTIONS for XRP → price = TakerPays(XRP drops) / TakerGets(TROPTIONS)
    let bestBidXrpPerTroptions: number | null = null;
    let bestAskXrpPerTroptions: number | null = null;

    if (bids.length > 0) {
      const bid = bids[0] as unknown as Record<string, unknown>;
      const tg = bid.TakerGets as { value?: string } | undefined;
      const tp = bid.TakerPays;
      if (tg?.value && typeof tp === "string") {
        const xrp = parseInt(tp, 10) / 1_000_000;
        const tropt = parseFloat(tg.value);
        if (tropt > 0) bestBidXrpPerTroptions = xrp / tropt;
      }
    }

    if (asks.length > 0) {
      const ask = asks[0] as unknown as Record<string, unknown>;
      const tg = ask.TakerGets as string | undefined;
      const tp = ask.TakerPays as { value?: string } | undefined;
      if (tp?.value && typeof tg === "string") {
        const xrp = parseInt(tg, 10) / 1_000_000;
        const tropt = parseFloat(tp.value);
        if (tropt > 0) bestAskXrpPerTroptions = xrp / tropt;
      }
    }

    return NextResponse.json({
      ok: true,
      currency: TROPTIONS_HEX,
      issuer: TROPTIONS_ISSUER,
      bestBidXrpPerTroptions,
      bestAskXrpPerTroptions,
      bidCount: bids.length,
      askCount: asks.length,
      bids: bids.slice(0, 5),
      asks: asks.slice(0, 5),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err), timestamp: new Date().toISOString() },
      { status: 422 }
    );
  } finally {
    await client.disconnect().catch(() => {});
  }
}
