import { TroptionsDashboard } from "@/components/troptions/TroptionsDashboard";
import Link from "next/link";

export const metadata = {
  title: "Admin — Troptions Ecosystem Control Panel",
  description:
    "Internal admin panel for the Troptions ecosystem integration layer. Displays sub-brand status, ledger readiness, transaction capabilities, and pending approval gates.",
};

export default function AdminTroptionsEcosystemPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <div className="border-b border-[#C9A84C]/20 bg-[#0D1B2A]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-1">
            <Link
              href="/admin/troptions"
              className="text-[10px] font-mono text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest"
            >
              ← Admin
            </Link>
            <span className="text-slate-700">›</span>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Troptions Ecosystem</span>
          </div>
          <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-[0.3em] mt-2">Admin — Restricted Access</p>
          <h1 className="text-3xl font-bold text-white mt-1">Troptions Ecosystem Control Panel</h1>
          <p className="text-gray-400 mt-2 text-sm max-w-2xl">
            Full status across all 8+ Troptions sub-brands, ledger readiness, transaction capabilities, approval
            gate states, and pending manual actions. All data is simulation-only — zero live execution.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <TroptionsDashboard />
      </div>
    </main>
  );
}
