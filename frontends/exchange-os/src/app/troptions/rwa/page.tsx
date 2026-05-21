import Link from "next/link";

export const metadata = {
  title: "Real-World Assets (RWA) | TROPTIONS",
  description:
    "TROPTIONS RWA platform: real-world asset tokenization, custody workflows, XRPL and Stellar settlement, carbon credits, real estate, and institutional asset registry.",
};

const G = {
  bg: "#FFFFFF", bg2: "#F8F7F4", bg3: "#F2F0EB",
  border: "#D6D1C8", border2: "#E8E4DC",
  text: "#1A1714", text2: "#5C574F", text3: "#8B857C",
  navy: "#1B3259", navyD: "#122040",
  green: "#1A5233",
} as const;

const serif = "'Palatino Linotype','Book Antiqua',Georgia,serif";

const ASSET_CLASSES = [
  { name: "Real Estate",    desc: "Commercial and residential real estate denominated in TROPTIONS. Transfer, escrow, and settlement on XRPL.",         href: "/troptions/real-estate" },
  { name: "Solar Energy",   desc: "Solar energy asset tokenization. RECs, project ownership, and revenue share on-chain.",                              href: "/troptions/solar" },
  { name: "Carbon Credits", desc: "Voluntary carbon credit issuance, registry, and AMM-based trading. Chainlink oracle integration.",                  href: "/troptions/carbon" },
  { name: "Custody",        desc: "Institutional custody framework. Multi-sig, time-lock, and escrow for tokenized assets.",                            href: "/troptions/custody" },
  { name: "SBLC / Banking", desc: "Standby Letter of Credit workflows and correspondent banking rail integration for RWA settlement.",                  href: "/portal/troptions/sblc" },
  { name: "RWA Readiness",  desc: "Readiness checklist for institutions seeking to deploy real-world assets through the TROPTIONS infrastructure.",    href: "/troptions/rwa-readiness" },
];

export default function RwaPage() {
  return (
    <div style={{ background: G.bg, color: G.text, minHeight: "100vh", fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif" }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${G.border}`, padding: "3rem 2rem 2.5rem" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <p style={{ fontSize: "0.72rem", letterSpacing: "0.28em", color: G.text3, textTransform: "uppercase", marginBottom: "0.75rem" }}>
            <Link href="/troptions" style={{ color: G.text3, textDecoration: "none" }}>TROPTIONS</Link>
            {" / "}Real-World Assets
          </p>
          <h1 style={{ fontFamily: serif, fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 400, color: G.navyD, marginBottom: "1rem", lineHeight: 1.2 }}>
            Real-World Asset Platform
          </h1>
          <p style={{ fontSize: "1rem", lineHeight: 1.8, color: G.text2, maxWidth: 640 }}>
            TROPTIONS provides infrastructure for tokenizing, settling, and custodying real-world assets on the XRP Ledger and Stellar Network. From real estate to carbon credits, every asset class connects to the same proof-backed, compliance-screened settlement layer.
          </p>
        </div>
      </div>

      {/* Asset Classes */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "3rem 2rem" }}>
        <h2 style={{ fontFamily: serif, fontSize: "1.2rem", color: G.navyD, marginBottom: "1.5rem" }}>Asset Classes Supported</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "1.25rem", marginBottom: "3rem" }}>
          {ASSET_CLASSES.map(a => (
            <div key={a.name} style={{ border: `1px solid ${G.border}`, padding: "1.5rem", background: G.bg }}>
              <h3 style={{ fontFamily: serif, fontSize: "1rem", color: G.navyD, marginBottom: "0.5rem" }}>{a.name}</h3>
              <p style={{ fontSize: "0.87rem", lineHeight: 1.65, color: G.text2, marginBottom: "0.85rem" }}>{a.desc}</p>
              <Link href={a.href} style={{ color: G.navy, fontSize: "0.82rem", textDecoration: "underline" }}>Learn more</Link>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div style={{ border: `1px solid ${G.border}`, padding: "2rem", background: G.bg2, marginBottom: "2rem" }}>
          <h2 style={{ fontFamily: serif, fontSize: "1.1rem", color: G.navyD, marginBottom: "1.25rem" }}>Settlement Stack</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
            <tbody>
              {[
                { k: "Issuance Layer",    v: "XRPL IOU issuance — Circle, Tether, MakerDAO, and TROPTIONS-branded IOUs" },
                { k: "Settlement Layer",  v: "XRPL DEX + AMM + Stellar liquidity pools" },
                { k: "Custody Layer",     v: "Multi-sig vault, time-lock escrow, Chainlink-validated receipts" },
                { k: "Compliance Layer",  v: "Anti-IFT screening, KYC/KYB, wallet forensics, sanctions check" },
                { k: "Proof Layer",       v: "On-chain TX hashes, Chainlink oracle attestation, wallet control proofs" },
                { k: "Reporting Layer",   v: "Impact reports, custody statements, audit trail exports" },
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
          <Link href="/troptions/contact?service=rwa_tokenization" style={{ background: G.navy, color: "#fff", padding: "0.7rem 1.75rem", fontSize: "0.88rem", fontWeight: 600, textDecoration: "none", borderRadius: 3 }}>
            RWA Onboarding Inquiry
          </Link>
          <Link href="/troptions/rwa-readiness" style={{ border: `1px solid ${G.navy}`, color: G.navy, padding: "0.7rem 1.75rem", fontSize: "0.88rem", textDecoration: "none", borderRadius: 3 }}>
            Readiness Checklist
          </Link>
          <Link href="/portal/troptions/rwa" style={{ color: G.text2, padding: "0.7rem 1.25rem", fontSize: "0.88rem", textDecoration: "underline" }}>
            RWA Portal →
          </Link>
        </div>
      </div>
    </div>
  );
}
