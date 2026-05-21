"use client";

type StatusData = {
  xrplEcosystemEnabled: boolean;
  stellarEcosystemEnabled: boolean;
  isLiveMainnetExecutionEnabled: false;
  isLivePublicNetworkEnabled: false;
  executionMode: string;
  xrplAssetsCount: number;
  stellarAssetsCount: number;
  auditHint: string;
};

type XrplAsset = {
  id: string;
  displayName: string;
  category: string;
  xrplPrimitive: string;
  executionMode: string;
  liveMainnetAllowedNow: false;
  nftMintingAllowedNow: false;
  issuerStatus: string;
  recommendedNextAction: string;
};

type StellarAsset = {
  id: string;
  displayName: string;
  category: string;
  stellarPrimitive: string;
  executionMode: string;
  publicNetworkAllowedNow: false;
  issuerStatus: string;
  recommendedNextAction: string;
};

type ReadinessReport = {
  generatedAt: string;
  xrplAssetsTotal: number;
  xrplAssetsBlocked: number;
  xrplAssetsSimulationOnly: number;
  xrplAssetsTestnetReady: number;
  stellarAssetsTotal: number;
  stellarAssetsBlocked: number;
  stellarAssetsSimulationOnly: number;
  stellarAssetsTestnetReady: number;
  isLiveMainnetExecutionEnabled: false;
  isLivePublicNetworkEnabled: false;
  complianceGapsCount: number;
  blockedActionsCount: number;
  recommendedNextActions: readonly string[];
};

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-xs uppercase tracking-widest text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-[#C9A84C]">{value}</p>
    </div>
  );
}

function BlockedPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-red-900/60 px-2.5 py-0.5 text-xs font-semibold text-red-300">
      ✗ {label}
    </span>
  );
}

function SimOnlyPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-amber-900/60 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
      ◎ {label}
    </span>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="border-b border-slate-800 pb-3 text-xl font-semibold text-white">{children}</h2>
  );
}

function SafetyBanner() {
  return (
    <div className="rounded-xl border border-amber-700/40 bg-amber-900/20 p-4 text-sm text-amber-200">
      <strong>Simulation-Only Mode:</strong> All XRPL and Stellar operations are simulation-first.
      No mainnet execution, no live public network calls, no guaranteed liquidity, yield, or profit.
      Legal review required before any deployment.
    </div>
  );
}

export interface XrplStellarEcosystemPanelProps {
  status: StatusData;
  xrplAssets: XrplAsset[];
  stellarAssets: StellarAsset[];
  readinessReport: ReadinessReport;
}

export function XrplStellarEcosystemPanel({
  status,
  xrplAssets,
  stellarAssets,
  readinessReport,
}: XrplStellarEcosystemPanelProps) {
  return (
    <div className="space-y-8 px-4 py-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-white">XRPL &amp; Stellar Ecosystem</h1>
        <p className="text-slate-400">
          Cross-rail simulation layer — Troptions X Control Hub
        </p>
      </div>

      <SafetyBanner />

      {/* ── Status Grid ─────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <SectionHeader>Platform Status</SectionHeader>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="XRPL Assets" value={status.xrplAssetsCount} />
          <StatCard label="Stellar Assets" value={status.stellarAssetsCount} />
          <StatCard label="Execution Mode" value={status.executionMode} />
          <StatCard label="Compliance Gaps" value={readinessReport.complianceGapsCount} />
        </div>
        <div className="flex gap-3 flex-wrap">
          <BlockedPill label="Live Mainnet Disabled" />
          <BlockedPill label="Public Network Disabled" />
          <SimOnlyPill label="Simulation Only" />
        </div>
        <p className="text-xs text-slate-500">{status.auditHint}</p>
      </section>

      {/* ── Cross-Rail Readiness ─────────────────────────────────────────── */}
      <section className="space-y-4">
        <SectionHeader>Cross-Rail Readiness</SectionHeader>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="XRPL Sim-Only" value={readinessReport.xrplAssetsSimulationOnly} />
          <StatCard label="XRPL Blocked" value={readinessReport.xrplAssetsBlocked} />
          <StatCard label="Stellar Sim-Only" value={readinessReport.stellarAssetsSimulationOnly} />
          <StatCard label="Stellar Blocked" value={readinessReport.stellarAssetsBlocked} />
        </div>
        {readinessReport.recommendedNextActions.length > 0 && (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-3">
              Recommended Next Actions
            </p>
            <ul className="space-y-1.5">
              {readinessReport.recommendedNextActions.map((action, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-[#C9A84C] mt-0.5">→</span>
                  {action}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* ── XRPL Assets ─────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <SectionHeader>XRPL Ecosystem Assets ({xrplAssets.length})</SectionHeader>
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900">
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-slate-500">Asset</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-slate-500">Primitive</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-slate-500">Mode</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-slate-500">Issuer</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-slate-500">Next Action</th>
              </tr>
            </thead>
            <tbody>
              {xrplAssets.map((asset) => (
                <tr key={asset.id} className="border-b border-slate-800/50 bg-slate-950 hover:bg-slate-900/40">
                  <td className="px-4 py-3">
                    <span className="font-semibold text-white">{asset.id}</span>
                    <span className="ml-2 text-slate-400">{asset.displayName}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{asset.xrplPrimitive}</td>
                  <td className="px-4 py-3">
                    <SimOnlyPill label={asset.executionMode} />
                  </td>
                  <td className="px-4 py-3 text-slate-400">{asset.issuerStatus}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{asset.recommendedNextAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Stellar Assets ───────────────────────────────────────────────── */}
      <section className="space-y-4">
        <SectionHeader>Stellar Ecosystem Assets ({stellarAssets.length})</SectionHeader>
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900">
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-slate-500">Asset</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-slate-500">Primitive</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-slate-500">Mode</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-slate-500">Issuer</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-slate-500">Next Action</th>
              </tr>
            </thead>
            <tbody>
              {stellarAssets.map((asset) => (
                <tr key={asset.id} className="border-b border-slate-800/50 bg-slate-950 hover:bg-slate-900/40">
                  <td className="px-4 py-3">
                    <span className="font-semibold text-white">{asset.id}</span>
                    <span className="ml-2 text-slate-400">{asset.displayName}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{asset.stellarPrimitive}</td>
                  <td className="px-4 py-3">
                    <SimOnlyPill label={asset.executionMode} />
                  </td>
                  <td className="px-4 py-3 text-slate-400">{asset.issuerStatus}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{asset.recommendedNextAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
