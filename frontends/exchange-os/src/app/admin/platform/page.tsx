import { generatePlatformReadinessReport } from "@/lib/troptions/platform/readiness";
import { getPlatformCapabilities, getCapabilityStatusColor } from "@/lib/troptions/platform/capabilities";
import Link from "next/link";

export const metadata = { title: "Platform Dashboard — TROPTIONS Admin" };

export default function PlatformDashboard() {
  const report = generatePlatformReadinessReport();
  const capabilities = getPlatformCapabilities();

  return (
    <div className="min-h-screen bg-[#060A12] text-gray-100 p-8">
      <div className="mb-6 rounded border border-yellow-600/60 bg-yellow-900/20 px-4 py-3 text-sm text-yellow-300">
        SIMULATION MODE — Platform capabilities are build-verified. Live execution requires production-ready adapters.
      </div>
      <div className="mb-8">
        <div className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-2">
          TROPTIONS SR PLATFORM FOUNDATION
        </div>
        <h1 className="text-3xl font-bold text-white">Platform Dashboard</h1>
        <p className="mt-2 text-gray-400 text-sm">
          Capability registry, network adapter registry, readiness scores, execution policy.
        </p>
      </div>

      {/* Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-6">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Platform Readiness Score</div>
          <div className="text-5xl font-bold text-[#C9A84C]">{report.overallScore}%</div>
        </div>
        <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-6">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Capabilities</div>
          <div className="text-3xl font-bold text-white">{capabilities.length}</div>
        </div>
        <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-6">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Credentials Required</div>
          <div className="text-3xl font-bold text-orange-400">{report.credentialsRequired.length}</div>
        </div>
      </div>

      {/* Nav */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          { href: "/admin/platform/capabilities", label: "Capability Registry", desc: "All platform capabilities and readiness." },
          { href: "/admin/platform/networks", label: "Network Adapters", desc: "XRPL, Stellar, EVM, Solana, Bitcoin, bank/payroll adapters." },
          { href: "/admin/platform/readiness", label: "Readiness Report", desc: "Full platform readiness analysis." },
          { href: "/admin/platform/execution-policy", label: "Execution Policy", desc: "Execution guards and policy rules." },
          { href: "/admin/platform/audit", label: "Platform Audit", desc: "Platform-level audit events." },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-lg bg-[#0F1923] border border-gray-800 p-5 hover:border-[#C9A84C]/50 transition-colors"
          >
            <div className="font-semibold text-white text-sm mb-1">{item.label}</div>
            <div className="text-xs text-gray-500">{item.desc}</div>
          </Link>
        ))}
      </div>

      {/* Recommendations */}
      {report.recommendations.length > 0 && (
        <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-6">
          <div className="text-sm font-semibold text-[#C9A84C] mb-3">Recommendations</div>
          <ul className="space-y-2">
            {report.recommendations.map((rec, i) => (
              <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                <span className="text-[#C9A84C] shrink-0">—</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
