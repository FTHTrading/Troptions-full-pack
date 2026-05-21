import { getXrplMainnetReadinessGate } from "@/lib/troptions/xrplMainnetReadinessGate";

export function XrplReadinessGatePanel() {
  const gate = getXrplMainnetReadinessGate();

  return (
    <section className="xp-card xp-warning">
      <p className="xp-label">Mainnet Readiness Gate</p>
      <h2 className="xp-value">Execution blocked by default</h2>
      <p>{gate.blockedReason}</p>
      <div className="xp-grid-2" style={{ marginTop: "1rem" }}>
        <div>
          <p className="xp-label">Required Approvals</p>
          <ul className="xp-muted">
            {gate.requiredApprovals.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div>
          <p className="xp-label">Blocked Transactions</p>
          <ul className="xp-muted">
            {gate.blockedTransactionTypes.slice(0, 6).map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </div>
      <p className="xp-muted" style={{ marginTop: "1rem" }}>{gate.auditHint}</p>
    </section>
  );
}