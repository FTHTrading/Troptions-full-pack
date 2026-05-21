import Link from "next/link";

export const metadata = { title: "Documentation — TROPTIONS Live DEX" };

const SECTIONS = [
  {
    title: "Trading on XRPL",
    items: [
      { q: "How does trading work?", a: "TROPTIONS uses the XRPL native decentralized exchange. When you place a trade, the platform constructs an unsigned transaction blob (OfferCreate or Payment with pathfinding). Your wallet signs and submits it. TROPTIONS never holds your keys." },
      { q: "What is an unsigned transaction?", a: "An unsigned transaction is a fully formed XRPL transaction with all fields populated, but without a cryptographic signature. You review it, then sign and submit using your own wallet (XUMM, Crossmark, etc.). This means TROPTIONS can never move your funds without your explicit wallet approval." },
      { q: "What are AMM pools?", a: "Automated Market Makers on XRPL hold two-asset liquidity pools. Trades route through them when the AMM offers better pricing than the order book, or the platform can split across both. AMM liquidity providers earn a share of swap fees." },
    ],
  },
  {
    title: "Wallet & Reserves",
    items: [
      { q: "What is the XRPL base reserve?", a: "Every XRPL account must hold at least 1 XRP as a base reserve. This is set by XRPL network governance and may change. Additionally, each owned object (trustline, offer, AMM LP position) requires 0.2 XRP in owner reserve." },
      { q: "Does TROPTIONS hold my wallet?", a: "No. TROPTIONS is a non-custodial platform. We construct transaction blobs for you to sign. Your private keys remain in your wallet at all times." },
      { q: "What wallets are supported?", a: "Any XRPL-compatible wallet that can sign and submit transactions. XUMM and Crossmark are the most common. You can also use a hardware wallet via compatible signing tools." },
    ],
  },
  {
    title: "Token Launches",
    items: [
      { q: "How do I launch a token on XRPL?", a: "Use the Launch Wizard at /exchange-os/launch. It walks you through: (1) token details, (2) issuer wallet setup, (3) trustline configuration, (4) AMM liquidity setup, (5) generating a launch proof packet." },
      { q: "What is a proof packet?", a: "A proof packet is a verifiable, downloadable document that records your launch details: issuer address, token hex code, liquidity events, and trustline transactions. It is signed and timestamped so holders can verify your token was launched legitimately." },
      { q: "Are all tokens verified?", a: "No. Tokens display one of four labels: Verified (issuer completed verification), Caution (unreviewed), Mainnet Disabled (simulation only), or Trustline Required. Always check the issuer label before trading." },
    ],
  },
  {
    title: "x402 Intelligence",
    items: [
      { q: "What is x402?", a: "x402 is an HTTP payment protocol that enables pay-per-use API access. On TROPTIONS, x402 powers premium reports: token risk scans, launch readiness checks, issuer audits, and market intelligence — paid per request, no subscription needed." },
      { q: "What currency is used for x402 payments?", a: "x402 payments use ATP (Apostle Chain) or other supported assets routed through the x402 facilitator. See /exchange-os/x402 for current pricing." },
    ],
  },
];

export default function DocsPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2.5rem 1.5rem 4rem" }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: "1.5rem", display: "flex", gap: "0.5rem", fontSize: "0.78rem" }}>
        <Link href="/exchange-os" style={{ color: "var(--xos-gold)", textDecoration: "none" }}>← DEX Home</Link>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <div className="xos-gold-line" style={{ marginBottom: "0.75rem" }} />
        <h1 style={{ fontWeight: 900, fontSize: "1.8rem", color: "var(--xos-text)", marginBottom: "0.5rem" }}>Documentation</h1>
        <p style={{ color: "var(--xos-text-muted)", fontSize: "0.9rem", lineHeight: 1.65 }}>
          How TROPTIONS Live DEX works — trading, wallets, launches, and x402 intelligence rails.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--xos-gold)", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {section.title}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {section.items.map(({ q, a }) => (
                <div key={q} className="xos-card" style={{ padding: "1.1rem 1.25rem" }}>
                  <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--xos-text)", marginBottom: "0.4rem" }}>{q}</div>
                  <div style={{ fontSize: "0.82rem", color: "var(--xos-text-muted)", lineHeight: 1.65 }}>{a}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="xos-risk-box" style={{ marginTop: "2.5rem" }}>
        Documentation reflects current platform behavior and may change as the XRPL network evolves.
        Reserve requirements are set by XRPL governance and are subject to change.
      </div>
    </div>
  );
}
