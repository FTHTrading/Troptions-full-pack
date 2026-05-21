import { WALLET_INVESTIGATION_CHECKLIST } from "@/content/troptions/walletInvestigationChecklist";

export function RecoveryChecklist() {
  return (
    <section className="wf-panel">
      <h2>Recovery Checklist</h2>
      <ol className="wf-list-numbered">
        {WALLET_INVESTIGATION_CHECKLIST.map((item) => (
          <li key={item.id}>
            <strong>{item.section}:</strong> {item.item}
          </li>
        ))}
      </ol>
    </section>
  );
}
