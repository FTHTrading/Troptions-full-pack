import { ECOSYSTEM_EVOLUTION_REGISTRY } from "@/content/troptions/ecosystemEvolutionRegistry";
import { EvidenceRequiredBanner } from "@/components/troptions-evolution/EvidenceRequiredBanner";
import "@/styles/troptions-evolution.css";

export const metadata = {
  title: "Troptions Ecosystem Evolution",
  description: "Legacy Troptions branches and narratives rewritten into evidence-aware institutional modules.",
};

export default function TroptionsEcosystemPage() {
  return (
    <main className="te-page">
      <div className="te-wrap">
        <header className="te-panel">
          <p className="te-kicker">Ecosystem Evolution</p>
          <h1 className="te-heading">Troptions Ecosystem</h1>
          <p className="te-subheading">
            Legacy ecosystem narratives are maintained, source-tagged, and rewritten for institutional diligence use.
          </p>
        </header>

        <section className="te-grid-2" aria-label="ecosystem-evolution-sections">
          {ECOSYSTEM_EVOLUTION_REGISTRY.map((item) => (
            <article key={item.id} className="te-panel">
              <p className="te-kicker">{item.title}</p>
              <p><strong>Legacy description:</strong> {item.legacyDescription}</p>
              <p><strong>Institutional rewrite:</strong> {item.institutionalRewrite}</p>
              <p><strong>Required evidence:</strong> {item.requiredEvidence.join("; ")}</p>
              <p><strong>Current system module:</strong> {item.currentSystemModule}</p>
              <p><strong>Next steps:</strong> {item.nextSteps.join("; ")}</p>
              <p><strong>Blocked conditions:</strong> {item.blockedConditions.join("; ")}</p>
            </article>
          ))}
        </section>

        <EvidenceRequiredBanner
          points={[
            "Every ecosystem branch now requires explicit source and verification labels.",
            "Legacy references are not promoted as validated facts without evidence.",
            "Institutional publication requires approved language and risk notes.",
          ]}
        />
      </div>
    </main>
  );
}
