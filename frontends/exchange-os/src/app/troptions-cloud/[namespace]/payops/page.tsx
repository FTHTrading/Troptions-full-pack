import type { Metadata } from "next";
import Link from "next/link";
import {
  TROPTIONS_NAMESPACES,
  getNamespace,
} from "@/content/troptions-cloud/namespaceRegistry";
import { getMockPayOpsClient, getMockAuditEvents } from "@/lib/troptions/payops/mockData";
import { getMockAdapters } from "@/lib/troptions/payops/mockData";
import { PAYOUT_STATUS_COLORS } from "@/lib/troptions/payops/status";

interface Props {
  params: Promise<{ namespace: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { namespace } = await params;
  return {
    title: `PayOps — ${namespace} — TROPTIONS Cloud`,
    description: `TROPTIONS PayOps payout operations for namespace ${namespace}`,
  };
}

export async function generateStaticParams() {
  return TROPTIONS_NAMESPACES.map((n) => ({ namespace: n.slug }));
}

const SUMMARY_LINKS = [
  { label: "Payees", href: "payops/payees", key: "totalPayees" },
  { label: "Funding", href: "payops/funding", key: "fundingVaultStatus" },
  { label: "Batches", href: "payops/batches", key: "pendingBatches" },
  { label: "Receipts", href: "payops/receipts", key: "executedPayouts" },
  { label: "Compliance", href: "payops/compliance", key: "complianceAlerts" },
  { label: "Adapters", href: "payops/adapters", key: "activeAdapters" },
];

export default async function PayOpsDashboardPage({ params }: Props) {
  const { namespace } = await params;
  const ns = getNamespace(namespace);
  const client = getMockPayOpsClient(namespace);
  const recentAudit = getMockAuditEvents(`ns-payops-${namespace}`).slice(0, 5);
  const adapters = getMockAdapters(`ns-payops-${namespace}`);
  const activeAdapters = adapters.filter((a) => a.isConfigured);

  const summaryCards = [
    { label: "Total Payees", value: client.totalPayees, sub: `${client.activePayees} active` },
    { label: "Pending Approval", value: client.pendingBatches, sub: "batches", color: "text-yellow-400" },
    { label: "Approved / Not Executed", value: client.approvedNotExecuted, sub: "awaiting adapter", color: "text-blue-400" },
    { label: "Executed Payouts", value: client.executedPayouts, sub: "live adapter required", color: "text-gray-500" },
    { label: "Blocked by Compliance", value: client.blockedByCompliance, sub: "requires review", color: "text-red-400" },
    { label: "Compliance Alerts", value: client.complianceAlerts, sub: "open items", color: "text-orange-400" },
  ];

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-5xl">
        {/* Breadcrumb */}
        <nav className="mb-4 text-[10px] uppercase tracking-[0.2em] text-gray-500">
          <Link href={`/troptions-cloud/${namespace}`} className="hover:text-white transition-colors">
            Dashboard
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white">PayOps</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">
            TROPTIONS PAYOPS
          </p>
          <h1 className="text-2xl font-bold text-white">
            {ns?.displayName ?? namespace} — Payout Operations
          </h1>
          <p className="mt-2 text-sm text-gray-400 max-w-2xl">
            Manage payee records, payout batches, funding sources, compliance checks, and receipt generation inside your TROPTIONS namespace.
          </p>
        </div>

        {/* Simulation Banner */}
        <div className="mb-6 rounded-xl border border-yellow-800/50 bg-yellow-900/10 p-4">
          <p className="text-xs font-semibold text-yellow-400 uppercase tracking-[0.2em] mb-1">Simulation Only</p>
          <p className="text-xs text-yellow-300/80">
            All payout data shown is demonstration data. No real funds, real payees, or live transactions are present.
          </p>
        </div>

        {/* PayOps Advisory */}
        <div className="mb-8 rounded-xl border border-orange-800/40 bg-orange-950/30 p-5">
          <p className="text-xs font-semibold text-orange-400 uppercase tracking-[0.2em] mb-2">
            TROPTIONS PayOps — Execution Adapter Required
          </p>
          <p className="text-xs text-orange-200/80 leading-relaxed">
            TROPTIONS PayOps is a payout operations and management system. It organizes payee records, approval workflows, compliance documentation, and receipt packets inside your namespace.{" "}
            <strong className="text-orange-300">TROPTIONS does not hold funds, process payments, or move money on your behalf.</strong>{" "}
            Payout execution requires a configured, approved, live execution adapter (bank partner, payroll partner, or stablecoin partner). No adapter is configured for this namespace.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {summaryCards.map((card) => (
            <div key={card.label} className="rounded-xl border border-gray-800 bg-[#0F1923] p-4">
              <p className="text-[10px] uppercase tracking-[0.15em] text-gray-500">{card.label}</p>
              <p className={`mt-1 text-3xl font-bold ${card.color ?? "text-white"}`}>
                {card.value}
              </p>
              <p className="mt-1 text-[11px] text-gray-500">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Funding Vault Status */}
        <div className="mb-8 rounded-xl border border-gray-800 bg-[#0F1923] p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">Funding Vault</p>
            <span className="rounded-full border border-gray-700 bg-gray-800 px-2 py-0.5 text-[10px] text-gray-400 uppercase tracking-wide">
              Manual Record Only
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-500">$0.00</p>
          <p className="mt-1 text-[11px] text-orange-300/70">
            Vault balance is a manual record. No banking adapter is confirming actual available funds.
          </p>
          <Link
            href={`/troptions-cloud/${namespace}/payops/funding`}
            className="mt-3 inline-block text-[11px] text-[#C9A84C] hover:underline"
          >
            Manage Funding Sources →
          </Link>
        </div>

        {/* Active Adapters */}
        <div className="mb-8 rounded-xl border border-gray-800 bg-[#0F1923] p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">Active Adapters</p>
            <Link href={`/troptions-cloud/${namespace}/payops/adapters`} className="text-[11px] text-[#C9A84C] hover:underline">
              View All →
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeAdapters.map((a) => (
              <span
                key={a.category}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-700 bg-gray-800 px-3 py-1 text-[11px] text-gray-300"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                {a.name}
              </span>
            ))}
            {activeAdapters.length === 0 && (
              <p className="text-xs text-gray-500">No adapters configured.</p>
            )}
          </div>
          <p className="mt-3 text-[10px] text-gray-600">
            Mock and Manual Proof adapters active. No execution-capable adapters configured.
          </p>
        </div>

        {/* Recent Audit Events */}
        <div className="mb-8 rounded-xl border border-gray-800 bg-[#0F1923] p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">Recent Activity</p>
            <Link href={`/troptions-cloud/${namespace}/payops/batches`} className="text-[11px] text-[#C9A84C] hover:underline">
              View Batches →
            </Link>
          </div>
          <div className="divide-y divide-gray-800">
            {recentAudit.map((ev) => (
              <div key={ev.id} className="flex items-start justify-between gap-4 py-2">
                <div>
                  <p className="text-[12px] text-gray-300 font-mono">{ev.action}</p>
                  <p className="text-[10px] text-gray-600">{ev.actorType} · {ev.resourceType} · {ev.resourceId}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide font-medium ${
                      ev.outcome === "success"
                        ? "border-green-800 text-green-400"
                        : ev.outcome === "blocked"
                        ? "border-red-800 text-red-400"
                        : "border-yellow-800 text-yellow-400"
                    }`}
                  >
                    {ev.outcome}
                  </span>
                  <p className="mt-0.5 text-[10px] text-gray-600">
                    {new Date(ev.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {[
            { label: "Payees", description: "Manage payee records and compliance", href: `payops/payees`, badge: `${client.totalPayees}` },
            { label: "Funding", description: "Funding sources and vault records", href: `payops/funding` },
            { label: "Batches", description: "Payout batches and approval workflow", href: `payops/batches`, badge: `${client.pendingBatches} pending` },
            { label: "Receipts", description: "Approved and executed receipt records", href: `payops/receipts` },
            { label: "Compliance", description: "KYC, KYB, W-9/W-8, sanctions", href: `payops/compliance`, badge: client.complianceAlerts > 0 ? `${client.complianceAlerts} alerts` : undefined },
            { label: "Adapters", description: "Configure execution adapters", href: `payops/adapters` },
            { label: "Settings", description: "Namespace PayOps settings", href: `payops/settings` },
          ].map((card) => (
            <Link
              key={card.label}
              href={`/troptions-cloud/${namespace}/${card.href}`}
              className="group rounded-xl border border-gray-800 bg-[#0F1923] p-4 hover:border-[#C9A84C]/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-sm font-semibold text-white group-hover:text-[#C9A84C] transition-colors">
                  {card.label}
                </p>
                {card.badge && (
                  <span className="shrink-0 rounded-full bg-gray-800 px-2 py-0.5 text-[10px] text-gray-400">
                    {card.badge}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-500">{card.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
