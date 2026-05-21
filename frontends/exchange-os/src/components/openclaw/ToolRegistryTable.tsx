import type { OpenClawToolRegistryItem } from "@/content/troptions/openClawToolRegistry";

export function ToolRegistryTable({ tools }: { tools: OpenClawToolRegistryItem[] }) {
  return (
    <section className="openclaw-panel">
      <h3>Tool Registry</h3>
      <table className="openclaw-table">
        <thead>
          <tr>
            <th>Tool</th>
            <th>Category</th>
            <th>Mode</th>
            <th>Approval</th>
          </tr>
        </thead>
        <tbody>
          {tools.map((tool) => (
            <tr key={tool.id}>
              <td>{tool.label}</td>
              <td>{tool.category}</td>
              <td>{tool.mode}</td>
              <td>{tool.requiresApproval ? "Required" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
