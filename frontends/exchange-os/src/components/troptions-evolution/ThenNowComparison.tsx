import type { ThenNowRecord } from "@/content/troptions/troptionsThenNowRegistry";

interface ThenNowComparisonProps {
  records: readonly ThenNowRecord[];
}

export function ThenNowComparison({ records }: ThenNowComparisonProps) {
  return (
    <section className="te-then-now" aria-label="then-now-comparison">
      {records.map((record) => (
        <article key={record.id} className="te-then-now-card">
          <div>
            <p className="te-kicker">Then</p>
            <p>{record.thenLabel}</p>
          </div>
          <div>
            <p className="te-kicker">Now</p>
            <p>{record.nowLabel}</p>
          </div>
          <p className="te-muted">{record.transformation}</p>
        </article>
      ))}
    </section>
  );
}
