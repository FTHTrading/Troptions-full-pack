import { SwapPanel } from "@/components/exchange-os/SwapPanel";
import { LiveOrderBook } from "@/components/exchange-os/LiveOrderBook";
import Link from "next/link";

export const metadata = { title: "Trade — TROPTIONS Exchange OS" };

const XRPL_PAIRS = [
  { base: "XRP",  quote: "TROPTIONS", label: "XRP/TROPTIONS", primary: true },
  { base: "XRP",  quote: "USD",       label: "XRP/USD" },
  { base: "XRP",  quote: "BTC",       label: "XRP/BTC" },
  { base: "XRP",  quote: "ETH",       label: "XRP/ETH" },
  { base: "XRP",  quote: "EUR",       label: "XRP/EUR" },
  { base: "XRP",  quote: "USDC",      label: "XRP/USDC" },
  { base: "XRP",  quote: "USDT",      label: "XRP/USDT" },
  { base: "XRP",  quote: "SOLO",      label: "XRP/SOLO" },
  { base: "XRP",  quote: "CSC",       label: "XRP/CSC" },
] as const;

export default function TradePage() {
  return (
    <div style={{ padding: "1.25rem", maxWidth: 1400, margin: "0 auto" }}>

      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", fontSize: "0.78rem", color: "var(--xos-text-subtle)" }}>
        <Link href="/exchange-os" style={{ color: "var(--xos-gold-muted)", textDecoration: "none" }}>Exchange OS</Link>
        <span>/</span>
        <span style={{ color: "var(--xos-text)" }}>Trade</span>
      </div>

      {/* Header — compact */}
      <div style={{ marginBottom: "1.25rem" }}>
        <div className="xos-gold-line" style={{ marginBottom: "0.5rem" }} />
        <h1 className="xos-section-title" style={{ fontSize: "1.4rem", marginBottom: "0.25rem" }}>Trade on XRPL</h1>
        <p className="xos-section-subtitle" style={{ fontSize: "0.8rem", margin: 0 }}>
          Live mainnet order book · Pathfinder quotes · Unsigned transactions only — your wallet signs &amp; submits.
        </p>
      </div>

      {/* Pair tabs */}
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
        {XRPL_PAIRS.map((p) => (
          <Link
            key={p.label}
            href={`/exchange-os/trade?from=${p.base}&to=${p.quote}`}
            style={{
              padding: "0.28rem 0.7rem",
              borderRadius: "var(--xos-radius)",
              border: (p as { primary?: boolean }).primary ? "1px solid rgba(201,162,74,0.5)" : "1px solid var(--xos-border)",
              background: (p as { primary?: boolean }).primary ? "rgba(201,162,74,0.08)" : "var(--xos-surface-1)",
              color: (p as { primary?: boolean }).primary ? "var(--xos-gold)" : "var(--xos-text-muted)",
              textDecoration: "none",
              fontSize: "0.73rem",
              fontWeight: (p as { primary?: boolean }).primary ? 700 : 500,
              whiteSpace: "nowrap",
            }}
          >
            {p.label}
          </Link>
        ))}
      </div>

      {/* Main 2-col: Swap | Order Book */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 420px) 1fr",
          gap: "1.25rem",
          alignItems: "start",
        }}
      >
        {/* Left: Swap panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <SwapPanel defaultFrom="XRP" defaultTo="TROPTIONS" />

          {/* Compact info strip */}
          <div className="xos-card" style={{ padding: "0.875rem 1rem" }}>
            <h3 style={{ fontWeight: 700, color: "var(--xos-text)", marginBottom: "0.6rem", fontSize: "0.82rem" }}>
              How XRPL Swaps Work
            </h3>
            <ol style={{ color: "var(--xos-text-subtle)", fontSize: "0.76rem", lineHeight: 1.8, paddingLeft: "1.1rem", margin: 0 }}>
              <li>Pathfinder gets a live quote from XRPL mainnet</li>
              <li>Enter your r-address to prepare an unsigned tx</li>
              <li>Sign with Xumm, XRPL Toolkit, or Crossmark</li>
              <li>Submit directly to the XRPL network</li>
            </ol>
            <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem" }}>
              <Link href="/exchange-os/wallet" className="xos-btn xos-btn--outline xos-btn--sm">
                Check Trustlines →
              </Link>
              <Link href="/exchange-os/amm" className="xos-btn xos-btn--outline xos-btn--sm">
                AMM Pools →
              </Link>
            </div>
          </div>

          <div className="xos-risk-box" style={{ fontSize: "0.72rem" }}>
            Trading XRPL assets carries significant financial risk. Nothing here is financial advice.
            This tool prepares unsigned transactions only — your wallet app must sign and submit.
          </div>
        </div>

        {/* Right: Live order book */}
        <LiveOrderBook
          base="XRP"
          quote="TROPTIONS"
          depth={16}
        />
      </div>
    </div>
  );
}
