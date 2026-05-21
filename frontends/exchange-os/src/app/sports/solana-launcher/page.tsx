'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/i18n/useI18n';
import LanguageSelector from '@/components/i18n/LanguageSelector';
import AIAssistant from '@/components/ai/AIAssistant';
import { CAMPAIGN_TYPE_LABELS, sanitizeNamespace, type CampaignAssetType, type CampaignAssetInput } from '@/lib/solana/campaignTypes';
import { buildCampaignMetadata } from '@/lib/solana/campaignMetadata';
import type { CampaignRecord } from '@/lib/campaigns/store';

const CAMPAIGN_TYPES = Object.entries(CAMPAIGN_TYPE_LABELS) as [CampaignAssetType, string][];

const INITIAL_FORM: Omit<CampaignAssetInput, 'poweredBy' | 'builder' | 'rails'> = {
  campaignType: 'merchant_namespace',
  campaignName: '',
  businessName: '',
  namespaceSlug: '',
  description: '',
  cityOrEvent: '',
  offer: '',
  imageUrl: '',
  expiration: '',
  quantity: 100,
  qrDestination: '',
};

type Step = 1 | 2 | 3 | 4 | 5;

const TRUTH_LABELS = [
  { key: 'DEVNET DEFAULT — MAINNET VIA ENV', ok: true },
  { key: 'MAINNET READY — SET NEXT_PUBLIC_SOLANA_MAINNET_ENABLED=true', ok: true },
  { key: 'NON-CUSTODIAL', ok: true },
  { key: 'NO INVESTMENT CLAIMS', ok: true },
  { key: 'NO PREDICTION MARKETS', ok: true },
  { key: 'CAMPAIGN UTILITY ONLY', ok: true },
];

export default function SolanaLauncherPage() {
  const { t, dir, mounted } = useI18n();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [preview, setPreview] = useState<ReturnType<typeof buildCampaignMetadata> | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [savedCampaign, setSavedCampaign] = useState<CampaignRecord | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImageDataUrl, setGeneratedImageDataUrl] = useState<string | null>(null);
  const [imageGenError, setImageGenError] = useState<string | null>(null);

  function handleTypeSelect(type: CampaignAssetType) {
    setForm((f) => ({ ...f, campaignType: type }));
    setStep(2);
    // Load suggestion
    fetch(`/api/ai/campaign-builder?type=${type}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.suggestion) {
          setForm((f) => ({
            ...f,
            description: f.description || d.suggestion.description,
            offer: f.offer || d.suggestion.offer,
          }));
        }
      })
      .catch(() => {});
  }

  function handleNamespaceChange(raw: string) {
    setForm((f) => ({ ...f, businessName: raw, namespaceSlug: sanitizeNamespace(raw) }));
  }

  async function generateCampaignImage() {
    setGeneratingImage(true);
    setImageGenError(null);
    try {
      const res = await fetch('/api/solana/campaign/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignName: form.campaignName,
          campaignType: form.campaignType,
          businessName: form.businessName,
          offer: form.offer,
        }),
      });
      const data = await res.json() as { ok: boolean; dataUrl?: string; stub?: boolean; message?: string; error?: string };
      if (data.ok && data.dataUrl) {
        setGeneratedImageDataUrl(data.dataUrl);
        setForm((f) => ({ ...f, imageUrl: data.dataUrl! }));
      } else if (data.stub) {
        setImageGenError(data.message ?? 'CF credentials not configured — set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_WORKERS_AI_TOKEN');
      } else {
        setImageGenError(data.error ?? 'Image generation failed');
      }
    } catch {
      setImageGenError('Network error during image generation');
    } finally {
      setGeneratingImage(false);
    }
  }

  async function buildPreview() {
    setSaving(true);
    setSaveError(null);
    const input: CampaignAssetInput = { ...form, poweredBy: 'TROPTIONS', builder: 'DONK AI', rails: 'Solana' };
    const meta = buildCampaignMetadata(input);
    setPreview(meta);

    // Save campaign to persistent store
    try {
      const saveRes = await fetch('/api/solana/campaign/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });
      const saveData = await saveRes.json();
      if (saveRes.ok && saveData.campaign) {
        setSavedCampaign(saveData.campaign as CampaignRecord);
      } else {
        // Namespace conflict or other error — still show preview
        setSaveError(saveData.error ?? 'Could not save campaign');
      }
    } catch {
      setSaveError('Network error saving campaign');
    } finally {
      setSaving(false);
    }

    // Fetch QR
    const res = await fetch(`/api/solana/campaign/qr?ns=${encodeURIComponent(form.namespaceSlug)}`).catch(() => null);
    if (res?.ok) {
      const data = await res.json();
      setQrDataUrl(data.dataUrl ?? null);
    }
    setStep(3);
  }

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black text-white" dir={dir}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <Link href="/sports" className="font-bold tracking-tight">TROPTIONS</Link>
        <div className="flex items-center gap-4">
          <Link href="/sports/merchant" className="text-xs text-white/50 hover:text-white transition-colors">{t.nav.merchantKit}</Link>
          <Link href="/sports/tribute" className="text-xs text-white/50 hover:text-white transition-colors">{t.nav.fanTribute}</Link>
          <Link href="/sports/qr-campaign" className="text-xs text-white/50 hover:text-white transition-colors">{t.nav.qrCampaign}</Link>
          <Link href="https://fifa.unykorn.org" className="text-xs text-cyan-400/60 hover:text-cyan-400 transition-colors" target="_blank" rel="noreferrer">{t.nav.guestOS} →</Link>
          <LanguageSelector compact />
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* Truth labels */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TRUTH_LABELS.map((l) => (
            <span key={l.key} className="text-[9px] font-mono border border-white/15 text-white/30 rounded px-2 py-0.5">
              {l.key}
            </span>
          ))}
        </div>

        {/* Hero */}
        <div className="mb-12 text-center">
          <div className="inline-block text-xs font-mono text-cyan-400/60 border border-cyan-900/40 rounded px-3 py-1 mb-4">
            DONK AI powered by TROPTIONS · Solana Campaign Launcher
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{t.hero.title}</h1>
          <p className="text-white/50 max-w-xl mx-auto text-sm">{t.hero.subtitle}</p>
          {/* Minting source-of-truth attribution */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs">
            <span className="text-white/30 font-mono">Minting powered by</span>
            <a
              href="https://github.com/FTHTrading/solana-launcher"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 border border-cyan-900/50 bg-cyan-950/30 text-cyan-400/70 hover:text-cyan-400 hover:border-cyan-700/60 transition-colors rounded px-3 py-1 font-mono"
            >
              FTHTrading/solana-launcher ↗
            </a>
            <a
              href="https://solana-launcher.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 border border-white/10 text-white/30 hover:text-white/60 hover:border-white/20 transition-colors rounded px-3 py-1 font-mono"
            >
              Open Solana Launcher ↗
            </a>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-10 justify-center">
          {([1,2,3,4,5] as Step[]).map((s) => (
            <div key={s} className={`w-8 h-1 rounded-full transition-colors ${step >= s ? 'bg-cyan-500/60' : 'bg-white/10'}`} />
          ))}
        </div>

        {/* STEP 1 — Choose type */}
        {step === 1 && (
          <div>
            <h2 className="text-lg font-semibold mb-6">{t.wizard.step1}</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {CAMPAIGN_TYPES.map(([type, label]) => (
                <button
                  key={type}
                  onClick={() => handleTypeSelect(type)}
                  className="border border-white/10 rounded-xl p-4 text-left hover:border-cyan-500/40 hover:bg-white/3 transition-all"
                >
                  <div className="text-xs font-mono text-white/30 mb-1">{type.replace(/_/g,' ')}</div>
                  <div className="font-medium text-sm">{label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 — Details */}
        {step === 2 && (
          <div>
            <h2 className="text-lg font-semibold mb-6">{t.wizard.step2} — {CAMPAIGN_TYPE_LABELS[form.campaignType]}</h2>
            <div className="space-y-4">
              {[
                { key: 'campaignName', label: t.wizard.campaignName, placeholder: 'My Summer Campaign' },
                { key: 'businessName', label: t.wizard.businessName, placeholder: 'My Coffee Shop', onChange: handleNamespaceChange },
                { key: 'description', label: t.wizard.description, placeholder: 'A loyalty reward for regular customers' },
                { key: 'cityOrEvent', label: t.wizard.cityOrEvent, placeholder: 'Atlanta, GA · WC2026' },
                { key: 'offer', label: t.wizard.offer, placeholder: '10% off your next visit' },
                { key: 'imageUrl', label: t.wizard.imageUrl, placeholder: 'https://...' },
                { key: 'qrDestination', label: t.wizard.qrDestination, placeholder: 'https://yourmenu.com' },
                { key: 'expiration', label: t.wizard.expiration, placeholder: '2026-12-31' },
              ].map(({ key, label, placeholder, onChange }) => (
                <div key={key}>
                  <label className="block text-xs text-white/50 mb-1">{label}</label>
                  <input
                    type="text"
                    value={(form as Record<string, unknown>)[key] as string}
                    onChange={(e) => onChange ? onChange(e.target.value) : setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full bg-white/4 border border-white/10 rounded px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/25"
                  />
                </div>
              ))}
              {/* AI Image Generation */}
              <div className="border border-white/8 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40">Generate campaign image with AI</span>
                  <span className="text-[9px] font-mono text-cyan-400/40 border border-cyan-900/20 rounded px-2 py-0.5">CF Workers AI · Flux Schnell</span>
                </div>
                <button
                  type="button"
                  onClick={generateCampaignImage}
                  disabled={generatingImage || !form.campaignName}
                  className="w-full border border-cyan-500/30 text-cyan-400/80 text-xs font-mono px-4 py-2 rounded-lg hover:border-cyan-500/60 hover:text-cyan-400 disabled:opacity-30 transition-colors"
                >
                  {generatingImage ? 'Generating…' : '✦ Generate Image with AI'}
                </button>
                {imageGenError && (
                  <div className="text-[10px] text-yellow-500/60 font-mono leading-relaxed">{imageGenError}</div>
                )}
                {generatedImageDataUrl && (
                  <div className="flex items-start gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={generatedImageDataUrl} alt="AI-generated campaign" width={80} height={80} className="rounded border border-white/10 object-cover" />
                    <div className="text-[10px] text-green-400/60 font-mono">Generated · Applied to imageUrl field</div>
                  </div>
                )}
              </div>

              {/* Namespace preview */}
              {form.namespaceSlug && (
                <div className="text-xs font-mono text-cyan-400/60 border border-cyan-900/20 rounded px-3 py-2">
                  Namespace: launch.unykorn.org/c/{form.namespaceSlug}
                </div>
              )}
              <div>
                <label className="block text-xs text-white/50 mb-1">{t.wizard.quantity}</label>
                <input
                  type="number"
                  value={form.quantity}
                  onChange={(e) => setForm((f) => ({ ...f, quantity: Number(e.target.value) }))}
                  className="w-full bg-white/4 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white/25"
                  min={1}
                  max={10000}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(1)} className="border border-white/10 text-white/50 text-sm px-5 py-2 rounded-lg hover:border-white/25 transition-colors">Back</button>
                <button
                  onClick={buildPreview}
                  disabled={!form.campaignName || !form.businessName || saving}
                  className="bg-white text-black font-semibold text-sm px-8 py-2 rounded-lg hover:bg-white/90 disabled:opacity-30 transition-colors"
                >
                  {saving ? 'Saving…' : t.wizard.preview}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 — Preview */}
        {step === 3 && preview && (
          <div>
            <h2 className="text-lg font-semibold mb-6">{t.wizard.step3}</h2>

            {/* Save confirmation / error */}
            {savedCampaign && (
              <div className="border border-green-500/30 bg-green-500/5 rounded-xl px-4 py-3 mb-4 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-green-400/80 border border-green-500/30 rounded px-2 py-0.5">SAVED</span>
                  <span className="text-xs text-green-400/70">Campaign persisted</span>
                </div>
                <Link
                  href={`/c/${savedCampaign.namespace}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-cyan-400/70 hover:text-cyan-400 underline transition-colors"
                >
                  /c/{savedCampaign.namespace} →
                </Link>
              </div>
            )}
            {saveError && (
              <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-xl px-4 py-3 mb-4 text-xs text-yellow-400/70">
                {saveError === 'Namespace already taken'
                  ? `Namespace "${form.namespaceSlug}" is already taken — campaign preview shown without saving.`
                  : saveError}
              </div>
            )}

            <div className="border border-white/10 rounded-xl p-6 mb-6">
              <div className="text-xs font-mono text-white/30 mb-2">{form.campaignType.replace(/_/g,' ')}</div>
              <h3 className="text-xl font-bold mb-1">{preview.name}</h3>
              <div className="text-xs font-mono text-cyan-400/50 mb-3">launch.unykorn.org/c/{form.namespaceSlug}</div>
              <p className="text-sm text-white/50 mb-4">{preview.description}</p>
              {qrDataUrl ? (
                <div className="mb-4">
                  <div className="text-xs text-white/30 mb-2">QR Code</div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrDataUrl} alt="Campaign QR" width={120} height={120} className="bg-white/90 rounded p-2" />
                </div>
              ) : (
                <div className="w-24 h-24 border border-white/10 rounded flex items-center justify-center text-white/20 text-xs mb-4">QR pending</div>
              )}
              <div className="grid grid-cols-2 gap-2">
                {preview.attributes.slice(0,6).map((a) => (
                  <div key={a.trait_type} className="text-xs">
                    <span className="text-white/30">{a.trait_type}: </span>
                    <span className="text-white/60">{String(a.value)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 border border-cyan-500/20 rounded px-3 py-2 text-[10px] font-mono text-cyan-500/50">
                MAINNET READY · Set NEXT_PUBLIC_SOLANA_MAINNET_ENABLED=true · Metaplex integration via FTHTrading/solana-launcher
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="border border-white/10 text-white/50 text-sm px-5 py-2 rounded-lg hover:border-white/25 transition-colors">Back</button>
              <button onClick={() => setStep(4)} className="bg-white text-black font-semibold text-sm px-8 py-2 rounded-lg hover:bg-white/90 transition-colors">{t.cta.connectWallet}</button>
            </div>
          </div>
        )}

        {/* STEP 4 — Wallet connect */}
        {step === 4 && (
          <div>
            <h2 className="text-lg font-semibold mb-6">{t.wizard.step4}</h2>
            <div className="border border-white/10 rounded-xl p-6 mb-6">
              <div className="text-xs font-mono text-white/30 mb-4">NON-CUSTODIAL · No private keys · No seed phrases</div>
              <div className="space-y-3">
                {['Phantom', 'Solflare', 'Backpack'].map((w) => (
                  <button key={w} disabled className="w-full border border-white/10 rounded-lg px-4 py-3 text-left text-sm text-white/50 opacity-60 cursor-not-allowed flex items-center justify-between">
                    <span>{w}</span>
                    <span className="text-[10px] font-mono text-cyan-500/40">Mainnet ready · Wallet adapter pending</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-white/25 mt-4">
                Wallet adapter integration requires @solana/wallet-adapter-react. Supports mainnet-beta when NEXT_PUBLIC_SOLANA_MAINNET_ENABLED=true.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="border border-white/10 text-white/50 text-sm px-5 py-2 rounded-lg">Back</button>
              <button onClick={() => setStep(5)} className="border border-cyan-500/30 text-cyan-400 text-sm px-8 py-2 rounded-lg hover:border-cyan-500/50 transition-colors">
                Skip to Mint Preview
              </button>
            </div>
          </div>
        )}

        {/* STEP 5 — Mint */}
        {step === 5 && (
          <div>
            <h2 className="text-lg font-semibold mb-6">{t.wizard.step5}</h2>
            <div className="border border-white/10 rounded-xl p-6 mb-6">
              <div className="text-xs font-mono text-cyan-500/60 border border-cyan-500/20 rounded px-3 py-1 inline-block mb-4">
                MAINNET READY · Metaplex Integration via FTHTrading/solana-launcher
              </div>
              <h3 className="text-lg font-bold mb-2">{form.campaignName}</h3>
              <div className="text-xs font-mono text-cyan-400/40 mb-4">launch.unykorn.org/c/{form.namespaceSlug}</div>
              <p className="text-sm text-white/40 mb-4 leading-relaxed">
                Your campaign metadata and QR code are ready. The mint step connects to{' '}
                <a
                  href="https://github.com/FTHTrading/solana-launcher"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400/60 hover:text-cyan-400 underline"
                >
                  FTHTrading/solana-launcher
                </a>
                {' '}— the source-of-truth Solana minting engine for the DONK AI / TROPTIONS / UNYKORN system.
                The launcher handles wallet connect, SPL token creation, Metaplex NFT minting, and on-chain metadata.
              </p>
              <div className="border border-cyan-900/30 bg-cyan-950/20 rounded-lg p-4 mb-4 text-xs font-mono text-cyan-400/60">
                <div className="mb-1 text-white/30">Mint will call:</div>
                <div>POST https://solana-launcher.vercel.app/api/mint/nft</div>
                <div className="mt-1 text-white/20">or /api/mint/token — depending on campaign type</div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 items-start">
                <button disabled className="bg-white/10 text-white/30 font-semibold text-sm px-8 py-3 rounded-lg cursor-not-allowed">
                  {t.cta.mint} (Pending TRUST_WALLET_SECRET_KEY · Mainnet ready)
                </button>
                <a
                  href="https://solana-launcher.vercel.app/launch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 border border-cyan-500/30 text-cyan-400/70 hover:text-cyan-400 text-sm px-6 py-3 rounded-lg hover:border-cyan-500/50 transition-colors"
                >
                  Open Solana Launcher ↗
                </a>
              </div>
              <button onClick={() => setStep(1)} className="text-xs text-white/30 underline mt-4 block">Start over</button>
            </div>
            <div className="text-xs text-white/20 leading-relaxed">{t.safety.disclaimer}</div>
          </div>
        )}

        {/* AI Assistant */}
        <div className="mt-12">
          <AIAssistant mode="launch-guide" className="mb-4" />
        </div>

        {/* Safety disclaimer */}
        <div className="mt-8 border border-white/6 rounded-xl p-4 text-[10px] text-white/20 leading-relaxed">
          {t.safety.disclaimer}
        </div>

      </div>
    </div>
  );
}
