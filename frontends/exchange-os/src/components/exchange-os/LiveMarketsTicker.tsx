"use client";
// TROPTIONS Exchange OS — Live Markets Ticker Bar
// Scrolling horizontal strip of real XRPL token prices (xrplmeta.org)

import { useEffect, useState } from "react";

interface TickerItem {
  pair: string;
  price: string;
  change: number;
}

// Static XRP pair always shown first
const STATIC_ITEMS: TickerItem[] = [
  { pair: "XRP/USD", price: "…", change: 0 },
];

function fmtPrice(n: number): string {
  if (n >= 1) return `$${n.toFixed(4)}`;
  if (n < 0.000001) return `$${n.toExponential(2)}`;
  return `$${n.toFixed(6)}`;
}

function buildScrollItems(live: TickerItem[]): TickerItem[] {
  const all = [...STATIC_ITEMS, ...live];
  // Duplicate so the scroll loop feels infinite
  return [...all, ...all];
}

export function LiveMarketsTicker() {
  const [items, setItems] = useState<TickerItem[]>(buildScrollItems([]));

  useEffect(() => {
    let cancelled = false;

    async function loadTicker() {
      try {
        const res = await fetch(
          "/exchange-os/api/xrpl/markets?sort=volume_24h&limit=10",
          { cache: "no-store" }
        );
        if (!res.ok || cancelled) return;
        const data = await res.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tokens: any[] = data.tokens ?? [];
        const live: TickerItem[] = tokens.slice(0, 8).map((t) => ({
          pair: `${t.currency}/XRP`,
          price: fmtPrice(t.price),
          change: t.change24h ?? 0,
        }));
        if (!cancelled) setItems(buildScrollItems(live));
      } catch {
        // Keep showing placeholder items on error
      }
    }

    loadTicker();
    const id = setInterval(loadTicker, 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="xos-ticker-bar" aria-label="Live XRPL market prices">
      <div className="xos-ticker-label">LIVE</div>
      <div className="xos-ticker-track">
        <div className="xos-ticker-scroll">
          {items.map((item, i) => (
            <TickerPill key={i} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TickerPill({ item }: { item: TickerItem }) {
  const up = item.change >= 0;
  return (
    <span className="xos-ticker-pill">
      <span className="xos-ticker-pair">{item.pair}</span>
      <span className="xos-ticker-price">{item.price}</span>
      <span
        className={`xos-ticker-change ${
          up ? "xos-ticker-up" : "xos-ticker-dn"
        }`}
      >
        {up ? "▲" : "▼"} {Math.abs(item.change).toFixed(2)}%
      </span>
      <span className="xos-ticker-sep">·</span>
    </span>
  );
}
