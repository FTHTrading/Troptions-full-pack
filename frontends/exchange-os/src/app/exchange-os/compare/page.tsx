import Link from "next/link";

export const metadata = {
  title: "Exchange OS vs DEX vs Launchpad — TROPTIONS",
  description:
    "How TROPTIONS Exchange OS compares to a generic DEX or launchpad: trade + launch + prove + operate + protect.",
};

interface CompareRow {
  feature: string;
  genericDex: boolean | string;
  launchpad: boolean | string;
  troptionsXos: boolean | string;
  highlight?: boolean;
}

const ROWS: CompareRow[] = [
  { feature: "Token swap / order book",           genericDex: true,  launchpad: false, troptionsXos: true  },
  { feature: "Token launch wizard",               genericDex: false, launchpad: true,  troptionsXos: true  },
  { feature: "On-chain issuer proof",             genericDex: false, launchpad: false, troptionsXos: true,  highlight: true },
  { feature: "Event & merchant asset rails",      genericDex: false, launchpad: false, troptionsXos: true,  highlight: true },
  { feature: "x402 paid intelligence (AI)",       genericDex: false, launchpad: false, troptionsXos: true,  highlight: true },
  { feature: "Fan memories & certificates",       genericDex: false, launchpad: false, troptionsXos: true,  highlight: true },
  { feature: "Multi-chain (XRPL + Solana)",       genericDex: false, launchpad: false, troptionsXos: true,  highlight: true },
  { feature: "Proof packets",                     genericDex: false, launchpad: false, troptionsXos: true,  highlight: true },
  { feature: "AI launch readiness checklist",     genericDex: false, launchpad: false, troptionsXos: true,  highlight: true },
  { feature: "Apostle Chain settlement",          genericDex: false, launchpad: false, troptionsXos: true,  highlight: true },
  { feature: "AMM / liquidity pools",             genericDex: true,  launchpad: false, troptionsXos: true  },
  { feature: "KYC/AML launch gates",              genericDex: false, launchpad: "some",troptionsXos: true  },
  { feature: "Unsigned-first wallet safety",      genericDex: false, launchpad: false, troptionsXos: true,  highlight: true },
  { feature: "Compliance readiness checklist",    genericDex: false, launchpad: false, troptionsXos: true,  highlight: true },
  { feature: "Sponsor / merchant asset drops",    genericDex: false, launchpad: false, troptionsXos: true,  highlight: true },
];

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <span style={{ color: "var(--xos-green)", fontWeight: 700, fontSize: "1.1rem" }}>✓</span>;
  if (value === false) return <span style={{ color: "var(--xos-text-subtle)", fontSize: "0.9rem" }}>—</span>;
  return <span style={{ color: "var(--xos-gold)", fontSize: "0.78rem", fontWeight: 600 }}>{value}</span>;
}

export default function ExchangeOSComparePage() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: "1.5rem", display: "flex", gap: "1rem" }}>
        <Link href="/exchange-os" style={{ fontSize: "0.78rem", color: "var(--xos-gold)", textDecoration: "none" }}>
          ← Exchange OS
        </Link>
        <span style={{ color: "var(--xos-text-subtle)", fontSize: "0.78rem" }}>/</span>
        <span style={{ fontSize: "0.78rem", color: "var(--xos-text-muted)" }}>Compare</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div className="xos-gold-line" style={{ marginBottom: "0.75rem" }} />
        <h1 style={{ fontWeight: 900, fontSize: "1.9rem", color: "var(--xos-text)", margin: 0 }}>
          TROPTIONS Exchange OS vs The Field
        </h1>
        <p style={{ color: "var(--xos-text-muted)", fontSize: "0.85rem", marginTop: "0.5rem", maxWidth: 620, lineHeight: 1.65 }}>
          A generic DEX swaps tokens. A launchpad helps you create them. TROPTIONS Exchange OS does both — plus proves, operates, and protects on XRPL and Solana.
        </p>
      </div>

      {/* Table */}
      <div className="xos-card" style={{ padding: 0, overflow: "hidden", marginBottom: "2.5rem" }}>
        {/* Header row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr repeat(3, 130px)",
            background: "var(--xos-surface)",
            borderBottom: "1px solid var(--xos-border)",
            padding: "0.7rem 1.1rem",
            gap: "0.5rem",
          }}
        >
          <div style={{ fontSize: "0.72rem", color: "var(--xos-text-subtle)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Feature</div>
          <div style={{ fontSize: "0.72rem", color: "var(--xos-text-subtle)", textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "center" }}>Generic DEX</div>
          <div style={{ fontSize: "0.72rem", color: "var(--xos-text-subtle)", textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "center" }}>Launchpad</div>
          <div
            style={{
              fontSize: "0.72rem",
              color: "var(--xos-gold)",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              textAlign: "center",
            }}
          >
            TROPTIONS XOS
          </div>
        </div>

        {ROWS.map((row, idx) => (
          <div
            key={row.feature}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr repeat(3, 130px)",
              padding: "0.7rem 1.1rem",
              borderBottom: idx < ROWS.length - 1 ? "1px solid var(--xos-border)" : "none",
              gap: "0.5rem",
              alignItems: "center",
              background: row.highlight ? "rgba(201,154,60,0.04)" : undefined,
            }}
          >
            <div
              style={{
                fontSize: "0.83rem",
                color: row.highlight ? "var(--xos-text)" : "var(--xos-text-muted)",
                fontWeight: row.highlight ? 600 : 400,
              }}
            >
              {row.feature}
              {row.highlight && (
                <span
                  style={{
                    marginLeft: "0.5rem",
                    fontSize: "0.62rem",
                    color: "var(--xos-gold)",
                    background: "rgba(201,154,60,0.1)",
                    border: "1px solid rgba(201,154,60,0.25)",
                    borderRadius: 4,
                    padding: "0 5px",
                    fontWeight: 700,
                    verticalAlign: "middle",
                  }}
                >
                  XOS-only
                </span>
              )}
            </div>
            <div style={{ textAlign: "center" }}><Cell value={row.genericDex} /></div>
            <div style={{ textAlign: "center" }}><Cell value={row.launchpad} /></div>
            <div style={{ textAlign: "center" }}><Cell value={row.troptionsXos} /></div>
          </div>
        ))}
      </div>

      {/* Tagline card */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--xos-surface) 60%, var(--xos-gold-glow))",
          border: "1px solid var(--xos-gold-muted)",
          borderRadius: "var(--xos-radius-xl)",
          padding: "2rem",
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        <div className="xos-gold-line" style={{ marginBottom: "1rem", marginLeft: "auto", marginRight: "auto", width: 60 }} />
        <p
          style={{
            fontWeight: 800,
            fontSize: "1.15rem",
            color: "var(--xos-text)",
            lineHeight: 1.55,
            margin: 0,
          }}
        >
          TROPTIONS Exchange OS: <span style={{ color: "var(--xos-gold)" }}>trade</span> +{" "}
          <span style={{ color: "var(--xos-cyan)" }}>launch</span> +{" "}
          <span style={{ color: "var(--xos-green)" }}>prove</span> +{" "}
          <span style={{ color: "#a78bfa" }}>operate</span> +{" "}
          <span style={{ color: "#f97316" }}>protect</span>.
        </p>
        <p style={{ color: "var(--xos-text-muted)", fontSize: "0.82rem", marginTop: "0.75rem", maxWidth: 500, margin: "0.75rem auto 0" }}>
          The only multi-chain (XRPL + Solana) exchange OS with on-chain proof packets, x402 intelligence rails, event-commerce integration, and institutional compliance gates.
        </p>
      </div>

      {/* Nav links */}
      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
        <Link href="/exchange-os/launch" className="xos-btn xos-btn--primary xos-btn--sm">Launch a Token →</Link>
        <Link href="/exchange-os/status" className="xos-btn xos-btn--outline xos-btn--sm">Status Matrix</Link>
        <Link href="/exchange-os/readiness" className="xos-btn xos-btn--outline xos-btn--sm">Readiness Check</Link>
        <Link href="/exchange-os/solana-dex-map" className="xos-btn xos-btn--outline xos-btn--sm">Solana DEX Map</Link>
      </div>
    </div>
  );
}
