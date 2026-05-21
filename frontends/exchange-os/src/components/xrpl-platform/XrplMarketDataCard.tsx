import type { XrplMarketDataRecord } from "@/content/troptions/xrplMarketDataRegistry";

export function XrplMarketDataCard({ record }: { readonly record: XrplMarketDataRecord }) {
  return (
    <article className="xp-card xp-terminal">
      <p className="xp-label">{record.venue}</p>
      <h2 className="xp-value">{record.pair}</h2>
      <div className="xp-grid-3" style={{ marginTop: "1rem" }}>
        <div>
          <p className="xp-label">Last Price</p>
          <p>{record.lastPrice}</p>
        </div>
        <div>
          <p className="xp-label">24h Change</p>
          <p>{record.change24h}</p>
        </div>
        <div>
          <p className="xp-label">24h Volume</p>
          <p>{record.volume24h}</p>
        </div>
      </div>
      <div className="xp-badgeRow">
        <span className={`xp-badge xp-badge-${record.status}`}>{record.status}</span>
        <span className={`xp-badge xp-badge-${record.risk}`}>{record.risk} risk</span>
      </div>
    </article>
  );
}