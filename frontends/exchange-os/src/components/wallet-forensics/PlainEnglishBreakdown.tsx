import { getPlainEnglishSummary } from "@/lib/troptions/xrplPlainEnglishExplainer";

export function PlainEnglishBreakdown() {
  const explainer = getPlainEnglishSummary();

  return (
    <section className="wf-panel">
      <h2>Where did the 81 XRP go?</h2>
      <p>{explainer.whereDid81XrpGo}</p>
      <div className="wf-grid-2">
        <article className="wf-card">
          <p className="wf-card-label">tx hash</p>
          <p className="wf-mono">84F7978E290E10A8F6FBFF17D04846C9E90EDC8224A40071DB70D55458A2FD47</p>
          <p><strong>amount:</strong> 81.417325 XRP</p>
          <p><strong>from:</strong> <span className="wf-mono">rpP12ND2K7ZRzXZBEUnQM2i18tMGytXnW1</span></p>
          <p><strong>to:</strong> <span className="wf-mono">rKKbNYZRqwPgZYkFWvqNUFBuscEyiFyCE</span></p>
          <p><strong>destination tag:</strong> 614122458</p>
          <p><strong>outcome:</strong> success</p>
        </article>
        <article className="wf-card wf-warning-card">
          <h3>Support and recovery prompts</h3>
          <p><strong>support message:</strong> ask ChangeNOW to map destination tag 614122458 to internal order.</p>
          <p><strong>refund question:</strong> if payout failed, can XRP be refunded to sender?</p>
          <p><strong>exchange order lookup:</strong> which payout asset/address was linked to this tag?</p>
        </article>
      </div>

      <article className="wf-card wf-warning-card">
        <h3>Most important control clue</h3>
        <p>{explainer.keyControlQuestion}</p>
        <ul className="wf-list">
          {explainer.suspiciousRegularKeys.map((key) => (
            <li key={key} className="wf-mono">{key}</li>
          ))}
        </ul>
      </article>

      <article className="wf-card">
        <h3>Plain-English timeline</h3>
        <ol className="wf-list-numbered">
          {explainer.timeline.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </article>
    </section>
  );
}
