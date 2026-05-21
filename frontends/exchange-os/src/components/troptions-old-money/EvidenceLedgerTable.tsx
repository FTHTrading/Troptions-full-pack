type EvidenceRow = {
  item: string;
  cadence: string;
  authority: string;
  status: string;
};

type EvidenceLedgerTableProps = {
  rows: ReadonlyArray<EvidenceRow>;
};

export function EvidenceLedgerTable({ rows }: EvidenceLedgerTableProps) {
  return (
    <section className="om-evidence">
      <h2>Evidence Ledger</h2>
      <div className="om-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Artifact</th>
              <th>Cadence</th>
              <th>Authority</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.item}-${row.cadence}`}>
                <td>{row.item}</td>
                <td>{row.cadence}</td>
                <td>{row.authority}</td>
                <td>{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
