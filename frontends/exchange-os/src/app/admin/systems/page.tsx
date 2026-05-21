export const dynamic = "force-dynamic";
export const metadata = { title: "UNYKORN Systems Registry — All Deployed and Minted Systems" };

import {
  MINTED_SYSTEMS,
  MintedSystem,
  SystemStatus,
  getSystemsByStatus,
} from "@/data/minted-systems";

// ── Badge helpers ─────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<SystemStatus, string> = {
  live: "bg-emerald-900/50 text-emerald-300 border-emerald-700",
  tunnel_down: "bg-red-900/60 text-red-300 border-red-700",
  dev_only: "bg-yellow-900/40 text-yellow-300 border-yellow-700",
  minted: "bg-purple-900/50 text-purple-300 border-purple-700",
  stub: "bg-gray-800 text-gray-400 border-gray-600",
  pending: "bg-blue-900/40 text-blue-300 border-blue-700",
};

const STATUS_LABELS: Record<SystemStatus, string> = {
  live: "LIVE",
  tunnel_down: "TUNNEL DOWN",
  dev_only: "DEV ONLY",
  minted: "MINTED",
  stub: "STUB",
  pending: "PENDING",
};

const MINT_STYLES: Record<MintedSystem["solanaMintStatus"], string> = {
  minted: "bg-purple-900/60 text-purple-200 border-purple-600",
  devnet_stub: "bg-blue-900/40 text-blue-300 border-blue-700",
  pending: "bg-yellow-900/30 text-yellow-400 border-yellow-700",
  not_applicable: "bg-gray-800/50 text-gray-500 border-gray-700",
};

const DEPLOY_ICONS: Record<MintedSystem["deployTarget"], string> = {
  cloudflare_pages: "CF Pages",
  vercel: "Vercel",
  cloudflare_worker: "CF Worker",
  cloudflare_tunnel: "CF Tunnel",
  local: "Local",
  docker: "Docker",
};

const CATEGORY_LABELS: Record<MintedSystem["category"], string> = {
  ai_core: "AI Core",
  ai_agents: "AI Agents",
  campaign_layer: "Campaign Layer",
  guest_experience: "Guest Experience",
  blockchain: "Blockchain",
  payment: "Payment",
  communication: "Communication",
  admin: "Admin",
};

const CATEGORY_ORDER: MintedSystem["category"][] = [
  "ai_core",
  "ai_agents",
  "blockchain",
  "payment",
  "campaign_layer",
  "guest_experience",
  "communication",
  "admin",
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SystemsRegistryPage() {
  const liveCount = getSystemsByStatus("live").length;
  const tunnelDownCount = getSystemsByStatus("tunnel_down").length;
  const mintedCount = MINTED_SYSTEMS.filter(
    (s) => s.solanaMintStatus === "minted"
  ).length;
  const total = MINTED_SYSTEMS.length;

  const grouped = CATEGORY_ORDER.reduce<
    Record<string, MintedSystem[]>
  >((acc, cat) => {
    const items = MINTED_SYSTEMS.filter((s) => s.category === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#060A12] text-gray-100 p-8">
      {/* Demo banner */}
      <div className="mb-5 rounded border border-yellow-600/60 bg-yellow-900/20 px-4 py-2 text-sm text-yellow-300">
        INTERNAL — Add auth before making this page publicly accessible.
        goat.unykorn.org tunnel was just re-created (a2da25a0) — start goat-site on :3001 to restore it.
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-2">
          UNYKORN EMPIRE
        </div>
        <h1 className="text-3xl font-bold text-white">
          Systems Registry
        </h1>
        <p className="mt-1 text-gray-400 text-sm">
          All deployed and minted systems — Cloudflare tunnels, Vercel, Workers, local, Docker.
          Tunnel inventory as of 2026-05-15.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total Systems", value: total, color: "text-white" },
          { label: "Live", value: liveCount, color: "text-emerald-400" },
          {
            label: "Tunnel Down",
            value: tunnelDownCount,
            color: "text-red-400",
          },
          {
            label: "Solana Minted",
            value: mintedCount,
            color: "text-purple-400",
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="rounded-lg bg-[#0F1923] border border-gray-800 p-5"
          >
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              {label}
            </div>
            <div className={`text-3xl font-bold ${color}`}>{value}</div>
          </div>
        ))}
      </div>

      {/* Goat tunnel fix callout */}
      {tunnelDownCount > 0 && (
        <div className="mb-8 rounded-lg border border-red-700/60 bg-red-900/20 p-5">
          <div className="text-sm font-semibold text-red-300 mb-2">
            ⚠ Cloudflare Tunnel Issues Detected
          </div>
          {getSystemsByStatus("tunnel_down").map((s) => (
            <div key={s.id} className="mb-3 last:mb-0">
              <div className="text-white font-medium">{s.name}</div>
              <div className="text-sm text-gray-400 mt-0.5">{s.url}</div>
              <div className="mt-2 text-xs text-yellow-300 font-mono bg-black/40 rounded px-3 py-2 leading-relaxed">
                {s.id === "goat" ? (
                  <>
                    # Tunnel a2da25a0 created 2026-05-15 — DNS CNAME added<br />
                    # Start the goat-site on localhost:3001, then run:<br />
                    &quot;C:\Program Files (x86)\cloudflared\cloudflared.exe&quot; tunnel --config C:\Users\Kevan\.cloudflared\goat.yml run<br />
                    # Or add a cloudflared-goat.cmd to the Startup folder.
                  </>
                ) : (
                  <># Check: cloudflared tunnel info {s.namespace}</>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Systems grouped by category */}
      {Object.entries(grouped).map(([cat, systems]) => (
        <div key={cat} className="mb-8">
          <div className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-3">
            {CATEGORY_LABELS[cat as MintedSystem["category"]]}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="pb-2 text-left font-normal pr-4">System</th>
                  <th className="pb-2 text-left font-normal pr-4">Namespace</th>
                  <th className="pb-2 text-left font-normal pr-4">URL</th>
                  <th className="pb-2 text-left font-normal pr-4">Deploy</th>
                  <th className="pb-2 text-left font-normal pr-4">Solana</th>
                  <th className="pb-2 text-left font-normal">Status</th>
                </tr>
              </thead>
              <tbody>
                {systems.map((s) => (
                  <tr
                    key={s.id}
                    className={`border-b border-gray-800/50 ${
                      s.liveStatus === "tunnel_down"
                        ? "bg-red-900/10"
                        : ""
                    }`}
                  >
                    <td className="py-3 pr-4">
                      <div className="text-white font-medium">{s.name}</div>
                      {s.mintAddress && (
                        <div className="text-xs text-purple-400 font-mono mt-0.5 truncate max-w-[180px]" title={s.mintAddress}>
                          {s.mintAddress.slice(0, 8)}…{s.mintAddress.slice(-6)}
                        </div>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-gray-400 font-mono text-xs">
                      {s.namespace}
                    </td>
                    <td className="py-3 pr-4">
                      {s.url.startsWith("http") ? (
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-xs font-mono truncate block max-w-[200px]"
                        >
                          {s.url.replace("https://", "").replace("http://", "")}
                        </a>
                      ) : (
                        <span className="text-gray-500 text-xs font-mono">{s.url}</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-xs text-gray-400">
                        {DEPLOY_ICONS[s.deployTarget]}
                        {s.port ? ` :${s.port}` : ""}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`text-xs border rounded px-1.5 py-0.5 ${MINT_STYLES[s.solanaMintStatus]}`}
                      >
                        {s.solanaMintStatus === "not_applicable"
                          ? "N/A"
                          : s.solanaMintStatus.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`text-xs border rounded px-1.5 py-0.5 ${STATUS_STYLES[s.liveStatus]}`}
                      >
                        {STATUS_LABELS[s.liveStatus]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Cloudflare tunnel inventory */}
      <div className="mt-10 rounded-lg bg-[#0F1923] border border-gray-800 p-6">
        <div className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-4">
          Cloudflare Tunnel Inventory (2026-05-15)
        </div>
        <div className="font-mono text-xs text-gray-400 space-y-1">
          <div className="grid grid-cols-3 gap-4 text-gray-600 uppercase text-[10px] pb-1 border-b border-gray-800">
            <span>Name</span><span>Tunnel ID</span><span>Connections</span>
          </div>
          {[
            { name: "junior-tilden", id: "3fe7b6d1", conns: "3× ATL — ACTIVE" },
            { name: "unykorn-x402-gateway", id: "98795c02", conns: "8× ATL/IAD — ACTIVE" },
            { name: "goat (new)", id: "a2da25a0", conns: "pending — start goat-site :3001" },
            { name: "fifa-ivr", id: "f10103e1", conns: "offline" },
            { name: "needai-webhook", id: "722ddbd9", conns: "offline" },
            { name: "fthx-future", id: "6c5c4be7", conns: "offline" },
            { name: "wilkins-media", id: "c88545ea", conns: "offline" },
            { name: "optkas-api-4020", id: "26a96181", conns: "offline" },
            { name: "unykorn-api", id: "da2441b2", conns: "offline" },
            { name: "dc-unykorn", id: "87666a13", conns: "offline" },
          ].map(({ name, id, conns }) => (
            <div key={id} className={`grid grid-cols-3 gap-4 py-0.5 ${conns.includes("ACTIVE") ? "text-emerald-400" : conns.includes("pending") ? "text-yellow-400" : "text-gray-500"}`}>
              <span>{name}</span>
              <span>{id}…</span>
              <span>{conns}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="mt-6 flex gap-4 text-sm">
        <a
          href="/admin/campaigns/solana"
          className="text-[#C9A84C] hover:underline"
        >
          → Campaign-level Solana view
        </a>
        <a
          href="/admin/infrastructure"
          className="text-[#C9A84C] hover:underline"
        >
          → Infrastructure control plane
        </a>
      </div>
    </div>
  );
}
