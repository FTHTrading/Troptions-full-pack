import type { NamespaceX402Profile } from "@/lib/troptions-cloud/namespaceAiX402Types";

interface Props {
  profile: NamespaceX402Profile;
}

const PLAN_LABELS: Record<string, string> = {
  visitor: "Visitor",
  registered: "Registered",
  member: "Member",
  creator: "Creator",
  business: "Business",
  professional: "Professional",
  enterprise: "Enterprise",
};

export default function NamespaceX402UsagePanel({ profile }: Props) {
  const hasLivePayments = profile.livePaymentsEnabled;

  return (
    <div className="rounded-xl border border-gray-700 bg-[#0F1923] p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">x402 Usage Metering</h3>
          <p className="text-xs text-gray-500 font-mono mt-0.5">{profile.namespaceId}</p>
        </div>
        <div className="flex gap-2">
          <span className="rounded-full bg-[#C9A84C]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#C9A84C] uppercase tracking-wider">
            {profile.usageMeteringMode}
          </span>
          {!hasLivePayments && (
            <span className="rounded-full bg-emerald-900/30 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
              Simulation Only
            </span>
          )}
        </div>
      </div>

      {/* Pricing templates */}
      <div>
        <p className="text-xs text-[#C9A84C] font-semibold uppercase tracking-widest mb-2">
          Pricing Templates
        </p>
        <div className="space-y-1">
          {profile.servicePricingTemplates.slice(0, 6).map((t) => (
            <div
              key={t.actionId}
              className="flex items-center justify-between rounded-lg bg-[#080C14] px-3 py-2"
            >
              <span className="text-xs text-white">{t.actionLabel}</span>
              <span className="text-xs text-[#C9A84C] font-mono">
                {t.simulatedCreditCost} {t.currency}
              </span>
            </div>
          ))}
          {profile.servicePricingTemplates.length > 6 && (
            <p className="text-[10px] text-gray-500 text-center pt-1">
              +{profile.servicePricingTemplates.length - 6} more actions
            </p>
          )}
        </div>
      </div>

      {/* Membership plan mapping */}
      <div>
        <p className="text-xs text-[#C9A84C] font-semibold uppercase tracking-widest mb-2">
          Plan Access
        </p>
        <div className="space-y-1">
          {Object.entries(profile.membershipPlanMapping).map(([plan, actions]) => (
            <div
              key={plan}
              className="flex items-start justify-between rounded-lg bg-[#080C14] px-3 py-2 gap-3"
            >
              <span className="text-xs text-white shrink-0">
                {PLAN_LABELS[plan] ?? plan}
              </span>
              <span className="text-[10px] text-gray-400 text-right">
                {(actions as string[]).length} actions
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Blocked */}
      {profile.blockedActions.length > 0 && (
        <div>
          <p className="text-xs text-red-400 font-semibold uppercase tracking-widest mb-2">
            Blocked Actions
          </p>
          <div className="flex flex-wrap gap-1.5">
            {profile.blockedActions.map((a) => (
              <span
                key={a}
                className="rounded-full bg-red-900/30 px-2 py-0.5 text-[10px] text-red-400 font-mono"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
