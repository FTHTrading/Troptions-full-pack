"use client";

import {
  XRPL_FORENSICS_TIMELINE,
  XRPL_CONTROL_KEY_QUESTION,
  CHANGE_NOW_SUPPORT_TEMPLATE,
} from "@/content/troptions/walletForensicsRegistry";
import {
  XRPL_WALLET_INVENTORY_REGISTRY,
  XRPL_HIGH_RISK_ADDRESSES,
  XRPL_SIGNING_KEY_ADDRESSES,
} from "@/content/troptions/xrplWalletInventoryRegistry";
import { STELLAR_WALLET_INVENTORY_REGISTRY } from "@/content/troptions/stellarWalletInventoryRegistry";

const COMPROMISE_RED_FLAGS = [
  "Regular key set on rpP12ND — Feb 25 (rpKmcC1...) while master key simultaneously disabled. Original owner lost control.",
  "5 holder wallets (rDEW3, rPqUumc, rnAF6Ki, rGhaJrY, rKNvud9) all returned USDT to issuer rGSDDiG within hours of each other on Mar 4 — coordinated attacker action.",
  "Sending IOUs back to the issuer DESTROYS them. ~185M USDT + 15M GOLD + 25M EUR + 22.5M GBP + 2M DONK wiped from the UnyKorn ecosystem in one coordinated sweep.",
  "rGSDDiGaL47GcACEDfkxT7X8KGy1XFuWCc (your UnyKorn issuer, domain: unykorn.org) now shows 0 IOUs issued and 0 held. Entire USDT supply destroyed.",
  "Regular key replaced AGAIN on Mar 5 00:24 (rJpKvdn...) — 22 minutes before the final 81 XRP was swept to ChangeNOW.",
  "rDEW3 attempted AccountDelete on Mar 4 to erase its account — blocked by open USDT trustline (tecHAS_OBLIGATIONS). Evidence-hiding attempt.",
  "All trustlines on rpP12ND zeroed at Mar 5 00:33–00:43 BEFORE the XRP sweep — systematic evidence cleanup.",
  "81.417325 XRP swept to ChangeNOW destination tag 614122458 at Mar 5 00:46 — the final drain of native XRP.",
  "rKNvud9 zeroed trustlines for USDT, DRUNKS, DONK, GOLD on Mar 4 23:47 — coordinated with other wallets.",
  "Feb 18: issuer distributed USDT to 4 wallets; Mar 4: all 4 returned it. The attacker controlled all of them simultaneously.",
];

// ── Tone helpers ──────────────────────────────────────────────────────────────
const RISK_BADGE: Record<string, string> = {
  high: "wf-badge-critical",
  medium: "wf-badge-warning",
  low: "wf-badge-info",
  unknown: "wf-badge-neutral",
};

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-bold mt-8 mb-3 border-b border-zinc-700 pb-1 text-zinc-100">
      {children}
    </h2>
  );
}

function AlertBox({ tone, children }: { tone: "critical" | "warning" | "info"; children: React.ReactNode }) {
  const cls = {
    critical: "bg-red-950 border-red-600 text-red-200",
    warning: "bg-yellow-950 border-yellow-600 text-yellow-200",
    info: "bg-blue-950 border-blue-600 text-blue-200",
  }[tone];
  return (
    <div className={`border-l-4 rounded p-4 mb-4 ${cls}`}>
      {children}
    </div>
  );
}

// ── Timeline table ────────────────────────────────────────────────────────────

function CompromiseTimeline() {
  return (
    <section>
      <SectionHeading>Forensic Timeline — Key Events</SectionHeading>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-zinc-800 text-zinc-300">
              <th className="px-3 py-2 border border-zinc-700">#</th>
              <th className="px-3 py-2 border border-zinc-700">Event</th>
            </tr>
          </thead>
          <tbody>
            {XRPL_FORENSICS_TIMELINE.map((entry: string, i: number) => (
              <tr
                key={i}
                className={i % 2 === 0 ? "bg-zinc-900 text-zinc-200" : "bg-zinc-850 text-zinc-300"}
              >
                <td className="px-3 py-2 border border-zinc-700 text-zinc-500 text-xs">{i + 1}</td>
                <td className="px-3 py-2 border border-zinc-700 font-mono text-xs">{entry}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ── Red-flags panel ───────────────────────────────────────────────────────────

function RedFlagsPanel() {
  return (
    <section>
      <SectionHeading>Compromise Red Flags</SectionHeading>
      <AlertBox tone="critical">
        <p className="font-bold mb-2">⚠ These patterns indicate the wallet was under external control:</p>
        <ul className="list-disc list-inside space-y-1">
          {COMPROMISE_RED_FLAGS.map((flag: string, i: number) => (
            <li key={i}>{flag}</li>
          ))}
        </ul>
      </AlertBox>
      <AlertBox tone="warning">
        <p className="font-semibold">{XRPL_CONTROL_KEY_QUESTION}</p>
        <p className="mt-1 text-sm">
          If the answer is <strong>no</strong>: treat both regular key addresses as attacker-controlled
          infrastructure. Report them to XRPL Labs, ChangeNOW, and law enforcement.
        </p>
      </AlertBox>
    </section>
  );
}

// ── All-wallets table ─────────────────────────────────────────────────────────

function AllWalletsTable() {
  const allWallets = [...XRPL_WALLET_INVENTORY_REGISTRY, ...STELLAR_WALLET_INVENTORY_REGISTRY];
  return (
    <section>
      <SectionHeading>Full Wallet Inventory ({allWallets.length} wallets)</SectionHeading>
      <p className="text-sm text-zinc-400 mb-3">
        Includes legacy backup wallets (XRPL + Stellar), forensic/compromised accounts, and
        signing-key investigation addresses. Addresses only — no private keys stored here.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-zinc-800 text-zinc-300">
              <th className="px-3 py-2 border border-zinc-700">Chain</th>
              <th className="px-3 py-2 border border-zinc-700">Label</th>
              <th className="px-3 py-2 border border-zinc-700">Address</th>
              <th className="px-3 py-2 border border-zinc-700">Role</th>
              <th className="px-3 py-2 border border-zinc-700">Risk</th>
              <th className="px-3 py-2 border border-zinc-700">Key Status</th>
              <th className="px-3 py-2 border border-zinc-700">Explorers</th>
            </tr>
          </thead>
          <tbody>
            {allWallets.map((w, i) => (
              <tr
                key={w.walletId}
                className={i % 2 === 0 ? "bg-zinc-900 text-zinc-200" : "bg-zinc-850 text-zinc-300"}
              >
                <td className="px-3 py-2 border border-zinc-700 uppercase text-zinc-400">{w.chain}</td>
                <td className="px-3 py-2 border border-zinc-700 font-medium">{w.label}</td>
                <td className="px-3 py-2 border border-zinc-700 font-mono text-xs break-all">{w.address}</td>
                <td className="px-3 py-2 border border-zinc-700 text-zinc-400">{w.role}</td>
                <td className="px-3 py-2 border border-zinc-700">
                  <span className={`wf-badge ${RISK_BADGE[w.riskStatus] ?? "wf-badge-neutral"}`}>
                    {w.riskStatus}
                  </span>
                </td>
                <td className="px-3 py-2 border border-zinc-700 text-zinc-400">
                  {w.masterKeyStatus ?? "—"}
                </td>
                <td className="px-3 py-2 border border-zinc-700 space-x-2">
                  {w.explorerLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      {link.label}
                    </a>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ── High-risk spotlight ───────────────────────────────────────────────────────

function HighRiskSpotlight() {
  return (
    <section>
      <SectionHeading>High-Risk Address Spotlight</SectionHeading>
      <div className="grid gap-4 md:grid-cols-2">
        {XRPL_HIGH_RISK_ADDRESSES.map((addr) => {
          const rec = XRPL_WALLET_INVENTORY_REGISTRY.find((w) => w.address === addr)!;
          return (
            <div key={addr} className="border border-red-700 rounded p-4 bg-red-950/30">
              <p className="font-bold text-red-300 text-sm mb-1">{rec.label}</p>
              <p className="font-mono text-xs text-red-200 break-all mb-2">{addr}</p>
              <ul className="text-xs text-zinc-300 list-disc list-inside space-y-1">
                {rec.notes.map((n, i) => <li key={i}>{n}</li>)}
              </ul>
              <div className="mt-2 flex gap-2">
                {rec.explorerLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:underline"
                  >
                    {link.label} ↗
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── Signing-key chain ─────────────────────────────────────────────────────────

function SigningKeyChain() {
  return (
    <section>
      <SectionHeading>Attacker Signing-Key Chain</SectionHeading>
      <AlertBox tone="warning">
        <p className="text-sm">
          The three addresses below are <strong>not your wallets</strong>. They appear as
          regular-key / signing-key entries on the compromised accounts. If you did not
          create them, they belong to the attacker. Provide all three to ChangeNOW, XRPL
          Labs, and any law enforcement report.
        </p>
      </AlertBox>
      <div className="space-y-3">
        {XRPL_SIGNING_KEY_ADDRESSES.map((addr) => {
          const rec = XRPL_WALLET_INVENTORY_REGISTRY.find((w) => w.address === addr)!;
          return (
            <div key={addr} className="border border-yellow-700 rounded p-3 bg-yellow-950/20">
              <p className="font-semibold text-yellow-300 text-sm">{rec.label}</p>
              <p className="font-mono text-xs text-yellow-100 break-all">{addr}</p>
              <ul className="mt-2 text-xs text-zinc-300 list-disc list-inside space-y-1">
                {rec.notes.map((n, i) => <li key={i}>{n}</li>)}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── ChangeNOW support template ────────────────────────────────────────────────

function ChangeNowTemplate() {
  return (
    <section>
      <SectionHeading>ChangeNOW Support — Copy &amp; Send</SectionHeading>
      <AlertBox tone="info">
        <p className="text-xs mb-2">
          Copy the message below and submit it to{" "}
          <a
            href="https://changenow.io/faq/contact-support"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            ChangeNOW support
          </a>
          . Reference the destination tag to link your specific order.
        </p>
      </AlertBox>
      <pre className="bg-zinc-800 border border-zinc-700 rounded p-4 text-xs text-green-300 whitespace-pre-wrap overflow-x-auto">
        {CHANGE_NOW_SUPPORT_TEMPLATE}
      </pre>
    </section>
  );
}

// ── Immediate action checklist ────────────────────────────────────────────────

const IMMEDIATE_ACTIONS = [
  { done: false, action: "Stop using rpP12ND2K7ZRzXZBEUnQM2i18tMGytXnW1 immediately. Do not send more XRP to it." },
  { done: false, action: "Create a brand-new XRPL wallet using trusted software (Xumm / XRPL.org tooling). Never reuse the old seed." },
  { done: false, action: "Contact ChangeNOW with the support message above. Reference dest tag 614122458 and tx 84F7978E..." },
  { done: false, action: "Screenshot / export: SetRegularKey txs, DisableMasterKey tx, the 81 XRP payment, failed AccountDelete, IOU outflows." },
  { done: false, action: "Rotate seeds on ALL other legacy backup wallets (issuer, treasury, escrow, attestation, amm_liquidity, trading) in case same seed derivation was compromised." },
  { done: false, action: "Rotate all three Stellar seeds (issuer, distribution, anchor) as a precaution." },
  { done: false, action: "Review legacy issuer wallet — if it issued IOUs that were drained, coordinate with trustline holders." },
  { done: false, action: "File a report with IC3 (internet crime) or local law enforcement with all attacker addresses and the ChangeNOW dest tag." },
];

function ImmediateActionChecklist() {
  return (
    <section>
      <SectionHeading>Immediate Action Checklist</SectionHeading>
      <ul className="space-y-2">
        {IMMEDIATE_ACTIONS.map((item, i) => (
          <li key={i} className="flex gap-3 items-start text-sm">
            <span className="mt-1 text-yellow-400 font-bold shrink-0">{i + 1}.</span>
            <span className="text-zinc-300">{item.action}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────

export function CompromiseEvidencePanel() {
  const xrplCount = XRPL_WALLET_INVENTORY_REGISTRY.length;
  const stellarCount = STELLAR_WALLET_INVENTORY_REGISTRY.length;
  const totalCount = xrplCount + stellarCount;

  return (
    <div className="wf-page-content space-y-2">
      {/* ── Header ── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-100">
          Full Forensic Investigation — All Wallets
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Investigating <strong>{totalCount} wallets</strong>: {xrplCount} XRPL
          (including compromised + signing-key addresses) + {stellarCount} Stellar.
          All analysis is read-only. No signing or fund movement.
        </p>
      </div>

      <AlertBox tone="critical">
        <p className="font-bold text-lg">ACTIVE COMPROMISE POSTURE</p>
        <p className="text-sm mt-1">
          Wallet <code>rpP12ND2K7ZRzXZBEUnQM2i18tMGytXnW1</code> is treated as
          externally controlled. The master key was disabled and unrecognised regular keys
          set before 81.417325 XRP was swept to ChangeNOW. The chain below documents every
          known attacker move.
        </p>
      </AlertBox>

      <ImmediateActionChecklist />
      <RedFlagsPanel />
      <CompromiseTimeline />
      <SigningKeyChain />
      <HighRiskSpotlight />
      <AllWalletsTable />
      <ChangeNowTemplate />
    </div>
  );
}
