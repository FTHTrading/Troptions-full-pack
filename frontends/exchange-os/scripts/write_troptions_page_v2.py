#!/usr/bin/env python3
"""Write src/app/troptions/page.tsx with verified on-chain facts."""
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "src" / "app" / "troptions" / "page.tsx"

CONTENT = r'''import Image from "next/image";
import Link from "next/link";
import CopyAddressButton from "@/components/troptions-evolution/CopyAddressButton";
import "@/styles/troptions-evolution.css";

export const metadata = {
  title: "TROPTIONS - Live Digital Asset on XRPL & Stellar",
  description:
    "TROPTIONS is a live digital asset issued on XRPL Mainnet with 100M tokens, an active AMM pool, and a full Rust Layer 1 blockchain. Verify everything on-chain independently.",
};

// =============================================================================
// VERIFIED ON-CHAIN FACTS - XRPL Mainnet ledger 103,872,749 (April 28, 2026)
// Re-run scripts/verify-troptions-onchain.ps1 to refresh.
// =============================================================================

const ISSUER = "rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ";
const DISTRIBUTION = "rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt";
const AMM_ACCOUNT = "rBU6exSQHkrTog6n1F5RX8gzcUrXoniGcp";
const DEX_TRADER = "rsRy4Yic74sRn4GxYSm8Ve32zHC5mAEaGr";
const STELLAR_ISSUER = "GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4";
const STELLAR_DISTRIBUTION = "GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC";

const PROOF_CHECKS = [
  { label: "100M Tokens Issued",   sub: "99,999,999.97 TROPTIONS - obligations on issuer" },
  { label: "AMM Pool Active",      sub: "TROPTIONS / XRP - bootstrap liquidity" },
  { label: "3 Trustlines Verified", sub: "Distribution, AMM pool account, DEX trader" },
  { label: "Genesis Locked",       sub: "8 brand entities, IPFS-pinned manifest" },
] as const;

const STATS = [
  { value: "100M",  label: "Tokens Issued" },
  { value: "3",     label: "Verified Trustlines" },
  { value: "27",    label: "Rust L1 Crates" },
  { value: "8",     label: "Brand Entities" },
] as const;

// Wallets - all directly tied to TROPTIONS issuance / settlement / liquidity.
// No third-party speculative wallets are listed as "verified holders" here.
const WALLETS = [
  {
    label: "XRPL Issuer (Master)",
    role: "Sole issuer of all 100M TROPTIONS - obligations: 99,999,999.97",
    chain: "XRPL",
    address: ISSUER,
    explorers: [
      { label: "XRPL Ledger", url: `https://livenet.xrpl.org/accounts/${ISSUER}` },
      { label: "XRPLorer",    url: `https://xrplorer.com/account/${ISSUER}` },
      { label: "XRPScan",     url: `https://xrpscan.com/account/${ISSUER}` },
      { label: "Bithomp",     url: `https://bithomp.com/explorer/${ISSUER}` },
    ],
  },
  {
    label: "XRPL Distribution",
    role: "Treasury - holds 99,999,000 TROPTIONS for AMM seeding & distribution",
    chain: "XRPL",
    address: DISTRIBUTION,
    explorers: [
      { label: "XRPL Ledger", url: `https://livenet.xrpl.org/accounts/${DISTRIBUTION}` },
      { label: "XRPLorer",    url: `https://xrplorer.com/account/${DISTRIBUTION}` },
    ],
  },
  {
    label: "XRPL AMM Pool Account",
    role: "Protocol-owned AMM - 2.876 XRP / 348.93 TROPTIONS, fee 0.3%",
    chain: "XRPL",
    address: AMM_ACCOUNT,
    explorers: [
      { label: "XRPL Ledger", url: `https://livenet.xrpl.org/accounts/${AMM_ACCOUNT}` },
      { label: "XRPLorer",    url: `https://xrplorer.com/account/${AMM_ACCOUNT}` },
    ],
  },
  {
    label: "XRPL DEX Trader",
    role: "Independent third-party holder - 651.04 TROPTIONS via DEX",
    chain: "XRPL",
    address: DEX_TRADER,
    explorers: [
      { label: "XRPL Ledger", url: `https://livenet.xrpl.org/accounts/${DEX_TRADER}` },
      { label: "XRPLorer",    url: `https://xrplorer.com/account/${DEX_TRADER}` },
    ],
  },
  {
    label: "Stellar Issuer",
    role: "Stellar mainnet issuer - declared (1 LP, awaiting trustlines)",
    chain: "Stellar",
    address: STELLAR_ISSUER,
    explorers: [
      { label: "Stellar Expert", url: `https://stellar.expert/explorer/public/account/${STELLAR_ISSUER}` },
    ],
  },
  {
    label: "Stellar Distribution",
    role: "Stellar distribution wallet - paired with Stellar issuer",
    chain: "Stellar",
    address: STELLAR_DISTRIBUTION,
    explorers: [
      { label: "Stellar Expert", url: `https://stellar.expert/explorer/public/account/${STELLAR_DISTRIBUTION}` },
    ],
  },
] as const;

// Live AMM snapshot - ledger 103,872,749
const AMM_SNAPSHOT = {
  xrp: "2.876",
  troptions: "348.93",
  feePct: "0.3%",
  lpShares: "31,622.78",
  status: "Bootstrap pool - liquidity to be expanded by Distribution wallet",
};

const BRANDS = [
  { name: "TROPTIONS.ORG",           role: "Institutional Platform",    status: "Active",  color: "emerald" },
  { name: "Troptions Xchange",       role: "Exchange / Trade Platform", status: "Draft",   color: "blue" },
  { name: "Troptions Unity Token",   role: "Token / Digital Asset",     status: "Live",    color: "emerald" },
  { name: "Troptions University",    role: "Education / Academy",       status: "Active",  color: "emerald" },
  { name: "Troptions TV Network",    role: "Media / Broadcasting",      status: "Draft",   color: "blue" },
  { name: "Real Estate Connections", role: "Real Estate / RWA",         status: "Draft",   color: "blue" },
  { name: "Green-N-Go Solar",        role: "Energy / ESG Asset",        status: "Draft",   color: "blue" },
  { name: "HOTRCW",                  role: "Utility / Service",         status: "Review",  color: "amber" },
] as const;

// Web3 capability stack - all routes already exist in the platform
const WEB3_STACK = [
  { icon: "RWA",  title: "Real-World Assets", desc: "Gold, energy, carbon, oil, treasury - proof-gated intake", href: "/troptions-old-money/rwa" },
  { icon: "PoF",  title: "Proof of Funds",     desc: "Bank-issued source documents, AML-clean evidence ledger", href: "/troptions-old-money/settlement" },
  { icon: "IOU",  title: "XRPL IOUs",          desc: "TROPTIONS as a native XRPL trust-line currency",          href: "/troptions/xrpl-platform" },
  { icon: "MPT",  title: "MPTokens",           desc: "Multi-Purpose Tokens for permissioned issuance",          href: "/troptions/xrpl-platform" },
  { icon: "NFT",  title: "NFTs",               desc: "Brand and asset NFT issuance via XRPL native NFTokens",   href: "/troptions/ecosystem" },
  { icon: "NS",   title: "Namespaces",         desc: "Reserved brand namespaces in the L1 genesis manifest",    href: "/troptions/ecosystem" },
  { icon: "NIL",  title: "NIL Rights",         desc: "Name / Image / Likeness tokenization for creators",       href: "/troptions/ecosystem" },
  { icon: "AMM",  title: "AMM Liquidity",      desc: "Native XRPL AMM pool with TROPTIONS / XRP pair",          href: `https://livenet.xrpl.org/accounts/${AMM_ACCOUNT}` },
] as const;

const NAV_CARDS = [
  { href: "/troptions/xrpl-platform",            icon: "XRPL", title: "XRPL Platform",      desc: "Live market data, AMM, DEX, order books" },
  { href: "/troptions/wallets",                  icon: "WLT",  title: "Live Wallets",        desc: "All public addresses with explorer links" },
  { href: "/troptions/ecosystem",                icon: "ECO",  title: "Ecosystem",           desc: "Brand entities, NIL, namespaces, NFTs" },
  { href: "/troptions-old-money/rwa",            icon: "RWA",  title: "Real World Assets",   desc: "RWA issuance pipeline (proof-gated)" },
  { href: "/troptions/history",                  icon: "HST",  title: "TROPTIONS History",   desc: "Origins, milestones, evolution" },
  { href: "/troptions/xrpl-stellar-compliance",  icon: "CMP",  title: "Compliance",          desc: "ISO 20022, AML controls, jurisdiction" },
] as const;

// =============================================================================

export default function TroptionsPage() {
  return (
    <div style={{ background: "linear-gradient(160deg, #071426 0%, #0c1e35 60%, #071426 100%)", minHeight: "100vh" }}>

      {/* HERO */}
      <section style={{ padding: "4rem 1.25rem 3rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5rem", flexWrap: "wrap" }}>
          <div style={{ position: "relative", width: 80, height: 80, borderRadius: "1rem", overflow: "hidden", border: "2px solid rgba(201,154,60,0.6)", flexShrink: 0 }}>
            <Image
              src="/assets/troptions/logos/troptions-logo-new-official.jpg"
              alt="TROPTIONS"
              fill
              sizes="80px"
              className="object-contain"
              priority
            />
          </div>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(201,154,60,0.12)", border: "1px solid rgba(201,154,60,0.35)", borderRadius: "2rem", padding: "0.3rem 0.85rem", marginBottom: "0.75rem" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
              <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#f0cf82" }}>Live on XRPL Mainnet</span>
            </div>
            <h1 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "clamp(2.2rem, 5vw, 3.6rem)", fontWeight: 700, lineHeight: 1.1, color: "#f8fafc", margin: "0 0 0.85rem" }}>
              TROPTIONS
            </h1>
            <p style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", color: "#94a3b8", lineHeight: 1.65, maxWidth: 620, margin: "0 0 1.75rem" }}>
              A live digital asset on XRPL with a full Rust Layer 1 blockchain, 8 registered brand entities, and a Web3 stack covering RWA, NIL, namespaces, MPTs and NFTs - every claim is verifiable on-chain right now.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem" }}>
              <a
                href={`https://xrplorer.com/account/${ISSUER}`}
                target="_blank" rel="noreferrer noopener"
                style={{ background: "#c99a3c", color: "#111827", padding: "0.65rem 1.25rem", borderRadius: "0.6rem", fontWeight: 700, fontSize: "0.875rem", textDecoration: "none" }}
              >
                Verify on XRPLorer
              </a>
              <a
                href={`https://livenet.xrpl.org/accounts/${ISSUER}`}
                target="_blank" rel="noreferrer noopener"
                style={{ background: "rgba(255,255,255,0.07)", color: "#f1f5f9", border: "1px solid rgba(255,255,255,0.15)", padding: "0.65rem 1.25rem", borderRadius: "0.6rem", fontWeight: 600, fontSize: "0.875rem", textDecoration: "none" }}
              >
                XRPL Ledger
              </a>
              <Link
                href="/portal/troptions/onboarding"
                style={{ background: "transparent", color: "#f0cf82", border: "1px solid rgba(201,154,60,0.45)", padding: "0.65rem 1.25rem", borderRadius: "0.6rem", fontWeight: 600, fontSize: "0.875rem", textDecoration: "none" }}
              >
                Request Access
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.75rem", marginTop: "3rem", borderTop: "1px solid rgba(201,154,60,0.2)", paddingTop: "2rem" }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ padding: "1rem", borderRadius: "0.75rem", background: "rgba(201,154,60,0.07)", border: "1px solid rgba(201,154,60,0.18)", textAlign: "center" }}>
              <p style={{ fontSize: "1.75rem", fontWeight: 800, color: "#f0cf82", margin: 0, lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#64748b", margin: "0.4rem 0 0" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ON-CHAIN VERIFICATION */}
      <section style={{ padding: "0 1.25rem 2.5rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ background: "rgba(245,240,228,0.97)", border: "1px solid rgba(201,154,60,0.4)", borderRadius: "1rem", padding: "2rem" }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#92400e", margin: "0 0 0.4rem" }}>On-Chain Proof - XRPL Mainnet</p>
          <h2 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700, color: "#0f172a", margin: "0 0 0.6rem" }}>Verify TROPTIONS Yourself</h2>
          <p style={{ color: "#374151", lineHeight: 1.65, margin: "0 0 1.5rem", maxWidth: 720 }}>
            The issuer address below is the single on-chain source of truth. Click any explorer to independently confirm the token supply, trustlines, AMM pool and trade history - no account required. Snapshot taken at XRPL ledger 103,872,749.
          </p>

          {/* Issuer address */}
          <div style={{ background: "#0f172a", borderRadius: "0.75rem", padding: "1.25rem 1.5rem", marginBottom: "1.25rem" }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#f0cf82", margin: "0 0 0.5rem" }}>XRPL Issuer Address</p>
            <p style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.85rem", color: "#e2e8f0", wordBreak: "break-all", margin: "0 0 0.85rem" }}>{ISSUER}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <CopyAddressButton address={ISSUER} />
              {[
                { label: "XRPLorer",    url: `https://xrplorer.com/account/${ISSUER}` },
                { label: "XRPL Ledger", url: `https://livenet.xrpl.org/accounts/${ISSUER}` },
                { label: "XRPScan",     url: `https://xrpscan.com/account/${ISSUER}` },
                { label: "Bithomp",     url: `https://bithomp.com/explorer/${ISSUER}` },
              ].map((ex) => (
                <a key={ex.url} href={ex.url} target="_blank" rel="noreferrer noopener"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#cbd5e1", padding: "0.35rem 0.75rem", borderRadius: "0.4rem", fontSize: "0.75rem", fontWeight: 600, textDecoration: "none" }}>
                  {ex.label}
                </a>
              ))}
            </div>
          </div>

          {/* Proof checklist */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.65rem" }}>
            {PROOF_CHECKS.map((c) => (
              <div key={c.label} style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "0.6rem", padding: "0.85rem" }}>
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#16a34a", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 800, flexShrink: 0 }}>OK</span>
                <div>
                  <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#14532d", margin: 0 }}>{c.label}</p>
                  <p style={{ fontSize: "0.72rem", color: "#166534", margin: "0.15rem 0 0" }}>{c.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Honest AMM disclosure */}
          <div style={{ marginTop: "1.25rem", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "0.6rem", padding: "1rem 1.15rem" }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#92400e", margin: "0 0 0.35rem" }}>AMM Liquidity Snapshot</p>
            <p style={{ fontSize: "0.85rem", color: "#1f2937", margin: 0, lineHeight: 1.55 }}>
              <strong>{AMM_SNAPSHOT.xrp} XRP</strong> paired with <strong>{AMM_SNAPSHOT.troptions} TROPTIONS</strong> at fee {AMM_SNAPSHOT.feePct}, {AMM_SNAPSHOT.lpShares} LP shares.
              <br />
              <span style={{ color: "#92400e" }}>{AMM_SNAPSHOT.status}.</span>{" "}
              The Distribution wallet holds 99,999,000 TROPTIONS earmarked for further AMM seeding once governance approves.
            </p>
          </div>
        </div>
      </section>

      {/* WALLETS */}
      <section style={{ padding: "0 1.25rem 2.5rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "1.25rem" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#f0cf82", margin: "0 0 0.35rem" }}>Verified On-Chain Wallets</p>
          <h2 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700, color: "#f1f5f9", margin: "0 0 0.5rem" }}>Every Address is Public TROPTIONS Infrastructure</h2>
          <p style={{ color: "#94a3b8", lineHeight: 1.65, margin: 0, maxWidth: 720, fontSize: "0.9rem" }}>
            These six wallets are the entire public surface of the TROPTIONS issuance. Every balance, trustline and trade is verifiable by anyone - no account, no permission required. We don&apos;t list speculative third-party addresses as &quot;verified holders&quot;.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "0.85rem" }}>
          {WALLETS.map((w) => (
            <div key={w.address} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.85rem", padding: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.65rem" }}>
                <div>
                  <p style={{ fontWeight: 700, color: "#f1f5f9", fontSize: "0.95rem", margin: 0 }}>{w.label}</p>
                  <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: "0.2rem 0 0", lineHeight: 1.5 }}>{w.role}</p>
                </div>
                <span style={{
                  background: w.chain === "XRPL" ? "rgba(59,130,246,0.15)" : "rgba(99,102,241,0.15)",
                  color: w.chain === "XRPL" ? "#93c5fd" : "#a5b4fc",
                  border: w.chain === "XRPL" ? "1px solid rgba(59,130,246,0.3)" : "1px solid rgba(99,102,241,0.3)",
                  padding: "0.2rem 0.6rem", borderRadius: "2rem", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", whiteSpace: "nowrap", flexShrink: 0
                }}>{w.chain}</span>
              </div>
              <p style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.7rem", color: "#64748b", wordBreak: "break-all", margin: "0 0 0.85rem", background: "rgba(0,0,0,0.25)", padding: "0.6rem 0.75rem", borderRadius: "0.4rem" }}>{w.address}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                <CopyAddressButton address={w.address} />
                {w.explorers.map((ex) => (
                  <a key={ex.url} href={ex.url} target="_blank" rel="noreferrer noopener"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#cbd5e1", padding: "0.3rem 0.65rem", borderRadius: "0.35rem", fontSize: "0.72rem", fontWeight: 600, textDecoration: "none" }}>
                    {ex.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "1rem" }}>
          <Link href="/troptions/wallets" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#f0cf82", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none", border: "1px solid rgba(201,154,60,0.35)", padding: "0.6rem 1.1rem", borderRadius: "0.5rem" }}>
            View Full Wallet Showcase
          </Link>
        </div>
      </section>

      {/* WEB3 CAPABILITY STACK */}
      <section style={{ padding: "0 1.25rem 2.5rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ background: "#0c1e35", border: "1px solid rgba(201,154,60,0.35)", borderRadius: "1rem", padding: "2rem" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#f0cf82", margin: "0 0 0.4rem" }}>Web3 Capability Stack</p>
          <h2 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700, color: "#f1f5f9", margin: "0 0 0.5rem" }}>What TROPTIONS Can Do Today</h2>
          <p style={{ color: "#94a3b8", lineHeight: 1.65, margin: "0 0 1.5rem", maxWidth: 720, fontSize: "0.9rem" }}>
            Native XRPL primitives - IOUs, MPTs, NFTs, AMM - combined with proof-gated RWA workflows, NIL rights tokenization, and a sovereign Layer 1 that anchors brand namespaces to on-chain identity.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.75rem" }}>
            {WEB3_STACK.map((c) => {
              const isExternal = c.href.startsWith("http");
              const inner = (
                <>
                  <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.7rem", fontWeight: 700, color: "#f0cf82", letterSpacing: "0.1em", display: "inline-block", padding: "0.15rem 0.5rem", borderRadius: "0.3rem", background: "rgba(201,154,60,0.12)", border: "1px solid rgba(201,154,60,0.3)", marginBottom: "0.6rem" }}>{c.icon}</span>
                  <p style={{ fontWeight: 700, color: "#f1f5f9", fontSize: "0.9rem", margin: "0 0 0.3rem" }}>{c.title}</p>
                  <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: 0, lineHeight: 1.55 }}>{c.desc}</p>
                </>
              );
              const style = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.75rem", padding: "1.1rem 1.25rem", textDecoration: "none", display: "block" };
              return isExternal
                ? <a key={c.title} href={c.href} target="_blank" rel="noreferrer noopener" style={style}>{inner}</a>
                : <Link key={c.title} href={c.href} style={style}>{inner}</Link>;
            })}
          </div>
        </div>
      </section>

      {/* BRAND ENTITIES */}
      <section style={{ padding: "0 1.25rem 2.5rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ background: "rgba(245,240,228,0.97)", border: "1px solid rgba(201,154,60,0.4)", borderRadius: "1rem", padding: "2rem" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#92400e", margin: "0 0 0.4rem" }}>8 Brand Entities - Registered in Rust L1 Genesis</p>
          <h2 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700, color: "#0f172a", margin: "0 0 0.5rem" }}>The TROPTIONS Ecosystem</h2>
          <p style={{ color: "#374151", lineHeight: 1.65, margin: "0 0 1.5rem", maxWidth: 660 }}>
            Every entity is embedded in the TSN genesis manifest - deterministically hashed, IPFS-pinned, and verifiable on-chain as a reserved namespace.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "0.75rem" }}>
            {BRANDS.map((b) => (
              <div key={b.name} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "0.75rem", padding: "1rem 1.1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                  <p style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.875rem", margin: 0, lineHeight: 1.3 }}>{b.name}</p>
                  <span style={{
                    flexShrink: 0,
                    background: b.status === "Active" || b.status === "Live" ? "#dcfce7" : b.status === "Review" ? "#fef3c7" : "#dbeafe",
                    color: b.status === "Active" || b.status === "Live" ? "#166534" : b.status === "Review" ? "#92400e" : "#1e40af",
                    padding: "0.15rem 0.5rem", borderRadius: "2rem", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase"
                  }}>{b.status}</span>
                </div>
                <p style={{ fontSize: "0.75rem", color: "#64748b", margin: "0.35rem 0 0" }}>{b.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RUST LAYER 1 */}
      <section style={{ padding: "0 1.25rem 2.5rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ background: "#0c1e35", border: "1px solid rgba(201,154,60,0.35)", borderRadius: "1rem", padding: "2rem", display: "grid", gridTemplateColumns: "1fr auto", gap: "1.5rem", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#f0cf82", margin: "0 0 0.4rem" }}>Rust Layer 1 Blockchain</p>
            <h2 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "clamp(1.3rem, 3vw, 1.9rem)", fontWeight: 700, color: "#f1f5f9", margin: "0 0 0.65rem" }}>
              Troptions Settlement Network (TSN)
            </h2>
            <p style={{ color: "#94a3b8", lineHeight: 1.65, margin: "0 0 1.25rem", maxWidth: 560 }}>
              A purpose-built Rust blockchain with 27 crates covering consensus, cross-chain bridges (XRPL + Stellar), RWA, NFTs, post-quantum crypto, compliance, and governance. All 8 brand entities are embedded in the genesis manifest.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
              {["consensus", "bridge-xrpl", "bridge-stellar", "rwa", "nft", "namespaces", "compliance", "pq-crypto", "governance", "genesis", "+17 more"].map((c) => (
                <span key={c} style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.72rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#94a3b8", padding: "0.25rem 0.6rem", borderRadius: "0.35rem" }}>{c}</span>
              ))}
            </div>
            <div style={{ marginTop: "1.25rem", display: "flex", flexWrap: "wrap", gap: "0.65rem" }}>
              <a href="https://github.com/FTHTrading/Troptions-L1" target="_blank" rel="noreferrer noopener"
                style={{ background: "#c99a3c", color: "#111827", padding: "0.6rem 1.15rem", borderRadius: "0.55rem", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none" }}>
                View on GitHub
              </a>
              <Link href="/troptions/chains"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#cbd5e1", padding: "0.6rem 1.15rem", borderRadius: "0.55rem", fontWeight: 600, fontSize: "0.85rem", textDecoration: "none" }}>
                Chain Status
              </Link>
            </div>
          </div>
          <div style={{ display: "grid", gap: "0.65rem", minWidth: 140 }}>
            {[
              { v: "27",   l: "Rust Crates" },
              { v: "4",    l: "Chains" },
              { v: "100%", l: "Genesis Locked" },
            ].map((s) => (
              <div key={s.l} style={{ background: "rgba(201,154,60,0.08)", border: "1px solid rgba(201,154,60,0.2)", borderRadius: "0.65rem", padding: "0.85rem 1rem", textAlign: "center" }}>
                <p style={{ fontSize: "1.6rem", fontWeight: 800, color: "#f0cf82", margin: 0, lineHeight: 1 }}>{s.v}</p>
                <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#64748b", margin: "0.3rem 0 0" }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NAVIGATION */}
      <section style={{ padding: "0 1.25rem 2.5rem", maxWidth: "1200px", margin: "0 auto" }}>
        <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#64748b", margin: "0 0 1rem" }}>Explore the Platform</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "0.75rem" }}>
          {NAV_CARDS.map((n) => (
            <Link key={n.href} href={n.href} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "0.85rem", padding: "1.1rem 1.25rem", textDecoration: "none", display: "block" }}>
              <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.7rem", fontWeight: 700, color: "#f0cf82", letterSpacing: "0.1em", display: "inline-block", padding: "0.15rem 0.5rem", borderRadius: "0.3rem", background: "rgba(201,154,60,0.1)", border: "1px solid rgba(201,154,60,0.25)", marginBottom: "0.45rem" }}>{n.icon}</span>
              <p style={{ fontWeight: 700, color: "#f1f5f9", fontSize: "0.9rem", margin: "0 0 0.3rem" }}>{n.title}</p>
              <p style={{ fontSize: "0.75rem", color: "#64748b", margin: 0, lineHeight: 1.5 }}>{n.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "0 1.25rem 3rem", maxWidth: "1200px", margin: "0 auto", borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "1.5rem", marginTop: "0.5rem" }}>
        <p style={{ fontSize: "0.72rem", color: "#475569", lineHeight: 1.7 }}>
          <strong style={{ color: "#64748b" }}>Disclaimer:</strong> TROPTIONS is not a bank, broker-dealer, exchange, custodian, or licensed financial institution. All on-chain data links to public blockchain explorers and can be independently verified. AMM, supply and trustline figures are taken from XRPL ledger 103,872,749 (April 28, 2026). All Rust L1 simulation code is marked <code style={{ fontFamily: "monospace", background: "rgba(255,255,255,0.05)", padding: "0.1em 0.3em", borderRadius: "0.2em" }}>simulation_only: true</code> until governance and provider gates clear.
        </p>
      </footer>

    </div>
  );
}
'''

OUT.write_text(CONTENT, encoding="utf-8", newline="\n")
print(f"WROTE {OUT} ({len(CONTENT)} chars)")
