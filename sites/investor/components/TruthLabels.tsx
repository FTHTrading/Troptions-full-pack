"use client";

import { useEffect, useState } from "react";
import { Section } from "./Section";
import { StatusBadge } from "./StatusBadge";
import { assetPath } from "@/lib/base-path";
import type { TruthLabelsData } from "@/lib/truth-labels";

export function TruthLabels() {
  const [data, setData] = useState<TruthLabelsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(assetPath("/data/truth-labels.json"))
      .then((r) => {
        if (!r.ok) throw new Error("load failed");
        return r.json();
      })
      .then(setData)
      .catch(() => setError("Could not load truth labels."));
  }, []);

  return (
    <Section
      id="truth"
      title="Truth labels"
      subtitle="CONFIRMED vs PENDING — each row links to a proof path in the monorepo."
    >
      {error ? (
        <p className="text-rose-300">{error}</p>
      ) : !data ? (
        <p className="text-[var(--color-muted)]">Loading labels…</p>
      ) : (
        <>
          <p className="mb-6 text-xs text-[var(--color-muted)]">
            Generated {data.generated.slice(0, 10)} · {data.source}
          </p>
          <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-[var(--color-surface-elevated)] text-xs uppercase tracking-wide text-[var(--color-muted)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Label</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Last check</th>
                  <th className="px-4 py-3 font-medium">Proof</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {data.labels.map((row) => (
                  <tr key={row.label} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-medium text-white">
                      {row.label}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        status={
                          row.status === "CONFIRMED" ? "confirmed" : "pending"
                        }
                      />
                    </td>
                    <td className="px-4 py-3 text-[var(--color-muted)]">
                      {row.lastCheck}
                    </td>
                    <td className="max-w-md px-4 py-3 text-[var(--color-muted)]">
                      {row.proof}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Section>
  );
}
