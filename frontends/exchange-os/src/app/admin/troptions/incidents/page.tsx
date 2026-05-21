import { getIncidentDrillHistory, listIncidentDrills, runIncidentDrill } from "@/lib/troptions/incidentDrills";

export default function IncidentsPage() {
  const drills = listIncidentDrills();
  if (getIncidentDrillHistory(1).length === 0) {
    runIncidentDrill(drills[0].drillId);
  }
  const history = getIncidentDrillHistory(20);

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        <section>
          <p className="text-[#C9A84C] text-xs font-mono uppercase tracking-widest mb-2">Admin - Phase 9</p>
          <h1 className="text-4xl font-bold">Incident Drills</h1>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Drill Catalog</h2>
          <div className="space-y-2">
            {drills.map((drill) => (
              <div key={drill.drillId} className="bg-slate-900 border border-slate-800 rounded p-3 text-sm">
                <p className="text-[#C9A84C] text-xs font-mono">{drill.drillId} - {drill.severity}</p>
                <p className="text-slate-300 mt-1">{drill.name}</p>
                <p className="text-slate-500 text-xs mt-1">{drill.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Recent Drill Runs</h2>
          <div className="space-y-2">
            {history.map((run) => (
              <div key={`${run.drillId}-${run.startedAt}`} className="bg-slate-900 border border-slate-800 rounded p-3 text-sm">
                <p className="text-[#C9A84C] text-xs font-mono">{run.drillId}</p>
                <p className="text-slate-300 mt-1">{run.passed ? "passed" : "failed"}</p>
                <p className="text-slate-500 text-xs mt-1">{run.notes}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
