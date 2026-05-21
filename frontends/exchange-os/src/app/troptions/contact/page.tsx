"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { SERVICE_CATEGORY_LABELS, BUDGET_RANGE_LABELS } from "@/lib/troptions/revenue";
import type { ServiceCategory, BudgetRange } from "@/lib/troptions/revenue";

const SERVICE_OPTIONS = Object.entries(SERVICE_CATEGORY_LABELS) as [ServiceCategory, string][];
const BUDGET_OPTIONS = Object.entries(BUDGET_RANGE_LABELS) as [BudgetRange, string][];

function ContactForm() {
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get("service") as ServiceCategory | null;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    budgetRange: "not_specified" as BudgetRange,
    serviceInterest: preselectedService ?? ("not_sure" as ServiceCategory),
    timeline: "",
    message: "",
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
      <div className="rounded-xl border border-emerald-700/50 bg-emerald-950/30 p-8 text-center">
        <div className="text-4xl mb-4">✓</div>
        <h2 className="text-xl font-bold text-white mb-2">Inquiry Received</h2>
        <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
          Thank you. The TROPTIONS team will review your inquiry and be in touch within{" "}
          <strong>1 business day</strong>. Check your email for a confirmation.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/troptions/book"
            className="rounded-lg bg-[#C9A84C] px-5 py-2.5 text-sm font-semibold text-[#071426] hover:bg-[#e0bd6a] transition"
          >
            Book a Call
          </Link>
          <Link
            href="/troptions/services"
            className="rounded-lg border border-white/20 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition"
          >
            View Services
          </Link>
        </div>
      </div>
    );
  }

  return (
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
            Phone
          </label>
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#C9A84C]/60 focus:outline-none"
            placeholder="+1 (555) 000-0000"
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
            Website
          </label>
          <input
            name="website"
            type="url"
            value={form.website}
            onChange={handleChange}
            className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#C9A84C]/60 focus:outline-none"
            placeholder="https://yoursite.com"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Budget Range
          </label>
          <select
            name="budgetRange"
            value={form.budgetRange}
            onChange={handleChange}
            className="w-full rounded-lg border border-white/20 bg-[#071426] px-4 py-2.5 text-sm text-white focus:border-[#C9A84C]/60 focus:outline-none"
          >
            {BUDGET_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Interested Service
          </label>
          <select
            name="serviceInterest"
            value={form.serviceInterest}
            onChange={handleChange}
            className="w-full rounded-lg border border-white/20 bg-[#071426] px-4 py-2.5 text-sm text-white focus:border-[#C9A84C]/60 focus:outline-none"
          >
            {SERVICE_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Timeline
          </label>
          <input
            name="timeline"
            value={form.timeline}
            onChange={handleChange}
            className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#C9A84C]/60 focus:outline-none"
            placeholder="e.g. Within 30 days, Q3 2026"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
          Message <span className="text-red-400">*</span>
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#C9A84C]/60 focus:outline-none resize-none"
          placeholder="Describe your project, use case, or questions..."
        />
      </div>

      {/* Consent */}
      <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-4">
        <input
          id="consent"
          name="consentGiven"
          type="checkbox"
          checked={form.consentGiven}
          onChange={handleChange}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[#C9A84C]"
          required
        />
        <label htmlFor="consent" className="text-xs text-slate-400 leading-relaxed">
          I consent to TROPTIONS collecting and using this information to respond to my inquiry.
          I understand this is not an offer or sale of securities, financial products, or
          guaranteed funding. I can request deletion of my data at any time.
        </label>
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
        {status === "submitting" ? "Submitting…" : "Submit Inquiry"}
      </button>
    </form>
  );
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#071426] text-white">
      <div className="border-b border-[#C9A84C]/20">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">
            Get in Touch
          </p>
          <h1 className="mt-3 text-4xl font-bold text-white">Submit an Inquiry</h1>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            Tell us about your project. We will review your submission and respond within{" "}
            <strong>1 business day</strong>.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-12">
        <Suspense fallback={<div className="text-slate-400 text-sm">Loading form…</div>}>
          <ContactForm />
        </Suspense>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Prefer to book a call instead?{" "}
            <Link href="/troptions/book" className="text-[#C9A84C] hover:underline">
              Book a discovery call →
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
