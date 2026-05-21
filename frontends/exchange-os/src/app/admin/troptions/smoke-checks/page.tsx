import { runProductionSmokeChecks } from "@/lib/troptions/productionSmokeChecks";
import { getLatestSmokeCheckResult } from "@/lib/troptions/smokeCheckState";

export default async function SmokeChecksPage() {
  const existing = getLatestSmokeCheckResult();
  const result = existing ?? (await runProductionSmokeChecks());

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-6">
        <section>
          <p className="text-[#C9A84C] text-xs font-mono uppercase tracking-widest mb-2">Admin - Phase 9</p>
          <h1 className="text-4xl font-bold">Production Smoke Checks</h1>
          <p className="text-slate-400 mt-2 text-sm">Status: {result.ok ? "pass" : "fail"}</p>
        </section>

        <section className="space-y-2">
          {Object.entries(result.checks).map(([check, detail]) => (
            <div key={check} className="bg-slate-900 border border-slate-800 rounded p-3 text-sm">
              <p className="text-[#C9A84C] text-xs font-mono">{check}</p>
              <p className="text-slate-300 mt-1">{detail.pass ? "pass" : "fail"}</p>
              <p className="text-slate-500 text-xs mt-1">{detail.detail}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
