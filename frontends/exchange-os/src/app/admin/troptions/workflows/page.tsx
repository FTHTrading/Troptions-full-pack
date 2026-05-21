import Link from "next/link";
import { WORKFLOW_REGISTRY } from "@/content/troptions/workflowRegistry";

export default function AdminWorkflowsPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-10">
        <section>
          <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-widest mb-3">Admin - Workflow Command</p>
          <h1 className="text-4xl font-bold">Troptions Workflow Admin</h1>
          <p className="text-slate-400 mt-2">Operational workflow control across intake, proof, legal, custody, board, investor, funding, issuance, settlement, and exceptions.</p>
        </section>

        <section className="grid md:grid-cols-2 gap-4">
          {WORKFLOW_REGISTRY.map((workflow) => (
            <div key={workflow.workflowId} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#C9A84C] font-mono text-xs">{workflow.workflowId}</span>
                <span className="text-xs uppercase">{workflow.status}</span>
              </div>
              <h2 className="text-white font-semibold">{workflow.name}</h2>
              <p className="text-slate-400 text-sm mt-2">{workflow.description}</p>
            </div>
          ))}
        </section>

        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
          <Link href="/admin/troptions/workflows/intake" className="border border-slate-700 rounded-lg p-3 hover:border-[#C9A84C]">Admin Intake</Link>
          <Link href="/admin/troptions/workflows/proof" className="border border-slate-700 rounded-lg p-3 hover:border-[#C9A84C]">Admin Proof</Link>
          <Link href="/admin/troptions/workflows/legal" className="border border-slate-700 rounded-lg p-3 hover:border-[#C9A84C]">Admin Legal</Link>
          <Link href="/admin/troptions/workflows/custody" className="border border-slate-700 rounded-lg p-3 hover:border-[#C9A84C]">Admin Custody</Link>
          <Link href="/admin/troptions/workflows/board" className="border border-slate-700 rounded-lg p-3 hover:border-[#C9A84C]">Admin Board</Link>
          <Link href="/admin/troptions/workflows/investor" className="border border-slate-700 rounded-lg p-3 hover:border-[#C9A84C]">Admin Investor</Link>
          <Link href="/admin/troptions/workflows/funding" className="border border-slate-700 rounded-lg p-3 hover:border-[#C9A84C]">Admin Funding</Link>
          <Link href="/admin/troptions/workflows/issuance" className="border border-slate-700 rounded-lg p-3 hover:border-[#C9A84C]">Admin Issuance</Link>
          <Link href="/admin/troptions/workflows/settlement" className="border border-slate-700 rounded-lg p-3 hover:border-[#C9A84C]">Admin Settlement</Link>
          <Link href="/admin/troptions/workflows/exceptions" className="border border-slate-700 rounded-lg p-3 hover:border-[#C9A84C]">Admin Exceptions</Link>
          <Link href="/admin/troptions/readiness" className="border border-slate-700 rounded-lg p-3 hover:border-[#C9A84C]">Readiness Dashboard</Link>
        </section>
      </div>
    </main>
  );
}
