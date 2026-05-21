import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Proof of Issuance | TROPTIONS Gateway Verification",
  description:
    "Full on-chain verification for every TROPTIONS Gateway IOU — issuance transaction hashes, balance verification guide, deal escrow mechanisms, and 1:1 redemption proof.",
};

// ── Issuance proof records ────────────────────────────────────────────────────
const ISSUANCE_PROOFS = [
  {
    symbol: "USDC",
    logo: "/assets/troptions/logos/usdc-iou-logo.svg",
    supply: "175,000,000",
    peg: "1 USD",
    networks: ["XRPL", "Stellar"],
    xrpl: {
      trustSetTx: "63225EF599058DA5AF3B70349DA7927F6155015E91F3C3DBD4BB2656FFA0613A",
      issueTx:    "4CCB18E8838C6B40D4E022B68817D45BAD3E235652C52F0337D82C4E4E5AAB6E",
    },
    stellar: {
      distributorAddress: "GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC",
      issuerAddress:      "GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4",
    },
    date: "2026-05-01",
    note: "Circle USD Coin. 100M issued 2026-04-28 (TX CD7271...) + 75M additional issued 2026-05-01 (TX 4CCB18...). Total 175M USDC verified on XRPL mainnet.",
  },
  {
    symbol: "USDT",
    logo: "/assets/troptions/logos/usdt-iou-logo.svg",
    supply: "100,000,000",
    peg: "1 USD",
    networks: ["XRPL", "Stellar"],
    xrpl: {
      trustSetTx: "01A93483C4CD57053D01CD7B516F9A536A69237AA58A7A614D7ED2F257014241",
      issueTx:    "42092147E2D2BB2E944C7156378A6CEE8B8D0E78FB350266FC1990439D7F1F6F",
    },
    stellar: {
      distributorAddress: "GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC",
      issuerAddress:      "GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4",
    },
    date: "2026-04-28",
    note: "Tether USD. World's largest stablecoin by volume. Explorer dollar value is $0 due to price oracle gap — token balance is issued and verifiable on-chain.",
  },
  {
    symbol: "DAI",
    logo: "/assets/troptions/logos/dai-iou-logo.svg",
    supply: "50,000,000",
    peg: "1 USD",
    networks: ["XRPL", "Stellar"],
    xrpl: {
      trustSetTx: "B14C09D240AF67279EEC84E0CB521766DF9BCFB909E1481486E62B928A528093",
      issueTx:    "C0D75DCCF46DCA6F1776D739A4EC0F521330E170B8BC2E09C7F4D42A2361F641",
    },
    stellar: {
      distributorAddress: "GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC",
      issuerAddress:      "GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4",
    },
    date: "2026-04-28",
    note: "MakerDAO Dai. Decentralized, over-collateralized. AAVE v3 listed collateral. Explorer dollar value is $0 due to price oracle gap — token balance is verified on-chain.",
  },
  {
    symbol: "EURC",
    logo: "/assets/troptions/logos/eurc-iou-logo.svg",
    supply: "50,000,000",
    peg: "1 EUR",
    networks: ["XRPL", "Stellar"],
    xrpl: {
      trustSetTx: "37D4C6F7E0C49CA8DBF8D87FD3332FA7C057583B1052A9A6703634EFC9B33E0F",
      issueTx:    "FF11D7773C0EDF38833A9CEE5AE03DEB6167D87FF07180A275A1DDCABCC560D1",
    },
    stellar: {
      distributorAddress: "GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC",
      issuerAddress:      "GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4",
    },
    date: "2026-04-28",
    note: "Circle Euro Coin. EUR-denominated deal settlement. Explorer dollar value is $0 due to price oracle gap — token balance is verified on-chain.",
  },
] as const;

// ── Explorer helpers ──────────────────────────────────────────────────────────
function xrpscanTx(hash: string) {
  return `https://xrpscan.com/tx/${hash}`;
}
function xrpscanAccount(addr: string) {
  return `https://xrpscan.com/account/${addr}`;
}
function stellarExpert(addr: string) {
  return `https://stellar.expert/explorer/public/account/${addr}`;
}

// ── Short hash display ────────────────────────────────────────────────────────
function shortHash(h: string) {
  return `${h.slice(0, 8)}…${h.slice(-6)}`;
}

// ── Deal mechanism cards ──────────────────────────────────────────────────────
const DEAL_MECHANISMS = [
  {
    icon: "🔒",
    title: "XRPL Escrow",
    tag: "Native on-ledger",
    tagColor: "#4ade80",
    tagBg: "#052e16",
    tagBorder: "#166534",
    points: [
      "EscrowCreate locks IOUs with a time condition or crypto-condition",
      "Counterparty can verify the locked amount on-chain — no trust required",
      "EscrowFinish releases only when condition is met (signature, time, or both)",
      "EscrowCancel returns funds if deal does not close by expiry",
      "The escrow address and amount are publicly visible to both parties",
    ],
    example: `// Example: 30-day lock for deal funding
EscrowCreate {
  Account:       "TROPTIONS_DISTRIBUTION",
  Destination:   "SELLER_ADDRESS",
  Amount:        "1000000",      // in drops for XRP; for IOU use SendMax
  FinishAfter:   <unix timestamp 30 days out>,
  CancelAfter:   <unix timestamp 45 days out>
}`,
    cta: "How to create XRPL Escrow →",
    ctaUrl: "https://xrpl.org/escrow.html",
  },
  {
    icon: "🎫",
    title: "XRPL NFT Issuance Receipt",
    tag: "XLS-20 Standard",
    tagColor: "#a78bfa",
    tagBg: "#1e0a4e",
    tagBorder: "#4c1d95",
    points: [
      "Mint an XLS-20 NFT for each IOU issuance batch as an immutable on-chain receipt",
      "NFT URI field points to a JSON metadata file: deal ID, IOU amount, date, txhash",
      "Transfer the NFT to the buyer/seller as proof-of-funds at deal open",
      "NFT cannot be altered after mint — permanent, verifiable record",
      "Burn the NFT on successful redemption to close the proof loop",
    ],
    example: `// NFT metadata structure (hosted at URI)
{
  "name": "TROPTIONS IOU Issuance Receipt",
  "deal_id": "DEAL-2026-001",
  "iou": "USDC",
  "amount": "1000000",
  "issuer": "rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ",
  "issuance_tx": "CD72712...",
  "date": "2026-04-28",
  "redeemable_1_to_1": true
}`,
    cta: "XRPL XLS-20 NFT Docs →",
    ctaUrl: "https://xrpl.org/non-fungible-tokens.html",
  },
  {
    icon: "⚡",
    title: "Stellar Claimable Balance",
    tag: "Native Stellar",
    tagColor: "#22d3ee",
    tagBg: "#001c22",
    tagBorder: "#155e75",
    points: [
      "CreateClaimableBalance locks a specific IOU amount for a named beneficiary",
      "The claimant (seller) can only claim after the predicate condition is met",
      "Predicates: time lock, before certain date, AND/OR combinations",
      "Lock USDC IOU for exactly 1 party — no ambiguity about who receives funds",
      "Balance is publicly visible on Stellar Expert before claim",
    ],
    example: `// Claimable Balance: lock 1,000 USDC for seller wallet
CreateClaimableBalance {
  asset:  { code: "USDC", issuer: "GB4FHGF..." },
  amount: "1000",
  claimants: [{
    destination: "SELLER_STELLAR_ADDRESS",
    predicate:   { not: { before: <unix 30d> } }  // claimable after 30 days
  }]
}`,
    cta: "Stellar Claimable Balances →",
    ctaUrl: "https://developers.stellar.org/docs/learn/encyclopedia/transactions-specialized/claimable-balances",
  },
];

export default function VerificationPage() {
  return (
    <main className="te-page">
      <div className="te-wrap" style={{ gap: "2rem" }}>

        {/* ── Hero ───────────────────────────────────────────────────────────── */}
        <header className="te-panel" style={{ padding: "1.75rem" }}>
          <p className="te-kicker">TROPTIONS Gateway · On-Chain Verification</p>
          <h1 className="te-heading">Proof of Issuance</h1>
          <p className="te-subheading" style={{ maxWidth: "700px", marginTop: "0.5rem" }}>
            Every TROPTIONS Gateway IOU has a public, permanent transaction hash on XRPL and Stellar mainnet.
            Anyone — including counterparties, attorneys, and auditors — can independently verify issuance,
            supply, and the 1:1 backing model with no reliance on TROPTIONS representations.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "1.25rem" }}>
            <a href={xrpscanAccount("rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ")} target="_blank" rel="noreferrer noopener"
               className="rounded-lg bg-(--gold) px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
               style={{ textDecoration: "none" }}>
              XRPL Issuer on XRPScan ↗
            </a>
            <a href={stellarExpert("GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4")} target="_blank" rel="noreferrer noopener"
               className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
               style={{ textDecoration: "none" }}>
              Stellar Issuer on Expert ↗
            </a>
            <Link href="/troptions/stablecoins"
               className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
               style={{ textDecoration: "none" }}>
              Fee Schedule →
            </Link>
          </div>
        </header>

        {/* ── Price oracle explainer banner ──────────────────────────────────── */}
        <div style={{ background: "rgba(30, 41, 59, 0.7)", border: "1px solid rgba(251,191,36,0.4)", borderRadius: "0.875rem", padding: "1.25rem 1.5rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
          <span style={{ fontSize: "1.6rem", flexShrink: 0, lineHeight: 1 }}>⚠️</span>
          <div>
            <p style={{ margin: "0 0 0.4rem", fontWeight: 800, fontSize: "1rem", color: "#fbbf24" }}>
              Why Some Explorers Show $0 for DAI, USDT, EURC, TROPTIONS
            </p>
            <p style={{ margin: 0, fontSize: "0.82rem", color: "#cbd5e1", lineHeight: 1.65 }}>
              Stellar and XRPL explorers display dollar values by querying <strong style={{ color: "#e2e8f0" }}>their own DEX price oracles</strong> — not the actual on-chain balance.
              Circle USDC has deep Stellar DEX liquidity so explorers price it at $1.00 automatically.
              Gateway-issued DAI, EURC, USDT, and TROPTIONS have no Stellar DEX orderbook yet,
              so the <em>dollar column</em> reads $0 — but the <strong style={{ color: "#e2e8f0" }}>token balance is fully issued and verifiable</strong> via the transaction hashes below.
              The dollar display is a price oracle gap, not a balance problem.
              USDC confirmed $175,000,000 on XRPL mainnet — 100M issued 2026-04-28 and an additional 75M issued 2026-05-01. Both transactions are verifiable on XRPL. This is the same infrastructure and issuer that holds DAI, EURC, USDT, and TROPTIONS.
            </p>
          </div>
        </div>

        {/* ── Transaction Proof Table ────────────────────────────────────────── */}
        <section>
          <div style={{ marginBottom: "1rem" }}>
            <p style={{ margin: "0 0 0.25rem", fontSize: "0.67rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700 }}>XRPL Mainnet · April 28, 2026</p>
            <h2 style={{ margin: 0, fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "clamp(1.2rem,2.5vw,1.55rem)", color: "#f0cf82" }}>
              Issuance Transaction Hashes
            </h2>
            <p style={{ margin: "0.3rem 0 0", fontSize: "0.8rem", color: "#94a3b8" }}>
              Two transactions per IOU: the trustline authorization (TrustSet) and the issuance payment (Issue).
              Both are immutable and publicly auditable.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {ISSUANCE_PROOFS.map((proof) => (
              <article key={proof.symbol} style={{ background: "rgba(12,20,36,0.92)", border: "1px solid rgba(201,168,76,0.22)", borderRadius: "0.875rem", padding: "1.25rem 1.5rem" }}>
                {/* Header row */}
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                  <Image src={proof.logo} alt={proof.symbol} width={44} height={44} style={{ borderRadius: "50%", border: "1px solid rgba(201,168,76,0.25)", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: "120px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                      <span style={{ fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900, fontSize: "1.25rem", color: "#f0cf82", letterSpacing: "0.04em" }}>{proof.symbol}</span>
                      <span style={{ background: "#052e16", border: "1px solid #166534", color: "#4ade80", borderRadius: "99px", padding: "0.12rem 0.55rem", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.08em" }}>ISSUED</span>
                      <span style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)", color: "#d4a840", borderRadius: "0.35rem", padding: "0.12rem 0.55rem", fontSize: "0.65rem", fontWeight: 700 }}>
                        Peg: {proof.peg}
                      </span>
                      <span style={{ color: "#64748b", fontSize: "0.72rem" }}>Supply: {proof.supply} · {proof.date}</span>
                    </div>
                  </div>
                  {/* Network pills */}
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    {proof.networks.map((n) => (
                      <span key={n} style={{ background: n === "XRPL" ? "#1a1200" : "#001c22", color: n === "XRPL" ? "#c9a84c" : "#22d3ee", border: `1px solid ${n === "XRPL" ? "#4a3800" : "#155e75"}`, borderRadius: "99px", padding: "0.15rem 0.6rem", fontSize: "0.65rem", fontWeight: 700 }}>
                        {n}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Transactions */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "0.75rem", marginBottom: "0.9rem" }}>
                  {/* TrustSet */}
                  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0.6rem", padding: "0.85rem 1rem" }}>
                    <p style={{ margin: "0 0 0.35rem", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#64748b" }}>Step 1 · TrustLine Authorization (XRPL)</p>
                    <a href={xrpscanTx(proof.xrpl.trustSetTx)} target="_blank" rel="noreferrer noopener"
                       style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#c9a84c", textDecoration: "none", wordBreak: "break-all", display: "block", marginBottom: "0.3rem" }}>
                      {proof.xrpl.trustSetTx}
                    </a>
                    <span style={{ fontSize: "0.68rem", color: "#475569" }}>Short: {shortHash(proof.xrpl.trustSetTx)} · </span>
                    <a href={xrpscanTx(proof.xrpl.trustSetTx)} target="_blank" rel="noreferrer noopener" style={{ fontSize: "0.68rem", color: "#c9a84c", textDecoration: "none" }}>Verify on XRPScan ↗</a>
                  </div>
                  {/* Issue */}
                  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0.6rem", padding: "0.85rem 1rem" }}>
                    <p style={{ margin: "0 0 0.35rem", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#64748b" }}>Step 2 · Issuance Payment (XRPL)</p>
                    <a href={xrpscanTx(proof.xrpl.issueTx)} target="_blank" rel="noreferrer noopener"
                       style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#4ade80", textDecoration: "none", wordBreak: "break-all", display: "block", marginBottom: "0.3rem" }}>
                      {proof.xrpl.issueTx}
                    </a>
                    <span style={{ fontSize: "0.68rem", color: "#475569" }}>Short: {shortHash(proof.xrpl.issueTx)} · </span>
                    <a href={xrpscanTx(proof.xrpl.issueTx)} target="_blank" rel="noreferrer noopener" style={{ fontSize: "0.68rem", color: "#4ade80", textDecoration: "none" }}>Verify on XRPScan ↗</a>
                  </div>
                </div>

                {/* Stellar verification row */}
                <div style={{ background: "rgba(0,28,34,0.5)", border: "1px solid rgba(34,211,238,0.15)", borderRadius: "0.55rem", padding: "0.75rem 1rem", display: "flex", flexWrap: "wrap", gap: "1.25rem", alignItems: "center" }}>
                  <span style={{ fontSize: "0.67rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#22d3ee", flexShrink: 0 }}>Stellar Mainnet</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                    <a href={stellarExpert(proof.stellar.distributorAddress)} target="_blank" rel="noreferrer noopener"
                       style={{ fontSize: "0.73rem", color: "#22d3ee", textDecoration: "none", fontFamily: "monospace" }}>
                      Distributor: {proof.stellar.distributorAddress.slice(0,8)}…{proof.stellar.distributorAddress.slice(-6)} ↗
                    </a>
                    <a href={stellarExpert(proof.stellar.issuerAddress)} target="_blank" rel="noreferrer noopener"
                       style={{ fontSize: "0.73rem", color: "#7dd3fc", textDecoration: "none", fontFamily: "monospace" }}>
                      Issuer: {proof.stellar.issuerAddress.slice(0,8)}…{proof.stellar.issuerAddress.slice(-6)} ↗
                    </a>
                    <a href={`https://stellarchain.io/accounts/${proof.stellar.distributorAddress}`} target="_blank" rel="noreferrer noopener"
                       style={{ fontSize: "0.73rem", color: "#7dd3fc", textDecoration: "none" }}>
                      StellarChain ↗
                    </a>
                  </div>
                </div>

                {/* Note */}
                <p style={{ margin: "0.75rem 0 0", fontSize: "0.74rem", color: "#475569", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "0.65rem" }}>
                  {proof.note}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Balance Verification Guide ──────────────────────────────────────── */}
        <section style={{ background: "rgba(12,20,36,0.85)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "1rem", padding: "1.75rem" }}>
          <h2 style={{ margin: "0 0 0.4rem", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "clamp(1.1rem,2.5vw,1.4rem)", color: "#f0cf82" }}>
            How to Verify the Actual Balance
          </h2>
          <p style={{ margin: "0 0 1.25rem", fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.6 }}>
            Explorer dollar values rely on DEX price feeds. To verify the <em>actual token balance</em>, use the account view — not the dollar value.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
            {[
              { step: "01", title: "XRPL — XRPScan Token Balances", body: "Go to xrpscan.com → enter the XRPL Distributor address (rNX4faQ...) → click \"Balances\" tab. You will see the raw IOU balance for each currency code regardless of price feed." },
              { step: "02", title: "Stellar — Stellar Expert Account", body: "Go to stellar.expert → enter the Stellar Distributor address (GBH4YY6...) → scroll to \"Balances\". Each trust line shows its actual amount — not a dollar-converted value." },
              { step: "03", title: "Stellar — StellarChain Token Holdings", body: "On StellarChain the \"Token Holdings\" panel shows all 6 tokens. USDC shows $100M (price oracle match). The others show $0 in the dollar column but their balance field shows the issued amount." },
              { step: "04", title: "XRPL Account Lines API", body: "Call the XRPL JSON-RPC: account_lines({\"account\":\"rNX4faQ...\"}). This returns raw IOU balances per issuer and currency code — unambiguous, no price conversion." },
            ].map((s) => (
              <div key={s.step} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "0.75rem", padding: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.6rem" }}>
                  <span style={{ width: "28px", height: "28px", borderRadius: "0.4rem", background: "rgba(201,168,76,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "0.68rem", color: "#f0cf82", flexShrink: 0 }}>{s.step}</span>
                  <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#e2e8f0" }}>{s.title}</span>
                </div>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b", lineHeight: 1.55 }}>{s.body}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "1.25rem", display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            <a href="https://xrpscan.com/account/rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt" target="_blank" rel="noreferrer noopener"
               style={{ fontSize: "0.78rem", fontWeight: 700, color: "#c9a84c", textDecoration: "none" }}>XRPL Distributor Balances ↗</a>
            <a href="https://stellar.expert/explorer/public/account/GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC" target="_blank" rel="noreferrer noopener"
               style={{ fontSize: "0.78rem", fontWeight: 700, color: "#22d3ee", textDecoration: "none" }}>Stellar Distributor Balances ↗</a>
            <a href="https://stellarchain.io/accounts/GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC" target="_blank" rel="noreferrer noopener"
               style={{ fontSize: "0.78rem", fontWeight: 700, color: "#7dd3fc", textDecoration: "none" }}>StellarChain Token Holdings ↗</a>
          </div>
        </section>

        {/* ── 1:1 Redemption Model ────────────────────────────────────────────── */}
        <section style={{ background: "linear-gradient(135deg, #052e16 0%, #0a3d22 100%)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: "1rem", padding: "1.75rem" }}>
          <h2 style={{ margin: "0 0 0.5rem", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "clamp(1.1rem,2.5vw,1.4rem)", color: "#4ade80" }}>
            The 1:1 Redemption Model
          </h2>
          <p style={{ margin: "0 0 1.25rem", fontSize: "0.82rem", color: "#86efac", lineHeight: 1.6, maxWidth: "720px" }}>
            Each TROPTIONS Gateway IOU is a <strong>claim instrument</strong>. Holding 1,000 USDC IOU on XRPL or Stellar gives the holder the right to redeem 1,000 real USDC from the Gateway reserve.
            The Gateway holds or controls access to the underlying asset. The IOU is the transfer mechanism — fast, on-ledger, programmable.
            The redemption is the settlement step — real-world delivery of the underlying.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.85rem" }}>
            {[
              { step: "01", title: "Acquire IOU", body: "Counterparty opens trustline to TROPTIONS Gateway Issuer and receives IOU (purchase, deal funding, or airdrop)." },
              { step: "02", title: "Hold on Ledger", body: "IOU sits in their XRPL/Stellar wallet. Fully transferable, programmable, 0 bps fee for stablecoins. On-chain balance visible to both parties." },
              { step: "03", title: "Initiate Redemption", body: "Holder submits redemption request to TROPTIONS Gateway with wallet address and proof of identity/deal." },
              { step: "04", title: "Gateway Settles", body: "Gateway delivers 1:1 underlying to the specified destination. IOU is burned (returned to issuer). On-chain confirmation closes the loop." },
            ].map((s) => (
              <div key={s.step} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(74,222,128,0.15)", borderRadius: "0.75rem", padding: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", marginBottom: "0.55rem" }}>
                  <span style={{ width: "26px", height: "26px", borderRadius: "0.4rem", background: "rgba(74,222,128,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "0.68rem", color: "#4ade80", flexShrink: 0 }}>{s.step}</span>
                  <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#d1fae5" }}>{s.title}</span>
                </div>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#6ee7b7", lineHeight: 1.5 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Deal Security Mechanisms ────────────────────────────────────────── */}
        <section>
          <div style={{ marginBottom: "1rem" }}>
            <p style={{ margin: "0 0 0.25rem", fontSize: "0.67rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700 }}>
              For Deal Closing · No-Trust-Required Verification
            </p>
            <h2 style={{ margin: 0, fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "clamp(1.2rem,2.5vw,1.55rem)", color: "#f0cf82" }}>
              Deal Security: Escrow, NFT Receipts &amp; Claimable Balances
            </h2>
            <p style={{ margin: "0.35rem 0 0", fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.6, maxWidth: "700px" }}>
              These native blockchain mechanisms allow a counterparty to verify locked funds independently —
              no intermediary, no paper, no trust required. The lock is enforced by code on a public ledger.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.1rem" }}>
            {DEAL_MECHANISMS.map((m) => (
              <article key={m.title} style={{ background: "rgba(12,20,36,0.92)", border: "1px solid rgba(201,168,76,0.18)", borderRadius: "0.875rem", padding: "1.35rem", display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.9rem" }}>
                  <span style={{ fontSize: "1.8rem", lineHeight: 1, flexShrink: 0 }}>{m.icon}</span>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.2rem" }}>
                      <span style={{ fontWeight: 800, fontSize: "1rem", color: "#f0cf82", fontFamily: "Georgia, serif" }}>{m.title}</span>
                      <span style={{ background: m.tagBg, color: m.tagColor, border: `1px solid ${m.tagBorder}`, borderRadius: "0.3rem", padding: "0.1rem 0.45rem", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.07em" }}>{m.tag}</span>
                    </div>
                  </div>
                </div>

                {/* Bullet points */}
                <ul style={{ margin: 0, paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  {m.points.map((p) => (
                    <li key={p} style={{ fontSize: "0.77rem", color: "#94a3b8", lineHeight: 1.5 }}>{p}</li>
                  ))}
                </ul>

                {/* Code example */}
                <div style={{ background: "#020e1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0.5rem", padding: "0.85rem 1rem", overflow: "auto" }}>
                  <pre style={{ margin: 0, fontSize: "0.68rem", color: "#7dd3fc", fontFamily: "monospace", lineHeight: 1.55, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{m.example}</pre>
                </div>

                {/* CTA */}
                <a href={m.ctaUrl} target="_blank" rel="noreferrer noopener"
                   style={{ fontSize: "0.77rem", color: "#c9a84c", fontWeight: 700, textDecoration: "none", marginTop: "-0.2rem" }}>
                  {m.cta}
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* ── Quick nav ───────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", paddingTop: "0.5rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <Link href="/troptions/stablecoins" style={{ fontSize: "0.8rem", color: "#c9a84c", fontWeight: 700, textDecoration: "none" }}>← Fee Schedule</Link>
          <Link href="/troptions/wallets" style={{ fontSize: "0.8rem", color: "#c9a84c", fontWeight: 700, textDecoration: "none" }}>← Wallet Infrastructure</Link>
          <Link href="/troptions" style={{ fontSize: "0.8rem", color: "#c9a84c", fontWeight: 700, textDecoration: "none" }}>← TROPTIONS Overview</Link>
        </div>

      </div>
    </main>
  );
}
