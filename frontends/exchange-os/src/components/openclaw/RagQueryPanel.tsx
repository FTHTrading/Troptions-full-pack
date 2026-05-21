export function RagQueryPanel() {
  return (
    <section className="openclaw-panel">
      <h3>RAG and MCP</h3>
      <p>Registry-first query mode is active. Deep retrieval is only used when source evidence is explicitly requested.</p>
      <ul className="openclaw-list">
        <li>List tools</li>
        <li>List registries</li>
        <li>Query registry snippets</li>
        <li>Summarize route and readiness status</li>
      </ul>
    </section>
  );
}
