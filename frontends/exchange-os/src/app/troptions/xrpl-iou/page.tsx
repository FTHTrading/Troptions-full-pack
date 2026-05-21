import Image from "next/image";
import type { Metadata } from "next";
import {
  XRPL_IOU_ASSET_CONFIGS,
  getRequiredIouDocuments,
  XRPL_ISSUER_ADDRESS,
  XRPL_DISTRIBUTOR_ADDRESS,
} from "@/lib/troptions/xrplIouIssuanceEngine";
import { TROPTIONS_STELLAR_ISSUER } from "@/content/troptions/xrplIouRegistry";

export const metadata: Metadata = {
  title: "XRPL IOU Issuance | TROPTIONS",
  description:
    "TROPTIONS XRPL IOU readiness framework — trustlines, authorized trustlines, asset receipt design, and issuance checklist. Simulation-only. No live issuance enabled.",
};

const STATUS_COLORS: Record<string, string> = {
  DRAFT:            "text-slate-400",
  EVIDENCE_PENDING: "text-amber-400",
  RESERVE_PENDING:  "text-orange-400",
  LEGAL_PENDING:    "text-yellow-400",
  TRUSTLINE_READY:  "text-sky-400",
  ISSUANCE_READY:   "text-green-400",
  ISSUED:           "text-emerald-400",
  BLOCKED:          "text-red-400",
};

export default function XrplIouPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="mx-auto max-w-6xl px-6 py-16 space-y-10">

        {/* Safety Disclosure */}
        <div className="rounded-xl border border-red-700/40 bg-red-900/20 p-5 space-y-2">
          <p className="font-bold text-red-300 text-base">Important Disclosures</p>
          <ul className="text-sm text-red-200 space-y-1 list-disc list-inside">
            <li>All XRPL IOU operations on this page are <strong>simulation-only</strong>. No live IOU issuance, stablecoin issuance, or token distribution is enabled.</li>
            <li>An XRPL IOU is a <strong>receipt and lender-readable proof</strong> — it does not create funds, guarantees, or liquidity by itself.</li>
            <li>No custody, exchange, money transmission, investment advice, guaranteed financing, public token buybacks, or liquidity pool execution is provided.</li>
            <li>All issuance requires legal, compliance, provider, custody, signer, and board approvals before any live execution.</li>
            <li><strong>No guaranteed return, yield, profit, or guaranteed liquidity</strong> is implied or offered by any asset listed on this page.</li>
          </ul>
        </div>

        {/* Header */}
        <header className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C]">
            TROPTIONS — XRPL IOU Readiness
          </p>
          <h1 className="text-4xl font-bold">XRPL IOU Issuance Framework</h1>
          <p className="max-w-2xl text-base text-slate-400 leading-7">
            TROPTIONS Gateway uses XRPL trustline IOUs as lender-readable receipts for
            real-world assets. This page documents the issuance gates, required documents,
            and readiness checklist for each asset type. Nothing here is live —
            every function is in simulation-first governance mode.
          </p>
        </header>

        {/* TROPTIONS On-Chain Status — ISSUED */}
        <section className="rounded-xl border border-emerald-700/50 bg-emerald-900/10 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="shrink-0">
              <Image
                src="/assets/troptions/logos/troptions-iou-logo.svg"
                alt="TROPTIONS IOU"
                width={80}
                height={80}
                className="rounded-xl"
              />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <p className="text-2xl font-bold text-white">TROPTIONS</p>
                <span className="inline-flex items-center rounded-full bg-emerald-900/60 border border-emerald-600/50 px-3 py-0.5 text-xs font-bold text-emerald-300 uppercase tracking-widest">
                  ✓ Issued On-Chain
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-6 max-w-2xl">
                TROPTIONS Native Token — 100,000,000 supply issued on XRPL Mainnet on 2026-04-28.
                Trustlines active. AMM pool deployed. Distributor wallet funded.
                Authorized trustline model enforced (RequireAuth).
              </p>
              <p className="text-xs text-slate-500">
                Commercial trade instrument backed by documented barter agreements, real property positions,
                solar energy, mobile medical assets, and the TROPTIONS Gateway asset reserve.
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3 pt-2 border-t border-emerald-700/30">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C] mb-1">XRPL Issuer</p>
              <code className="text-slate-300 text-xs break-all">{XRPL_ISSUER_ADDRESS}</code>
              <br />
              <a
                href={`https://xrpscan.com/account/${XRPL_ISSUER_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-sky-400 hover:text-sky-300 mt-1 inline-block"
              >
                View on XRPSCAN ↗
              </a>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C] mb-1">XRPL Distributor</p>
              <code className="text-slate-300 text-xs break-all">{XRPL_DISTRIBUTOR_ADDRESS}</code>
              <br />
              <a
                href={`https://xrpscan.com/account/${XRPL_DISTRIBUTOR_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-sky-400 hover:text-sky-300 mt-1 inline-block"
              >
                View on XRPSCAN ↗
              </a>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C] mb-1">Stellar Issuer</p>
              <code className="text-slate-300 text-xs break-all">{TROPTIONS_STELLAR_ISSUER.slice(0, 20)}…</code>
              <br />
              <a
                href={`https://stellar.expert/explorer/public/account/${TROPTIONS_STELLAR_ISSUER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-sky-400 hover:text-sky-300 mt-1 inline-block"
              >
                View on Stellar Expert ↗
              </a>
            </div>
          </div>
        </section>

        {/* IOU Explainer */}
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <h2 className="text-xl font-semibold">What is an XRPL IOU?</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C]">What an IOU IS</p>
              <ul className="text-sm text-slate-400 space-y-1.5 list-disc list-inside">
                <li>A trustline balance on the XRP Ledger between an issuer and a holder</li>
                <li>A receipt that the holder has a claim on the issuer for the stated amount</li>
                <li>A lender-readable proof of an asset position when backed by custody and legal documentation</li>
                <li>A unit of account for closed-network merchant or trade settlement</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-mono text-xs uppercase tracking-widest text-red-400">What an IOU is NOT</p>
              <ul className="text-sm text-slate-400 space-y-1.5 list-disc list-inside">
                <li>A guarantee of funds or financing</li>
                <li>A stablecoin or redeemable cash instrument (without full reserve + legal)</li>
                <li>An investment contract or security offering</li>
                <li>Accepted DeFi collateral (unless underlying asset is bridged to Ethereum/Aave)</li>
                <li>A source of liquidity unless a buyer or lender independently agrees</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Trustline Types */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-slate-800 pb-3">
            Trustline Types — Standard vs Authorized
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-2">
              <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C]">Standard Trustline</p>
              <p className="text-sm text-slate-400 leading-6">
                Any XRPL wallet can set a trustline to the issuer without permission.
                Suitable for open-market IOUs where no holder restrictions apply.
                TROPTIONS does not use unauthorized open trustlines for secured asset receipts.
              </p>
            </div>
            <div className="rounded-xl border border-amber-700/40 bg-amber-900/10 p-5 space-y-2">
              <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C]">Authorized Trustline</p>
              <p className="text-sm text-slate-400 leading-6">
                Issuer sets <code className="text-amber-300">RequireAuth</code> on the issuing account.
                Each holder wallet must be individually authorized by the issuer before they
                can receive the IOU. Used by TROPTIONS Gateway for all secured asset receipts —
                restricts distribution to KYC&apos;d, approved counterparties only.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-2">
              <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C]">Multi-Purpose Token (MPT)</p>
              <p className="text-sm text-slate-400 leading-6">
                Next-generation XRPL primitive for asset-backed tokens with built-in
                transfer restrictions and compliance metadata. TROPTIONS will evaluate
                MPT issuance once the standard is fully ratified on XRPL mainnet.
              </p>
            </div>
          </div>
        </section>

        {/* Asset Registry */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-slate-800 pb-3">
            TROPTIONS IOU Asset Types ({XRPL_IOU_ASSET_CONFIGS.length} defined)
          </h2>
          <p className="text-sm text-slate-500">
            All assets below have <code className="text-amber-300">liveIssuanceEnabled: false</code>.
            Issuance requires completion of all checklist gates.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {XRPL_IOU_ASSET_CONFIGS.map((cfg) => {
              const docs = getRequiredIouDocuments(cfg.assetType);
              const isIssued = cfg.onChainStatus === "issued";
              return (
                <div
                  key={cfg.assetType}
                  className={`rounded-xl border p-5 space-y-3 ${isIssued ? "border-emerald-700/40 bg-emerald-900/5" : "border-slate-800 bg-slate-900"}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      {cfg.logoPath && (
                        <Image
                          src={cfg.logoPath}
                          alt={cfg.displayName}
                          width={40}
                          height={40}
                          className="rounded-lg shrink-0"
                        />
                      )}
                      <div>
                        <p className="font-bold text-white text-lg">{cfg.displayName}</p>
                        <p className="text-slate-400 text-sm">{cfg.xrplCurrencyCode}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      {isIssued ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-900/60 border border-emerald-600/50 px-2 py-0.5 text-xs font-bold text-emerald-300 uppercase">
                          ✓ Issued
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-slate-800 px-2 py-0.5 text-xs font-semibold text-slate-500 uppercase">
                          Draft
                        </span>
                      )}
                      <span className={`inline-flex items-center rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-semibold ${cfg.aaveCompatible ? "text-green-400" : "text-slate-500"}`}>
                        {cfg.aaveCompatible ? "Aave-bridgeable" : "No Aave"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-slate-500">
                    <p><span className="text-slate-400">Underlying:</span> {cfg.underlying}</p>
                    <p><span className="text-slate-400">Issuance limit:</span> {cfg.issuanceLimit}</p>
                    <p><span className="text-slate-400">Primary route:</span> {cfg.route}</p>
                    <p><span className="text-slate-400">Authorized trustline:</span> Required</p>
                    {isIssued && cfg.mainnetIssuedAt && (
                      <p><span className="text-slate-400">Mainnet issued:</span> <span className="text-emerald-400">{cfg.mainnetIssuedAt}</span></p>
                    )}
                    <p><span className="text-slate-400">Live issuance:</span>{" "}
                      <span className="text-red-400 font-semibold">DISABLED</span>
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-800">
                    <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C] mb-1.5">
                      Required Documents ({docs.length})
                    </p>
                    <ul className="text-xs text-slate-500 space-y-0.5">
                      {docs.slice(0, 4).map((d) => (
                        <li key={d.id} className="flex items-start gap-1.5">
                          <span className={d.hardBlockIfMissing ? "text-red-400" : "text-slate-600"}>
                            {d.hardBlockIfMissing ? "▲" : "○"}
                          </span>
                          <span>{d.label}</span>
                        </li>
                      ))}
                      {docs.length > 4 && (
                        <li className="text-slate-600 italic">+{docs.length - 4} more required</li>
                      )}
                    </ul>
                    <p className="text-xs text-slate-600 mt-1">▲ = hard block if missing</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Status Stages */}
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <h2 className="text-lg font-semibold">IOU Packet Status Stages</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(Object.entries(STATUS_COLORS) as [string, string][]).map(([status, color]) => (
              <div key={status} className="flex items-center gap-3">
                <span className={`font-mono text-xs font-bold ${color}`}>{status}</span>
              </div>
            ))}
          </div>
          <div className="text-sm text-slate-500 space-y-1">
            <p><span className={`font-semibold ${STATUS_COLORS.DRAFT}`}>DRAFT</span> — Packet created, no documents submitted.</p>
            <p><span className={`font-semibold ${STATUS_COLORS.EVIDENCE_PENDING}`}>EVIDENCE_PENDING</span> — Documents in progress, not yet verified.</p>
            <p><span className={`font-semibold ${STATUS_COLORS.RESERVE_PENDING}`}>RESERVE_PENDING</span> — Reserve or custody proof outstanding.</p>
            <p><span className={`font-semibold ${STATUS_COLORS.LEGAL_PENDING}`}>LEGAL_PENDING</span> — Legal opinion or compliance review in progress.</p>
            <p><span className={`font-semibold ${STATUS_COLORS.TRUSTLINE_READY}`}>TRUSTLINE_READY</span> — Packet ready to configure authorized trustline. Issuance still blocked.</p>
            <p><span className={`font-semibold ${STATUS_COLORS.ISSUANCE_READY}`}>ISSUANCE_READY</span> — All gates cleared. Board/admin approval required before live execution.</p>
            <p><span className={`font-semibold ${STATUS_COLORS.BLOCKED}`}>BLOCKED</span> — Hard-blocked by missing hard-requirement document or policy violation.</p>
          </div>
        </section>

        {/* Wallet Addresses */}
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <h2 className="text-lg font-semibold">XRPL Gateway Addresses</h2>
          <p className="text-sm text-slate-500">
            Public addresses only. No private keys are stored or displayed. All operations require
            authorized signer approval.
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <span className="font-mono text-xs uppercase tracking-widest text-[#C9A84C] shrink-0 w-32">Issuer</span>
              <code className="text-slate-300 text-xs break-all">{XRPL_ISSUER_ADDRESS}</code>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <span className="font-mono text-xs uppercase tracking-widest text-[#C9A84C] shrink-0 w-32">Distributor</span>
              <code className="text-slate-300 text-xs break-all">{XRPL_DISTRIBUTOR_ADDRESS}</code>
            </div>
          </div>
        </section>

        {/* Safety Footer */}
        <section className="rounded-xl border border-slate-700/40 bg-slate-900/50 p-5 space-y-1">
          <p className="font-mono text-xs uppercase tracking-widest text-slate-500">Safety Statement</p>
          <p className="text-sm text-slate-500 leading-6">
            TROPTIONS does not provide custody, exchange services, money transmission, investment advice,
            guaranteed financing, guaranteed liquidity, carbon offset guarantees, public token buybacks,
            or public LP execution. All execution requires legal, compliance, provider, custody, signer,
            and board approvals. This page is simulation-only.
          </p>
        </section>

      </div>
    </main>
  );
}
