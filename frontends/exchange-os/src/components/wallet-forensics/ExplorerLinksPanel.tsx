import { XRPL_WALLET_INVENTORY_REGISTRY } from "@/content/troptions/xrplWalletInventoryRegistry";

export function ExplorerLinksPanel() {
  return (
    <section className="wf-panel">
      <h2>Explorer Links</h2>
      <div className="wf-grid-2">
        {XRPL_WALLET_INVENTORY_REGISTRY.map((wallet) => (
          <article key={wallet.walletId} className="wf-card">
            <h3>{wallet.label}</h3>
            <p className="wf-mono">{wallet.address}</p>
            <div className="wf-inline-links">
              {wallet.explorerLinks.map((link) => (
                <a key={`${wallet.walletId}-${link.url}`} href={link.url} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
