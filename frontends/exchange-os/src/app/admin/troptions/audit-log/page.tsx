import { getRecentAuditEvents, verifyAuditChain } from "@/lib/troptions/auditLogEngine";

export default function AdminAuditLogPage() {
  const events = getRecentAuditEvents(100);
  const verification = verifyAuditChain();

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-6">
        <h1 className="text-3xl font-bold">Admin - Audit Log</h1>
        <p className="text-slate-400">Chain valid: {String(verification.valid)} | Events: {verification.totalEvents}</p>

        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.eventId} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-[#C9A84C] text-xs font-mono">{event.eventId}</p>
              <p className="text-white text-sm">{event.actionType}</p>
              <p className="text-slate-400 text-xs">{event.subjectType}: {event.subjectId}</p>
              <p className="text-slate-400 text-xs">{event.previousState} -&gt; {event.nextState}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
