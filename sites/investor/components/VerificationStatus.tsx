"use client";

import { useState } from "react";
import { Section } from "./Section";
import { VERIFICATION_STATUS_URL } from "@/lib/constants";

const PRIORITY = [
  "Live URLs (curl / HTTP HEAD — no API keys)",
  "Repo builds & tests (cargo, npm)",
  "On-chain proofs (PolygonScan — optional POLYGONSCAN_API_KEY)",
];

export function VerificationStatus() {
  const [open, setOpen] = useState(false);
  const percent = 68;
  const baseline = 60;

  return (
    <Section
      id="verification"
      title="Verification"
      subtitle="Honest diligence progress — CONFIRMED vs PENDING. Full tables in VERIFICATION_STATUS.md."
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
        <a
          href={VERIFICATION_STATUS_URL}
          className="text-sm text-[var(--color-gold-light)] underline-offset-2 hover:underline"
        >
          Full verification doc →
        </a>
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
            <strong className="text-white">Confirmed this run:</strong> genesis-world
            repo public; drunks.app + gsp-api health HTTP 200; PM2 8/8;{" "}
            <code className="text-xs">cargo test --workspace</code> in genesis-world;
            troptions.unykorn.org DNS resolves.
          </p>
          <p>
            <strong className="text-white">Still pending:</strong> PolygonScan
            contract verification (optional API key in{" "}
            <code className="text-xs">.env.example</code>); Bithomp/XRPL balance proof
            for desk figures; Exchange OS $175M = operator attestation until
            third-party proof.
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
