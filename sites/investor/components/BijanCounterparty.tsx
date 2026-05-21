import { Section } from "./Section";
import { PROOF_FOR_COUNTERPARTIES_URL } from "@/lib/constants";

export function BijanCounterparty() {
  return (
    <Section
      id="counterparty"
      title="Bijan / counterparty package"
      subtitle="Links-only proof for Avid and institutional diligence — no hype."
    >
      <p className="max-w-3xl text-sm text-[var(--color-muted)]">
        Use the counterparty proof doc with BUILD_AVID onboarding: Polygon verified,
        XRPL/Stellar issued supply, x402 health, and explicit PENDING labels.
      </p>
      <a
        href={PROOF_FOR_COUNTERPARTIES_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center justify-center rounded-lg border border-[var(--color-gold)] px-6 py-3 text-sm font-semibold text-[var(--color-gold-light)] transition hover:bg-[var(--color-gold)]/10"
      >
        PROOF_FOR_COUNTERPARTIES.md →
      </a>
    </Section>
  );
}
