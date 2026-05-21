import { XRPL_AMM_FORENSICS_REGISTRY } from "@/content/troptions/xrplAmmForensicsRegistry";

export function AmmActivityPanel() {
  return (
    <section className="wf-panel">
      <h2>AMM / DEX Forensics</h2>
      <p className="wf-muted">AMM records loaded: {XRPL_AMM_FORENSICS_REGISTRY.length}</p>
    </section>
  );
}
