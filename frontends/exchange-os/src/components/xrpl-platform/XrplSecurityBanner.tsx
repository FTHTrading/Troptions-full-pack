import { inspectXrplDependencySecurity } from "@/lib/troptions/xrplDependencySecurityGuard";

export function XrplSecurityBanner() {
  const findings = inspectXrplDependencySecurity();
  const finding = findings[0];

  return (
    <section className="xp-card xp-warning" aria-label="xrpl-safety-warning">
      <p className="xp-label">Safety Warning</p>
      <h2 className="xp-value">Mainnet signing is disabled</h2>
      <p className="xp-muted">
        Troptions does not store private keys, seeds, family seeds, mnemonics, access tokens, or refresh tokens for XRPL execution. Live mainnet execution remains blocked until external signer, custody, compliance, provider, signer, and board approvals are complete.
      </p>
      <div className="xp-badgeRow">
        <span className={`xp-badge ${finding?.safe ? "xp-badge-safe" : "xp-badge-unsafe"}`}>{finding?.installed ? `xrpl package ${finding.installedVersion}` : "xrpl package not installed"}</span>
        <span className="xp-badge xp-badge-blocked">testnet-first execution</span>
        <span className="xp-badge xp-badge-blocked">external wallet signing only</span>
      </div>
    </section>
  );
}