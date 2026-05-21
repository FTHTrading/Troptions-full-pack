import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/current-user";
import {
  listInquiries,
  listBookingRequests,
  getInquirySummary,
  getBookingSummary,
  listCisRequests,
  getCisSummary,
} from "@/lib/troptions/revenue-db";

export const metadata: Metadata = {
  title: "Intake Dashboard — Admin | TROPTIONS",
};

const STATUS_BADGE: Record<string, string> = {
  new: "bg-blue-900/60 text-blue-300 border border-blue-700/50",
  contacted: "bg-cyan-900/60 text-cyan-300 border border-cyan-700/50",
  qualified: "bg-emerald-900/60 text-emerald-300 border border-emerald-700/50",
  received: "bg-blue-900/60 text-blue-300 border border-blue-700/50",
  under_review: "bg-yellow-900/60 text-yellow-300 border border-yellow-700/50",
  complete: "bg-green-900/60 text-green-300 border border-green-700/50",
  declined: "bg-red-900/60 text-red-300 border border-red-700/50",
  won: "bg-green-900/60 text-green-300 border border-green-700/50",
  lost: "bg-red-900/60 text-red-300 border border-red-700/50",
  archived: "bg-slate-800/60 text-slate-400 border border-slate-600/50",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function truncate(s: string, n = 80) {
  return s.length > n ? s.slice(0, n) + "…" : s;
}

export default async function AdminIntakeDashboard() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?next=/admin/troptions/intake");
  }

  const inquiries = listInquiries(100, 0);
  const bookings = listBookingRequests(50, 0);
  const cisRequests = listCisRequests(100, 0);
  const inquirySummary = getInquirySummary();
  const bookingSummary = getBookingSummary();
  const cisSummary = getCisSummary();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Header */}
      <div className="border-b border-slate-800 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">
              <Link href="/admin/troptions" className="text-slate-500 hover:text-slate-300">Admin</Link>
              {" / "}Intake Dashboard
            </div>
            <h1 className="text-2xl font-light text-slate-100">Client Intake Dashboard</h1>
            <p className="text-sm text-slate-400 mt-1">
              All inquiries, CIS requests, and trade desk bookings — live from the database.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <a
              href="/api/troptions/inquiries/export"
              className="px-4 py-2 text-sm bg-emerald-700 hover:bg-emerald-600 text-white rounded"
            >
              Export CSV
            </a>
            <Link href="/admin/revenue" className="px-4 py-2 text-sm border border-slate-600 text-slate-300 rounded hover:border-slate-400">
              Revenue Dashboard →
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryCard label="Total Inquiries" value={inquirySummary.total} sub={`${inquirySummary.newLeads} new · ${inquirySummary.qualified} qualified`} />
          <SummaryCard label="CIS Requests" value={cisSummary.total} sub={`${cisSummary.pending} pending review`} />
          <SummaryCard label="Bookings" value={bookingSummary.total} sub={`${bookingSummary.pending} pending`} />
          <SummaryCard label="Qualified Leads" value={inquirySummary.qualified} sub="Status: qualified" />
        </div>

        {/* CIS Requests */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm uppercase tracking-widest text-slate-400 font-semibold">
              CIS Requests ({cisSummary.total})
            </h2>
            <span className="text-xs text-slate-500">Sorted newest first</span>
          </div>
          {cisRequests.length === 0 ? (
            <EmptyState message="No CIS requests yet." />
          ) : (
            <div className="border border-slate-800 rounded overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-900 border-b border-slate-800">
                  <tr>
                    {["ID", "Name", "Email", "Entity", "Purpose", "Amount", "Status", "Submitted"].map(h => (
                      <th key={h} className="px-4 py-2 text-left text-xs text-slate-500 uppercase tracking-wider font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {cisRequests.map(c => (
                    <tr key={c.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-4 py-2.5 font-mono text-slate-500 text-xs">{c.id.slice(0, 8)}</td>
                      <td className="px-4 py-2.5 text-slate-100">{c.name}</td>
                      <td className="px-4 py-2.5 text-slate-300">{c.email}</td>
                      <td className="px-4 py-2.5 text-slate-400 capitalize">{c.entityType?.replace("_", " ")}</td>
                      <td className="px-4 py-2.5 text-slate-400 max-w-xs">{truncate(c.purpose, 60)}</td>
                      <td className="px-4 py-2.5 text-slate-400">{c.estimatedAmount ?? "—"}</td>
                      <td className="px-4 py-2.5">
                        <span className={`text-xs px-2 py-0.5 rounded ${STATUS_BADGE[c.status] ?? "text-slate-400"}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-slate-500 text-xs">{formatDate(c.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Inquiries */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm uppercase tracking-widest text-slate-400 font-semibold">
              Inquiries ({inquirySummary.total})
            </h2>
            <a href="/api/troptions/inquiries/export" className="text-xs text-emerald-400 hover:underline">
              Download CSV
            </a>
          </div>
          {inquiries.length === 0 ? (
            <EmptyState message="No inquiries yet." />
          ) : (
            <div className="border border-slate-800 rounded overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-900 border-b border-slate-800">
                  <tr>
                    {["ID", "Name", "Email", "Service", "Budget", "Score", "Status", "Submitted"].map(h => (
                      <th key={h} className="px-4 py-2 text-left text-xs text-slate-500 uppercase tracking-wider font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {inquiries.map(inq => (
                    <tr key={inq.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-4 py-2.5 font-mono text-slate-500 text-xs">{inq.id.slice(0, 8)}</td>
                      <td className="px-4 py-2.5 text-slate-100">{inq.name}</td>
                      <td className="px-4 py-2.5 text-slate-300">{inq.email}</td>
                      <td className="px-4 py-2.5 text-slate-400">{inq.serviceInterest ?? "—"}</td>
                      <td className="px-4 py-2.5 text-slate-400">{inq.budgetRange ?? "—"}</td>
                      <td className="px-4 py-2.5">
                        <span className={`text-xs font-mono ${(inq.leadScore ?? 0) >= 70 ? "text-emerald-400" : (inq.leadScore ?? 0) >= 40 ? "text-yellow-400" : "text-slate-500"}`}>
                          {inq.leadScore ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`text-xs px-2 py-0.5 rounded ${STATUS_BADGE[inq.status] ?? "text-slate-400"}`}>
                          {inq.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-slate-500 text-xs">{formatDate(inq.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Booking Requests */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm uppercase tracking-widest text-slate-400 font-semibold">
              Trade Desk Bookings ({bookingSummary.total})
            </h2>
          </div>
          {bookings.length === 0 ? (
            <EmptyState message="No booking requests yet." />
          ) : (
            <div className="border border-slate-800 rounded overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-900 border-b border-slate-800">
                  <tr>
                    {["ID", "Name", "Email", "Company", "Topic", "Status", "Submitted"].map(h => (
                      <th key={h} className="px-4 py-2 text-left text-xs text-slate-500 uppercase tracking-wider font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {bookings.map(b => (
                    <tr key={b.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-4 py-2.5 font-mono text-slate-500 text-xs">{b.id.slice(0, 8)}</td>
                      <td className="px-4 py-2.5 text-slate-100">{b.name}</td>
                      <td className="px-4 py-2.5 text-slate-300">{b.email}</td>
                      <td className="px-4 py-2.5 text-slate-400">{b.company ?? "—"}</td>
                      <td className="px-4 py-2.5 text-slate-400">{truncate(b.notes ?? "", 50)}</td>
                      <td className="px-4 py-2.5">
                        <span className={`text-xs px-2 py-0.5 rounded ${STATUS_BADGE[b.status] ?? "text-slate-400"}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-slate-500 text-xs">{formatDate(b.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

function SummaryCard({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded p-4">
      <div className="text-2xl font-light text-slate-100 mb-1">{value}</div>
      <div className="text-xs uppercase tracking-widest text-slate-500 font-medium">{label}</div>
      {sub && <div className="text-xs text-slate-600 mt-0.5">{sub}</div>}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="border border-slate-800 rounded px-6 py-8 text-center text-slate-500 text-sm">
      {message}
    </div>
  );
}
