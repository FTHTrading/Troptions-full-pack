#!/usr/bin/env python3
"""Write a clean rewrite of src/app/troptions/page.tsx"""
import os

DEST = os.path.join(os.path.dirname(os.path.dirname(__file__)), "src", "app", "troptions", "page.tsx")

PAGE = r'''import Image from "next/image";
import Link from "next/link";
import CopyAddressButton from "@/components/troptions-evolution/CopyAddressButton";
import "@/styles/troptions-evolution.css";

export const metadata = {
  title: "TROPTIONS — Live Digital Asset on XRPL & Stellar",
  description:
    "TROPTIONS is a live digital asset issued on XRPL Mainnet with 100M tokens, an active AMM pool, and a full Rust Layer 1 blockchain. Verify everything on-chain independently.",
};

// ── Data ──────────────────────────────────────────────────────────────────────

const ISSUER = "rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ";

const PROOF_CHECKS = [
  { label: "100M Tokens Issued",  sub: "Full supply on XRPL Mainnet" },
  { label: "AMM Pool Active",     sub: "TROPTIONS / XRP live pair" },
  { label: "5 DEX Trades",        sub: "Confirmed on-chain history" },
  { label: "4 Trustlines",        sub: "Independent wallets verified" },
] as const;

const WALLETS = [
  {
    label: "XRPL Issuer",
    role: "Master issuer — 100 M TROPTIONS",
    chain: "XRPL",
    address: "rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ",
    explorers: [
      { label: "XRPL Ledger", url: "https://livenet.xrpl.org/accounts/rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ" },
      { label: "XRPLorer",    url: "https://xrplorer.com/account/rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ" },
      { label: "XRPScan",     url: "https://xrpscan.com/account/rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ" },
    ],
  },
  {
    label: "XRPL Distribution + AMM",
    role: "Distribution wallet & AMM pool operator",
    chain: "XRPL",
    address: "rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt",
    explorers: [
      { label: "XRPL Ledger", url: "https://livenet.xrpl.org/accounts/rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt" },
      { label: "XRPLorer",    url: "https://xrplorer.com/account/rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt" },
    ],
  },
  {
    label: "XRPL DEX Trader A",
    role: "Active DEX trader — XRP ↔ TROPTIONS",
    chain: "XRPL",
    address: "rsRy4Yic74sRn4GxYSm8Ve32zHC5mAEaGr",
    explorers: [
      { label: "XRPL Ledger", url: "https://livenet.xrpl.org/accounts/rsRy4Yic74sRn4GxYSm8Ve32zHC5mAEaGr" },
    ],
  },
  {
    label: "XRPL DEX Trader B",
    role: "AMM + DEX round-trip trader",
    chain: "XRPL",
    address: "rMbHoVjLF2z3bS6Pg4NJcqoMsjyExn5LVu",
    explorers: [
      { label: "XRPL Ledger", url: "https://livenet.xrpl.org/accounts/rMbHoVjLF2z3bS6Pg4NJcqoMsjyExn5LVu" },
    ],
  },
  {
    label: "Stellar Issuer",
    role: "Stellar mainnet issuer",
    chain: "Stellar",
    address: "GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4",
    explorers: [
      { label: "Stellar Expert", url: "https://stellar.expert/explorer/public/account/GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4" },
    ],
  },
  {
    label: "Stellar Distribution",
    role: "Stellar distribution + AMM liquidity",
    chain: "Stellar",
    address: "GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC",
    explorers: [
      { label: "Stellar Expert", url: "https://stellar.expert/explorer/public/account/GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC" },
    ],
  },
] as const;

const BRANDS = [
  { name: "TROPTIONS.ORG",           role: "Institutional Platform",    status: "Active",  color: "emerald" },
  { name: "Troptions Xchange",       role: "Exchange / Trade Platform", status: "Draft",   color: "blue" },
  { name: "Troptions Unity Token",   role: "Token / Digital Asset",     status: "Draft",   color: "blue" },
  { name: "Troptions University",    role: "Education / Academy",       status: "Active",  color: "emerald" },
  { name: "Troptions TV Network",    role: "Media / Broadcasting",      status: "Draft",   color: "blue" },
  { name: "Real Estate Connections", role: "Real Estate / RWA",         status: "Draft",   color: "blue" },
  { name: "Green-N-Go Solar",        role: "Energy / ESG Asset",        status: "Draft",   color: "blue" },
  { name: "HOTRCW",                  role: "Utility / Service",         status: "Review",  color: "amber" },
] as const;

const STATS = [
  { value: "100M",    label: "Tokens Issued" },
  { value: "$0.0114", label: "Token Price" },
  { value: "27",      label: "Rust Crates" },
  { value: "8",       label: "Brand Entities" },
] as const;

const NAV_CARDS = [
  { href: "/troptions/xrpl-platform",    icon: "◆", title: "XRPL Platform",      desc: "Live market data, AMM, DEX, order books" },
  { href: "/troptions/wallets",          icon: "◈", title: "Live Wallets",        desc: "All 6 wallets with explorer links" },
  { href: "/troptions/ecosystem",        icon: "⬡", title: "Ecosystem",           desc: "Brand entities & chain registration" },
  { href: "/troptions/rwa",              icon: "◉", title: "Real World Assets",   desc: "RWA issuance, receipts, proof-gated" },
  { href: "/troptions/history",          icon: "◎", title: "TROPTIONS History",   desc: "Origins, milestones, evolution" },
  { href: "/troptions/xrpl-stellar-compliance", icon: "◐", title: "Compliance", desc: "ISO 20022, AML controls, jurisdiction map" },
] as const;

// ── Component ─────────────────────────────────────────────────────────────────

export default function TroptionsPage() {
  return (
    <div style={{ background: "linear-gradient(160deg, #071426 0%, #0c1e35 60%, #071426 100%)", minHeight: "100vh" }}>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
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
            <p style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", color: "#94a3b8", lineHeight: 1.65, maxWidth: 560, margin: "0 0 1.75rem" }}>
              A live digital asset on XRPL and Stellar — with a full Rust Layer 1 blockchain, 8 registered brand entities, and every address verifiable on-chain right now.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem" }}>
              <a
                href={`https://xrplorer.com/account/${ISSUER}`}
                target="_blank" rel="noreferrer noopener"
                style={{ background: "#c99a3c", color: "#111827", padding: "0.65rem 1.25rem", borderRadius: "0.6rem", fontWeight: 700, fontSize: "0.875rem", textDecoration: "none" }}
              >
                Verify on XRPLorer ↗
              </a>
              <a
                href={`https://livenet.xrpl.org/accounts/${ISSUER}`}
                target="_blank" rel="noreferrer noopener"
                style={{ background: "rgba(255,255,255,0.07)", color: "#f1f5f9", border: "1px solid rgba(255,255,255,0.15)", padding: "0.65rem 1.25rem", borderRadius: "0.6rem", fontWeight: 600, fontSize: "0.875rem", textDecoration: "none" }}
              >
                XRPL Ledger ↗
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

      {/* ── ON-CHAIN VERIFICATION ─────────────────────────────────────────── */}
      <section style={{ padding: "0 1.25rem 2.5rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ background: "rgba(245,240,228,0.97)", border: "1px solid rgba(201,154,60,0.4)", borderRadius: "1rem", padding: "2rem" }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#92400e", margin: "0 0 0.4rem" }}>On-Chain Proof — XRPL Mainnet</p>
          <h2 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700, color: "#0f172a", margin: "0 0 0.6rem" }}>Verify TROPTIONS Yourself</h2>
          <p style={{ color: "#374151", lineHeight: 1.65, margin: "0 0 1.5rem", maxWidth: 640 }}>
            The issuer address below is the single on-chain source of truth. Click any explorer to independently confirm the token supply, trustlines, AMM pool, and trade history — no account required.
          </p>

          {/* Issuer address */}
          <div style={{ background: "#0f172a", borderRadius: "0.75rem", padding: "1.25rem 1.5rem", marginBottom: "1.25rem" }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#f0cf82", margin: "0 0 0.5rem" }}>XRPL Issuer Address</p>
            <p style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.85rem", color: "#e2e8f0", wordBreak: "break-all", margin: "0 0 0.85rem" }}>{ISSUER}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <CopyAddressButton address={ISSUER} />
              {[
                { label: "XRPLorer", url: `https://xrplorer.com/account/${ISSUER}` },
                { label: "XRPL Ledger", url: `https://livenet.xrpl.org/accounts/${ISSUER}` },
                { label: "XRPScan", url: `https://xrpscan.com/account/${ISSUER}` },
                { label: "Bithomp", url: `https://bithomp.com/explorer/${ISSUER}` },
                { label: "Token Page", url: `https://xrpl.org/token/TROPTIONS+${ISSUER}` },
              ].map((ex) => (
                <a key={ex.url} href={ex.url} target="_blank" rel="noreferrer noopener"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#cbd5e1", padding: "0.35rem 0.75rem", borderRadius: "0.4rem", fontSize: "0.75rem", fontWeight: 600, textDecoration: "none" }}>
                  {ex.label} ↗
                </a>
              ))}
            </div>
          </div>

          {/* Proof checklist */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.65rem" }}>
            {PROOF_CHECKS.map((c) => (
              <div key={c.label} style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "0.6rem", padding: "0.85rem" }}>
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#16a34a", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 800, flexShrink: 0 }}>✓</span>
                <div>
                  <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#14532d", margin: 0 }}>{c.label}</p>
                  <p style={{ fontSize: "0.72rem", color: "#166534", margin: "0.15rem 0 0" }}>{c.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WALLETS ───────────────────────────────────────────────────────── */}
      <section style={{ padding: "0 1.25rem 2.5rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "1.25rem" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#f0cf82", margin: "0 0 0.35rem" }}>Verified On-Chain Wallets</p>
          <h2 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700, color: "#f1f5f9", margin: 0 }}>Every Address is Public</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "0.85rem" }}>
          {WALLETS.map((w) => (
            <div key={w.address} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.85rem", padding: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.65rem" }}>
                <div>
                  <p style={{ fontWeight: 700, color: "#f1f5f9", fontSize: "0.95rem", margin: 0 }}>{w.label}</p>
                  <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: "0.2rem 0 0" }}>{w.role}</p>
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
                    {ex.label} ↗
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "1rem" }}>
          <Link href="/troptions/wallets" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#f0cf82", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none", border: "1px solid rgba(201,154,60,0.35)", padding: "0.6rem 1.1rem", borderRadius: "0.5rem" }}>
            View Full Wallet Showcase →
          </Link>
        </div>
      </section>

      {/* ── BRAND ENTITIES ────────────────────────────────────────────────── */}
      <section style={{ padding: "0 1.25rem 2.5rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ background: "rgba(245,240,228,0.97)", border: "1px solid rgba(201,154,60,0.4)", borderRadius: "1rem", padding: "2rem" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#92400e", margin: "0 0 0.4rem" }}>8 Brand Entities — Registered in Rust L1 Genesis</p>
          <h2 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700, color: "#0f172a", margin: "0 0 0.5rem" }}>The TROPTIONS Ecosystem</h2>
          <p style={{ color: "#374151", lineHeight: 1.65, margin: "0 0 1.5rem", maxWidth: 600 }}>
            Every entity is embedded in the TSN genesis manifest — deterministically hashed, IPFS-pinned, and verifiable on-chain.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "0.75rem" }}>
            {BRANDS.map((b) => (
              <div key={b.name} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "0.75rem", padding: "1rem 1.1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                  <p style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.875rem", margin: 0, lineHeight: 1.3 }}>{b.name}</p>
                  <span style={{
                    flexShrink: 0,
                    background: b.status === "Active" ? "#dcfce7" : b.status === "Review" ? "#fef3c7" : "#dbeafe",
                    color: b.status === "Active" ? "#166534" : b.status === "Review" ? "#92400e" : "#1e40af",
                    padding: "0.15rem 0.5rem", borderRadius: "2rem", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase"
                  }}>{b.status}</span>
                </div>
                <p style={{ fontSize: "0.75rem", color: "#64748b", margin: "0.35rem 0 0" }}>{b.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RUST LAYER 1 ──────────────────────────────────────────────────── */}
      <section style={{ padding: "0 1.25rem 2.5rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ background: "#0c1e35", border: "1px solid rgba(201,154,60,0.35)", borderRadius: "1rem", padding: "2rem", display: "grid", gridTemplateColumns: "1fr auto", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#f0cf82", margin: "0 0 0.4rem" }}>Rust Layer 1 Blockchain</p>
            <h2 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "clamp(1.3rem, 3vw, 1.9rem)", fontWeight: 700, color: "#f1f5f9", margin: "0 0 0.65rem" }}>
              Troptions Settlement Network (TSN)
            </h2>
            <p style={{ color: "#94a3b8", lineHeight: 1.65, margin: "0 0 1.25rem", maxWidth: 560 }}>
              A purpose-built Rust blockchain with 27 crates covering consensus, cross-chain bridges (XRPL + Stellar), RWA, NFTs, post-quantum crypto, compliance, and governance. All 8 brand entities are embedded in the genesis manifest.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
              {["consensus", "bridge-xrpl", "bridge-stellar", "rwa", "compliance", "pq-crypto", "governance", "genesis", "+19 more"].map((c) => (
                <span key={c} style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.72rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#94a3b8", padding: "0.25rem 0.6rem", borderRadius: "0.35rem" }}>{c}</span>
              ))}
            </div>
            <div style={{ marginTop: "1.25rem", display: "flex", flexWrap: "wrap", gap: "0.65rem" }}>
              <a href="https://github.com/FTHTrading/Troptions-L1" target="_blank" rel="noreferrer noopener"
                style={{ background: "#c99a3c", color: "#111827", padding: "0.6rem 1.15rem", borderRadius: "0.55rem", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none" }}>
                View on GitHub ↗
              </a>
              <Link href="/troptions/chains"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#cbd5e1", padding: "0.6rem 1.15rem", borderRadius: "0.55rem", fontWeight: 600, fontSize: "0.85rem", textDecoration: "none" }}>
                Chain Status →
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

      {/* ── NAVIGATION ────────────────────────────────────────────────────── */}
      <section style={{ padding: "0 1.25rem 2.5rem", maxWidth: "1200px", margin: "0 auto" }}>
        <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#64748b", margin: "0 0 1rem" }}>Explore the Platform</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "0.75rem" }}>
          {NAV_CARDS.map((n) => (
            <Link key={n.href} href={n.href} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "0.85rem", padding: "1.1rem 1.25rem", textDecoration: "none", display: "block", transition: "border-color 0.15s" }}>
              <p style={{ fontSize: "1.1rem", margin: "0 0 0.45rem" }}>{n.icon}</p>
              <p style={{ fontWeight: 700, color: "#f1f5f9", fontSize: "0.9rem", margin: "0 0 0.3rem" }}>{n.title}</p>
              <p style={{ fontSize: "0.75rem", color: "#64748b", margin: 0, lineHeight: 1.5 }}>{n.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer style={{ padding: "0 1.25rem 3rem", maxWidth: "1200px", margin: "0 auto", borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "1.5rem", marginTop: "0.5rem" }}>
        <p style={{ fontSize: "0.72rem", color: "#475569", lineHeight: 1.7 }}>
          <strong style={{ color: "#64748b" }}>Disclaimer:</strong> TROPTIONS is not a bank, broker-dealer, exchange, custodian, or licensed financial institution. All on-chain data links to public blockchain explorers and can be independently verified. Token price and market cap are informational snapshots only and not financial advice. All Rust L1 simulation code is marked <code style={{ fontFamily: "monospace", background: "rgba(255,255,255,0.05)", padding: "0.1em 0.3em", borderRadius: "0.2em" }}>simulation_only: true</code>.
        </p>
      </footer>

    </div>
  );
}
'''

with open(DEST, "w", encoding="utf-8", newline="\n") as f:
    f.write(PAGE)

print(f"Written {len(PAGE)} chars to {DEST}")
