import { evaluateEscalationPolicies, getEscalationLog } from "@/lib/troptions/alertEscalation";

export default async function EscalationsPage() {
  await evaluateEscalationPolicies();
  const escalations = getEscalationLog(100);

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-6">
        <section>
          <p className="text-[#C9A84C] text-xs font-mono uppercase tracking-widest mb-2">Admin - Phase 9</p>
          <h1 className="text-4xl font-bold">Alert Escalations</h1>
        </section>

        <section className="space-y-2">
          {escalations.map((item) => (
            <div key={item.escalationId} className="bg-slate-900 border border-slate-800 rounded p-3 text-sm">
              <p className="text-[#C9A84C] font-mono text-xs">{item.escalationId} - {item.level}</p>
              <p className="text-slate-300 mt-1">{item.trigger}</p>
              <p className="text-slate-500 text-xs mt-1">{item.details}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
