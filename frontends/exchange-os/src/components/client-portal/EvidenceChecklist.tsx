type EvidenceChecklistProps = {
  title: string;
  items: string[];
};

export function EvidenceChecklist({ title, items }: EvidenceChecklistProps) {
  return (
    <section className="cp-card">
      <h3>{title}</h3>
      <p>{items.length > 0 ? items.join(" | ") : "No pending checklist items."}</p>
    </section>
  );
}
