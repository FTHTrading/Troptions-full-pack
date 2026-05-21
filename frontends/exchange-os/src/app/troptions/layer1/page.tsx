// =============================================================================
// TROPTIONS LAYER 1 - The Sovereign Rust Chain
// POPEYE -> TEV -> CONSENSUS -> MARS -> TAR
// 27 Rust crates. Closed-loop execution organism. Private + public lanes.
// Creator economy + NIL + television rights all settle here.
// =============================================================================

import Link from "next/link";

export const metadata = {
  title: "Troptions Layer 1 - Rust Sovereign Chain",
  description:
    "The Troptions Rust Layer 1: POPEYE network, TEV cryptographic gate, CONSENSUS BFT finality, MARS runtime brain, TAR persistence. 27 crates powering creator Web3, NIL, RWA and television rights settlement.",
};

// 5-stage execution pipeline - the closed loop
const PIPELINE = [
  {
    code: "POPEYE",
    role: "Network / P2P",
    one: "Eyes & ears",
    desc:
      "libp2p gossipsub fabric. Propagates transactions and blocks across the validator mesh. Hears rumors from the outside world. Never mutates state. If POPEYE goes blind, the chain stops hearing - it does not start lying.",
    crates: ["popeye-net", "popeye-gossip", "rln"],
  },
  {
    code: "TEV",
    role: "Cryptographic Gate",
    one: "Customs border",
    desc:
      "Every payload that POPEYE delivers is held at TEV until its Ed25519 signature is verified, its nonce is sane, and its replay window is fresh. TEV refuses bad packets before the runtime ever sees them. Post-quantum lane (pq-crypto) lives next to it.",
    crates: ["crypto", "pq-crypto"],
  },
  {
    code: "CONSENSUS",
    role: "BFT Finality",
    one: "The vote",
    desc:
      "Deterministic round-robin leader election with weighted 2/3+ quorum, finality certificates and slashing. Validators commit. Forks die at the certificate boundary. No probabilistic finality - finality is a signed object.",
    crates: ["consensus", "governance"],
  },
  {
    code: "MARS",
    role: "Runtime Brain",
    one: "Pure state machine",
    desc:
      "Canonical balances, nonces, block production, RWA registry, NIL registry, AMM math, namespace bindings. Pure function: same input, same output, on every node. If MARS says no, the network does not matter. The runtime is the constitution.",
    crates: ["runtime", "state", "amm", "rwa", "nil", "nft", "trustlines", "stablecoin", "brands", "agora"],
  },
  {
    code: "TAR",
    role: "Persistence",
    one: "Black box",
    desc:
      "Atomic, crash-safe block and state storage. Append-only log + periodic snapshots + continuity checks. The chain can be killed mid-block - TAR comes back identical. Receipts and audit trails for compliance and discovery live here.",
    crates: ["state", "telemetry"],
  },
] as const;

// All 27 crates organized by tier
const CRATE_MAP = [
  {
    tier: "Network & Transport",
    items: [
      { name: "node",      desc: "Validator + RPC entrypoint (the binary)" },
      { name: "rpc",       desc: "JSON-RPC + WebSocket public API" },
      { name: "sdk",       desc: "Client SDK for wallets, dapps, services" },
      { name: "cli",       desc: "Operator + treasury command-line tool" },
      { name: "telemetry", desc: "Metrics, logs, observability" },
    ],
  },
  {
    tier: "Security & Crypto",
    items: [
      { name: "crypto",    desc: "Ed25519, hashing, key management" },
      { name: "pq-crypto", desc: "Post-quantum signature lane" },
      { name: "rln",       desc: "Rate-limiting nullifiers - anti-spam at the network edge" },
    ],
  },
  {
    tier: "Consensus & Runtime",
    items: [
      { name: "consensus",  desc: "BFT engine, leader election, finality" },
      { name: "runtime",    desc: "MARS - the pure state machine" },
      { name: "state",      desc: "Canonical state tree, snapshots, TAR persistence" },
      { name: "governance", desc: "On-chain proposals, parameter changes, validator set" },
    ],
  },
  {
    tier: "Assets & Markets",
    items: [
      { name: "assets",     desc: "Native asset model and balance accounting" },
      { name: "trustlines", desc: "Issuer / holder trust graph (XRPL-compatible semantics)" },
      { name: "amm",        desc: "Native AMM math and pool accounts" },
      { name: "stablecoin", desc: "Stablecoin issuance + collateral guard rails" },
      { name: "agora",      desc: "Order book / DEX matching engine" },
    ],
  },
  {
    tier: "Real World & Identity",
    items: [
      { name: "rwa",     desc: "Real-world asset registry, attestations, custody links" },
      { name: "nil",     desc: "Name / Image / Likeness rights tokenization for creators" },
      { name: "nft",     desc: "NFT primitives - editions, royalties, provenance" },
      { name: "brands",  desc: "Eight Troptions brand entities pinned in genesis" },
    ],
  },
  {
    tier: "Cross-Chain & Control",
    items: [
      { name: "bridge-xrpl",    desc: "XRPL settlement bridge (issuer / AMM mirror)" },
      { name: "bridge-stellar", desc: "Stellar settlement bridge" },
      { name: "mbridge",        desc: "Multi-chain message bridge primitives" },
      { name: "compliance",     desc: "AML, sanctions, jurisdiction policy hooks" },
      { name: "control-hub",    desc: "Operator control plane: approvals, alerts, kill-switches" },
      { name: "genesis",        desc: "Locked genesis manifest + 8-brand bindings" },
    ],
  },
] as const;

// What the L1 actually settles - the surface that users / partners see
const SETTLES = [
  {
    icon: "TV",
    title: "Television & Content Creator Web3",
    desc:
      "Episode rights, ad inventory, viewer rewards, creator payouts and audience equity all settle on the L1. Content packages move as native objects, not opaque IOUs.",
  },
  {
    icon: "NIL",
    title: "NIL Rights",
    desc:
      "Athletes, artists and creators tokenize Name / Image / Likeness rights. The nil crate defines the canonical schema - revenue splits, license terms and revocations are state transitions.",
  },
  {
    icon: "RWA",
    title: "Real World Assets",
    desc:
      "Off-chain assets attested through the rwa crate with custody / audit pointers. Compliance hooks fire before transfer - not after.",
  },
  {
    icon: "AMM",
    title: "Native AMM + Order Book",
    desc:
      "amm + agora crates run pools and matching natively. XRPL bridge mirrors flows so liquidity is provable on a public ledger.",
  },
  {
    icon: "USDF",
    title: "Stablecoin Lane",
    desc:
      "stablecoin crate enforces collateral, issuance, redemption and circuit breakers - separate from the speculative TROPTIONS unit.",
  },
  {
    icon: "PRV",
    title: "Private Lane",
    desc:
      "Selective-disclosure transactions, post-quantum signatures, and rate-limiting nullifiers (rln) gate the private path. Public XRPL/Stellar lanes mirror only what is meant to be public.",
  },
] as const;

// Trust boundaries - the non-negotiables
const BOUNDARIES = [
  "POPEYE never mutates state. Network nodes are eyes, not judges.",
  "TEV refuses unsigned or replayed payloads. No exceptions, no allow-list.",
  "MARS is a pure function. Determinism is the only acceptable outcome.",
  "TAR is append-only. The history of the chain is not editable.",
  "Genesis is locked. The 8 brand entities and the 100M TROPTIONS supply are pinned.",
  "Bridges are mirrors, not sources of truth. The L1 is the source.",
] as const;

const ISSUER = "rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ";

export default function Layer1Page() {
  return (
    <div style={{ background: "linear-gradient(160deg, #071426 0%, #0c1e35 60%, #071426 100%)", minHeight: "100vh", color: "#e6eef9" }}>

      {/* HERO */}
      <section style={{ padding: "4rem 1.25rem 2.5rem", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ fontSize: "0.75rem", letterSpacing: "0.25em", color: "#c99a3c", textTransform: "uppercase", marginBottom: "0.75rem" }}>
          Troptions Sovereign Layer 1
        </div>
        <h1 style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", lineHeight: 1.05, margin: 0, color: "#f0cf82" }}>
          POPEYE &middot; TEV &middot; CONSENSUS &middot; MARS &middot; TAR
        </h1>
        <p style={{ marginTop: "1.25rem", fontSize: "1.125rem", color: "#bcd0e8", maxWidth: 820, lineHeight: 1.55 }}>
          A purpose-built Rust blockchain - 27 crates - architected as a closed-loop execution organism with strict trust boundaries between hearing, verifying, deciding, executing and remembering. Television rights, content-creator Web3, NIL, RWA, AMM and stablecoin all settle here. Public XRPL and Stellar are bridge mirrors. The L1 is the source of truth.
        </p>
        <div style={{ marginTop: "1.75rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link href="/troptions" style={{ background: "#c99a3c", color: "#111827", padding: "0.65rem 1.25rem", borderRadius: "0.6rem", fontWeight: 700, fontSize: "0.875rem", textDecoration: "none" }}>
            &larr; Back to Troptions Hub
          </Link>
          <a href={`https://bithomp.com/explorer/${ISSUER}`} target="_blank" rel="noreferrer noopener" style={{ background: "transparent", color: "#f0cf82", border: "1px solid rgba(240,207,130,0.4)", padding: "0.65rem 1.25rem", borderRadius: "0.6rem", fontWeight: 700, fontSize: "0.875rem", textDecoration: "none" }}>
            Verify XRPL Mirror &rarr;
          </a>
        </div>
      </section>

      {/* PIPELINE */}
      <section style={{ padding: "1rem 1.25rem 3rem", maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ fontSize: "1.5rem", color: "#f0cf82", margin: "0 0 0.5rem" }}>The Closed Loop</h2>
        <p style={{ color: "#9fb3cd", margin: "0 0 1.5rem", maxWidth: 760 }}>
          Each stage has one job. Crossing a boundary requires explicit verification. There is no fallback path that lets a bad packet reach the runtime.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
          {PIPELINE.map((p, i) => (
            <div key={p.code} style={{ background: "rgba(12,30,53,0.7)", border: "1px solid rgba(201,154,60,0.25)", borderRadius: "0.85rem", padding: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.4rem" }}>
                <span style={{ fontSize: "0.7rem", color: "#7e94ad" }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#f0cf82", letterSpacing: "0.05em" }}>{p.code}</span>
              </div>
              <div style={{ fontSize: "0.8rem", color: "#c99a3c", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>{p.role}</div>
              <div style={{ fontSize: "0.85rem", color: "#bcd0e8", fontStyle: "italic", marginBottom: "0.6rem" }}>&ldquo;{p.one}&rdquo;</div>
              <p style={{ fontSize: "0.875rem", color: "#d6e2f2", lineHeight: 1.55, margin: "0 0 0.75rem" }}>{p.desc}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                {p.crates.map((c) => (
                  <span key={c} style={{ background: "rgba(201,154,60,0.12)", color: "#f0cf82", border: "1px solid rgba(201,154,60,0.3)", borderRadius: "0.4rem", padding: "0.2rem 0.5rem", fontSize: "0.7rem", fontFamily: "ui-monospace,monospace" }}>{c}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT IT SETTLES */}
      <section style={{ padding: "1rem 1.25rem 3rem", maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ fontSize: "1.5rem", color: "#f0cf82", margin: "0 0 1rem" }}>What the L1 Settles</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.85rem" }}>
          {SETTLES.map((s) => (
            <div key={s.title} style={{ background: "rgba(12,30,53,0.6)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "0.75rem", padding: "1.1rem" }}>
              <div style={{ display: "inline-block", background: "rgba(201,154,60,0.18)", color: "#f0cf82", padding: "0.2rem 0.55rem", borderRadius: "0.4rem", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", marginBottom: "0.55rem" }}>{s.icon}</div>
              <h3 style={{ fontSize: "1rem", color: "#f0cf82", margin: "0 0 0.35rem" }}>{s.title}</h3>
              <p style={{ fontSize: "0.85rem", color: "#bcd0e8", margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CRATE MAP */}
      <section style={{ padding: "1rem 1.25rem 3rem", maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ fontSize: "1.5rem", color: "#f0cf82", margin: "0 0 0.5rem" }}>Crate Map &middot; 27 Modules</h2>
        <p style={{ color: "#9fb3cd", margin: "0 0 1.5rem", maxWidth: 760 }}>
          Every crate has a single, named responsibility. No crate may import upward across a trust boundary.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
          {CRATE_MAP.map((tier) => (
            <div key={tier.tier} style={{ background: "rgba(12,30,53,0.55)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "0.75rem", padding: "1rem" }}>
              <div style={{ fontSize: "0.7rem", letterSpacing: "0.18em", color: "#c99a3c", textTransform: "uppercase", marginBottom: "0.65rem" }}>{tier.tier}</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {tier.items.map((it) => (
                  <li key={it.name} style={{ marginBottom: "0.5rem" }}>
                    <code style={{ color: "#f0cf82", fontFamily: "ui-monospace,monospace", fontSize: "0.85rem" }}>{it.name}</code>
                    <span style={{ color: "#bcd0e8", fontSize: "0.8rem", marginLeft: "0.4rem" }}>&mdash; {it.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST BOUNDARIES */}
      <section style={{ padding: "1rem 1.25rem 4rem", maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ fontSize: "1.5rem", color: "#f0cf82", margin: "0 0 1rem" }}>Trust Boundaries (Non-Negotiable)</h2>
        <div style={{ background: "rgba(12,30,53,0.7)", border: "1px solid rgba(201,154,60,0.3)", borderRadius: "0.85rem", padding: "1.25rem 1.25rem 1.25rem 2.5rem" }}>
          <ol style={{ margin: 0, color: "#d6e2f2", fontSize: "0.95rem", lineHeight: 1.7 }}>
            {BOUNDARIES.map((b) => <li key={b}>{b}</li>)}
          </ol>
        </div>
      </section>

      {/* FOOTER LINKS */}
      <section style={{ padding: "0 1.25rem 4rem", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          <Link href="/troptions" style={{ color: "#f0cf82", textDecoration: "none", border: "1px solid rgba(240,207,130,0.3)", padding: "0.55rem 1rem", borderRadius: "0.5rem", fontSize: "0.85rem" }}>Troptions Hub</Link>
          <Link href="/troptions/xrpl-platform" style={{ color: "#f0cf82", textDecoration: "none", border: "1px solid rgba(240,207,130,0.3)", padding: "0.55rem 1rem", borderRadius: "0.5rem", fontSize: "0.85rem" }}>XRPL Platform</Link>
          <Link href="/troptions/wallets" style={{ color: "#f0cf82", textDecoration: "none", border: "1px solid rgba(240,207,130,0.3)", padding: "0.55rem 1rem", borderRadius: "0.5rem", fontSize: "0.85rem" }}>Live Wallets</Link>
          <Link href="/troptions/ecosystem" style={{ color: "#f0cf82", textDecoration: "none", border: "1px solid rgba(240,207,130,0.3)", padding: "0.55rem 1rem", borderRadius: "0.5rem", fontSize: "0.85rem" }}>Ecosystem (NIL / Brands)</Link>
        </div>
        <p style={{ marginTop: "1.5rem", fontSize: "0.75rem", color: "#7e94ad", maxWidth: 820, lineHeight: 1.6 }}>
          Disclosure: The Troptions Layer 1 is a sovereign Rust codebase under active development. Public ledger mirrors on XRPL and Stellar are the only externally verifiable surfaces today. Troptions is not a bank, broker-dealer, exchange, custodian, or licensed financial institution. Genesis manifest IPFS-locked at ledger 103,872,749.
        </p>
      </section>
    </div>
  );
}
