import type { Metadata } from "next";
import Link from "next/link";
import { SystemStatusBadge } from "@/components/troptions/SystemStatusBadge";

export const metadata: Metadata = {
  title: "Insights — TROPTIONS",
  description:
    "TROPTIONS insights: client portals, namespace systems, sponsor activation, trade desk readiness, AI systems, and RWA infrastructure planning.",
  openGraph: {
    title: "TROPTIONS Insights",
    description:
      "Practical guides on building client portals, namespace systems, sponsor activation, and AI-powered business infrastructure.",
  },
};

const ARTICLES = [
  {
    slug: "client-portals",
    title: "How TROPTIONS Helps Companies Build Client Portals",
    date: "May 2026",
    status: "Client Ready" as const,
    category: "Platform",
    excerpt:
      "A branded client portal is no longer a luxury — it's how modern businesses manage onboarding, documents, and status tracking. Learn how TROPTIONS scopes and delivers portals for operators of all sizes.",
    topics: ["Client Portal", "Onboarding", "Role-Based Access"],
  },
  {
    slug: "namespace-systems",
    title: "What a Namespace System Means for Client Access",
    date: "May 2026",
    status: "Client Ready" as const,
    category: "Cloud",
    excerpt:
      "A namespace is a private, controlled digital environment under your brand. TROPTIONS Cloud uses namespaces to give clients secure, isolated access without shared infrastructure risk.",
    topics: ["Namespace", "Cloud", "Access Control"],
  },
  {
    slug: "sponsor-activation",
    title: "Sponsor Activation Systems for Events and Media",
    date: "May 2026",
    status: "Client Ready" as const,
    category: "Sponsor",
    excerpt:
      "From lead capture to sponsor package delivery, activation tracking, and admin reporting — TROPTIONS builds the digital layer that connects sponsors to results.",
    topics: ["Sponsors", "Events", "Activation"],
  },
  {
    slug: "trade-desk-readiness",
    title: "Trade Desk Readiness vs. Live Financial Execution",
    date: "May 2026",
    status: "Compliance Review Required" as const,
    category: "Trade Desk",
    excerpt:
      "There is a critical difference between being trade-desk-ready (having the documentation and infrastructure to engage institutional counterparties) and live financial execution (which requires separate legal, compliance, and custody review).",
    topics: ["Trade Desk", "Compliance", "Documentation"],
  },
  {
    slug: "ai-systems",
    title: "AI Systems for Business Operations",
    date: "May 2026",
    status: "Client Ready" as const,
    category: "AI",
    excerpt:
      "TROPTIONS designs and integrates AI systems for real business use: automated reporting, intelligent dashboards, workflow automation, and custom model integration. No hype — just functional systems.",
    topics: ["AI", "Automation", "Operations"],
  },
  {
    slug: "rwa-planning",
    title: "RWA Infrastructure Planning Without Compliance Shortcuts",
    date: "May 2026",
    status: "Compliance Review Required" as const,
    category: "RWA",
    excerpt:
      "Real-world asset tokenization has a legitimate architectural phase that comes before any live issuance. TROPTIONS provides the infrastructure framework — but the legal, custody, and compliance pathway must be designed in parallel, not skipped.",
    topics: ["RWA", "Tokenization", "Compliance"],
  },
];

export default function InsightsPage() {
  return (
    <main className="min-h-screen bg-[#071426] text-white">
      <div className="border-b border-[#C9A84C]/20">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">
            TROPTIONS
          </p>
          <h1 className="mt-3 text-4xl font-bold text-white">Insights</h1>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-xl">
            Practical guides on building real infrastructure for real business. No
            speculation. No misleading claims.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-2">
          {ARTICLES.map((article) => (
            <div
              key={article.slug}
              className="flex flex-col rounded-xl border border-white/10 bg-white/5 p-6 hover:border-white/20 transition"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase tracking-widest text-[#C9A84C] font-semibold">
                  {article.category}
                </span>
                <SystemStatusBadge status={article.status} size="sm" />
              </div>
              <h2 className="text-base font-bold text-white mb-2 leading-tight">
                {article.title}
              </h2>
              <p className="text-xs text-slate-400 mb-3">{article.date}</p>
              <p className="text-sm text-slate-300 leading-relaxed flex-1">{article.excerpt}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {article.topics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-slate-400"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center space-y-4">
          <p className="text-slate-400 text-sm">Ready to explore a specific service?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/troptions/services"
              className="rounded-lg bg-[#C9A84C] px-5 py-2.5 text-sm font-semibold text-[#071426] hover:bg-[#e0bd6a] transition"
            >
              View Services
            </Link>
            <Link
              href="/troptions/contact"
              className="rounded-lg border border-[#C9A84C]/50 px-5 py-2.5 text-sm font-semibold text-[#C9A84C] hover:bg-[#C9A84C]/10 transition"
            >
              Submit Inquiry
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
