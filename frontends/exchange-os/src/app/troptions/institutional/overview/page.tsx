import { TROPTIONS_SYSTEM_IDENTITY, TROPTIONS_ECOSYSTEM_PILLARS } from "@/content/troptions/troptionsRegistry";
import { MODULE_REGISTRY } from "@/content/troptions/moduleRegistry";
import { ASSET_REGISTRY } from "@/content/troptions/assetRegistry";
import { getCriticalClaims, getBlockedClaims, getClaimsMissingEvidence } from "@/content/troptions/claimRegistry";
import { PROOF_REGISTRY } from "@/content/troptions/proofRegistry";
import { getCriticalReviewItems } from "@/content/troptions/legalReviewQueue";
import { DisclaimerBanner } from "@/components/troptions/DisclaimerBanner";
import { StatusBadge } from "@/components/troptions/StatusBadge";
import Link from "next/link";

export default function InstitutionalOverviewPage() {
  const criticalClaims = getCriticalClaims();
  const blockedClaims = getBlockedClaims();
  const missingEvidence = getClaimsMissingEvidence();
  const criticalLegal = getCriticalReviewItems();
  const pendingAssets = ASSET_REGISTRY.filter((a) => a.issuanceStatus !== "approved");
  const proofNotPublished = PROOF_REGISTRY.filter((p) => !p.publishedReport);

  const gates = [
    { label: "Blocked Claims", count: blockedClaims.length, color: "text-red-400", href: "/admin/troptions/claims/review" },
    { label: "CRITICAL Claims", count: criticalClaims.length, color: "text-red-500", href: "/admin/troptions/claims/high-risk" },
    { label: "Missing Evidence", count: missingEvidence.length, color: "text-yellow-400", href: "/admin/troptions/claims/missing-evidence" },
    { label: "Critical Legal Items", count: criticalLegal.length, color: "text-orange-400", href: "/admin/troptions/disclosures" },
    { label: "Assets Pending Issuance", count: pendingAssets.length, color: "text-blue-400", href: "/troptions/asset-issuance" },
    { label: "Proof Packages Unpublished", count: proofNotPublished.length, color: "text-purple-400", href: "/admin/troptions/proof-packages" },
  ];

  const navLinks = [
    { label: "Token Roles", href: "/troptions/institutional/token-roles" },
    { label: "Disclosures", href: "/troptions/institutional/disclosures" },
    { label: "Diligence Room", href: "/troptions/institutional/diligence-room" },
    { label: "Audit Room", href: "/troptions/institutional/audit-room" },
    { label: "Merchant Network", href: "/troptions/institutional/merchant-network" },
    { label: "Proof Packages", href: "/troptions/institutional/pay" },
    { label: "RWA Intake", href: "/troptions/institutional/rwa" },
    { label: "Gold", href: "/troptions/institutional/gold" },
    { label: "Unity", href: "/troptions/institutional/unity" },
    { label: "Partners", href: "/troptions/institutional/partners" },
    { label: "Risk", href: "/troptions/institutional/risk" },
    { label: "Old Money Institutional", href: "/troptions-old-money" },
  ];

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <DisclaimerBanner variant="institutional" />

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-12">

        {/* Header */}
        <section>
          <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-widest mb-3">
            Troptions IOS — Institutional Overview
          </p>
          <h1 className="text-4xl font-bold text-white mb-4">{TROPTIONS_SYSTEM_IDENTITY.name}</h1>
          <p className="text-slate-400 max-w-3xl leading-relaxed">{TROPTIONS_SYSTEM_IDENTITY.tagline}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              ["Engine", TROPTIONS_SYSTEM_IDENTITY.internalEngine],
              ["Compliance", TROPTIONS_SYSTEM_IDENTITY.complianceModel],
              ["Issuance", TROPTIONS_SYSTEM_IDENTITY.issuanceModel],
              ["Settlement", TROPTIONS_SYSTEM_IDENTITY.settlementModel],
              ["Release", TROPTIONS_SYSTEM_IDENTITY.releaseModel],
            ].map(([k, v]) => (
              <span key={k} className="bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs">
                <span className="text-[#C9A84C]">{k}:</span>{" "}
                <span className="text-slate-300">{v}</span>
              </span>
            ))}
          </div>
        </section>

        {/* Open Gates Dashboard */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6">Open Compliance Gates</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gates.map((g) => (
              <Link key={g.label} href={g.href}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-[#C9A84C] transition-colors">
                <div className={`text-4xl font-bold mb-2 ${g.color}`}>{g.count}</div>
                <div className="text-slate-400 text-sm">{g.label}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* System Modules */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6">System Modules ({MODULE_REGISTRY.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MODULE_REGISTRY.map((mod) => (
              <div key={mod.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex justify-between items-start">
                <div>
                  <p className="text-white font-semibold text-sm">{mod.name}</p>
                  <p className="text-slate-500 text-xs mt-1">{mod.category}</p>
                  <p className="text-slate-400 text-xs mt-1 line-clamp-2">{mod.description}</p>
                </div>
                <StatusBadge status={mod.status} size="sm" />
              </div>
            ))}
          </div>
        </section>

        {/* Ecosystem Pillars */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6">Ecosystem Pillars</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TROPTIONS_ECOSYSTEM_PILLARS.map((pillar) => (
              <div key={pillar} className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-300">
                {pillar}
              </div>
            ))}
          </div>
        </section>

        {/* Institutional Navigation */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6">Institutional Sections</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-sm text-[#C9A84C] hover:border-[#C9A84C] transition-colors font-medium">
                {link.label} →
              </Link>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
