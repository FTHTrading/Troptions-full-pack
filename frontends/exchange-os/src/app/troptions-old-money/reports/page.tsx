import { PageTemplate } from "@/components/troptions-old-money/PageTemplate";
import { OLD_MONEY_PAGES } from "@/content/troptions-old-money/pages";
import { ReportCoverCard } from "@/components/troptions-media/ReportCoverCard";
import { AssetImageCard } from "@/components/troptions-media/AssetImageCard";
import { MEDIA_REGISTRY } from "@/content/troptions/mediaRegistry";
import { InstitutionalFuturePanel } from "@/components/troptions-evolution/InstitutionalFuturePanel";
import "@/styles/troptions-evolution.css";

const REPORT_LIBRARY = [
  {
    id: "rpt-annual-2024",
    reportType: "Annual Report",
    title: "2024 Institutional Operating Review",
    description:
      "Comprehensive review of governance execution, compliance posture, and operational continuity across the full fiscal period.",
    period: "FY 2024 — Issued Q1 2025",
  },
  {
    id: "rpt-reserve-q4-2024",
    reportType: "Reserve Report",
    title: "Reserve Composition — Q4 2024",
    description:
      "Attestation-backed summary of reserve categories, concentration limits, and independent assurance findings.",
    period: "Q4 2024",
  },
  {
    id: "rpt-governance-2024",
    reportType: "Governance Report",
    title: "Governance & Control Assessment 2024",
    description:
      "Board-level visibility across decision authority matrices, audit committee findings, and policy revision records.",
    period: "FY 2024",
  },
  {
    id: "rpt-settlement-h2-2024",
    reportType: "Settlement Report",
    title: "Settlement Exception Register — H2 2024",
    description:
      "Half-year settlement exception log with resolution timelines, root cause analysis, and control improvements applied.",
    period: "H2 2024 — July through December",
  },
  {
    id: "rpt-custody-q3-2024",
    reportType: "Custody Report",
    title: "Custody Verification Summary — Q3 2024",
    description:
      "Independent verification of custody controls, key management audits, and cold-to-warm migration event review.",
    period: "Q3 2024",
  },
  {
    id: "rpt-compliance-q2-2024",
    reportType: "Compliance Summary",
    title: "Regulatory Posture Review — Q2 2024",
    description:
      "Jurisdiction-by-jurisdiction posture status, pending regulatory developments, and product restriction decisions.",
    period: "Q2 2024",
  },
];

const certificateAsset = MEDIA_REGISTRY.find((m) => m.id === "certificate-power-genesis");

export default function TroptionsOldMoneyReportsPage() {
  return (
    <>
      <PageTemplate page={OLD_MONEY_PAGES.reports} />

      <div className="om-page" style={{ marginTop: "1.2rem", gap: "1.2rem", display: "flex", flexDirection: "column" }}>

        {/* Report Library Grid */}
        <div className="tm-visual-section">
          <h2 className="tm-section-heading">Report Library</h2>
          <p className="tm-section-subheading">
            Institutional disclosure cadence. All periods subject to independent assurance.
          </p>
          <div className="tm-gallery">
            {REPORT_LIBRARY.map((r) => (
              <ReportCoverCard
                key={r.id}
                reportType={r.reportType}
                title={r.title}
                description={r.description}
                period={r.period}
              />
            ))}
          </div>
        </div>

        {/* Certificate Evidence */}
        {certificateAsset && (
          <div className="tm-visual-section">
            <h2 className="tm-section-heading">Certificate Evidence</h2>
            <p className="tm-section-subheading">
              Institutional certificate facsimiles retained in the proof and diligence track.
            </p>
            <div style={{ maxWidth: "420px" }}>
              <AssetImageCard
                src={certificateAsset.src}
                alt={certificateAsset.alt}
                title={certificateAsset.title}
                caption={certificateAsset.description}
                category={certificateAsset.category}
                complianceNote={certificateAsset.complianceNote}
              />
            </div>
          </div>
        )}

      </div>

      <div className="om-page" style={{ marginTop: "1.2rem", gap: "1.2rem", display: "flex", flexDirection: "column" }}>
        <InstitutionalFuturePanel />
      </div>
    </>
  );
}
