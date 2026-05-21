import { TRANSITION_REGISTRY } from "@/content/troptions/transitionRegistry";

export default function AdminTransitionsPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-6">
        <h1 className="text-3xl font-bold">Admin - Transitions</h1>

        <div className="space-y-3">
          {TRANSITION_REGISTRY.map((rule, index) => (
            <div key={`${rule.subjectType}-${rule.fromStatus}-${rule.toStatus}-${index}`} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-[#C9A84C] text-xs font-mono">{rule.subjectType}</p>
              <p className="text-white text-sm">{rule.fromStatus} -&gt; {rule.toStatus}</p>
              <p className="text-slate-400 text-xs">Roles: {rule.allowedRoles.join(", ")}</p>
              <p className="text-slate-400 text-xs">Required evidence: {rule.requiredEvidence.join(", ") || "none"}</p>
              <p className="text-slate-400 text-xs">Required approvals: {rule.requiredApprovals.join(", ") || "none"}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
