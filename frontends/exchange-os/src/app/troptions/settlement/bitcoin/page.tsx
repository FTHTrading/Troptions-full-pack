import type { Metadata } from "next";
import Link from "next/link";
import {
  BITCOIN_SETTLEMENT_DISCLOSURE,
  listBitcoinSettlements,
  seedBitcoinSettlementsIfEmpty,
  type BitcoinSettlementStatus,
} from "@/lib/troptions/bitcoinSettlementEngine";

export const metadata: Metadata = {
  title: "TROPTIONS — Bitcoin Settlement Rail",
  description:
    "Bitcoin as an external settlement preference and recordkeeping rail. No custody, no exchange, no money transmission.",
};

const BG = "#070b18";
const PANEL = "#0c1223";
const ACCENT = "#c99a3c";
const ACCENT_SOFT = "#f0cf82";

const STATUS_COLOR: Record<BitcoinSettlementStatus, string> = {
  DRAFT: "#475569",
  QUOTE_REQUESTED: "#f59e0b",
  PROVIDER_REQUIRED: "#f59e0b",
  COMPLIANCE_REVIEW: "#a855f7",
  APPROVED_FOR_EXTERNAL_PROVIDER: "#22c55e",
  PAYMENT_PENDING: "#0ea5e9",
  TX_OBSERVED: "#0ea5e9",
  CONFIRMATIONS_PENDING: "#0ea5e9",
  SETTLED: "#22c55e",
  FAILED: "#ef4444",
  BLOCKED: "#ef4444",
};

function chip(label: string, color: string) {
  return (
    <span style={{
      fontFamily: "var(--font-mono, monospace)", fontSize: "0.65rem",
      textTransform: "uppercase", letterSpacing: "0.08em",
      background: `${color}22`, border: `1px solid ${color}66`, color,
      padding: "0.18rem 0.5rem", borderRadius: "0.3rem",
    }}>{label}</span>
  );
}

export default function BitcoinSettlementPage() {
  seedBitcoinSettlementsIfEmpty();
  const records = listBitcoinSettlements();
  const blocked = records.filter((r) => r.settlementStatus === "BLOCKED").length;
  const settled = records.filter((r) => r.settlementStatus === "SETTLED").length;
  const inFlight = records.length - blocked - settled;

  return (
    <main style={{ background: BG, minHeight: "100vh", color: "#e2e8f0", fontFamily: "var(--font-sans, ui-sans-serif, system-ui)" }}>
      <section style={{ borderBottom: "1px solid rgba(201,154,60,0.25)", padding: "3rem 1.5rem 2.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: ACCENT_SOFT, margin: 0 }}>
            TROPTIONS · Settlement · Bitcoin Rail
          </p>
          <h1 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "clamp(2rem, 5vw, 3.4rem)", color: "#f1f5f9", margin: "0.6rem 0 1rem", lineHeight: 1.1 }}>
            Bitcoin Settlement Preferences
          </h1>
          <p style={{ fontSize: "1.05rem", color: "#cbd5e1", maxWidth: 820, lineHeight: 1.55, margin: 0 }}>
            Bitcoin is supported as an <strong>external settlement preference</strong> and an
            on-chain transaction-record rail for TROPTIONS deals, invoices, and RWA packages.
            All real BTC payments must be executed by a regulated external provider; TROPTIONS
            does not custody Bitcoin, hold private keys, or execute exchange functions.
          </p>
        </div>
      </section>

      <section style={{ background: "#1a0a0a", borderBottom: "1px solid rgba(239,68,68,0.4)", padding: "1.25rem 1.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "#fca5a5", margin: "0 0 0.4rem" }}>
            No custody · No exchange · No money transmission
          </p>
          <p style={{ fontSize: "0.95rem", color: "#fecaca", margin: 0, lineHeight: 1.55 }}>
            {BITCOIN_SETTLEMENT_DISCLOSURE}
          </p>
        </div>
      </section>

      <section style={{ padding: "2.5rem 1.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            {[
              { label: "Total settlements", value: String(records.length) },
              { label: "In-flight", value: String(inFlight) },
              { label: "Settled", value: String(settled) },
              { label: "Blocked", value: String(blocked) },
            ].map((s) => (
              <div key={s.label} style={{ background: PANEL, border: `1px solid ${ACCENT}33`, borderRadius: "0.5rem", padding: "1rem 1.1rem" }}>
                <p style={{ margin: 0, fontSize: "1.6rem", color: ACCENT_SOFT, fontWeight: 700 }}>{s.value}</p>
                <p style={{ margin: "0.2rem 0 0", fontSize: "0.75rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</p>
              </div>
            ))}
          </div>

          <div style={{ background: PANEL, border: `1px solid ${ACCENT}33`, borderRadius: "0.5rem", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ background: "#0a0f1c", color: "#94a3b8", textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: "0.08em" }}>
                  <th style={{ textAlign: "left", padding: "0.7rem 0.8rem" }}>ID</th>
                  <th style={{ textAlign: "left", padding: "0.7rem 0.8rem" }}>Type</th>
                  <th style={{ textAlign: "left", padding: "0.7rem 0.8rem" }}>Provider</th>
                  <th style={{ textAlign: "right", padding: "0.7rem 0.8rem" }}>USD ref</th>
                  <th style={{ textAlign: "left", padding: "0.7rem 0.8rem" }}>KYC / AML</th>
                  <th style={{ textAlign: "left", padding: "0.7rem 0.8rem" }}>Confirmations</th>
                  <th style={{ textAlign: "left", padding: "0.7rem 0.8rem" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.settlementId} style={{ borderTop: "1px solid #1f2937" }}>
                    <td style={{ padding: "0.7rem 0.8rem", fontFamily: "var(--font-mono, monospace)" }}>
                      <Link href={`/troptions/settlement/bitcoin/${r.settlementId}`} style={{ color: ACCENT_SOFT, textDecoration: "none" }}>
                        {r.settlementId}
                      </Link>
                    </td>
                    <td style={{ padding: "0.7rem 0.8rem", color: "#cbd5e1" }}>{r.settlementType}</td>
                    <td style={{ padding: "0.7rem 0.8rem", color: "#cbd5e1" }}>{r.providerName ?? chip("none", "#f59e0b")}</td>
                    <td style={{ padding: "0.7rem 0.8rem", textAlign: "right", color: "#cbd5e1" }}>${r.usdReferenceValue.toLocaleString()}</td>
                    <td style={{ padding: "0.7rem 0.8rem" }}>
                      {chip(r.kycStatus, r.kycStatus === "approved" ? "#22c55e" : "#f59e0b")}{" "}
                      {chip(r.amlStatus, r.amlStatus === "approved" ? "#22c55e" : "#f59e0b")}
                    </td>
                    <td style={{ padding: "0.7rem 0.8rem", color: "#cbd5e1", fontFamily: "var(--font-mono, monospace)" }}>
                      {r.confirmationsObserved}/{r.confirmationsRequired}
                    </td>
                    <td style={{ padding: "0.7rem 0.8rem" }}>
                      {chip(r.settlementStatus.replace(/_/g, " "), STATUS_COLOR[r.settlementStatus])}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
