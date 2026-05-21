import Link from "next/link";
import {
  EXCHANGE_STATUS,
  EXCHANGE_MAINNET_BLOCKERS,
  STATUS_BADGE,
  type ExchangeItemStatus,
} from "@/data/exchange-status";

export const metadata = { title: "Admin — Exchange OS Dashboard" };

const BLOCKER_TYPE_COLOR: Record<string, string> = {
  env:     "#eab308",
  capital: "#06b6d4",
  infra:   "#a78bfa",
};

function countBy(status: ExchangeItemStatus) {
  return EXCHANGE_STATUS.filter((i) => i.status === status).length;
}

export default function AdminExchangePage() {
  const total = EXCHANGE_STATUS.length;
  const statusKeys: ExchangeItemStatus[] = ["live", "testnet", "devnet", "demo", "planned", "missing", "broken"];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2.5rem 1.5rem 5rem", fontFamily: "var(--font-mono, monospace)" }}>
      {/* Demo warning banner */}
      <div
        style={{
          background: "rgba(234,179,8,0.1)",
          border: "1px solid rgba(234,179,8,0.35)",
          borderRadius: 8,
          padding: "0.7rem 1.1rem",
          marginBottom: "1.75rem",
          fontSize: "0.78rem",
          color: "#eab308",
          fontWeight: 600,
        }}
      >
        ⚠ Add authentication before making this page accessible to non-admins. Currently unprotected.
      </div>

      {/* Header */}
      <div style={{ marginBottom: "1.75rem" }}>
        <h1 style={{ fontWeight: 900, fontSize: "1.6rem", color: "#f1f5f9", margin: 0 }}>
          Exchange OS — Admin Dashboard
        </h1>
        <p style={{ color: "#64748b", fontSize: "0.82rem", marginTop: "0.35rem" }}>
          Integration status for all {total} tracked components.
        </p>
      </div>

      {/* Quick nav */}
      <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        {[
          { label: "Exchange OS", href: "/exchange-os" },
          { label: "Readiness", href: "/exchange-os/readiness" },
          { label: "Solana DEX Map", href: "/exchange-os/solana-dex-map" },
          { label: "Status Matrix", href: "/exchange-os/status" },
          { label: "Compare", href: "/exchange-os/compare" },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            style={{
              fontSize: "0.75rem",
              color: "#c99a3c",
              background: "rgba(201,154,60,0.08)",
              border: "1px solid rgba(201,154,60,0.2)",
              borderRadius: 5,
              padding: "0.3rem 0.75rem",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            {l.label} →
          </Link>
        ))}
      </div>

      {/* Counts by status */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
          gap: "0.6rem",
          marginBottom: "2rem",
        }}
      >
        {statusKeys.map((s) => {
          const n = countBy(s);
          const badge = STATUS_BADGE[s];
          return (
            <div
              key={s}
              style={{
                background: badge.bg,
                border: `1px solid ${badge.color}33`,
                borderRadius: 8,
                padding: "0.65rem 1rem",
                textAlign: "center",
              }}
            >
              <div style={{ fontWeight: 800, fontSize: "1.5rem", color: badge.color }}>{n}</div>
              <div style={{ fontSize: "0.65rem", color: badge.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {badge.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Full item list */}
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 10,
          padding: 0,
          overflow: "hidden",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 90px 80px",
            padding: "0.6rem 1rem",
            background: "rgba(255,255,255,0.04)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span style={{ fontSize: "0.68rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>Component</span>
          <span style={{ fontSize: "0.68rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>Category</span>
          <span style={{ fontSize: "0.68rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "right" }}>Status</span>
        </div>
        {EXCHANGE_STATUS.map((item, idx) => {
          const badge = STATUS_BADGE[item.status];
          return (
            <div
              key={item.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 90px 80px",
                padding: "0.6rem 1rem",
                borderBottom: idx < EXCHANGE_STATUS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: "0.82rem", color: "#e2e8f0", fontWeight: 500 }}>{item.name}</div>
                {item.nextAction && (
                  <div style={{ fontSize: "0.7rem", color: "#475569", marginTop: "0.1rem" }}>{item.nextAction}</div>
                )}
              </div>
              <div style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase" }}>{item.category}</div>
              <div style={{ textAlign: "right" }}>
                <span
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    color: badge.color,
                    background: badge.bg,
                    border: `1px solid ${badge.color}33`,
                    borderRadius: 4,
                    padding: "0.15rem 0.5rem",
                  }}
                >
                  {badge.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* P0 Blockers */}
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 10,
          padding: "1.5rem",
        }}
      >
        <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "#f1f5f9", marginBottom: "1rem" }}>
          P0 Mainnet Blockers
        </div>
        {EXCHANGE_MAINNET_BLOCKERS.map((b) => (
          <div
            key={b.item}
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "flex-start",
              padding: "0.55rem 0",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <span
              style={{
                fontSize: "0.62rem",
                fontWeight: 800,
                color: BLOCKER_TYPE_COLOR[b.type] ?? "#fff",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${BLOCKER_TYPE_COLOR[b.type] ?? "#fff"}33`,
                borderRadius: 4,
                padding: "0.2rem 0.4rem",
                whiteSpace: "nowrap",
                alignSelf: "center",
                minWidth: 50,
                textAlign: "center",
              }}
            >
              {b.type}
            </span>
            <div>
              <div style={{ fontSize: "0.82rem", color: "#e2e8f0", fontWeight: 600 }}>{b.item}</div>
              <div style={{ fontSize: "0.74rem", color: "#64748b", marginTop: "0.1rem" }}>{b.action}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
