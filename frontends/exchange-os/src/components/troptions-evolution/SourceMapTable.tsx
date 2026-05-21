import type { LegacySourceRecord } from "@/content/troptions/legacySourceRegistry";

interface SourceMapTableProps {
  sources: readonly LegacySourceRecord[];
}

export function SourceMapTable({ sources }: SourceMapTableProps) {
  return (
    <div className="te-table-wrap">
      <table className="te-source-table" aria-label="legacy-source-map">
        <thead>
          <tr>
            <th>Source</th>
            <th>URL</th>
            <th>Category</th>
            <th>Claims</th>
            <th>Verification</th>
            <th>Institutional Use</th>
            <th>Required Evidence</th>
            <th>Risk Notes</th>
          </tr>
        </thead>
        <tbody>
          {sources.map((source) => (
            <tr key={source.sourceId}>
              <td>{source.title}</td>
              <td><a href={source.url} target="_blank" rel="noreferrer">{source.url}</a></td>
              <td>{source.sourceType}</td>
              <td>{source.claimsExtracted.join("; ")}</td>
              <td>{source.verificationStatus}</td>
              <td>{source.institutionalUseStatus}</td>
              <td>{source.requiredEvidence.join("; ")}</td>
              <td>{source.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
