import { listXrplEcosystemAssets } from "@/lib/troptions/xrpl-stellar/xrplStellarControlHubBridge";
import Link from "next/link";

export const metadata = {
  title: "XRPL Ecosystem | Troptions",
  description:
    "Troptions XRPL ecosystem overview — simulation-first asset registry covering trustlines, NFT minting, DEX routes, and AMM pools. No mainnet execution enabled.",
};

export default function XrplEcosystemPage() {
  const assets = listXrplEcosystemAssets();

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Back nav */}
      <div style={{ background: "#071426", borderBottom: "1px solid rgba(201,162,74,0.2)", padding: "0.6rem 1.5rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <Link href="/troptions" style={{ fontSize: "0.78rem", color: "#c9a84c", textDecoration: "none", padding: "0.25rem 0.6rem", border: "1px solid rgba(201,162,74,0.3)", borderRadius: "0.35rem" }}>← TROPTIONS</Link>
        <Link href="/troptions/xrpl-platform" style={{ fontSize: "0.78rem", color: "#a0b4cc", textDecoration: "none", padding: "0.25rem 0.6rem", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.35rem" }}>XRPL Platform</Link>
        <Link href="/exchange-os/trade" style={{ fontSize: "0.78rem", color: "#00d4ff", textDecoration: "none", padding: "0.25rem 0.6rem", border: "1px solid rgba(0,212,255,0.2)", borderRadius: "0.35rem" }}>⟷ Trade Live</Link>
      </div>
      <div className="mx-auto max-w-6xl px-6 py-12 space-y-10">
        {/* Safety notice — must be prominent */}
        <div className="rounded-xl border border-red-700/40 bg-red-900/20 p-5 space-y-2">
          <p className="font-bold text-red-300 text-base">Important Disclosures</p>
          <ul className="text-sm text-red-200 space-y-1 list-disc list-inside">
            <li>All XRPL operations are <strong>simulation-only</strong>. No live mainnet execution is enabled.</li>
            <li>No NFT minting is permitted on mainnet at this time.</li>
            <li>Testnet operations only — no mainnet assets are issued or transferred.</li>
            <li><strong>No guaranteed liquidity, yield, profit, or return</strong> is implied or offered.</li>
            <li>Legal and compliance review is required before any real-world deployment.</li>
            <li>This platform does not execute trades, transfers, or settlements on your behalf.</li>
          </ul>
        </div>

        <header className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C]">
            Troptions — XRPL Ecosystem
          </p>
          <h1 className="text-4xl font-bold">XRPL Ecosystem</h1>
          <p className="max-w-2xl text-base text-slate-400 leading-7">
            The Troptions XRPL ecosystem layer defines how Troptions-branded assets participate
            in the XRP Ledger through trustlines, NFT minting, DEX routing, and AMM liquidity pools.
            All capabilities are in simulation-first mode pending legal review and compliance gating.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-slate-800 pb-3">
            XRPL Asset Registry ({assets.length} assets)
          </h2>
          <p className="text-sm text-slate-500">
            All assets below have <code className="text-amber-300">liveMainnetAllowedNow: false</code> and{" "}
            <code className="text-amber-300">nftMintingAllowedNow: false</code>.
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
                  <p><span className="text-slate-400">Primitive:</span> {asset.xrplPrimitive}</p>
                  <p><span className="text-slate-400">Category:</span> {asset.category}</p>
                  <p><span className="text-slate-400">Issuer status:</span> {asset.issuerStatus}</p>
                  <p><span className="text-slate-400">Next action:</span> {asset.recommendedNextAction}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-3">
          <h2 className="text-lg font-semibold">About XRPL Simulation Mode</h2>
          <p className="text-sm text-slate-400 leading-6">
            Troptions uses a simulation-first governance model for all XRPL integrations.
            Every trustline request, NFT mint, DEX route, and AMM pool operation is evaluated
            by the XRPL Policy Engine before any on-chain action could be taken. The platform
            records every simulation in the Control Hub audit log. No operation proceeds without
            explicit operator approval and successful compliance gating.
          </p>
          <p className="text-sm text-slate-500">
            Live mainnet execution requires: KYC/KYB approval, legal review, operator sign-off,
            and removal of all deployment gates. None of these conditions are currently satisfied.
          </p>
        </section>
      </div>
    </main>
  );
}
