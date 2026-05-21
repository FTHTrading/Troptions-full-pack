const STRIP_ITEMS = [
  "Policy-gated onboarding",
  "Jurisdiction-aware controls",
  "Evidence-backed disclosures",
  "Operational runbook discipline",
] as const;

export function ComplianceStrip() {
  return (
    <section className="om-strip" aria-label="Institutional controls strip">
      {STRIP_ITEMS.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </section>
  );
}
