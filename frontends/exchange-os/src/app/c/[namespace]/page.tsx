import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCampaignByNamespace } from '@/lib/campaigns/store';
import CampaignStatusLabel from '@/components/solana/CampaignStatusLabel';
import { SAFETY_DISCLAIMER } from '@/data/merchant-campaigns';
import { CAMPAIGN_TYPE_LABELS } from '@/lib/solana/campaignTypes';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ namespace: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { namespace } = await params;
  const campaign = await getCampaignByNamespace(namespace);
  if (!campaign) {
    return { title: 'Campaign not found — TROPTIONS' };
  }
  const baseUrl = process.env.NEXT_PUBLIC_CAMPAIGN_BASE_URL ?? 'https://launch.unykorn.org';
  return {
    title: `${campaign.campaignName} — ${campaign.businessName}`,
    description: `${campaign.offer} · ${campaign.cityOrEvent} — Campaign by ${campaign.businessName} powered by TROPTIONS`,
    openGraph: {
      title: `${campaign.campaignName} — ${campaign.businessName}`,
      description: `${campaign.offer} · ${campaign.cityOrEvent}`,
      url: `${baseUrl}/c/${namespace}`,
      siteName: 'TROPTIONS · DONK AI',
      images: campaign.imageUrl ? [{ url: campaign.imageUrl, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${campaign.campaignName}`,
      description: `${campaign.offer} · ${campaign.cityOrEvent}`,
    },
  };
}

export default async function CampaignLandingPage({ params }: PageProps) {
  const { namespace } = await params;
  const campaign = await getCampaignByNamespace(namespace);

  if (!campaign) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
        <div className="max-w-sm text-center">
          <div className="text-4xl font-bold mb-4 text-white/20">404</div>
          <h1 className="text-xl font-semibold mb-2">Campaign not found</h1>
          <p className="text-sm text-white/40 mb-6">
            The campaign <code className="font-mono text-cyan-400/60">{namespace}</code> does not exist or has been removed.
          </p>
          <Link href="/" className="text-xs text-cyan-400/60 underline hover:text-cyan-400">
            Return to TROPTIONS
          </Link>
        </div>
      </div>
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_CAMPAIGN_BASE_URL ?? 'https://launch.unykorn.org';
  const shareUrl = `${baseUrl}/c/${namespace}`;
  const typeLabel = CAMPAIGN_TYPE_LABELS[campaign.campaignType] ?? campaign.campaignType;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <Link href="/" className="font-bold tracking-tight text-sm">TROPTIONS</Link>
        <div className="text-xs text-white/30 font-mono">launch.unykorn.org</div>
      </nav>

      <div className="max-w-lg mx-auto px-6 py-12">

        {/* Campaign type badge */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="text-[10px] font-mono border border-white/15 text-white/30 rounded px-2 py-0.5 uppercase">
            {typeLabel}
          </span>
          <CampaignStatusLabel
            mintStatus={campaign.mintStatus}
            network={campaign.network}
          />
        </div>

        {/* Campaign name + business */}
        <h1 className="text-2xl md:text-3xl font-bold mb-1 leading-tight">
          {campaign.campaignName}
        </h1>
        <div className="text-sm text-white/50 mb-2">{campaign.businessName}</div>
        {campaign.cityOrEvent && (
          <div className="text-xs font-mono text-cyan-400/50 mb-6">{campaign.cityOrEvent}</div>
        )}

        {/* Campaign image or placeholder */}
        <div className="mb-6 rounded-xl overflow-hidden border border-white/8">
          {campaign.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={campaign.imageUrl}
              alt={campaign.campaignName}
              className="w-full h-56 object-cover"
            />
          ) : (
            <div className="w-full h-40 bg-white/3 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-white/10 mb-1">
                  {campaign.businessName.slice(0, 2).toUpperCase()}
                </div>
                <div className="text-[10px] font-mono text-white/20">Campaign Asset</div>
              </div>
            </div>
          )}
        </div>

        {/* Offer / reward */}
        {campaign.offer && (
          <div className="border border-cyan-500/20 rounded-xl p-4 mb-6 bg-cyan-500/5">
            <div className="text-[10px] font-mono text-cyan-400/50 mb-1 uppercase">Offer / Reward</div>
            <div className="text-base font-semibold text-white">{campaign.offer}</div>
          </div>
        )}

        {/* Description */}
        {campaign.description && (
          <p className="text-sm text-white/50 leading-relaxed mb-6">{campaign.description}</p>
        )}

        {/* Shareable QR link */}
        <div className="border border-white/8 rounded-xl p-4 mb-6">
          <div className="text-[10px] font-mono text-white/30 mb-2">Campaign Link</div>
          <div className="flex items-center gap-2 flex-wrap">
            <code className="text-xs font-mono text-cyan-400/70 break-all">{shareUrl}</code>
          </div>
          <div className="mt-3 text-[10px] text-white/20">
            Share this link or the QR code to distribute this campaign.
          </div>
        </div>

        {/* Campaign details */}
        <div className="grid grid-cols-2 gap-3 mb-8 text-xs">
          {campaign.expiration && (
            <div className="border border-white/8 rounded-lg p-3">
              <div className="text-white/30 mb-0.5">Expires</div>
              <div className="text-white/60 font-mono">{campaign.expiration}</div>
            </div>
          )}
          <div className="border border-white/8 rounded-lg p-3">
            <div className="text-white/30 mb-0.5">Supply</div>
            <div className="text-white/60 font-mono">{campaign.quantity.toLocaleString()}</div>
          </div>
          <div className="border border-white/8 rounded-lg p-3">
            <div className="text-white/30 mb-0.5">Network</div>
            <div className="text-white/60 font-mono uppercase">{campaign.network}</div>
          </div>
          <div className="border border-white/8 rounded-lg p-3">
            <div className="text-white/30 mb-0.5">Namespace</div>
            <div className="text-white/60 font-mono truncate">{campaign.namespace}</div>
          </div>
        </div>

        {/* Mint address (if minted) */}
        {campaign.mintAddress && (
          <div className="border border-green-500/20 rounded-xl p-4 mb-6 bg-green-500/5">
            <div className="text-[10px] font-mono text-green-400/50 mb-1">Mint Address</div>
            <code className="text-xs font-mono text-green-400/70 break-all">{campaign.mintAddress}</code>
          </div>
        )}

        {/* Safety disclaimer */}
        <div className="border border-white/6 rounded-xl p-4 mb-8">
          <div className="text-[10px] font-mono text-white/25 leading-relaxed">{SAFETY_DISCLAIMER}</div>
        </div>

        {/* Footer */}
        <div className="text-center border-t border-white/6 pt-6">
          <div className="text-[10px] font-mono text-white/20">
            Powered by{' '}
            <Link href="/" className="text-cyan-400/40 hover:text-cyan-400 transition-colors">
              TROPTIONS
            </Link>
            {' · '}
            <span className="text-white/20">DONK AI</span>
          </div>
          <div className="text-[9px] font-mono text-white/15 mt-1">
            Campaign assets are promotional utilities. Not an investment.
          </div>
        </div>

      </div>
    </div>
  );
}
