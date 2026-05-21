import { HeroSection } from "@/components/exchange-os/HeroSection";
import { TokenCard } from "@/components/exchange-os/TokenCard";
import { DEMO_TOKENS, DEMO_ADMIN_METRICS } from "@/config/exchange-os/demoData";
import Link from "next/link";

export default function ExchangeOSHomePage() {
  return (
    <div style={{ padding: "0 0 4rem" }}>
      {/* Hero */}
      <HeroSection />

      {/* Live market stats bar */}
      <div
        style={{
          borderTop: "1px solid var(--xos-border)",
          borderBottom: "1px solid var(--xos-border)",
          background: "var(--xos-surface)",
          padding: "0.9rem 1.5rem",
          display: "flex",
          gap: "2rem",
          overflowX: "auto",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* XRPL side — testnet demo */}
        <div className="xos-stat" style={{ minWidth: 90 }}>
          <span className="xos-stat-value" style={{ fontSize: "1rem", color: "var(--xos-gold)" }}>Testnet</span>
          <span className="xos-stat-label">XRPL Launches</span>
        </div>
        <div className="xos-stat" style={{ minWidth: 90 }}>
          <span className="xos-stat-value" style={{ fontSize: "1rem", color: "var(--xos-gold)" }}>Demo</span>
          <span className="xos-stat-label">XRPL Proof Pkts</span>
        </div>
        {/* Solana side — real mainnet data */}
        <div className="xos-stat" style={{ minWidth: 90, borderLeft: "1px solid var(--xos-border)", paddingLeft: "1rem" }}>
          <span className="xos-stat-value" style={{ fontSize: "1rem", color: "var(--xos-green)" }}>Live</span>
          <span className="xos-stat-label">GoatX (Solana)</span>
        </div>
        <div className="xos-stat" style={{ minWidth: 90 }}>
          <span className="xos-stat-value" style={{ fontSize: "1rem", color: "var(--xos-cyan)" }}>1B</span>
          <span className="xos-stat-label">$GOATX Supply</span>
        </div>
        <span style={{ marginLeft: "auto", fontSize: "0.68rem", color: "var(--xos-text-subtle)", alignSelf: "center", whiteSpace: "nowrap" }}>
          XRPL: testnet · Solana GoatX: mainnet · set XRPL_MAINNET_ENABLED=true to go live
        </span>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2.5rem 1.5rem 0" }}>

        {/* ── SECTION 1: Live Markets ── */}
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <div>
              <div className="xos-gold-line" />
              <h2 className="xos-section-title">Live Markets</h2>
              <p className="xos-section-subtitle" style={{ margin: 0 }}>
                XRPL native tokens · Live order books · AMM pools
              </p>
            </div>
            <Link href="/exchange-os/tokens" className="xos-btn xos-btn--outline xos-btn--sm">
              Full Screener →
            </Link>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1rem",
            }}
          >
            {DEMO_TOKENS.map((token) => (
              <TokenCard key={token.ticker} token={token} />
            ))}
          </div>
        </div>

        {/* ── SECTION 2: DEX Actions ── */}
        <div style={{ marginBottom: "3rem" }}>
          <div className="xos-section-header">
            <div className="xos-gold-line" />
            <h2 className="xos-section-title">What You Can Do</h2>
            <p className="xos-section-subtitle">
              A full XRPL trading terminal with launch, proof, and intelligence rails.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "1rem",
            }}
          >
            {[ 
              { icon: "⟷", title: "Trade", desc: "Swap tokens through XRPL order books and AMM pools. Unsigned transactions — your wallet signs.", href: "/exchange-os/trade", badge: "Live", color: "var(--xos-cyan)" },
              { icon: "≡", title: "Markets", desc: "Browse all listed XRPL tokens with price, volume, liquidity, and issuer verification badges.", href: "/exchange-os/tokens", badge: null, color: "var(--xos-text)" },
              { icon: "◆", title: "Launch", desc: "Deploy a token on XRPL: issuer wallet, trustline, AMM liquidity, and a downloadable proof packet.", href: "/exchange-os/launch", badge: "Guided", color: "var(--xos-gold)" },
              { icon: "◎", title: "Liquidity", desc: "View AMM pool depths, LP positions, and fee opportunities across active XRPL pairs.", href: "/exchange-os/earn", badge: null, color: "var(--xos-cyan)" },
              { icon: "✓", title: "Proof", desc: "Issuer verification, launch audit labels, and on-chain proof packets for every listed asset.", href: "/exchange-os/creator", badge: null, color: "var(--xos-green)" },
              { icon: "⚡", title: "x402 Intelligence", desc: "Pay-per-use AI risk reports, token analysis, launch readiness checks, and premium APIs.", href: "/exchange-os/x402", badge: "x402", color: "var(--xos-gold)" },
              { icon: "🔒", title: "Readiness", desc: "Institutional readiness, compliance, and launch gate checklist for TROPTIONS Exchange OS.", href: "/exchange-os/readiness", badge: "New", color: "var(--xos-gold)" },
              { icon: "◎", title: "Solana DEX Map", desc: "Solana DEX registry, launchpad competitors, and open-source stack for integration.", href: "/exchange-os/solana-dex-map", badge: "Solana", color: "var(--xos-cyan)" },
            ].map(({ icon, title, desc, href, badge, color }) => (
              <Link
                key={title}
                href={href}
                style={{ textDecoration: "none" }}
              >
                <div
                  className="xos-card"
                  style={{ padding: "1.25rem", height: "100%", display: "flex", flexDirection: "column", gap: "0.5rem", transition: "border-color 0.15s" }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "1.3rem", color }}>{icon}</span>
                    {badge && (
                      <span className="xos-badge xos-badge--cyan" style={{ fontSize: "0.65rem" }}>{badge}</span>
                    )}
                  </div>
                  <div style={{ fontWeight: 700, color: "var(--xos-text)", fontSize: "0.92rem" }}>{title}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--xos-text-muted)", lineHeight: 1.55, flex: 1 }}>{desc}</div>
                  <div style={{ fontSize: "0.73rem", color, fontWeight: 600 }}>Open →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── SECTION 3: Why TROPTIONS beats a plain DEX ── */}
        <div
          style={{
            background: "var(--xos-surface)",
            border: "1px solid var(--xos-border)",
            borderRadius: "var(--xos-radius-xl)",
            padding: "2rem",
            marginBottom: "3rem",
          }}
        >
          <div className="xos-gold-line" style={{ marginBottom: "0.75rem" }} />
          <h2 style={{ fontWeight: 800, fontSize: "1.2rem", color: "var(--xos-text)", marginBottom: "0.5rem" }}>
            More than a DEX
          </h2>
          <p style={{ color: "var(--xos-text-muted)", fontSize: "0.85rem", maxWidth: 620, lineHeight: 1.65, marginBottom: "1.5rem" }}>
            Most DEXs only help people trade. TROPTIONS helps people trade, launch, prove, monetize, and operate — all on native XRPL infrastructure with x402 payment rails for premium intelligence.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
            {[
              { label: "Trade", sub: "XRPL order books + AMM" },
              { label: "Launch", sub: "Guided token deployment" },
              { label: "Prove", sub: "On-chain issuer verification" },
              { label: "Monetize", sub: "x402 paid reports + APIs" },
              { label: "Operate", sub: "Creator, sponsor, merchant rails" },
              { label: "Protect", sub: "Unsigned-first wallet safety" },
            ].map(({ label, sub }) => (
              <div key={label} style={{ padding: "0.75rem 1rem", background: "var(--xos-bg)", borderRadius: "var(--xos-radius)", border: "1px solid var(--xos-border)" }}>
                <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "var(--xos-gold)", marginBottom: "0.2rem" }}>{label}</div>
                <div style={{ fontSize: "0.74rem", color: "var(--xos-text-muted)" }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 4: Solana Live Assets ── */}
        <div
          style={{
            background: "var(--xos-surface)",
            border: "1px solid rgba(34,197,94,0.25)",
            borderRadius: "var(--xos-radius-xl)",
            padding: "1.75rem 2rem",
            marginBottom: "3rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--xos-green)", display: "inline-block" }} />
            <h2 style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--xos-green)", margin: 0 }}>
              Solana Mainnet — Live Assets
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
            {/* GoatX */}
            <div style={{ padding: "1rem 1.25rem", background: "var(--xos-bg)", borderRadius: "var(--xos-radius)", border: "1px solid rgba(34,197,94,0.2)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span style={{ fontWeight: 800, fontSize: "1rem", color: "var(--xos-text)" }}>GoatX</span>
                <span className="xos-badge" style={{ background: "rgba(34,197,94,0.12)", color: "var(--xos-green)", border: "1px solid rgba(34,197,94,0.3)", fontSize: "0.65rem" }}>Mainnet</span>
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--xos-text-muted)", marginBottom: "0.5rem" }}>
                Solana SPL token · 1B supply · Mint + freeze authorities revoked
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--xos-text-subtle)", marginBottom: "0.5rem" }}>
                Next: Create Raydium LP to enable trading (5-10 SOL)
              </div>
              <a
                href="https://solscan.io/token/9VJQV99t9vaY5vpMkMW3xRyxfhirDfbJXb7ymCpjQMSv"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: "0.7rem", color: "var(--xos-green)", display: "inline-block" }}
              >
                View on Solscan →
              </a>
            </div>
            {/* XRPL */}
            <div style={{ padding: "1rem 1.25rem", background: "var(--xos-bg)", borderRadius: "var(--xos-radius)", border: "1px solid rgba(234,179,8,0.2)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span style={{ fontWeight: 800, fontSize: "1rem", color: "var(--xos-text)" }}>XRPL Launches</span>
                <span className="xos-badge" style={{ background: "rgba(234,179,8,0.1)", color: "var(--xos-gold)", border: "1px solid rgba(234,179,8,0.3)", fontSize: "0.65rem" }}>Testnet</span>
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--xos-text-muted)", marginBottom: "0.5rem" }}>
                0 mainnet launches — XRPL order book in demo mode
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--xos-text-subtle)" }}>
                Set <code style={{ color: "var(--xos-cyan)", fontSize: "0.68rem" }}>XRPL_MAINNET_ENABLED=true</code> in Cloudflare secrets to go live
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 5: Launch CTA ── */}
        <div
          style={{
            background: "linear-gradient(135deg, var(--xos-surface) 60%, var(--xos-gold-glow))",
            border: "1px solid var(--xos-gold-muted)",
            borderRadius: "var(--xos-radius-xl)",
            padding: "2.25rem 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "2rem",
            flexWrap: "wrap",
            marginBottom: "3rem",
          }}
        >
          <div>
            <h3 style={{ fontWeight: 800, fontSize: "1.3rem", color: "var(--xos-text)", marginBottom: "0.35rem" }}>
              Ready to launch your token?
            </h3>
            <p style={{ color: "var(--xos-text-muted)", fontSize: "0.85rem", margin: 0 }}>
              Deploy on XRPL, set trustlines, add AMM liquidity, and generate a verifiable proof packet — in one guided session.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link href="/exchange-os/launch" className="xos-btn xos-btn--primary xos-btn--lg">
              ◆ Launch Token
            </Link>
            <Link href="/exchange-os/trade" className="xos-btn xos-btn--cyan xos-btn--lg">
              ⟷ Start Trading
            </Link>
          </div>
        </div>

        {/* ── SECTION 6: Connected Systems ── */}
        <div style={{ marginBottom: "3rem" }}>
          <div className="xos-gold-line" style={{ marginBottom: "0.75rem" }} />
          <h2 className="xos-section-title">Connected Systems</h2>
          <p className="xos-section-subtitle">
            Exchange OS is one node in the UNYKORN ecosystem. Launch, operate, and distribute across all surfaces.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
            {[
              { name: "Launch Builder", desc: "Create fan memories, certificates, QR campaigns", url: "https://launch.unykorn.org", cta: "Open Launch Builder", color: "var(--xos-gold)" },
              { name: "TROPTIONS Live", desc: "Event network, sponsors, venues, merchant drops", url: "https://troptionslive.unykorn.org", cta: "Open Live Events", color: "var(--xos-cyan)" },
              { name: "WhichWay / WWAI", desc: "Fan app, multilingual, safety, claim flow", url: "https://fifa.unykorn.org", cta: "Open Guest OS", color: "var(--xos-green)" },
              { name: "GoatX", desc: "SPL token, NFT yield vault, AI agents", url: "https://goat.unykorn.org", cta: "View GoatX", color: "#a78bfa" },
            ].map(({ name, desc, url, cta, color }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: "none" }}
              >
                <div
                  className="xos-card"
                  style={{ padding: "1.1rem 1.25rem", height: "100%", display: "flex", flexDirection: "column", gap: "0.4rem" }}
                >
                  <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--xos-text)" }}>{name}</div>
                  <div style={{ fontSize: "0.76rem", color: "var(--xos-text-muted)", lineHeight: 1.5, flex: 1 }}>{desc}</div>
                  <div style={{ fontSize: "0.73rem", color, fontWeight: 600 }}>{cta} →</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ── SECTION 7: Nav links ── */}
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", justifyContent: "center", paddingBottom: "1rem" }}>
          <Link href="/exchange-os/status" className="xos-btn xos-btn--outline xos-btn--sm">Integration Status</Link>
          <Link href="/exchange-os/compare" className="xos-btn xos-btn--outline xos-btn--sm">Compare vs DEX</Link>
          <Link href="/exchange-os/readiness" className="xos-btn xos-btn--outline xos-btn--sm">Readiness Check</Link>
          <Link href="/exchange-os/solana-dex-map" className="xos-btn xos-btn--outline xos-btn--sm">Solana DEX Map</Link>
        </div>

      </div>
    </div>
  );
}
