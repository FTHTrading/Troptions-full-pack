import type { Metadata } from "next";
import Link from "next/link";
import {
  TROPTIONS_NAMESPACES,
  getNamespace,
  NAMESPACE_PLAN_LABELS,
} from "@/content/troptions-cloud/namespaceRegistry";

interface Props {
  params: Promise<{ namespace: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { namespace } = await params;
  return { title: `Settings — ${namespace} — Troptions Cloud` };
}

export async function generateStaticParams() {
  return TROPTIONS_NAMESPACES.map((n) => ({ namespace: n.slug }));
}

export default async function SettingsPage({ params }: Props) {
  const { namespace } = await params;
  const ns = getNamespace(namespace);

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <nav className="mb-4 text-[10px] uppercase tracking-[0.2em] text-gray-500">
            <Link href={`/troptions-cloud/${namespace}`} className="hover:text-white transition-colors">Dashboard</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Settings</span>
          </nav>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">Troptions Cloud</p>
          <h1 className="text-2xl font-bold text-white">Namespace Settings</h1>
          <p className="mt-2 text-sm text-gray-400">Configure your namespace preferences and details.</p>
        </div>

        {/* Simulation Banner */}
        <div className="mb-8 rounded-xl border border-yellow-800/50 bg-yellow-900/10 p-4">
          <p className="text-xs font-semibold text-yellow-400 uppercase tracking-[0.2em] mb-1">Simulation Only</p>
          <p className="text-xs text-yellow-300/80">All settings are non-functional in this phase. No changes will be saved.</p>
        </div>

        {/* General Settings */}
        <div className="mb-6 rounded-xl border border-gray-800 bg-[#0F1923] p-5">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">General</p>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-gray-500">Display Name</label>
              <input
                disabled
                type="text"
                defaultValue={ns?.displayName ?? namespace}
                className="cursor-not-allowed w-full rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-gray-500">Namespace Slug</label>
              <input
                disabled
                type="text"
                defaultValue={namespace}
                className="cursor-not-allowed w-full rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 font-mono text-sm text-gray-600"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-gray-500">Description</label>
              <textarea
                disabled
                rows={3}
                defaultValue={ns?.description ?? ""}
                className="cursor-not-allowed w-full rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Plan Info */}
        <div className="mb-6 rounded-xl border border-gray-800 bg-[#0F1923] p-5">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">Plan</p>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-white font-semibold">{ns ? NAMESPACE_PLAN_LABELS[ns.plan] : "—"}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Current namespace plan</p>
            </div>
            <button
              disabled
              className="cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2 text-xs font-semibold text-gray-600"
            >
              Upgrade — Simulation Only
            </button>
          </div>
        </div>

        {/* Safety / Read-only flags */}
        <div className="mb-6 rounded-xl border border-gray-800 bg-[#0F1923] p-5">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">Safety Configuration</p>
          <div className="space-y-3">
            {[
              { label: "Simulation Only Mode", value: true, fixed: true },
              { label: "Live Execution Enabled", value: false, fixed: true },
            ].map((flag) => (
              <div key={flag.label} className="flex items-center justify-between">
                <label className="text-xs text-gray-400">{flag.label}</label>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono ${flag.value ? "text-green-400" : "text-red-400"}`}>
                    {String(flag.value)}
                  </span>
                  {flag.fixed && (
                    <span className="rounded bg-gray-800 px-1.5 py-0.5 text-[9px] text-gray-600 uppercase">locked</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-xl border border-red-900/40 bg-[#0F1923] p-5">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-red-500">Danger Zone</p>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-300">Delete Namespace</p>
              <p className="text-[10px] text-gray-500 mt-0.5">This action is permanent and cannot be undone.</p>
            </div>
            <button
              disabled
              className="cursor-not-allowed rounded-lg border border-red-900/50 bg-[#080C14] px-4 py-2 text-xs font-semibold text-red-800"
            >
              Delete — Simulation Only
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
