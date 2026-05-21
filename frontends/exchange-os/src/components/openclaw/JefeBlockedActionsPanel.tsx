import { JEFE_BLOCKED_ACTIONS } from "@/content/troptions/jefePolicyRegistry";

export function JefeBlockedActionsPanel() {
  return (
    <section className="openclaw-panel">
      <h3>Jefe Blocked Actions</h3>
      <div className="openclaw-tag-list">
        {JEFE_BLOCKED_ACTIONS.map((action) => (
          <span key={action} className="openclaw-tag openclaw-tag-blocked">{action}</span>
        ))}
      </div>
    </section>
  );
}
