"use client";
// TROPTIONS Exchange OS — AMM Pool Card

import type { XrplAmmPool } from "@/lib/exchange-os/xrpl/types";

type DemoPool = {
  id: string;
  asset1: { currency: string; issuer: string | null };
  asset2: { currency: string; issuer: string };
  asset1Balance: string;
  asset2Balance: string;
  tradingFee: string;
  lpTokenBalance: string;
  priceImpact: string;
  demoOnly?: boolean;
};

interface Props {
  pool: XrplAmmPool | DemoPool;
}

function getA1Balance(pool: XrplAmmPool | DemoPool): string {
  if ("asset1Balance" in pool) return pool.asset1Balance;
  return typeof pool.asset1 === "object" && "value" in pool.asset1
    ? (pool.asset1 as { value: string }).value
    : "—";
}

function getA2Balance(pool: XrplAmmPool | DemoPool): string {
  if ("asset2Balance" in pool) return pool.asset2Balance;
  return typeof pool.asset2 === "object" && "value" in pool.asset2
    ? (pool.asset2 as { value: string }).value
    : "—";
}

function getTradingFee(pool: XrplAmmPool | DemoPool): string {
  if ("tradingFee" in pool && typeof pool.tradingFee === "string") return pool.tradingFee;
  if ("tradingFee" in pool && typeof pool.tradingFee === "number")
    return `${(pool.tradingFee / 10).toFixed(2)}%`;
  return "—";
}

function getLpBalance(pool: XrplAmmPool | DemoPool): string {
  if ("lpTokenBalance" in pool) {
    if (typeof pool.lpTokenBalance === "string") return pool.lpTokenBalance;
    if (typeof pool.lpTokenBalance === "object" && pool.lpTokenBalance !== null)
      return (pool.lpTokenBalance as { value: string }).value ?? "—";
  }
  return "—";
}

export function AmmPoolCard({ pool }: Props) {
  const a1 = pool.asset1.currency === "XRP" ? "XRP" : pool.asset1.currency;
  const a2 = pool.asset2.currency;

  return (
    <div className="xos-card xos-card--cyan" style={{ padding: "1.25rem" }}>
      <div style={{ fontWeight: 700, color: "var(--xos-text)", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ color: "var(--xos-cyan)" }}>◈</span>
        {a1} / {a2} AMM Pool
        {"demoOnly" in pool && pool.demoOnly && (
          <span className="xos-badge xos-badge--slate" style={{ marginLeft: "auto" }}>Demo</span>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <div>
          <div style={{ fontSize: "0.7rem", color: "var(--xos-text-subtle)", marginBottom: 2 }}>{a1} Balance</div>
          <div style={{ fontFamily: "var(--xos-font-mono)", color: "var(--xos-text)", fontWeight: 600 }}>
            {getA1Balance(pool)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: "0.7rem", color: "var(--xos-text-subtle)", marginBottom: 2 }}>{a2} Balance</div>
          <div style={{ fontFamily: "var(--xos-font-mono)", color: "var(--xos-text)", fontWeight: 600 }}>
            {getA2Balance(pool)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: "0.7rem", color: "var(--xos-text-subtle)", marginBottom: 2 }}>Trading Fee</div>
          <div style={{ fontFamily: "var(--xos-font-mono)", color: "var(--xos-gold)" }}>
            {getTradingFee(pool)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: "0.7rem", color: "var(--xos-text-subtle)", marginBottom: 2 }}>LP Token Supply</div>
          <div style={{ fontFamily: "var(--xos-font-mono)", color: "var(--xos-text-muted)" }}>
            {getLpBalance(pool)}
          </div>
        </div>
      </div>

      <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid var(--xos-border)", fontSize: "0.75rem", color: "var(--xos-text-subtle)" }}>
        Price impact estimates are indicative only. Actual slippage depends on pool depth at execution time.
      </div>
    </div>
  );
}
