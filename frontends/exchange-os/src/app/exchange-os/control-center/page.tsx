import Link from "next/link";

const TRUTH_STATEMENT =
  "TROPTIONS provides Exchange OS infrastructure only. It does not operate an exchange, custody assets, make markets, promote tokens, underwrite offerings, provide investment advice, or guarantee volume, liquidity, listings, returns, or price performance.";

const SECTIONS = [
  {
    category: "Compliance & Proof",
    color: "var(--xos-gold)",
    items: [
      {
        title: "Token Proof Packet",
        desc: "Full institutional due-diligence framework — legal, KYC/AML, wallet authority, audit, liquidity, committee.",
        href: "/exchange-os/token-proof-packet",
        badge: "Due Diligence",
      },
      {
        title: "Launch Committee",
        desc: "Required reviewers, documents, blockers, GO/NO-GO controls, and escalation triggers.",
        href: "/exchange-os/control-center#launch-committee",
        badge: "Gate",
      },
      {
        title: "Partner Onboarding",
        desc: "12-stage pipeline from initial inquiry through ongoing monitoring.",
        href: "/exchange-os/partner-onboarding",
        badge: "12 Stages",
      },
      {
        title: "Operating Model",
        desc: "Core operating principles, risk levels, public claim rules, and volume readiness requirements.",
        href: "/exchange-os/readiness",
        badge: "Policy",
      },
    ],
  },
  {
    category: "Chain Intelligence",
    color: "var(--xos-cyan)",
    items: [
      {
        title: "XRPL DEX Intelligence",
        desc: "Native DEX, AMM, trustline model, order book, issuer proof requirements, AMM pool proof, compliance notes.",
        href: "/exchange-os/xrpl-dex-intelligence",
        badge: "XRPL",
      },
      {
        title: "Solana DEX Map",
        desc: "Core DEX registry, launchpad competitor watchlist, and open-source integration stack.",
        href: "/exchange-os/solana-dex-map",
        badge: "Solana",
      },
      {
        title: "Non-Custodial Route Architecture",
        desc: "Full 12-step non-custodial trade route: wallet connect through proof event and monitoring.",
        href: "/exchange-os/control-center#non-custodial-route",
        badge: "Architecture",
      },
    ],
  },
  {
    category: "Operations & Monitoring",
    color: "#ef4444",
    items: [
      {
        title: "Market Monitoring",
        desc: "LP removal, mint authority, whale transfer, wash-like pattern, oracle deviation, and incident response runbook.",
        href: "/exchange-os/market-monitoring",
        badge: "Live Alerts",
      },
      {
        title: "Readiness Check",
        desc: "Institutional readiness score, infrastructure gaps, and mainnet checklist.",
        href: "/exchange-os/readiness",
        badge: "Readiness",
      },
      {
        title: "Integration Status",
        desc: "Current integration status across XRPL, Solana, x402, and Apostle Chain.",
        href: "/exchange-os/status",
        badge: "Status",
      },
    ],
  },
  {
    category: "API Intelligence Layer",
    color: "#a78bfa",
    items: [
      {
        title: "Operating Model API",
        desc: "Static config: principles, risk levels, public claim rules, volume readiness.",
        href: "/api/exchange-os/operating-model",
        badge: "GET",
      },
      {
        title: "Proof Packet Schema API",
        desc: "Static config: general, Solana, and XRPL proof packet field schemas.",
        href: "/api/exchange-os/token-proof-packet",
        badge: "GET",
      },
      {
        title: "Solana Venues API",
        desc: "Static config: core DEX registry, competitor watchlist, open-source stack.",
        href: "/api/exchange-os/solana-venues",
        badge: "GET",
      },
      {
        title: "XRPL DEX API",
        desc: "Static config: venue registry, issuer proof, AMM proof, compliance notes.",
        href: "/api/exchange-os/xrpl-dex",
        badge: "GET",
      },
      {
        title: "Non-Custodial Route API",
        desc: "Static config: route flow, chain models, non-custodial guarantees.",
        href: "/api/exchange-os/non-custodial-route",
        badge: "GET",
      },
      {
        title: "Launch Committee API",
        desc: "Static config: reviewers, documents, blockers, escalation triggers.",
        href: "/api/exchange-os/launch-committee",
        badge: "GET",
      },
      {
        title: "Partner Onboarding API",
        desc: "Static config: 12-stage onboarding pipeline, provides, refuses.",
        href: "/api/exchange-os/partner-onboarding",
        badge: "GET",
      },
      {
        title: "Market Monitoring API",
        desc: "Static config: alert types, data sources, incident runbook.",
        href: "/api/exchange-os/market-monitoring",
        badge: "GET",
      },
    ],
  },
];

export default function ExchangeOSControlCenter() {
  return (
    <div style={{ padding: "0 0 4rem" }}>
      {/* Page header */}
      <div
        style={{
          borderBottom: "1px solid var(--xos-border)",
          background: "var(--xos-surface)",
          padding: "2rem 1.5rem 1.75rem",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
            <Link href="/exchange-os" style={{ fontSize: "0.75rem", color: "var(--xos-text-subtle)", textDecoration: "none" }}>
              Exchange OS
            </Link>
            <span style={{ color: "var(--xos-text-subtle)", fontSize: "0.75rem" }}>/</span>
            <span style={{ fontSize: "0.75rem", color: "var(--xos-text-muted)" }}>Control Center</span>
          </div>
          <h1
            style={{
              fontWeight: 900,
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              color: "var(--xos-text)",
              margin: "0 0 0.5rem",
              letterSpacing: "-0.02em",
            }}
          >
            TROPTIONS Exchange OS — Control Center
          </h1>
          <p style={{ color: "var(--xos-text-muted)", fontSize: "0.9rem", margin: 0, maxWidth: 700, lineHeight: 1.6 }}>
            Institutional launch-control, proof, compliance, route intelligence, and non-custodial market infrastructure.
          </p>
        </div>
      </div>

      {/* Truth Banner */}
      <div
        style={{
          background: "rgba(234,179,8,0.05)",
          borderBottom: "1px solid rgba(234,179,8,0.2)",
          padding: "0.9rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
          <span style={{ fontWeight: 800, fontSize: "0.75rem", color: "var(--xos-gold)", whiteSpace: "nowrap", marginTop: 1 }}>
            Truth label:
          </span>
          <p style={{ fontSize: "0.76rem", color: "var(--xos-text-muted)", margin: 0, lineHeight: 1.6 }}>
            {TRUTH_STATEMENT}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2.5rem 1.5rem 0" }}>

        {/* Feature flag notice */}
        <div
          style={{
            background: "var(--xos-surface)",
            border: "1px solid var(--xos-border)",
            borderRadius: "var(--xos-radius)",
            padding: "0.75rem 1rem",
            marginBottom: "2.5rem",
            fontSize: "0.76rem",
            color: "var(--xos-text-muted)",
          }}
        >
          <strong style={{ color: "var(--xos-text)" }}>Feature Flags:</strong>{" "}
          XRPL_MAINNET_ENABLED=<code style={{ color: "#ef4444" }}>false</code> ·
          SOLANA_MAINNET_ENABLED=<code style={{ color: "#ef4444" }}>false</code> ·
          TOKEN_LAUNCH_ENABLED=<code style={{ color: "#ef4444" }}>false</code> ·
          LIVE_TRADING_ENABLED=<code style={{ color: "#ef4444" }}>false</code> ·
          PARTNER_INTAKE_ENABLED=<code style={{ color: "var(--xos-green)" }}>true</code> ·
          READINESS_PAGES_ENABLED=<code style={{ color: "var(--xos-green)" }}>true</code>
        </div>

        {/* Sections */}
        {SECTIONS.map((section) => (
          <div key={section.category} style={{ marginBottom: "2.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <div style={{ width: 3, height: 18, background: section.color, borderRadius: 2 }} />
              <h2 style={{ fontWeight: 800, fontSize: "1rem", color: "var(--xos-text)", margin: 0 }}>
                {section.category}
              </h2>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: "0.75rem",
              }}
            >
              {section.items.map((item) => (
                <Link key={item.title} href={item.href} style={{ textDecoration: "none" }}>
                  <div
                    className="xos-card"
                    style={{
                      padding: "1rem 1.1rem",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.4rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--xos-text)" }}>
                        {item.title}
                      </span>
                      <span
                        style={{
                          fontSize: "0.6rem",
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: 3,
                          color: section.color,
                          background: `${section.color}14`,
                        }}
                      >
                        {item.badge}
                      </span>
                    </div>
                    <p style={{ fontSize: "0.74rem", color: "var(--xos-text-muted)", margin: 0, lineHeight: 1.5, flex: 1 }}>
                      {item.desc}
                    </p>
                    <span style={{ fontSize: "0.7rem", color: section.color, fontWeight: 600 }}>Open →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Nav footer */}
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", justifyContent: "center", paddingTop: "1rem", borderTop: "1px solid var(--xos-border)" }}>
          <Link href="/exchange-os" className="xos-btn xos-btn--outline xos-btn--sm">← Exchange OS</Link>
          <Link href="/exchange-os/readiness" className="xos-btn xos-btn--outline xos-btn--sm">Readiness Check</Link>
          <Link href="/exchange-os/solana-dex-map" className="xos-btn xos-btn--outline xos-btn--sm">Solana DEX Map</Link>
          <Link href="/exchange-os/status" className="xos-btn xos-btn--outline xos-btn--sm">Integration Status</Link>
          <Link href="/exchange-os/compare" className="xos-btn xos-btn--outline xos-btn--sm">Compare vs DEX</Link>
        </div>
      </div>
    </div>
  );
}
