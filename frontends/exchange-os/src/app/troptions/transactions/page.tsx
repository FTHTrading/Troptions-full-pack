import Link from "next/link";

export const metadata = {
  title: "TROPTIONS Transactions — Workflow Engine",
  description:
    "Browse 8 transaction categories, view due-diligence checklists, approval gates, and required documents.",
};

const CATEGORIES = [
  {
    id: "rwa_tokenisation",
    slug: "rwa-tokenisation",
    title: "RWA Tokenisation",
    icon: "RWA",
    color: "#c99a3c",
    description:
      "Tokenise a real-world asset (gemstones, real estate, equipment, art) into a TROPTIONS IOU or permissioned token. Requires appraisal, custody, SPV agreement, and securities law opinion.",
    documents: ["Independent Appraisal Report", "Custody Statement", "SPV / Legal Wrapper Agreement", "Insurance Certificate", "Securities Law Opinion"],
    gates: ["Control Hub Approval", "Legal Review", "Compliance Review", "Custody Verification", "Provider Approval"],
  },
  {
    id: "carbon_credit_sale",
    slug: "carbon-credit-sale",
    title: "Carbon Credit Sale",
    icon: "CO₂",
    color: "#16a34a",
    description:
      "Transfer verified, unretired carbon credits to a buyer. Credits must be registered in Verra VCS, Gold Standard, ACR, or equivalent.",
    documents: ["Registry Certificate (unretired)", "Third-Party Verification Report", "Proof of Registry Account Custody", "KYC for both parties"],
    gates: ["Control Hub Approval", "Compliance Review", "Provider Approval", "Oracle Attestation"],
  },
  {
    id: "carbon_credit_retirement",
    slug: "carbon-credit-retirement",
    title: "Carbon Credit Retirement",
    icon: "♻",
    color: "#059669",
    description:
      "Permanently retire carbon credits on behalf of a beneficiary. This action is irreversible — retired credits cannot be resold.",
    documents: ["Registry Certificate", "Signed Retirement Instruction", "Beneficiary Declaration", "KYC for instructing party"],
    gates: ["Control Hub Approval", "Compliance Review", "Oracle Attestation"],
  },
  {
    id: "btc_settlement",
    slug: "bitcoin-settlement",
    title: "Bitcoin Settlement",
    icon: "₿",
    color: "#f59e0b",
    description:
      "Record a Bitcoin settlement preference. TROPTIONS does not transmit Bitcoin; actual movement is handled by a licensed VASP. Travel Rule applies at $1,000+.",
    documents: ["Source of Funds Declaration", "Licensed Provider Instructions", "Wallet Risk Screening Report", "Travel Rule Package (≥$1,000)"],
    gates: ["Control Hub Approval", "Compliance Review", "KYC Cleared", "Sanctions Clear", "Travel Rule Submitted"],
  },
  {
    id: "collateral_pledge",
    slug: "collateral-pledge",
    title: "Collateral Pledge",
    icon: "🔒",
    color: "#6366f1",
    description:
      "Pledge a verified asset as collateral for a facility or agreement. Requires lender confirmation and pledge agreement.",
    documents: ["Pledge and Security Agreement", "Appraisal Report", "Custody Statement", "Lender Confirmation"],
    gates: ["Control Hub Approval", "Legal Review", "Compliance Review", "Provider Approval"],
  },
  {
    id: "equity_token_issuance",
    slug: "equity-token-issuance",
    title: "Equity Token Issuance",
    icon: "EQ",
    color: "#8b5cf6",
    description:
      "Issue equity-linked tokens representing economic rights in an entity. Requires securities law compliance and board approval.",
    documents: ["Operating Agreement", "UBO Declaration", "Business Registration", "Securities Law Opinion", "Board Resolution"],
    gates: ["Board Approval", "Legal Review", "Compliance Review", "Provider Approval"],
  },
  {
    id: "stablecoin_conversion",
    slug: "stablecoin-conversion",
    title: "Stablecoin Conversion",
    icon: "≋",
    color: "#0ea5e9",
    description:
      "Convert TROPTIONS IOUs to a GENIUS Act-compliant stablecoin. Gated by reserve verification, AML, and GENIUS Act status checks.",
    documents: ["Reserve Proof", "AML Certificate", "Issuer Authorisation", "GENIUS Act Compliance Declaration"],
    gates: ["GENIUS Act Gate", "Control Hub Approval", "Compliance Review", "Oracle Attestation"],
  },
  {
    id: "administrative_payment",
    slug: "administrative-payment",
    title: "Administrative Payment",
    icon: "PAY",
    color: "#94a3b8",
    description:
      "Internal administrative or fee payment within the TROPTIONS ecosystem. Requires KYC clearance and Control Hub sign-off.",
    documents: ["Payment Instruction", "KYC for both parties"],
    gates: ["Control Hub Approval", "KYC Cleared", "Sanctions Clear"],
  },
] as const;

export default function TransactionsHubPage() {
  return (
    <div style={{ background: "linear-gradient(160deg, #071426 0%, #0c1e35 60%, #071426 100%)", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 1.25rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <Link href="/troptions" style={{ fontSize: "0.8rem", color: "#64748b", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.35rem", marginBottom: "1rem" }}>
            ← TROPTIONS Home
          </Link>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#f0cf82", margin: "0 0 0.35rem" }}>Transaction Workflow Engine</p>
          <h1 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, color: "#f8fafc", margin: "0 0 0.75rem" }}>
            TROPTIONS Transaction Hub
          </h1>
          <p style={{ color: "#94a3b8", lineHeight: 1.65, maxWidth: 720, margin: "0 0 1.25rem", fontSize: "0.925rem" }}>
            Select a transaction category to view the full due-diligence checklist, required documents, approval gates, and workflow steps.
          </p>
        </div>

        {/* Quick links */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginBottom: "2.5rem" }}>
          {[
            { href: "/troptions/compliance/handbooks", label: "Transaction Handbooks" },
            { href: "/troptions/kyc", label: "KYC / Onboarding" },
            { href: "/troptions/xrpl-stellar-compliance", label: "Compliance" },
          ].map((l) => (
            <Link key={l.href} href={l.href} style={{ background: "rgba(201,154,60,0.1)", border: "1px solid rgba(201,154,60,0.3)", color: "#f0cf82", padding: "0.45rem 0.9rem", borderRadius: "2rem", fontSize: "0.8rem", fontWeight: 600, textDecoration: "none" }}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Category grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/troptions/transactions/${cat.slug}`}
              style={{ textDecoration: "none", display: "block", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1rem", padding: "1.4rem", transition: "border-color 0.15s" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "0.85rem" }}>
                <div style={{ width: 44, height: 44, borderRadius: "0.6rem", background: `${cat.color}22`, border: `1px solid ${cat.color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 800, color: cat.color, flexShrink: 0 }}>
                  {cat.icon}
                </div>
                <p style={{ fontWeight: 700, color: "#f1f5f9", margin: 0, fontSize: "0.975rem" }}>{cat.title}</p>
              </div>
              <p style={{ fontSize: "0.8rem", color: "#94a3b8", lineHeight: 1.6, margin: "0 0 1rem" }}>{cat.description}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.75rem" }}>
                {cat.gates.slice(0, 3).map((g) => (
                  <span key={g} style={{ background: "rgba(201,154,60,0.08)", border: "1px solid rgba(201,154,60,0.2)", color: "#d4a742", fontSize: "0.65rem", padding: "0.2rem 0.55rem", borderRadius: "2rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {g}
                  </span>
                ))}
                {cat.gates.length > 3 && (
                  <span style={{ background: "rgba(201,154,60,0.08)", border: "1px solid rgba(201,154,60,0.2)", color: "#d4a742", fontSize: "0.65rem", padding: "0.2rem 0.55rem", borderRadius: "2rem", fontWeight: 600 }}>
                    +{cat.gates.length - 3} more
                  </span>
                )}
              </div>
              <p style={{ fontSize: "0.72rem", color: cat.color, fontWeight: 700, margin: 0 }}>
                {cat.documents.length} required documents →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
