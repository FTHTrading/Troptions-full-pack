import type { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "DONK Leads — Pipeline",
  description: "DONK leads pipeline — restaurants, hotels, sponsors, and venues targeted for the TROPTIONS Sports Network.",
};

interface Lead {
  id?: string;
  name: string;
  type?: string;
  status?: string;
  contact?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  added_at?: string;
}

function getLeads(): Lead[] {
  try {
    const p = path.join(process.cwd(), "data/donk-leads.jsonl");
    if (!fs.existsSync(p)) return [];
    const lines = fs.readFileSync(p, "utf-8").trim().split("\n").filter(Boolean);
    return lines.map((l) => JSON.parse(l) as Lead);
  } catch {
    return [];
  }
}

const STATUS_STYLE: Record<string, string> = {
  new: "text-blue-400",
  contacted: "text-[#c99a3c]",
  interested: "text-green-400",
  signed: "text-green-300",
  declined: "text-red-400",
  followup: "text-purple-400",
};

export default function LeadsPage() {
  const leads = getLeads();

  const byStatus: Record<string, number> = {};
  for (const l of leads) {
    const s = l.status ?? "new";
    byStatus[s] = (byStatus[s] ?? 0) + 1;
  }

  return (
    <div className="min-h-screen bg-[#071426] px-6 py-20">
      <div className="max-w-5xl mx-auto">
        <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-widest mb-4">
          DONK Leads
        </p>
        <h1 className="text-4xl font-bold text-white mb-5">Pipeline</h1>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="border border-white/10 bg-[#0b1f36] p-5 text-center">
            <p className="text-3xl font-bold text-white mb-1">{leads.length}</p>
            <p className="text-[#8a94a6] text-xs uppercase tracking-widest">Total Leads</p>
          </div>
          {Object.entries(byStatus).map(([status, count]) => (
            <div key={status} className="border border-white/10 bg-[#0b1f36] p-5 text-center">
              <p className={`text-3xl font-bold mb-1 ${STATUS_STYLE[status] ?? "text-white"}`}>{count}</p>
              <p className="text-[#8a94a6] text-xs uppercase tracking-widest">{status}</p>
            </div>
          ))}
        </div>

        {leads.length === 0 ? (
          <div className="border border-white/10 bg-[#0b1f36] p-10 text-center">
            <p className="text-[#8a94a6] mb-2">No leads yet.</p>
            <p className="text-[#8a94a6] text-sm">Add leads to <code className="text-white">data/donk-leads.jsonl</code> (one JSON object per line).</p>
          </div>
        ) : (
          <div className="space-y-2">
            {leads.map((lead, i) => (
              <div key={lead.id ?? i} className="border border-white/5 bg-[#0b1f36] px-5 py-4 grid grid-cols-[1fr_auto] gap-4 items-center">
                <div>
                  <p className="text-white font-semibold">{lead.name}</p>
                  <p className="text-[#8a94a6] text-xs mt-0.5">
                    {[lead.type, lead.contact, lead.phone, lead.email, lead.address].filter(Boolean).join(" · ")}
                  </p>
                  {lead.notes && <p className="text-[#8a94a6] text-xs mt-1 italic">{lead.notes}</p>}
                </div>
                <span className={`text-xs font-semibold uppercase tracking-wider ${STATUS_STYLE[lead.status ?? "new"] ?? "text-white"}`}>
                  {lead.status ?? "new"}
                </span>
              </div>
            ))}
          </div>
        )}

        <p className="text-[#8a94a6] text-xs mt-8">
          Source: <code className="text-white">data/donk-leads.jsonl</code> — append leads as JSON lines.
        </p>

        <div className="mt-6">
          <Link href="/donk" className="text-[#c99a3c] text-sm font-semibold uppercase tracking-wider hover:text-white transition-colors">
            DONK Home
          </Link>
        </div>
      </div>
    </div>
  );
}
