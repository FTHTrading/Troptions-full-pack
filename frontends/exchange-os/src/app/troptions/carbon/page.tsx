import type { Metadata } from "next";
import Link from "next/link";
import {
  CARBON_CREDIT_DISCLOSURE,
  calculateCarbonReadinessScore,
  listCarbonAssets,
  seedCarbonRegistryIfEmpty,
  type CarbonCreditRecord,
  type CarbonCreditStatus,
} from "@/lib/troptions/carbonCreditEngine";

export const metadata: Metadata = {
  title: "TROPTIONS — Carbon Credit Registry",
  description:
    "Compliance-gated registry of verified carbon credit RWA records. Not an offset guarantee. Simulation and recordkeeping only.",
};

const BG = "#070b18";
const PANEL = "#0c1223";
const ACCENT = "#c99a3c";
const ACCENT_SOFT = "#f0cf82";

const STATUS_COLOR: Record<CarbonCreditStatus, string> = {
  DRAFT: "#475569",
  PENDING_VERIFICATION: "#f59e0b",
  VERIFIED_ACTIVE: "#22c55e",
  PLEDGED: "#0ea5e9",
  SOLD: "#a855f7",
  RETIRED: "#94a3b8",
  REJECTED: "#ef4444",
  BLOCKED: "#ef4444",
};

function chip(label: string, color: string) {
  return (
    <span
      style={{
        fontFamily: "var(--font-mono, monospace)",
        fontSize: "0.65rem",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        background: `${color}22`,
        border: `1px solid ${color}66`,
        color,
        padding: "0.18rem 0.5rem",
        borderRadius: "0.3rem",
      }}
    >
      {label}
    </span>
  );
}

function summarize(records: CarbonCreditRecord[]) {
  const total = records.length;
  const verified = records.filter((r) => r.status === "VERIFIED_ACTIVE").length;
  const retired = records.filter((r) => r.status === "RETIRED").length;
  const blocked = records.filter((r) => r.status === "BLOCKED" || r.status === "REJECTED").length;
  const avgReadiness =
    total === 0
      ? 0
      : Math.round(
          records.reduce((s, r) => s + calculateCarbonReadinessScore(r), 0) / total
        );
  return { total, verified, retired, blocked, avgReadiness };
}

export default function CarbonRegistryPage() {
  seedCarbonRegistryIfEmpty();
  const records = listCarbonAssets();
  const sums = summarize(records);

  return (
    <main
      style={{
        background: BG,
        minHeight: "100vh",
        color: "#e2e8f0",
        fontFamily: "var(--font-sans, ui-sans-serif, system-ui)",
      }}
    >
      <section style={{ borderBottom: "1px solid rgba(201,154,60,0.25)", padding: "3rem 1.5rem 2.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: ACCENT_SOFT,
              margin: 0,
            }}
          >
            TROPTIONS · Carbon Credit Registry · Simulation
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display, Georgia, serif)",
              fontSize: "clamp(2rem, 5vw, 3.4rem)",
              color: "#f1f5f9",
              margin: "0.6rem 0 1rem",
              lineHeight: 1.1,
            }}
          >
            Verified Carbon Credits
          </h1>
          <p style={{ fontSize: "1.05rem", color: "#cbd5e1", maxWidth: 820, lineHeight: 1.55, margin: 0 }}>
            Carbon credits tracked here are <strong>environmental asset records only</strong>. Each
            row links to registry attestations, evidence hashes, and retirement status. TROPTIONS does
            not act as a registry, broker, or money transmitter and makes no guarantee of offset
            validity, liquidity, or resale value.
          </p>
        </div>
      </section>

      <section style={{ background: "#1a0a0a", borderBottom: "1px solid rgba(239,68,68,0.4)", padding: "1.25rem 1.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "#fca5a5", margin: "0 0 0.4rem" }}>
            Not an offset guarantee
          </p>
          <p style={{ fontSize: "0.95rem", color: "#fecaca", margin: 0, lineHeight: 1.55 }}>
            {CARBON_CREDIT_DISCLOSURE}
          </p>
        </div>
      </section>

      <section style={{ padding: "2.5rem 1.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            {[
              { label: "Total credits", value: String(sums.total) },
              { label: "Verified active", value: String(sums.verified) },
              { label: "Retired", value: String(sums.retired) },
              { label: "Blocked / rejected", value: String(sums.blocked) },
              { label: "Avg readiness", value: `${sums.avgReadiness}/100` },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: PANEL,
                  border: `1px solid ${ACCENT}33`,
                  borderRadius: "0.5rem",
                  padding: "1rem 1.1rem",
                }}
              >
                <p style={{ margin: 0, fontSize: "1.6rem", color: ACCENT_SOFT, fontWeight: 700 }}>
                  {s.value}
                </p>
                <p style={{ margin: "0.2rem 0 0", fontSize: "0.75rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <h2 style={{ color: "#f1f5f9", margin: "0 0 1rem", fontSize: "1.4rem" }}>Registry</h2>
          <div
            style={{
              background: PANEL,
              border: `1px solid ${ACCENT}33`,
              borderRadius: "0.5rem",
              overflow: "hidden",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.85rem",
              }}
            >
              <thead>
                <tr style={{ background: "#0a0f1c", color: "#94a3b8", textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: "0.08em" }}>
                  <th style={{ textAlign: "left", padding: "0.7rem 0.8rem" }}>Asset</th>
                  <th style={{ textAlign: "left", padding: "0.7rem 0.8rem" }}>Project</th>
                  <th style={{ textAlign: "left", padding: "0.7rem 0.8rem" }}>Vintage</th>
                  <th style={{ textAlign: "right", padding: "0.7rem 0.8rem" }}>Quantity</th>
                  <th style={{ textAlign: "left", padding: "0.7rem 0.8rem" }}>Status</th>
                  <th style={{ textAlign: "left", padding: "0.7rem 0.8rem" }}>Evidence</th>
                  <th style={{ textAlign: "right", padding: "0.7rem 0.8rem" }}>Readiness</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => {
                  const score = calculateCarbonReadinessScore(r);
                  const evidenceOk = !!(r.evidenceHash || r.ipfsCid);
                  return (
                    <tr key={r.carbonAssetId} style={{ borderTop: "1px solid #1f2937" }}>
                      <td style={{ padding: "0.7rem 0.8rem", fontFamily: "var(--font-mono, monospace)" }}>
                        <Link
                          href={`/troptions/carbon/${r.carbonAssetId}`}
                          style={{ color: ACCENT_SOFT, textDecoration: "none" }}
                        >
                          {r.carbonAssetId}
                        </Link>
                      </td>
                      <td style={{ padding: "0.7rem 0.8rem" }}>
                        <div style={{ color: "#e2e8f0" }}>{r.projectName || "—"}</div>
                        <div style={{ color: "#64748b", fontSize: "0.7rem" }}>{r.registryName || "—"}</div>
                      </td>
                      <td style={{ padding: "0.7rem 0.8rem", color: "#cbd5e1" }}>{r.vintageYear}</td>
                      <td style={{ padding: "0.7rem 0.8rem", textAlign: "right", color: "#cbd5e1" }}>
                        {r.creditQuantity.toLocaleString()} {r.unitType}
                      </td>
                      <td style={{ padding: "0.7rem 0.8rem" }}>
                        {chip(r.status.replace(/_/g, " "), STATUS_COLOR[r.status])}
                      </td>
                      <td style={{ padding: "0.7rem 0.8rem" }}>
                        {evidenceOk
                          ? chip("attached", "#22c55e")
                          : chip("missing", "#f59e0b")}
                      </td>
                      <td style={{ padding: "0.7rem 0.8rem", textAlign: "right", fontFamily: "var(--font-mono, monospace)", color: "#cbd5e1" }}>
                        {score}/100
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p style={{ marginTop: "1.5rem", fontSize: "0.8rem", color: "#64748b" }}>
            Looking for the combined carbon → BTC settlement walkthrough?{" "}
            <Link href="/troptions/rwa/carbon-bitcoin-demo" style={{ color: ACCENT_SOFT }}>
              View the demo flow →
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
