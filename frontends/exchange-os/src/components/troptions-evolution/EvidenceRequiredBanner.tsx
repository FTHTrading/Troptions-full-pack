interface EvidenceRequiredBannerProps {
  title?: string;
  points: readonly string[];
}

export function EvidenceRequiredBanner({
  title = "Evidence Required Before Institutional Publication",
  points,
}: EvidenceRequiredBannerProps) {
  return (
    <section className="te-evidence-banner" aria-label="evidence-required">
      <h3>{title}</h3>
      <ul>
        {points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </section>
  );
}
