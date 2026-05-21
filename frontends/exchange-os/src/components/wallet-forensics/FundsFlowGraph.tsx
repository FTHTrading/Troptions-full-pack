import type { FundsFlowEdge } from "@/lib/troptions/xrplFundsFlowAnalyzer";

type FundsFlowGraphProps = {
  readonly edges: readonly FundsFlowEdge[];
};

export function FundsFlowGraph({ edges }: FundsFlowGraphProps) {
  return (
    <section className="wf-panel">
      <h2>Funds Flow Graph</h2>
      <p className="wf-muted">Read-only directional map. No transaction execution.</p>
      <div className="wf-flow-list">
        {edges.map((edge) => (
          <article key={edge.txHash} className="wf-flow-row">
            <div className="wf-flow-arrow">{edge.from} <span aria-hidden>→</span> {edge.to}</div>
            <div className="wf-flow-meta">
              <span>{edge.amount} {edge.currency}</span>
              <span>tx: {edge.txHash}</span>
              {edge.destinationTag ? <span>tag: {edge.destinationTag}</span> : null}
            </div>
            <p>{edge.explanation}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
