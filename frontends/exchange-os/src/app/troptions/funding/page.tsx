import { FUNDING_ROUTE_REGISTRY } from "@/content/troptions/fundingRouteRegistry";
import { FundingRouteCard } from "@/components/troptions/FundingRouteCard";
import { DisclaimerBanner } from "@/components/troptions/DisclaimerBanner";

export const metadata = {
  title: "Funding Routes — Troptions",
};

export default function FundingRoutesPage() {
  const active = FUNDING_ROUTE_REGISTRY.filter((r) => r.status === "approved-live");
  const evaluation = FUNDING_ROUTE_REGISTRY.filter((r) => r.status === "evaluation-only");

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="border-b border-[#C9A84C]/20 bg-[#0D1B2A]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-[0.3em]">Capital Formation</p>
          <h1 className="text-3xl font-bold text-white mt-2">Funding Routes</h1>
          <p className="text-gray-400 mt-2 text-sm">
            {active.length} active of {FUNDING_ROUTE_REGISTRY.length} total routes. {evaluation.length} in evaluation.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        <DisclaimerBanner variant="institutional" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FUNDING_ROUTE_REGISTRY.map((route) => (
            <FundingRouteCard key={route.routeId} route={route} />
          ))}
        </div>
      </div>
    </main>
  );
}
