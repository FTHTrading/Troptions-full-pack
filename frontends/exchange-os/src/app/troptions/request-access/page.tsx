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

const PORTAL_REASONS = [
  { value: "rwa_tokenization", label: "RWA Tokenization" },
  { value: "trade_desk_access", label: "Trade Desk Access" },
  { value: "stablecoin_settlement", label: "Stablecoin Settlement" },
  { value: "proof_of_funds_review", label: "Proof of Funds Review" },
  { value: "kyc_onboarding", label: "KYC / CIS Onboarding" },
  { value: "investor_reporting", label: "Investor Reporting" },
  { value: "general_inquiry", label: "General Institutional Access" },
];

export default function RequestAccessPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    title: "",
    purpose: "",
    portalReason: "",
    consentGiven: false,
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
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
      const res = await fetch("/api/troptions/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          message: `Portal access request.\nTitle: ${form.title}\nReason: ${form.portalReason}\n\n${form.purpose}`,
          serviceInterest: "client_portal_setup",
          consentGiven: form.consentGiven,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error ?? "Submission failed. Please try again.");
        setStatus("error");
        return;
      }

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
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <p style={{ fontSize: "0.72rem", letterSpacing: "0.28em", color: G.text3, textTransform: "uppercase", marginBottom: "0.75rem" }}>
            <Link href="/troptions" style={{ color: G.text3, textDecoration: "none" }}>TROPTIONS</Link>
            {" / "}Request Portal Access
          </p>
          <h1 style={{ fontFamily: serif, fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 400, color: G.navyD, marginBottom: "1rem", lineHeight: 1.2 }}>
            Request Client Portal Access
          </h1>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: G.text2, maxWidth: 560 }}>
            The TROPTIONS client portal is available to qualified institutional counterparties. Submit your access request and a team member will review and provision your account within 3 business days.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "3rem 2rem" }}>
        {status === "success" ? (
          <div style={{ border: `1px solid ${G.green}`, padding: "2.5rem", background: "#F0F7F3" }}>
            <h2 style={{ fontFamily: serif, fontSize: "1.3rem", color: G.green, marginBottom: "1rem" }}>
              Access Request Submitted
            </h2>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: G.text2, marginBottom: "1.5rem" }}>
              Your request has been received. The TROPTIONS team will review your eligibility and reach out at the email provided within <strong>3 business days</strong>.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/troptions" style={{ background: G.navy, color: "#fff", padding: "0.7rem 1.75rem", fontSize: "0.88rem", fontWeight: 600, textDecoration: "none", borderRadius: 3 }}>
                Return to TROPTIONS Home
              </Link>
              <Link href="/troptions/proof-room" style={{ border: `1px solid ${G.navy}`, color: G.navy, padding: "0.7rem 1.75rem", fontSize: "0.88rem", textDecoration: "none", borderRadius: 3 }}>
                Browse Proof Room
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gap: "1.25rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={labelStyle}>Full Name <span style={{ color: "#8B1A1A" }}>*</span></label>
                  <input style={inputStyle} name="name" value={form.name} onChange={handleChange} required placeholder="First and last name" />
                </div>
                <div>
                  <label style={labelStyle}>Email Address <span style={{ color: "#8B1A1A" }}>*</span></label>
                  <input style={inputStyle} name="email" type="email" value={form.email} onChange={handleChange} required placeholder="your@institution.com" />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={labelStyle}>Company / Institution <span style={{ color: "#8B1A1A" }}>*</span></label>
                  <input style={inputStyle} name="company" value={form.company} onChange={handleChange} required placeholder="Firm or entity name" />
                </div>
                <div>
                  <label style={labelStyle}>Role / Title</label>
                  <input style={inputStyle} name="title" value={form.title} onChange={handleChange} placeholder="e.g., Managing Director, CFO" />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Primary Reason for Access <span style={{ color: "#8B1A1A" }}>*</span></label>
                <select style={inputStyle} name="portalReason" value={form.portalReason} onChange={handleChange} required>
                  <option value="">Select reason…</option>
                  {PORTAL_REASONS.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Purpose / Additional Context <span style={{ color: "#8B1A1A" }}>*</span></label>
                <textarea
                  style={{ ...inputStyle, minHeight: 90, resize: "vertical" }}
                  name="purpose"
                  value={form.purpose}
                  onChange={handleChange}
                  required
                  placeholder="Describe your use case, transaction type, or what you are looking to access through the portal…"
                />
              </div>

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
                    I consent to TROPTIONS reviewing my access request and contacting me at the provided email. I confirm the information submitted is accurate. I understand access is provisioned at TROPTIONS&apos; sole discretion based on eligibility criteria.
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
                  {status === "submitting" ? "Submitting…" : "Submit Access Request"}
                </button>
                <Link href="/troptions/contact" style={{ color: G.text2, fontSize: "0.85rem", textDecoration: "underline" }}>
                  Send a general inquiry instead
                </Link>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
