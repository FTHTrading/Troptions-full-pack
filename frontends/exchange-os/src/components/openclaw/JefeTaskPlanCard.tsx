import { summarizeNextSteps } from "@/lib/troptions/jefeEngine";

export function JefeTaskPlanCard() {
  const summary = summarizeNextSteps();
  return (
    <section className="openclaw-panel">
      <h3>Recommended Next Fixes</h3>
      <ul className="openclaw-list">
        {summary.nextSteps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ul>
    </section>
  );
}
