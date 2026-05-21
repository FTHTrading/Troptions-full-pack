import { INSTITUTIONAL_BLOCKED_ACTIONS, INSTITUTIONAL_FUTURE_CAPABILITIES } from "@/content/troptions/institutionalFutureRegistry";
import { CapabilityExpansionGrid } from "@/components/troptions-evolution/CapabilityExpansionGrid";
import "@/styles/troptions-evolution.css";

export const metadata = {
  title: "Troptions Institutional Future",
  description: "Institutional future-state capabilities and blocked conditions for Troptions.",
};

export default function TroptionsFuturePage() {
  return (
    <main className="te-page">
      <div className="te-wrap">
        <header className="te-panel">
          <p className="te-kicker">Institutional Future</p>
          <h1 className="te-heading">Troptions Institutional Future</h1>
          <p className="te-subheading">
            The future stack is capability-driven, evidence-controlled, and release-gated.
          </p>
        </header>

        <section className="te-panel">
          <h2>Capability Roadmap</h2>
          <CapabilityExpansionGrid
            items={INSTITUTIONAL_FUTURE_CAPABILITIES.map((cap) => ({
              id: cap.id,
              category: cap.capability,
              readiness: cap.readiness === "blocked-until-approval" ? "gated" : cap.readiness,
              description: `${cap.module}: ${cap.notes}`,
            }))}
          />
        </section>

        <section className="te-panel">
          <h2>Blocked Until Approval</h2>
          <ul>
            {INSTITUTIONAL_BLOCKED_ACTIONS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
