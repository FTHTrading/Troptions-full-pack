import type { Metadata } from "next";
import Link from "next/link";
import {
  seedCarbonRegistryIfEmpty,
  getCarbonAsset,
} from "@/lib/troptions/carbonCreditEngine";
import { createCarbonCreditBitcoinSettlementFlow } from "@/lib/troptions/carbonBitcoinFlowEngine";

export const metadata: Metadata = {
  title: "TROPTIONS — Carbon → BTC Demo Flow",
  description:
    "Simulation/demo of a verified-active carbon credit sale paid via an external Bitcoin settlement provider. No real execution.",
};

const BG = "#070b18";
const PANEL = "#0c1223";
const ACCENT = "#c99a3c";
const ACCENT_SOFT = "#f0cf82";

export default function CarbonBitcoinDemoPage() {
  seedCarbonRegistryIfEmpty();

  // Use the verified-active demo asset
  const asset = getCarbonAsset("CRB-DEMO-002");
  const flow = asset
    ? createCarbonCreditBitcoinSettlementFlow({
        carbonAssetId: asset.carbonAssetId,
        settlementId: "BTC-DEMOFLOW-DEMO01",
        payerName: "Demo Buyer Inc.",
        payeeName: "TROPTIONS Demo Holder LLC",
        usdReferenceValue: 120000,
        btcQuotedAmount: 1.85,
        providerName: "External Regulated BTC Provider (demo)",
        invoiceId: "INV-DEMO-FLOW",
        actor: "demo-page",
      })
    : null;

  const sectionStyle = {
    background: PANEL,
    border: `1px solid ${ACCENT}33`,
    borderRadius: "0.5rem",
    padding: "1.25rem 1.4rem",
    marginBottom: "1.25rem",
  } as const;

  return (
    <main style={{ background: BG, minHeight: "100vh", color: "#e2e8f0", fontFamily: "var(--font-sans, ui-sans-serif, system-ui)" }}>
      <section style={{ borderBottom: "1px solid rgba(201,154,60,0.25)", padding: "3rem 1.5rem 2.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: ACCENT_SOFT, margin: 0 }}>
            TROPTIONS · RWA · Carbon → BTC · DEMO ONLY
          </p>
          <h1 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "clamp(2rem, 5vw, 3.4rem)", color: "#f1f5f9", margin: "0.6rem 0 1rem", lineHeight: 1.1 }}>
            Carbon Credit Sale, Bitcoin Settlement
          </h1>
          <p style={{ fontSize: "1.05rem", color: "#cbd5e1", maxWidth: 820, lineHeight: 1.55, margin: 0 }}>
            This page renders a <strong>simulation</strong> of how a verified carbon credit moves
            through TROPTIONS&apos; compliance gates and into a Bitcoin settlement preference. No
            funds are moved, no keys are generated, no transactions are signed. Live execution
            requires an external regulated provider.
          </p>
        </div>
      </section>

      <section style={{ background: "#1a0a0a", borderBottom: "1px solid rgba(239,68,68,0.4)", padding: "1.25rem 1.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "#fca5a5", margin: "0 0 0.4rem" }}>
            Simulation only — no live trading, no custody, no money transmission
          </p>
          <p style={{ fontSize: "0.95rem", color: "#fecaca", margin: 0, lineHeight: 1.55 }}>
            All status labels, evidence, and audit-event previews below are generated as a
            recordkeeping demonstration. No external accounts, exchanges, or wallets are touched.
          </p>
        </div>
      </section>

      <section style={{ padding: "2.5rem 1.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={sectionStyle}>
            <h3 style={{ margin: "0 0 0.9rem", color: ACCENT_SOFT, fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Step 1 · Carbon asset verification
            </h3>
            {asset ? (
              <p style={{ margin: 0, color: "#cbd5e1", fontSize: "0.9rem" }}>
                Asset <Link href={`/troptions/carbon/${asset.carbonAssetId}`} style={{ color: ACCENT_SOFT }}>{asset.carbonAssetId}</Link> · status <code>{asset.status}</code> · verification <code>{asset.verificationStatus}</code> · retirement <code>{asset.retirementStatus}</code>.
              </p>
            ) : (
              <p style={{ margin: 0, color: "#fca5a5" }}>Demo asset not seeded.</p>
            )}
          </div>

          <div style={sectionStyle}>
            <h3 style={{ margin: "0 0 0.9rem", color: ACCENT_SOFT, fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Step 2 · Invoice & BTC settlement preference
            </h3>
            {flow?.bitcoinSettlement ? (
              <p style={{ margin: 0, color: "#cbd5e1", fontSize: "0.9rem" }}>
                Settlement <Link href={`/troptions/settlement/bitcoin/${flow.bitcoinSettlement.settlementId}`} style={{ color: ACCENT_SOFT }}>{flow.bitcoinSettlement.settlementId}</Link> created at status <code>{flow.bitcoinSettlement.settlementStatus}</code> with provider <code>{flow.bitcoinSettlement.providerName}</code>. USD ref ${flow.bitcoinSettlement.usdReferenceValue.toLocaleString()}, quoted {flow.bitcoinSettlement.btcQuotedAmount} BTC.
              </p>
            ) : null}
          </div>

          <div style={sectionStyle}>
            <h3 style={{ margin: "0 0 0.9rem", color: ACCENT_SOFT, fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Step 3 · Compliance gates
            </h3>
            <ul style={{ margin: 0, paddingLeft: "1.1rem", color: "#cbd5e1", fontSize: "0.9rem", lineHeight: 1.6 }}>
              {(flow?.approvalGatesRequired ?? []).map((g) => (
                <li key={g}><code>{g}</code></li>
              ))}
            </ul>
          </div>

          <div style={sectionStyle}>
            <h3 style={{ margin: "0 0 0.9rem", color: ACCENT_SOFT, fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Step 4 · Blocking conditions
            </h3>
            {flow && flow.blockingReasons.length === 0 ? (
              <p style={{ margin: 0, color: "#86efac", fontSize: "0.9rem" }}>
                No structural blockers in this simulation. Live execution still requires an
                external regulated BTC provider.
              </p>
            ) : (
              <ul style={{ margin: 0, paddingLeft: "1.1rem", color: "#fecaca", fontSize: "0.9rem", lineHeight: 1.6 }}>
                {(flow?.blockingReasons ?? []).map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
          </div>

          <div style={sectionStyle}>
            <h3 style={{ margin: "0 0 0.9rem", color: ACCENT_SOFT, fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Step 5 · Audit event preview
            </h3>
            {flow ? (
              <pre style={{ margin: 0, color: "#cbd5e1", fontSize: "0.8rem", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                {JSON.stringify(flow.auditEventPreview, null, 2)}
              </pre>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
