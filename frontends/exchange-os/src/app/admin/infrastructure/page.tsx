import Link from "next/link";
import { getMockInfraDashboardSummary } from "@/lib/troptions/infrastructure/mockData";

export const metadata = {
  title: "Infrastructure Control Plane — TROPTIONS Admin",
};

export default function InfrastructureDashboard() {
  const summary = getMockInfraDashboardSummary();

  return (
    <div className="min-h-screen bg-[#060A12] text-gray-100 p-8">
      {/* Simulation Banner */}
      <div className="mb-6 rounded border border-yellow-600/60 bg-yellow-900/20 px-4 py-3 text-sm text-yellow-300">
        SIMULATION MODE — This dashboard reflects build-verified software state.
        Live execution requires production-ready provider adapters and compliance approval.
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-2">
          TROPTIONS INFRASTRUCTURE CONTROL PLANE
        </div>
        <h1 className="text-3xl font-bold text-white">Infrastructure Dashboard</h1>
        <p className="mt-2 text-gray-400 text-sm">
          Namespace provisioning, system factory, deployment readiness, adapter registry, audit ledger.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Namespaces</div>
          <div className="text-3xl font-bold text-white">{summary.totalNamespaces}</div>
        </div>
        <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Live</div>
          <div className="text-3xl font-bold text-green-400">{summary.liveNamespaces}</div>
        </div>
        <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Provisioning</div>
          <div className="text-3xl font-bold text-yellow-400">{summary.systemsProvisioning}</div>
        </div>
        <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Pending Deployments</div>
          <div className="text-3xl font-bold text-orange-400">{summary.deploymentsPending}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Adapters Needing Credentials</div>
          <div className="text-3xl font-bold text-orange-300">{summary.adaptersNeedingCredentials}</div>
        </div>
        <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Compliance Warnings</div>
          <div className="text-3xl font-bold text-yellow-300">{summary.complianceWarnings}</div>
        </div>
        <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Billing Ready</div>
          <div className="text-3xl font-bold text-blue-300">{summary.billingReadyCount}</div>
        </div>
        <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Audit Events (24h)</div>
          <div className="text-3xl font-bold text-gray-300">{summary.recentAuditEvents.length}</div>
        </div>
      </div>

      {/* Nav Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { href: "/admin/infrastructure/namespaces", label: "Namespace Registry", desc: "View and manage client namespaces." },
          { href: "/admin/infrastructure/systems", label: "System Factory", desc: "Create and track client systems." },
          { href: "/admin/infrastructure/deployments", label: "Deployment Readiness", desc: "Deployment targets and records." },
          { href: "/admin/infrastructure/adapters", label: "Adapter Registry", desc: "Provider adapter configuration." },
          { href: "/admin/infrastructure/health", label: "Health Checks", desc: "Infrastructure health status." },
          { href: "/admin/infrastructure/audit", label: "Audit Ledger", desc: "All infrastructure audit events." },
          { href: "/admin/infrastructure/billing-readiness", label: "Billing Readiness", desc: "Billing configuration status." },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-lg bg-[#0F1923] border border-gray-800 p-5 hover:border-[#C9A84C]/50 transition-colors"
          >
            <div className="font-semibold text-white text-sm mb-1">{item.label}</div>
            <div className="text-xs text-gray-500">{item.desc}</div>
          </Link>
        ))}
      </div>

      {/* Disabled CTA */}
      <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-6">
        <div className="text-sm font-semibold text-[#C9A84C] mb-3">Provision New Namespace</div>
        <p className="text-xs text-gray-500 mb-4">
          Live namespace provisioning requires deployment provider configuration and billing readiness approval.
        </p>
        <button
          disabled
          className="cursor-not-allowed opacity-50 rounded bg-[#C9A84C] px-5 py-2 text-sm font-semibold text-black"
        >
          Provision Namespace — Credentials Required
        </button>
      </div>
    </div>
  );
}
