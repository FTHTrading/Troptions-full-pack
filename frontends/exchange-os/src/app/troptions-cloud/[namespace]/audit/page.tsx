import type { Metadata } from "next";
import Link from "next/link";
import { TROPTIONS_NAMESPACES } from "@/content/troptions-cloud/namespaceRegistry";

interface Props {
  params: Promise<{ namespace: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { namespace } = await params;
  return { title: `Audit Log — ${namespace} — Troptions Cloud` };
}

export async function generateStaticParams() {
  return TROPTIONS_NAMESPACES.map((n) => ({ namespace: n.slug }));
}

const MOCK_AUDIT_EVENTS = [
  { id: "audit-001", timestamp: "2025-01-15T10:32:00Z", actor: "system", action: "namespace.created", resource: "namespace", status: "success" },
  { id: "audit-002", timestamp: "2025-01-15T10:33:00Z", actor: "system", action: "membership.plan.assigned", resource: "membership", status: "success" },
  { id: "audit-003", timestamp: "2025-01-15T10:34:00Z", actor: "system", action: "module.enabled", resource: "ai_studio", status: "success" },
  { id: "audit-004", timestamp: "2025-01-15T10:35:00Z", actor: "system", action: "simulation.mode.enforced", resource: "namespace", status: "success" },
  { id: "audit-005", timestamp: "2025-01-15T10:36:00Z", actor: "system", action: "control_hub.check.passed", resource: "control_hub", status: "success" },
];

export default async function AuditLogPage({ params }: Props) {
  const { namespace } = await params;

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <nav className="mb-4 text-[10px] uppercase tracking-[0.2em] text-gray-500">
            <Link href={`/troptions-cloud/${namespace}`} className="hover:text-white transition-colors">Dashboard</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Audit Log</span>
          </nav>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">Troptions Cloud</p>
          <h1 className="text-2xl font-bold text-white">Audit Log</h1>
          <p className="mt-2 text-sm text-gray-400">
            Read-only record of all namespace events, configuration changes, and access grants.
          </p>
        </div>

        {/* Simulation Banner */}
        <div className="mb-8 rounded-xl border border-yellow-800/50 bg-yellow-900/10 p-4">
          <p className="text-xs font-semibold text-yellow-400 uppercase tracking-[0.2em] mb-1">Simulation Only</p>
          <p className="text-xs text-yellow-300/80">This audit log is scaffolded. Events shown are simulated only.</p>
        </div>

        {/* Filter bar (disabled) */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <input
            disabled
            type="text"
            placeholder="Search events..."
            className="cursor-not-allowed flex-1 rounded-lg border border-gray-700 bg-[#0F1923] px-4 py-2.5 text-sm text-gray-600"
          />
          <select
            disabled
            className="cursor-not-allowed rounded-lg border border-gray-700 bg-[#0F1923] px-4 py-2.5 text-sm text-gray-600"
          >
            <option>All Actions</option>
          </select>
          <button
            disabled
            className="cursor-not-allowed rounded-lg border border-gray-700 bg-[#0F1923] px-4 py-2 text-xs font-semibold text-gray-600"
          >
            Export — Simulation Only
          </button>
        </div>

        {/* Audit Events Table */}
        <div className="rounded-xl border border-gray-800 bg-[#0F1923] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">Timestamp</th>
                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">Actor</th>
                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">Action</th>
                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">Resource</th>
                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {MOCK_AUDIT_EVENTS.map((event) => (
                  <tr key={event.id}>
                    <td className="px-5 py-3 font-mono text-[11px] text-gray-500">{event.timestamp}</td>
                    <td className="px-5 py-3 text-xs text-gray-400">{event.actor}</td>
                    <td className="px-5 py-3 font-mono text-xs text-gray-300">{event.action}</td>
                    <td className="px-5 py-3 text-xs text-gray-400">{event.resource}</td>
                    <td className="px-5 py-3">
                      <span className="rounded-full bg-green-900/30 px-2 py-0.5 text-[10px] text-green-400">
                        {event.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-6 text-[10px] text-gray-600">
          Audit events are immutable and retained per Troptions data retention policy.
          This log is read-only. Events shown are simulated only.
        </p>
      </div>
    </div>
  );
}
