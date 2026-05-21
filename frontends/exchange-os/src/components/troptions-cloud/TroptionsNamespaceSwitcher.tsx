"use client";

import Link from "next/link";
import { useState } from "react";
import type { TroptionsNamespace } from "@/content/troptions-cloud/namespaceRegistry";
import { NAMESPACE_PLAN_LABELS, NAMESPACE_STATUS_LABELS } from "@/content/troptions-cloud/namespaceRegistry";

interface TroptionsNamespaceSwitcherProps {
  currentSlug: string;
  namespaces: TroptionsNamespace[];
}

export default function TroptionsNamespaceSwitcher({
  currentSlug,
  namespaces,
}: TroptionsNamespaceSwitcherProps) {
  const [open, setOpen] = useState(false);
  const current = namespaces.find((n) => n.slug === currentSlug) ?? namespaces[0];

  return (
    <div className="relative">
      {/* Current Namespace Display */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 rounded-lg border border-gray-700 bg-[#080C14] px-3 py-2 text-left hover:border-[#C9A84C]/40 transition-colors"
      >
        <div className="min-w-0">
          <p className="text-xs font-semibold text-white truncate">{current?.displayName ?? currentSlug}</p>
          <p className="text-[10px] text-gray-500 font-mono truncate">{currentSlug}</p>
        </div>
        <svg
          className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Current namespace badges */}
      {current && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-[#C9A84C]/10 px-2 py-0.5 text-[10px] font-semibold text-[#C9A84C] uppercase tracking-[0.15em]">
            {NAMESPACE_PLAN_LABELS[current.plan]}
          </span>
          <span className="rounded-full bg-gray-800 px-2 py-0.5 text-[10px] text-gray-400">
            {NAMESPACE_STATUS_LABELS[current.status]}
          </span>
          <span className="rounded-full bg-gray-800 px-2 py-0.5 text-[10px] text-gray-400">
            {current.enabledModules.length} modules
          </span>
        </div>
      )}

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-xl border border-gray-700 bg-[#0F1923] shadow-xl overflow-hidden">
          <div className="max-h-64 overflow-y-auto">
            {namespaces.map((ns) => (
              <Link
                key={ns.id}
                href={`/troptions-cloud/${ns.slug}`}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between gap-2 px-3 py-2.5 hover:bg-[#080C14] transition-colors ${
                  ns.slug === currentSlug ? "bg-[#080C14]" : ""
                }`}
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{ns.displayName}</p>
                  <p className="text-[10px] text-gray-500 font-mono truncate">{ns.slug}</p>
                </div>
                {ns.slug === currentSlug && (
                  <span className="text-[#C9A84C] shrink-0">
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </Link>
            ))}
          </div>
          <div className="border-t border-gray-800 p-2">
            <button
              disabled
              className="w-full cursor-not-allowed rounded-lg px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-600"
            >
              + Create Namespace — Simulation Only
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
