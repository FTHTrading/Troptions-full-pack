import { fetchChainLiveData, ChainLiveData } from "@/lib/troptions/chainLiveData";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "TROPTIONS Live — Chain Dashboard",
  description: "Real-time TROPTIONS asset state on XRPL and Stellar mainnet.",
};

// ─── Small helpers ─────────────────────────────────────────────────────────────

function Addr({ addr }: { addr: string }) {
  const short = `${addr.slice(0, 6)}…${addr.slice(-6)}`;
  return (
    <span className="font-mono text-xs text-[#C9A84C]" title={addr}>
      {short}
    </span>
  );
}

function Badge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${
        ok ? "bg-emerald-900/60 text-emerald-300" : "bg-red-900/40 text-red-400"
      }`}
    >
      {label}
    </span>
  );
}

function Row({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 border-b border-white/5 last:border-0">
      <span className="text-xs text-white/40 shrink-0">{label}</span>
      <span className={`text-xs text-right ${mono ? "font-mono text-white/80" : "text-white/70"}`}>{value}</span>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0a1523] p-4 space-y-1">
      <p className="text-[10px] uppercase tracking-widest text-[#C9A84C]/70 mb-2">{title}</p>
      {children}
    </div>
  );
}

function SectionHead({ label }: { label: string }) {
  return (
    <h2 className="text-sm uppercase tracking-widest text-white/30 mt-8 mb-3 flex items-center gap-2">
      <span className="h-px flex-1 bg-white/10" />
      {label}
      <span className="h-px flex-1 bg-white/10" />
    </h2>
  );
}

// ─── XRPL Section ──────────────────────────────────────────────────────────────

function XrplSection({ data }: { data: ChainLiveData["xrpl"] }) {
  const { issuer, distributor, trustlines, nfts, offers, amm } = data;
  const provisioned =
    distributor.troptionsBalance !== null && distributor.troptionsBalance !== "0";

  return (
    <section>
      <SectionHead label="XRPL Mainnet" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Issuer */}
        <Card title="Issuer Wallet">
          <Row label="Address" value={<Addr addr={issuer.address} />} />
          <Row label="Account" value={<Badge ok={issuer.exists} label={issuer.exists ? "exists" : "not found"} />} />
          <Row label="XRP Balance" value={issuer.xrpBalance ?? "—"} mono />
          <Row label="DefaultRipple" value={<Badge ok={issuer.defaultRipple} label={issuer.defaultRipple ? "enabled ✓" : "not set"} />} />
          <Row
            label="Domain"
            value={issuer.domain ? <Badge ok label={issuer.domain} /> : <Badge ok={false} label="not set" />}
          />
          <Row label="Sequence" value={issuer.sequence?.toString() ?? "—"} mono />
        </Card>

        {/* Distributor */}
        <Card title="Distributor Wallet">
          <Row label="Address" value={<Addr addr={distributor.address} />} />
          <Row label="Account" value={<Badge ok={distributor.exists} label={distributor.exists ? "exists" : "not found"} />} />
          <Row label="XRP Balance" value={distributor.xrpBalance ?? "—"} mono />
          <Row
            label="TROPTIONS IOU"
            value={
              provisioned ? (
                <Badge ok label={`${Number(distributor.troptionsBalance).toLocaleString()} TROPTIONS`} />
              ) : (
                <Badge ok={false} label="not issued" />
              )
            }
          />
          <Row label="Sequence" value={distributor.sequence?.toString() ?? "—"} mono />
        </Card>
      </div>

      {/* Trustlines */}
      <div className="mt-3">
        <Card title={`TROPTIONS Trustlines (${trustlines.length} holder${trustlines.length !== 1 ? "s" : ""})`}>
          {trustlines.length === 0 ? (
            <p className="text-xs text-white/30 py-2">
              No trustlines yet — wallets must open a trustline to hold TROPTIONS.
            </p>
          ) : (
            <div className="space-y-1 mt-1">
              {trustlines.slice(0, 10).map((tl) => (
                <div key={tl.account} className="flex justify-between text-xs">
                  <Addr addr={tl.account} />
                  <span className="font-mono text-white/60">{Number(Math.abs(Number(tl.balance))).toLocaleString()}</span>
                </div>
              ))}
              {trustlines.length > 10 && (
                <p className="text-xs text-white/30">…and {trustlines.length - 10} more</p>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* NFTs */}
      <div className="mt-3">
        <Card title={`NFTs (${nfts.length})`}>
          {nfts.length === 0 ? (
            <p className="text-xs text-white/30 py-2">No NFTs minted — run provision script to mint Genesis Member #1.</p>
          ) : (
            <div className="space-y-2 mt-1">
              {nfts.map((n) => (
                <div key={n.nfTokenId} className="text-xs space-y-0.5">
                  <div className="font-mono text-[#C9A84C]/80 truncate">{n.nfTokenId}</div>
                  {n.uri && <div className="text-white/40 truncate">{n.uri}</div>}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* AMM */}
      <div className="mt-3">
        <Card title="AMM Pool — TROPTIONS / XRP">
          {!amm.exists ? (
            <p className="text-xs text-white/30 py-2">
              AMM pool not yet created — run provision script to create the TROPTIONS/XRP liquidity pool.
            </p>
          ) : (
            <>
              <Row label="Pool Account" value={amm.account ? <Addr addr={amm.account} /> : "—"} />
              <Row label="XRP Reserve" value={`${amm.xrpPool} XRP`} mono />
              <Row label="TROPTIONS Reserve" value={`${Number(amm.troptionsPool).toLocaleString()} TROPTIONS`} mono />
              <Row label="LP Token Supply" value={amm.lpSupply ?? "—"} mono />
              <Row label="Trading Fee" value={amm.tradingFee !== null ? `${amm.tradingFee / 1000}%` : "—"} />
            </>
          )}
        </Card>
      </div>

      {/* DEX Offers */}
      <div className="mt-3">
        <Card title={`DEX Offers (${offers.length})`}>
          {offers.length === 0 ? (
            <p className="text-xs text-white/30 py-2">No open DEX offers — run provision script to place buy/sell offers.</p>
          ) : (
            <div className="space-y-1 mt-1">
              {offers.map((o) => (
                <div key={o.seq} className="text-xs font-mono text-white/50 flex justify-between">
                  <span>seq {o.seq}</span>
                  <span>{JSON.stringify(o.takerGets)} → {JSON.stringify(o.takerPays)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}

// ─── Stellar Section ────────────────────────────────────────────────────────────

function StellarSection({ data }: { data: ChainLiveData["stellar"] }) {
  const { issuer, distributor, assetStats, lp } = data;
  const provisioned = distributor.troptionsBalance !== null && distributor.troptionsBalance !== "0";

  return (
    <section>
      <SectionHead label="Stellar Mainnet" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Issuer */}
        <Card title="Issuer Wallet">
          <Row label="Address" value={<Addr addr={issuer.address} />} />
          <Row label="Account" value={<Badge ok={issuer.exists} label={issuer.exists ? "exists" : "not found"} />} />
          <Row label="XLM Balance" value={issuer.xlmBalance ? `${issuer.xlmBalance} XLM` : "—"} mono />
          <Row label="Home Domain" value={issuer.homeDomain ? <Badge ok label={issuer.homeDomain} /> : <Badge ok={false} label="not set" />} />
          <Row label="Auth Required" value={<Badge ok={issuer.authRequired} label={issuer.authRequired ? "yes" : "no"} />} />
          <Row label="Auth Revocable" value={<Badge ok={issuer.authRevocable} label={issuer.authRevocable ? "yes" : "no"} />} />
        </Card>

        {/* Distributor */}
        <Card title="Distributor Wallet">
          <Row label="Address" value={<Addr addr={distributor.address} />} />
          <Row label="Account" value={<Badge ok={distributor.exists} label={distributor.exists ? "exists" : "not found"} />} />
          <Row label="XLM Balance" value={distributor.xlmBalance ? `${distributor.xlmBalance} XLM` : "—"} mono />
          <Row
            label="TROPTIONS"
            value={
              provisioned ? (
                <Badge ok label={`${Number(distributor.troptionsBalance).toLocaleString()} TROPTIONS`} />
              ) : (
                <Badge ok={false} label="not issued" />
              )
            }
          />
        </Card>
      </div>

      {/* Asset stats */}
      <div className="mt-3">
        <Card title="TROPTIONS Asset Stats">
          <Row
            label="Holders"
            value={assetStats.numAccounts !== null ? assetStats.numAccounts.toString() : <Badge ok={false} label="asset not found" />}
            mono
          />
          <Row
            label="Authorized Supply"
            value={assetStats.totalSupply ? `${Number(assetStats.totalSupply).toLocaleString()} TROPTIONS` : "—"}
            mono
          />
        </Card>
      </div>

      {/* LP Pool */}
      <div className="mt-3">
        <Card title="LP Pool — TROPTIONS / XLM">
          {!lp.exists ? (
            <p className="text-xs text-white/30 py-2">
              LP pool not yet created — run provision script to create the TROPTIONS/XLM Stellar AMM pool.
            </p>
          ) : (
            <>
              <Row label="Pool ID" value={lp.poolId ? <span className="font-mono text-xs truncate">{lp.poolId.slice(0, 12)}…</span> : "—"} />
              <Row label="XLM Reserve" value={lp.xlmReserve ? `${lp.xlmReserve} XLM` : "—"} mono />
              <Row label="TROPTIONS Reserve" value={lp.troptionsReserve ? `${Number(lp.troptionsReserve).toLocaleString()} TROPTIONS` : "—"} mono />
              <Row label="Total Shares" value={lp.totalShares ?? "—"} mono />
            </>
          )}
        </Card>
      </div>
    </section>
  );
}

// ─── Provision instructions ─────────────────────────────────────────────────────

function ProvisionInstructions({ data }: { data: ChainLiveData }) {
  const xrplDone   = data.xrpl.distributor.troptionsBalance !== null && data.xrpl.distributor.troptionsBalance !== "0";
  const stellarDone = data.stellar.distributor.troptionsBalance !== null && data.stellar.distributor.troptionsBalance !== "0";
  const nftDone    = data.xrpl.nfts.length > 0;
  const ammDone    = data.xrpl.amm.exists;
  const lpDone     = data.stellar.lp.exists;

  const allDone = xrplDone && stellarDone && nftDone && ammDone && lpDone;
  if (allDone) return null;

  return (
    <section>
      <SectionHead label="Provision Required" />
      <div className="rounded-xl border border-yellow-800/40 bg-yellow-950/20 p-4 space-y-3">
        <p className="text-xs text-yellow-200/70">
          The following on-chain assets have not been provisioned yet. Run the provision script with your wallet seeds to deploy them.
        </p>
        <ul className="text-xs space-y-1">
          {!xrplDone    && <li className="text-red-400">✗ XRPL TROPTIONS IOU not issued</li>}
          {xrplDone     && <li className="text-emerald-400">✓ XRPL TROPTIONS IOU issued</li>}
          {!stellarDone && <li className="text-red-400">✗ Stellar TROPTIONS not issued</li>}
          {stellarDone  && <li className="text-emerald-400">✓ Stellar TROPTIONS issued</li>}
          {!nftDone     && <li className="text-red-400">✗ NFT Genesis Member #1 not minted</li>}
          {nftDone      && <li className="text-emerald-400">✓ NFT minted</li>}
          {!ammDone     && <li className="text-red-400">✗ XRPL AMM pool not created</li>}
          {ammDone      && <li className="text-emerald-400">✓ XRPL AMM pool live</li>}
          {!lpDone      && <li className="text-red-400">✗ Stellar LP pool not created</li>}
          {lpDone       && <li className="text-emerald-400">✓ Stellar LP pool live</li>}
        </ul>
        <div className="rounded bg-black/40 p-3 font-mono text-xs text-white/50 space-y-1 overflow-x-auto">
          <p className="text-white/30 select-none"># Add seeds to .env.local first, then:</p>
          <p>node scripts/provision-troptions-assets.mjs --execute --network=mainnet --enable-mpt</p>
          <p className="text-white/30 select-none"># XRPL only:</p>
          <p>node scripts/provision-troptions-assets.mjs --execute --network=mainnet --xrpl-only --enable-mpt</p>
          <p className="text-white/30 select-none"># Stellar only:</p>
          <p>node scripts/provision-troptions-assets.mjs --execute --network=mainnet --stellar-only</p>
        </div>
        <p className="text-[10px] text-white/20">
          Required env vars: XRPL_ISSUER_SEED, XRPL_DISTRIBUTOR_SEED, STELLAR_ISSUER_SECRET, STELLAR_DISTRIBUTOR_SECRET
        </p>
      </div>
    </section>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────────

export default async function TroptionsLivePage() {
  const data = await fetchChainLiveData();
  const ts   = new Date(data.fetchedAt).toLocaleTimeString("en-US", { hour12: false });

  return (
    <main className="min-h-screen bg-[#020b14] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#030e1e] px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-[#C9A84C]">TROPTIONS</h1>
            <p className="text-[10px] text-white/30 uppercase tracking-widest">Live Chain Dashboard</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/25">Last updated</p>
            <p className="text-xs font-mono text-white/40">{ts}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <XrplSection data={data.xrpl} />
        <StellarSection data={data.stellar} />
        <ProvisionInstructions data={data} />

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-white/5 text-center">
          <p className="text-[10px] text-white/20">
            Data sourced from{" "}
            <span className="font-mono">xrplcluster.com</span> and{" "}
            <span className="font-mono">horizon.stellar.org</span> — updates every 60 s
          </p>
          <p className="text-[10px] text-white/15 mt-1">
            Issuer · XRPL:{" "}
            <span className="font-mono">{data.xrpl.issuer.address}</span> · Stellar:{" "}
            <span className="font-mono text-[9px]">{data.stellar.issuer.address}</span>
          </p>
        </div>
      </div>
    </main>
  );
}
