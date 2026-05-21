"use client";

import { useState } from "react";

const MOMENT_TYPES = [
  "fan_badge",
  "restaurant_badge",
  "sponsor_drop",
  "charity_badge",
  "artist_poster",
  "tv_drop",
  "vip_pass",
];

export default function MomentsAdminPage() {
  const [form, setForm] = useState({
    id: "",
    slug: "",
    type: "fan_badge",
    title: "",
    description: "",
    reward: "",
    supply_total: "1000",
    claim_code: "",
    sponsor_name: "",
    charity_name: "",
    mint_enabled: false,
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<string | null>(null);

  function set(key: string, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setResult(null);
    try {
      const res = await fetch("/api/moments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          supply_total: parseInt(form.supply_total, 10),
          reward: form.reward || null,
          sponsor_name: form.sponsor_name || null,
          charity_name: form.charity_name || null,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setResult(`Created: ${data.moment.title} (${data.moment.id})`);
        setStatus("success");
        setForm({
          id: "", slug: "", type: "fan_badge", title: "", description: "",
          reward: "", supply_total: "1000", claim_code: "",
          sponsor_name: "", charity_name: "", mint_enabled: false,
        });
      } else {
        setResult(data.error ?? "Failed to create moment.");
        setStatus("error");
      }
    } catch {
      setResult("Network error.");
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-[#071426] px-6 py-20">
      <div className="max-w-2xl mx-auto">
        <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-widest mb-4">
          TROPTIONS Moments — Admin
        </p>
        <h1 className="text-3xl font-bold text-white mb-10">Create a New Drop</h1>

        <form onSubmit={handleSubmit} className="border border-white/10 bg-[#0b1f36] p-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">ID</label>
              <input className="field-input" value={form.id} onChange={(e) => set("id", e.target.value)} placeholder="mom-007" required />
            </div>
            <div>
              <label className="field-label">Slug</label>
              <input className="field-input" value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="my-drop-slug" required />
            </div>
          </div>

          <div>
            <label className="field-label">Type</label>
            <select
              className="field-input"
              value={form.type}
              onChange={(e) => set("type", e.target.value)}
            >
              {MOMENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="field-label">Title</label>
            <input className="field-input" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Drop title" required />
          </div>

          <div>
            <label className="field-label">Description</label>
            <textarea className="field-input h-20 resize-none" value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="What is this drop?" />
          </div>

          <div>
            <label className="field-label">Reward (optional)</label>
            <input className="field-input" value={form.reward} onChange={(e) => set("reward", e.target.value)} placeholder="Free appetizer, 10% off, etc." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Supply Total</label>
              <input className="field-input" type="number" value={form.supply_total} onChange={(e) => set("supply_total", e.target.value)} min="1" required />
            </div>
            <div>
              <label className="field-label">Claim Code</label>
              <input className="field-input font-mono uppercase" value={form.claim_code} onChange={(e) => set("claim_code", e.target.value.toUpperCase())} placeholder="MYCODE26" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Sponsor Name</label>
              <input className="field-input" value={form.sponsor_name} onChange={(e) => set("sponsor_name", e.target.value)} placeholder="Optional" />
            </div>
            <div>
              <label className="field-label">Charity Name</label>
              <input className="field-input" value={form.charity_name} onChange={(e) => set("charity_name", e.target.value)} placeholder="Optional" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="mint_enabled"
              checked={form.mint_enabled}
              onChange={(e) => set("mint_enabled", e.target.checked)}
              className="accent-[#c99a3c]"
            />
            <label htmlFor="mint_enabled" className="text-[#8a94a6] text-sm">Enable Solana minting</label>
          </div>

          {result && (
            <p className={`text-sm font-medium ${status === "success" ? "text-green-400" : "text-red-400"}`}>
              {result}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-3.5 bg-[#c99a3c] text-[#071426] font-semibold text-sm uppercase tracking-wider hover:bg-[#f0cf82] transition-colors disabled:opacity-50"
          >
            {status === "loading" ? "Creating..." : "Create Drop"}
          </button>
        </form>
      </div>

      <style jsx>{`
        .field-label {
          display: block;
          color: #8a94a6;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.4rem;
        }
        .field-input {
          width: 100%;
          background: #071426;
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          padding: 0.6rem 1rem;
          font-size: 0.875rem;
        }
        .field-input:focus {
          outline: none;
          border-color: rgba(201,154,60,0.6);
        }
        select.field-input option {
          background: #071426;
        }
      `}</style>
    </div>
  );
}
