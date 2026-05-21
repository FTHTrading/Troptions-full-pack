"use client";

import { useState } from "react";
import Link from "next/link";

const TIMEZONES = [
  "Eastern Time (ET)",
  "Central Time (CT)",
  "Mountain Time (MT)",
  "Pacific Time (PT)",
  "Alaska Time (AKT)",
  "Hawaii Time (HT)",
  "UTC",
  "GMT",
  "CET (Europe/Paris)",
  "Other",
];

const CALL_TYPES = [
  { value: "discovery", label: "Discovery Call — Learn about TROPTIONS" },
  { value: "demo", label: "Demo — See the platform in action" },
  { value: "proposal_review", label: "Proposal Review" },
  { value: "onboarding", label: "Onboarding — Start an engagement" },
  { value: "other", label: "Other" },
];

export default function BookPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    preferredDate: "",
    preferredTime: "",
    timezone: "Eastern Time (ET)",
    callType: "discovery",
    notes: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/troptions/booking-requests", {
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

      setStatus("success");
    } catch {
      setErrorMessage("Network error. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <main className="min-h-screen bg-[#071426] text-white flex items-center justify-center px-6">
        <div className="max-w-md w-full rounded-xl border border-emerald-700/50 bg-emerald-950/30 p-10 text-center">
          <div className="text-4xl mb-4">✓</div>
          <h2 className="text-xl font-bold text-white mb-2">Booking Request Received</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            The TROPTIONS team will confirm your preferred time within{" "}
            <strong>1 business day</strong>. Watch for an email confirmation with calendar
            details.
          </p>
          <p className="text-xs text-slate-500 mt-4">
            Note: Calendar confirmation is manual at this stage. No automated scheduling is
            connected yet.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/troptions/services"
              className="rounded-lg border border-white/20 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition"
            >
              View Services
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#071426] text-white">
      <div className="border-b border-[#C9A84C]/20">
        <div className="mx-auto max-w-2xl px-6 py-12">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">
            TROPTIONS
          </p>
          <h1 className="mt-3 text-4xl font-bold text-white">Book a Call</h1>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            Request a discovery call, demo, or onboarding session. The team will confirm
            availability within 1 business day.
          </p>
          <div className="mt-3 rounded-lg border border-yellow-800/40 bg-yellow-950/20 p-3">
            <p className="text-xs text-yellow-300/80">
              Calendar integration is not yet automated. Your request is stored and the team
              will reach out to confirm.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-12">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#C9A84C]/60 focus:outline-none"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#C9A84C]/60 focus:outline-none"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Company
              </label>
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#C9A84C]/60 focus:outline-none"
                placeholder="Your company"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Call Type
              </label>
              <select
                name="callType"
                value={form.callType}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/20 bg-[#071426] px-4 py-2.5 text-sm text-white focus:border-[#C9A84C]/60 focus:outline-none"
              >
                {CALL_TYPES.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Preferred Date
              </label>
              <input
                name="preferredDate"
                type="date"
                value={form.preferredDate}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-[#C9A84C]/60 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Preferred Time
              </label>
              <input
                name="preferredTime"
                type="time"
                value={form.preferredTime}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-[#C9A84C]/60 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Time Zone
            </label>
            <select
              name="timezone"
              value={form.timezone}
              onChange={handleChange}
              className="w-full rounded-lg border border-white/20 bg-[#071426] px-4 py-2.5 text-sm text-white focus:border-[#C9A84C]/60 focus:outline-none"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Notes
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#C9A84C]/60 focus:outline-none resize-none"
              placeholder="Any topics you'd like to cover, questions, or context…"
            />
          </div>

          {status === "error" && (
            <div className="rounded-lg border border-red-700/50 bg-red-950/30 p-3">
              <p className="text-xs text-red-300">{errorMessage}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full rounded-lg bg-[#C9A84C] px-6 py-3 text-sm font-semibold text-[#071426] hover:bg-[#e0bd6a] disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {status === "submitting" ? "Submitting…" : "Request Booking"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            Have a specific project in mind?{" "}
            <Link href="/troptions/contact" className="text-[#C9A84C] hover:underline">
              Submit a full inquiry →
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
