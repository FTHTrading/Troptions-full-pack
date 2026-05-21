import type { Metadata } from "next";
import { getActiveSponsors, getOpenOpportunities } from "@/content/ttn/sponsorRegistry";

export const metadata: Metadata = {
  title: "Sponsors",
  description: "TTN sponsors and advertising opportunities.",
};

export default function SponsorsPage() {
  const activeSponsors = getActiveSponsors();
  const openOpportunities = getOpenOpportunities();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-12">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">TTN Partners</p>
        <h1 className="text-3xl font-bold text-white">Sponsors & Partners</h1>
        <p className="mt-3 max-w-xl text-sm text-gray-400">
          TTN is supported by mission-aligned sponsors who believe in creator-first media.
          All advertising opportunities are inquiry-based — no automated ad serving.
        </p>
      </div>

      {/* Active Sponsors */}
      {activeSponsors.length > 0 && (
        <section className="mb-14">
          <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.3em] text-green-400">Current Sponsors</p>
          <div className="grid gap-5 sm:grid-cols-2">
            {activeSponsors.map((sponsor) => (
              <div
                key={sponsor.id}
                className="rounded-2xl border border-gray-800 bg-[#0F1923] p-7"
              >
                {sponsor.logoUrl && (
                  <div className="mb-4 h-10 w-auto">
                    <span className="text-2xl">{sponsor.logoUrl.startsWith("/") ? "🏢" : sponsor.logoUrl}</span>
                  </div>
                )}
                <h3 className="mb-1 text-base font-bold text-white">{sponsor.name}</h3>
                <p className="mb-4 text-xs text-gray-400 leading-relaxed">{sponsor.tagline}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="rounded bg-gray-800 px-2 py-0.5 text-[10px] text-gray-400 capitalize">
                    {sponsor.category}
                  </span>
                </div>

                {sponsor.website && (
                  <p className="text-[10px] text-gray-500">
                    <span className="text-gray-600">Website:</span>{" "}
                    <span className="text-gray-400">{sponsor.website}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Open Opportunities */}
      <section className="mb-12">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">Advertise</p>
        <h2 className="mb-2 text-xl font-bold text-white">Open Opportunities</h2>
        <p className="mb-8 text-sm text-gray-400">
          Reach a highly engaged audience of entrepreneurs, investors, and Web3 enthusiasts.
          Inquire below — all placements are reviewed and curated.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          {openOpportunities.map((opp) => (
            <div key={opp.id} className="rounded-xl border border-gray-800 bg-[#0F1923] p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A84C]">
                  {opp.type.replace(/-/g, " ")}
                </span>
              </div>
              <h4 className="mb-2 text-sm font-semibold text-white">{opp.title}</h4>
              <p className="mb-4 text-xs text-gray-400 leading-relaxed">{opp.description}</p>
              <div className="flex items-center justify-between">
                {opp.estimatedReachPerMonth && (
                  <span className="text-[10px] text-gray-500">
                    ~<span className="text-gray-300">{opp.estimatedReachPerMonth}</span>/mo
                  </span>
                )}
                {opp.priceRange && (
                  <span className="text-[10px] text-gray-500">{opp.priceRange}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="rounded-2xl border border-[#C9A84C]/20 bg-[#0D1520] p-8 text-center">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">Become a Sponsor</p>
        <h3 className="mb-3 text-lg font-bold text-white">Interested in Partnering with TTN?</h3>
        <p className="mb-6 text-sm text-gray-400">
          TTN only works with sponsors whose values align with sovereignty, education, and creator empowerment.
          All partnerships are direct — no ad networks, no programmatic.
        </p>
        <p className="text-sm text-gray-500">
          Contact:{" "}
          <span className="text-[#C9A84C]">sponsors@troptions.tv</span>
          {" "}(inquiry only — no automated response)
        </p>
      </div>
    </div>
  );
}
