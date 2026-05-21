"use client";

import { useState } from "react";
import Link from "next/link";

const G = {
  bg: "#FFFFFF", bg2: "#F8F7F4",
  border: "#D6D1C8", border2: "#E8E4DC",
  text: "#1A1714", text2: "#5C574F", text3: "#8B857C",
  navy: "#1B3259", navyD: "#122040",
  green: "#1A5233",
} as const;

const serif = "'Palatino Linotype','Book Antiqua',Georgia,serif";

const ENTITY_TYPES = [
  { value: "individual", label: "Individual" },
  { value: "corporation", label: "Corporation" },
  { value: "llc", label: "LLC" },
  { value: "trust", label: "Trust / Foundation" },
  { value: "partnership", label: "Partnership" },
  { value: "fund", label: "Investment Fund" },
  { value: "other", label: "Other Entity" },
];

const TRANSACTION_TYPES = [
  { value: "", label: "Select transaction type…" },
  { value: "asset_purchase", label: "Asset Purchase" },
  { value: "rwa_tokenization", label: "RWA Tokenization" },
  { value: "stablecoin_settlement", label: "Stablecoin Settlement" },
  { value: "trade_desk", label: "Trade Desk Engagement" },
  { value: "sblc_issuance", label: "SBLC / Banking Instrument" },
  { value: "custody", label: "Custody Arrangement" },
  { value: "kyc_compliance", label: "KYC / Compliance Review" },
  { value: "other", label: "Other" },
];

const AMOUNT_RANGES = [
  { value: "", label: "Select estimated amount…" },
  { value: "under_100k", label: "Under $100,000" },
  { value: "100k_to_500k", label: "$100,000 – $500,000" },
  { value: "500k_to_1m", label: "$500,000 – $1,000,000" },
  { value: "1m_to_5m", label: "$1M – $5M" },
  { value: "5m_to_25m", label: "$5M – $25M" },
  { value: "25m_to_100m", label: "$25M – $100M" },
  { value: "over_100m", label: "Over $100M" },
  { value: "not_specified", label: "Prefer not to say" },
];

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: `1px solid ${G.border}`,
  padding: "0.6rem 0.75rem",
  fontSize: "0.88rem",
  color: G.text,
  background: G.bg,
  outline: "none",
  fontFamily: "inherit",
};
const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.72rem",
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: G.text3,
  marginBottom: "0.35rem",
  fontWeight: 600,
};

export default function CisPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    entityType: "individual",
    jurisdiction: "",
    purpose: "",
    transactionType: "",
    estimatedAmount: "",
    consentGiven: false,
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submittedId, setSubmittedId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/troptions/cis-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error ?? "Submission failed. Please try again.");
        setStatus("error");
        return;
      }

      setSubmittedId(data.id ?? "");
      setStatus("success");
    } catch {
      setErrorMessage("Network error. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div style={{ background: G.bg, color: G.text, minHeight: "100vh", fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif" }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${G.border}`, padding: "3rem 2rem 2.5rem" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={{ fontSize: "0.72rem", letterSpacing: "0.28em", color: G.text3, textTransform: "uppercase", marginBottom: "0.75rem" }}>
            <Link href="/troptions" style={{ color: G.text3, textDecoration: "none" }}>TROPTIONS</Link>
            {" / "}Client Identification Statement
          </p>
          <h1 style={{ fontFamily: serif, fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 400, color: G.navyD, marginBottom: "1rem", lineHeight: 1.2 }}>
            Client Identification Statement (CIS)
          </h1>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: G.text2, maxWidth: 560 }}>
            Complete this form to initiate a formal client identification process with TROPTIONS. Upon submission you will receive your pre-filled CIS package and a compliance team member will be in contact within 2 business days.
          </p>
          <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", background: G.bg2, border: `1px solid ${G.border2}`, fontSize: "0.83rem", color: G.text2 }}>
            Already have your documents?{" "}
            <a
              href="/troptions/downloads/bryan-stone-kyc-cis-master-file.pdf"
              style={{ color: G.navy, textDecoration: "underline" }}
              download
            >
              Download the CIS template directly
            </a>
          </div>
        </div>
      </div>

      {/* Form / Success */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "3rem 2rem" }}>
        {status === "success" ? (
          <div style={{ border: `1px solid ${G.green}`, padding: "2.5rem", background: "#F0F7F3" }}>
            <h2 style={{ fontFamily: serif, fontSize: "1.3rem", color: G.green, marginBottom: "1rem" }}>
              CIS Request Received
            </h2>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: G.text2, marginBottom: "1.5rem" }}>
              Your client identification request has been submitted{submittedId ? ` (ref: ${submittedId.slice(0, 8).toUpperCase()})` : ""}. The TROPTIONS compliance team will review and be in touch within <strong>2 business days</strong>.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <a
                href="/troptions/downloads/bryan-stone-kyc-cis-master-file.pdf"
                download
                style={{ background: G.navy, color: "#fff", padding: "0.7rem 1.75rem", fontSize: "0.88rem", fontWeight: 600, textDecoration: "none", borderRadius: 3 }}
              >
                Download CIS Package (PDF)
              </a>
              <a
                href="/troptions/downloads/kyc-onboarding-handbook.pdf"
                download
                style={{ border: `1px solid ${G.navy}`, color: G.navy, padding: "0.7rem 1.75rem", fontSize: "0.88rem", textDecoration: "none", borderRadius: 3 }}
              >
                KYC Onboarding Handbook
              </a>
              <Link href="/troptions/book" style={{ color: G.text2, padding: "0.7rem 1.25rem", fontSize: "0.88rem", textDecoration: "underline" }}>
                Schedule a Call →
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gap: "1.25rem" }}>
              {/* Personal details */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={labelStyle}>Full Legal Name <span style={{ color: "#8B1A1A" }}>*</span></label>
                  <input style={inputStyle} name="name" value={form.name} onChange={handleChange} required placeholder="As it appears on ID" />
                </div>
                <div>
                  <label style={labelStyle}>Email Address <span style={{ color: "#8B1A1A" }}>*</span></label>
                  <input style={inputStyle} name="email" type="email" value={form.email} onChange={handleChange} required placeholder="your@email.com" />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input style={inputStyle} name="phone" value={form.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" />
                </div>
                <div>
                  <label style={labelStyle}>Company / Entity Name</label>
                  <input style={inputStyle} name="company" value={form.company} onChange={handleChange} placeholder="Entity name (if applicable)" />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={labelStyle}>Entity Type <span style={{ color: "#8B1A1A" }}>*</span></label>
                  <select style={inputStyle} name="entityType" value={form.entityType} onChange={handleChange} required>
                    {ENTITY_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Jurisdiction / Country</label>
                  <input style={inputStyle} name="jurisdiction" value={form.jurisdiction} onChange={handleChange} placeholder="Country or state of incorporation" />
                </div>
              </div>

              {/* Transaction details */}
              <div style={{ borderTop: `1px solid ${G.border2}`, paddingTop: "1.25rem", display: "grid", gap: "1rem" }}>
                <div>
                  <label style={labelStyle}>Purpose of Engagement <span style={{ color: "#8B1A1A" }}>*</span></label>
                  <textarea
                    style={{ ...inputStyle, minHeight: 90, resize: "vertical" }}
                    name="purpose"
                    value={form.purpose}
                    onChange={handleChange}
                    required
                    placeholder="Describe the nature of your engagement with TROPTIONS (e.g., RWA tokenization, trade desk inquiry, stablecoin settlement, KYC review…)"
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={labelStyle}>Transaction Type</label>
                    <select style={inputStyle} name="transactionType" value={form.transactionType} onChange={handleChange}>
                      {TRANSACTION_TYPES.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Estimated Amount</label>
                    <select style={inputStyle} name="estimatedAmount" value={form.estimatedAmount} onChange={handleChange}>
                      {AMOUNT_RANGES.map(a => (
                        <option key={a.value} value={a.value}>{a.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Consent */}
              <div style={{ background: G.bg2, padding: "1.25rem", border: `1px solid ${G.border2}` }}>
                <label style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    name="consentGiven"
                    checked={form.consentGiven}
                    onChange={handleChange}
                    style={{ marginTop: 3, flexShrink: 0 }}
                  />
                  <span style={{ fontSize: "0.85rem", lineHeight: 1.7, color: G.text2 }}>
                    I consent to TROPTIONS collecting and processing my identification information for client onboarding, compliance screening, and KYC/KYB purposes. I confirm the information provided is accurate to the best of my knowledge. I understand this is a compliance requirement and not a guarantee of engagement.
                  </span>
                </label>
              </div>

              {status === "error" && (
                <div style={{ background: "#FDF2F2", border: "1px solid #C53030", padding: "0.75rem 1rem" }}>
                  <p style={{ color: "#8B1A1A", fontSize: "0.88rem", margin: 0 }}>{errorMessage}</p>
                </div>
              )}

              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                <button
                  type="submit"
                  disabled={status === "submitting" || !form.consentGiven}
                  style={{
                    background: form.consentGiven ? G.navy : G.text3,
                    color: "#fff",
                    padding: "0.75rem 2.5rem",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    border: "none",
                    cursor: form.consentGiven && status !== "submitting" ? "pointer" : "not-allowed",
                    fontFamily: "inherit",
                    borderRadius: 3,
                  }}
                >
                  {status === "submitting" ? "Submitting…" : "Submit CIS Request"}
                </button>
                <a
                  href="/troptions/downloads/bryan-stone-kyc-cis-master-file.pdf"
                  download
                  style={{ color: G.text2, fontSize: "0.85rem", textDecoration: "underline" }}
                >
                  Or download blank template
                </a>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

