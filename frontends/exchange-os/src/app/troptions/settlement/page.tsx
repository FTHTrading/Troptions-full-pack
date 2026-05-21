import Link from "next/link";

export const metadata = {
  title: "Settlement Infrastructure | TROPTIONS",
  description:
    "TROPTIONS multi-chain settlement: XRPL, Stellar, Apostle Chain, and EVM rails. Stablecoin settlement, SBLC issuance, and cross-chain bridge documentation.",
};

const G = {
  bg: "#FFFFFF", bg2: "#F8F7F4", bg3: "#F2F0EB",
  border: "#D6D1C8", border2: "#E8E4DC",
  text: "#1A1714", text2: "#5C574F", text3: "#8B857C",
  navy: "#1B3259", navyD: "#122040",
  green: "#1A5233",
} as const;

const serif = "'Palatino Linotype','Book Antiqua',Georgia,serif";

const RAILS = [
  {
    name: "XRP Ledger (XRPL)",
    role: "Primary settlement rail",
    details: "USDC, USDT, DAI, EURC issuance via Circle, Tether, MakerDAO, and TROPTIONS issuers. AMM-based liquidity, DEX settlement, and escrow. Finality in 3–5 seconds.",
    status: "Operational",
    href: "/troptions/xrpl-platform",
  },
  {
    name: "Stellar Network",
    role: "Secondary settlement rail",
    details: "Parallel stablecoin issuance and bridge target for XRPL IOUs. Institutional liquidity pool access and cross-border payment pathways.",
    status: "Operational",
    href: "/troptions/verification",
  },
  {
    name: "Apostle Chain (ATP)",
    role: "Sovereign L1 — micro-settlement",
    details: "Rust/Axum chain at chain_id 7332. Ultra-low latency micro-transaction settlement for agent-to-agent, merchant, and RWA transfers. Ed25519 signed TxEnvelopes.",
    status: "Operational",
    href: "/troptions/layer1",
  },
  {
    name: "EVM / Ethereum",
    role: "Smart contract layer",
    details: "TroptionsGatewayVault and TroptionsUSDCVault contracts. USDC vault, gateway settlement, and EVM-XRPL bridge settlement layer.",
    status: "Contracts Deployed",
    href: "/troptions/institutional/proof",
  },
  {
    name: "Solana",
    role: "High-throughput SPL rail",
    details: "SPL token issuance pathway and wallet integration. Connected to x402 micropayment mesh for agent-based payment flows.",
    status: "Integrated",
    href: "/troptions/institutional",
  },
  {
    name: "x402 Mesh Pay",
    role: "HTTP micropayment protocol",
    details: "RFC x402-based machine-to-machine payment protocol. Agent wallets, heartbeat settlement, and instant proof receipts via Apostle Chain.",
    status: "Operational",
    href: "/troptions/stablecoins",
  },
];

export default function SettlementPage() {
  return (
    <div style={{ background: G.bg, color: G.text, minHeight: "100vh", fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif" }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${G.border}`, padding: "3rem 2rem 2.5rem" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <p style={{ fontSize: "0.72rem", letterSpacing: "0.28em", color: G.text3, textTransform: "uppercase", marginBottom: "0.75rem" }}>
            <Link href="/troptions" style={{ color: G.text3, textDecoration: "none" }}>TROPTIONS</Link>
            {" / "}Settlement
          </p>
          <h1 style={{ fontFamily: serif, fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 400, color: G.navyD, marginBottom: "1rem", lineHeight: 1.2 }}>
            Settlement Infrastructure
          </h1>
          <p style={{ fontSize: "1rem", lineHeight: 1.8, color: G.text2, maxWidth: 640 }}>
            TROPTIONS operates multi-chain settlement across six rails. Every settlement path is proof-backed with on-chain TX hashes, Chainlink-validated custody receipts, and verifiable wallet control. No off-chain claims without on-chain evidence.
          </p>
        </div>
      </div>

      {/* Rails */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "3rem 2rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "3rem" }}>
          {RAILS.map(r => (
            <div key={r.name} style={{ border: `1px solid ${G.border}`, padding: "1.5rem 1.75rem", background: G.bg, display: "flex", gap: "2rem", alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 380px" }}>
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "0.35rem" }}>
                  <h3 style={{ fontFamily: serif, fontSize: "1rem", color: G.navyD, margin: 0 }}>{r.name}</h3>
                  <span style={{ fontSize: "0.68rem", color: G.text3, textTransform: "uppercase", letterSpacing: "0.1em" }}>{r.role}</span>
                </div>
                <p style={{ fontSize: "0.88rem", lineHeight: 1.65, color: G.text2, margin: 0 }}>{r.details}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem", flexShrink: 0 }}>
                <span style={{ fontSize: "0.68rem", color: G.green, border: `1px solid ${G.green}`, padding: "0.15rem 0.5rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {r.status}
                </span>
                <Link href={r.href} style={{ color: G.navy, fontSize: "0.82rem", textDecoration: "underline", whiteSpace: "nowrap" }}>
                  View docs →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Key metrics */}
        <div style={{ border: `1px solid ${G.border}`, padding: "2rem", background: G.bg2, marginBottom: "2rem" }}>
          <h2 style={{ fontFamily: serif, fontSize: "1.1rem", color: G.navyD, marginBottom: "1.25rem" }}>Settlement Parameters</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
            <tbody>
              {[
                { k: "XRPL Finality",          v: "3–5 seconds, deterministic" },
                { k: "Stellar Finality",        v: "5 seconds, deterministic" },
                { k: "Apostle Chain Finality",  v: "Sub-50ms tick, fast-path settlement + block confirmation" },
                { k: "EVM Finality",            v: "Ethereum mainnet — ~12 second block time" },
                { k: "Stablecoins Settled",     v: "USDC, USDT, DAI, EURC — all XRPL IOU issuances verified on-chain" },
                { k: "Proof Method",            v: "On-chain TX hashes + Chainlink oracle attestation" },
              ].map(r => (
                <tr key={r.k} style={{ borderBottom: `1px solid ${G.border2}` }}>
                  <td style={{ padding: "0.65rem 1rem 0.65rem 0", color: G.text3, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>{r.k}</td>
                  <td style={{ padding: "0.65rem 0", color: G.text }}>{r.v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link href="/troptions/contact?service=settlement" style={{ background: G.navy, color: "#fff", padding: "0.7rem 1.75rem", fontSize: "0.88rem", fontWeight: 600, textDecoration: "none", borderRadius: 3 }}>
            Settlement Inquiry
          </Link>
          <Link href="/troptions/verification" style={{ border: `1px solid ${G.navy}`, color: G.navy, padding: "0.7rem 1.75rem", fontSize: "0.88rem", textDecoration: "none", borderRadius: 3 }}>
            Proof of Issuance
          </Link>
          <Link href="/portal/troptions/dashboard" style={{ color: G.text2, padding: "0.7rem 1.25rem", fontSize: "0.88rem", textDecoration: "underline" }}>
            Client Portal →
          </Link>
        </div>
      </div>
    </div>
  );
}
