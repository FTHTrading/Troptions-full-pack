"use client";

import { brand } from "@/config/exchange-os/brand";
import { features } from "@/config/exchange-os/features";
import Link from "next/link";
import { TroptionsLogo } from "./TroptionsLogo";

export function HeroSection() {
  return (
    <section
      className="xos-hero-bg"
      style={{
        padding: "3.5rem 1.5rem 3rem",
        maxWidth: 1000,
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: "1.5rem" }}>
        <TroptionsLogo size={72} variant="full" style={{ display: "inline-flex" }} />
      </div>

      {/* Live DEX badge row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <span className="xos-badge xos-badge--cyan" style={{ fontSize: "0.7rem", fontWeight: 700 }}>
          ● LIVE DEX
        </span>
        <span className="xos-badge xos-badge--gold" style={{ fontSize: "0.7rem" }}>
          ◆ XRPL Native
        </span>
        <span className="xos-badge xos-badge--slate" style={{ fontSize: "0.7rem" }}>
          x402 Intelligence
        </span>
        <span className="xos-badge xos-badge--slate" style={{ fontSize: "0.7rem" }}>
          Unsigned-First Wallet
        </span>
      </div>

      {/* Main headline */}
      <h1
        style={{
          fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
          fontWeight: 900,
          lineHeight: 1.08,
          color: "var(--xos-text)",
          marginBottom: "1rem",
          letterSpacing: "-0.025em",
        }}
      >
        TROPTIONS Live DEX
      </h1>

      <p
        style={{
          fontSize: "1.1rem",
          color: "var(--xos-text-muted)",
          maxWidth: 580,
          margin: "0 auto 0.75rem",
          lineHeight: 1.65,
        }}
      >
        Trade, launch, and verify XRPL assets in one professional decentralized exchange.
      </p>

      <p
        style={{
          fontSize: "0.82rem",
          color: "var(--xos-text-subtle)",
          maxWidth: 560,
          margin: "0 auto 2.25rem",
          lineHeight: 1.6,
        }}
      >
        Live order books · AMM liquidity · Issuer verification · Launch proof packets · x402 intelligence
      </p>

      {/* CTA row */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: "1.5rem",
        }}
      >
        <Link href="/exchange-os/trade" className="xos-btn xos-btn--cyan xos-btn--lg">
          ⟷ Start Trading
        </Link>
        <Link href="/exchange-os/tokens" className="xos-btn xos-btn--outline xos-btn--lg">
          ≡ View Markets
        </Link>
        <Link href="/exchange-os/launch" className="xos-btn xos-btn--primary xos-btn--lg">
          ◆ Launch Token
        </Link>
      </div>

      {/* Powered by note */}
      <p style={{ fontSize: "0.7rem", color: "var(--xos-text-subtle)", margin: "0 0 2rem", letterSpacing: "0.04em" }}>
        {brand.poweredBy}
      </p>

      {/* 4-pillar strip */}
      <div className="xos-stat-strip" style={{ maxWidth: 760, margin: "0 auto" }}>
        {[
          { icon: "⟷", label: "Live Order Books",  desc: "Native XRPL DEX depth",          color: "var(--xos-cyan)" },
          { icon: "◎",  label: "AMM Pools",         desc: "Swap through XRPL liquidity",    color: "var(--xos-cyan)" },
          { icon: "◆",  label: "Issuer Proof",      desc: "Verified launches on-chain",     color: "var(--xos-gold)" },
          { icon: "⚡", label: "x402 Intelligence", desc: "Paid AI risk & market reports",  color: "var(--xos-gold)" },
        ].map(({ icon, label, desc, color }) => (
          <div key={label} className="xos-stat-strip-cell" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.1rem", color, marginBottom: "0.25rem" }}>{icon}</div>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {label}
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--xos-text-muted)", marginTop: "0.2rem", lineHeight: 1.4 }}>
              {desc}
            </div>
          </div>
        ))}
      </div>


    </section>
  );
}
