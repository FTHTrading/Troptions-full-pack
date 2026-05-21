import { listStellarEcosystemAssets } from "@/lib/troptions/xrpl-stellar/xrplStellarControlHubBridge";

export const metadata = {
  title: "Stellar Ecosystem | Troptions",
  description:
    "Troptions Stellar ecosystem overview — simulation-first asset registry covering trustlines, liquidity pools, and path payments. No public network execution enabled.",
};

export default function StellarEcosystemPage() {
  const assets = listStellarEcosystemAssets();

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="mx-auto max-w-6xl px-6 py-16 space-y-10">
        {/* Safety notice — must be prominent */}
        <div className="rounded-xl border border-red-700/40 bg-red-900/20 p-5 space-y-2">
          <p className="font-bold text-red-300 text-base">Important Disclosures</p>
          <ul className="text-sm text-red-200 space-y-1 list-disc list-inside">
            <li>All Stellar operations are <strong>simulation-only</strong>. No public network execution is enabled.</li>
            <li>Liquidity pool participation carries risk. <strong>No guaranteed yield, return, or profit</strong> is offered.</li>
            <li>Path payment routing is testnet-only and subject to legal review.</li>
            <li>Anchor and SEP services require additional legal and compliance review before use.</li>
            <li>No Stellar assets are issued or transferred on the public network at this time.</li>
          </ul>
        </div>

        <header className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C]">
            Troptions — Stellar Ecosystem
          </p>
          <h1 className="text-4xl font-bold">Stellar Ecosystem</h1>
          <p className="max-w-2xl text-base text-slate-400 leading-7">
            The Troptions Stellar ecosystem layer defines how Troptions-branded assets participate
            in the Stellar network through trustlines, Stellar DEX, AMM/liquidity pools, and
            path payments. All capabilities are in simulation-first mode pending legal review
            and compliance gating.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-slate-800 pb-3">
            Stellar Asset Registry ({assets.length} assets)
          </h2>
          <p className="text-sm text-slate-500">
            All assets below have <code className="text-amber-300">publicNetworkAllowedNow: false</code>.
            No live Stellar network calls are made.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-white text-lg">{asset.id}</p>
                    <p className="text-slate-400 text-sm">{asset.displayName}</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-amber-900/60 px-2.5 py-0.5 text-xs font-semibold text-amber-300 shrink-0">
                    {asset.executionMode}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-slate-500">
                  <p><span className="text-slate-400">Primitive:</span> {asset.stellarPrimitive}</p>
                  <p><span className="text-slate-400">Category:</span> {asset.category}</p>
                  <p><span className="text-slate-400">Issuer status:</span> {asset.issuerStatus}</p>
                  <p><span className="text-slate-400">Next action:</span> {asset.recommendedNextAction}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-3">
          <h2 className="text-lg font-semibold">About Stellar Simulation Mode</h2>
          <p className="text-sm text-slate-400 leading-6">
            Troptions uses a simulation-first governance model for all Stellar integrations.
            Every trustline request, liquidity pool operation, and path payment is evaluated
            by the Stellar Policy Engine. Liquidity pool simulations always surface the risk
            that participants face impermanent loss and carry no guaranteed yield or return.
            Path payments involving anchors require additional SEP legal review.
          </p>
          <p className="text-sm text-slate-500">
            Public network execution requires: KYC/KYB approval, legal review, operator sign-off,
            and removal of all deployment gates. None of these conditions are currently satisfied.
          </p>
        </section>
      </div>
    </main>
  );
}
