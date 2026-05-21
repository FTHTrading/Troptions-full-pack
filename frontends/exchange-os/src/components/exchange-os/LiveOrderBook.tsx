"use client";
// TROPTIONS Exchange OS — Live XRPL Order Book (real book_offers from mainnet)

import { useState, useEffect, useRef, useCallback } from "react";

interface OrderLevel {
  price: number;
  amount: number;
  total: number;
  account: string;
}

interface OrderBookData {
  pair: string;
  bids: OrderLevel[];
  asks: OrderLevel[];
  bestBid: number;
  bestAsk: number;
  spread: number;
  spreadPct: string;
  midPrice: number;
  error?: string;
  ts: number;
}

interface LiveOrderBookProps {
  base?: string;
  quote?: string;
  baseIssuer?: string;
  quoteIssuer?: string;
  /** Max levels to display per side */
  depth?: number;
  className?: string;
}

// ─── Formatters ───────────────────────────────────────────────────────────────

function fmtPrice(n: number, sigFigs = 6): string {
  if (n === 0) return "0";
  if (n >= 1) return n.toFixed(4);
  return n.toPrecision(sigFigs);
}

function fmtAmount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(2)}K`;
  return n.toFixed(4);
}

// ─── Depth bar for visual fill ────────────────────────────────────────────────

function DepthBar({
  pct,
  side,
}: {
  pct: number;
  side: "bid" | "ask";
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        width: `${pct}%`,
        right: side === "bid" ? 0 : undefined,
        left: side === "ask" ? 0 : undefined,
        background:
          side === "bid"
            ? "rgba(34,197,94,0.08)"
            : "rgba(239,68,68,0.08)",
        pointerEvents: "none",
        transition: "width 0.3s",
      }}
    />
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function LiveOrderBook({
  base = "XRP",
  quote = "TROPTIONS",
  baseIssuer,
  quoteIssuer,
  depth = 12,
  className,
}: LiveOrderBookProps) {
  const [data, setData] = useState<OrderBookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(
    async (background = false) => {
      if (!background) setLoading(true);
      try {
        const params = new URLSearchParams({
          base,
          quote,
          limit: String(depth + 5),
        });
        if (baseIssuer) params.set("baseIssuer", baseIssuer);
        if (quoteIssuer) params.set("quoteIssuer", quoteIssuer);

        const res = await fetch(
          `/exchange-os/api/xrpl/orderbook?${params}`,
          { cache: "no-store" }
        );
        const json: OrderBookData = await res.json();
        setData(json);
        if (!json.error) setLastUpdated(new Date());
      } catch (e) {
        setData((prev) =>
          prev
            ? { ...prev, error: String(e) }
            : ({
                pair: `${base}/${quote}`,
                bids: [],
                asks: [],
                bestBid: 0,
                bestAsk: 0,
                spread: 0,
                spreadPct: "0",
                midPrice: 0,
                error: String(e),
                ts: Date.now(),
              } as OrderBookData)
        );
      } finally {
        setLoading(false);
      }
    },
    [base, quote, baseIssuer, quoteIssuer, depth]
  );

  useEffect(() => {
    load(false);
    timerRef.current = setInterval(() => load(true), 15_000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [load]);

  const bids = (data?.bids ?? []).slice(0, depth);
  const asks = (data?.asks ?? []).slice(0, depth);
  const maxBidTotal = Math.max(...bids.map((b) => b.total), 1);
  const maxAskTotal = Math.max(...asks.map((a) => a.total), 1);

  const headerCell = {
    padding: "0.3rem 0.5rem",
    fontSize: "0.65rem",
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
    color: "var(--xos-text-muted)",
  };

  const rowStyle = {
    position: "relative" as const,
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    cursor: "default",
    borderBottom: "1px solid rgba(255,255,255,0.03)",
  };

  const cell = {
    padding: "0.22rem 0.5rem",
    fontSize: "0.72rem",
    fontVariantNumeric: "tabular-nums" as const,
    fontFamily: "monospace",
    position: "relative" as const,
    zIndex: 1,
  };

  return (
    <div
      className={className}
      style={{
        borderRadius: "var(--xos-radius-lg)",
        border: "1px solid var(--xos-border-1)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        background: "var(--xos-bg-panel)",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.65rem 0.75rem 0.4rem",
          borderBottom: "1px solid var(--xos-border-1)",
          background: "var(--xos-surface-2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span
            style={{ fontWeight: 800, fontSize: "0.82rem", color: "var(--xos-text)" }}
          >
            Order Book
          </span>
          <span
            style={{
              fontSize: "0.68rem",
              color: "var(--xos-text-muted)",
              padding: "0.1rem 0.4rem",
              background: "var(--xos-surface-1)",
              borderRadius: 4,
            }}
          >
            {base}/{quote}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: data?.error
                ? "var(--xos-red)"
                : loading
                ? "var(--xos-gold)"
                : "var(--xos-green)",
              display: "inline-block",
              boxShadow: data?.error
                ? "0 0 4px var(--xos-red)"
                : loading
                ? "0 0 4px var(--xos-gold)"
                : "0 0 4px var(--xos-green)",
              animation: loading ? "xos-pulse 1s infinite" : undefined,
            }}
          />
          <span
            style={{ fontSize: "0.65rem", color: "var(--xos-text-subtle)" }}
          >
            {loading
              ? "Fetching…"
              : lastUpdated
              ? lastUpdated.toLocaleTimeString()
              : "—"}
          </span>
        </div>
      </div>

      {/* ── Column headers ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          borderBottom: "1px solid var(--xos-border-1)",
          background: "var(--xos-surface-1)",
        }}
      >
        <div style={{ ...headerCell, color: "var(--xos-text-muted)" }}>
          Price ({base})
        </div>
        <div style={{ ...headerCell, textAlign: "right" }}>Amount</div>
        <div style={{ ...headerCell, textAlign: "right" }}>Total</div>
      </div>

      {/* ── Asks (sell side) — displayed top to bottom, lowest ask first ── */}
      <div style={{ overflowY: "auto", maxHeight: 240 }}>
        {loading && asks.length === 0
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                style={{
                  ...rowStyle,
                  padding: "0.25rem 0.5rem",
                  opacity: 0.4 - i * 0.04,
                }}
              >
                <div
                  style={{
                    height: 12,
                    borderRadius: 3,
                    background: "var(--xos-surface-2)",
                    margin: "4px 0",
                    animation: "xos-pulse 1.5s infinite",
                  }}
                />
              </div>
            ))
          : data?.error && asks.length === 0
          ? (
              <div
                style={{
                  padding: "1rem",
                  textAlign: "center",
                  color: "var(--xos-red)",
                  fontSize: "0.72rem",
                }}
              >
                {data.error}
              </div>
            )
          : [...asks].reverse().map((ask, i) => (
              <div key={i} style={rowStyle}>
                <DepthBar pct={(ask.total / maxAskTotal) * 100} side="ask" />
                <div style={{ ...cell, color: "var(--xos-red)" }}>
                  {fmtPrice(ask.price)}
                </div>
                <div style={{ ...cell, textAlign: "right", color: "var(--xos-text-muted)" }}>
                  {fmtAmount(ask.amount)}
                </div>
                <div style={{ ...cell, textAlign: "right", color: "var(--xos-text-subtle)" }}>
                  {fmtAmount(ask.total)}
                </div>
              </div>
            ))}
      </div>

      {/* ── Mid-price / spread ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.45rem 0.75rem",
          background: "var(--xos-surface-2)",
          borderTop: "1px solid var(--xos-border-1)",
          borderBottom: "1px solid var(--xos-border-1)",
        }}
      >
        <div>
          <span
            style={{
              fontSize: "1rem",
              fontWeight: 800,
              color:
                (data?.midPrice ?? 0) > 0
                  ? "var(--xos-green)"
                  : "var(--xos-text-muted)",
              fontFamily: "monospace",
            }}
          >
            {data?.midPrice ? fmtPrice(data.midPrice) : "—"}
          </span>
          <span
            style={{
              fontSize: "0.65rem",
              color: "var(--xos-text-subtle)",
              marginLeft: 6,
            }}
          >
            mid
          </span>
        </div>
        <div style={{ fontSize: "0.68rem", color: "var(--xos-text-muted)" }}>
          Spread:{" "}
          <span style={{ color: "var(--xos-text)" }}>
            {data?.spreadPct ?? "0"}%
          </span>
        </div>
      </div>

      {/* ── Bids (buy side) ── */}
      <div style={{ overflowY: "auto", maxHeight: 240 }}>
        {bids.map((bid, i) => (
          <div key={i} style={rowStyle}>
            <DepthBar pct={(bid.total / maxBidTotal) * 100} side="bid" />
            <div style={{ ...cell, color: "var(--xos-green)" }}>
              {fmtPrice(bid.price)}
            </div>
            <div style={{ ...cell, textAlign: "right", color: "var(--xos-text-muted)" }}>
              {fmtAmount(bid.amount)}
            </div>
            <div style={{ ...cell, textAlign: "right", color: "var(--xos-text-subtle)" }}>
              {fmtAmount(bid.total)}
            </div>
          </div>
        ))}
        {!loading && bids.length === 0 && !data?.error && (
          <div
            style={{
              padding: "1.5rem",
              textAlign: "center",
              color: "var(--xos-text-subtle)",
              fontSize: "0.72rem",
            }}
          >
            No bids found for this pair.
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div
        style={{
          padding: "0.35rem 0.75rem",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.62rem",
          color: "var(--xos-text-subtle)",
          borderTop: "1px solid var(--xos-border-1)",
          background: "var(--xos-surface-2)",
        }}
      >
        <span>XRPL mainnet · book_offers</span>
        <span>Refreshes every 15 s</span>
      </div>
    </div>
  );
}
