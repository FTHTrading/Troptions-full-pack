type Status = "live" | "pipeline" | "gated" | "confirmed" | "pending";

const styles: Record<Status, string> = {
  live: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  pipeline: "bg-amber-500/15 text-amber-200 ring-amber-500/30",
  gated: "bg-sky-500/15 text-sky-200 ring-sky-500/30",
  confirmed: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  pending: "bg-rose-500/15 text-rose-200 ring-rose-500/30",
};

const labels: Record<Status, string> = {
  live: "Live",
  pipeline: "Pipeline",
  gated: "Gated",
  confirmed: "Confirmed",
  pending: "Pending",
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
