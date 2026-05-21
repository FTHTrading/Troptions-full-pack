import { JEFE_ROUTING_REGISTRY } from "@/content/troptions/jefeRoutingRegistry";

export function JefeAgentRouterPanel() {
  return (
    <section className="openclaw-panel">
      <h3>Agent Routing Summary</h3>
      <table className="openclaw-table">
        <thead>
          <tr>
            <th>Keyword</th>
            <th>Agent</th>
          </tr>
        </thead>
        <tbody>
          {JEFE_ROUTING_REGISTRY.map((route) => (
            <tr key={route.keyword}>
              <td>{route.keyword}</td>
              <td>{route.routedAgent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
