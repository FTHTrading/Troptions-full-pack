import { getMockAuditEvents } from "@/lib/troptions/infrastructure/mockData";
import { DEPLOYMENT_STATUS_LABELS } from "@/lib/troptions/infrastructure/types";

export const metadata = { title: "Audit Ledger — TROPTIONS Infrastructure" };

export default function AuditPage() {
  const events = getMockAuditEvents();

  return (
    <div className="min-h-screen bg-[#060A12] text-gray-100 p-8">
      <div className="mb-6 rounded border border-yellow-600/60 bg-yellow-900/20 px-4 py-3 text-sm text-yellow-300">
        SIMULATION MODE — Audit events are mock records.
      </div>
      <div className="mb-8">
        <div className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-2">
          TROPTIONS INFRASTRUCTURE CONTROL PLANE
        </div>
        <h1 className="text-2xl font-bold text-white">Audit Ledger</h1>
        <p className="mt-1 text-gray-400 text-sm">Immutable audit trail for all infrastructure actions.</p>
      </div>

      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className="rounded-lg bg-[#0F1923] border border-gray-800 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-mono text-xs text-gray-500 mb-1">{event.id}</div>
                <div className="text-sm font-semibold text-white capitalize">{event.action.replace(/_/g, " ")}</div>
                <div className="text-xs text-gray-400 mt-1">{event.notes}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs text-gray-500">{new Date(event.timestamp).toLocaleString()}</div>
                <div className="text-xs text-gray-400 mt-1">{event.actor}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
