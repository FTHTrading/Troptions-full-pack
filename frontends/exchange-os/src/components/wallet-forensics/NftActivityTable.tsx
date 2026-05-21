import { XRPL_NFT_FORENSICS_REGISTRY } from "@/content/troptions/xrplNftForensicsRegistry";

export function NftActivityTable() {
  return (
    <section className="wf-panel">
      <h2>NFT Forensics</h2>
      <p className="wf-muted">NFT activity records loaded: {XRPL_NFT_FORENSICS_REGISTRY.length}</p>
    </section>
  );
}
