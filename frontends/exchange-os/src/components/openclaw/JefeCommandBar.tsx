import { JEFE_COMMAND_REGISTRY } from "@/content/troptions/jefeCommandRegistry";

export function JefeCommandBar() {
  return (
    <section className="openclaw-panel">
      <h3>Jefe Fast Command Bar</h3>
      <div className="openclaw-command-grid">
        {JEFE_COMMAND_REGISTRY.map((command) => (
          <button key={command.id} className="openclaw-command-chip" type="button">
            {command.prompt}
          </button>
        ))}
      </div>
    </section>
  );
}
