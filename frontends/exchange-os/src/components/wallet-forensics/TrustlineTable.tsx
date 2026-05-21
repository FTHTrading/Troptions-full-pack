import { XRPL_TRUSTLINE_EXPLAINER, XRPL_TRUSTLINE_FORENSICS_REGISTRY } from "@/content/troptions/xrplTrustlineForensicsRegistry";

export function TrustlineTable() {
  return (
    <section className="wf-panel">
      <h2>Trustline Forensics</h2>
      <ul className="wf-list">
        {XRPL_TRUSTLINE_EXPLAINER.bullets.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <p className="wf-muted">Loaded trustline records: {XRPL_TRUSTLINE_FORENSICS_REGISTRY.length}</p>
    </section>
  );
}
