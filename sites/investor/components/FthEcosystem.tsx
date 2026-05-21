import { Section } from "./Section";
import { FTH_ECOSYSTEM_CARDS } from "@/lib/constants";
import { StatusBadge } from "./StatusBadge";

export function FthEcosystem() {
  return (
    <Section
      id="fth-ecosystem"
      title="FTH ecosystem"
      subtitle="Repos, partner surfaces, and live Unykorn products. Private repositories link to GitHub for org members — not claimed as open source."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FTH_ECOSYSTEM_CARDS.map((card) => (
          <article
            key={card.name}
            className="flex flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h3 className="font-semibold text-white">{card.name}</h3>
              <StatusBadge status={card.status} />
            </div>
            <p className="mt-1 text-xs uppercase tracking-wide text-[var(--color-gold-light)]">
              {card.category}
            </p>
            <p className="mt-3 flex-1 text-sm text-[var(--color-muted)]">
              {card.detail}
            </p>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              {card.deployUrl ? (
                <a
                  href={card.deployUrl}
                  className="text-[var(--color-gold-light)] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {card.deployLabel ?? "Open live surface"} →
                </a>
              ) : null}
              {card.links?.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  className="text-[var(--color-gold-light)] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label} →
                </a>
              ))}
              {card.repoUrl ? (
                <a
                  href={card.repoUrl}
                  className="text-[var(--color-muted)] hover:text-white hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {card.repoLabel ?? "GitHub"} →
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
        Full matrix:{" "}
        <a
          href="https://fthtrading.github.io/Troptions-full-pack/technical/ECOSYSTEM_MAP.html"
          className="text-[var(--color-gold-light)] hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          ECOSYSTEM_MAP.md
        </a>{" "}
        · Re-verify with <code className="text-xs">scripts/verify-ecosystem-links.ps1</code>
      </p>
    </Section>
  );
}
