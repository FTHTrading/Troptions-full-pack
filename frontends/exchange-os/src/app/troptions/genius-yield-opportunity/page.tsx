import { GeniusYieldOpportunityClient } from "@/components/troptions-evolution/GeniusYieldOpportunityClient";
import {
  BLOCKED_PATTERNS,
  MOCK_CREDIT_UNION_PARTNER,
  SAFER_STRUCTURES,
  buildYieldOpportunityOverview,
  scoreCreditUnionCUSOOpportunity,
} from "@/lib/troptions-genius-yield";

const OPPORTUNITY_CARDS = [
  "Credit Union/CUSO Path",
  "Tokenized Deposit Yield Lane",
  "Merchant Rebate Lane",
  "Stablecoin Payment Rail",
  "120-Day PPSI Application Clock",
  "Public Chain Eligibility",
  "RWA Payment Guardrail",
  "Revenue Capture Engine",
];

const EXPORT_PATHS = [
  "docs/troptions/genius-yield-opportunity/exports/credit-union-opportunity-packet.md",
  "docs/troptions/genius-yield-opportunity/exports/cuso-shared-service-packet.md",
  "docs/troptions/genius-yield-opportunity/exports/tokenized-deposit-packet.md",
  "docs/troptions/genius-yield-opportunity/exports/merchant-rebate-packet.md",
  "docs/troptions/genius-yield-opportunity/exports/blocked-yield-patterns.md",
  "docs/troptions/genius-yield-opportunity/exports/regulator-readiness-clock.md",
];

export default function TroptionsGeniusYieldOpportunityPage() {
  const overview = buildYieldOpportunityOverview();
  const partnerScore = scoreCreditUnionCUSOOpportunity(MOCK_CREDIT_UNION_PARTNER);

  return (
    <div className="bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(34,197,94,0.12),transparent_22%),linear-gradient(180deg,#020617_0%,#071426_40%,#03111f_100%)] text-white">
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
        <div className="rounded-[36px] border border-amber-300/20 bg-slate-950/75 p-8 shadow-[0_30px_120px_rgba(251,191,36,0.12)] md:p-12">
          <p className="text-xs uppercase tracking-[0.42em] text-amber-200">Troptions GENIUS Yield Opportunity Engine</p>
          <h1 className="mt-4 max-w-5xl font-serif text-4xl leading-tight text-white md:text-6xl">
            Route opportunity into compliant lanes: payment stablecoin for settlement, tokenized deposits for FI-controlled value accrual, merchant rebates for commerce, and RWA guardrails for everything else.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
            This engine is a legal and compliance-first scanner. It blocks holder-yield structures, flags affiliate reward risk, tracks timing windows, and maps where Troptions can monetize software and settlement infrastructure without acting as an unlicensed issuer.
          </p>
        </div>

        <section className="mt-10 rounded-4xl border border-slate-800 bg-slate-950/70 p-6">
          <p className="text-xs uppercase tracking-[0.36em] text-amber-200">Executive Opportunity Map</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {OPPORTUNITY_CARDS.map((item) => (
              <div key={item} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </section>

        <div className="mt-10">
          <GeniusYieldOpportunityClient />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="rounded-4xl border border-slate-800 bg-slate-950/70 p-6">
            <p className="text-xs uppercase tracking-[0.36em] text-amber-200">Credit Union / CUSO Scanner</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-sm text-slate-300">Mock partner</p>
                <h2 className="mt-2 text-xl font-semibold text-white">{MOCK_CREDIT_UNION_PARTNER.name}</h2>
                <p className="mt-2 text-sm text-slate-300">Strongest play: {partnerScore.strongestPlay.replaceAll("_", " ")}</p>
              </div>
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                <p className="text-sm text-emerald-100">Opportunity score</p>
                <div className="mt-2 text-4xl font-semibold text-white">{partnerScore.totalScore}</div>
                <p className="mt-2 text-sm text-emerald-100">Next actions: {partnerScore.nextActions.join(" ")}</p>
              </div>
            </div>
          </section>

          <section className="rounded-4xl border border-slate-800 bg-slate-950/70 p-6">
            <p className="text-xs uppercase tracking-[0.36em] text-amber-200">Application Clock</p>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">30-day completeness deadline: {overview.applicationClock.timeline[0]?.date}</div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">120-day decision deadline: {overview.applicationClock.timeline[1]?.date}</div>
              <div className="rounded-2xl border border-amber-300/20 bg-amber-500/10 px-4 py-3 text-amber-100">Deemed-approval watch only applies after a substantially complete filing and is not a substitute for regulator packet quality.</div>
            </div>
          </section>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="rounded-4xl border border-slate-800 bg-slate-950/70 p-6">
            <p className="text-xs uppercase tracking-[0.36em] text-amber-200">Compliant Revenue Builder</p>
            <ul className="mt-5 space-y-3 text-sm text-slate-300">
              {overview.valueCapture.allowedRevenueLines.map((item) => (
                <li key={item} className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">{item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-4xl border border-slate-800 bg-slate-950/70 p-6">
            <p className="text-xs uppercase tracking-[0.36em] text-rose-200">Blocked Structures</p>
            <ul className="mt-5 space-y-3 text-sm text-rose-50">
              {BLOCKED_PATTERNS.map((item) => (
                <li key={item} className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3">{item}</li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="rounded-4xl border border-slate-800 bg-slate-950/70 p-6">
            <p className="text-xs uppercase tracking-[0.36em] text-emerald-200">Safer Structures</p>
            <ul className="mt-5 space-y-3 text-sm text-slate-300">
              {SAFER_STRUCTURES.map((item) => (
                <li key={item} className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">{item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-4xl border border-slate-800 bg-slate-950/70 p-6">
            <p className="text-xs uppercase tracking-[0.36em] text-amber-200">Partner Packet Export</p>
            <div className="mt-5 grid gap-3">
              {EXPORT_PATHS.map((path) => (
                <div key={path} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-200">
                  <span>{path.split("/").at(-1)}</span>
                  <span className="text-xs uppercase tracking-[0.2em] text-amber-200">docs export</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-10 rounded-4xl border border-amber-300/20 bg-amber-500/10 p-6 text-sm text-amber-50">
          <p className="text-xs uppercase tracking-[0.36em] text-amber-100">Live blocked</p>
          <p className="mt-3 leading-7">
            The opportunity engine remains in research-only mode. It can classify opportunity, sort partner diligence, and generate packets, but it cannot create live stablecoin issuance, live holder yield, or affiliate pass-through reward structures.
          </p>
        </section>
      </section>
    </div>
  );
}