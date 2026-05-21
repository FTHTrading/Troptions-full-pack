import Link from "next/link";
import { INSTITUTIONAL_TRANSITION_MESSAGE } from "@/content/troptions/institutionalFutureRegistry";

const CTAS = [
  { label: "View Troptions History", href: "/troptions/history" },
  { label: "Compare Then vs Now", href: "/troptions/then-now" },
  { label: "Review Source Map", href: "/troptions/diligence/source-map" },
  { label: "See Expanded Capabilities", href: "/troptions/capabilities-expanded" },
] as const;

export function InstitutionalFuturePanel() {
  return (
    <section className="te-future-panel">
      <p className="te-kicker">Legacy to Institutional Future</p>
      <h2>Troptions Legacy to Institutional Future</h2>
      <p>{INSTITUTIONAL_TRANSITION_MESSAGE}</p>
      <p>
        Troptions spent years proving that digital value could be used in the real world.
        The next era is different. Now Troptions becomes institutional infrastructure:
        source-tracked, proof-gated, custody-aware, compliance-controlled, AI-readable,
        and ready for the larger financial landscape.
      </p>
      <div className="te-cta-row">
        {CTAS.map((cta) => (
          <Link key={cta.href} href={cta.href} className="te-cta-link">
            {cta.label}
          </Link>
        ))}
      </div>
    </section>
  );
}

export const LEGACY_FUTURE_CTA_LINKS = CTAS;
