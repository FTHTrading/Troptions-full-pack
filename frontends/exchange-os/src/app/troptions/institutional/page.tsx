import Link from "next/link";

export const metadata = {
  title: "Institutional Access | TROPTIONS",
  description:
    "Institutional-grade access to the TROPTIONS platform. Diligence room, RWA intake, token roles, compliance documentation, and partnership pathways.",
};

const G = {
  bg: "#FFFFFF", bg2: "#F8F7F4", bg3: "#F2F0EB",
  border: "#D6D1C8", border2: "#E8E4DC",
  text: "#1A1714", text2: "#5C574F", text3: "#8B857C",
  navy: "#1B3259", navyD: "#122040",
  green: "#1A5233", greenL: "#2D7A4F",
} as const;

const serif = "'Palatino Linotype','Book Antiqua',Georgia,serif";

const SECTIONS = [
  {
    title: "Platform Overview",
    desc: "Full summary of the TROPTIONS institutional operating stack, asset registry, module status, and proof infrastructure.",
    href: "/troptions/institutional/overview",
    tag: "Reference",
  },
  {
    title: "Diligence Room",
    desc: "Structured due diligence package. Entity documentation, proof-of-funds records, compliance status, and legal review queue.",
    href: "/troptions/institutional/diligence-room",
    tag: "Due Diligence",
  },
  {
    title: "RWA Access",
    desc: "Real-world asset registry access for institutional participants. Custody workflows, tokenization pathways, and on-chain settlement.",
    href: "/troptions/institutional/rwa",
    tag: "RWA",
  },
  {
    title: "Token Roles & Governance",
    desc: "TROPTIONS token role definitions, governance rights, trustline mechanics, and AMM participation structure.",
    href: "/troptions/institutional/token-roles",
    tag: "Governance",
  },
  {
    title: "Claims & Proof",
    desc: "Institutional claims documentation. On-chain issuance records, Chainlink-validated receipts, and wallet control proofs.",
    href: "/troptions/institutional/proof",
    tag: "Proof",
  },
  {
    title: "Risk & Compliance",
    desc: "Anti-IFT framework, chain-risk analysis, KYC/KYB pathways, and sanctions screening protocols.",
    href: "/troptions/institutional/risk",
    tag: "Compliance",
  },
  {
    title: "Partners & Merchant Network",
    desc: "Active merchant and partner network. Onboarding pathway, revenue sharing structure, and settlement mechanics.",
    href: "/troptions/institutional/merchant-network",
    tag: "Partners",
  },
  {
    title: "Legal Disclosures",
    desc: "Full disclosure package. Regulatory status, disclaimers, and legal review items for institutional review.",
    href: "/troptions/institutional/disclosures",
    tag: "Legal",
  },
  {
    title: "Gold Reserve Program",
    desc: "TROPTIONS gold-backed asset program documentation and reserve access pathway.",
    href: "/troptions/institutional/gold",
    tag: "Assets",
  },
  {
    title: "Unity Token",
    desc: "Unity coordination token mechanics, issuance parameters, and ecosystem role.",
    href: "/troptions/institutional/unity",
    tag: "Assets",
  },
  {
    title: "Institutional Pay",
    desc: "Payment rails for institutional transactions. XRPL, Stellar, and stablecoin settlement pathways.",
    href: "/troptions/institutional/pay",
    tag: "Payments",
  },
  {
    title: "Audit Room",
    desc: "Internal audit trail access for authorized institutional counterparties.",
    href: "/troptions/institutional/audit-room",
    tag: "Audit",
  },
  {
    title: "Claims Review",
    desc: "Live claims status — verified, blocked, and pending evidence.",
    href: "/troptions/institutional/claims",
    tag: "Review",
  },
];

export default function InstitutionalIndexPage() {
  return (
    <div style={{ background: G.bg, color: G.text, minHeight: "100vh", fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif" }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${G.border}`, padding: "3rem 2rem 2.5rem", background: G.bg }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <p style={{ fontSize: "0.72rem", letterSpacing: "0.28em", color: G.text3, textTransform: "uppercase", marginBottom: "0.75rem" }}>
            <Link href="/troptions" style={{ color: G.text3, textDecoration: "none" }}>TROPTIONS</Link>
            {" / "}Institutional
          </p>
          <h1 style={{ fontFamily: serif, fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 400, color: G.navyD, marginBottom: "1rem", lineHeight: 1.2 }}>
            Institutional Access
          </h1>
          <p style={{ fontSize: "1rem", lineHeight: 1.8, color: G.text2, maxWidth: 620 }}>
            The TROPTIONS institutional platform provides structured access to diligence materials, proof documentation, RWA workflows, and partnership pathways. Select a section below or{" "}
            <Link href="/troptions/contact?service=institutional_access" style={{ color: G.navy, textDecoration: "underline" }}>
              submit an inquiry
            </Link>
            {" "}to reach the team directly.
          </p>
        </div>
      </div>

      {/* Section Grid */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "3rem 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "1.25rem" }}>
          {SECTIONS.map(s => (
            <Link
              key={s.title}
              href={s.href}
              style={{ display: "block", border: `1px solid ${G.border}`, padding: "1.5rem", background: G.bg, textDecoration: "none", transition: "border-color 0.15s" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.6rem" }}>
                <h3 style={{ fontFamily: serif, fontSize: "1rem", color: G.navyD, lineHeight: 1.3 }}>{s.title}</h3>
                <span style={{ fontSize: "0.65rem", color: G.text3, textTransform: "uppercase", letterSpacing: "0.1em", border: `1px solid ${G.border2}`, padding: "0.15rem 0.45rem", whiteSpace: "nowrap", marginLeft: "0.5rem" }}>{s.tag}</span>
              </div>
              <p style={{ fontSize: "0.85rem", lineHeight: 1.6, color: G.text2, margin: 0 }}>{s.desc}</p>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginTop: "3rem", borderTop: `1px solid ${G.border}`, paddingTop: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link href="/troptions/contact?service=institutional_access" style={{ background: G.navy, color: "#fff", padding: "0.75rem 2rem", fontSize: "0.88rem", fontWeight: 600, textDecoration: "none", borderRadius: 3 }}>
            Submit Institutional Inquiry
          </Link>
          <Link href="/portal/troptions/dashboard" style={{ border: `1px solid ${G.navy}`, color: G.navy, padding: "0.75rem 2rem", fontSize: "0.88rem", textDecoration: "none", borderRadius: 3 }}>
            Client Portal
          </Link>
          <Link href="/troptions/verification" style={{ color: G.text2, padding: "0.75rem 1.25rem", fontSize: "0.88rem", textDecoration: "underline" }}>
            Proof of Issuance
          </Link>
        </div>
      </div>
    </div>
  );
}
