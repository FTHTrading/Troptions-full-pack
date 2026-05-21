interface OpenClawAuditEvent {
  id: string;
  action: string;
  mode: string;
  actor: string;
  timestamp: string;
  note: string;
}

export function OpenClawAuditTable({ events }: { events: OpenClawAuditEvent[] }) {
  return (
    <section className="openclaw-panel">
      <h3>Audit Trail</h3>
      <table className="openclaw-table">
        <thead>
          <tr>
            <th>Action</th>
            <th>Mode</th>
            <th>Actor</th>
            <th>Timestamp</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>{event.action}</td>
              <td>{event.mode}</td>
              <td>{event.actor}</td>
              <td>{event.timestamp}</td>
              <td>{event.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
