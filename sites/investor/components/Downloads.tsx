import { Section } from "./Section";
import {
  DOWNLOAD_ASSETS,
  ON_CHAIN_PROOF_URL,
  REPO_URL,
  XRPL_STELLAR_VERIFICATION_URL,
} from "@/lib/constants";

export function Downloads() {
  return (
    <Section
      id="downloads"
      title="Downloads"
      subtitle="Print-ready HTML pack — open in new tab, then Print → Save as PDF."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {DOWNLOAD_ASSETS.map((asset) => (
          <a
            key={asset.file}
            href={asset.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 transition hover:border-[var(--color-gold)]"
          >
            <span className="text-base font-semibold text-white group-hover:text-[var(--color-gold-light)]">
              {asset.title}
            </span>
            <span className="mt-1 text-xs text-[var(--color-muted)]">{asset.note}</span>
            <span className="mt-4 inline-flex text-sm font-medium text-[var(--color-gold)]">
              Download PDF →
            </span>
          </a>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-4 text-sm">
        <a
          href={ON_CHAIN_PROOF_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--color-gold-light)] hover:underline"
        >
          GitHub: ON_CHAIN_PROOF.md
        </a>
        <a
          href={XRPL_STELLAR_VERIFICATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--color-gold-light)] hover:underline"
        >
          GitHub: XRPL_STELLAR_VERIFICATION.md
        </a>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--color-gold-light)] hover:underline"
        >
          Clone monorepo →
        </a>
      </div>
      <p className="mt-4 text-xs text-[var(--color-muted)]">
        Optional CLI:{" "}
        <code className="text-[var(--color-gold-light)]">
          npx playwright pdf downloads/investor-executive-summary.html
          investor-executive-summary.pdf
        </code>
      </p>
    </Section>
  );
}
