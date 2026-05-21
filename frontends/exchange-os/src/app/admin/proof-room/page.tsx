import Link from "next/link";
import { getMockPublicClaims } from "@/lib/troptions/proof-room/claims";
import { getMockEvidenceRecords } from "@/lib/troptions/proof-room/evidence";
import { getApprovedClaims, getHighRiskClaims, getBlockedClaims } from "@/lib/troptions/proof-room/claims";

export const metadata = { title: "Proof Room — TROPTIONS Admin" };

export default function ProofRoomDashboard() {
  const claims = getMockPublicClaims();
  const evidence = getMockEvidenceRecords();
  const approved = getApprovedClaims(claims);
  const blocked = getBlockedClaims(claims);
  const highRisk = getHighRiskClaims(claims);

  return (
    <div className="min-h-screen bg-[#060A12] text-gray-100 p-8">
      <div className="mb-6 rounded border border-yellow-600/60 bg-yellow-900/20 px-4 py-3 text-sm text-yellow-300">
        SIMULATION MODE — Proof Room data reflects build-verified state. Legal review required for public claims.
      </div>
      <div className="mb-8">
        <div className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-2">
          TROPTIONS PROOF ROOM
        </div>
        <h1 className="text-3xl font-bold text-white">Proof Room Dashboard</h1>
        <p className="mt-2 text-gray-400 text-sm">
          Evidence-backed claims, history timeline, regulatory records, approved copy, and risk review.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Claims</div>
          <div className="text-3xl font-bold text-white">{claims.length}</div>
        </div>
        <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Approved</div>
          <div className="text-3xl font-bold text-green-400">{approved.length}</div>
        </div>
        <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">High/Critical Risk</div>
          <div className="text-3xl font-bold text-red-400">{highRisk.length}</div>
        </div>
        <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Evidence Records</div>
          <div className="text-3xl font-bold text-blue-400">{evidence.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          { href: "/admin/proof-room/history", label: "History Timeline", desc: "TROPTIONS founding and evolution events." },
          { href: "/admin/proof-room/claims", label: "Claims Register", desc: "All public claims and approval status." },
          { href: "/admin/proof-room/evidence", label: "Evidence Records", desc: "Supporting evidence for all claims." },
          { href: "/admin/proof-room/regulatory", label: "Regulatory History", desc: "Regulatory records and approved language." },
          { href: "/admin/proof-room/capabilities", label: "Capability Records", desc: "What TROPTIONS can claim it can do." },
          { href: "/admin/proof-room/approved-copy", label: "Approved Copy", desc: "Pre-approved text blocks for public use." },
          { href: "/admin/proof-room/risk-review", label: "Risk Review", desc: "Unsafe phrases and safer replacements." },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-lg bg-[#0F1923] border border-gray-800 p-5 hover:border-[#C9A84C]/50 transition-colors"
          >
            <div className="font-semibold text-white text-sm mb-1">{item.label}</div>
            <div className="text-xs text-gray-500">{item.desc}</div>
          </Link>
        ))}
      </div>

      {blocked.length > 0 && (
        <div className="rounded-lg bg-[#0F1923] border border-red-800/60 p-5">
          <div className="text-sm font-semibold text-red-400 mb-3">BLOCKED CLAIMS — Do Not Publish</div>
          <ul className="space-y-2">
            {blocked.map((c) => (
              <li key={c.id} className="text-xs text-red-300">— {c.claimText}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
