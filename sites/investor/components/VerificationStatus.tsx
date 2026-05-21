"use client";

import { useState } from "react";
import { Section } from "./Section";
import {
  FINAL_ECOSYSTEM_AUDIT_URL,
  MATURITY_SCORE,
  VERIFICATION_STATUS_URL,
} from "@/lib/constants";

const PRIORITY = [
  "Live URLs (curl / HTTP HEAD — no API keys)",
  "Repo builds & tests (cargo, npm)",
  "On-chain proofs (PolygonScan — optional POLYGONSCAN_API_KEY)",
];

export function VerificationStatus() {
  const [open, setOpen] = useState(false);
  const percent = 95;
  const baseline = 60;
  const honestScore = `${MATURITY_SCORE}/10`;

  return (
    <Section
      id="verification"
      title="Verification"
      subtitle={`Honest diligence — ${honestScore} overall. CONFIRMED vs PENDING in canonical audit docs.`}
    >
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="min-w-[200px] flex-1">
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-[var(--color-muted)]">
              Progress ({baseline}% → {percent}%)
            </span>
            <span className="font-medium text-[var(--color-gold-light)]">
              {percent}%
            </span>
          </div>
          <div
            className="h-2 overflow-hidden rounded-full bg-[var(--color-border)]"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <a
            href={FINAL_ECOSYSTEM_AUDIT_URL}
            className="text-[var(--color-gold-light)] underline-offset-2 hover:underline"
          >
            Final ecosystem audit →
          </a>
          <a
            href={VERIFICATION_STATUS_URL}
            className="text-[var(--color-gold-light)] underline-offset-2 hover:underline"
          >
            Verification checklist →
          </a>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-3 text-left text-sm font-medium text-white hover:bg-white/[0.03]"
        aria-expanded={open}
      >
        <span>Priority order & latest run summary</span>
        <span className="text-[var(--color-muted)]">{open ? "−" : "+"}</span>
      </button>

      {open ? (
        <div className="mt-4 space-y-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 text-sm text-[var(--color-muted)]">
          <ol className="list-decimal space-y-2 pl-5">
            {PRIORITY.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
          <p>
            <strong className="text-white">Confirmed this run:</strong> PM2 8/8;
            Polygon KENNY/EVL + Genesis 9 contracts; XRPL/Stellar issued supply
            (~874M on ledger, USDC 274M cross-chain); live unykorn URLs + x402
            health; drunks.app; no kill_switch Anchor in full-pack.
          </p>
          <p>
            <strong className="text-white">Gap to 10/10:</strong> Cloudflare
            origin health (twin, x402api); T-Build tests after{" "}
            <code className="text-xs">npm ci</code>;{" "}
            <code className="text-xs">ai.troptions.org</code> DNS; thin XRPL
            XRP reserves.
          </p>
          <p className="text-xs">
            Re-run:{" "}
            <code className="text-[var(--color-gold-light)]">
              scripts/verify-ecosystem-links.ps1
            </code>
          </p>
        </div>
      ) : null}
    </Section>
  );
}
