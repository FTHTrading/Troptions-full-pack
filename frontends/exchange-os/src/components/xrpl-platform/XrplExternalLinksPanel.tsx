import { XRPL_EXTERNAL_LINKS_REGISTRY } from "@/content/troptions/xrplExternalLinksRegistry";

export function XrplExternalLinksPanel() {
  return (
    <section className="xp-panel">
      <p className="xp-label">Official Docs And GitHub</p>
      <div className="xp-grid-3">
        {XRPL_EXTERNAL_LINKS_REGISTRY.map((link) => (
          <a key={link.id} href={link.url} target={link.url.startsWith("http") ? "_blank" : undefined} rel={link.url.startsWith("http") ? "noreferrer" : undefined} className="xp-card xp-link">
            <strong>{link.label}</strong>
            <span className="xp-muted" style={{ display: "block", marginTop: "0.5rem" }}>{link.description}</span>
          </a>
        ))}
      </div>
    </section>
  );
}