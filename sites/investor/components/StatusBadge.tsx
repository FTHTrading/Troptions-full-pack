export type Status =
  | "live"
  | "pipeline"
  | "gated"
  | "projection"
  | "confirmed"
  | "pending"
  | "pages"
  | "vercel"
  | "private"
  | "local";

const styles: Record<Status, string> = {
  live: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  pipeline: "bg-amber-500/15 text-amber-200 ring-amber-500/30",
  projection: "bg-purple-500/15 text-purple-200 ring-purple-500/30",
  gated: "bg-sky-500/15 text-sky-200 ring-sky-500/30",
  confirmed: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  pending: "bg-rose-500/15 text-rose-200 ring-rose-500/30",
  pages: "bg-violet-500/15 text-violet-200 ring-violet-500/30",
  vercel: "bg-indigo-500/15 text-indigo-200 ring-indigo-500/30",
  private: "bg-slate-500/15 text-slate-200 ring-slate-500/30",
  local: "bg-zinc-500/15 text-zinc-300 ring-zinc-500/30",
};

const labels: Record<Status, string> = {
  live: "Live",
  pipeline: "Pipeline",
  gated: "Gated",
  projection: "Projection",
  confirmed: "Confirmed",
  pending: "Pending",
  pages: "GitHub Pages",
  vercel: "Vercel",
  private: "Private repo",
  local: "Local / sandbox",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ring-1 ring-inset ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
