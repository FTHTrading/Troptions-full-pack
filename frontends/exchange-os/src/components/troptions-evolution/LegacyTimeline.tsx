import type { TroptionsHistoryMilestone } from "@/content/troptions/troptionsHistoryRegistry";

interface LegacyTimelineProps {
  milestones: readonly TroptionsHistoryMilestone[];
}

export function LegacyTimeline({ milestones }: LegacyTimelineProps) {
  return (
    <section className="te-timeline" aria-label="legacy-timeline">
      {milestones.map((item) => (
        <article key={item.id} className="te-timeline-item">
          <p className="te-period">{item.period}</p>
          <h3>{item.title}</h3>
          <p>{item.legacyNarrative}</p>
          <p className="te-muted">{item.institutionalInterpretation}</p>
          <p className="te-status">Status: {item.status}</p>
        </article>
      ))}
    </section>
  );
}
