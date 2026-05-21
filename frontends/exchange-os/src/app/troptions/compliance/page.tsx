import Link from "next/link";

export const metadata = {
  title: "Compliance Framework | TROPTIONS",
  description:
    "TROPTIONS compliance infrastructure: Anti-IFT framework, KYC/KYB workflows, wallet forensics, sanctions screening, chain-risk analysis, and regulatory documentation.",
};

const G = {
  bg: "#FFFFFF", bg2: "#F8F7F4", bg3: "#F2F0EB",
  border: "#D6D1C8", border2: "#E8E4DC",
  text: "#1A1714", text2: "#5C574F", text3: "#8B857C",
  navy: "#1B3259", navyD: "#122040",
  green: "#1A5233",
} as const;

const serif = "'Palatino Linotype','Book Antiqua',Georgia,serif";

const PILLARS = [
  {
    title: "Anti-Illicit Finance (Anti-IFT)",
    desc: "Transaction monitoring and pattern detection framework covering XRPL, Stellar, EVM, and Solana chains. Flags structuring, layering, and integration-stage activity.",
    href: "/troptions/anti-illicit-finance",
    status: "Operational",
  },
  {
    title: "KYC / Identity Verification",
    desc: "Client identity verification workflow. Document collection, liveness check integration path, and status tracking via the client portal.",
    href: "/portal/troptions/kyc",
    status: "Operational",
  },
  {
    title: "KYB / Entity Verification",
    desc: "Business entity verification covering UBO disclosure, registration records, and sanctions screening for legal entities.",
    href: "/portal/troptions/kyb",
    status: "Operational",
  },
  {
    title: "Wallet Forensics",
    desc: "On-chain forensics for XRPL, Stellar, and EVM wallets. Funds-flow analysis, exchange deposit detection, risk scoring, and investigation case management.",
    href: "/troptions/wallet-forensics",
    status: "Operational",
  },
  {
    title: "Chain Risk Assessment",
    desc: "Cross-chain risk summary covering network health, counterparty exposure, and IOU trustline risk concentration.",
    href: "/troptions/chain-risk",
    status: "Operational",
  },
  {
    title: "XRPL / Stellar Compliance Screen",
    desc: "Issuer address screening, trustline risk review, and on-chain compliance checks for XRPL and Stellar transactions.",
    href: "/troptions/xrpl-stellar-compliance",
    status: "Operational",
  },
  {
    title: "Sanctions Screening",
    desc: "OFAC, EU, UN sanctions list screening integrated into KYC and transaction review workflows.",
    href: "/portal/troptions/kyc",
    status: "Integrated in KYC",
  },
  {
    title: "Regulatory Documentation",
    desc: "Compliance disclosures, legal review queue status, and institutional disclosure package.",
    href: "/troptions/institutional/disclosures",
    status: "Available",
  },
];

export default function CompliancePage() {
  return (
    <div style={{ background: G.bg, color: G.text, minHeight: "100vh", fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif" }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${G.border}`, padding: "3rem 2rem 2.5rem" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <p style={{ fontSize: "0.72rem", letterSpacing: "0.28em", color: G.text3, textTransform: "uppercase", marginBottom: "0.75rem" }}>
            <Link href="/troptions" style={{ color: G.text3, textDecoration: "none" }}>TROPTIONS</Link>
            {" / "}Compliance
          </p>
          <h1 style={{ fontFamily: serif, fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 400, color: G.navyD, marginBottom: "1rem", lineHeight: 1.2 }}>
            Compliance Framework
          </h1>
          <p style={{ fontSize: "1rem", lineHeight: 1.8, color: G.text2, maxWidth: 640 }}>
            TROPTIONS operates a multi-layer compliance infrastructure covering identity verification, on-chain forensics, anti-illicit finance monitoring, and cross-chain risk assessment. Every component is documented and verifiable.
          </p>
        </div>
      </div>

      {/* Pillars */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "3rem 2rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {PILLARS.map(p => (
            <div key={p.title} style={{ border: `1px solid ${G.border}`, padding: "1.5rem 1.75rem", background: G.bg, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "2rem", flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 400px" }}>
                <h3 style={{ fontFamily: serif, fontSize: "1rem", color: G.navyD, marginBottom: "0.4rem" }}>{p.title}</h3>
                <p style={{ fontSize: "0.88rem", lineHeight: 1.65, color: G.text2, margin: 0 }}>{p.desc}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem", flexShrink: 0 }}>
                <span style={{ fontSize: "0.68rem", color: G.green, border: `1px solid ${G.green}`, padding: "0.15rem 0.5rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {p.status}
                </span>
                <Link href={p.href} style={{ color: G.navy, fontSize: "0.82rem", textDecoration: "underline", whiteSpace: "nowrap" }}>
                  View →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Summary table */}
        <div style={{ marginTop: "3rem", padding: "2rem", background: G.bg2, border: `1px solid ${G.border}` }}>
          <h2 style={{ fontFamily: serif, fontSize: "1.1rem", color: G.navyD, marginBottom: "1.25rem" }}>Compliance at a Glance</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
            <tbody>
              {[
                { k: "Identity Verification", v: "KYC + KYB — portal-based intake, status tracking" },
                { k: "Transaction Monitoring", v: "Anti-IFT framework — multi-chain, pattern detection" },
                { k: "Wallet Risk Scoring", v: "XRPL/Stellar/EVM — forensic funds-flow analysis" },
                { k: "Sanctions Screening", v: "OFAC, EU, UN — integrated in KYC workflow" },
                { k: "Chain Risk", v: "Cross-chain exposure and IOU concentration monitoring" },
                { k: "Regulatory Docs", v: "Institutional disclosure package — available on request" },
              ].map(r => (
                <tr key={r.k} style={{ borderBottom: `1px solid ${G.border2}` }}>
                  <td style={{ padding: "0.6rem 1rem 0.6rem 0", color: G.text3, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>{r.k}</td>
                  <td style={{ padding: "0.6rem 0", color: G.text }}>{r.v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link href="/troptions/contact?service=compliance" style={{ background: G.navy, color: "#fff", padding: "0.7rem 1.75rem", fontSize: "0.88rem", fontWeight: 600, textDecoration: "none", borderRadius: 3 }}>
            Compliance Inquiry
          </Link>
          <Link href="/troptions/institutional/disclosures" style={{ border: `1px solid ${G.navy}`, color: G.navy, padding: "0.7rem 1.75rem", fontSize: "0.88rem", textDecoration: "none", borderRadius: 3 }}>
            Legal Disclosures
          </Link>
        </div>
      </div>
    </div>
  );
}
