import { SLA_REGISTRY, getBreachedSla } from "@/content/troptions/slaRegistry";

export default function AdminSlaPage() {
  const breached = getBreachedSla();

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-6">
        <h1 className="text-3xl font-bold">Admin - SLA Timers</h1>
        <p className="text-slate-400">Breached timers: {breached.length}</p>

        <div className="space-y-3">
          {SLA_REGISTRY.map((timer) => (
            <div key={timer.slaId} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-[#C9A84C] text-xs font-mono">{timer.slaId}</p>
              <p className="text-white text-sm">{timer.type}</p>
              <p className="text-slate-400 text-xs">Subject: {timer.subjectId}</p>
              <p className="text-slate-400 text-xs">Due: {timer.dueAt}</p>
              <p className="text-slate-400 text-xs">Status: {timer.status}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
