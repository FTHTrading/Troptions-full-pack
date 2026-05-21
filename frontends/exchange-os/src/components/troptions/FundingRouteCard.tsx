import type { FundingRoute } from "@/content/troptions/fundingRouteRegistry";
import { StatusBadge } from "./StatusBadge";

interface FundingRouteCardProps {
  route: FundingRoute;
}

export function FundingRouteCard({ route }: FundingRouteCardProps) {
  const isActive = route.status === "approved-live";

  return (
    <div className={`bg-[#0D1B2A] border rounded-lg p-5 flex flex-col gap-3 ${isActive ? "border-[#C9A84C]/40" : "border-slate-700/40"}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[#C9A84C] text-xs font-mono uppercase tracking-widest">{route.routeId}</p>
          <h3 className="text-white font-semibold mt-0.5">{route.name}</h3>
        </div>
        <StatusBadge status={route.status} />
      </div>
      <p className="text-gray-400 text-sm leading-relaxed">{route.description}</p>
      <p className="text-slate-400 text-xs">
        <span className="text-slate-500">Eligibility: </span>{route.investorEligibility}
      </p>
      <div className="text-xs text-slate-500 mt-1">
        <span>Legal: </span>
        <StatusBadge status={route.legalStatus} size="sm" />
        {" "}
        <span>Integration: </span>
        <StatusBadge status={route.integrationStatus} size="sm" />
      </div>
    </div>
  );
}
