import { Section } from "./Section";
import { REVENUE_PILLARS } from "@/lib/constants";
import { StatusBadge } from "./StatusBadge";

export function RevenuePillars() {
  return (
    <Section
      id="pillars"
      title="Revenue & ecosystem"
      subtitle="Honest map: live surfaces, namespace trust (SNP), pipeline sponsorship, and gated or attestation-only claims."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {REVENUE_PILLARS.map((pillar) => (
          <article
            key={pillar.name}
            className="flex flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h3 className="font-semibold text-white">{pillar.name}</h3>
              <StatusBadge status={pillar.status} />
            </div>
            <p className="mt-3 flex-1 text-sm text-[var(--color-muted)]">
              {pillar.detail}
            </p>
            {"url" in pillar && pillar.url ? (
              <a
                href={pillar.url}
                className="mt-4 text-sm text-[var(--color-gold-light)] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open surface →
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </Section>
  );
}
