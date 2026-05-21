"use client";

import { useEffect, useState } from "react";
import { Section } from "./Section";
import {
  X402_HEALTH,
  X402_TWIN,
  X402_API_DOCS,
  UNYKORN_X402_REPO,
} from "@/lib/constants";

type Probe = {
  id: string;
  label: string;
  url?: string;
  status: "live" | "pending" | "local";
  note: string;
};

const STATIC_PROBES: Probe[] = [
  { id: "donk", label: "DONK AI tutor", status: "local", note: ":8090 — needs Ollama :11434" },
  { id: "fth", label: "FTH Academy", status: "local", note: ":8091" },
  { id: "ttn", label: "TTN launcher", status: "local", note: ":8092" },
  { id: "dao", label: "DAO service + Workers AI proxy", status: "local", note: ":8093 — WORKERS_AI_ENABLED in .env" },
  { id: "x402-local", label: "x402 gateway (monorepo)", status: "local", note: ":4020 — X402_UPSTREAM → UnyKorn mesh" },
  { id: "popeye", label: "Popeye relay", status: "local", note: ":4021" },
  { id: "goat", label: "GoatX (goat.unykorn.org)", status: "pending", note: "Tunnel → :8850 — start goat-launch server" },
  { id: "junior", label: "Junior / Tilden OS", status: "pending", note: "Tunnel → :4099 — start junior-tilden API" },
];

function badgeClass(status: Probe["status"]) {
  if (status === "live") return "bg-emerald-500/15 text-emerald-400 border-emerald-500/40";
  if (status === "local") return "bg-sky-500/15 text-sky-300 border-sky-500/40";
  return "bg-amber-500/15 text-amber-300 border-amber-500/40";
}

function badgeLabel(status: Probe["status"]) {
  if (status === "live") return "LIVE";
  if (status === "local") return "LOCAL";
  return "PENDING";
}

export function AiInfrastructure() {
  const [x402Live, setX402Live] = useState<boolean | null>(null);
  const [twinPending, setTwinPending] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(X402_HEALTH, { method: "GET", cache: "no-store" });
        const j = await r.json();
        if (!cancelled) setX402Live(r.ok && j?.ok === true);
      } catch {
        if (!cancelled) setX402Live(false);
      }
      try {
        await fetch(X402_TWIN, { method: "HEAD", mode: "no-cors", cache: "no-store" });
      } catch {
        if (!cancelled) setTwinPending(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const publicProbes: Probe[] = [
    {
      id: "x402-health",
      label: "x402 public health",
      url: X402_HEALTH,
      status: x402Live === true ? "live" : x402Live === false ? "pending" : "pending",
      note: "UnyKorn-X402-aws production mesh — CONFIRMED when ok:true",
    },
    {
      id: "twin",
      label: "Digital twin",
      url: X402_TWIN,
      status: "pending",
      note: "EC2 :8402 — Cloudflare 522 until origin restored",
    },
    {
      id: "x402api",
      label: "x402 API docs",
      url: X402_API_DOCS,
      status: "pending",
      note: "Same EC2 A record as twin — see CLOUDFLARE_ORIGIN_FIX",
    },
  ];

  return (
    <Section
      id="ai-infrastructure"
      title="AI infrastructure"
      subtitle="Local PM2 stack (:8090–8093, :4020–4021) plus UnyKorn x402 mesh on Cloudflare. Honest LIVE / LOCAL / PENDING badges."
    >
      <p className="mb-6 max-w-3xl text-sm text-[var(--color-muted)]">
        Activate with{" "}
        <code className="text-xs">.\scripts\activate-ai-stack.ps1</code> and{" "}
        <code className="text-xs">pm2 start ecosystem.config.cjs</code>. Production
        mesh repo:{" "}
        <a
          href={UNYKORN_X402_REPO}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--color-gold-light)] hover:underline"
        >
          UnyKorn-X402-aws
        </a>
        .
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {[...publicProbes, ...STATIC_PROBES].map((p) => (
          <div
            key={p.id}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold text-white">{p.label}</h3>
              <span
                className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${badgeClass(p.status)}`}
              >
                {badgeLabel(p.status)}
              </span>
            </div>
            {p.url ? (
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block truncate text-xs text-[var(--color-gold-light)] hover:underline"
              >
                {p.url}
              </a>
            ) : null}
            <p className="mt-2 text-xs text-[var(--color-muted)]">{p.note}</p>
          </div>
        ))}
      </div>
      {x402Live === true ? (
        <p className="mt-4 text-xs text-emerald-400">
          Public x402 health responded ok:true — Apostle ATP mesh reachable from browser.
        </p>
      ) : null}
      {twinPending ? (
        <p className="mt-2 text-xs text-amber-300">
          twin.unykorn.org / x402api.unykorn.org remain PENDING until EC2 origin or DNS
          retarget (operator runbook).
        </p>
      ) : null}
    </Section>
  );
}
