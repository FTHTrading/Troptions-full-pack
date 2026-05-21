import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CARBON_CREDIT_DISCLOSURE,
  calculateCarbonReadinessScore,
  getCarbonAsset,
  seedCarbonRegistryIfEmpty,
} from "@/lib/troptions/carbonCreditEngine";
import { listCarbonBitcoinAuditEvents } from "@/lib/troptions/carbonBitcoinAuditLog";

export const metadata: Metadata = {
  title: "TROPTIONS — Carbon Credit Detail",
  description: "Carbon credit asset detail with evidence, retirement status, and audit trail.",
};

const BG = "#070b18";
const PANEL = "#0c1223";
const ACCENT = "#c99a3c";
const ACCENT_SOFT = "#f0cf82";

type RouteParams = { assetId: string };

export default async function CarbonAssetDetail({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  seedCarbonRegistryIfEmpty();
  const { assetId } = await params;
  const record = getCarbonAsset(assetId);
  if (!record) notFound();

  const score = calculateCarbonReadinessScore(record);
  const events = listCarbonBitcoinAuditEvents({ relatedAssetId: assetId });

  const sectionStyle = {
    background: PANEL,
    border: `1px solid ${ACCENT}33`,
    borderRadius: "0.5rem",
    padding: "1.25rem 1.4rem",
    marginBottom: "1.25rem",
  } as const;

  const dl = (rows: [string, React.ReactNode][]) => (
    <dl style={{ display: "grid", gridTemplateColumns: "minmax(180px, 220px) 1fr", gap: "0.55rem 1rem", margin: 0, fontSize: "0.9rem" }}>
      {rows.map(([k, v]) => (
        <div key={k} style={{ display: "contents" }}>
          <dt style={{ color: "#64748b", textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: "0.08em" }}>{k}</dt>
          <dd style={{ margin: 0, color: "#e2e8f0", fontFamily: "var(--font-mono, monospace)", wordBreak: "break-all" }}>{v ?? "—"}</dd>
        </div>
      ))}
    </dl>
  );

  return (
    <main style={{ background: BG, minHeight: "100vh", color: "#e2e8f0", fontFamily: "var(--font-sans, ui-sans-serif, system-ui)" }}>
      <section style={{ borderBottom: "1px solid rgba(201,154,60,0.25)", padding: "2.5rem 1.5rem 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: ACCENT_SOFT, margin: 0 }}>
            <Link href="/troptions/carbon" style={{ color: ACCENT_SOFT, textDecoration: "none" }}>
              ← Carbon Registry
            </Link>{" "}
            · {record.carbonAssetId}
          </p>
          <h1 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "clamp(1.6rem, 4vw, 2.6rem)", color: "#f1f5f9", margin: "0.6rem 0 0.4rem" }}>
            {record.projectName}
          </h1>
          <p style={{ color: "#94a3b8", margin: 0 }}>
            {record.registryName} · {record.projectType} · vintage {record.vintageYear}
          </p>
        </div>
      </section>

      <section style={{ background: "#1a0a0a", borderBottom: "1px solid rgba(239,68,68,0.4)", padding: "1rem 1.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontSize: "0.85rem", color: "#fecaca", margin: 0, lineHeight: 1.5 }}>
            {CARBON_CREDIT_DISCLOSURE}
          </p>
        </div>
      </section>

      <section style={{ padding: "2rem 1.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={sectionStyle}>
            <h3 style={{ margin: "0 0 0.9rem", color: ACCENT_SOFT, fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Registry & Project
            </h3>
            {dl([
              ["Asset ID", record.carbonAssetId],
              ["Registry", record.registryName],
              ["Registry account", record.registryAccount || "—"],
              ["Project ID", record.projectId || "—"],
              ["Project name", record.projectName],
              ["Project location", record.projectLocation],
              ["Project type", record.projectType],
              ["Methodology", record.methodology],
              ["Vintage year", record.vintageYear],
              ["Quantity", `${record.creditQuantity.toLocaleString()} ${record.unitType}`],
              ["Serial numbers", record.serialNumbers.join(", ") || "—"],
              ["Owner", record.ownerName || "—"],
              ["Beneficiary", record.beneficiaryName || "—"],
              ["Custody", record.custodyStatus],
            ])}
          </div>

          <div style={sectionStyle}>
            <h3 style={{ margin: "0 0 0.9rem", color: ACCENT_SOFT, fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Evidence
            </h3>
            {dl([
              ["Evidence hash (SHA-256)", record.evidenceHash],
              ["IPFS CID", record.ipfsCid],
              ["XRPL attestation tx", record.xrplAttestationTx],
              ["Stellar mirror tx", record.stellarMirrorTx],
              ["Retirement certificate", record.retirementCertificateUrl],
              ["Source documents", record.sourceDocuments.join(", ") || "—"],
            ])}
          </div>

          <div style={sectionStyle}>
            <h3 style={{ margin: "0 0 0.9rem", color: ACCENT_SOFT, fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Status & Risk
            </h3>
            {dl([
              ["Status", record.status],
              ["Verification status", record.verificationStatus],
              ["Retirement status", record.retirementStatus],
              ["Approval status", record.approvalStatus],
              ["Risk flags", record.riskFlags.length ? record.riskFlags.join(", ") : "none"],
              ["Readiness score", `${score} / 100`],
              ["Created", record.createdAt],
              ["Updated", record.updatedAt],
            ])}
          </div>

          <div style={sectionStyle}>
            <h3 style={{ margin: "0 0 0.9rem", color: ACCENT_SOFT, fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Audit trail
            </h3>
            {events.length === 0 ? (
              <p style={{ color: "#64748b", margin: 0 }}>No simulation audit events recorded yet.</p>
            ) : (
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {events.slice(-12).reverse().map((e) => (
                  <li
                    key={e.eventId}
                    style={{
                      borderLeft: `2px solid ${ACCENT}66`,
                      paddingLeft: "0.7rem",
                      fontSize: "0.8rem",
                      color: "#cbd5e1",
                    }}
                  >
                    <span style={{ color: ACCENT_SOFT, fontFamily: "var(--font-mono, monospace)" }}>
                      {e.eventType}
                    </span>{" "}
                    · {e.timestamp} · {e.reason}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
