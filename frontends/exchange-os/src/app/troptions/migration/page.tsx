import Link from "next/link";
import {
  MIGRATION_NOTICES,
  getPendingMigrations,
} from "@/content/troptions/migrationNoticeRegistry";
import { DISCLAIMERS } from "@/content/troptions/disclaimerRegistry";

export const metadata = {
  title: "Legacy Domain Migration — Troptions",
  description:
    "Troptions legacy domains (troptions.org, troptionsxchange.io, troptions-unitytoken.com) have been audited. Visitors are directed to the institutional compliance portal for verified, current information.",
  robots: { index: false, follow: false },
};

const RISK_COLOR: Record<string, string> = {
  high: "text-red-400 border-red-800/40 bg-red-950/20",
  medium: "text-yellow-400 border-yellow-800/40 bg-yellow-950/10",
  low: "text-green-400 border-green-800/40 bg-green-950/10",
};

export default function LegacyMigrationPage() {
  const pending = getPendingMigrations();

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <div className="border-b border-[#C9A84C]/20 bg-[#0D1B2A]">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-[0.3em]">
            Legacy Domains &amp; Migration
          </p>
          <h1 className="text-3xl font-bold text-white mt-2">Legacy Domain Migration Notice</h1>
          <p className="text-gray-400 mt-2 text-sm max-w-2xl">
            Three Troptions web properties operate on legacy domains with content that
            pre-dates current institutional compliance standards. This page provides
            migration guidance and approved compliance language for each property.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        {/* Master compliance notice */}
        <div className="bg-amber-950/20 border border-amber-700/40 rounded-lg p-5">
          <p className="text-amber-400 font-mono text-xs uppercase tracking-widest mb-2">
            Compliance Notice — 2026-04-27 Site Audit
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">{DISCLAIMERS.MASTER}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Legacy Domains Audited", value: MIGRATION_NOTICES.length, color: "text-white" },
            { label: "Pending Migration", value: pending.length, color: "text-yellow-400" },
            { label: "Audit Date", value: "2026-04-27", color: "text-[#C9A84C]" },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#0D1B2A] border border-slate-700/40 rounded-lg p-4">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                {stat.label}
              </p>
              <p className={`text-xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Explanation */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">What Is a Legacy Domain?</h2>
          <div className="bg-[#0D1B2A] border border-slate-700/40 rounded-lg p-5 text-sm text-gray-300 leading-relaxed space-y-3">
            <p>
              A legacy domain is a web property operated under a prior version of the Troptions
              brand. These sites may contain marketing language, merchant-count claims,
              token-sale content, exchange-readiness language, or asset-backed narratives
              that have not been reviewed against current institutional compliance standards.
            </p>
            <p>
              The Troptions ecosystem has been rebuilt on a{" "}
              <strong className="text-white">
                proof-gated, custody-aware, compliance-controlled
              </strong>{" "}
              institutional OS. Legacy content does not represent the current operational
              or legal status of any Troptions product or service.
            </p>
            <p>
              All legacy domain visitors are directed to the{" "}
              <Link href="/troptions" className="text-[#C9A84C] underline">
                institutional compliance portal
              </Link>{" "}
              for verified, current information.
            </p>
          </div>
        </section>

        {/* Per-domain notices */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4">Legacy Domain Notices</h2>
          <div className="space-y-6">
            {MIGRATION_NOTICES.map((notice) => (
              <div
                key={notice.noticeId}
                className="bg-[#0D1B2A] border border-slate-700/40 rounded-lg overflow-hidden"
              >
                {/* Domain header */}
                <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-slate-700/40">
                  <div>
                    <span className="text-slate-500 font-mono text-xs">{notice.noticeId}</span>
                    <h3 className="text-white font-semibold mt-0.5">{notice.legacyDomainLabel}</h3>
                    <p className="text-slate-400 text-xs mt-0.5">
                      Canonical successor:{" "}
                      <span className="text-[#C9A84C]">{notice.canonicalDomain}</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                      className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border ${RISK_COLOR[notice.riskLevel]}`}
                    >
                      {notice.riskLevel} risk
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      Audit: {notice.auditDate}
                    </span>
                    <span
                      className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border ${
                        notice.migrationComplete
                          ? "text-green-400 border-green-800/40"
                          : "text-yellow-400 border-yellow-800/40"
                      }`}
                    >
                      {notice.migrationComplete ? "migrated" : "pending"}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="px-5 py-4 space-y-4">
                  {/* Banner preview */}
                  <div className="bg-amber-950/30 border border-amber-700/30 rounded p-3">
                    <p className="text-amber-300 text-xs font-semibold mb-1">
                      ▲ Migration Banner — displayed on legacy site
                    </p>
                    <p className="text-amber-200 text-sm font-medium">
                      {notice.bannerHeadline}
                    </p>
                    <p className="text-amber-100/70 text-xs mt-1">{notice.bannerSummary}</p>
                  </div>

                  {/* Full notice */}
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono mb-2">
                      Full Migration Notice
                    </p>
                    <p className="text-gray-300 text-sm leading-relaxed">{notice.pageBody}</p>
                  </div>

                  {/* Compliance note */}
                  <div className="bg-slate-900/60 border border-slate-700/30 rounded p-3">
                    <p className="text-slate-400 text-xs leading-relaxed">
                      {notice.complianceNote}
                    </p>
                  </div>

                  {/* CTA */}
                  <Link
                    href={notice.ctaUrl}
                    className="inline-block bg-[#C9A84C]/10 hover:bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#C9A84C] text-sm px-4 py-2 rounded transition-colors"
                  >
                    {notice.ctaLabel} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What the portal offers */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">
            What the Institutional Portal Provides
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                title: "On-Chain Verification",
                body: "Live XRPL and Stellar facts. Independently verify every claim at the ledger level.",
                route: "/troptions",
              },
              {
                title: "Legal Review Queue",
                body: "Transparent view of every pending legal review, compliance gate, and blocked action.",
                route: "/troptions/legal",
              },
              {
                title: "KYC / Compliance Intake",
                body: "Proof-gated participant onboarding. Every document submission is hashed and tracked.",
                route: "/troptions/kyc",
              },
              {
                title: "Transaction Workflows",
                body: "Documented approval gates and due diligence steps for every transaction category.",
                route: "/troptions/transactions",
              },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.route}
                className="bg-[#0D1B2A] border border-[#C9A84C]/20 hover:border-[#C9A84C]/40 rounded-lg p-4 transition-colors block"
              >
                <p className="text-[#C9A84C] text-sm font-semibold">{item.title}</p>
                <p className="text-gray-400 text-xs mt-1 leading-relaxed">{item.body}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Bottom disclaimers */}
        <div className="bg-[#0D1B2A] border border-slate-700/30 rounded-lg p-5 space-y-3">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
            Legal Disclaimer
          </p>
          <p className="text-slate-400 text-xs leading-relaxed">{DISCLAIMERS.FORWARD_LOOKING}</p>
          <p className="text-slate-400 text-xs leading-relaxed">{DISCLAIMERS.JURISDICTION}</p>
        </div>
      </div>
    </main>
  );
}
