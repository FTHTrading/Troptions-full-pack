import { JEFE_COMMAND_REGISTRY } from "@/content/troptions/jefeCommandRegistry";

export function JefeQuickActions() {
  const actions = JEFE_COMMAND_REGISTRY.map((command) => command.prompt);

  return (
    <section className="openclaw-panel">
      <h3>Quick Actions</h3>
      <ul className="openclaw-list">
        {actions.map((action) => (
          <li key={action}>{action}</li>
        ))}
      </ul>
    </section>
  );
}
