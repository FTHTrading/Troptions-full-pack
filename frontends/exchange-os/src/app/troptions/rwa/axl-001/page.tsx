import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TROPTIONS RWA Series 001 — Alexandrite Collateral Package",
  description:
    "Verification, custody, and financing workflow for a 2kg rough chrysoberyl/alexandrite. Evidence-anchored on XRPL with IPFS-locked appraisal hashes. Not a public investment offering.",
};

const ASSET = {
  id: "AXL-001",
  series: "TROPTIONS RWA Series 001",
  name: "Alexandrite Collateral Verification Package",
  asset_type: "Rough chrysoberyl / alexandrite",
  mass: "2,000 g (2 kg)",
  origin: "Disclosed to lender / custodian under NDA",
  custodian: "PENDING — vault assignment in process",
  insurer: "PENDING — binder under review",
  appraiser: "Independent third-party gemologist (report on file)",
};

const EVIDENCE = [
  { label: "Appraisal Document Hash (SHA-256)", value: "evidence-locked", status: "locked" },
  { label: "IPFS CID — Master Record",          value: "pending publication",  status: "draft" },
  { label: "XRPL Memo Anchor (attestation tx)", value: "pending submission",   status: "draft" },
  { label: "Custody Agreement",                  value: "in negotiation",       status: "draft" },
  { label: "Insurance Binder",                   value: "in review",            status: "draft" },
  { label: "SPV Formation",                      value: "structure drafted",    status: "draft" },
  { label: "Lender Term Sheet",                  value: "private — NDA only",   status: "draft" },
] as const;

const STATUS_LABELS = [
  { code: "draft",                fill: "#475569", desc: "Material exists, not yet sealed" },
  { code: "evidence locked",      fill: "#0ea5e9", desc: "Hash + IPFS published, immutable" },
  { code: "attestation pending",  fill: "#f59e0b", desc: "XRPL memo tx awaiting submission" },
  { code: "custody pending",      fill: "#a855f7", desc: "Vault + insurance not yet bound" },
  { code: "finance pending",      fill: "#22c55e", desc: "Lender review in progress" },
];

const WATERFALL = [
  { rank: 1, name: "Taxes & statutory withholdings",        bucket: "Mandatory" },
  { rank: 2, name: "Third-party hard costs (assay, appraisal, legal)", bucket: "Mandatory" },
  { rank: 3, name: "Custody & vault fees",                  bucket: "Operational" },
  { rank: 4, name: "Insurance premiums",                    bucket: "Operational" },
  { rank: 5, name: "Reserve account funding",               bucket: "Operational" },
  { rank: 6, name: "Lender interest & principal",           bucket: "Senior" },
  { rank: 7, name: "Operator / sponsor administration fee", bucket: "Operator" },
  { rank: 8, name: "Holder / participant distribution",     bucket: "Conditional — counsel-approved only" },
];

const REVENUE_MODELS = [
  {
    code: "A",
    name: "Facility / Collateral Monetization",
    desc: "Origination fee, diligence/package fee, sponsor/operator fee, monthly asset administration fee, success fee at facility close.",
    primary: true,
  },
  {
    code: "B",
    name: "Verification-as-a-Service",
    desc: "$2,500 – $25,000 per asset package + monthly evidence monitoring + custom XRPL/Stellar attestation setup + data-room hosting.",
  },
  {
    code: "C",
    name: "Restricted RWA Participation",
    desc: "Revenue-share, debt participation, asset participation, redeemable receipt, or membership access. Private, restricted, counsel-approved only.",
  },
  {
    code: "D",
    name: "Stack Licensing",
    desc: "License the AXLUSD/TROPTIONS RWA stack to gemstone owners, precious-metals dealers, RWA issuers, custodians, private lenders, family offices, asset-backed credit groups.",
  },
];

const BUILD_GATES = [
  "Signer authority confirmed and attested",
  "Issuer entity formed and KYC'd",
  "Custody agreement executed and vault confirmed",
  "Insurance binder issued and in force",
  "Legal structure (SPV + offering wrapper) reviewed by counsel",
  "Appraisal hash + IPFS CID + XRPL memo tx published",
  "Compliance review completed (FINRA / state / federal)",
];

const BG = "#070b18";
const PANEL = "#0c1223";
const ACCENT = "#c99a3c";
const ACCENT_SOFT = "#f0cf82";

export default function AXL001Page() {
  return (
    <main style={{ background: BG, minHeight: "100vh", color: "#e2e8f0", fontFamily: "var(--font-sans, ui-sans-serif, system-ui)" }}>
      {/* Hero */}
      <section style={{ borderBottom: "1px solid rgba(201,154,60,0.25)", padding: "3rem 1.5rem 2.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: ACCENT_SOFT, margin: 0 }}>
            TROPTIONS · RWA Registry · {ASSET.id}
          </p>
          <h1 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "clamp(2rem, 5vw, 3.4rem)", color: "#f1f5f9", margin: "0.6rem 0 1rem", lineHeight: 1.1 }}>
            {ASSET.series}
          </h1>
          <p style={{ fontSize: "1.15rem", color: "#cbd5e1", margin: "0 0 1.25rem", maxWidth: 820, lineHeight: 1.55 }}>
            {ASSET.name}. A verification, custody, and financing workflow for a physical gemstone asset — anchored on XRPL with SHA-256 + IPFS evidence and a controlled facility / SPV waterfall.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {STATUS_LABELS.map((s) => (
              <span key={s.code} style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", background: `${s.fill}22`, border: `1px solid ${s.fill}66`, color: s.fill === "#475569" ? "#94a3b8" : s.fill, padding: "0.25rem 0.6rem", borderRadius: "0.4rem" }}>
                {s.code}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Disclosure banner */}
      <section style={{ background: "#1a0a0a", borderBottom: "1px solid rgba(239,68,68,0.4)", padding: "1.25rem 1.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "#fca5a5", margin: "0 0 0.4rem" }}>
            Not for public investment
          </p>
          <p style={{ fontSize: "0.9rem", color: "#fecaca", margin: 0, lineHeight: 1.6, maxWidth: 900 }}>
            This asset package represents a verification, custody, and financing workflow for a physical gemstone asset. Minting or attestation does not itself create market value, liquidity, redemption rights, or investor returns. Any financing, token distribution, or payment waterfall requires executed legal documents, custody controls, insurance, compliance review, and approved counterparties. TROPTIONS is not a bank, broker-dealer, exchange, custodian, or licensed financial institution.
          </p>
        </div>
      </section>

      {/* Asset facts */}
      <section style={{ padding: "2.5rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "1.6rem", color: "#f1f5f9", margin: "0 0 1.25rem" }}>Asset facts</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.75rem" }}>
            {Object.entries(ASSET).map(([k, v]) => (
              <div key={k} style={{ background: PANEL, border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0.6rem", padding: "0.85rem 1rem" }}>
                <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#64748b", margin: "0 0 0.3rem" }}>{k.replace(/_/g, " ")}</p>
                <p style={{ fontSize: "0.92rem", color: "#e2e8f0", margin: 0, fontFamily: k === "id" ? "var(--font-mono, monospace)" : undefined }}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Evidence table */}
      <section style={{ padding: "2.5rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "1.6rem", color: "#f1f5f9", margin: "0 0 0.5rem" }}>Evidence ledger</h2>
          <p style={{ color: "#94a3b8", margin: "0 0 1.25rem", maxWidth: 760 }}>
            All evidence items below are anchored to the XRPL evidence rail when sealed. Pending items are kept in private review until counsel and custodian sign off.
          </p>
          <div style={{ background: PANEL, border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0.7rem", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ background: "rgba(201,154,60,0.08)", textAlign: "left" }}>
                  <th style={{ padding: "0.7rem 1rem", color: ACCENT_SOFT, fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Item</th>
                  <th style={{ padding: "0.7rem 1rem", color: ACCENT_SOFT, fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Value / state</th>
                  <th style={{ padding: "0.7rem 1rem", color: ACCENT_SOFT, fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {EVIDENCE.map((e, i) => (
                  <tr key={e.label} style={{ borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "0.7rem 1rem", color: "#cbd5e1" }}>{e.label}</td>
                    <td style={{ padding: "0.7rem 1rem", color: "#e2e8f0", fontFamily: "var(--font-mono, monospace)" }}>{e.value}</td>
                    <td style={{ padding: "0.7rem 1rem" }}>
                      <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", background: e.status === "locked" ? "#0ea5e922" : "#47556922", border: `1px solid ${e.status === "locked" ? "#0ea5e966" : "#47556966"}`, color: e.status === "locked" ? "#0ea5e9" : "#94a3b8", padding: "0.2rem 0.55rem", borderRadius: "0.35rem" }}>
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Waterfall */}
      <section style={{ padding: "2.5rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "1.6rem", color: "#f1f5f9", margin: "0 0 0.5rem" }}>Disbursement waterfall</h2>
          <p style={{ color: "#94a3b8", margin: "0 0 1.25rem", maxWidth: 760 }}>
            Order of payment from facility proceeds. No participant distribution occurs until senior items clear and counsel certifies the offering structure.
          </p>
          <div style={{ display: "grid", gap: "0.45rem" }}>
            {WATERFALL.map((w) => (
              <div key={w.rank} style={{ background: PANEL, border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0.55rem", padding: "0.75rem 1rem", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "1rem", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.85rem", fontWeight: 800, color: ACCENT_SOFT, minWidth: 28 }}>{String(w.rank).padStart(2, "0")}</span>
                <span style={{ color: "#e2e8f0" }}>{w.name}</span>
                <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: w.bucket.startsWith("Conditional") ? "#fca5a5" : "#94a3b8" }}>{w.bucket}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue models */}
      <section style={{ padding: "2.5rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "1.6rem", color: "#f1f5f9", margin: "0 0 1.25rem" }}>Monetization models</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.85rem" }}>
            {REVENUE_MODELS.map((r) => (
              <div key={r.code} style={{ background: PANEL, border: r.primary ? `1px solid ${ACCENT}66` : "1px solid rgba(255,255,255,0.08)", borderRadius: "0.7rem", padding: "1.1rem 1.2rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.7rem", fontWeight: 800, color: r.primary ? ACCENT_SOFT : "#94a3b8", background: r.primary ? `${ACCENT}22` : "rgba(255,255,255,0.05)", padding: "0.2rem 0.5rem", borderRadius: "0.3rem" }}>MODEL {r.code}</span>
                  {r.primary && <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: ACCENT_SOFT }}>Primary</span>}
                </div>
                <h3 style={{ color: "#f1f5f9", fontSize: "1rem", margin: "0 0 0.5rem" }}>{r.name}</h3>
                <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: 0, lineHeight: 1.55 }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Build gates */}
      <section style={{ padding: "2.5rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "1.6rem", color: "#f1f5f9", margin: "0 0 0.5rem" }}>Mint / issuance gates</h2>
          <p style={{ color: "#94a3b8", margin: "0 0 1.25rem", maxWidth: 760 }}>
            The token does not mint until every gate is locked. This is enforced at the issuer-signer layer.
          </p>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {BUILD_GATES.map((g, i) => (
              <div key={g} style={{ background: PANEL, border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0.5rem", padding: "0.7rem 1rem", display: "grid", gridTemplateColumns: "auto 1fr", gap: "0.85rem", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.75rem", fontWeight: 800, color: ACCENT_SOFT }}>G{String(i + 1).padStart(2, "0")}</span>
                <span style={{ color: "#cbd5e1" }}>{g}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Naming caveat */}
      <section style={{ padding: "2.5rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", background: "#0d1530", border: "1px solid rgba(245,158,11,0.35)", borderRadius: "0.7rem", padding: "1.25rem 1.5rem" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "#fbbf24", margin: "0 0 0.5rem" }}>Naming caveat</p>
          <p style={{ color: "#fde68a", fontSize: "0.92rem", margin: "0 0 0.6rem", lineHeight: 1.6 }}>
            The label <strong>AXLUSD</strong> can imply a USD-denominated stablecoin or cash-equivalent, which it is not. FINRA flags crypto communications that imply cash-equivalence. Within TROPTIONS this asset is referenced as <strong>{ASSET.id}</strong> / <strong>{ASSET.series}</strong>.
          </p>
          <p style={{ color: "#94a3b8", fontSize: "0.8rem", margin: 0 }}>
            Acceptable internal aliases: AXL-RWA, AXL-001, AXL-GEM, AXL-VAULT.
          </p>
        </div>
      </section>

      {/* Private packet */}
      <section style={{ padding: "2.5rem 1.5rem 3.5rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", background: PANEL, border: `1px solid ${ACCENT}55`, borderRadius: "0.8rem", padding: "1.5rem 1.6rem", textAlign: "center" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.14em", color: ACCENT_SOFT, margin: "0 0 0.6rem" }}>Private lender packet</p>
          <h3 style={{ color: "#f1f5f9", fontSize: "1.4rem", margin: "0 0 0.8rem" }}>Restricted distribution under NDA</h3>
          <p style={{ color: "#94a3b8", margin: "0 0 1.25rem", maxWidth: 640, marginInline: "auto", lineHeight: 1.6 }}>
            The full diligence package — appraisal, custody draft, SPV term sheet, waterfall agreement, attestation plan — is available to qualified lenders, custodians, and counsel under executed NDA.
          </p>
          <div style={{ display: "inline-flex", flexWrap: "wrap", gap: "0.6rem", justifyContent: "center" }}>
            <Link href="/troptions" style={{ background: ACCENT, color: "#111827", padding: "0.65rem 1.2rem", borderRadius: "0.5rem", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none" }}>
              Request diligence access
            </Link>
            <Link href="/troptions/layer1" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#cbd5e1", padding: "0.65rem 1.2rem", borderRadius: "0.5rem", fontWeight: 600, fontSize: "0.85rem", textDecoration: "none" }}>
              Layer 1 evidence rail
            </Link>
          </div>
        </div>
      </section>

      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "1.5rem", textAlign: "center", color: "#64748b", fontSize: "0.75rem" }}>
        TROPTIONS RWA Registry · Series 001 · {ASSET.id} · evidence rail XRPL · mirror rail Stellar (optional) · genesis IPFS-locked at ledger 103,872,749.
      </footer>
    </main>
  );
}
