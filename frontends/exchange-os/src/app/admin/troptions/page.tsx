import { ASSET_REGISTRY } from "@/content/troptions/assetRegistry";
import { getBlockedClaims, getCriticalClaims } from "@/content/troptions/claimRegistry";
import { getCriticalReviewItems } from "@/content/troptions/legalReviewQueue";
import { getCriticalRisks, getUnmitigatedRisks } from "@/content/troptions/riskMatrix";
import { ADVERTISING_AUDIT, getBlockedAdvertisingItems } from "@/content/troptions/advertisingAudit";
import { getCriticalFailures } from "@/content/troptions/failureMatrix";
import { StatusBadge } from "@/components/troptions/StatusBadge";
import { MEDIA_REGISTRY, MEDIA_STATS } from "@/content/troptions/mediaRegistry";

export const metadata = {
  title: "Admin Command Center — Troptions",
};

function StatCard({ label, value, color, note }: { label: string; value: number; color: string; note?: string }) {
  return (
    <div className="bg-[#0D1B2A] border border-slate-700/40 rounded-lg p-4">
      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">{label}</p>
      <p className={`text-4xl font-bold mt-1 ${color}`}>{value}</p>
      {note && <p className="text-slate-500 text-xs mt-1">{note}</p>}
    </div>
  );
}

export default function AdminCommandCenterPage() {
  const blockedClaims = getBlockedClaims();
  const criticalClaims = getCriticalClaims();
  const criticalLegal = getCriticalReviewItems();
  const criticalRisks = getCriticalRisks();
  const unmitigated = getUnmitigatedRisks();
  const blockedAds = getBlockedAdvertisingItems();
  const criticalFailures = getCriticalFailures();
  const pendingAssets = ASSET_REGISTRY.filter((a) => a.issuanceStatus !== "approved");

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="border-b border-[#C9A84C]/20 bg-[#0D1B2A]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-[0.3em]">Admin — Restricted Access</p>
          <h1 className="text-3xl font-bold text-white mt-2">Command Center</h1>
          <p className="text-gray-400 mt-2 text-sm">Full system status. Board-level visibility across all compliance, legal, risk, and claim domains.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">

        {/* Alert Banner */}
        {(criticalClaims.length > 0 || criticalLegal.length > 0) && (
          <div className="bg-red-950/30 border border-red-700/50 rounded-lg p-5">
            <p className="text-red-400 font-bold text-sm mb-2">⚠ Immediate Action Required</p>
            <ul className="text-red-300 text-xs space-y-1 list-disc list-inside">
              {criticalClaims.length > 0 && <li>{criticalClaims.length} critical advertising claims are BLOCKED and published externally</li>}
              {criticalLegal.length > 0 && <li>{criticalLegal.length} critical legal items require attorney review before any public launch</li>}
              {criticalRisks.length > 0 && <li>{criticalRisks.length} critical risks with no defined mitigation</li>}
            </ul>
          </div>
        )}

        {/* System Overview Stats */}
        <section>
          <h2 className="text-lg font-bold text-[#C9A84C] font-mono uppercase tracking-widest mb-4">System Overview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <StatCard label="Pending Assets" value={pendingAssets.length} color="text-yellow-400" note="not yet issued" />
            <StatCard label="Blocked Claims" value={blockedClaims.length} color="text-red-400" note="cannot publish" />
            <StatCard label="Critical Claims" value={criticalClaims.length} color="text-red-500" note="immediate action" />
            <StatCard label="Blocked Ads" value={blockedAds.length} color="text-orange-400" note="advertising audit" />
            <StatCard label="Critical Legal" value={criticalLegal.length} color="text-red-500" note="legal review needed" />
            <StatCard label="Critical Risks" value={criticalRisks.length} color="text-red-500" note="unmitigated" />
            <StatCard label="Unmitigated Risks" value={unmitigated.length} color="text-orange-400" />
            <StatCard label="Critical Failures" value={criticalFailures.length} color="text-red-500" note="undefined response" />
          </div>
        </section>

        {/* Asset Status */}
        <section>
          <h2 className="text-lg font-bold text-white mb-4">Asset Issuance Status</h2>
          <div className="overflow-x-auto rounded-lg border border-slate-700/40">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/40 bg-[#0D1B2A]">
                  {["Asset ID", "Type", "Name", "Legal", "Custody", "Reserve", "Board", "Issuance"].map((h) => (
                    <th key={h} className="text-left text-[#C9A84C] font-mono text-xs uppercase tracking-widest px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ASSET_REGISTRY.map((asset) => (
                  <tr key={asset.assetId} className="border-b border-slate-800/60 hover:bg-slate-900/30 transition-colors">
                    <td className="px-4 py-3 text-slate-500 font-mono text-xs">{asset.assetId}</td>
                    <td className="px-4 py-3 text-[#C9A84C] font-mono text-xs font-bold">{asset.assetType}</td>
                    <td className="px-4 py-3 text-slate-300 text-xs">{asset.assetName}</td>
                    <td className="px-4 py-3"><StatusBadge status={asset.legalStatus === "not-started" ? "blocked" : asset.legalStatus} label={asset.legalStatus} size="sm" /></td>
                    <td className="px-4 py-3"><StatusBadge status={asset.custodyStatus === "not-started" ? "blocked" : asset.custodyStatus} label={asset.custodyStatus} size="sm" /></td>
                    <td className="px-4 py-3"><StatusBadge status={asset.reserveStatus === "not-started" ? "blocked" : asset.reserveStatus} label={asset.reserveStatus} size="sm" /></td>
                    <td className="px-4 py-3"><StatusBadge status={asset.boardApprovalStatus === "not-started" ? "blocked" : asset.boardApprovalStatus} label={asset.boardApprovalStatus} size="sm" /></td>
                    <td className="px-4 py-3"><StatusBadge status={asset.issuanceStatus} size="sm" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Mint Console */}
        <section>
          <h2 className="text-lg font-bold text-[#C9A84C] font-mono uppercase tracking-widest mb-4">Mint Console</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "🪙 Tradelines + NFTs + LP Tokens", href: "/admin/troptions/mint", note: "XRPL & Stellar — simulation-first" },
              { label: "XRPL Platform", href: "/admin/troptions/xrpl-platform", note: "XRPL platform ops" },
              { label: "XRPL & Stellar Ecosystem", href: "/admin/troptions/xrpl-stellar", note: "Cross-rail asset registry" },
            ].map((item) => (
              <a key={item.href} href={item.href} className="bg-[#0D1B2A] border border-[#C9A84C]/30 rounded-lg p-4 hover:border-[#C9A84C]/80 transition-colors">
                <p className="text-sm text-[#C9A84C] font-mono">{item.label}</p>
                <p className="text-xs text-slate-500 mt-2">{item.note}</p>
              </a>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-4">Agent Command Center</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "OpenClaw Dashboard", href: "/admin/troptions/openclaw/dashboard" },
              { label: "OpenClaw Chat", href: "/admin/troptions/openclaw/chat" },
              { label: "OpenClaw x402", href: "/admin/troptions/openclaw/x402" },
              { label: "OpenClaw Site Ops", href: "/admin/troptions/openclaw/site-ops" },
              { label: "Jefe Fast Operator", href: "/admin/troptions/openclaw/jefe" },
              { label: "Jefe Commands", href: "/admin/troptions/openclaw/jefe/commands" },
            ].map((item) => (
              <a key={item.href} href={item.href} className="bg-[#0D1B2A] border border-slate-700/40 rounded-lg p-4 hover:border-[#C9A84C]/60 transition-colors">
                <p className="text-sm text-[#C9A84C] font-mono">{item.label}</p>
                <p className="text-xs text-slate-500 mt-2">{item.href}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Advertising Audit Status */}
        <section>
          <h2 className="text-lg font-bold text-white mb-4">Advertising Audit</h2>
          <div className="overflow-x-auto rounded-lg border border-slate-700/40">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/40 bg-[#0D1B2A]">
                  {["ID", "Source", "Publish Status", "Evidence Required", "Disclosure Required"].map((h) => (
                    <th key={h} className="text-left text-[#C9A84C] font-mono text-xs uppercase tracking-widest px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ADVERTISING_AUDIT.map((entry) => (
                  <tr key={entry.auditId} className="border-b border-slate-800/60 hover:bg-slate-900/30 transition-colors">
                    <td className="px-4 py-3 text-slate-500 font-mono text-xs">{entry.auditId}</td>
                    <td className="px-4 py-3 text-slate-300 text-xs max-w-[200px] truncate">{entry.source}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={entry.publishStatus} size="sm" /></td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{entry.requiredEvidence.length > 0 ? `${entry.requiredEvidence.length} items` : <span className="text-green-400">None</span>}</td>
                    <td className="px-4 py-3 text-xs">
                      <span className={entry.disclosureRequired ? "text-yellow-400" : "text-slate-500"}>
                        {entry.disclosureRequired ? "Yes" : "No"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Media Registry Status */}
        <section>
          <h2 className="text-lg font-bold text-white mb-4">Media Registry Status</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <StatCard label="Total Media" value={MEDIA_STATS.total} color="text-white" />
            <StatCard label="Images" value={MEDIA_STATS.images} color="text-blue-400" />
            <StatCard label="Videos" value={MEDIA_STATS.videos} color="text-purple-400" />
            <StatCard label="Approved" value={MEDIA_STATS.approved} color="text-green-400" />
          </div>
          <div className="overflow-x-auto rounded-lg border border-slate-700/40">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/40 bg-[#0D1B2A]">
                  {["ID", "Title", "Type", "Category", "Status", "Routes"].map((h) => (
                    <th key={h} className="text-left text-[#C9A84C] font-mono text-xs uppercase tracking-widest px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MEDIA_REGISTRY.map((asset) => (
                  <tr key={asset.id} className="border-b border-slate-800/60 hover:bg-slate-900/30 transition-colors">
                    <td className="px-4 py-3 text-slate-500 font-mono text-xs">{asset.id}</td>
                    <td className="px-4 py-3 text-slate-300 text-xs max-w-[200px] truncate">{asset.title}</td>
                    <td className="px-4 py-3 text-[#C9A84C] font-mono text-xs">{asset.type}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{asset.category}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold ${asset.status === "approved" ? "text-green-400" : "text-yellow-400"}`}>
                        {asset.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{asset.routeUse.length} route{asset.routeUse.length !== 1 ? "s" : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </main>
  );
}
