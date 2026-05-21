import { OPENCLAW_X402_TASKS } from "@/content/troptions/openClawX402Registry";

export function X402AgentPanel() {
  return (
    <section className="openclaw-panel">
      <h3>x402 Agent Layer</h3>
      <ul className="openclaw-list">
        {OPENCLAW_X402_TASKS.map((task) => (
          <li key={task}>{task}</li>
        ))}
      </ul>
    </section>
  );
}
