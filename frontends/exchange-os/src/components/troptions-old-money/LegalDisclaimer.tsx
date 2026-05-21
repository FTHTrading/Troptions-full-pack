import { OLD_MONEY_DISCLAIMER } from "@/content/troptions-old-money/pages";

export function LegalDisclaimer() {
  return (
    <section className="om-disclaimer" aria-label="Legal disclaimer">
      <p>{OLD_MONEY_DISCLAIMER}</p>
    </section>
  );
}
