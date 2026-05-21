import Link from "next/link";
import { PDF_DOCUMENT_REGISTRY, type PdfDocumentRecord } from "@/lib/troptions/pdfDocumentRegistry";

export const metadata = {
  title: "TROPTIONS Professional PDF Handbooks & Due Diligence Packets",
  description:
    "Download professional PDF handbooks and due diligence packets for TROPTIONS transactions: RWA, KYC, funding routes, XRPL IOUs, PATE-COAL-001, and more.",
};

const CATEGORY_ORDER = [
  "Core Platform",
  "Onboarding / KYC",
  "RWA / Asset Packages",
  "Funding Routes",
  "XRPL / IOU / Wallets",
  "Legacy / Buyback / LP Review",
  "PATE-COAL-001",
] as const;

const CATEGORY_COLORS: Record<string, string> = {
  "Core Platform":               "#c9a84c",
  "Onboarding / KYC":            "#6366f1",
  "RWA / Asset Packages":        "#8b5cf6",
  "Funding Routes":              "#0ea5e9",
  "XRPL / IOU / Wallets":        "#14b8a6",
  "Legacy / Buyback / LP Review":"#64748b",
  "PATE-COAL-001":               "#f59e0b",
};

const STATUS_LABEL: Record<string, string> = {
  READY:         "PDF Ready",
  PDF_PENDING:   "PDF Pending",
  INTERNAL_ONLY: "Internal Only",
};

const STATUS_COLOR: Record<string, string> = {
  READY:         "rgba(34,197,94,0.18)",
  PDF_PENDING:   "rgba(201,168,76,0.15)",
  INTERNAL_ONLY: "rgba(239,68,68,0.12)",
};

const STATUS_TEXT: Record<string, string> = {
  READY:         "#4ade80",
  PDF_PENDING:   "#f0cf82",
  INTERNAL_ONLY: "#fca5a5",
};

function grouped(docs: readonly PdfDocumentRecord[]) {
  const map = new Map<string, PdfDocumentRecord[]>();
  for (const cat of CATEGORY_ORDER) map.set(cat, []);
  for (const doc of docs) {
    const list = map.get(doc.category) ?? [];
    list.push(doc);
    map.set(doc.category, list);
  }
  return map;
}


export default function HandbooksPage() {
  const byCategory = grouped(PDF_DOCUMENT_REGISTRY);
  const total = PDF_DOCUMENT_REGISTRY.length;
  const ready = PDF_DOCUMENT_REGISTRY.filter((d) => d.status === "READY").length;

  return (
    <div style={{ background: "linear-gradient(160deg, #071426 0%, #0c1e35 60%, #071426 100%)", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 1.25rem" }}>

        {/* Breadcrumb */}
        <Link
          href="/troptions"
          style={{ fontSize: "0.78rem", color: "#64748b", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.35rem", marginBottom: "1.25rem" }}
        >
          ← TROPTIONS Home
        </Link>

        {/* PDF-first alert banner */}
        <div style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.35)", borderRadius: "0.75rem", padding: "1rem 1.25rem", marginBottom: "2rem", display: "flex", gap: "0.85rem", alignItems: "flex-start" }}>
          <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>📄</span>
          <div>
            <p style={{ fontWeight: 700, color: "#f0cf82", margin: "0 0 0.25rem", fontSize: "0.875rem" }}>PDF-First Document System</p>
            <p style={{ fontSize: "0.78rem", color: "#d4a843", margin: 0, lineHeight: 1.55 }}>
              All handbooks are distributed as professional PDFs. Download the PDF for lenders, attorneys, and asset owners.
              Technical JSON metadata is available as a secondary reference where indicated.
              {" "}{ready}/{total} PDFs ready &nbsp;&middot;&nbsp; Documents subject to jurisdiction-specific legal and compliance review.
            </p>
          </div>
        </div>

        {/* Header */}
        <div style={{ marginBottom: "2.75rem" }}>
          <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#f0cf82", margin: "0 0 0.4rem" }}>
            Compliance & Due Diligence
          </p>
          <h1 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "clamp(1.9rem, 4vw, 2.9rem)", fontWeight: 700, color: "#f8fafc", margin: "0 0 0.75rem" }}>
            Professional PDF Handbooks &amp; Due Diligence Packets
          </h1>
          <p style={{ color: "#94a3b8", lineHeight: 1.65, maxWidth: 740, margin: "0 0 1.25rem", fontSize: "0.92rem" }}>
            {total} professional documents covering RWA tokenisation, KYC/onboarding, funding routes, XRPL IOUs,
            PATE-COAL-001 funding packages, and the Rust runtime control layer. Primary delivery is PDF.
          </p>
          {/* Legal notice */}
          <div style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.28)", borderRadius: "0.6rem", padding: "0.8rem 1.05rem" }}>
            <p style={{ fontSize: "0.75rem", color: "#fca5a5", margin: 0, lineHeight: 1.55 }}>
              <strong style={{ color: "#f87171" }}>NOTICE:</strong>{" "}
              TROPTIONS materials are for informational and due-diligence purposes only. Not legal, financial, or investment advice.
              No live custody, exchange, stablecoin issuance, IOU issuance, Aave execution, token buyback, or LP execution is enabled.
              Consult qualified professionals before taking any action.
            </p>
          </div>
        </div>

        {/* Categories */}
        {CATEGORY_ORDER.map((cat) => {
          const docs = byCategory.get(cat) ?? [];
          if (docs.length === 0) return null;
          const catColor = CATEGORY_COLORS[cat] ?? "#c9a84c";
          return (
            <section key={cat} style={{ marginBottom: "2.75rem" }}>
              {/* Category heading */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", borderBottom: `1px solid ${catColor}33`, paddingBottom: "0.65rem" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: catColor, flexShrink: 0 }} />
                <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: catColor, margin: 0 }}>
                  {cat}
                </p>
                <p style={{ fontSize: "0.68rem", color: "#334155", margin: 0 }}>
                  {docs.length} document{docs.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {docs.map((doc) => (
                  <DocCard key={doc.id} doc={doc} accentColor={catColor} />
                ))}
              </div>
            </section>
          );
        })}

        {/* Footer nav */}
        <div style={{ marginTop: "3rem", borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "2rem", display: "flex", flexWrap: "wrap", gap: "1.25rem" }}>
          <Link href="/troptions/docs/downloads" style={{ color: "#f0cf82", fontSize: "0.85rem", textDecoration: "none", fontWeight: 600 }}>
            Download Center →
          </Link>
          <Link href="/troptions/transactions" style={{ color: "#f0cf82", fontSize: "0.85rem", textDecoration: "none", fontWeight: 600 }}>
            Transaction Hub →
          </Link>
          <Link href="/troptions/kyc" style={{ color: "#f0cf82", fontSize: "0.85rem", textDecoration: "none", fontWeight: 600 }}>
            KYC / Onboarding →
          </Link>
          <Link href="/troptions/rwa/pate-coal" style={{ color: "#f0cf82", fontSize: "0.85rem", textDecoration: "none", fontWeight: 600 }}>
            Pate Coal RWA Package →
          </Link>
          <a
            href="/api/troptions/pdf-documents"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#64748b", fontSize: "0.85rem", textDecoration: "none", fontWeight: 500 }}
          >
            Technical JSON API →
          </a>
        </div>
      </div>
    </div>
  );
}

function DocCard({ doc, accentColor }: { doc: PdfDocumentRecord; accentColor: string }) {
  const isPdfReady = doc.status === "READY";
  const statusBg   = STATUS_COLOR[doc.status] ?? "rgba(100,100,100,0.15)";
  const statusTxt  = STATUS_TEXT[doc.status] ?? "#94a3b8";
  const statusLbl  = STATUS_LABEL[doc.status] ?? doc.status;

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.035)",
        border: "1px solid rgba(255,255,255,0.09)",
        borderLeft: `3px solid ${accentColor}`,
        borderRadius: "0.85rem",
        padding: "1.25rem 1.4rem",
        display: "flex",
        gap: "1.1rem",
        flexWrap: "wrap",
        alignItems: "flex-start",
      }}
    >
      {/* Left: text */}
      <div style={{ flex: 1, minWidth: 240 }}>
        {/* Title row */}
        <div style={{ display: "flex", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.3rem" }}>
          <p style={{ fontWeight: 700, color: "#f1f5f9", fontSize: "0.95rem", margin: 0 }}>{doc.title}</p>
          <span
            style={{
              background: statusBg,
              color: statusTxt,
              fontSize: "0.6rem",
              fontWeight: 700,
              padding: "0.15rem 0.55rem",
              borderRadius: "2rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              flexShrink: 0,
              alignSelf: "center",
            }}
          >
            {statusLbl}
          </span>
        </div>

        {/* Subtitle + audience */}
        <p style={{ fontSize: "0.75rem", color: "#64748b", margin: "0 0 0.6rem", lineHeight: 1.4 }}>
          {doc.subtitle} &nbsp;·&nbsp; <span style={{ color: "#475569" }}>For: {doc.audience}</span>
        </p>

        {/* Description */}
        <p style={{ fontSize: "0.8rem", color: "#94a3b8", lineHeight: 1.6, margin: "0 0 0.65rem" }}>{doc.description}</p>

        {/* Version + ID */}
        <p style={{ fontSize: "0.65rem", color: "#334155", fontFamily: "monospace", margin: 0 }}>
          {doc.id} &nbsp;·&nbsp; {doc.version}
        </p>
      </div>

      {/* Right: CTAs */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", alignItems: "stretch", flexShrink: 0, minWidth: 130 }}>
        {/* Primary: Download PDF */}
        {isPdfReady ? (
          <a
            href={doc.pdfPath}
            download
            style={{
              background: accentColor,
              color: "#111827",
              padding: "0.5rem 1.1rem",
              borderRadius: "0.5rem",
              fontWeight: 700,
              fontSize: "0.78rem",
              textDecoration: "none",
              textAlign: "center",
              display: "block",
            }}
          >
            {doc.primaryCtaLabel}
          </a>
        ) : (
          <span
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#475569",
              padding: "0.5rem 1.1rem",
              borderRadius: "0.5rem",
              fontWeight: 600,
              fontSize: "0.75rem",
              textAlign: "center",
              cursor: "not-allowed",
              display: "block",
            }}
          >
            PDF Pending
          </span>
        )}

        {/* Secondary: Technical JSON (only if available) */}
        {doc.jsonExportAvailable && doc.secondaryCtaLabel && (
          <a
            href={`/api/troptions/pdf-documents`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#64748b",
              padding: "0.4rem 1rem",
              borderRadius: "0.5rem",
              fontWeight: 500,
              fontSize: "0.72rem",
              textDecoration: "none",
              textAlign: "center",
              display: "block",
            }}
          >
            {doc.secondaryCtaLabel}
          </a>
        )}
      </div>
    </div>
  );
}
