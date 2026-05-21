"use client";

import { useState } from "react";
import Link from "next/link";

const DISCLOSURE =
  "KYC submissions are processed through the TROPTIONS compliance layer. No identity data is transmitted or stored in raw form. Only cryptographic hashes of submitted document content are recorded. This system does not provide legal KYC compliance determinations. All determinations are subject to independent legal and compliance review.";

const DOCUMENT_TYPES = [
  "passport",
  "national_id",
  "drivers_license",
  "proof_of_address",
  "bank_statement",
  "entity_registration",
  "tax_id",
  "sanctions_certification",
  "source_of_funds",
  "beneficial_ownership",
  "professional_license",
  "accredited_investor_cert",
] as const;

type DocType = (typeof DOCUMENT_TYPES)[number];

interface SubmitResult {
  ok: boolean;
  simulationOnly: boolean;
  kycId?: string;
  documentHash?: string;
  documentName?: string;
  documentType?: string;
  tier?: string;
  disclosure?: string;
  error?: string;
}

export default function KycOnboardingPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [walletAddress, setWalletAddress] = useState("");
  const [entityType, setEntityType] = useState<"individual" | "entity">("individual");
  const [documentType, setDocumentType] = useState<DocType>("passport");
  const [documentName, setDocumentName] = useState("");
  const [documentContent, setDocumentContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);

  function handleAddressNext() {
    if (walletAddress.trim().length < 6) return;
    setStep(2);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!documentName.trim() || !documentContent.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/troptions/kyc/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectAddress: walletAddress,
          entityType,
          documentType,
          documentName,
          documentContent,
        }),
      });
      const data: SubmitResult = await res.json();
      setResult(data);
      if (data.ok) setStep(3);
    } catch {
      setResult({ ok: false, simulationOnly: true, error: "Network error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ background: "linear-gradient(160deg, #071426 0%, #0c1e35 60%, #071426 100%)", minHeight: "100vh" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "3rem 1.25rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <Link href="/troptions" style={{ fontSize: "0.8rem", color: "#64748b", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.35rem", marginBottom: "1rem" }}>
            ← TROPTIONS Home
          </Link>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#f0cf82", margin: "0 0 0.35rem" }}>Identity Verification</p>
          <h1 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 700, color: "#f8fafc", margin: "0 0 0.75rem" }}>
            KYC / Onboarding
          </h1>
          <div style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "0.6rem", padding: "0.85rem 1.1rem", marginBottom: "0.75rem" }}>
            <p style={{ fontSize: "0.78rem", color: "#f0cf82", margin: 0, lineHeight: 1.6 }}>
              <strong style={{ color: "#c9a84c" }}>COMPLIANCE NOTICE:</strong> {DISCLOSURE}
            </p>
          </div>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem" }}>
          {(["1", "2", "3"] as const).map((s, i) => {
            const num = i + 1;
            const active = step === num;
            const done = step > num;
            return (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: done ? "#16a34a" : active ? "#c99a3c" : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 700, color: done || active ? "white" : "#64748b", border: done ? "1px solid #16a34a" : active ? "1px solid #c99a3c" : "1px solid rgba(255,255,255,0.15)" }}>
                  {done ? "✓" : num}
                </div>
                <span style={{ fontSize: "0.78rem", color: active ? "#f0cf82" : done ? "#4ade80" : "#64748b", fontWeight: active ? 700 : 500 }}>
                  {["Enter Wallet", "Submit Document", "View Status"][i]}
                </span>
                {i < 2 && <span style={{ color: "#334155", margin: "0 0.25rem" }}>→</span>}
              </div>
            );
          })}
        </div>

        {/* Step 1: wallet address */}
        {step === 1 && (
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1rem", padding: "1.75rem" }}>
            <h2 style={{ fontWeight: 700, color: "#f1f5f9", fontSize: "1.1rem", margin: "0 0 0.5rem" }}>Step 1: Your Wallet Address</h2>
            <p style={{ fontSize: "0.83rem", color: "#94a3b8", margin: "0 0 1.25rem", lineHeight: 1.6 }}>
              Enter your XRPL, Stellar, or EVM wallet address. This links your KYC record to your on-chain identity.
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="rXXXX... or 0x... or G..."
                style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: "0.5rem", padding: "0.65rem 0.9rem", color: "#f1f5f9", fontSize: "0.88rem", fontFamily: "var(--font-mono, monospace)", outline: "none" }}
              />
              <button
                onClick={handleAddressNext}
                disabled={walletAddress.trim().length < 6}
                style={{ background: "#c99a3c", color: "#111827", padding: "0.65rem 1.25rem", borderRadius: "0.5rem", fontWeight: 700, fontSize: "0.88rem", border: "none", cursor: "pointer", opacity: walletAddress.trim().length < 6 ? 0.5 : 1 }}
              >
                Continue
              </button>
            </div>

            <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {(["individual", "entity"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setEntityType(t)}
                  style={{ background: entityType === t ? "rgba(201,154,60,0.18)" : "rgba(255,255,255,0.04)", border: entityType === t ? "1px solid rgba(201,154,60,0.5)" : "1px solid rgba(255,255,255,0.1)", color: entityType === t ? "#f0cf82" : "#94a3b8", padding: "0.45rem 1rem", borderRadius: "2rem", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}
                >
                  {t === "individual" ? "Individual" : "Legal Entity"}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: document hash submission */}
        {step === 2 && (
          <form onSubmit={handleSubmit} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1rem", padding: "1.75rem" }}>
            <h2 style={{ fontWeight: 700, color: "#f1f5f9", fontSize: "1.1rem", margin: "0 0 0.25rem" }}>Step 2: Submit Document</h2>
            <p style={{ fontSize: "0.78rem", color: "#94a3b8", margin: "0 0 0.35rem", lineHeight: 1.6 }}>
              Address: <strong style={{ color: "#e2e8f0", fontFamily: "var(--font-mono, monospace)", fontSize: "0.78rem" }}>{walletAddress}</strong>
            </p>
            <p style={{ fontSize: "0.78rem", color: "#64748b", margin: "0 0 1.25rem", lineHeight: 1.5 }}>
              Document content is hashed (SHA-256) before storage. Raw content is never retained.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "0.4rem" }}>Document Type</label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value as DocType)}
                  style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: "0.5rem", padding: "0.65rem 0.9rem", color: "#f1f5f9", fontSize: "0.88rem", outline: "none" }}
                >
                  {DOCUMENT_TYPES.map((dt) => (
                    <option key={dt} value={dt} style={{ background: "#0c1e35" }}>
                      {dt.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "0.4rem" }}>Document Name</label>
                <input
                  type="text"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  placeholder="e.g. Passport_JohnDoe_2024"
                  required
                  style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: "0.5rem", padding: "0.65rem 0.9rem", color: "#f1f5f9", fontSize: "0.88rem", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "0.4rem" }}>Document Content (will be hashed)</label>
                <textarea
                  value={documentContent}
                  onChange={(e) => setDocumentContent(e.target.value)}
                  placeholder="Paste or type the document content. Only the SHA-256 hash will be stored."
                  required
                  rows={5}
                  style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: "0.5rem", padding: "0.65rem 0.9rem", color: "#f1f5f9", fontSize: "0.83rem", outline: "none", resize: "vertical", boxSizing: "border-box" }}
                />
              </div>

              {result && !result.ok && (
                <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "0.5rem", padding: "0.75rem 1rem" }}>
                  <p style={{ color: "#fca5a5", fontSize: "0.83rem", margin: 0 }}>{result.error}</p>
                </div>
              )}

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button type="button" onClick={() => setStep(1)} style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8", padding: "0.65rem 1.1rem", borderRadius: "0.5rem", fontWeight: 600, fontSize: "0.88rem", border: "1px solid rgba(255,255,255,0.12)", cursor: "pointer" }}>
                  Back
                </button>
                <button type="submit" disabled={submitting} style={{ background: "#c99a3c", color: "#111827", padding: "0.65rem 1.5rem", borderRadius: "0.5rem", fontWeight: 700, fontSize: "0.88rem", border: "none", cursor: "pointer", opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? "Submitting..." : "Submit (Simulation)"}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Step 3: result */}
        {step === 3 && result && (
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1rem", padding: "1.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: result.ok ? "rgba(22,163,74,0.18)" : "rgba(239,68,68,0.18)", border: result.ok ? "1px solid rgba(22,163,74,0.5)" : "1px solid rgba(239,68,68,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>
                {result.ok ? "✓" : "✗"}
              </div>
              <div>
                <p style={{ fontWeight: 700, color: result.ok ? "#4ade80" : "#f87171", fontSize: "0.975rem", margin: 0 }}>
                  {result.ok ? "Document Registered (Simulation)" : "Submission Failed"}
                </p>
                <p style={{ fontSize: "0.75rem", color: "#64748b", margin: "0.15rem 0 0" }}>Simulation-only — no legal KYC compliance determination</p>
              </div>
            </div>

            {result.ok && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {[
                  { label: "KYC Record ID", value: result.kycId },
                  { label: "Document Type", value: result.documentType },
                  { label: "Document Name", value: result.documentName },
                  { label: "SHA-256 Hash", value: result.documentHash, mono: true },
                  { label: "Current Tier", value: result.tier },
                ].map(({ label, value, mono }) => value ? (
                  <div key={label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "0.45rem", padding: "0.6rem 0.85rem", display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
                    <span style={{ fontSize: "0.78rem", color: "#e2e8f0", fontFamily: mono ? "var(--font-mono, monospace)" : undefined, wordBreak: "break-all" }}>{value}</span>
                  </div>
                ) : null)}
              </div>
            )}

            <div style={{ marginTop: "1.5rem", display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
              <button
                onClick={() => { setStep(2); setDocumentContent(""); setDocumentName(""); setResult(null); }}
                style={{ background: "rgba(201,154,60,0.1)", border: "1px solid rgba(201,154,60,0.3)", color: "#f0cf82", padding: "0.55rem 1.1rem", borderRadius: "0.5rem", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}
              >
                Submit Another Document
              </button>
              {result.kycId && (
                <a
                  href={`/api/troptions/kyc/${encodeURIComponent(walletAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#94a3b8", padding: "0.55rem 1.1rem", borderRadius: "0.5rem", fontWeight: 600, fontSize: "0.85rem", textDecoration: "none" }}
                >
                  View KYC Record
                </a>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: "2.5rem", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1.5rem", display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          <Link href="/troptions/compliance/handbooks" style={{ color: "#f0cf82", fontSize: "0.85rem", textDecoration: "none", fontWeight: 600 }}>Download KYC Handbook →</Link>
          <Link href="/troptions/transactions" style={{ color: "#f0cf82", fontSize: "0.85rem", textDecoration: "none", fontWeight: 600 }}>Transaction Hub →</Link>
        </div>
      </div>
    </div>
  );
}
