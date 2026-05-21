import { Section } from "./Section";
import { PROOF_FOR_COUNTERPARTIES_URL, VALUATION_URL } from "@/lib/constants";

export function BijanCounterparty() {
  return (
    <Section
      id="counterparty"
      title="Institutional counterparty proof"
      subtitle="Links-only diligence package — no hype, explicit PENDING labels."
    >
      <p className="max-w-3xl text-sm text-[var(--color-muted)]">
        Polygon KENNY/EVL and Genesis contracts, XRPL/Stellar issued supply, x402
        health, DAO/L1 stack summary, and a 2–4 week configure path for tokenized
        ecosystems. Named personal outreach is deprecated — use this generic pack only.
      </p>
      <div className="mt-6 flex flex-wrap gap-4">
        <a
          href={PROOF_FOR_COUNTERPARTIES_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-lg border border-[var(--color-gold)] px-6 py-3 text-sm font-semibold text-[var(--color-gold-light)] transition hover:bg-[var(--color-gold)]/10"
        >
          Institutional proof package →
        </a>
        <a
          href={VALUATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-lg border border-[var(--color-border)] px-6 py-3 text-sm font-semibold text-white transition hover:border-[var(--color-gold)]"
        >
          Valuation &amp; comparables →
        </a>
      </div>
    </Section>
  );
}
