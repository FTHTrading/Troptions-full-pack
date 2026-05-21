import Image from "next/image";
import type { XrplIssuedAssetRecord } from "@/content/troptions/xrplIssuedAssetRegistry";

const STATUS_STYLE: Record<string, string> = {
  issued: "bg-emerald-950/40 border-emerald-700/50 text-emerald-400",
  pending: "bg-amber-950/30 border-amber-700/40 text-amber-400",
  draft: "bg-slate-800/40 border-slate-600/40 text-slate-400",
};

export function XrplIssuedAssetCard({ asset }: { readonly asset: XrplIssuedAssetRecord }) {
  return (
    <article className="xp-card" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {asset.logoPath && (
          <Image
            src={asset.logoPath}
            alt={`${asset.symbol} logo`}
            width={40}
            height={40}
            style={{ borderRadius: "50%", border: "1px solid rgba(201,168,76,0.25)", flexShrink: 0 }}
          />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p className="xp-label" style={{ marginBottom: "0.1rem" }}>Issued Asset</p>
          <h2 className="xp-value" style={{ margin: 0 }}>{asset.symbol}</h2>
          {asset.displayName && asset.displayName !== asset.symbol && (
            <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: 0 }}>{asset.displayName}</p>
          )}
        </div>
        {/* On-chain status badge */}
        <span
          className={`xp-badge ${STATUS_STYLE[asset.onChainStatus] ?? ""}`}
          style={{ textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em", fontSize: "0.65rem", padding: "0.2rem 0.5rem", borderRadius: "0.25rem", border: "1px solid", flexShrink: 0 }}
        >
          {asset.onChainStatus}
        </span>
      </div>

      {/* RWA description */}
      {asset.rwaDescription && (
        <p style={{ fontSize: "0.78rem", color: "#94a3b8", lineHeight: 1.5, margin: 0 }}>
          {asset.rwaDescription}
        </p>
      )}

      {/* Supply + issuer model */}
      <p className="xp-muted" style={{ fontSize: "0.75rem", margin: 0 }}>
        {asset.assetType} · {asset.issuerModel}
        {asset.supply ? ` · Supply: ${asset.supply}` : ""}
      </p>

      {/* Issuer address */}
      {asset.issuerAddress && (
        <p style={{ fontSize: "0.7rem", color: "#64748b", fontFamily: "monospace", wordBreak: "break-all", margin: 0 }}>
          Issuer: {asset.issuerAddress}
        </p>
      )}

      {/* Feature badges */}
      <div className="xp-badgeRow">
        <span className={`xp-badge ${asset.freezeEnabled ? "xp-badge-medium" : "xp-badge-low"}`}>{asset.freezeEnabled ? "freeze enabled" : "no freeze"}</span>
        <span className={`xp-badge ${asset.clawbackEnabled ? "xp-badge-high" : "xp-badge-low"}`}>{asset.clawbackEnabled ? "clawback enabled" : "no clawback"}</span>
        <span className={`xp-badge ${asset.trustlineRequired ? "xp-badge-medium" : "xp-badge-low"}`}>{asset.trustlineRequired ? "trustline required" : "no trustline"}</span>
      </div>
    </article>
  );
}