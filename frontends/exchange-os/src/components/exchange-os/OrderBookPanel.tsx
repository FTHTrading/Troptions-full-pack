"use client";
// TROPTIONS Exchange OS — Order Book Panel

import { useState } from "react";
import { features } from "@/config/exchange-os/features";

interface OrderBookEntry {
  price: string;
  amount: string;
  total: string;
}

const DEMO_BIDS: OrderBookEntry[] = [
  { price: "399.50", amount: "0.25", total: "99.88" },
  { price: "398.00", amount: "0.50", total: "199.00" },
  { price: "395.00", amount: "1.20", total: "474.00" },
  { price: "390.00", amount: "2.00", total: "780.00" },
  { price: "385.00", amount: "3.50", total: "1347.50" },
];

const DEMO_ASKS: OrderBookEntry[] = [
  { price: "401.00", amount: "0.30", total: "120.30" },
  { price: "402.50", amount: "0.80", total: "322.00" },
  { price: "405.00", amount: "1.50", total: "607.50" },
  { price: "410.00", amount: "2.50", total: "1025.00" },
  { price: "415.00", amount: "4.00", total: "1660.00" },
];

interface Props {
  baseTicker?: string;
  quoteTicker?: string;
}

export function OrderBookPanel({ baseTicker = "TROPTIONS", quoteTicker = "XRP" }: Props) {
  const [loading] = useState(false);

  const midPrice = "400.00";

  return (
    <div className="xos-card" style={{ padding: "1.25rem" }}>
      <div style={{ fontWeight: 700, color: "var(--xos-text)", marginBottom: "1rem" }}>
        Order Book
        <span style={{ marginLeft: 8, fontSize: "0.78rem", color: "var(--xos-text-muted)" }}>
          {baseTicker} / {quoteTicker}
        </span>
      </div>

      {!features.liveTrading && (
        <div style={{ fontSize: "0.72rem", color: "var(--xos-amber)", marginBottom: "0.75rem" }}>
          ⚠ Demo order book — not live XRPL DEX data
        </div>
      )}

      {/* Asks (sell side) */}
      <div style={{ marginBottom: "0.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.25rem", fontSize: "0.68rem", color: "var(--xos-text-subtle)", marginBottom: "0.25rem" }}>
          <span>Price ({quoteTicker})</span>
          <span style={{ textAlign: "right" }}>Amount</span>
          <span style={{ textAlign: "right" }}>Total</span>
        </div>
        {[...DEMO_ASKS].reverse().map((ask, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.25rem", padding: "2px 0", fontSize: "0.78rem" }}>
            <span style={{ color: "var(--xos-red)", fontFamily: "var(--xos-font-mono)" }}>{ask.price}</span>
            <span style={{ textAlign: "right", color: "var(--xos-text-muted)", fontFamily: "var(--xos-font-mono)" }}>{ask.amount}</span>
            <span style={{ textAlign: "right", color: "var(--xos-text-subtle)", fontFamily: "var(--xos-font-mono)" }}>{ask.total}</span>
          </div>
        ))}
      </div>

      {/* Mid price */}
      <div style={{ textAlign: "center", padding: "0.5rem", fontWeight: 800, fontFamily: "var(--xos-font-mono)", color: "var(--xos-gold)", fontSize: "1rem", borderTop: "1px solid var(--xos-border)", borderBottom: "1px solid var(--xos-border)", margin: "0.5rem 0" }}>
        {loading ? "..." : midPrice} {quoteTicker}
      </div>

      {/* Bids (buy side) */}
      {DEMO_BIDS.map((bid, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.25rem", padding: "2px 0", fontSize: "0.78rem" }}>
          <span style={{ color: "var(--xos-green)", fontFamily: "var(--xos-font-mono)" }}>{bid.price}</span>
          <span style={{ textAlign: "right", color: "var(--xos-text-muted)", fontFamily: "var(--xos-font-mono)" }}>{bid.amount}</span>
          <span style={{ textAlign: "right", color: "var(--xos-text-subtle)", fontFamily: "var(--xos-font-mono)" }}>{bid.total}</span>
        </div>
      ))}
    </div>
  );
}
