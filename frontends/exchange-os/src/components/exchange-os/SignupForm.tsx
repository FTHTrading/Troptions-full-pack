"use client";

import { useState } from "react";
import { PARTNER_PACKAGES, PARTNER_TYPES } from "@/config/exchange-os/packages";

export function SignupForm() {
  const [selectedPackage, setSelectedPackage] = useState(PARTNER_PACKAGES[0].id);
  const [partnerType, setPartnerType] = useState<string>(PARTNER_TYPES[0]);
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/exchange-os/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          partnerType,
          packageInterest: selectedPackage,
          source: "exchange-os-signup",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Submission failed");
      setStatus("ok");
    } catch (e) {
      setStatus("error");
      setErrorMsg(e instanceof Error ? e.message : "Submission failed");
    }
  }

  if (status === "ok") {
    return (
      <div className="xos-card" style={{ maxWidth: 560, textAlign: "center", padding: "3rem 2rem" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>✓</div>
        <h2 style={{ fontWeight: 800, color: "var(--xos-green)", marginBottom: "0.5rem" }}>
          We&apos;ve got your info!
        </h2>
        <p style={{ color: "var(--xos-text-muted)", fontSize: "0.9rem" }}>
          Our team will be in touch to help you get started on the TROPTIONS Exchange OS.
        </p>
      </div>
    );
  }

  const pkg = PARTNER_PACKAGES.find((p) => p.id === selectedPackage);

  return (
    <div className="xos-card" style={{ maxWidth: 560 }}>
      <div className="xos-gold-line" />
      <h2 style={{ fontWeight: 800, color: "var(--xos-text)", fontSize: "1.25rem", marginBottom: "0.375rem" }}>
        Get Started
      </h2>
      <p style={{ color: "var(--xos-text-muted)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
        Tell us about your use case and we&apos;ll set up your Exchange OS access.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {/* Partner type */}
        <div>
          <label className="xos-label">I am a…</label>
          <select
            className="xos-input"
            value={partnerType}
            onChange={(e) => setPartnerType(e.target.value)}
          >
            {PARTNER_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Package */}
        <div>
          <label className="xos-label">Package Interest</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {PARTNER_PACKAGES.map((p) => (
              <label
                key={p.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.625rem",
                  cursor: "pointer",
                  padding: "0.625rem 0.75rem",
                  borderRadius: "var(--xos-radius)",
                  border: `1px solid ${selectedPackage === p.id ? "var(--xos-gold-muted)" : "var(--xos-border)"}`,
                  background: selectedPackage === p.id ? "var(--xos-gold-glow)" : "transparent",
                }}
              >
                <input
                  type="radio"
                  name="package"
                  value={p.id}
                  checked={selectedPackage === p.id}
                  onChange={() => setSelectedPackage(p.id)}
                  style={{ marginTop: 2 }}
                />
                <div>
                  <div style={{ fontWeight: 600, color: "var(--xos-text)", fontSize: "0.875rem" }}>
                    {p.name}
                    {p.price && (
                      <span style={{ marginLeft: 8, color: "var(--xos-gold)", fontSize: "0.78rem" }}>
                        {p.price}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--xos-text-muted)" }}>
                    {p.priceNote}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Name + email */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}>
          <div>
            <label className="xos-label">Name *</label>
            <input className="xos-input" placeholder="Your name" required
              value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="xos-label">Email *</label>
            <input className="xos-input" type="email" placeholder="you@example.com" required
              value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </div>
        </div>

        <div>
          <label className="xos-label">Company / Project (optional)</label>
          <input className="xos-input" placeholder="Optional"
            value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} />
        </div>

        <div>
          <label className="xos-label">Message (optional)</label>
          <textarea className="xos-input" rows={3} placeholder="Tell us more about your use case…"
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            style={{ resize: "vertical" }} />
        </div>

        {/* Package summary */}
        {pkg && (
          <div
            style={{
              background: "var(--xos-surface-2)",
              border: "1px solid var(--xos-border)",
              borderRadius: "var(--xos-radius)",
              padding: "0.75rem",
              fontSize: "0.78rem",
            }}
          >
            <div style={{ fontWeight: 700, color: "var(--xos-gold)", marginBottom: "0.375rem" }}>
              {pkg.name} — {pkg.price ?? "Custom"}
            </div>
            <ul style={{ color: "var(--xos-text-muted)", paddingLeft: "1rem", margin: 0 }}>
              {pkg.features.slice(0, 3).map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        )}

        {errorMsg && <div className="xos-risk-box">{errorMsg}</div>}

        <button
          type="submit"
          className="xos-btn xos-btn--primary"
          disabled={status === "sending"}
          style={{ width: "100%", justifyContent: "center" }}
        >
          {status === "sending" ? "Sending…" : "Get Started with TROPTIONS Exchange OS →"}
        </button>
      </form>
    </div>
  );
}
