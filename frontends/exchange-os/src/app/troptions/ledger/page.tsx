import { TROPTIONS_SUB_BRANDS } from "@/content/troptions/troptionsEcosystemRegistry";
import { FULL_DISCLAIMER } from "@/content/troptions/troptionsRegistry";
import Link from "next/link";

export const metadata = {
  title: "Troptions Ledger Overview — Proof-Gated Asset Infrastructure",
  description:
    "An overview of the Troptions ledger layer — covering transaction readiness, asset status, liquidity pathways, and compliance gates across the Troptions ecosystem.",
};

const LEDGER_MODULES = [
  {
    id: "ecosystem-status",
    title: "Ecosystem Status",
    description:
      "Current operational status across all Troptions sub-brands and system modules.",
    state: "simulation",
    items: ["8 sub-brands registered", "Compliance gates active", "All execution gated pending legal review"],
  },
  {
    id: "asset-registry",
    title: "Asset Registry",
    description:
      "All Troptions-affiliated asset types and their current readiness state.",
    state: "simulation",
    items: [
      "TROPTIONS (barter unit) — proof-gated",
      "Unity Token — pending legal review",
      "RWA (real estate, solar, medical) — intake ready",
      "Stable units — evaluation phase",
    ],
  },
  {
    id: "transaction-capabilities",
    title: "Transaction Capabilities",
    description:
      "Transaction types supported in the Troptions infrastructure and their live-eligibility status.",
    state: "simulation",
    items: [
      "Barter exchange routing — dry-run only",
      "RWA intake & documentation — live (proof-required)",
      "Token transfer — pending approval",
      "Stable unit settlement — evaluation only",
    ],
  },
  {
    id: "liquidity-paths",
    title: "Liquidity Pathways",
    description:
      "Liquidity route models for Troptions assets — all simulation-only unless explicitly approved.",
    state: "simulation",
    items: [
      "XRPL AMM routes — modelled",
      "DEX on-ramp — evaluation",
      "Institutional funding routes — 0 live",
      "Custody-gated exit — pending custody approval",
    ],
  },
  {
    id: "approval-gates",
    title: "Approval Gates",
    description:
      "All transactions and issuances require approval gate confirmation before any execution.",
    state: "active",
    items: [
      "Board approval gate — ACTIVE",
      "Legal review gate — ACTIVE",
      "KYC/KYB gate — ACTIVE",
      "Compliance screening gate — ACTIVE",
    ],
  },
];

export default function TroptionsLedgerPage() {
  const activeCount = TROPTIONS_SUB_BRANDS.filter((b) => b.status === "active").length;
  const draftCount = TROPTIONS_SUB_BRANDS.filter((b) => b.status === "draft").length;

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <div className="border-b border-[#C9A84C]/20 bg-[#0D1B2A]">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-[0.3em]">Ledger / Infrastructure</p>
          <h1 className="text-4xl font-bold text-white mt-2">Troptions Ledger Overview</h1>
          <p className="text-gray-400 mt-3 text-sm max-w-2xl">
            Proof-gated asset, transaction, and liquidity infrastructure across the Troptions ecosystem.
            All execution is simulation-only unless approval gates are satisfied.
          </p>
          <div className="flex items-center gap-4 mt-4 text-xs font-mono text-gray-400">
            <span className="text-green-400">{activeCount} sub-brands active</span>
            <span>·</span>
            <span className="text-yellow-400">{draftCount} in draft</span>
            <span>·</span>
            <span className="text-red-400">All execution gated</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Global compliance banner */}
        <div className="border border-red-700/50 bg-red-900/10 rounded-lg p-5 text-red-200 text-xs leading-relaxed">
          <strong className="block mb-1 uppercase tracking-widest text-red-400 font-mono text-[10px]">
            ⚠ Ledger Compliance Notice
          </strong>
          This ledger overview is informational and simulation-only infrastructure. No live transaction, token
          issuance, liquidity movement, wallet action, or financial execution has occurred or will occur from this
          view without explicit approval gates and compliance review. {FULL_DISCLAIMER}
        </div>

        {/* Ledger modules grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {LEDGER_MODULES.map((mod) => (
            <div key={mod.id} className="bg-[#111827] border border-gray-800 rounded-xl p-7">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-[0.3em]">{mod.title}</p>
                <span
                  className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded-full border ${
                    mod.state === "active"
                      ? "bg-green-900/30 text-green-300 border-green-700/40"
                      : "bg-yellow-900/30 text-yellow-300 border-yellow-700/40"
                  }`}
                >
                  {mod.state}
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{mod.description}</p>
              <ul className="space-y-1">
                {mod.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-gray-400">
                    <span className="text-[#C9A84C] mt-0.5">·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Sub-brand ledger connections */}
        <section className="bg-[#111827] border border-gray-800 rounded-xl p-7">
          <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-[0.3em] mb-5">
            Sub-Brand Ledger Connections
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-gray-400 border-collapse">
              <thead>
                <tr className="border-b border-gray-700 text-gray-500 font-mono uppercase tracking-wider">
                  <th className="text-left py-2 pr-6">Sub-Brand</th>
                  <th className="text-left py-2 pr-6">Category</th>
                  <th className="text-left py-2 pr-6">Status</th>
                  <th className="text-left py-2">Priority</th>
                </tr>
              </thead>
              <tbody>
                {TROPTIONS_SUB_BRANDS.map((brand) => (
                  <tr key={brand.id} className="border-b border-gray-800 hover:bg-[#0D1B2A] transition-colors">
                    <td className="py-2 pr-6 font-medium text-gray-300">{brand.displayName}</td>
                    <td className="py-2 pr-6">{brand.category}</td>
                    <td className="py-2 pr-6">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase border ${
                          brand.status === "active"
                            ? "bg-green-900/30 text-green-300 border-green-700/40"
                            : brand.status === "needs-review"
                            ? "bg-red-900/30 text-red-300 border-red-700/40"
                            : "bg-yellow-900/30 text-yellow-300 border-yellow-700/40"
                        }`}
                      >
                        {brand.status}
                      </span>
                    </td>
                    <td className="py-2">
                      <span
                        className={`font-mono text-[10px] uppercase ${
                          brand.integrationPriority === "critical"
                            ? "text-red-400"
                            : brand.integrationPriority === "high"
                            ? "text-yellow-400"
                            : "text-gray-500"
                        }`}
                      >
                        {brand.integrationPriority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Admin link */}
        <div className="flex justify-end">
          <Link
            href="/admin/troptions/ecosystem"
            className="text-xs font-mono text-[#C9A84C] border border-[#C9A84C]/40 px-4 py-2 rounded hover:bg-[#C9A84C]/10 transition-colors"
          >
            Admin Dashboard →
          </Link>
        </div>
      </div>
    </main>
  );
}
