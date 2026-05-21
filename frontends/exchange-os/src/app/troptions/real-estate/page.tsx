import { getTroptionsSubBrand } from "@/content/troptions/troptionsEcosystemRegistry";
import { FULL_DISCLAIMER } from "@/content/troptions/troptionsRegistry";

export const metadata = {
  title: "The Real Estate Connections — Troptions Real Estate Layer",
  description:
    "The Real Estate Connections is the real-estate vertical of the Troptions ecosystem — providing structured access to RWA intake, property-backed workflows, and institutional real estate coordination.",
};

const brand = getTroptionsSubBrand("real-estate-connections")!;

export default function TroptionsRealEstatePage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <div className="border-b border-[#C9A84C]/20 bg-[#0D1B2A]">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-[0.3em]">Real Estate / RWA</p>
          <h1 className="text-4xl font-bold text-white mt-2">{brand.displayName}</h1>
          <p className="text-gray-400 mt-3 text-sm max-w-2xl">{brand.publicDescription}</p>
          <div className="flex items-center gap-3 mt-4">
            <span className="inline-block bg-yellow-900/40 text-yellow-300 font-mono text-xs px-3 py-1 rounded-full border border-yellow-700/40 uppercase tracking-widest">
              {brand.status}
            </span>
            <span className="text-gray-500 text-xs font-mono">{brand.domain}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Disclaimer */}
        <div className="border border-amber-700/40 bg-amber-900/10 rounded-lg p-5 text-amber-200 text-xs leading-relaxed">
          <strong className="block mb-1 uppercase tracking-widest text-amber-400 font-mono text-[10px]">
            Real Estate &amp; RWA Compliance Notice
          </strong>
          Real estate brokerage, mortgage, and securities activities are heavily regulated. All RWA onboarding
          requires legal review, title verification, custody arrangement, and applicable licensing.{" "}
          {FULL_DISCLAIMER}
        </div>

        {/* Purpose + Role */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-7">
            <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-[0.3em] mb-3">Platform Purpose</p>
            <h2 className="text-xl font-bold text-white mb-3">Property &amp; RWA Coordination</h2>
            <p className="text-gray-400 text-sm leading-relaxed">{brand.purpose}</p>
          </div>
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-7">
            <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-[0.3em] mb-3">System Role</p>
            <h2 className="text-xl font-bold text-white mb-3">RWA Intake Gateway</h2>
            <p className="text-gray-400 text-sm leading-relaxed">{brand.systemRole}</p>
          </div>
        </section>

        {/* Asset types */}
        <section className="bg-[#111827] border border-gray-800 rounded-xl p-7">
          <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-[0.3em] mb-4">Supported Asset Types</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              "Residential Properties",
              "Commercial Real Estate",
              "Land Parcels",
              "Mixed-Use Developments",
              "Industrial Assets",
              "REITs &amp; Pooled Structures",
              "Property-Backed Notes",
              "Lease Agreements",
              "Title &amp; Deed Documentation",
            ].map((type) => (
              <div key={type} className="bg-[#0D1B2A] border border-[#C9A84C]/20 rounded-lg p-3 text-center">
                <p className="text-gray-300 text-xs font-medium" dangerouslySetInnerHTML={{ __html: type }} />
              </div>
            ))}
          </div>
        </section>

        {/* Capabilities */}
        <section className="bg-[#111827] border border-gray-800 rounded-xl p-7">
          <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-[0.3em] mb-4">Connected Systems</p>
          <div className="flex flex-wrap gap-2">
            {brand.linkedCapabilities.map((cap) => (
              <span
                key={cap}
                className="bg-[#1a2535] border border-gray-700 text-gray-300 font-mono text-xs px-3 py-1 rounded-full"
              >
                {cap}
              </span>
            ))}
          </div>
        </section>

        {/* Next actions */}
        <section className="bg-[#0D1B2A] border border-[#C9A84C]/20 rounded-xl p-7">
          <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-[0.3em] mb-4">Integration Steps</p>
          <ul className="space-y-2">
            {brand.nextActions.map((action) => (
              <li key={action} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="text-[#C9A84C] mt-0.5">›</span>
                {action}
              </li>
            ))}
          </ul>
        </section>

        {/* Regulatory */}
        <section className="bg-[#111827] border border-red-900/30 rounded-xl p-7">
          <p className="text-red-400 font-mono text-xs uppercase tracking-[0.3em] mb-3">Regulatory Notes</p>
          <p className="text-gray-400 text-sm leading-relaxed">{brand.complianceNotes}</p>
        </section>
      </div>
    </main>
  );
}
