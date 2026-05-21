type RailRow = {
  category: string;
  status: string;
  mode: string;
};

type RailStatusTableProps = {
  rows: RailRow[];
};

export function RailStatusTable({ rows }: RailStatusTableProps) {
  return (
    <section className="cp-card">
      <h3>Rail Status</h3>
      <table className="cp-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Status</th>
            <th>Mode</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.category}-${row.mode}`}>
              <td>{row.category}</td>
              <td>{row.status}</td>
              <td>{row.mode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
