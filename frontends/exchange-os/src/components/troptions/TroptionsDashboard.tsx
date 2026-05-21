"use client";

import {
  TROPTIONS_SUB_BRANDS,
  TROPTIONS_ECOSYSTEM_META,
  getTroptionsSubBrandsByPriority,
  type TroptionsSubBrand,
} from "@/content/troptions/troptionsEcosystemRegistry";
import {
  getTroptionsEcosystemStatus,
  listTroptionsTransactionCapabilities,
  createTroptionsReadinessReport,
} from "@/lib/troptions/troptionsLedgerAdapter";
import Link from "next/link";

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  accent?: "gold" | "green" | "red" | "yellow";
}) {
  const valueColor =
    accent === "green"
      ? "text-green-400"
      : accent === "red"
      ? "text-red-400"
      : accent === "yellow"
      ? "text-yellow-400"
      : "text-white";

  return (
    <article className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-500">{label}</p>
      <p className={`mt-3 text-3xl font-bold ${valueColor}`}>{value}</p>
      <p className="mt-2 text-xs leading-6 text-slate-400">{sub}</p>
    </article>
  );
}

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "active"
      ? "bg-green-900/30 text-green-300 border-green-700/40"
      : status === "needs-review"
      ? "bg-red-900/30 text-red-300 border-red-700/40"
      : status === "draft"
      ? "bg-yellow-900/30 text-yellow-300 border-yellow-700/40"
      : "bg-slate-800 text-slate-400 border-slate-700";
  return (
    <span className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded-full border ${color}`}>{status}</span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const color =
    priority === "critical"
      ? "text-red-400"
      : priority === "high"
      ? "text-yellow-400"
      : priority === "medium"
      ? "text-blue-400"
      : "text-slate-500";
  return <span className={`font-mono text-[10px] uppercase ${color}`}>{priority}</span>;
}

function SubBrandCard({ brand }: { brand: TroptionsSubBrand }) {
  return (
    <article className="rounded-xl border border-slate-800 bg-[#0D1B2A] p-5">
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#C9A84C]">{brand.category}</p>
        <StatusBadge status={brand.status} />
      </div>
      <h3 className="text-base font-semibold text-white mb-1">{brand.displayName}</h3>
      <p className="text-xs text-slate-400 mb-3 leading-relaxed line-clamp-2">{brand.purpose}</p>
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] text-slate-500">{brand.domain}</p>
        <PriorityBadge priority={brand.integrationPriority} />
      </div>
    </article>
  );
}

// ─── Main Dashboard Component ────────────────────────────────────────────────

export function TroptionsDashboard() {
  const ecosystemStatus = getTroptionsEcosystemStatus();
  const capabilities = listTroptionsTransactionCapabilities();
  const report = createTroptionsReadinessReport();
  const highPriority = getTroptionsSubBrandsByPriority("high");

  return (
    <div className="space-y-10">
      {/* Simulation notice */}
      <div className="border border-red-700/40 bg-red-900/10 rounded-xl p-5 text-red-200 text-xs leading-relaxed">
        <strong className="block mb-1 uppercase tracking-widest text-red-400 font-mono text-[10px]">
          ⚠ Simulation-Only Dashboard
        </strong>
        All data shown here is registry-sourced and simulation-only. No live transactions, token issuance,
        liquidity movements, or financial execution are represented. Live execution requires explicit approval gate
        sign-off, legal review, board authorization, and compliance clearance.
      </div>

      {/* Ecosystem overview stats */}
      <section>
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-500 mb-4">
          Ecosystem Overview
        </p>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Sub-Brands"
            value={String(ecosystemStatus.totalSubBrands)}
            sub="Brands registered in the ecosystem registry."
            accent="gold"
          />
          <StatCard
            label="Active"
            value={String(ecosystemStatus.activeSubBrands)}
            sub="Sub-brands in active status."
            accent="green"
          />
          <StatCard
            label="Draft"
            value={String(ecosystemStatus.draftSubBrands)}
            sub="Brands pending review or activation."
            accent="yellow"
          />
          <StatCard
            label="Live Capabilities"
            value="0"
            sub="Zero live financial operations enabled. All execution gated."
            accent="red"
          />
        </div>
      </section>

      {/* Primary domains */}
      <section className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-500 mb-4">Primary Domains</p>
        <div className="flex flex-wrap gap-2">
          {TROPTIONS_ECOSYSTEM_META.primaryDomains.map((domain) => (
            <span
              key={domain}
              className="bg-[#0D1B2A] border border-[#C9A84C]/30 text-[#C9A84C] font-mono text-xs px-3 py-1 rounded-full"
            >
              {domain}
            </span>
          ))}
        </div>
      </section>

      {/* Sub-brand cards */}
      <section>
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-500 mb-4">
          All Sub-Brands ({TROPTIONS_SUB_BRANDS.length})
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TROPTIONS_SUB_BRANDS.map((brand) => (
            <SubBrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      </section>

      {/* Transaction capabilities */}
      <section className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-500 mb-4">
          Transaction Capabilities ({capabilities.length} total · 0 live)
        </p>
        <div className="space-y-3">
          {capabilities.map((cap) => (
            <div
              key={cap.id}
              className="border border-slate-800 rounded-xl bg-[#0D1B2A] p-4 flex items-start justify-between gap-4"
            >
              <div>
                <p className="text-sm font-medium text-white mb-1">{cap.name}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{cap.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {cap.requiredApprovals.map((a) => (
                    <span key={a} className="bg-slate-800 text-slate-400 font-mono text-[10px] px-2 py-0.5 rounded">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="font-mono text-[10px] uppercase bg-yellow-900/30 text-yellow-300 border border-yellow-700/40 px-2 py-0.5 rounded-full">
                  {cap.state}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Readiness report */}
      <section className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-500 mb-4">Readiness Report</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Pending board approval */}
          <div className="bg-[#0D1B2A] rounded-xl border border-slate-800 p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-red-400 mb-3">
              Pending Board Approval
            </p>
            <ul className="space-y-1.5">
              {report.pendingBoardApproval.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-slate-400">
                  <span className="text-red-400 mt-0.5">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Active gates */}
          <div className="bg-[#0D1B2A] rounded-xl border border-slate-800 p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-green-400 mb-3">
              Active Approval Gates
            </p>
            <ul className="space-y-1.5">
              {report.approvalGatesActive.slice(0, 6).map((gate) => (
                <li key={gate} className="flex items-start gap-2 text-xs text-slate-400">
                  <span className="text-green-400 mt-0.5">✓</span>
                  {gate}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Documents needed */}
      <section className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-500 mb-4">Manual Actions Required</p>
        <ul className="space-y-2">
          {report.manualActionsRequired.map((action) => (
            <li key={action} className="flex items-start gap-3 text-sm text-slate-300">
              <span className="text-[#C9A84C] mt-0.5 shrink-0">›</span>
              {action}
            </li>
          ))}
        </ul>
      </section>

      {/* High-priority next actions */}
      <section className="rounded-2xl border border-[#C9A84C]/20 bg-[#0D1B2A] p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#C9A84C] mb-4">
          High-Priority Next Actions
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {highPriority.map((brand) => (
            <div key={brand.id} className="bg-[#111827] border border-slate-800 rounded-xl p-4">
              <p className="text-sm font-medium text-white mb-2">{brand.displayName}</p>
              <ul className="space-y-1.5">
                {brand.nextActions.slice(0, 3).map((action) => (
                  <li key={action} className="flex items-start gap-2 text-xs text-slate-400">
                    <span className="text-[#C9A84C] mt-0.5">›</span>
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Navigation to sub-brand public pages */}
      <section className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-500 mb-4">
          Public Sub-Brand Pages
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Troptions Xchange", href: "/troptions/xchange" },
            { label: "Unity Token", href: "/troptions/unity-token" },
            { label: "University", href: "/troptions/university" },
            { label: "TV Network / Media", href: "/troptions/media" },
            { label: "Real Estate", href: "/troptions/real-estate" },
            { label: "Solar", href: "/troptions/solar" },
            { label: "Mobile Medical", href: "/troptions/mobile-medical" },
            { label: "Ledger Overview", href: "/troptions/ledger" },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-xs font-mono text-[#C9A84C] border border-[#C9A84C]/30 px-3 py-2 rounded-lg hover:bg-[#C9A84C]/10 transition-colors text-center"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
