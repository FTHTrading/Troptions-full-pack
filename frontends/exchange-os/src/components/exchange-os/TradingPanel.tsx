"use client";
// TROPTIONS Exchange OS — Trading Panel (full DEX swap UI with order book)

import { SwapPanel } from "./SwapPanel";
import { OrderBookPanel } from "./OrderBookPanel";

interface Props {
  defaultBase?: string;
  defaultQuote?: string;
}

export function TradingPanel({ defaultBase = "TROPTIONS", defaultQuote = "XRP" }: Props) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.5rem", alignItems: "flex-start" }}>
      <SwapPanel />
      <OrderBookPanel baseTicker={defaultBase} quoteTicker={defaultQuote} />
    </div>
  );
}
