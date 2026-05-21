import { generateProofPacket } from "@/lib/troptions/proof-room/mockData";
import { PUBLIC_USE_LABELS, CLAIM_STATUS_LABELS } from "@/lib/troptions/proof-room/types";

export const metadata = {
  title: "TROPTIONS Proof",
  description: "Evidence-backed proof records for TROPTIONS platform and capabilities.",
};

export default function TroptionsProofPage() {
  const packet = generateProofPacket(null);

  return (
    <div className="min-h-screen bg-[#060A12] text-gray-100">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-4">
          TROPTIONS PROOF
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">TROPTIONS Proof Packet</h1>
        <p className="text-gray-400 text-lg mb-4 leading-relaxed">
          Approved claims and supporting evidence for the TROPTIONS platform.
        </p>
        <div className="text-xs text-gray-600 mb-12">Generated: {new Date(packet.generatedAt).toLocaleString()}</div>

        {packet.warnings.length > 0 && (
          <div className="mb-8 rounded-lg border border-orange-800/60 bg-orange-900/20 p-5">
            <div className="text-sm font-semibold text-orange-400 mb-2">Proof Packet Warnings</div>
            <ul className="space-y-1">
              {packet.warnings.map((w, i) => (
                <li key={i} className="text-xs text-orange-300">— {w}</li>
              ))}
            </ul>
          </div>
        )}

        <h2 className="text-xl font-semibold text-white mb-4">Approved Claims</h2>
        <div className="space-y-4 mb-12">
          {packet.claims.map((claim) => (
            <div key={claim.id} className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
              <div className="font-semibold text-white text-sm mb-2">{claim.claimText}</div>
              <div className="text-xs text-gray-500 mb-3">{claim.plainEnglishVersion}</div>
              <div className="rounded bg-[#080C14] border border-[#C9A84C]/20 p-3">
                <div className="text-xs text-[#C9A84C] uppercase tracking-wide mb-1">Approved Copy</div>
                <div className="text-xs text-gray-300">{claim.allowedCopy}</div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold text-white mb-4">Evidence Records</h2>
        <div className="space-y-4 mb-12">
          {packet.evidence.map((ev) => (
            <div key={ev.id} className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
              <div className="font-semibold text-white text-sm mb-1">{ev.title}</div>
              <div className="text-xs text-gray-400">{ev.description}</div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-gray-800 bg-[#0F1923] p-6 text-sm text-gray-500">
          {packet.disclaimers.map((d, i) => (
            <p key={i} className="mb-2">{d}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
