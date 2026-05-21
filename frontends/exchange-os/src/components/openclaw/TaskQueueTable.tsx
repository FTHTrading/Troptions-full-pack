export interface OpenClawTaskRow {
  taskId: string;
  label: string;
  routedAgent: string;
  mode: string;
  approvalRequired: boolean;
}

export function TaskQueueTable({ rows }: { rows: OpenClawTaskRow[] }) {
  return (
    <section className="openclaw-panel">
      <h3>Task Queue</h3>
      <table className="openclaw-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Agent</th>
            <th>Mode</th>
            <th>Approval</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.taskId}>
              <td>{row.label}</td>
              <td>{row.routedAgent}</td>
              <td>{row.mode}</td>
              <td>{row.approvalRequired ? "Required" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
