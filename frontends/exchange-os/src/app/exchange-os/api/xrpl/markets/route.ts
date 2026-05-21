// TROPTIONS Exchange OS — Real XRPL Market Data (xrplmeta.org proxy)
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// ---------- helpers --------------------------------------------------------

/** Decode a 40-char hex XRPL currency code to its ASCII ticker */
function decodeHexCurrency(hex: string): string {
  if (!hex || hex.length !== 40) return hex;
  try {
    const bytes = (hex.match(/.{2}/g) ?? []).map((b) => parseInt(b, 16));
    const ascii = bytes
      .map((b) => (b >= 32 && b < 127 ? String.fromCharCode(b) : ""))
      .join("")
      .replace(/\0+/g, "")
      .trim();
    return ascii || hex.slice(0, 8);
  } catch {
    return hex.slice(0, 8);
  }
}

// ---------- raw types ------------------------------------------------------

interface RawTokenMeta {
  token?: {
    name?: string;
    description?: string;
    icon?: string;
    dex?: string;
    weblinks?: { url?: string; type?: string }[];
  };
}

interface RawTokenMetrics {
  trustlines?: number;
  holders?: number;
  liquidity?: number;
  volume?: number;        // 24-hour volume (USD)
  volume_7d?: number;
  price?: number;         // USD
  market_cap?: number;
  changes?: {
    price_5m?: number;
    price_1h?: number;
    price_24h?: number;
    price_7d?: number;
  };
}

interface RawToken {
  currency?: string;
  issuer?: string;
  meta?: RawTokenMeta;
  metrics?: RawTokenMetrics;
}

// ---------- normalizer -----------------------------------------------------

function toStr(v: unknown, fallback = ""): string {
  if (v == null) return fallback;
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  // Object (e.g. {issuer/domain/rXXX}) — not renderable, use fallback
  return fallback;
}

function toNum(v: unknown, fallback = 0): number {
  const n = typeof v === "number" ? v : Number(v);
  return isFinite(n) ? n : fallback;
}

function normalizeToken(raw: RawToken) {
  const rawCurrency = toStr(raw.currency, "");
  const currency =
    rawCurrency.length === 40 ? decodeHexCurrency(rawCurrency) : rawCurrency;
  const m = raw.metrics ?? {};
  const meta = raw.meta?.token ?? {};

  return {
    currency,
    currencyHex: rawCurrency,
    issuer: toStr(raw.issuer, ""),
    name: toStr(meta.name, currency) || currency,
    icon: toStr(meta.icon) || null,
    dex: toStr(meta.dex, "XRPL DEX") || "XRPL DEX",
    price: toNum(m.price),
    change5m: toNum(m.changes?.price_5m),
    change1h: toNum(m.changes?.price_1h),
    change24h: toNum(m.changes?.price_24h),
    change7d: toNum(m.changes?.price_7d),
    volume24h: toNum(m.volume),
    volume7d: toNum(m.volume_7d),
    marketCap: toNum(m.market_cap),
    liquidity: toNum(m.liquidity),
    holders: toNum(m.trustlines ?? m.holders),
  };
}

export type XrplMarketToken = ReturnType<typeof normalizeToken>;

// ---------- route handler ---------------------------------------------------

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get("limit") ?? 100), 200);
  const sortBy = searchParams.get("sort") ?? "volume_24h";

  try {
    const upstream = await fetch(
      `https://s1.xrplmeta.org/tokens?sort_by=${sortBy}&limit=${limit}&expand_meta=1`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "TROPTIONS-ExchangeOS/1.0",
        },
        next: { revalidate: 30 },
      }
    );

    if (!upstream.ok) {
      throw new Error(`xrplmeta returned HTTP ${upstream.status}`);
    }

    const raw = (await upstream.json()) as { tokens?: RawToken[] };
    const tokens = (raw.tokens ?? []).map(normalizeToken);

    return NextResponse.json({
      tokens,
      count: tokens.length,
      source: "xrplmeta.org",
      ts: Date.now(),
    });
  } catch (e) {
    return NextResponse.json(
      { tokens: [], error: String(e), source: "xrplmeta.org", ts: Date.now() },
      { status: 502 }
    );
  }
}
