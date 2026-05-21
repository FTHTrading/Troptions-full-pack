import type { XrplTrustlineRecord } from "@/content/troptions/xrplTrustlineRegistry";

export function XrplTrustlineTable({ trustlines }: { readonly trustlines: readonly XrplTrustlineRecord[] }) {
  return (
    <div className="xp-tableWrap">
      <table className="xp-table">
        <thead>
          <tr>
            <th>Holder</th>
            <th>Issuer</th>
            <th>Currency</th>
            <th>Limit</th>
            <th>Freeze Risk</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {trustlines.map((line) => (
            <tr key={line.id}>
              <td className="xp-code">{line.holder}</td>
              <td>{line.issuer}</td>
              <td>{line.currency}</td>
              <td>{line.limit}</td>
              <td><span className={`xp-badge xp-badge-${line.freezeRisk}`}>{line.freezeRisk}</span></td>
              <td><span className={`xp-badge xp-badge-${line.status}`}>{line.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}