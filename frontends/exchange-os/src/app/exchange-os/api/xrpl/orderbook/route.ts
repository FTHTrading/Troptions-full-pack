// TROPTIONS Exchange OS — Live XRPL Order Book (book_offers)
// Fetches real bids & asks from XRPL mainnet. Read-only, safe.
import { NextRequest, NextResponse } from "next/server";
import { xrplReadQuery } from "@/lib/exchange-os/xrpl/client";
import { xrplConfig } from "@/config/exchange-os/xrpl";

export const runtime = "nodejs";

// ─── Types ────────────────────────────────────────────────────────────────────

interface XrplAmount {
  currency: string;
  issuer?: string;
  value: string;
}

interface RawOffer {
  Account?: string;
  TakerPays?: string | XrplAmount;
  TakerGets?: string | XrplAmount;
  quality?: string;
  Flags?: number;
}

interface OrderLevel {
  price: number;
  amount: number;
  total: number;
  account: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toNumber(v: string | XrplAmount | undefined): number {
  if (!v) return 0;
  if (typeof v === "string") return Number(v) / 1_000_000; // drops → XRP
  return parseFloat(v.value);
}

function resolveXrplAmount(ticker: string, issuer?: string): string | XrplAmount {
  if (ticker === "XRP") return "XRP" as string;
  return {
    currency:
      ticker === "TROPTIONS" ? xrplConfig.troptionsHex : ticker.toUpperCase(),
    issuer: issuer ?? xrplConfig.troptionsIssuer,
    value: "0",
  };
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const base = (searchParams.get("base") ?? "XRP").toUpperCase();
  const quote = (searchParams.get("quote") ?? "TROPTIONS").toUpperCase();
  const baseIssuer = searchParams.get("baseIssuer") ?? undefined;
  const quoteIssuer = searchParams.get("quoteIssuer") ?? undefined;
  const limit = Math.min(Number(searchParams.get("limit") ?? 20), 50);

  // Resolve XRPL currency amounts
  const baseCurrency = resolveXrplAmount(base, baseIssuer);
  const quoteCurrency = resolveXrplAmount(quote, quoteIssuer);

  try {
    // Fetch bids and asks in parallel
    const [bidsRaw, asksRaw] = await Promise.all([
      // Bids: want to buy base, offer quote
      xrplReadQuery("book_offers", {
        taker_pays: baseCurrency,
        taker_gets: quoteCurrency,
        limit,
      }) as Promise<{ offers?: RawOffer[] }>,

      // Asks: want to sell base, receive quote
      xrplReadQuery("book_offers", {
        taker_pays: quoteCurrency,
        taker_gets: baseCurrency,
        limit,
      }) as Promise<{ offers?: RawOffer[] }>,
    ]);

    function normalizeOffers(
      offers: RawOffer[],
      side: "bid" | "ask"
    ): OrderLevel[] {
      return offers
        .map((o) => {
          const pays = toNumber(o.TakerPays);
          const gets = toNumber(o.TakerGets);
          if (pays === 0 || gets === 0) return null;
          const price = side === "bid" ? pays / gets : gets / pays;
          const amount = side === "bid" ? gets : pays;
          return {
            price,
            amount,
            total: price * amount,
            account: o.Account ?? "",
          };
        })
        .filter(Boolean) as OrderLevel[];
    }

    const bids = normalizeOffers(bidsRaw?.offers ?? [], "bid").sort(
      (a, b) => b.price - a.price
    );
    const asks = normalizeOffers(asksRaw?.offers ?? [], "ask").sort(
      (a, b) => a.price - b.price
    );

    // Derived stats
    const bestBid = bids[0]?.price ?? 0;
    const bestAsk = asks[0]?.price ?? 0;
    const spread = bestAsk > 0 && bestBid > 0 ? bestAsk - bestBid : 0;
    const spreadPct =
      bestAsk > 0 && bestBid > 0
        ? ((spread / bestAsk) * 100).toFixed(3)
        : "0";
    const midPrice = bestBid > 0 && bestAsk > 0 ? (bestBid + bestAsk) / 2 : 0;

    return NextResponse.json({
      pair: `${base}/${quote}`,
      bids,
      asks,
      bestBid,
      bestAsk,
      spread,
      spreadPct,
      midPrice,
      source: "XRPL mainnet book_offers",
      ts: Date.now(),
    });
  } catch (e) {
    return NextResponse.json(
      {
        pair: `${base}/${quote}`,
        bids: [],
        asks: [],
        bestBid: 0,
        bestAsk: 0,
        spread: 0,
        spreadPct: "0",
        midPrice: 0,
        error: String(e),
        source: "XRPL mainnet book_offers",
        ts: Date.now(),
      },
      { status: 502 }
    );
  }
}
