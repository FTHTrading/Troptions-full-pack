import { GeniusControlTowerClient } from "@/components/troptions-evolution/GeniusControlTowerClient";
import { GENIUS_CONTROL_TOWER_REGISTRY } from "@/content/troptions/geniusControlTowerRegistry";

const ADVANTAGE_MAP = [
  "Member-owned payment infrastructure",
  "Credit-union trust layer",
  "CUSO shared-services model",
  "Existing KYC/member relationship",
  "Merchant network distribution",
  "Tokenized deposit lane",
  "Reserve custody / safekeeping income",
  "Local-business settlement",
];

const EXPORT_PATHS = [
  "docs/troptions/genius-stablecoin/exports/partner-readiness-packet.md",
  "docs/troptions/genius-stablecoin/exports/regulator-readiness-packet.md",
  "docs/troptions/genius-stablecoin/exports/board-approval-packet.md",
  "docs/troptions/genius-stablecoin/exports/merchant-settlement-packet.md",
  "docs/troptions/genius-stablecoin/exports/rwa-guardrail-packet.md",
];

export default function TroptionsGeniusControlTowerPage() {
  const { overview, profile, gates, partners, namespaces, merchantSettlementMap } = GENIUS_CONTROL_TOWER_REGISTRY;
  const defaultNamespace = namespaces.find((item) => item.namespaceType === "member") ?? namespaces[0];

  return (
    <div className="bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(251,191,36,0.12),transparent_22%),linear-gradient(180deg,#020617_0%,#071426_40%,#03111f_100%)] text-white">
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
        <div className="rounded-[36px] border border-cyan-400/20 bg-slate-950/75 p-8 shadow-[0_30px_120px_rgba(14,165,233,0.18)] md:p-12">
          <p className="text-xs uppercase tracking-[0.42em] text-cyan-300">Troptions GENIUS Control Tower</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
            <div>
              <h1 className="max-w-4xl font-serif text-4xl leading-tight text-white md:text-6xl">
                Compliance-first settlement orchestration for regulated stablecoin, tokenized deposit, and credit-union partner rails.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
                Troptions coordinates namespaces, partner diligence, evidence packets, settlement UX, and sandbox simulations. It does not claim live issuer status, insured stablecoins, guaranteed redemption, or holder yield.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] text-slate-200">
                <span className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-2">Mode: Sandbox</span>
                <span className="rounded-full border border-rose-400/40 bg-rose-400/10 px-4 py-2">Live issuance: blocked</span>
                <span className="rounded-full border border-amber-300/40 bg-amber-300/10 px-4 py-2">Tokenized deposits: separate lane</span>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[28px] border border-slate-800 bg-slate-900/90 p-6">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Executive Overview</p>
                <div className="mt-4 space-y-3 text-sm text-slate-200">
                  <div className="flex items-center justify-between"><span>Mode</span><span className="font-semibold text-cyan-200">Sandbox Simulation</span></div>
                  <div className="flex items-center justify-between"><span>Overall readiness</span><span className="font-semibold text-cyan-200">{overview.overallReadinessScore.partnerScore}% partner / {overview.overallReadinessScore.liveScore}% live</span></div>
                  <div className="flex items-center justify-between"><span>Stablecoin status</span><span className="font-semibold text-amber-200">{overview.stablecoinStatus}</span></div>
                  <div className="flex items-center justify-between"><span>Tokenized deposit</span><span className="font-semibold text-emerald-200">separate lane</span></div>
                </div>
              </div>
              <div className="rounded-[28px] border border-rose-400/20 bg-rose-500/10 p-6">
                <p className="text-xs uppercase tracking-[0.28em] text-rose-200">Next Best Actions</p>
                <ul className="mt-4 space-y-2 text-sm text-rose-50">
                  {overview.nextBestActions.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="rounded-4xl border border-slate-800 bg-slate-950/70 p-6">
            <p className="text-xs uppercase tracking-[0.36em] text-cyan-300">Credit Union / CUSO Advantage Map</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {ADVANTAGE_MAP.map((item) => (
                <div key={item} className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-4 text-sm text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-4xl border border-slate-800 bg-slate-950/70 p-6">
            <p className="text-xs uppercase tracking-[0.36em] text-cyan-300">Stablecoin vs Tokenized Deposit</p>
            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-200">
                <thead className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  <tr>
                    <th className="pb-3 pr-4">Lane</th>
                    <th className="pb-3 pr-4">Definition</th>
                    <th className="pb-3 pr-4">Constraints</th>
                    <th className="pb-3">Troptions role</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-800">
                    <td className="py-4 pr-4 font-semibold text-cyan-200">Payment stablecoin</td>
                    <td className="py-4 pr-4">Settlement rail only</td>
                    <td className="py-4 pr-4">No issuer-paid yield, not a deposit, requires PPSI or regulated partner</td>
                    <td className="py-4">Namespace, compliance, evidence, settlement UX</td>
                  </tr>
                  <tr className="border-t border-slate-800">
                    <td className="py-4 pr-4 font-semibold text-emerald-200">Tokenized deposit</td>
                    <td className="py-4 pr-4">Deposit representation through regulated FI lane</td>
                    <td className="py-4 pr-4">Possible interest/dividend only under banking or credit-union authority, separate from stablecoin</td>
                    <td className="py-4">Routing, disclosures, evidence, partner integration</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <section className="mt-10 rounded-4xl border border-slate-800 bg-slate-950/70 p-6">
          <p className="text-xs uppercase tracking-[0.36em] text-cyan-300">Compliance Gate Matrix</p>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-200">
              <thead className="text-xs uppercase tracking-[0.24em] text-slate-400">
                <tr>
                  <th className="pb-3 pr-4">Gate</th>
                  <th className="pb-3 pr-4">Required for</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3">Owner</th>
                </tr>
              </thead>
              <tbody>
                {gates.map((gate) => (
                  <tr key={gate.id} className="border-t border-slate-800">
                    <td className="py-3 pr-4">{gate.label}</td>
                    <td className="py-3 pr-4">{gate.requiredFor}</td>
                    <td className="py-3 pr-4">
                      <span className="rounded-full border border-slate-700 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-200">{gate.status}</span>
                    </td>
                    <td className="py-3">{gate.owner ?? "Unassigned"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="mt-10">
          <GeniusControlTowerClient defaultNamespaceId={defaultNamespace.namespaceId} />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-4xl border border-slate-800 bg-slate-950/70 p-6">
            <p className="text-xs uppercase tracking-[0.36em] text-cyan-300">Partner Registry</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {partners.map((partner) => (
                <article key={partner.id} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{partner.category.replaceAll("_", " ")}</p>
                  <h3 className="mt-2 text-lg font-semibold text-white">{partner.name}</h3>
                  <p className="mt-2 text-sm text-slate-300">{partner.summary}</p>
                  <p className="mt-4 text-xs uppercase tracking-[0.2em] text-cyan-200">Readiness: {partner.readiness}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-4xl border border-slate-800 bg-slate-950/70 p-6">
            <p className="text-xs uppercase tracking-[0.36em] text-cyan-300">Merchant Settlement Map</p>
            <div className="mt-5 rounded-[28px] border border-slate-800 bg-slate-900/70 p-5">
              <p className="text-sm text-slate-200">Member Namespace → Troptions Wallet UX → PPSI Stablecoin Rail → Merchant Settlement → Redemption / Bank Account</p>
              <p className="mt-3 text-xs uppercase tracking-[0.22em] text-amber-200">All live rails locked until approval</p>
            </div>
            <ul className="mt-5 space-y-3 text-sm text-slate-300">
              {merchantSettlementMap.map((item) => (
                <li key={item.id} className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">
                  <span className="font-semibold text-white">{item.label}</span>: {item.description}
                  <div className="mt-2 text-xs uppercase tracking-[0.2em] text-amber-200">Requires licensed or partnered issuer before live money movement</div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="rounded-4xl border border-slate-800 bg-slate-950/70 p-6">
            <p className="text-xs uppercase tracking-[0.36em] text-cyan-300">RWA / Private Market Guardrail</p>
            <ul className="mt-5 space-y-3 text-sm text-slate-300">
              <li className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">Stablecoin may be used as a payment rail only.</li>
              <li className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">RWA or security issuance is separate and requires legal review per product.</li>
              <li className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">No guaranteed yield, no guaranteed redemption, and no unregistered securities claims.</li>
              <li className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">Investor eligibility, escrow controls, and document evidence are required where applicable.</li>
            </ul>
          </section>

          <section className="rounded-4xl border border-slate-800 bg-slate-950/70 p-6">
            <p className="text-xs uppercase tracking-[0.36em] text-cyan-300">Export Packets</p>
            <div className="mt-5 grid gap-3">
              {EXPORT_PATHS.map((path) => (
                <div key={path} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-200">
                  <span>{path.split("/").at(-1)}</span>
                  <span className="text-xs uppercase tracking-[0.2em] text-cyan-200">generated in docs</span>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-300">
              Export partner packet, regulator packet, board packet, lender/institution packet, and merchant/RWA packets from the static docs export directory.
            </div>
          </section>
        </div>

        <section className="mt-10 rounded-4xl border border-cyan-400/20 bg-cyan-400/10 p-6 text-sm text-cyan-50">
          <p className="text-xs uppercase tracking-[0.36em] text-cyan-200">Blocked Until Approval</p>
          <p className="mt-3 leading-7">
            Troptions remains in {profile.issuerMode} mode. Live minting, live burning, live redemption, live custody, and live merchant money movement stay disabled until legal counsel, regulator approval, reserve attestation, board approval, AML/KYC controls, disclosures, chain-risk review, and smart contract audit are fully approved.
          </p>
        </section>
      </section>
    </div>
  );
}