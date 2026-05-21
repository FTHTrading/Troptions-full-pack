import Link from "next/link";

export const metadata = { title: "Risk Disclosures — TROPTIONS Live DEX" };

const RISKS = [
  {
    title: "Token Trading Risk",
    body: "Trading XRPL tokens, including TROPTIONS, involves significant financial risk. Token prices can fall to zero. Past performance is not indicative of future results. Never trade more than you can afford to lose entirely.",
  },
  {
    title: "New Asset Risk",
    body: "Tokens launched through TROPTIONS Exchange OS are new, unaudited assets. Even tokens with a proof packet have not been reviewed by any financial regulator. Issuer verification confirms on-chain setup, not the legitimacy or value of the project.",
  },
  {
    title: "Liquidity Risk",
    body: "XRPL AMM pools and order books may have thin liquidity. Large trades may result in significant price impact (slippage). In periods of low liquidity, you may not be able to sell a position at any price.",
  },
  {
    title: "Smart Contract / Protocol Risk",
    body: "XRPL AMM pools are governed by the XRPL protocol. While XRPL is a mature and established ledger, protocol upgrades, bugs, or validator failures could affect your positions. TROPTIONS has no control over the XRPL protocol.",
  },
  {
    title: "Reserve Requirement Risk",
    body: "XRPL account reserves (currently 1 XRP base + 0.2 XRP per owned object) are locked and cannot be spent while you hold the associated trustlines or offers. If XRPL governance increases reserves, you may need to fund your wallet further.",
  },
  {
    title: "Unsigned Transaction Risk",
    body: "TROPTIONS constructs unsigned transaction blobs for you to sign. You are responsible for reviewing every transaction before signing. TROPTIONS cannot reverse submitted transactions. Always verify the transaction fields in your wallet before approving.",
  },
  {
    title: "x402 Payment Risk",
    body: "x402 payments are per-request and non-refundable. Reports generated via x402 are informational only and do not constitute financial advice or a guarantee of token quality.",
  },
  {
    title: "Demo Mode Risk",
    body: "When the platform is running in demo mode, all prices, volumes, and balances are simulated. Do not make financial decisions based on demo data. The platform indicates its mode clearly on every page.",
  },
  {
    title: "Regulatory Risk",
    body: "Digital asset regulation is evolving rapidly. TROPTIONS is a non-custodial protocol and does not provide brokerage, investment advisory, or exchange services. You are responsible for understanding and complying with the laws in your jurisdiction.",
  },
  {
    title: "No Financial Advice",
    body: "Nothing on this platform constitutes financial, investment, legal, or tax advice. Always consult qualified professionals before making financial decisions.",
  },
];

export default function RiskPage() {
  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "2.5rem 1.5rem 4rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <Link href="/exchange-os" style={{ fontSize: "0.78rem", color: "var(--xos-gold)", textDecoration: "none" }}>← DEX Home</Link>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <div style={{ height: 3, width: 48, background: "var(--xos-red)", borderRadius: 2, marginBottom: "0.75rem" }} />
        <h1 style={{ fontWeight: 900, fontSize: "1.8rem", color: "var(--xos-text)", marginBottom: "0.5rem" }}>Risk Disclosures</h1>
        <p style={{ color: "var(--xos-text-muted)", fontSize: "0.9rem", lineHeight: 1.65 }}>
          Read these disclosures carefully before using TROPTIONS Live DEX. Digital asset trading involves substantial risk of loss.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", marginBottom: "2rem" }}>
        {RISKS.map(({ title, body }) => (
          <div key={title} className="xos-card" style={{ padding: "1.1rem 1.25rem" }}>
            <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--xos-text)", marginBottom: "0.4rem" }}>{title}</div>
            <div style={{ fontSize: "0.82rem", color: "var(--xos-text-muted)", lineHeight: 1.65 }}>{body}</div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "rgba(239,68,68,0.08)",
          border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: "var(--xos-radius)",
          padding: "1.1rem 1.25rem",
        }}
      >
        <p style={{ fontSize: "0.82rem", color: "#fca5a5", lineHeight: 1.65, margin: 0 }}>
          <strong>By using TROPTIONS Live DEX you acknowledge that you have read, understood, and accepted all risk disclosures above.</strong>{" "}
          This platform is provided as-is with no warranty of fitness for a particular purpose. Use at your own risk.
        </p>
      </div>
    </div>
  );
}
