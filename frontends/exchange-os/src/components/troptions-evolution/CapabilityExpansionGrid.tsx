import type { CapabilityExpansionItem } from "@/content/troptions/troptionsCapabilityExpansion";

interface CapabilityExpansionGridProps {
  items: readonly CapabilityExpansionItem[];
}

export function CapabilityExpansionGrid({ items }: CapabilityExpansionGridProps) {
  return (
    <section className="te-capability-grid" aria-label="capability-expansion-grid">
      {items.map((item) => (
        <article key={item.id} className="te-capability-card">
          <p className="te-kicker">{item.readiness}</p>
          <h3>{item.category}</h3>
          <p>{item.description}</p>
        </article>
      ))}
    </section>
  );
}
