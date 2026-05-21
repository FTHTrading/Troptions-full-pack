import type { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "DONK Numbers — Phone Line Management",
  description: "DONK vanity and campaign phone numbers. Primary: 1-888-690-3665.",
};

interface NumberRecord {
  number: string;
  label?: string;
  status?: string;
  campaign?: string;
  provider?: string;
  notes?: string;
}

function getCandidates(): NumberRecord[] {
  try {
    const p = path.join(process.cwd(), "data/donk-number-candidates.json");
    if (!fs.existsSync(p)) return [];
    return JSON.parse(fs.readFileSync(p, "utf-8")) as NumberRecord[];
  } catch {
    return [];
  }
}

const STATUS_STYLE: Record<string, string> = {
  active: "text-green-400",
  reserved: "text-[#c99a3c]",
  candidate: "text-blue-400",
  inactive: "text-[#8a94a6]",
};

export default function NumbersPage() {
  const candidates = getCandidates();

  return (
    <div className="min-h-screen bg-[#071426] px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-widest mb-4">
          DONK Numbers
        </p>
        <h1 className="text-4xl font-bold text-white mb-5">Phone Line Dashboard</h1>

        {/* Primary number */}
        <div className="border border-[#c99a3c]/40 bg-[#0b1f36] p-8 mb-10">
          <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-widest mb-3">Primary Line</p>
          <p className="text-5xl font-black text-white tracking-tight mb-3">1-888-690-3665</p>
          <p className="text-[#8a94a6] text-sm mb-4">DONK main campaign line. Telnyx. AI answering via NEED AI.</p>
          <div className="flex flex-wrap gap-4">
            <span className="text-green-400 text-xs font-semibold uppercase tracking-wider">Active</span>
            <span className="text-[#8a94a6] text-xs">Provider: Telnyx</span>
            <span className="text-[#8a94a6] text-xs">AI Answering: NEED AI</span>
          </div>
        </div>

        {/* Candidates */}
        {candidates.length > 0 ? (
          <>
            <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-widest mb-4">
              Number Candidates ({candidates.length})
            </p>
            <div className="space-y-3">
              {candidates.map((n, i) => (
                <div key={n.number ?? i} className="border border-white/5 bg-[#0b1f36] px-5 py-4 grid grid-cols-[1fr_auto] gap-4 items-center">
                  <div>
                    <p className="text-white font-mono font-semibold text-lg">{n.number}</p>
                    <p className="text-[#8a94a6] text-xs mt-0.5">
                      {[n.label, n.campaign, n.provider, n.notes].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold uppercase tracking-wider ${STATUS_STYLE[n.status ?? "candidate"] ?? "text-white"}`}>
                    {n.status ?? "candidate"}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[#8a94a6] text-xs mt-6">
              Source: <code className="text-white">data/donk-number-candidates.json</code>
            </p>
          </>
        ) : (
          <div className="border border-white/10 bg-[#0b1f36] p-8 text-center">
            <p className="text-[#8a94a6] mb-2">No number candidates file found.</p>
            <p className="text-[#8a94a6] text-sm">
              Create <code className="text-white">data/donk-number-candidates.json</code> with an array of number records.
            </p>
          </div>
        )}

        <div className="mt-10 flex gap-4">
          <Link href="/donk" className="text-[#c99a3c] text-sm font-semibold uppercase tracking-wider hover:text-white transition-colors">
            DONK Home
          </Link>
          <Link href="/donk/leads" className="text-[#c99a3c] text-sm font-semibold uppercase tracking-wider hover:text-white transition-colors">
            DONK Leads
          </Link>
        </div>
      </div>
    </div>
  );
}
