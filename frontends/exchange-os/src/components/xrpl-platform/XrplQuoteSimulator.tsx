import { simulateXrplTrade } from "@/lib/troptions/xrplTradeSimulationEngine";

export function XrplQuoteSimulator() {
  const quote = simulateXrplTrade({ fromAsset: "XRP", toAsset: "TROPTIONS", amount: 1000, venue: "pathfinding" });

  return (
    <section className="xp-card">
      <p className="xp-label">Pathfinding Quote Simulator</p>
      <h2 className="xp-value">Unsigned route estimate</h2>
      <p className="xp-muted">Simulation-only estimate for cross-currency route planning. No signing or submission occurs in this app.</p>
      <div className="xp-grid-3" style={{ marginTop: "1rem" }}>
        <div><p className="xp-label">Expected Output</p><p>{quote.expectedOutput}</p></div>
        <div><p className="xp-label">Spread</p><p>{quote.spreadBps} bps</p></div>
        <div><p className="xp-label">Slippage</p><p>{quote.slippageBps} bps</p></div>
        <div><p className="xp-label">Fee</p><p>{quote.feeBps} bps</p></div>
        <div><p className="xp-label">Liquidity Risk</p><p>{quote.liquidityRisk}</p></div>
        <div><p className="xp-label">Trustline Risk</p><p>{quote.trustlineRisk}</p></div>
      </div>
      <p className="xp-muted" style={{ marginTop: "1rem" }}>{quote.auditHint}</p>
    </section>
  );
}