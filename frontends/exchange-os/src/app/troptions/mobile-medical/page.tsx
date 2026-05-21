import { getTroptionsSubBrand } from "@/content/troptions/troptionsEcosystemRegistry";
import { FULL_DISCLAIMER } from "@/content/troptions/troptionsRegistry";

export const metadata = {
  title: "Troptions Mobile Medical Units — Community Health Initiative",
  description:
    "Troptions Mobile Medical Units represent the community health and public-benefit vertical of the Troptions ecosystem — connecting mobile medical services to impact funding and proof-of-deployment documentation.",
};

const brand = getTroptionsSubBrand("troptions-mobile-medical")!;

export default function TroptionsMobileMedicalPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <div className="border-b border-[#C9A84C]/20 bg-[#0D1B2A]">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-[0.3em]">Healthcare / Community Services</p>
          <h1 className="text-4xl font-bold text-white mt-2">{brand.displayName}</h1>
          <p className="text-gray-400 mt-3 text-sm max-w-2xl">{brand.publicDescription}</p>
          <div className="flex items-center gap-3 mt-4">
            <span className="inline-block bg-green-900/40 text-green-300 font-mono text-xs px-3 py-1 rounded-full border border-green-700/40 uppercase tracking-widest">
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
            Healthcare &amp; Public Benefit Notice
          </strong>
          Mobile medical services are subject to state medical licensing, HIPAA, and public health regulations.
          Funding coordination through Troptions infrastructure must comply with applicable nonprofit and charitable
          giving regulations. {FULL_DISCLAIMER}
        </div>

        {/* Purpose + Role */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-7">
            <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-[0.3em] mb-3">Program Purpose</p>
            <h2 className="text-xl font-bold text-white mb-3">Community Health Access</h2>
            <p className="text-gray-400 text-sm leading-relaxed">{brand.purpose}</p>
          </div>
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-7">
            <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-[0.3em] mb-3">System Role</p>
            <h2 className="text-xl font-bold text-white mb-3">Public Benefit Layer</h2>
            <p className="text-gray-400 text-sm leading-relaxed">{brand.systemRole}</p>
          </div>
        </section>

        {/* Service capabilities */}
        <section className="bg-[#111827] border border-gray-800 rounded-xl p-7">
          <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-[0.3em] mb-4">Program Capabilities</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              "Mobile Clinic Deployment",
              "Community Health Screening",
              "Preventive Care Services",
              "Impact Reporting",
              "Proof-of-Deployment Documentation",
              "Funding Route Coordination",
              "Partner Nonprofit Integration",
              "Federal Grant Eligibility Tracking",
              "HIPAA-Compliant Data Handling",
            ].map((item) => (
              <div key={item} className="bg-[#0D1B2A] border border-[#C9A84C]/20 rounded-lg p-3 text-center">
                <p className="text-gray-300 text-xs font-medium">{item}</p>
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

        {/* Asset callout */}
        <section className="bg-[#0D1B2A] border border-[#C9A84C]/20 rounded-xl p-7">
          <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-[0.3em] mb-3">Visual Asset</p>
          <p className="text-gray-400 text-sm mb-2">
            The Mobile Medical Units program logo and unit photography are available for institutional presentations.
          </p>
          <p className="text-gray-500 text-xs font-mono">
            Asset path: /assets/troptions/mobile-medical/TROPTIONS MOBILE MEDICAL UNITS.png
          </p>
        </section>

        {/* Next actions */}
        <section className="bg-[#0D1B2A] border border-[#C9A84C]/20 rounded-xl p-7">
          <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-[0.3em] mb-4">Pending Actions</p>
          <ul className="space-y-2">
            {brand.nextActions.map((action) => (
              <li key={action} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="text-[#C9A84C] mt-0.5">›</span>
                {action}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
