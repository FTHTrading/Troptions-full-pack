import { RELEASE_GATE_REGISTRY, getFailedReleaseGates } from "@/content/troptions/releaseGateRegistry";

export default function AdminReleaseGatesPage() {
  const failed = getFailedReleaseGates();

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-6">
        <h1 className="text-3xl font-bold">Admin - Release Gates</h1>
        <p className="text-slate-400">Failed gates: {failed.length}</p>

        <div className="space-y-3">
          {RELEASE_GATE_REGISTRY.map((gate) => (
            <div key={gate.gateId} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-[#C9A84C] text-xs font-mono">{gate.gateId}</p>
              <p className="text-white text-sm">{gate.gateType}</p>
              <p className="text-slate-400 text-xs">Subject: {gate.subjectId}</p>
              <p className="text-slate-400 text-xs">Status: {gate.status}</p>
              {gate.failingRules.length > 0 && <p className="text-red-300 text-xs">Rules: {gate.failingRules.join(", ")}</p>}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
