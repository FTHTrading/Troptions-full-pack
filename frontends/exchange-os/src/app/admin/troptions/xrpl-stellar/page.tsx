import { XrplStellarEcosystemPanel } from "@/components/troptions/XrplStellarEcosystemPanel";
import {
  getXrplStellarControlHubStatus,
  listXrplEcosystemAssets,
  listStellarEcosystemAssets,
  generateCrossRailReadinessReport,
} from "@/lib/troptions/xrpl-stellar/xrplStellarControlHubBridge";

export const metadata = {
  title: "XRPL & Stellar Ecosystem | Admin",
  description:
    "Simulation-first cross-rail ecosystem layer — XRPL and Stellar asset registry, policy engine status, and governance readiness report.",
};

export default function AdminXrplStellarPage() {
  const status = getXrplStellarControlHubStatus();
  const xrplAssets = listXrplEcosystemAssets();
  const stellarAssets = listStellarEcosystemAssets();
  const readinessReport = generateCrossRailReadinessReport();

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 space-y-6">
        <header className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C]">
            Admin — Cross-Rail Ecosystem
          </p>
          <h1 className="text-4xl font-bold">XRPL &amp; Stellar Ecosystem</h1>
          <p className="max-w-3xl text-base text-slate-400 leading-7">
            Simulation-first cross-rail layer covering XRPL and Stellar asset issuance, trustlines,
            NFT minting, AMM/LP pools, and path payments. All operations are governance-gated and
            persist to the Control Hub. No mainnet or public network execution is enabled.
          </p>
        </header>

        <XrplStellarEcosystemPanel
          status={status}
          xrplAssets={xrplAssets}
          stellarAssets={stellarAssets}
          readinessReport={readinessReport}
        />
      </div>
    </main>
  );
}
