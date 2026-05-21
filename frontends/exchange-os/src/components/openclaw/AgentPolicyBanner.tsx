import { OPENCLAW_BLOCKED_ACTIONS } from "@/content/troptions/openClawPolicyRegistry";

export function AgentPolicyBanner() {
  return (
    <section className="openclaw-panel">
      <h3>Policy Guardrails</h3>
      <p>OpenClaw and Jefe run in simulation-first mode. Sensitive actions require human approvals and are blocked by default.</p>
      <div className="openclaw-tag-list">
        {OPENCLAW_BLOCKED_ACTIONS.slice(0, 8).map((action) => (
          <span key={action} className="openclaw-tag openclaw-tag-blocked">{action}</span>
        ))}
      </div>
    </section>
  );
}
