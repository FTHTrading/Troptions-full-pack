import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Minted on Solana — UNYKORN / TROPTIONS / DONK AI Ecosystem",
  description:
    "All confirmed minted Solana assets across the UNYKORN, TROPTIONS, and DONK AI ecosystem. On-chain proofs verifiable via Solscan and Solana Explorer.",
};

const MINT_ADDRESS_GOATX = "9VJQV99t9vaY5vpMkMW3xRyxfhirDfbJXb7ymCpjQMSv";

const MINTED_ASSETS = [
  {
    id: "goatx",
    name: "GoatX",
    ticker: "$GOATX",
    mintAddress: MINT_ADDRESS_GOATX,
    network: "Solana Mainnet",
    supply: "1,000,000,000",
    decimals: 9,
    mintAuthority: "Revoked",
    freezeAuthority: "Revoked",
    launchDate: "May 12, 2026",
    launcher: "Donk X SPL Launcher",
    site: "https://goat.unykorn.org",
    siteLabel: "goat.unykorn.org",
    description:
      "GoatX Gen 2 SPL token. 1B fixed supply with both mint and freeze authorities permanently revoked on-chain. NFT reward vault bridged from Polygon. AI agents running on Apostle chain-7332.",
    aiAgents: ["Market Maker (chain-7332)", "Volume Engine (apostle-chain)", "Finn Family Agent (sovereign-local)", "Treasury Guard (multisig-gated)"],
    accentColor: "#00ff88",
    badge: "LIVE",
  },
];

const ECOSYSTEM_SYSTEMS = [
  {
    id: "troptions-launcher",
    name: "TROPTIONS Campaign Launcher",
    ticker: null,
    network: "Solana Mainnet",
    mintStatus: "Active namespaces",
    description: "DONK AI-powered campaign launcher for merchant namespaces, fan NFTs, QR campaigns, and VIP passes.",
    site: "https://launch.unykorn.org",
    siteLabel: "launch.unykorn.org",
    accentColor: "#c99a3c",
    badge: "LIVE",
  },
  {
    id: "donk-ai",
    name: "DONK AI Campaign Engine",
    ticker: null,
    network: "Solana / Multi-chain",
    mintStatus: "Active",
    description: "AI-driven campaign creation and distribution system powering TROPTIONS sports activations.",
    site: "https://troptions.unykorn.org",
    siteLabel: "troptions.unykorn.org",
    accentColor: "#a855f7",
    badge: "LIVE",
  },
  {
    id: "unykorn",
    name: "UNYKORN Namespace Registry",
    ticker: null,
    network: "Multi-chain",
    mintStatus: "Operational",
    description: "UNYKORN namespace registry powering all *.unykorn.org domains, x402 payment rails, and AI agent coordination.",
    site: "https://portfolio.unykorn.org",
    siteLabel: "portfolio.unykorn.org",
    accentColor: "#00d4ff",
    badge: "LIVE",
  },
];

function SolscanBadge({ address }: { address: string }) {
  return (
    <a
      href={`https://solscan.io/token/${address}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all hover:opacity-80"
      style={{ background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.25)", color: "#00ff88" }}
    >
      <span>Solscan</span>
      <span style={{ opacity: 0.6 }}>↗</span>
    </a>
  );
}

function ExplorerBadge({ address }: { address: string }) {
  return (
    <a
      href={`https://explorer.solana.com/address/${address}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all hover:opacity-80"
      style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)", color: "#00d4ff" }}
    >
      <span>Explorer</span>
      <span style={{ opacity: 0.6 }}>↗</span>
    </a>
  );
}

export default function MintedPage() {
  return (
    <div style={{ background: "#050508", minHeight: "100vh", color: "#e8e8f0", fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(5,5,8,0.92)", backdropFilter: "blur(20px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/sports" style={{ fontWeight: 700, fontSize: "0.95rem", color: "#e8e8f0", textDecoration: "none" }}>
            ← TROPTIONS
          </Link>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <Link href="/sports/mint-demo" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", textDecoration: "none", fontWeight: 600 }}>
              Mint Demo
            </Link>
            <Link href="/sports/solana-launcher" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", textDecoration: "none", fontWeight: 600 }}>
              Builder
            </Link>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 24px 120px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <div style={{ display: "inline-block", padding: "4px 14px", borderRadius: 6, background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.2)", fontSize: "0.72rem", fontFamily: "monospace", color: "#00ff88", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>
            // On-Chain Registry
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 20 }}>
            Minted on Solana
          </h1>
          <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.45)", maxWidth: 560, margin: "0 auto 16px", lineHeight: 1.7 }}>
            UNYKORN · TROPTIONS · DONK AI Ecosystem
          </p>
          <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.25)", maxWidth: 680, margin: "0 auto", lineHeight: 1.7, fontStyle: "italic" }}>
            These are utility tokens, campaign assets, fan collectibles, and community digital assets. Not investments, securities, prediction markets, wagering products, or financial instruments of any kind. All on-chain proofs are verifiable via Solscan and Solana Explorer.
          </p>
        </div>

        {/* GoatX — Featured minted token */}
        <section style={{ marginBottom: 72 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
            <span style={{ fontSize: "0.72rem", fontFamily: "monospace", color: "#00ff88", textTransform: "uppercase", letterSpacing: "0.12em" }}>// Confirmed Minted SPL Tokens</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
          </div>

          {MINTED_ASSETS.map((asset) => (
            <div
              key={asset.id}
              style={{
                background: "#0d0d14",
                border: `1px solid rgba(0,255,136,0.18)`,
                borderRadius: 16,
                padding: "32px 36px",
                marginBottom: 24,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Badge */}
              <div style={{ position: "absolute", top: 20, right: 20 }}>
                <span style={{ padding: "3px 10px", borderRadius: 5, background: "rgba(0,255,136,0.12)", border: "1px solid rgba(0,255,136,0.3)", fontSize: "0.65rem", fontFamily: "monospace", fontWeight: 700, color: "#00ff88", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  {asset.badge}
                </span>
              </div>

              {/* Token header */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <h2 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.02em" }}>{asset.name}</h2>
                  <span style={{ fontSize: "1rem", color: "#00ff88", fontWeight: 700, fontFamily: "monospace" }}>{asset.ticker}</span>
                </div>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", lineHeight: 1.6, maxWidth: 620 }}>{asset.description}</p>
              </div>

              {/* Token details grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 28 }}>
                {[
                  { label: "Network", value: asset.network },
                  { label: "Total Supply", value: asset.supply },
                  { label: "Decimals", value: String(asset.decimals) },
                  { label: "Mint Authority", value: asset.mintAuthority, alert: asset.mintAuthority === "Revoked" },
                  { label: "Freeze Authority", value: asset.freezeAuthority, alert: asset.freezeAuthority === "Revoked" },
                  { label: "Launch Date", value: asset.launchDate },
                  { label: "Launcher", value: asset.launcher },
                ].map((item) => (
                  <div key={item.label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "12px 16px" }}>
                    <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 5, fontFamily: "monospace" }}>{item.label}</div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 700, color: item.alert ? "#00ff88" : "#e8e8f0" }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Mint address */}
              <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "14px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "monospace", flexShrink: 0 }}>Mint Address</span>
                <code style={{ fontSize: "0.78rem", color: "#00d4ff", fontFamily: "monospace", wordBreak: "break-all", flex: 1 }}>
                  {asset.mintAddress}
                </code>
              </div>

              {/* Verify links */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
                <SolscanBadge address={asset.mintAddress} />
                <ExplorerBadge address={asset.mintAddress} />
                <a
                  href={asset.site}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all hover:opacity-80"
                  style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)", color: "#a855f7", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}
                >
                  {asset.siteLabel} ↗
                </a>
              </div>

              {/* AI Agents */}
              {asset.aiAgents && (
                <div>
                  <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "monospace", marginBottom: 10 }}>AI Agents</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {asset.aiAgents.map((agent) => (
                      <span key={agent} style={{ padding: "4px 12px", borderRadius: 6, background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.15)", fontSize: "0.72rem", color: "#00d4ff", fontFamily: "monospace" }}>
                        {agent}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Ecosystem systems */}
        <section style={{ marginBottom: 72 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
            <span style={{ fontSize: "0.72rem", fontFamily: "monospace", color: "#a855f7", textTransform: "uppercase", letterSpacing: "0.12em" }}>// Active Ecosystem Systems</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            {ECOSYSTEM_SYSTEMS.map((sys) => (
              <div
                key={sys.id}
                style={{ background: "#0d0d14", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "24px 26px", position: "relative" }}
              >
                <div style={{ position: "absolute", top: 16, right: 16 }}>
                  <span style={{ padding: "2px 8px", borderRadius: 4, background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.2)", fontSize: "0.6rem", fontFamily: "monospace", fontWeight: 700, color: "#00ff88", textTransform: "uppercase" }}>
                    {sys.badge}
                  </span>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: 4 }}>{sys.name}</h3>
                  <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>{sys.network}</span>
                </div>
                <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.6, marginBottom: 16 }}>{sys.description}</p>
                <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.25)", marginBottom: 12, fontFamily: "monospace" }}>
                  Status: <span style={{ color: "#00ff88" }}>{sys.mintStatus}</span>
                </div>
                <a
                  href={sys.site}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "0.72rem", color: sys.accentColor, fontWeight: 700, textDecoration: "none", fontFamily: "monospace" }}
                >
                  {sys.siteLabel} ↗
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* CTA links */}
        <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 48, textAlign: "center" }}>
          <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.4)", marginBottom: 28 }}>
            Ready to mint your own campaign asset?
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/sports/mint-demo"
              style={{ padding: "12px 28px", background: "#00ff88", color: "#000", borderRadius: 10, fontWeight: 700, fontSize: "0.88rem", textDecoration: "none", display: "inline-block" }}
            >
              See How Easy It Is →
            </Link>
            <Link
              href="/sports/solana-launcher"
              style={{ padding: "12px 28px", background: "transparent", color: "#e8e8f0", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 10, fontWeight: 700, fontSize: "0.88rem", textDecoration: "none", display: "inline-block" }}
            >
              Full Campaign Builder
            </Link>
          </div>
        </section>
      </main>

      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "32px 24px", textAlign: "center" }}>
        <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.2)", maxWidth: 700, margin: "0 auto", lineHeight: 1.7, fontFamily: "monospace" }}>
          These are utility tokens, campaign assets, fan collectibles, and community digital assets. Not investments, securities, prediction markets, wagering products, or financial instruments of any kind. All on-chain proofs are verifiable via Solscan and Solana Explorer.
        </p>
        <p style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.12)", marginTop: 12, fontFamily: "monospace", letterSpacing: "0.1em" }}>
          ◆ UNYKORN · TROPTIONS · DONK AI · Last verified: 2026-05-15
        </p>
      </footer>
    </div>
  );
}
