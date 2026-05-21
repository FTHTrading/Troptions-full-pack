import { RWA_CATEGORY_LABELS, type RwaProviderCategory } from "@/lib/troptions/rwa-adapters/types";
import { RWA_PROVIDER_ADAPTERS } from "@/lib/troptions/rwa-adapters/providers";

export const metadata = {
  title: "TROPTIONS RWA Readiness",
  description:
    "TROPTIONS is building provider-neutral readiness for real-world asset, tokenized treasury, onchain credit, and institutional asset infrastructure.",
};

const CATEGORY_GROUPS: { label: string; categories: RwaProviderCategory[]; description: string }[] = [
  {
    label: "Tokenized Treasury & Money Market",
    categories: ["tokenized_treasury", "tokenized_money_market"],
    description:
      "Infrastructure for tokenizing and distributing government securities, treasury bills, and money market instruments on public blockchains.",
  },
  {
    label: "Institutional & Private Credit",
    categories: ["institutional_credit", "private_credit"],
    description:
      "Onchain lending infrastructure connecting institutional lenders and borrowers through smart-contract-based credit pools.",
  },
  {
    label: "RWA Tokenization Platforms",
    categories: ["rwa_tokenization_platform"],
    description:
      "Infrastructure to tokenize, manage, and service real-world assets including real estate, credit facilities, trade finance, and structured products.",
  },
  {
    label: "Compliance & Transfer Agent Services",
    categories: ["compliance_transfer_agent", "asset_servicing"],
    description:
      "Regulated compliance, transfer agent, and asset servicing infrastructure for digital asset issuance and management.",
  },
  {
    label: "Oracle, Proof & Market Reference",
    categories: ["oracle_proof_reference", "marketplace_reference"],
    description:
      "Onchain oracle networks, proof-of-reserve infrastructure, and market data reference systems for the RWA ecosystem.",
  },
];

export default function TroptionsRwaReadinessPage() {
  const totalAdapters = RWA_PROVIDER_ADAPTERS.length;
  const referenceOnlyCount = RWA_PROVIDER_ADAPTERS.filter(
    (a) => a.currentTroptionsStatus === "reference_only"
  ).length;

  return (
    <div className="min-h-screen bg-[#060A12] text-gray-100">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-4">
          TROPTIONS PLATFORM
        </div>
        <h1 className="text-4xl font-bold text-white mb-6">
          Provider-Neutral RWA Readiness
        </h1>

        {/* Core Statement */}
        <div className="rounded-lg border border-[#C9A84C]/30 bg-[#0F1923] p-6 mb-10">
          <p className="text-gray-200 text-lg leading-relaxed">
            TROPTIONS is building provider-neutral readiness for real-world asset, tokenized treasury,
            onchain credit, and institutional asset infrastructure. Third-party products, custody,
            execution, and settlement require approved provider relationships, credentials,
            compliance review, and legal approval.
          </p>
        </div>

        {/* What This Means */}
        <h2 className="text-xl font-bold text-white mb-4">What Provider-Neutral Means</h2>
        <p className="text-gray-400 text-base leading-relaxed mb-6">
          TROPTIONS does not claim to be an RWA issuer, custodian, broker-dealer, transfer agent,
          registered investment adviser, or licensed financial institution. Instead, TROPTIONS
          is designed as an operating and workflow layer that can connect to approved providers
          when provider agreements, legal review, credentials, and compliance approval are in place.
        </p>
        <p className="text-gray-400 text-base leading-relaxed mb-10">
          The RWA adapter registry is a readiness architecture — not a live product registry.
          It documents which provider categories TROPTIONS is designed to interface with, and
          what is required before any live integration can occur.
        </p>

        {/* RWA Adapter Summary */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-5 text-center">
            <div className="text-3xl font-bold text-[#C9A84C] mb-1">{totalAdapters}</div>
            <div className="text-xs text-gray-500">Provider Adapter Records</div>
          </div>
          <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-5 text-center">
            <div className="text-3xl font-bold text-gray-400 mb-1">{referenceOnlyCount}</div>
            <div className="text-xs text-gray-500">Reference-Only Adapters</div>
          </div>
          <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-5 text-center">
            <div className="text-3xl font-bold text-red-400 mb-1">0</div>
            <div className="text-xs text-gray-500">Execution-Enabled Adapters</div>
          </div>
        </div>

        {/* Category Groups */}
        <h2 className="text-xl font-bold text-white mb-6">Adapter Readiness Categories</h2>
        <div className="space-y-6 mb-12">
          {CATEGORY_GROUPS.map((group) => {
            const groupAdapters = RWA_PROVIDER_ADAPTERS.filter((a) =>
              group.categories.includes(a.category)
            );
            return (
              <div key={group.label} className="rounded-lg bg-[#0F1923] border border-gray-800 p-6">
                <h3 className="text-base font-semibold text-white mb-2">{group.label}</h3>
                <p className="text-sm text-gray-400 mb-4 leading-relaxed">{group.description}</p>
                <div className="space-y-2">
                  {groupAdapters.map((adapter) => (
                    <div key={adapter.providerId} className="flex items-start gap-3">
                      <div className="mt-0.5 w-2 h-2 rounded-full bg-[#C9A84C]/40 shrink-0" />
                      <div>
                        <span className="text-sm text-gray-300">{adapter.displayName}</span>
                        <span className="ml-2 text-xs text-gray-600 border border-gray-800 rounded px-1.5 py-0.5">
                          Industry Reference
                        </span>
                        <p className="text-xs text-gray-600 mt-0.5">{adapter.allowedPublicLanguage.slice(0, 120)}…</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Requirements */}
        <h2 className="text-xl font-bold text-white mb-4">What Is Required for Live Integration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {[
            { label: "Provider Contract", desc: "A signed agreement with the RWA provider." },
            { label: "Legal Review", desc: "Legal opinion covering securities law, custody, and compliance." },
            { label: "API Credentials", desc: "Officially obtained API access from the provider." },
            { label: "Compliance Approval", desc: "Internal compliance review and approval." },
            { label: "Evidence Documentation", desc: "Contract, legal opinion, credentials, and KYC/AML records on file." },
            { label: "Real Provider Confirmation", desc: "Actual provider-side confirmation before claiming execution_confirmed." },
          ].map(({ label, desc }) => (
            <div key={label} className="rounded-lg bg-[#0F1923] border border-gray-800 p-4">
              <div className="text-sm font-semibold text-[#C9A84C] mb-1">{label}</div>
              <div className="text-xs text-gray-400">{desc}</div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="rounded-lg border border-gray-800 bg-[#0F1923] p-6 text-sm text-gray-500">
          <p className="mb-2">
            <strong className="text-gray-400">Important Disclaimer:</strong> This page describes
            TROPTIONS architecture and adapter readiness. It does not constitute a live product
            offering, investment advice, or solicitation.
          </p>
          <p className="mb-2">
            TROPTIONS is not a registered investment adviser, broker-dealer, bank, licensed money
            transmitter, or transfer agent. Third-party providers referenced on this page are
            industry-reference examples of their respective categories.
          </p>
          <p>
            No partnership with any named provider is implied or claimed. All live integrations
            require signed provider agreements, legal review, regulatory compliance, and credentials.
          </p>
        </div>
      </div>
    </div>
  );
}
