import { Section } from "./Section";
import { TIMELINE } from "@/lib/constants";

export function Story() {
  return (
    <Section
      id="story"
      title="Story"
      subtitle="Macon 2003 → SEC chapter → sovereign stack today. Narrative for diligence; not legal advice."
    >
      <ol className="relative border-l border-[var(--color-border)] pl-8">
        {TIMELINE.map((item, i) => (
          <li key={item.year} className={`${i < TIMELINE.length - 1 ? "pb-10" : ""}`}>
            <span className="absolute -left-[9px] mt-1.5 h-4 w-4 rounded-full border-2 border-[var(--color-gold)] bg-[var(--color-surface)]" />
            <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-gold)]">
              {item.year}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-2 max-w-3xl text-[var(--color-muted)]">{item.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
