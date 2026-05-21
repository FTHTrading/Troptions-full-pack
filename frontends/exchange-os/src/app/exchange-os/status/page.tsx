import Link from "next/link";
import {
  EXCHANGE_STATUS,
  EXCHANGE_MAINNET_BLOCKERS,
  STATUS_BADGE,
  type ExchangeStatusItem,
} from "@/data/exchange-status";

export const metadata = {
  title: "Exchange OS Status Matrix — TROPTIONS",
  description:
    "Live/testnet/demo status for every TROPTIONS Exchange OS component. Env vars needed, mainnet blockers, and next actions.",
};

const CATEGORIES: Array<{ id: ExchangeStatusItem["category"]; label: string }> = [
  { id: "xrpl",           label: "XRPL" },
  { id: "solana",         label: "Solana" },
  { id: "x402",           label: "x402 Intelligence" },
  { id: "proof",          label: "Proof Packets" },
  { id: "wallet",         label: "Wallets" },
  { id: "admin",          label: "Admin / Registry" },
  { id: "infrastructure", label: "Infrastructure" },
];

const BLOCKER_TYPE_COLOR: Record<string, string> = {
  env:     "var(--xos-gold)",
  capital: "var(--xos-cyan)",
  infra:   "#a78bfa",
};

export default function ExchangeOSStatusPage() {
  const itemsByCategory = (cat: ExchangeStatusItem["category"]) =>
    EXCHANGE_STATUS.filter((i) => i.category === cat);

  const counts = {
    live:    EXCHANGE_STATUS.filter((i) => i.status === "live").length,
    testnet: EXCHANGE_STATUS.filter((i) => i.status === "testnet").length,
    devnet:  EXCHANGE_STATUS.filter((i) => i.status === "devnet").length,
    demo:    EXCHANGE_STATUS.filter((i) => i.status === "demo").length,
    planned: EXCHANGE_STATUS.filter((i) => i.status === "planned").length,
    missing: EXCHANGE_STATUS.filter((i) => ["broken","missing"].includes(i.status)).length,
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: "1.5rem", display: "flex", gap: "1rem" }}>
        <Link href="/exchange-os" style={{ fontSize: "0.78rem", color: "var(--xos-gold)", textDecoration: "none" }}>
          ← Exchange OS
        </Link>
        <span style={{ color: "var(--xos-text-subtle)", fontSize: "0.78rem" }}>/</span>
        <span style={{ fontSize: "0.78rem", color: "var(--xos-text-muted)" }}>Status Matrix</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div className="xos-gold-line" style={{ marginBottom: "0.75rem" }} />
        <h1 style={{ fontWeight: 900, fontSize: "1.9rem", color: "var(--xos-text)", margin: 0 }}>
          Exchange OS — Integration Status
        </h1>
        <p style={{ color: "var(--xos-text-muted)", fontSize: "0.85rem", marginTop: "0.4rem", maxWidth: 620 }}>
          Every component tracked by live/testnet/demo/planned status. Env var key names only — verify values independently.
        </p>
      </div>

      {/* Summary row */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          flexWrap: "wrap",
          marginBottom: "2.5rem",
        }}
      >
        {Object.entries(counts).map(([key, n]) => {
          const s = STATUS_BADGE[key as keyof typeof STATUS_BADGE] ?? { label: key, color: "#fff", bg: "rgba(255,255,255,0.05)" };
          return (
            <div
              key={key}
              style={{
                background: s.bg,
                border: `1px solid ${s.color}33`,
                borderRadius: "var(--xos-radius)",
                padding: "0.5rem 1rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: 72,
              }}
            >
              <span style={{ fontWeight: 800, fontSize: "1.3rem", color: s.color }}>{n}</span>
              <span style={{ fontSize: "0.68rem", color: s.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</span>
            </div>
          );
        })}
      </div>

      {/* Category tables */}
      {CATEGORIES.map(({ id, label }) => {
        const items = itemsByCategory(id);
        if (!items.length) return null;
        return (
          <div key={id} style={{ marginBottom: "2.5rem" }}>
            <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--xos-gold)", marginBottom: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {label}
            </div>
            <div className="xos-card" style={{ padding: 0, overflow: "hidden" }}>
              {items.map((item, idx) => {
                const badge = STATUS_BADGE[item.status];
                return (
                  <div
                    key={item.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: "1rem",
                      padding: "0.8rem 1.1rem",
                      borderBottom: idx < items.length - 1 ? "1px solid var(--xos-border)" : "none",
                      alignItems: "start",
                    }}
                  >
                    {/* Left */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontWeight: 600, fontSize: "0.84rem", color: "var(--xos-text)" }}>
                          {item.name}
                        </span>
                        {item.network && (
                          <span style={{ fontSize: "0.68rem", color: "var(--xos-text-subtle)", background: "var(--xos-surface)", border: "1px solid var(--xos-border)", borderRadius: 4, padding: "0 5px" }}>
                            {item.network}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--xos-text-muted)" }}>
                        {item.nextAction}
                      </div>
                      {item.envVarsNeeded && (
                        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginTop: "0.15rem" }}>
                          {item.envVarsNeeded.map((env) => (
                            <code
                              key={env}
                              style={{ fontSize: "0.68rem", color: "var(--xos-cyan)", background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: 3, padding: "0 5px" }}
                            >
                              {env}
                            </code>
                          ))}
                        </div>
                      )}
                      {item.proofNeeded && (
                        <div style={{ fontSize: "0.68rem", color: "var(--xos-green)", marginTop: "0.1rem" }}>
                          On-chain:{" "}
                          <a
                            href={`https://solscan.io/token/${item.proofNeeded}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "var(--xos-green)" }}
                          >
                            {item.proofNeeded.slice(0, 20)}…
                          </a>
                        </div>
                      )}
                      {item.route && (
                        <Link
                          href={item.route}
                          style={{ fontSize: "0.68rem", color: "var(--xos-text-subtle)", marginTop: "0.1rem" }}
                        >
                          {item.route}
                        </Link>
                      )}
                    </div>

                    {/* Right: status badge */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.3rem" }}>
                      <span
                        style={{
                          background: badge.bg,
                          color: badge.color,
                          border: `1px solid ${badge.color}44`,
                          borderRadius: 5,
                          padding: "0.2rem 0.6rem",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {badge.label}
                      </span>
                      {item.blockedBy && (
                        <span style={{ fontSize: "0.64rem", color: "var(--xos-gold)", fontStyle: "italic" }}>
                          blocked: {item.blockedBy}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* P0 Mainnet Blockers */}
      <div
        style={{
          background: "var(--xos-surface)",
          border: "1px solid var(--xos-border)",
          borderRadius: "var(--xos-radius-xl)",
          padding: "1.75rem 2rem",
          marginBottom: "2rem",
        }}
      >
        <div className="xos-gold-line" style={{ marginBottom: "0.75rem" }} />
        <h2 style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--xos-text)", marginBottom: "1rem" }}>
          P0 Mainnet Blockers
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {EXCHANGE_MAINNET_BLOCKERS.map((b) => (
            <div
              key={b.item}
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                gap: "1rem",
                alignItems: "start",
                padding: "0.65rem 1rem",
                background: "var(--xos-bg)",
                borderRadius: "var(--xos-radius)",
                border: "1px solid var(--xos-border)",
              }}
            >
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  color: BLOCKER_TYPE_COLOR[b.type] ?? "var(--xos-text)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${BLOCKER_TYPE_COLOR[b.type] ?? "#fff"}33`,
                  borderRadius: 4,
                  padding: "0.2rem 0.5rem",
                  whiteSpace: "nowrap",
                  alignSelf: "center",
                }}
              >
                {b.type}
              </span>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.83rem", color: "var(--xos-text)" }}>{b.item}</div>
                <div style={{ fontSize: "0.76rem", color: "var(--xos-text-muted)", marginTop: "0.1rem" }}>{b.action}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p style={{ fontSize: "0.73rem", color: "var(--xos-text-subtle)", textAlign: "center" }}>
        No secrets shown — verify env vars independently via Cloudflare dashboard / Vercel settings.
        Public blockchain addresses verifiable on Solscan / XRPL explorer.
      </p>

      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "1.5rem", flexWrap: "wrap" }}>
        <Link href="/exchange-os" className="xos-btn xos-btn--outline xos-btn--sm">← Exchange OS</Link>
        <Link href="/exchange-os/compare" className="xos-btn xos-btn--outline xos-btn--sm">Compare →</Link>
        <Link href="/exchange-os/readiness" className="xos-btn xos-btn--outline xos-btn--sm">Readiness Check →</Link>
      </div>
    </div>
  );
}
