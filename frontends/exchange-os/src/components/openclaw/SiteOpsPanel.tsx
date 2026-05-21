import { OPENCLAW_SITE_OPS_CHECKS } from "@/content/troptions/openClawSiteOpsRegistry";

export function SiteOpsPanel() {
  return (
    <section className="openclaw-panel">
      <h3>Site Operations</h3>
      <ul className="openclaw-list">
        {OPENCLAW_SITE_OPS_CHECKS.map((check) => (
          <li key={check}>{check}</li>
        ))}
      </ul>
    </section>
  );
}
