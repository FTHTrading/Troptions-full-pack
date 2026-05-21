"use client";

import { useState, useTransition } from "react";

type GeniusControlTowerClientProps = {
  defaultNamespaceId: string;
};

type SimulationResponse = {
  mode: "mint" | "burn" | "redemption";
  payload: Record<string, unknown> | null;
  error?: string;
};

export function GeniusControlTowerClient({ defaultNamespaceId }: GeniusControlTowerClientProps) {
  const [memberNamespace, setMemberNamespace] = useState(defaultNamespaceId);
  const [amount, setAmount] = useState("2500.00");
  const [action, setAction] = useState<"simulate_mint" | "simulate_burn" | "simulate_redemption">("simulate_mint");
  const [result, setResult] = useState<SimulationResponse | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSimulate() {
    startTransition(async () => {
      const endpoint = action === "simulate_redemption" ? "/api/genius/simulate-redemption" : "/api/genius/simulate-mint";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ memberNamespace, amount }),
      });

      const payload = (await response.json()) as Record<string, unknown>;
      setResult({
        mode: action === "simulate_redemption" ? "redemption" : action === "simulate_burn" ? "burn" : "mint",
        payload,
        error: response.ok ? undefined : String(payload.error ?? "Simulation failed"),
      });
    });
  }

  return (
    <section className="rounded-[32px] border border-cyan-400/20 bg-slate-950/80 p-6 shadow-[0_24px_80px_rgba(8,145,178,0.14)]">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.38em] text-cyan-300">Sandbox Stablecoin Simulator</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Simulation Only</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-300">
            No live token issued. No money moved. Compliance sandbox only.
          </p>
        </div>
        <div className="rounded-full border border-amber-400/40 bg-amber-500/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-amber-200">
          Live issuance blocked by default
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          Member namespace
          <input
            className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
            value={memberNamespace}
            onChange={(event) => setMemberNamespace(event.target.value)}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          Amount
          <input
            className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          Action
          <select
            className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
            value={action}
            onChange={(event) => setAction(event.target.value as "simulate_mint" | "simulate_burn" | "simulate_redemption")}
          >
            <option value="simulate_mint">simulate mint</option>
            <option value="simulate_burn">simulate burn</option>
            <option value="simulate_redemption">simulate redemption</option>
          </select>
        </label>
        <button
          type="button"
          onClick={handleSimulate}
          disabled={isPending}
          className="rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Running sandbox check..." : "Run sandbox simulation"}
        </button>
      </div>

      <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Output</p>
        <p className="mt-2 text-sm text-slate-300">
          Clear banner: No live token issued. No money moved. Compliance sandbox only.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-cyan-100">
          {JSON.stringify(result ?? { message: "Awaiting sandbox request." }, null, 2)}
        </pre>
      </div>
    </section>
  );
}