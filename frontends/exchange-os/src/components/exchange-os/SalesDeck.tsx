// TROPTIONS Exchange OS — Sales Deck (10-slide format)

import Link from "next/link";
import { brand } from "@/config/exchange-os/brand";

interface Slide {
  num: number;
  title: string;
  headline: string;
  body: string;
  accent: "gold" | "cyan" | "green";
  icon: string;
  cta?: { label: string; href: string };
}

const SLIDES: Slide[] = [
  {
    num: 1,
    title: "The Problem",
    headline: "Trading platforms are fragmented, technical, and trust-broken.",
    body: "XRPL offers best-in-class speed and settlement. But most users can't access it without technical knowledge, a trusted guide, or a unified OS that makes every step clear.",
    accent: "gold",
    icon: "⚡",
  },
  {
    num: 2,
    title: "The Opportunity",
    headline: "XRPL rails exist. TROPTIONS makes them easy.",
    body: "XRPL processes 1,500 TPS with 3–5 second finality and near-zero fees. The DEX, AMM, and payment paths are ready. What's missing is an OS that puts it all in one place.",
    accent: "cyan",
    icon: "◈",
  },
  {
    num: 3,
    title: "The Product",
    headline: "TROPTIONS Exchange OS: one app for everything.",
    body: "Launch. Trade. Earn. Prove. One operating system for token creators, merchants, sponsors, developers, and liquidity providers — built on XRPL and x402.",
    accent: "gold",
    icon: "◆",
  },
  {
    num: 4,
    title: "XRPL Rail",
    headline: "Swaps, AMMs, trustlines, and settlement — all unsigned-first.",
    body: "Every transaction is prepared as an unsigned payload. Your wallet signs it. TROPTIONS never holds private keys. Mainnet goes live with one environment variable.",
    accent: "cyan",
    icon: "⬡",
  },
  {
    num: 5,
    title: "x402 Rail",
    headline: "Paid AI, premium APIs, and reports — per request.",
    body: "x402 is an HTTP payment protocol that enables pay-per-use gating without subscriptions. Token risk reports, launch readiness checks, and AI analytics are unlocked with one transaction.",
    accent: "gold",
    icon: "⚡",
  },
  {
    num: 6,
    title: "Earn Layer",
    headline: "Creator, referral, sponsor, liquidity, and dev rewards.",
    body: "Every platform action triggers a reward policy. Creators earn 25% of platform fees from their tokens. Referrals earn 10%. Sponsors earn 15%. Liquidity providers earn 30%.",
    accent: "green",
    icon: "★",
  },
  {
    num: 7,
    title: "Verification Layer",
    headline: "Issuer labels, proof packets, and WWAI plain-English audit.",
    body: "Every token gets a risk label set derived from on-chain data: verified issuer, freeze control, clawback rights, liquidity depth. Proof packets are portable attestation records.",
    accent: "gold",
    icon: "✓",
  },
  {
    num: 8,
    title: "Sponsor / Merchant Layer",
    headline: "Local businesses and events earn with TROPTIONS.",
    body: "Sponsors build campaigns targeting token holders. Merchants accept TROPTIONS payments with settlement rails to XRPL. Events issue attendance tokens with proof packets.",
    accent: "cyan",
    icon: "◈",
  },
  {
    num: 9,
    title: "TROPTIONS Advantage",
    headline: "Commerce OS — not just a DEX.",
    body: "Most exchanges stop at trading. TROPTIONS Exchange OS includes launch tooling, reward infrastructure, x402 revenue rails, verification, and voice-powered AI — all in one platform.",
    accent: "gold",
    icon: "◆",
  },
  {
    num: 10,
    title: "Call to Action",
    headline: "Launch your asset, campaign, or exchange experience.",
    body: "Whether you're a token creator, sponsor, developer, or enterprise partner — TROPTIONS Exchange OS is ready to onboard you. Start with a free demo or book a partner call.",
    accent: "green",
    icon: "→",
    cta: { label: "Get Started Free", href: "/exchange-os/signup" },
  },
];

export function SalesDeck() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Deck header */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <div className="xos-gold-line" style={{ margin: "0 auto 1rem" }} />
        <h1 style={{ color: "var(--xos-gold)", fontWeight: 900, fontSize: "2rem", marginBottom: "0.5rem" }}>
          {brand.product}
        </h1>
        <p style={{ color: "var(--xos-text-muted)", fontSize: "1.1rem" }}>{brand.tagline}</p>
      </div>

      {/* Slides */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {SLIDES.map((slide) => (
          <div key={slide.num} className={`xos-card xos-card--${slide.accent}`} style={{ padding: "2rem" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5rem" }}>
              <div style={{ flex: "0 0 48px" }}>
                <div style={{ fontFamily: "var(--xos-font-mono)", fontSize: "0.68rem", color: "var(--xos-text-subtle)", marginBottom: 4 }}>
                  {String(slide.num).padStart(2, "0")}
                </div>
                <div style={{ fontSize: "2rem", lineHeight: 1, color: `var(--xos-${slide.accent})` }}>
                  {slide.icon}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--xos-text-subtle)", marginBottom: "0.375rem" }}>
                  {slide.title}
                </div>
                <h2 style={{ fontWeight: 800, color: "var(--xos-text)", fontSize: "1.2rem", marginBottom: "0.75rem", lineHeight: 1.3 }}>
                  {slide.headline}
                </h2>
                <p style={{ color: "var(--xos-text-muted)", fontSize: "0.88rem", lineHeight: 1.6, margin: 0 }}>
                  {slide.body}
                </p>
                {slide.cta && (
                  <Link href={slide.cta.href} className="xos-btn xos-btn--primary" style={{ marginTop: "1.25rem", display: "inline-block" }}>
                    {slide.cta.label}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: "3rem", color: "var(--xos-text-subtle)", fontSize: "0.75rem" }}>
        {brand.platformLine} — {brand.poweredBy}
      </div>
    </div>
  );
}
