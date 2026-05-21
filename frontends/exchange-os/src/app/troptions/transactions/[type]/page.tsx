import Link from "next/link";

export const dynamic = "force-dynamic";

const CATALOG: Record<string, {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  requiredDocuments: string[];
  dueDiligenceSteps: string[];
  requiredApprovals: string[];
  handbookId: string;
}> = {
  rwa_tokenisation: {
    id: "rwa_tokenisation",
    title: "RWA Tokenisation",
    icon: "RWA",
    color: "#c99a3c",
    description: "Tokenise a real-world asset (gemstones, real estate, equipment, art) into a TROPTIONS IOU or permissioned token on XRPL. This transaction type carries the highest due diligence burden.",
    requiredDocuments: ["Independent Appraisal Report", "Custody Statement from licensed custodian", "SPV / Legal Wrapper Agreement", "Insurance Certificate", "Securities Law Opinion from qualified counsel", "UBO Declaration", "KYC for all parties", "Board Resolution (if entity)"],
    dueDiligenceSteps: ["Verify asset title and ownership chain", "Confirm appraiser independence and credentials", "Validate custody arrangement with licensed custodian", "Review SPV structure with legal counsel", "Obtain securities law opinion for relevant jurisdiction", "Confirm insurance coverage adequacy", "Complete KYC for all signatories and beneficial owners", "Control Hub review and sign-off"],
    requiredApprovals: ["Control Hub Approval", "Legal Review", "Compliance Review", "Custody Verification", "KYC Cleared", "Sanctions Clear", "Provider Approval"],
    handbookId: "rwa-tokenisation-handbook",
  },
  carbon_credit_sale: {
    id: "carbon_credit_sale",
    title: "Carbon Credit Sale",
    icon: "CO₂",
    color: "#16a34a",
    description: "Transfer verified, unretired carbon credits to a buyer. Credits must be registered with a recognised registry such as Verra VCS, Gold Standard, or ACR.",
    requiredDocuments: ["Registry Certificate (unretired credits)", "Third-Party Verification Report", "Proof of Registry Account Custody", "KYC for both buyer and seller", "Transfer Instruction Letter"],
    dueDiligenceSteps: ["Verify registry account ownership and custody", "Confirm credits are unretired and not double-counted", "Obtain third-party verification report", "Complete KYC for both parties", "Verify registry transfer capability", "Control Hub review"],
    requiredApprovals: ["Control Hub Approval", "Compliance Review", "Provider Approval", "Oracle Attestation"],
    handbookId: "carbon-credit-handbook",
  },
  carbon_credit_retirement: {
    id: "carbon_credit_retirement",
    title: "Carbon Credit Retirement",
    icon: "♻",
    color: "#059669",
    description: "Permanently retire carbon credits on behalf of a beneficiary. This action is irreversible. Retired credits cannot be resold or transferred.",
    requiredDocuments: ["Registry Certificate (unretired credits)", "Signed Retirement Instruction from authorised party", "Beneficiary Declaration", "KYC for instructing party", "Confirmation of instructing party authority"],
    dueDiligenceSteps: ["Confirm authorised party has capacity to instruct retirement", "Verify credits are unretired", "Obtain signed retirement instruction", "Confirm beneficiary identity and declaration", "Control Hub review"],
    requiredApprovals: ["Control Hub Approval", "Compliance Review", "Oracle Attestation"],
    handbookId: "carbon-credit-handbook",
  },
  btc_settlement: {
    id: "btc_settlement",
    title: "Bitcoin Settlement",
    icon: "₿",
    color: "#f59e0b",
    description: "Record a Bitcoin settlement preference. TROPTIONS does not transmit Bitcoin. Actual movement is handled by a licensed VASP. Travel Rule applies at $1,000 and above.",
    requiredDocuments: ["Source of Funds Declaration", "Licensed VASP Provider Instructions", "Wallet Risk Screening Report", "Travel Rule Package (required at $1,000+)", "KYC for both parties"],
    dueDiligenceSteps: ["Identify licensed VASP for execution", "Obtain source-of-funds documentation", "Screen wallet addresses against risk databases", "Prepare Travel Rule package if ≥$1,000", "Complete KYC for both parties", "Control Hub review"],
    requiredApprovals: ["Control Hub Approval", "Compliance Review", "KYC Cleared", "Sanctions Clear", "Travel Rule Submitted"],
    handbookId: "btc-settlement-handbook",
  },
  collateral_pledge: {
    id: "collateral_pledge",
    title: "Collateral Pledge",
    icon: "🔒",
    color: "#6366f1",
    description: "Pledge a verified asset as collateral for a facility, loan, or agreement. Requires lender confirmation, pledge agreement, and appraisal.",
    requiredDocuments: ["Pledge and Security Agreement", "Independent Appraisal Report", "Custody Statement", "Lender Confirmation Letter", "KYC for both parties", "Insurance Certificate"],
    dueDiligenceSteps: ["Confirm asset ownership and title", "Obtain independent appraisal", "Review and execute pledge agreement with legal counsel", "Obtain lender confirmation", "Verify custody arrangements", "Control Hub review"],
    requiredApprovals: ["Control Hub Approval", "Legal Review", "Compliance Review", "Custody Verification", "Provider Approval"],
    handbookId: "rwa-tokenisation-handbook",
  },
  equity_token_issuance: {
    id: "equity_token_issuance",
    title: "Equity Token Issuance",
    icon: "EQ",
    color: "#8b5cf6",
    description: "Issue equity-linked tokens representing economic rights in an entity. Requires securities law compliance, board approval, and comprehensive UBO disclosure.",
    requiredDocuments: ["Operating Agreement or Articles", "UBO Declaration with KYC for all >10% holders", "Business Registration Documents", "Securities Law Opinion", "Board Resolution authorising issuance", "Investor Disclosure Document"],
    dueDiligenceSteps: ["Obtain securities law opinion from qualified counsel", "Identify and KYC all beneficial owners above 10%", "Prepare and adopt board resolution", "Draft and review investor disclosure document", "Confirm jurisdiction regulatory requirements", "Control Hub review"],
    requiredApprovals: ["Board Approval", "Legal Review", "Compliance Review", "Provider Approval"],
    handbookId: "rwa-tokenisation-handbook",
  },
  stablecoin_conversion: {
    id: "stablecoin_conversion",
    title: "Stablecoin Conversion",
    icon: "≋",
    color: "#0ea5e9",
    description: "Convert TROPTIONS IOUs to a GENIUS Act-compliant stablecoin. This transaction is gated by reserve verification, AML controls, and GENIUS Act status checks.",
    requiredDocuments: ["Reserve Proof from licensed issuer", "AML Certificate", "Stablecoin Issuer Authorisation", "GENIUS Act Compliance Declaration", "KYC for converting party"],
    dueDiligenceSteps: ["Verify GENIUS Act compliance status", "Confirm reserve proof from licensed issuer", "Obtain AML certificate", "Confirm stablecoin issuer is authorised", "Control Hub review"],
    requiredApprovals: ["GENIUS Act Gate", "Control Hub Approval", "Compliance Review", "Oracle Attestation"],
    handbookId: "platform-overview-handbook",
  },
  administrative_payment: {
    id: "administrative_payment",
    title: "Administrative Payment",
    icon: "PAY",
    color: "#94a3b8",
    description: "Internal administrative or fee payment within the TROPTIONS ecosystem. Requires KYC clearance and Control Hub sign-off.",
    requiredDocuments: ["Payment Instruction", "KYC for both parties"],
    dueDiligenceSteps: ["Confirm payment purpose and authorisation", "Verify KYC for both parties", "Control Hub review"],
    requiredApprovals: ["Control Hub Approval", "KYC Cleared", "Sanctions Clear"],
    handbookId: "platform-overview-handbook",
  },
};

interface Props {
  params: Promise<{ type: string }>;
}

export default async function TransactionTypePage({ params }: Props) {
  const { type } = await params;
  const normalizedType = type.includes("-") ? type.replace(/-/g, "_") : type;
  const def = CATALOG[type] ?? CATALOG[normalizedType];

  if (!def) {
    return (
      <div style={{ background: "#071426", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#f87171", fontSize: "1.1rem", marginBottom: "1rem" }}>Transaction type not found.</p>
          <Link href="/troptions/transactions" style={{ color: "#f0cf82", textDecoration: "none", fontWeight: 600 }}>
            ← Back to Transaction Hub
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "linear-gradient(160deg, #071426 0%, #0c1e35 60%, #071426 100%)", minHeight: "100vh" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "3rem 1.25rem" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "1.75rem", fontSize: "0.8rem", color: "#64748b" }}>
          <Link href="/troptions" style={{ color: "#64748b", textDecoration: "none" }}>TROPTIONS</Link>
          <span>→</span>
          <Link href="/troptions/transactions" style={{ color: "#64748b", textDecoration: "none" }}>Transactions</Link>
          <span>→</span>
          <span style={{ color: "#94a3b8" }}>{def.title}</span>
        </div>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <div style={{ width: 54, height: 54, borderRadius: "0.7rem", background: `${def.color}22`, border: `1px solid ${def.color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 800, color: def.color, flexShrink: 0 }}>
            {def.icon}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#f0cf82", margin: "0 0 0.25rem" }}>Transaction Workflow</p>
            <h1 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 700, color: "#f8fafc", margin: 0 }}>
              {def.title}
            </h1>
          </div>
        </div>

        <p style={{ color: "#94a3b8", lineHeight: 1.65, maxWidth: 720, margin: "0 0 1.5rem", fontSize: "0.925rem" }}>
          {def.description}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>

          {/* Required Documents */}
          <section style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1rem", padding: "1.4rem" }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#f0cf82", margin: "0 0 0.85rem" }}>Required Documents</p>
            <ol style={{ paddingLeft: "1.25rem", margin: 0 }}>
              {def.requiredDocuments.map((doc) => (
                <li key={doc} style={{ fontSize: "0.83rem", color: "#e2e8f0", marginBottom: "0.55rem", lineHeight: 1.55 }}>{doc}</li>
              ))}
            </ol>
          </section>

          {/* Due Diligence Steps */}
          <section style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1rem", padding: "1.4rem" }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#f0cf82", margin: "0 0 0.85rem" }}>Due Diligence Steps</p>
            <ol style={{ paddingLeft: "1.25rem", margin: 0 }}>
              {def.dueDiligenceSteps.map((step) => (
                <li key={step} style={{ fontSize: "0.83rem", color: "#e2e8f0", marginBottom: "0.55rem", lineHeight: 1.55 }}>{step}</li>
              ))}
            </ol>
          </section>

          {/* Approval Gates */}
          <section style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1rem", padding: "1.4rem" }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#f0cf82", margin: "0 0 0.85rem" }}>Approval Gates</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
              {def.requiredApprovals.map((gate) => (
                <div key={gate} style={{ display: "flex", alignItems: "center", gap: "0.65rem", background: "rgba(201,154,60,0.06)", border: "1px solid rgba(201,154,60,0.18)", borderRadius: "0.45rem", padding: "0.55rem 0.75rem" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.8rem", color: "#d4a742", fontWeight: 600 }}>{gate}</span>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Handbook link */}
        <div style={{ marginTop: "2rem", background: "rgba(201,154,60,0.07)", border: "1px solid rgba(201,154,60,0.25)", borderRadius: "0.85rem", padding: "1.25rem 1.4rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p style={{ fontWeight: 700, color: "#f0cf82", margin: 0, fontSize: "0.9rem" }}>Download the Handbook</p>
            <p style={{ fontSize: "0.78rem", color: "#94a3b8", margin: "0.2rem 0 0" }}>Full due-diligence guide, checklist, and legal disclosures</p>
          </div>
          <a
            href={`/api/troptions/handbooks/${def.handbookId}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ background: "#c99a3c", color: "#111827", padding: "0.6rem 1.25rem", borderRadius: "0.5rem", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none", flexShrink: 0 }}
          >
            View Handbook
          </a>
        </div>

        {/* Footer */}
        <div style={{ marginTop: "2rem", display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/troptions/transactions" style={{ color: "#f0cf82", fontSize: "0.85rem", textDecoration: "none", fontWeight: 600 }}>
            ← All Transaction Categories
          </Link>
          <Link href="/troptions/kyc" style={{ color: "#94a3b8", fontSize: "0.85rem", textDecoration: "none" }}>
            KYC / Onboarding →
          </Link>
        </div>

      </div>
    </div>
  );
}
