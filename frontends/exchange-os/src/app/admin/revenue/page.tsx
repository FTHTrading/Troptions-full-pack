import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/current-user";
import {
  listInquiries,
  listBookingRequests,
  getInquirySummary,
  getBookingSummary,
} from "@/lib/troptions/revenue-db";
import {
  calculateEstimatedOpportunityValue,
  getNextRecommendedAction,
  BUDGET_RANGE_LABELS,
  SERVICE_CATEGORY_LABELS,
  LEAD_STATUS_LABELS,
  type LeadStatus,
} from "@/lib/troptions/revenue";

export const metadata: Metadata = {
  title: "Revenue Dashboard — Admin",
};

const STATUS_COLORS: Record<LeadStatus, string> = {
  new: "bg-blue-900/60 text-blue-300 border-blue-700/50",
  contacted: "bg-cyan-900/60 text-cyan-300 border-cyan-700/50",
  qualified: "bg-emerald-900/60 text-emerald-300 border-emerald-700/50",
  proposal_needed: "bg-yellow-900/60 text-yellow-300 border-yellow-700/50",
  proposal_sent: "bg-orange-900/60 text-orange-300 border-orange-700/50",
  won: "bg-green-900/60 text-green-300 border-green-700/50",
  lost: "bg-red-900/60 text-red-300 border-red-700/50",
  archived: "bg-slate-800/60 text-slate-400 border-slate-600/50",
};

export default async function RevenueDashboard() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?next=/admin/revenue");
  }

  const inquiries = listInquiries(200, 0);
  const bookings = listBookingRequests(100, 0);
  const inquirySummary = getInquirySummary();
  const bookingSummary = getBookingSummary();

  const totalEstimatedValue = inquiries.reduce(
    (sum, inq) =>
      sum + calculateEstimatedOpportunityValue(inq.budgetRange, inq.serviceInterest),
    0
  );

  const byService = inquiries.reduce<Record<string, number>>((acc, inq) => {
    const key = inq.serviceInterest ?? "not_sure";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const byBudget = inquiries.reduce<Record<string, number>>((acc, inq) => {
    const key = inq.budgetRange ?? "not_specified";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const highPriorityLeads = inquiries
    .filter((i) => (i.leadScore ?? 0) >= 50)
    .slice(0, 10);

  return (
    <main className="min-h-screen bg-[#060D18] text-white">
      {/* Header */}
      <div className="border-b border-[#C9A84C]/20 bg-[#060D18]">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">
                Admin
              </p>
              <h1 className="text-2xl font-bold text-white">Revenue Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/troptions"
                className="text-xs text-slate-400 hover:text-white transition"
              >
                ← Admin Home
              </Link>
              <Link
                href="/troptions/contact"
                className="rounded-lg border border-[#C9A84C]/40 px-3 py-1.5 text-xs font-semibold text-[#C9A84C] hover:bg-[#C9A84C]/10 transition"
              >
                View Contact Page
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        {/* Summary cards */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {[
            {
              label: "Total Inquiries",
              value: inquirySummary.total,
              color: "text-white",
            },
            {
              label: "New Leads",
              value: inquirySummary.newLeads,
              color: "text-blue-300",
            },
            {
              label: "Qualified",
              value: inquirySummary.qualified,
              color: "text-emerald-300",
            },
            {
              label: "Booking Requests",
              value: bookingSummary.total,
              color: "text-cyan-300",
            },
            {
              label: "Est. Pipeline Value",
              value: `$${totalEstimatedValue.toLocaleString()}`,
              color: "text-[#C9A84C]",
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">
                {label}
              </p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Breakdowns */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* By service */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Inquiries by Service
            </p>
            {Object.entries(byService).length === 0 ? (
              <p className="text-xs text-slate-500">No inquiries yet</p>
            ) : (
              <ul className="space-y-2">
                {Object.entries(byService)
                  .sort(([, a], [, b]) => b - a)
                  .map(([key, count]) => (
                    <li key={key} className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">
                        {SERVICE_CATEGORY_LABELS[key as keyof typeof SERVICE_CATEGORY_LABELS] ?? key}
                      </span>
                      <span className="font-bold text-white bg-white/10 rounded px-2 py-0.5">
                        {count}
                      </span>
                    </li>
                  ))}
              </ul>
            )}
          </div>

          {/* By budget */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Inquiries by Budget
            </p>
            {Object.entries(byBudget).length === 0 ? (
              <p className="text-xs text-slate-500">No inquiries yet</p>
            ) : (
              <ul className="space-y-2">
                {Object.entries(byBudget)
                  .sort(([, a], [, b]) => b - a)
                  .map(([key, count]) => (
                    <li key={key} className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">
                        {BUDGET_RANGE_LABELS[key as keyof typeof BUDGET_RANGE_LABELS] ?? key}
                      </span>
                      <span className="font-bold text-white bg-white/10 rounded px-2 py-0.5">
                        {count}
                      </span>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>

        {/* High priority leads */}
        {highPriorityLeads.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Priority Leads (Score ≥ 50)
            </h2>
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    {["Name", "Company", "Email", "Service", "Budget", "Score", "Status", "Action"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[10px] uppercase tracking-wider text-slate-500">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {highPriorityLeads.map((inq) => (
                    <tr key={inq.id} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="px-4 py-3 text-white font-medium">{inq.name}</td>
                      <td className="px-4 py-3 text-slate-300">{inq.company ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-400">{inq.email}</td>
                      <td className="px-4 py-3 text-slate-300">
                        {SERVICE_CATEGORY_LABELS[inq.serviceInterest] ?? inq.serviceInterest}
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {BUDGET_RANGE_LABELS[inq.budgetRange] ?? inq.budgetRange}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-bold ${(inq.leadScore ?? 0) >= 70 ? "text-emerald-400" : "text-yellow-400"}`}>
                          {inq.leadScore ?? 0}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center border rounded px-2 py-0.5 text-[10px] uppercase tracking-wide ${
                            STATUS_COLORS[inq.status] ?? "bg-slate-800/60 text-slate-400 border-slate-600/50"
                          }`}
                        >
                          {LEAD_STATUS_LABELS[inq.status] ?? inq.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 max-w-[200px]">
                        {getNextRecommendedAction(inq)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* All leads */}
        <section>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
            All Inquiries ({inquiries.length})
          </h2>
          {inquiries.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-slate-400 text-sm">No inquiries yet.</p>
              <p className="text-xs text-slate-500 mt-1">
                Submissions from <Link href="/troptions/contact" className="text-[#C9A84C] hover:underline">/troptions/contact</Link> will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 hover:border-white/20 transition"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white text-sm">{inq.name}</p>
                      <p className="text-xs text-slate-400">
                        {inq.email}
                        {inq.company && ` · ${inq.company}`}
                        {inq.phone && ` · ${inq.phone}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center border rounded px-2 py-0.5 text-[10px] uppercase tracking-wide ${STATUS_COLORS[inq.status] ?? ""}`}>
                        {LEAD_STATUS_LABELS[inq.status] ?? inq.status}
                      </span>
                      <span className={`text-xs font-bold ${(inq.leadScore ?? 0) >= 70 ? "text-emerald-400" : (inq.leadScore ?? 0) >= 40 ? "text-yellow-400" : "text-slate-500"}`}>
                        Score: {inq.leadScore ?? 0}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-400">
                    <span>
                      Service:{" "}
                      <span className="text-slate-300">
                        {SERVICE_CATEGORY_LABELS[inq.serviceInterest] ?? inq.serviceInterest}
                      </span>
                    </span>
                    <span>
                      Budget:{" "}
                      <span className="text-slate-300">
                        {BUDGET_RANGE_LABELS[inq.budgetRange] ?? inq.budgetRange}
                      </span>
                    </span>
                    {inq.timeline && (
                      <span>
                        Timeline: <span className="text-slate-300">{inq.timeline}</span>
                      </span>
                    )}
                    <span>
                      Est. Value:{" "}
                      <span className="text-[#C9A84C] font-semibold">
                        ${calculateEstimatedOpportunityValue(
                          inq.budgetRange,
                          inq.serviceInterest
                        ).toLocaleString()}
                      </span>
                    </span>
                  </div>
                  {inq.message && (
                    <p className="mt-2 text-xs text-slate-400 line-clamp-2">{inq.message}</p>
                  )}
                  <p className="mt-2 text-[10px] text-[#C9A84C]/80 font-medium">
                    → {getNextRecommendedAction(inq)}
                  </p>
                  <p className="mt-1 text-[10px] text-slate-600">
                    {new Date(inq.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Booking Requests */}
        <section>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
            Booking Requests ({bookings.length})
          </h2>
          {bookings.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-slate-400 text-sm">No booking requests yet.</p>
              <p className="text-xs text-slate-500 mt-1">
                Submissions from <Link href="/troptions/book" className="text-[#C9A84C] hover:underline">/troptions/book</Link> will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    {["Name", "Email", "Company", "Call Type", "Date", "Time", "Timezone", "Status"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[10px] uppercase tracking-wider text-slate-500">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="px-4 py-3 text-white font-medium">{b.name}</td>
                      <td className="px-4 py-3 text-slate-400">{b.email}</td>
                      <td className="px-4 py-3 text-slate-300">{b.company ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-300 capitalize">{b.callType}</td>
                      <td className="px-4 py-3 text-slate-300">{b.preferredDate ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-300">{b.preferredTime ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-300">{b.timezone ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center border rounded px-2 py-0.5 text-[10px] uppercase tracking-wide ${
                          b.status === "confirmed"
                            ? "bg-emerald-900/60 text-emerald-300 border-emerald-700/50"
                            : b.status === "cancelled"
                            ? "bg-red-900/60 text-red-300 border-red-700/50"
                            : "bg-yellow-900/60 text-yellow-300 border-yellow-700/50"
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
