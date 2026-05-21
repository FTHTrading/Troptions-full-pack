import { XRPL_IOU_EXPLAINER } from "@/content/troptions/xrplIouRegistry";

export function IouVsXrpExplainer() {
  return (
    <section className="wf-panel">
      <h2>{XRPL_IOU_EXPLAINER.title}</h2>
      <ul className="wf-list">
        {XRPL_IOU_EXPLAINER.bullets.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </section>
  );
}
