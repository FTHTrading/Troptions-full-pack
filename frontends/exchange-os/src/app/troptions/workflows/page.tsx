import Link from "next/link";
import { DisclaimerBanner } from "@/components/troptions/DisclaimerBanner";
import { WORKFLOW_REGISTRY } from "@/content/troptions/workflowRegistry";

export default function WorkflowsPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <DisclaimerBanner variant="institutional" />
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-10">
        <section>
          <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-widest mb-3">Institutional - Execution Layer</p>
          <h1 className="text-4xl font-bold text-white mb-4">Troptions Workflow Control Center</h1>
          <p className="text-slate-400 max-w-4xl">
            The execution layer operationalizes intake, proof, legal, custody, board, investor, funding, issuance,
            settlement, and exception controls from evidence collection to release approval.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-4">
          {WORKFLOW_REGISTRY.map((workflow) => (
            <div key={workflow.workflowId} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="text-[#C9A84C] text-xs font-mono">{workflow.workflowId}</span>
                <span className="text-xs uppercase text-slate-300">{workflow.status}</span>
              </div>
              <h2 className="text-lg font-semibold text-white">{workflow.name}</h2>
              <p className="text-slate-400 text-sm mt-2">{workflow.description}</p>
              <p className="text-xs text-yellow-400 mt-3">Next Action: {workflow.nextAction}</p>
            </div>
          ))}
        </section>

        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
          <Link href="/troptions/workflows/asset-intake" className="border border-slate-700 rounded-lg p-3 hover:border-[#C9A84C]">Asset Intake Workflow</Link>
          <Link href="/troptions/workflows/proof-package" className="border border-slate-700 rounded-lg p-3 hover:border-[#C9A84C]">Proof Package Workflow</Link>
          <Link href="/troptions/workflows/legal-review" className="border border-slate-700 rounded-lg p-3 hover:border-[#C9A84C]">Legal Review Workflow</Link>
          <Link href="/troptions/workflows/custody-review" className="border border-slate-700 rounded-lg p-3 hover:border-[#C9A84C]">Custody Review Workflow</Link>
          <Link href="/troptions/workflows/board-approval" className="border border-slate-700 rounded-lg p-3 hover:border-[#C9A84C]">Board Approval Workflow</Link>
          <Link href="/troptions/workflows/investor-readiness" className="border border-slate-700 rounded-lg p-3 hover:border-[#C9A84C]">Investor Readiness Workflow</Link>
          <Link href="/troptions/workflows/funding-readiness" className="border border-slate-700 rounded-lg p-3 hover:border-[#C9A84C]">Funding Readiness Workflow</Link>
          <Link href="/troptions/workflows/issuance-readiness" className="border border-slate-700 rounded-lg p-3 hover:border-[#C9A84C]">Issuance Readiness Workflow</Link>
          <Link href="/troptions/workflows/settlement-readiness" className="border border-slate-700 rounded-lg p-3 hover:border-[#C9A84C]">Settlement Readiness Workflow</Link>
          <Link href="/troptions/workflows/exceptions" className="border border-slate-700 rounded-lg p-3 hover:border-[#C9A84C]">Exception Management</Link>
        </section>
      </div>
    </main>
  );
}
