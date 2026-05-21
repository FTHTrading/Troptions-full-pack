import type { XrplAmmPoolRecord } from "@/content/troptions/xrplAmmPoolRegistry";

export function XrplAmmPoolCard({ pool }: { readonly pool: XrplAmmPoolRecord }) {
  return (
    <article className="xp-card">
      <p className="xp-label">AMM Pool</p>
      <h2 className="xp-value">{pool.pair}</h2>
      <p className="xp-muted">LP token: {pool.lpTokenSymbol}</p>
      <div className="xp-grid-3" style={{ marginTop: "1rem" }}>
        <div>
          <p className="xp-label">Depth</p>
          <p>{pool.depth}</p>
        </div>
        <div>
          <p className="xp-label">Fee</p>
          <p>{pool.feeBps} bps</p>
        </div>
        <div>
          <p className="xp-label">Pool Ref</p>
          <p className="xp-code">{pool.poolAddress}</p>
        </div>
      </div>
      <div className="xp-badgeRow">
        <span className={`xp-badge xp-badge-${pool.status}`}>{pool.status}</span>
        <span className={`xp-badge xp-badge-${pool.risk}`}>{pool.risk} risk</span>
      </div>
    </article>
  );
}