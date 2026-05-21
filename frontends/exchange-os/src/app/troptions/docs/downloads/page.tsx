import Link from "next/link";
import { PDF_DOCUMENT_REGISTRY, type PdfDocumentRecord } from "@/lib/troptions/pdfDocumentRegistry";

export const metadata = {
  title: "TROPTIONS Document Download Center",
  description:
    "Download all professional TROPTIONS PDFs: RWA packets, funding routes, KYC onboarding, PATE-COAL-001 funding package, XRPL IOU handbooks, and more.",
};

const SECTIONS: {
  heading: string;
  description: string;
  filter: (d: PdfDocumentRecord) => boolean;
  accentColor: string;
}[] = [
  {
    heading: "Start Here — Platform & Onboarding",
    description: "Read these first. They cover the platform architecture and the KYC/onboarding steps required before any transaction.",
    accentColor: "#c9a84c",
    filter: (d) => d.category === "Core Platform" || d.category === "Onboarding / KYC",
  },
  {
    heading: "Asset Owner Packets",
    description: "Required documents for asset owners submitting RWA, carbon credit, or natural resource assets.",
    accentColor: "#8b5cf6",
    filter: (d) => d.category === "RWA / Asset Packages" || d.category === "PATE-COAL-001",
  },
  {
    heading: "Lender & Funding Packets",
    description: "Funding route guides, playbooks, and the intake document checklist for lenders and deal desks.",
    accentColor: "#0ea5e9",
    filter: (d) => d.category === "Funding Routes",
  },
  {
    heading: "Technical / Web3",
    description: "XRPL IOU issuance, wallet mint guide, and the Rust runtime control layer overview.",
    accentColor: "#14b8a6",
    filter: (d) => d.category === "XRPL / IOU / Wallets",
  },
  {
    heading: "Legacy, Buyback & Liquidity Review",
    description: "Procedures for legacy token migration, buyback reviews, and LP readiness assessments.",
    accentColor: "#64748b",
    filter: (d) => d.category === "Legacy / Buyback / LP Review",
  },
];

export default function DownloadsPage() {
  return (
    <div
      style={{
        background: "linear-gradient(160deg, #071426 0%, #0c1e35 60%, #071426 100%)",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 1.25rem" }}>

        {/* Breadcrumb */}
        <Link
          href="/troptions"
          style={{ fontSize: "0.78rem", color: "#64748b", textDecoration: "none", marginBottom: "1.25rem", display: "inline-block" }}
        >
          ← TROPTIONS Home
        </Link>

        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#f0cf82", margin: "0 0 0.4rem" }}>
            Document Center
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display, Georgia, serif)",
              fontSize: "clamp(1.9rem, 4vw, 2.9rem)",
              fontWeight: 700,
              color: "#f8fafc",
              margin: "0 0 0.75rem",
            }}
          >
            TROPTIONS Download Center
          </h1>
          <p style={{ color: "#94a3b8", lineHeight: 1.65, maxWidth: 720, margin: "0 0 1.25rem", fontSize: "0.92rem" }}>
            {PDF_DOCUMENT_REGISTRY.length} professional PDF documents for lenders, asset owners, attorneys, and technical
            partners. Every primary action is Download PDF — no JSON-first workflows.
          </p>

          {/* Safety banner */}
          <div
            style={{
              background: "rgba(239,68,68,0.07)",
              border: "1px solid rgba(239,68,68,0.28)",
              borderRadius: "0.65rem",
              padding: "0.85rem 1.1rem",
            }}
          >
            <p style={{ fontSize: "0.75rem", color: "#fca5a5", margin: 0, lineHeight: 1.55 }}>
              <strong style={{ color: "#f87171" }}>NOTICE:</strong>{" "}
              TROPTIONS documents are for informational and due-diligence purposes only. No live custody, exchange, stablecoin
              issuance, IOU issuance, Aave execution, buyback, or LP execution is enabled. All materials are simulation-only
              until legal, compliance, and governance approvals are in place. Consult qualified professionals before taking
              any action.
            </p>
          </div>
        </div>

        {/* Quick-jump nav */}
        <nav
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "0.75rem",
            padding: "1rem 1.25rem",
            marginBottom: "2.75rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          {SECTIONS.map((s) => (
            <a
              key={s.heading}
              href={`#${slugify(s.heading)}`}
              style={{
                fontSize: "0.75rem",
                color: s.accentColor,
                textDecoration: "none",
                fontWeight: 600,
                padding: "0.3rem 0.75rem",
                borderRadius: "2rem",
                background: `${s.accentColor}18`,
                border: `1px solid ${s.accentColor}30`,
              }}
            >
              {s.heading}
            </a>
          ))}
        </nav>

        {/* Sections */}
        {SECTIONS.map((section) => {
          const docs = PDF_DOCUMENT_REGISTRY.filter(section.filter);
          return (
            <section
              key={section.heading}
              id={slugify(section.heading)}
              style={{ marginBottom: "3rem", scrollMarginTop: "1.5rem" }}
            >
              <div
                style={{
                  borderLeft: `3px solid ${section.accentColor}`,
                  paddingLeft: "1rem",
                  marginBottom: "1.25rem",
                }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-display, Georgia, serif)",
                    fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
                    fontWeight: 700,
                    color: "#f1f5f9",
                    margin: "0 0 0.35rem",
                  }}
                >
                  {section.heading}
                </h2>
                <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0 }}>{section.description}</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {docs.map((doc) => (
                  <DownloadRow key={doc.id} doc={doc} accentColor={section.accentColor} />
                ))}
              </div>
            </section>
          );
        })}

        {/* Footer */}
        <div
          style={{
            marginTop: "3rem",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            paddingTop: "2rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "1.25rem",
          }}
        >
          <Link href="/troptions/compliance/handbooks" style={{ color: "#f0cf82", fontSize: "0.85rem", textDecoration: "none", fontWeight: 600 }}>
            Full Handbook Registry →
          </Link>
          <Link href="/troptions/transactions" style={{ color: "#f0cf82", fontSize: "0.85rem", textDecoration: "none", fontWeight: 600 }}>
            Transaction Hub →
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

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function DownloadRow({ doc, accentColor }: { doc: PdfDocumentRecord; accentColor: string }) {
  const isPdfReady = doc.status === "READY";

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "0.75rem",
        padding: "1rem 1.25rem",
        display: "flex",
        gap: "1rem",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {/* Text */}
      <div style={{ flex: 1, minWidth: 220 }}>
        <p style={{ fontWeight: 600, color: "#e2e8f0", fontSize: "0.875rem", margin: "0 0 0.2rem" }}>
          {doc.title}
        </p>
        <p style={{ fontSize: "0.72rem", color: "#475569", margin: 0 }}>
          {doc.subtitle} &nbsp;·&nbsp; For: {doc.audience}
        </p>
      </div>

      {/* Status */}
      <span
        style={{
          fontSize: "0.6rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          padding: "0.2rem 0.6rem",
          borderRadius: "2rem",
          background: isPdfReady ? "rgba(34,197,94,0.15)" : "rgba(201,168,76,0.12)",
          color: isPdfReady ? "#4ade80" : "#f0cf82",
          flexShrink: 0,
        }}
      >
        {isPdfReady ? "PDF Ready" : "PDF Pending"}
      </span>

      {/* CTA */}
      {isPdfReady ? (
        <a
          href={doc.pdfPath}
          download
          style={{
            background: accentColor,
            color: "#111827",
            padding: "0.45rem 1.1rem",
            borderRadius: "0.5rem",
            fontWeight: 700,
            fontSize: "0.75rem",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          {doc.primaryCtaLabel}
        </a>
      ) : (
        <span
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.09)",
            color: "#334155",
            padding: "0.45rem 1.1rem",
            borderRadius: "0.5rem",
            fontWeight: 500,
            fontSize: "0.75rem",
            flexShrink: 0,
            cursor: "not-allowed",
          }}
        >
          Pending
        </span>
      )}
    </div>
  );
}
