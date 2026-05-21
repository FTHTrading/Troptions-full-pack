import { XRPL_SIGNING_KEY_EXPLAINER, XRPL_SIGNING_KEY_REGISTRY } from "@/content/troptions/xrplSigningKeyRegistry";

export function SigningKeyPanel() {
  return (
    <section className="wf-panel">
      <h2>{XRPL_SIGNING_KEY_EXPLAINER.title}</h2>
      <ul className="wf-list">
        {XRPL_SIGNING_KEY_EXPLAINER.bullets.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <div className="wf-table-wrap">
        <table className="wf-table">
          <thead>
            <tr>
              <th>Wallet</th>
              <th>Master Key</th>
              <th>Regular Key</th>
              <th>Signing Key Seen</th>
              <th>Risk Note</th>
            </tr>
          </thead>
          <tbody>
            {XRPL_SIGNING_KEY_REGISTRY.map((row) => (
              <tr key={row.wallet}>
                <td className="wf-mono">{row.wallet}</td>
                <td>{row.masterKeyStatus}</td>
                <td className="wf-mono">{row.regularKey ?? "unknown"}</td>
                <td>{row.signingKeySeen ? "yes" : "no"}</td>
                <td>{row.riskNote}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
