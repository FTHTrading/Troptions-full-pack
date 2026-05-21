"use client";
// TROPTIONS Exchange OS — Sponsor Campaign Builder

import { useState } from "react";

interface CampaignForm {
  campaignName: string;
  sponsorName: string;
  sponsorEmail: string;
  offerTitle: string;
  offerDescription: string;
  discountOrReward: string;
  targetAudience: string;
  budget: string;
  startDate: string;
  endDate: string;
}

const AUDIENCE_OPTIONS = [
  "Token holders (all)",
  "TROPTIONS holders only",
  "New account signups",
  "Liquidity providers",
  "API developers",
  "Event attendees",
];

export function SponsorCampaignBuilder() {
  const [form, setForm] = useState<CampaignForm>({
    campaignName: "",
    sponsorName: "",
    sponsorEmail: "",
    offerTitle: "",
    offerDescription: "",
    discountOrReward: "",
    targetAudience: AUDIENCE_OPTIONS[0],
    budget: "",
    startDate: "",
    endDate: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(key: keyof CampaignForm, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/exchange-os/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.sponsorName,
          email: form.sponsorEmail,
          partnerType: "Sponsor",
          company: form.sponsorName,
          message: `Campaign: ${form.campaignName}\nOffer: ${form.offerTitle}\n${form.offerDescription}\nAudience: ${form.targetAudience}\nBudget: ${form.budget}`,
          source: "sponsor-campaign-builder",
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Submission failed");
      }
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submission failed");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="xos-card xos-card--gold" style={{ padding: "2rem", textAlign: "center" }}>
        <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>✓</div>
        <div style={{ fontWeight: 800, color: "var(--xos-gold)", fontSize: "1.1rem", marginBottom: "0.5rem" }}>
          Campaign Submitted
        </div>
        <p style={{ color: "var(--xos-text-muted)", fontSize: "0.85rem" }}>
          We&apos;ll review your campaign and follow up within 2 business days.
        </p>
      </div>
    );
  }

  return (
    <form className="xos-card" style={{ padding: "1.5rem" }} onSubmit={handleSubmit}>
      <div className="xos-gold-line" />
      <h3 style={{ color: "var(--xos-gold)", fontWeight: 800, marginBottom: "1rem" }}>
        ◈ Build a Sponsor Campaign
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <div style={{ gridColumn: "1 / -1" }}>
          <label className="xos-label">Campaign Name</label>
          <input className="xos-input" required placeholder="e.g. Summer Liquidity Drive" value={form.campaignName} onChange={(e) => update("campaignName", e.target.value)} />
        </div>
        <div>
          <label className="xos-label">Sponsor Name *</label>
          <input className="xos-input" required placeholder="Your name" value={form.sponsorName} onChange={(e) => update("sponsorName", e.target.value)} />
        </div>
        <div>
          <label className="xos-label">Email *</label>
          <input className="xos-input" required type="email" placeholder="you@company.com" value={form.sponsorEmail} onChange={(e) => update("sponsorEmail", e.target.value)} />
        </div>
        <div>
          <label className="xos-label">Offer Title</label>
          <input className="xos-input" placeholder="e.g. 15% off at FTH Store" value={form.offerTitle} onChange={(e) => update("offerTitle", e.target.value)} />
        </div>
        <div>
          <label className="xos-label">Discount / Reward Value</label>
          <input className="xos-input" placeholder="e.g. $10 TROPTIONS credit" value={form.discountOrReward} onChange={(e) => update("discountOrReward", e.target.value)} />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label className="xos-label">Offer Description</label>
          <textarea className="xos-input" style={{ minHeight: 80, resize: "vertical" }} placeholder="Describe your offer…" value={form.offerDescription} onChange={(e) => update("offerDescription", e.target.value)} />
        </div>
        <div>
          <label className="xos-label">Target Audience</label>
          <select className="xos-input" value={form.targetAudience} onChange={(e) => update("targetAudience", e.target.value)}>
            {AUDIENCE_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label className="xos-label">Campaign Budget (USD)</label>
          <input className="xos-input" placeholder="e.g. 500" value={form.budget} onChange={(e) => update("budget", e.target.value)} />
        </div>
        <div>
          <label className="xos-label">Start Date</label>
          <input className="xos-input" type="date" value={form.startDate} onChange={(e) => update("startDate", e.target.value)} />
        </div>
        <div>
          <label className="xos-label">End Date</label>
          <input className="xos-input" type="date" value={form.endDate} onChange={(e) => update("endDate", e.target.value)} />
        </div>
      </div>

      {error && <div className="xos-risk-box" style={{ marginTop: "1rem" }}>{error}</div>}

      <div style={{ display: "flex", gap: "1rem", marginTop: "1.25rem", alignItems: "center" }}>
        <button type="submit" className="xos-btn xos-btn--primary" disabled={loading}>
          {loading ? "Submitting…" : "◈ Submit Campaign"}
        </button>
        <span style={{ fontSize: "0.72rem", color: "var(--xos-text-subtle)" }}>
          No payment required to submit. We&apos;ll contact you to discuss terms.
        </span>
      </div>
    </form>
  );
}
