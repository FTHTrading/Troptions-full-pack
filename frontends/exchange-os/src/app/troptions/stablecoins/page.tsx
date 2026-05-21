import Image from "next/image";
import Link from "next/link";
import { STABLECOIN_ISSUER_REGISTRY, type StablecoinIssuerRecord } from "@/content/troptions/stablecoinIssuerRegistry";
import { XRPL_IOU_REGISTRY, type XrplIouRecord } from "@/content/troptions/xrplIouRegistry";

export const metadata = {
  title: "Stablecoin Rail Intelligence | TROPTIONS",
  description:
    "TROPTIONS institutional-grade stablecoin and IOU reference: USDC, USDT, PAXG, PYUSD, USDP and all XRPL gateway IOUs with asset classes, transfer fees, chain support, and risk controls.",
};
// ── Supply lookup (from registry notes) ─────────────────────────────────────
const IOU_SUPPLY: Record<string, string> = {
  TROPTIONS: "100,000,000",
  USDC:      "175,000,000",
  USDT:      "100,000,000",
  DAI:       "50,000,000",
  EURC:      "50,000,000",
};
// ── Asset class badge styling ────────────────────────────────────────────────
const ASSET_CLASS_STYLE: Record<string, { bg: string; color: string; border: string }> = {
  "Stablecoin":        { bg: "#052e16", color: "#4ade80", border: "#166534" },
  "Commodity":         { bg: "#1c1003", color: "#fbbf24", border: "#92400e" },
  "Platform Token":    { bg: "#1e0a4e", color: "#a78bfa", border: "#4c1d95" },
  "Custom Token":      { bg: "#1c0a00", color: "#fb923c", border: "#7c2d12" },
  "RWA Receipt":       { bg: "#001c22", color: "#22d3ee", border: "#155e75" },
  "Sovereign Bond":    { bg: "#03143a", color: "#60a5fa", border: "#1e40af" },
  "Attestation Marker":{ bg: "#150d38", color: "#c4b5fd", border: "#5b21b6" },
};

// ── On-chain status badge ────────────────────────────────────────────────────
const STATUS_STYLE: Record<string, { bg: string; color: string; border: string; label: string }> = {
  issued:  { bg: "#052e16", color: "#4ade80", border: "#166534", label: "LIVE" },
  pending: { bg: "#1c1003", color: "#fbbf24", border: "#92400e", label: "PENDING" },
  draft:   { bg: "#1e293b", color: "#94a3b8", border: "#475569", label: "DRAFT" },
};

// ── Chain pill colors ────────────────────────────────────────────────────────
const CHAIN_COLOR: Record<string, string> = {
  "Ethereum":       "#3b5fc0",
  "Solana":         "#7a34cc",
  "TRON":           "#a11414",
  "Base":           "#0040b3",
  "Arbitrum":       "#1a7cbf",
  "Polygon":        "#5c2aa3",
  "Avalanche":      "#8b1212",
  "Optimism":       "#b30014",
  "XRPL":           "#7a5c00",
  "Stellar":        "#0a6f82",
  "Internal ledger":"#374151",
};

// ── Gateway IOU deal-closing metadata ────────────────────────────────────────
const GATEWAY_IOUS = [
  { symbol: "USDC", issuer: "Circle",         logo: "/assets/troptions/logos/usdc-iou-logo.svg", role: "USD Settlement",    roleColor: "#4ade80", desc: "Primary USD settlement. Regulated by Circle, redeemable 1:1 for US dollars held in reserve." },
  { symbol: "USDT", issuer: "Tether",         logo: "/assets/troptions/logos/usdt-iou-logo.svg", role: "USD Liquidity",     roleColor: "#fbbf24", desc: "World's most liquid stablecoin. Deep cross-chain liquidity for high-volume deal funding." },
  { symbol: "DAI",  issuer: "MakerDAO / Sky", logo: "/assets/troptions/logos/dai-iou-logo.svg",  role: "DeFi-Native USD",   roleColor: "#a78bfa", desc: "Decentralized, over-collateralized. No centralized freeze risk — ideal for autonomous deal contracts." },
  { symbol: "EURC", issuer: "Circle (EUR)",   logo: "/assets/troptions/logos/eurc-iou-logo.svg", role: "EUR Settlement",    roleColor: "#60a5fa", desc: "Euro-denominated deals and cross-border transactions settling in EUR via Circle's European entity." },
] as const;

// ── Stablecoin logo + sub-page map ───────────────────────────────────────────
const STABLECOIN_META: Record<string, { logo: string; subPage?: string; assetClass: string; chains?: readonly string[] }> = {
  "USDC":         { logo: "/assets/troptions/logos/usdc-iou-logo.svg",       subPage: "/troptions/stablecoins/usdc",  assetClass: "Stablecoin" },
  "USDT":         { logo: "/assets/troptions/logos/usdt-iou-logo.svg",       subPage: "/troptions/stablecoins/usdt",  assetClass: "Stablecoin" },
  "DAI":          { logo: "/assets/troptions/logos/dai-iou-logo.svg",        subPage: "/troptions/stablecoins/dai",   assetClass: "Stablecoin" },
  "EURC":         { logo: "/assets/troptions/logos/eurc-iou-logo.svg",       subPage: "/troptions/stablecoins/eurc",  assetClass: "Stablecoin" },
  "PYUSD":        { logo: "/assets/troptions/logos/pyusd-iou-logo.svg",      subPage: "/troptions/stablecoins/pyusd", assetClass: "Stablecoin" },
  "USDP":         { logo: "/assets/troptions/logos/usdp-iou-logo.svg",       subPage: "/troptions/stablecoins/usdp",  assetClass: "Stablecoin" },
  "PAXG":         { logo: "/assets/troptions/logos/paxg-iou-logo.svg",       subPage: "/troptions/stablecoins/paxg",  assetClass: "Commodity" },
  "TRU-UNIT":     { logo: "/assets/troptions/logos/troptions-iou-logo.svg",  assetClass: "Platform Token" },
  "TRU-GOLD":     { logo: "/assets/troptions/logos/xaua-iou-logo.svg",       assetClass: "Commodity" },
  "TRU-TREASURY": { logo: "/assets/troptions/logos/troptions-iou-logo.svg",  assetClass: "Platform Token" },
};

// ── Helper: format transfer fee ──────────────────────────────────────────────
function fmtFee(bps: number): string {
  if (bps === 0) return "No Fee";
  return `${bps} bps · ${(bps / 100).toFixed(2)}%`;
}

// ── Sub-components ───────────────────────────────────────────────────────────

function IouCard({ iou }: { readonly iou: XrplIouRecord }) {
  const cls = ASSET_CLASS_STYLE[iou.assetClass] ?? ASSET_CLASS_STYLE["Custom Token"];
  const sts = STATUS_STYLE[iou.onChainStatus ?? "draft"];
  return (
    <article style={{
      background: "rgba(12,20,36,0.92)",
      border: "1px solid rgba(201,168,76,0.2)",
      borderRadius: "0.75rem",
      padding: "1.25rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.9rem",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.85rem" }}>
        {iou.logoPath && (
          <Image
            src={iou.logoPath}
            alt={`${iou.currency} logo`}
            width={64}
            height={64}
            style={{ borderRadius: "50%", border: "1px solid rgba(201,168,76,0.25)", flexShrink: 0 }}
          />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.2rem" }}>
            <span style={{ fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900, fontSize: "1.15rem", color: "#f0cf82", letterSpacing: "0.04em" }}>
              {iou.currency}
            </span>
            {/* Asset class badge */}
            <span style={{ background: cls.bg, color: cls.color, border: `1px solid ${cls.border}`, borderRadius: "0.3rem", padding: "0.1rem 0.45rem", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" }}>
              {iou.assetClass}
            </span>
            {/* Status badge */}
            <span style={{ background: sts.bg, color: sts.color, border: `1px solid ${sts.border}`, borderRadius: "0.3rem", padding: "0.1rem 0.45rem", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.07em" }}>
              {sts.label}
            </span>
          </div>
          {iou.issuerLabel && (
            <p style={{ margin: 0, fontSize: "0.72rem", color: "#64748b", fontFamily: "monospace" }}>{iou.issuerLabel}</p>
          )}
        </div>
      </div>

      {/* RWA description */}
      {iou.rwaDescription && (
        <p style={{ margin: 0, fontSize: "0.78rem", color: "#94a3b8", lineHeight: 1.55 }}>{iou.rwaDescription}</p>
      )}

      {/* Meta row */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", alignItems: "center" }}>
        {/* Transfer fee */}
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.22)", borderRadius: "0.35rem", padding: "0.2rem 0.6rem", fontSize: "0.72rem", color: "#d4a840", fontWeight: 600 }}>
          <span style={{ opacity: 0.7 }}>Transfer Fee:</span> {fmtFee(iou.transferFeeRateBps)}
        </span>
        {/* XRPL chain pill */}
        <span style={{ background: "#1a1200", color: "#c9a84c", border: "1px solid #4a3800", borderRadius: "99px", padding: "0.15rem 0.6rem", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.06em" }}>
          XRPL
        </span>
      </div>

      {/* Compliance note */}
      <p style={{ margin: 0, fontSize: "0.71rem", color: "#475569", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "0.6rem" }}>
        {iou.note}
      </p>

      {/* Footer actions */}
      {iou.explorerUrl && (
        <div style={{ marginTop: "-0.2rem" }}>
          <a
            href={iou.explorerUrl}
            target="_blank"
            rel="noreferrer noopener"
            style={{ fontSize: "0.75rem", color: "#c9a84c", fontWeight: 600, textDecoration: "none" }}
          >
            View on XRPScan ↗
          </a>
        </div>
      )}
    </article>
  );
}

function StablecoinCard({ coin }: { readonly coin: StablecoinIssuerRecord }) {
  const meta = STABLECOIN_META[coin.symbol];
  const cls = ASSET_CLASS_STYLE[meta?.assetClass ?? "Stablecoin"];
  return (
    <article style={{
      background: "rgba(245,240,228,0.97)",
      border: "1px solid rgba(201,154,60,0.4)",
      borderRadius: "0.75rem",
      padding: "1.25rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.9rem",
      color: "#0f172a",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.85rem" }}>
        {meta?.logo && (
          <Image
            src={meta.logo}
            alt={`${coin.symbol} logo`}
            width={64}
            height={64}
            style={{ borderRadius: "50%", border: "1px solid rgba(201,154,60,0.3)", flexShrink: 0 }}
          />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap", marginBottom: "0.2rem" }}>
            <span style={{ fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900, fontSize: "1.1rem", color: "#0f172a", letterSpacing: "0.04em" }}>
              {coin.symbol}
            </span>
            <span style={{ background: cls.bg, color: cls.color, border: `1px solid ${cls.border}`, borderRadius: "0.3rem", padding: "0.1rem 0.45rem", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" }}>
              {meta?.assetClass ?? "Stablecoin"}
            </span>
            {coin.defaultInstitutionalRoute && (
              <span style={{ background: "#1e3a5f", color: "#93c5fd", border: "1px solid #1e40af", borderRadius: "0.3rem", padding: "0.1rem 0.45rem", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.07em" }}>
                DEFAULT ROUTE
              </span>
            )}
          </div>
          <p style={{ margin: 0, fontSize: "0.78rem", color: "#374151", fontWeight: 500 }}>Issuer: {coin.issuer}</p>
        </div>
      </div>

      {/* Chain support pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
        {coin.chainSupport.map((chain) => (
          <span key={chain} style={{ background: CHAIN_COLOR[chain] ?? "#374151", color: "#fff", borderRadius: "99px", padding: "0.15rem 0.6rem", fontSize: "0.68rem", fontWeight: 600, opacity: 0.9 }}>
            {chain}
          </span>
        ))}
      </div>

      {/* Use cases */}
      <div>
        <p style={{ margin: "0 0 0.3rem", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#374151" }}>Use Cases</p>
        <ul style={{ margin: 0, paddingLeft: "1rem", display: "flex", flexDirection: "column", gap: "0.15rem" }}>
          {coin.useCases.map((uc) => (
            <li key={uc} style={{ fontSize: "0.76rem", color: "#1e293b", lineHeight: 1.4 }}>{uc}</li>
          ))}
        </ul>
      </div>

      {/* Risk controls */}
      <div>
        <p style={{ margin: "0 0 0.3rem", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#7f1d1d" }}>Risk Controls</p>
        <ul style={{ margin: 0, paddingLeft: "1rem", display: "flex", flexDirection: "column", gap: "0.15rem" }}>
          {coin.riskControls.map((rc) => (
            <li key={rc} style={{ fontSize: "0.76rem", color: "#374151", lineHeight: 1.4 }}>{rc}</li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(15,23,42,0.12)", paddingTop: "0.7rem", flexWrap: "wrap", gap: "0.5rem" }}>
        <span style={{ fontSize: "0.7rem", color: "#64748b" }}>{coin.chainSupportNote}</span>
        {meta?.subPage && (
          <Link
            href={meta.subPage}
            style={{ fontSize: "0.78rem", color: "#92400e", fontWeight: 700, textDecoration: "none", background: "rgba(201,154,60,0.12)", border: "1px solid rgba(201,154,60,0.3)", borderRadius: "0.35rem", padding: "0.25rem 0.65rem" }}
          >
            Full Profile →
          </Link>
        )}
      </div>
    </article>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function TroptionsStablecoinsPage() {
  const iouStablecoins = XRPL_IOU_REGISTRY.filter((r) => r.category === "stablecoin" || r.category === "platform-token" || r.category === "commodity" || r.category === "bond" || r.category === "attestation" || r.category === "rwa-receipt" || r.category === "custom-token");
  const liveCount = XRPL_IOU_REGISTRY.filter((r) => r.onChainStatus === "issued").length;
  const publicCoins = STABLECOIN_ISSUER_REGISTRY.filter((c) => !c.symbol.startsWith("TRU-"));
  const internalUnits = STABLECOIN_ISSUER_REGISTRY.filter((c) => c.symbol.startsWith("TRU-"));

  return (
    <main className="te-page">
      <div className="te-wrap" style={{ gap: "1.75rem" }}>

        {/* ── Mainnet confirmation banner ─────────────────────────────────────── */}
        <div style={{ background: "rgba(5,46,22,0.35)", border: "1px solid rgba(22,101,52,0.6)", borderRadius: "0.65rem", padding: "0.75rem 1rem", display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
          <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>✅</span>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "#86efac", lineHeight: 1.55 }}>
            <strong>Live on Mainnet.</strong> USDC, USDT, DAI, and EURC gateway IOUs are confirmed issued on XRPL and Stellar mainnet as of 2026-04-28. All issuance transactions are publicly verifiable on XRPScan and Stellar Expert. This is real infrastructure — not a simulation.
          </p>
        </div>

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <header className="te-panel" style={{ padding: "1.75rem" }}>
          <p className="te-kicker">TROPTIONS · Institutional Finance Rail</p>
          <h1 className="te-heading">Stablecoin Rail Intelligence</h1>
          <p className="te-subheading" style={{ maxWidth: "700px", marginTop: "0.5rem" }}>
            Comprehensive reference for every stablecoin, IOU, and asset receipt across the TROPTIONS gateway — including asset classes, chain support, transfer fees, issuer controls, and risk frameworks. Built to institutional standards.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginTop: "1.1rem" }}>
            <a href="https://xrpscan.com/account/rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ" target="_blank" rel="noreferrer noopener"
               className="rounded-lg bg-(--gold) px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
               style={{ textDecoration: "none" }}>
              View XRPL Issuer on XRPScan ↗
            </a>
            <Link href="/troptions/wallets"
               className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
               style={{ textDecoration: "none" }}>
              Wallet Infrastructure →
            </Link>
          </div>
        </header>

        {/* ── Stats row ────────────────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0.75rem" }}>
          {[
            { label: "XRPL IOUs", value: `${iouStablecoins.length}`, sub: "gateway instruments" },
            { label: "Stablecoins", value: `${publicCoins.length}`, sub: "supported rails" },
            { label: "Chains Covered", value: "10+", sub: "multi-chain" },
            { label: "Status", value: `${liveCount} LIVE`, sub: `${iouStablecoins.length - liveCount} DRAFT` },
          ].map((s) => (
            <div key={s.label} style={{ background: "rgba(12,20,36,0.88)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "0.65rem", padding: "0.9rem 1rem" }}>
              <p style={{ margin: "0 0 0.15rem", fontSize: "0.67rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>{s.label}</p>
              <p style={{ margin: 0, fontSize: "1.35rem", fontWeight: 900, color: "#f0cf82", fontFamily: "'Arial Black', Arial, sans-serif", lineHeight: 1.1 }}>{s.value}</p>
              <p style={{ margin: "0.15rem 0 0", fontSize: "0.7rem", color: "#64748b" }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Zero-fee selling point banner ──────────────────────────────── */}
        <div style={{ background: "linear-gradient(135deg, #052e16 0%, #0a3d22 100%)", border: "1px solid rgba(74,222,128,0.35)", borderRadius: "0.875rem", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "1.5rem" }}>
            💸
          </div>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <p style={{ margin: "0 0 0.3rem", fontWeight: 800, fontSize: "1.05rem", color: "#4ade80", letterSpacing: "0.02em" }}>
              Zero Transfer Fees on All Four Stablecoins
            </p>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#86efac", lineHeight: 1.55 }}>
              USDC, USDT, DAI, and EURC carry a <strong>0 bps transfer fee</strong> — every on-ledger settlement moves at face value with no gateway deduction.
              Each IOU is redeemable 1:1 for the underlying stablecoin held in reserve by the original issuer. TROPTIONS native carries a 25 bps sustainability fee — see the full schedule below.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.35rem", flexShrink: 0 }}>
            <span style={{ background: "#052e16", border: "1px solid #166534", color: "#4ade80", borderRadius: "0.4rem", padding: "0.3rem 0.8rem", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.08em" }}>0 BPS · FREE</span>
            <span style={{ fontSize: "0.67rem", color: "#4ade80", opacity: 0.7 }}>USDC · USDT · DAI · EURC</span>
          </div>
        </div>

        {/* ── Fee Schedule table ──────────────────────────────────────────── */}
        <section style={{ background: "rgba(12,20,36,0.92)", border: "1px solid rgba(201,168,76,0.22)", borderRadius: "1rem", padding: "1.5rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <p style={{ margin: "0 0 0.25rem", fontSize: "0.67rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700 }}>TROPTIONS Gateway</p>
            <h2 style={{ margin: 0, fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "clamp(1.1rem,2.5vw,1.45rem)", color: "#f0cf82" }}>Complete Fee Schedule</h2>
            <p style={{ margin: "0.3rem 0 0", fontSize: "0.8rem", color: "#64748b", lineHeight: 1.5 }}>
              All issued and planned IOUs — asset class, maximum supply, XRPL transfer fee, and live status.
            </p>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(201,168,76,0.2)" }}>
                  {["Asset", "Asset Class", "Max Supply", "Transfer Fee", "Status"].map((h) => (
                    <th key={h} style={{ padding: "0.5rem 0.75rem", textAlign: "left", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#64748b", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {XRPL_IOU_REGISTRY.map((iou, i) => {
                  const sts = STATUS_STYLE[iou.onChainStatus ?? "draft"];
                  const cls = ASSET_CLASS_STYLE[iou.assetClass] ?? ASSET_CLASS_STYLE["Custom Token"];
                  const feeFree = iou.transferFeeRateBps === 0;
                  return (
                    <tr key={iou.currency} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                      {/* Asset */}
                      <td style={{ padding: "0.65rem 0.75rem", whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                          {iou.logoPath && (
                            <Image src={iou.logoPath} alt={iou.currency} width={28} height={28} style={{ borderRadius: "50%", border: "1px solid rgba(201,168,76,0.2)", flexShrink: 0 }} />
                          )}
                          <span style={{ fontWeight: 800, color: "#f0cf82", fontFamily: "'Arial Black', Arial, sans-serif", letterSpacing: "0.04em" }}>{iou.currency}</span>
                        </div>
                      </td>
                      {/* Asset Class */}
                      <td style={{ padding: "0.65rem 0.75rem" }}>
                        <span style={{ background: cls.bg, color: cls.color, border: `1px solid ${cls.border}`, borderRadius: "0.3rem", padding: "0.15rem 0.5rem", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                          {iou.assetClass}
                        </span>
                      </td>
                      {/* Supply */}
                      <td style={{ padding: "0.65rem 0.75rem", color: "#94a3b8", whiteSpace: "nowrap" }}>
                        {IOU_SUPPLY[iou.currency] ?? "—"}
                      </td>
                      {/* Fee */}
                      <td style={{ padding: "0.65rem 0.75rem", whiteSpace: "nowrap" }}>
                        {feeFree ? (
                          <span style={{ background: "#052e16", border: "1px solid #166534", color: "#4ade80", borderRadius: "0.3rem", padding: "0.15rem 0.55rem", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.06em" }}>FREE</span>
                        ) : (
                          <span style={{ color: "#fbbf24", fontWeight: 700 }}>{iou.transferFeeRateBps} bps · {(iou.transferFeeRateBps / 100).toFixed(2)}%</span>
                        )}
                      </td>
                      {/* Status */}
                      <td style={{ padding: "0.65rem 0.75rem" }}>
                        <span style={{ background: sts.bg, color: sts.color, border: `1px solid ${sts.border}`, borderRadius: "99px", padding: "0.15rem 0.6rem", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em" }}>
                          {sts.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p style={{ margin: "0.85rem 0 0", fontSize: "0.7rem", color: "#475569", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "0.75rem" }}>
            Transfer fees are deducted by the XRPL protocol at settlement time. 0 bps assets transfer at exactly face value.
            TROPTIONS (25 bps) sustains gateway infrastructure. Commodity and specialty IOUs carry fees commensurate with custody and compliance overhead.
            All issued IOUs are redeemable 1:1 for the underlying asset via the TROPTIONS Gateway redemption process.
          </p>
        </section>

        {/* ── Gateway Deal Rail ────────────────────────────────────────────── */}
        <section style={{ background: "linear-gradient(135deg, #0c1e35 0%, #071a2e 50%, #0c1e35 100%)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "1rem", padding: "2rem" }}>

          {/* Section header */}
          <div style={{ marginBottom: "1.75rem" }}>
            <p style={{ margin: "0 0 0.5rem", fontSize: "0.67rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700 }}>
              TROPTIONS · Issued XRPL + Stellar Mainnet · 2026-04-28
            </p>
            <h2 style={{ margin: "0 0 0.6rem", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "clamp(1.35rem,3vw,1.9rem)", color: "#f0cf82", lineHeight: 1.2 }}>
              4-Currency Deal Closing System
            </h2>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#94a3b8", lineHeight: 1.6, maxWidth: "680px" }}>
              TROPTIONS Gateway has issued four institutional stablecoins as native trust-line currencies on both XRPL and Stellar mainnet.
              Together they cover <strong style={{ color: "#e2e8f0" }}>USD (two variants for liquidity depth), decentralized DeFi-native USD, and EUR</strong> — giving every counterparty a verified settlement currency that matches their regulatory and liquidity requirements.
              All four are live on-chain right now. Anyone can verify balances and trustlines independently.
            </p>
          </div>

          {/* 4 logo cards — prominent */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            {GATEWAY_IOUS.map((g) => (
              <div key={g.symbol} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,168,76,0.18)", borderRadius: "0.875rem", padding: "1.25rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", textAlign: "center" }}>
                {/* Logo */}
                <div style={{ width: "80px", height: "80px", borderRadius: "50%", border: "2px solid rgba(201,168,76,0.3)", overflow: "hidden", flexShrink: 0, background: "rgba(0,0,0,0.25)" }}>
                  <Image src={g.logo} alt={`${g.symbol} logo`} width={80} height={80} style={{ objectFit: "contain", padding: "4px" }} />
                </div>
                {/* Ticker + LIVE */}
                <div>
                  <p style={{ margin: 0, fontWeight: 900, fontSize: "1.5rem", color: "#f0cf82", fontFamily: "'Arial Black', Arial, sans-serif", letterSpacing: "0.05em", lineHeight: 1 }}>{g.symbol}</p>
                  <p style={{ margin: "0.25rem 0 0.35rem", fontSize: "0.72rem", color: "#64748b" }}>{g.issuer}</p>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", background: "#052e16", border: "1px solid #166534", borderRadius: "99px", padding: "0.18rem 0.65rem", fontSize: "0.65rem", fontWeight: 700, color: "#4ade80", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80", animation: "pulse 2s infinite" }} />
                    LIVE
                  </span>
                </div>
                {/* Role badge */}
                <span style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${g.roleColor}40`, borderRadius: "0.4rem", padding: "0.2rem 0.6rem", fontSize: "0.68rem", fontWeight: 700, color: g.roleColor, letterSpacing: "0.06em" }}>
                  {g.role}
                </span>
                {/* Description */}
                <p style={{ margin: 0, fontSize: "0.74rem", color: "#64748b", lineHeight: 1.5 }}>{g.desc}</p>
              </div>
            ))}
          </div>

          {/* Deal workflow steps */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1.5rem" }}>
            <p style={{ margin: "0 0 1rem", fontSize: "0.68rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700 }}>
              How to Process a Deal Using Gateway IOUs
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.85rem" }}>
              {[
                { n: "01", title: "Open Trustline",    body: "Counterparty opens a trustline to the TROPTIONS Gateway Issuer on XRPL or Stellar. One setup — all 4 IOUs unlocked. Zero cost, takes 10 seconds." },
                { n: "02", title: "Fund the Deal",     body: "Buyer sends USDC, USDT, DAI, or EURC IOU to the deal escrow address. Settles on-ledger in 3–5 seconds. Balance verifiable by anyone, anywhere." },
                { n: "03", title: "Proof of Funds",    body: "Gateway confirms IOU balance, trustline, and deal docs (RWA receipt, KYC attestation, PoF). All verifiable via XRPScan or Stellar Expert." },
                { n: "04", title: "Execute & Release", body: "Condition met (contract signed, RWA transferred, time-lock expired) → IOUs release from escrow to seller. Redeemable 1:1 for the underlying stablecoin." },
              ].map((s) => (
                <div key={s.n} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "0.75rem", padding: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.6rem" }}>
                    <span style={{ width: "28px", height: "28px", borderRadius: "0.5rem", background: "rgba(201,168,76,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "0.7rem", color: "#f0cf82", flexShrink: 0 }}>{s.n}</span>
                    <span style={{ fontWeight: 700, fontSize: "0.88rem", color: "#e2e8f0" }}>{s.title}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.76rem", color: "#64748b", lineHeight: 1.55 }}>{s.body}</p>
                </div>
              ))}
            </div>

            {/* Verify links */}
            <div style={{ marginTop: "1.25rem", display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
              <span style={{ fontSize: "0.72rem", color: "#475569" }}>Verify on-chain:</span>
              {[
                { label: "XRPL Issuer (XRPScan)", url: "https://xrpscan.com/account/rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ" },
                { label: "XRPL Distributor (Bithomp)", url: "https://bithomp.com/explorer/rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt" },
                { label: "Stellar Issuer", url: "https://stellar.expert/explorer/public/account/GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4" },
                { label: "Stellar Distributor", url: "https://stellar.expert/explorer/public/account/GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC" },
              ].map((ex) => (
                <a key={ex.url} href={ex.url} target="_blank" rel="noreferrer noopener"
                  style={{ fontSize: "0.75rem", fontWeight: 600, color: "#c9a84c", textDecoration: "none" }}>
                  {ex.label} ↗
                </a>
              ))}
            </div>

            {/* Proof of Issuance CTA */}
            <div style={{ marginTop: "1.1rem", background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "0.75rem", padding: "1rem 1.25rem", display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ margin: "0 0 0.2rem", fontWeight: 800, fontSize: "0.9rem", color: "#f0cf82" }}>Every issuance transaction hash is published</p>
                <p style={{ margin: 0, fontSize: "0.76rem", color: "#94a3b8", lineHeight: 1.5 }}>
                  View full proof of issuance, balance verification guide, XRPL Escrow &amp; NFT receipt mechanisms — seller-ready documentation with direct explorer links for each IOU.
                </p>
              </div>
              <Link href="/troptions/verification"
                style={{ display: "inline-block", background: "rgba(201,168,76,0.18)", border: "1px solid rgba(201,168,76,0.5)", color: "#f0cf82", borderRadius: "0.5rem", padding: "0.55rem 1.1rem", fontWeight: 800, fontSize: "0.82rem", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>
                View Proof of Issuance →
              </Link>
            </div>
          </div>
        </section>

        {/* ── XRPL Gateway IOUs ────────────────────────────────────────────── */}
        <section>
          <div style={{ marginBottom: "1rem" }}>
            <p style={{ margin: "0 0 0.2rem", fontSize: "0.7rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>TROPTIONS · XRPL Mainnet</p>
            <h2 style={{ margin: 0, fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "clamp(1.2rem, 2.5vw, 1.65rem)", color: "#f0cf82" }}>XRPL Gateway IOUs</h2>
            <p style={{ margin: "0.35rem 0 0", fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.5, maxWidth: "680px" }}>
              All issued assets reference the canonical TROPTIONS Gateway Issuer address. Each IOU requires an authorized trustline. Transfer fees, freeze, and clawback controls apply as documented below.
            </p>
          </div>
          <div style={{ display: "grid", gap: "0.85rem", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))" }}>
            {XRPL_IOU_REGISTRY.map((iou) => (
              <IouCard key={iou.currency} iou={iou} />
            ))}
          </div>
        </section>

        {/* ── Institutional Stablecoins ──────────────────────────────────────── */}
        <section>
          <div style={{ marginBottom: "1rem" }}>
            <p style={{ margin: "0 0 0.2rem", fontSize: "0.7rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>Integrated · Multi-Chain</p>
            <h2 style={{ margin: 0, fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "clamp(1.2rem, 2.5vw, 1.65rem)", color: "#f2efe8" }}>Institutional Stablecoins</h2>
            <p style={{ margin: "0.35rem 0 0", fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.5, maxWidth: "680px" }}>
              Industry-standard stablecoins supported as settlement rails across the TROPTIONS gateway — USDC, USDT, DAI, and EURC are live as gateway IOUs on XRPL and Stellar mainnet, with additional chains available through native issuer infrastructure.
            </p>
          </div>
          <div style={{ display: "grid", gap: "0.85rem", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))" }}>
            {publicCoins.map((coin) => (
              <StablecoinCard key={coin.symbol} coin={coin} />
            ))}
          </div>
        </section>

        {/* ── Internal Accounting Units ──────────────────────────────────────── */}
        <section>
          <div style={{ marginBottom: "1rem" }}>
            <p style={{ margin: "0 0 0.2rem", fontSize: "0.7rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>Internal · Platform Accounting</p>
            <h2 style={{ margin: 0, fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "clamp(1.1rem, 2vw, 1.35rem)", color: "#94a3b8" }}>Internal Accounting Units</h2>
          </div>
          <div style={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
            {internalUnits.map((coin) => (
              <div key={coin.symbol} style={{ background: "rgba(30,41,59,0.4)", border: "1px solid rgba(71,85,105,0.35)", borderRadius: "0.65rem", padding: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900, fontSize: "0.95rem", color: "#94a3b8" }}>{coin.symbol}</span>
                  <span style={{ background: "#1e293b", color: "#64748b", border: "1px solid #334155", borderRadius: "0.3rem", padding: "0.1rem 0.4rem", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase" }}>Internal</span>
                </div>
                <p style={{ margin: "0 0 0.4rem", fontSize: "0.74rem", color: "#64748b" }}>{coin.issuer}</p>
                <ul style={{ margin: 0, paddingLeft: "1rem" }}>
                  {coin.riskControls.map((rc) => (
                    <li key={rc} style={{ fontSize: "0.72rem", color: "#475569", lineHeight: 1.45 }}>{rc}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── Paxos ecosystem link ─────────────────────────────────────────── */}
        <div className="te-future-panel" style={{ padding: "1.25rem" }}>
          <h3 style={{ margin: "0 0 0.4rem", fontFamily: "Georgia, serif", fontSize: "1.05rem", color: "#f0cf82" }}>Paxos Regulated Stablecoin Ecosystem</h3>
          <p style={{ margin: "0 0 0.8rem", fontSize: "0.8rem", color: "#94a3b8", lineHeight: 1.55 }}>
            PYUSD, USDP, and PAXG are all issued under Paxos Trust Company oversight. Each carries distinct regulatory posture, redemption mechanics, and reserve transparency requirements.
          </p>
          <Link href="/troptions/stablecoins/paxos"
            style={{ display: "inline-block", background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.35)", color: "#f0cf82", borderRadius: "0.45rem", padding: "0.45rem 0.9rem", fontSize: "0.8rem", fontWeight: 700, textDecoration: "none" }}>
            View Paxos Suite Profile →
          </Link>
        </div>

      </div>
    </main>
  );
}
