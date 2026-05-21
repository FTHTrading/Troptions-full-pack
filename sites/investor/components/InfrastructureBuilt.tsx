import { Section } from "./Section";
import { ECOSYSTEM_MAP_URL, FTH_ECOSYSTEM_CARDS } from "@/lib/constants";
import { StatusBadge } from "./StatusBadge";

export function InfrastructureBuilt() {
  return (
    <Section
      id="infrastructure"
      title="Infrastructure built"
      subtitle="Systems grid from ecosystem map — repos, deploy surfaces, SNP, x402, Genesis, T-Lev-8."
    >
      <a
        href={ECOSYSTEM_MAP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-6 inline-block text-sm text-[var(--color-gold-light)] hover:underline"
      >
        Full ECOSYSTEM_MAP.md →
      </a>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FTH_ECOSYSTEM_CARDS.map((card) => (
          <article
            key={card.name}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-white">{card.name}</h3>
              <StatusBadge status={card.status} />
            </div>
            <p className="mt-1 text-xs text-[var(--color-gold)]">{card.category}</p>
            <p className="mt-2 text-sm text-[var(--color-muted)]">{card.detail}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {card.deployUrl ? (
                <a
                  href={card.deployUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-gold-light)] hover:underline"
                >
                  {card.deployLabel ?? "Live →"}
                </a>
              ) : null}
              {card.repoUrl ? (
                <a
                  href={card.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-muted)] hover:text-white"
                >
                  {card.repoLabel ?? "Repo →"}
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
