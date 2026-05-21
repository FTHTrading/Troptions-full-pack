"use client";

import { useState } from "react";
import { Section } from "./Section";
import {
  FUTURE_DNS,
  LIVE_SURFACES,
  QUICKSTART_STEPS,
  REPO_URL,
  X402_HEALTH,
} from "@/lib/constants";

export function CTA() {
  const [open, setOpen] = useState(false);

  return (
    <Section
      id="contact"
      title="Get the stack"
      subtitle="Clone the monorepo, run quickstart locally, or reach FTH Trading for production configure."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <a
            href={REPO_URL}
            className="inline-flex w-full items-center justify-center rounded-lg bg-[var(--color-gold)] px-6 py-4 text-center font-semibold text-black transition hover:bg-[var(--color-gold-light)] sm:w-auto"
            target="_blank"
            rel="noopener noreferrer"
          >
            Clone Troptions-full-pack
          </a>

          <details
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]"
            open={open}
            onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
          >
            <summary className="cursor-pointer px-5 py-4 font-medium text-white">
              Quickstart (expand)
            </summary>
            <ol className="list-decimal space-y-2 border-t border-[var(--color-border)] px-5 py-4 pl-8 text-sm text-[var(--color-muted)]">
              {QUICKSTART_STEPS.map((step) => (
                <li key={step}>
                  <code className="text-xs text-gray-300">{step}</code>
                </li>
              ))}
            </ol>
          </details>

          <div className="rounded-xl border border-[var(--color-border)] p-5">
            <h3 className="text-sm font-semibold text-white">Contact</h3>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Production configure, DNS enablement, and diligence: coordinate with
              FTH Trading engineering (Bryan / ops). Use GitHub Issues on the
              monorepo for technical questions — no secrets in tickets.
            </p>
            <a
              href="mailto:info@fthtrading.com?subject=TROPTIONS%20investor%20inquiry"
              className="mt-4 inline-block text-sm text-[var(--color-gold-light)] hover:underline"
            >
              info@fthtrading.com
            </a>
          </div>
        </div>

        <div className="space-y-6 text-sm">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <h3 className="font-semibold text-emerald-300">Live today</h3>
            <ul className="mt-3 space-y-2">
              {LIVE_SURFACES.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    className="text-[var(--color-gold-light)] hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
            <h3 className="font-semibold text-amber-200">Future DNS (not deployed)</h3>
            <ul className="mt-3 space-y-2 text-[var(--color-muted)]">
              {FUTURE_DNS.map((d) => (
                <li key={d.host}>
                  <span className="font-mono text-amber-100/90">{d.host}</span>
                  <span className="block text-xs">{d.note}</span>
                  {"pagesPath" in d && d.pagesPath ? (
                    <a
                      href={d.pagesPath}
                      className="mt-1 inline-block text-xs text-[var(--color-gold-light)] hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Pages landing →
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] p-5">
            <h3 className="font-semibold text-white">x402 (separate stack)</h3>
            <p className="mt-2 text-[var(--color-muted)]">
              Public health endpoint on UnyKorn AWS — not the same as L1 mainnet
              posture on main.
            </p>
            <a
              href={X402_HEALTH}
              className="mt-2 inline-block text-[var(--color-gold-light)] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {X402_HEALTH}
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}
