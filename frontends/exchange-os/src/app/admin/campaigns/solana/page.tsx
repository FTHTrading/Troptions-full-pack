// Demo — add auth before production
import Link from 'next/link';
import { listCampaigns } from '@/lib/campaigns/store';
import CampaignStatusLabel from '@/components/solana/CampaignStatusLabel';
import { CAMPAIGN_TYPE_LABELS } from '@/lib/solana/campaignTypes';

export const dynamic = 'force-dynamic';

export default async function AdminSolanaCampaignsPage() {
  const campaigns = await listCampaigns();
  const baseUrl = process.env.NEXT_PUBLIC_CAMPAIGN_BASE_URL ?? 'https://launch.unykorn.org';

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <Link href="/admin/troptions" className="font-bold tracking-tight text-sm">
          TROPTIONS · Admin
        </Link>
        <Link href="/sports/solana-launcher" className="text-xs text-cyan-400/60 hover:text-cyan-400 transition-colors">
          + New Campaign
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Demo banner */}
        <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-xl px-4 py-3 mb-8 flex items-center gap-3">
          <span className="text-[10px] font-mono text-yellow-400/80 border border-yellow-500/30 rounded px-2 py-0.5">
            DEMO
          </span>
          <span className="text-xs text-yellow-400/70">
            Add authentication before production. This page is publicly accessible.
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Solana Campaigns</h1>
          <p className="text-sm text-white/40">
            {campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''} stored
          </p>
        </div>

        {campaigns.length === 0 ? (
          <div className="border border-white/8 rounded-xl p-12 text-center">
            <div className="text-white/20 text-sm mb-4">No campaigns yet</div>
            <Link
              href="/sports/solana-launcher"
              className="text-xs text-cyan-400/60 border border-cyan-500/20 rounded px-4 py-2 hover:border-cyan-500/40 transition-colors"
            >
              Launch your first campaign →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="text-left text-xs font-mono text-white/30 py-3 pr-4">Namespace</th>
                  <th className="text-left text-xs font-mono text-white/30 py-3 pr-4">Campaign</th>
                  <th className="text-left text-xs font-mono text-white/30 py-3 pr-4">Type</th>
                  <th className="text-left text-xs font-mono text-white/30 py-3 pr-4">City / Event</th>
                  <th className="text-left text-xs font-mono text-white/30 py-3 pr-4">Status</th>
                  <th className="text-left text-xs font-mono text-white/30 py-3 pr-4">Created</th>
                  <th className="text-left text-xs font-mono text-white/30 py-3">QR Link</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="py-3 pr-4">
                      <code className="text-xs font-mono text-cyan-400/70">{c.namespace}</code>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="font-medium text-white/80 text-xs">{c.campaignName}</div>
                      <div className="text-[10px] text-white/30">{c.businessName}</div>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-[10px] font-mono text-white/40 border border-white/10 rounded px-1.5 py-0.5">
                        {CAMPAIGN_TYPE_LABELS[c.campaignType] ?? c.campaignType}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-xs text-white/50">{c.cityOrEvent || '—'}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <CampaignStatusLabel mintStatus={c.mintStatus} network={c.network} />
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-[10px] font-mono text-white/30">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3">
                      <Link
                        href={`/c/${c.namespace}`}
                        className="text-[10px] font-mono text-cyan-400/50 hover:text-cyan-400 transition-colors"
                        target="_blank"
                        rel="noreferrer"
                      >
                        /c/{c.namespace} →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer links */}
        <div className="mt-8 flex gap-4 text-xs text-white/25">
          <Link href="/sports/solana-launcher" className="hover:text-white/50 transition-colors">
            Campaign Launcher
          </Link>
          <Link href="/admin/troptions" className="hover:text-white/50 transition-colors">
            Admin Home
          </Link>
          <span className="text-white/15">
            Store: D1 → SQLite → JSON → Memory
          </span>
        </div>

      </div>
    </div>
  );
}
