import { APPROVAL_REGISTRY, getPendingApprovals } from "@/content/troptions/approvalRegistry";

export default function AdminApprovalsPage() {
  const pending = getPendingApprovals();

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-6">
        <h1 className="text-3xl font-bold">Admin - Approvals</h1>
        <p className="text-slate-400">Requested/In-review approvals: {pending.length}</p>

        <div className="space-y-3">
          {APPROVAL_REGISTRY.map((approval) => (
            <div key={approval.approvalId} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-[#C9A84C] text-xs font-mono">{approval.approvalId}</p>
              <p className="text-white font-semibold">{approval.approvalType}</p>
              <p className="text-slate-400 text-xs">{approval.subjectType}: {approval.subjectId}</p>
              <p className="text-slate-400 text-xs">Required role: {approval.requiredRole}</p>
              <p className="text-slate-400 text-xs">Status: {approval.status}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
