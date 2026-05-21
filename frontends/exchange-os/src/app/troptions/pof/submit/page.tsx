"use client";

import { useState } from "react";
import Link from "next/link";

const G = {
  bg:     "#FFFFFF",
  bg2:    "#F8F7F4",
  border: "#D6D1C8",
  text:   "#1A1714",
  text2:  "#5C574F",
  text3:  "#8B857C",
  navy:   "#1B3259",
  gold:   "#7A5C14",
  green:  "#1A5233",
  red:    "#991B1B",
} as const;

const serif = "'Palatino Linotype','Book Antiqua',Georgia,serif";

type Status = "idle" | "submitting" | "success" | "error";

export default function PofSubmitPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError]   = useState("");
  const [pofId, setPofId]   = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    const fd  = new FormData(e.currentTarget);
    const raw = Object.fromEntries(fd.entries());
    const body = {
      name:           raw.name,
      email:          raw.email,
      phone:          raw.phone || undefined,
      company:        raw.company || undefined,
      entityType:     raw.entityType,
      amount:         raw.amount,
      currency:       raw.currency,
      sourceOfFunds:  raw.sourceOfFunds,
      purpose:        raw.purpose,
      jurisdiction:   raw.jurisdiction || undefined,
      bankName:       raw.bankName || undefined,
      transactionType: raw.transactionType,
      timeline:       raw.timeline || undefined,
      notes:          raw.notes || undefined,
      consentGiven:   raw.consent === "yes",
    };
    if (!body.consentGiven) {
      setError("You must consent to the compliance disclosure to submit.");
      setStatus("error");
      return;
    }
    try {
      const res  = await fetch("/api/troptions/pof/submit-evidence", { method: "POST", body: JSON.stringify(body), headers: { "Content-Type": "application/json" } });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Submission failed");
      setPofId(data.pofId);
      setStatus("success");
    } catch (err) {
      setError((err as Error).message);
      setStatus("error");
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", border: `1px solid ${G.border}`, padding: "0.6rem 0.85rem",
    fontSize: "0.9rem", color: G.text, background: G.bg, outline: "none",
    borderRadius: 2, boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: "0.75rem", textTransform: "uppercase",
    letterSpacing: "0.1em", color: G.text3, marginBottom: "0.35rem",
  };
  const fieldStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 0 };

  if (status === "success") {
    return (
      <div style={{ background: G.bg, minHeight: "100vh", padding: "5rem 2rem", fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>
        <div style={{ maxWidth: 580, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem", color: G.green }}>&#10003;</div>
          <h1 style={{ fontFamily: serif, fontSize: "1.6rem", color: G.navy, marginBottom: "0.75rem" }}>POF Request Received</h1>
          <p style={{ color: G.text2, marginBottom: "0.5rem" }}>Your Proof of Funds request has been recorded in the TROPTIONS compliance system.</p>
          <p style={{ fontFamily: "'Courier New',monospace", fontSize: "0.85rem", background: G.bg2, border: `1px solid ${G.border}`, padding: "0.6rem 1rem", display: "inline-block", marginBottom: "2rem", borderRadius: 2 }}>
            Reference: <strong>{pofId}</strong>
          </p>
          <p style={{ color: G.text3, fontSize: "0.88rem", marginBottom: "2rem" }}>A compliance team member will review your submission and contact you at the email provided. KYC/AML screening will be conducted as part of the review process.</p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/troptions/broker-dealer" style={{ background: G.navy, color: "#fff", padding: "0.7rem 1.75rem", fontSize: "0.88rem", textDecoration: "none", borderRadius: 3 }}>Broker-Dealer Services</Link>
            <Link href="/portal/troptions/dashboard" style={{ border: `1px solid ${G.navy}`, color: G.navy, padding: "0.7rem 1.5rem", fontSize: "0.88rem", textDecoration: "none", borderRadius: 3 }}>Client Portal</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: G.bg, minHeight: "100vh", color: G.text, fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>

      <nav style={{ borderBottom: `1px solid ${G.border}`, padding: "0 2rem", height: 58, display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <Link href="/troptions"               style={{ fontFamily: serif, fontWeight: 700, color: G.navy, textDecoration: "none", letterSpacing: "0.12em", textTransform: "uppercase", fontSize: "0.9rem" }}>TROPTIONS</Link>
        <span style={{ color: G.border }}>›</span>
        <Link href="/troptions/broker-dealer" style={{ color: G.text2, fontSize: "0.85rem", textDecoration: "none" }}>Broker-Dealer</Link>
        <span style={{ color: G.border }}>›</span>
        <span style={{ color: G.text3, fontSize: "0.85rem" }}>Proof of Funds</span>
      </nav>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "4rem 2rem" }}>
        <p style={{ fontFamily: serif, fontSize: "0.72rem", letterSpacing: "0.25em", color: G.gold, textTransform: "uppercase", marginBottom: "0.85rem" }}>
          Proof of Funds Request
        </p>
        <h1 style={{ fontFamily: serif, fontSize: "clamp(1.4rem,2.5vw,2rem)", color: G.navy, fontWeight: 400, marginBottom: "0.75rem", lineHeight: 1.25 }}>
          Submit a POF Request
        </h1>
        <p style={{ color: G.text2, fontSize: "0.95rem", lineHeight: 1.8, marginBottom: "2.5rem", maxWidth: 620 }}>
          Complete the form below. Your submission is recorded in the TROPTIONS compliance system. All fields are used for AML/KYC screening and should be accurate. Submissions are reviewed by the compliance team — typically within 1–2 business days.
        </p>

        {/* Compliance notice */}
        <div style={{ background: "rgba(122,92,20,0.06)", border: `1px solid rgba(122,92,20,0.25)`, borderRadius: 3, padding: "0.9rem 1.1rem", marginBottom: "2.5rem" }}>
          <p style={{ fontSize: "0.8rem", color: G.gold, margin: 0, lineHeight: 1.65 }}>
            <strong>COMPLIANCE NOTICE:</strong> This form is subject to AML, KYB, and sanctions screening. Providing false information may result in immediate rejection and reporting obligations. TROPTIONS does not store identity documents — only the attestation data entered below.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Contact */}
          <fieldset style={{ border: `1px solid ${G.border}`, padding: "1.5rem", margin: 0, borderRadius: 2 }}>
            <legend style={{ fontFamily: serif, fontSize: "0.82rem", padding: "0 0.5rem", color: G.navy }}>Contact Information</legend>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Full Name *</label>
                <input name="name" required style={inputStyle} placeholder="Legal name" />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Email *</label>
                <input name="email" type="email" required style={inputStyle} placeholder="you@company.com" />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Phone</label>
                <input name="phone" style={inputStyle} placeholder="+1 (555) 000-0000" />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Company / Entity</label>
                <input name="company" style={inputStyle} placeholder="Legal entity name" />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Entity Type *</label>
                <select name="entityType" required style={inputStyle}>
                  <option value="individual">Individual</option>
                  <option value="corporation">Corporation</option>
                  <option value="llc">LLC</option>
                  <option value="partnership">Partnership</option>
                  <option value="trust">Trust</option>
                  <option value="fund">Fund</option>
                  <option value="bank">Bank / FI</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Jurisdiction</label>
                <input name="jurisdiction" style={inputStyle} placeholder="Country / State of incorporation" />
              </div>
            </div>
          </fieldset>

          {/* Funds details */}
          <fieldset style={{ border: `1px solid ${G.border}`, padding: "1.5rem", margin: 0, borderRadius: 2 }}>
            <legend style={{ fontFamily: serif, fontSize: "0.82rem", padding: "0 0.5rem", color: G.navy }}>Funds Details</legend>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Amount *</label>
                <input name="amount" required style={inputStyle} placeholder="e.g. 50,000,000" />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Currency *</label>
                <select name="currency" required style={inputStyle}>
                  <option value="USD">USD</option>
                  <option value="USDC">USDC</option>
                  <option value="USDT">USDT</option>
                  <option value="EUR">EUR</option>
                  <option value="XRP">XRP</option>
                  <option value="BTC">BTC</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div style={{ ...fieldStyle, gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Source of Funds *</label>
                <input name="sourceOfFunds" required style={inputStyle} placeholder="e.g. Business revenue, investment portfolio, real estate proceeds..." />
              </div>
              <div style={{ ...fieldStyle, gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Purpose of Transaction *</label>
                <input name="purpose" required style={inputStyle} placeholder="e.g. Real estate acquisition, RWA tokenization, trade settlement..." />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Transaction Type *</label>
                <select name="transactionType" required style={inputStyle}>
                  <option value="deal_funding">Deal Funding</option>
                  <option value="escrow_release">Escrow Release</option>
                  <option value="counterparty_diligence">Counterparty Diligence</option>
                  <option value="rwa_purchase">RWA Purchase</option>
                  <option value="sblc">SBLC / Banking Instrument</option>
                  <option value="otc_settlement">OTC Settlement</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Bank / Custodian Name</label>
                <input name="bankName" style={inputStyle} placeholder="Issuing bank or custodian" />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Timeline</label>
                <input name="timeline" style={inputStyle} placeholder="e.g. Immediate, 30 days, Q3 2026" />
              </div>
              <div style={{ ...fieldStyle, gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Additional Notes</label>
                <textarea name="notes" rows={3} style={{ ...inputStyle, resize: "vertical" }} placeholder="Any additional context for the compliance review..." />
              </div>
            </div>
          </fieldset>

          {/* Consent */}
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
            <input type="checkbox" name="consent" value="yes" id="consent" style={{ marginTop: "0.2rem", flexShrink: 0 }} />
            <label htmlFor="consent" style={{ fontSize: "0.85rem", color: G.text2, lineHeight: 1.6 }}>
              I confirm that the information provided is accurate to the best of my knowledge. I consent to AML/KYB screening and understand this submission may be shared with compliance counterparties as required by law. I have read the{" "}
              <Link href="/troptions/compliance" style={{ color: G.navy }}>TROPTIONS Compliance Framework</Link>.
            </label>
          </div>

          {status === "error" && (
            <div style={{ background: "rgba(153,27,27,0.07)", border: `1px solid ${G.red}`, padding: "0.75rem 1rem", borderRadius: 2, color: G.red, fontSize: "0.87rem" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            style={{
              background: status === "submitting" ? "#9CA3AF" : G.navy,
              color: "#fff", border: "none", padding: "0.85rem 2.5rem",
              fontSize: "0.9rem", fontWeight: 600, cursor: status === "submitting" ? "not-allowed" : "pointer",
              borderRadius: 3, alignSelf: "flex-start",
            }}
          >
            {status === "submitting" ? "Submitting…" : "Submit POF Request"}
          </button>
        </form>
      </div>
    </div>
  );
}
