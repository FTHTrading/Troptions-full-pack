/**
 * XRPL Genesis Management Dashboard
 * /troptions/xrpl-platform/genesis
 *
 * Displays the genesis activation checklist, wallet roles, IOU/NFT/AMM
 * status, and links to execute genesis operations via the admin API.
 */
import { XrplPlatformLayout } from "@/components/xrpl-platform/XrplPlatformLayout";

const GENESIS_WALLETS = [
  {
    role:     "ISSUER",
    envKey:   "XRPL_ISSUER_ADDRESS",
    minXrp:   25,
    purpose:  "Signs all TROPTIONS IOU issuances. DefaultRipple must be enabled. Never holds distribution supply.",
    actions:  ["configure-issuer", "issue-initial-supply", "issuer-trustlines"],
  },
  {
    role:     "DISTRIBUTOR",
    envKey:   "XRPL_DISTRIBUTOR_ADDRESS",
    minXrp:   40,
    purpose:  "Holds the circulating TROPTIONS supply. Sends tokens to holders and exchanges.",
    actions:  ["configure-distributor", "set-distributor-trustline"],
  },
  {
    role:     "TREASURY",
    envKey:   "XRPL_TREASURY_ADDRESS",
    minXrp:   15,
    purpose:  "Long-term reserve. Not used in daily operations. Multi-sig recommended.",
    actions:  [],
  },
  {
    role:     "NFT_ISSUER",
    envKey:   "XRPL_NFT_ISSUER_ADDRESS",
    minXrp:   30,
    purpose:  "Mints all TROPTIONS NFTokens (XLS-20). Taxons 0–7 for genesis collections.",
    actions:  ["mint-single", "mint-genesis-batch"],
  },
  {
    role:     "MPT_ISSUER",
    envKey:   "XRPL_MPT_ISSUER_ADDRESS",
    minXrp:   20,
    purpose:  "Reserved for XLS-33 Multi-Purpose Tokens once amendment activates on mainnet.",
    actions:  [],
  },
  {
    role:     "DEX_MAKER",
    envKey:   "XRPL_DEX_MAKER_ADDRESS",
    minXrp:   50,
    purpose:  "Places and maintains TROPTIONS/XRP bid and ask offers on XRPL DEX.",
    actions:  ["create-sell-offer", "create-buy-offer", "place-seed-liquidity"],
  },
  {
    role:     "AMM_LP",
    envKey:   "XRPL_AMM_LP_ADDRESS",
    minXrp:   100,
    purpose:  "Seeds and manages the TROPTIONS/XRP AMM (Automated Market Maker) pool.",
    actions:  ["create-amm"],
  },
] as const;

const GENESIS_STEPS = [
  { step: 1, title: "Generate Wallets",          cmd: "node scripts/genesis-blockchain-setup.mjs",  status: "ready"   },
  { step: 2, title: "Fund ISSUER (25+ XRP)",     cmd: "Fund via Coinbase or Kraken",                status: "pending" },
  { step: 3, title: "Fund DISTRIBUTOR (40 XRP)", cmd: "Send from exchange to DISTRIBUTOR address",  status: "pending" },
  { step: 4, title: "Fund NFT_ISSUER (30 XRP)",  cmd: "Send from exchange to NFT_ISSUER address",  status: "pending" },
  { step: 5, title: "Fund DEX_MAKER (50 XRP)",   cmd: "Send from exchange to DEX_MAKER address",   status: "pending" },
  { step: 6, title: "Fund AMM_LP (100 XRP)",     cmd: "Send from exchange to AMM_LP address",      status: "pending" },
  { step: 7, title: "Configure Issuer",          cmd: "POST /api/troptions/xrpl/genesis {op:'configure-issuer'}", status: "pending" },
  { step: 8, title: "Set Distributor Trustline", cmd: "POST /api/troptions/xrpl/genesis {op:'set-distributor-trustline'}", status: "pending" },
  { step: 9, title: "Issue Initial Supply",      cmd: "POST /api/troptions/xrpl/genesis {op:'issue-initial-supply'}", status: "pending" },
  { step:10, title: "Mint Genesis NFT Batch",    cmd: "POST /api/troptions/xrpl/nft {op:'mint-genesis-batch'}", status: "pending" },
  { step:11, title: "Place Seed Liquidity",      cmd: "POST /api/troptions/xrpl/genesis {op:'place-seed-liquidity'}", status: "pending" },
  { step:12, title: "Create AMM Pool",           cmd: "POST /api/troptions/xrpl/genesis {op:'create-amm'}", status: "pending" },
  { step:13, title: "Submit to CoinGecko",       cmd: "https://www.coingecko.com/en/coins/new",    status: "pending" },
] as const;

const NFT_COLLECTIONS = [
  { taxon: 0, name: "TROPTIONS Credential",         symbol: "TROP-CRED"  },
  { taxon: 1, name: "Exchange Member Pass",          symbol: "TROP-EXCH"  },
  { taxon: 2, name: "Real World Asset Title",        symbol: "TROP-RWA"   },
  { taxon: 3, name: "Sovereign Bond",                symbol: "TROP-BOND"  },
  { taxon: 4, name: "Impact Certificate",            symbol: "TROP-IMPACT" },
  { taxon: 5, name: "University Degree",             symbol: "TROP-EDU"   },
  { taxon: 6, name: "Legacy Heritage Asset",         symbol: "TROP-LEGCY" },
  { taxon: 7, name: "Art & Media",                   symbol: "TROP-ART"   },
] as const;

export default function XrplGenesisPage() {
  return (
    <XrplPlatformLayout
      title="XRPL Genesis Command Center"
      intro="Real blockchain infrastructure setup for TROPTIONS — from wallet generation through IOU issuance, NFT minting, DEX market making, and AMM pool creation."
    >

      {/* ── Genesis Activation Steps ── */}
      <section className="xp-section">
        <h2 className="xp-section-title">Genesis Activation Steps</h2>
        <div className="xp-table-wrap">
          <table className="xp-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Step</th>
                <th>Command / Action</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {GENESIS_STEPS.map((s) => (
                <tr key={s.step}>
                  <td className="xp-mono">{s.step}</td>
                  <td>{s.title}</td>
                  <td className="xp-mono xp-cmd">{s.cmd}</td>
                  <td>
                    <span className={`xp-badge xp-badge--${s.status === "ready" ? "green" : "yellow"}`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Wallet Roles ── */}
      <section className="xp-section">
        <h2 className="xp-section-title">Genesis Wallet Roles</h2>
        <div className="xp-grid-2">
          {GENESIS_WALLETS.map((w) => (
            <article key={w.role} className="xp-card">
              <p className="xp-label">{w.role}</p>
              <p className="xp-value">{w.minXrp} XRP min</p>
              <p className="xp-mono xp-small-muted">{w.envKey}</p>
              <p className="xp-purpose">{w.purpose}</p>
              {w.actions.length > 0 && (
                <div className="xp-actions-mini">
                  {w.actions.map(a => (
                    <span key={a} className="xp-chip xp-chip--sm">{a}</span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* ── NFT Collections ── */}
      <section className="xp-section">
        <h2 className="xp-section-title">Genesis NFT Collections (XLS-20)</h2>
        <p className="xp-meta">Minted via NFT_ISSUER wallet. All 8 collections minted in a single batch operation.</p>
        <div className="xp-grid-3">
          {NFT_COLLECTIONS.map((c) => (
            <article key={c.taxon} className="xp-card">
              <p className="xp-label">Taxon {c.taxon}</p>
              <p className="xp-value">{c.name}</p>
              <p className="xp-mono xp-small-muted">{c.symbol}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── AMM Info ── */}
      <section className="xp-section">
        <h2 className="xp-section-title">AMM Pool Configuration</h2>
        <div className="xp-grid-2">
          <article className="xp-card">
            <p className="xp-label">Pool Pair</p>
            <p className="xp-value">TROPTIONS / XRP</p>
            <p className="xp-desc">
              Default seed: 100,000 TROPTIONS + 1,000 XRP<br />
              Trading fee: 0.5% (500 / 100,000)
            </p>
          </article>
          <article className="xp-card">
            <p className="xp-label">Implied Seed Price</p>
            <p className="xp-value">0.01 XRP / TROPTIONS</p>
            <p className="xp-desc">
              Adjust troptionsAmount + xrpAmount params<br />
              to set desired launch price.
            </p>
          </article>
        </div>
      </section>

      {/* ── Actions ── */}
      <div className="xp-actions">
        <a href="/troptions/xrpl-platform/trustlines"  className="xp-chip">Trustlines</a>
        <a href="/troptions/xrpl-platform/amm"         className="xp-chip">AMM Pools</a>
        <a href="/troptions/xrpl-platform/dex"         className="xp-chip">DEX Orders</a>
        <a href="/troptions/exchange-readiness"         className="xp-chip">Exchange Readiness</a>
        <a href="/troptions/xrpl-platform/mainnet-readiness" className="xp-chip">Mainnet Gates</a>
      </div>

    </XrplPlatformLayout>
  );
}
