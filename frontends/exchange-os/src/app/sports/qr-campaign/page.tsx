"use client";
import Link from "next/link";
import { SAFETY_DISCLAIMER } from "@/data/merchant-campaigns";
import LanguageSelector from "@/components/i18n/LanguageSelector";
import AIAssistant from "@/components/ai/AIAssistant";

const QR_USES = [
  { label: "Loyalty reward",       desc: "Customer scans and earns points, stamps, or a reward" },
  { label: "NFT coupon",           desc: "Scan to claim a collectible coupon or discount" },
  { label: "VIP pass",             desc: "Scan for event access, merchant perk, or fan recognition" },
  { label: "Fan tribute",          desc: "Scan to view community tribute and claim collectible" },
  { label: "Sponsor offer",        desc: "Brand scans placed inside fan tributes or merchant moments" },
  { label: "Local giveaway",       desc: "Scan to enter a community giveaway or prize draw" },
  { label: "Event promo",          desc: "Scan at venue to activate event offer or access perk" },
];

export default function QrCampaignPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <Link href="/sports" className="font-bold text-white tracking-tight">TROPTIONS</Link>
        <div className="flex items-center gap-4 text-sm text-white/60">
          <Link href="/sports/merchant" className="text-white/60 hover:text-white">Merchant Kit</Link>
          <Link href="/sports/tribute" className="text-white/60 hover:text-white">Fan Tribute</Link>
          <Link href="/sports/qr-campaign" className="text-white">QR Campaign</Link>
          <Link href="/sports/solana-launcher" className="text-cyan-400/70 hover:text-cyan-400">Solana Launcher</Link>
          <LanguageSelector compact />
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-block text-xs font-mono text-white/40 border border-white/15 rounded px-3 py-1 mb-6">
          Scan. Engage. Reward. — No gambling · No betting · No prediction markets
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Customer scans QR.<br />Customer gets rewarded.
        </h1>
        <p className="text-lg text-white/60 mb-8 max-w-2xl mx-auto">
          Create a QR campaign in minutes. Loyalty rewards, NFT coupons, VIP passes, fan tributes, giveaways, and sponsor offers — all from one QR code.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/sports/demo"
            className="bg-white text-black font-semibold px-8 py-3 rounded-lg hover:bg-white/90 transition-colors"
          >
            Create QR Campaign
          </Link>
          <Link
            href="/sports/merchant"
            className="border border-white/20 text-white px-8 py-3 rounded-lg hover:border-white/40 transition-colors"
          >
            Get Full Merchant Kit
          </Link>
        </div>
      </section>

      {/* Use cases */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-xl font-semibold mb-6">What your QR campaign can deliver</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {QR_USES.map((u) => (
            <div key={u.label} className="border border-white/10 rounded-xl p-5">
              <h3 className="font-medium text-sm mb-1">{u.label}</h3>
              <p className="text-xs text-white/50">{u.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-xl font-semibold mb-8">How it works</h2>
        <div className="space-y-3">
          {[
            { step: 1, label: "Choose offer type", detail: "Loyalty reward, coupon, VIP pass, tribute, giveaway, or sponsor offer" },
            { step: 2, label: "Set up offer details", detail: "Name, description, value, expiry, and branding" },
            { step: 3, label: "Generate QR code", detail: "Unique QR links to your campaign landing page" },
            { step: 4, label: "Deploy", detail: "Print, share digitally, place at venue, or embed in fan tribute" },
            { step: 5, label: "Track and deliver", detail: "See scans, deliver rewards, generate proof of campaign" },
          ].map((s) => (
            <div key={s.step} className="flex gap-4 items-start border border-white/10 rounded-lg p-4">
              <span className="text-2xl font-bold text-white/20 tabular-nums w-8 shrink-0">{s.step}</span>
              <div>
                <div className="font-medium text-sm">{s.label}</div>
                <div className="text-xs text-white/50 mt-1">{s.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI assistant + Solana CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-10">
        <AIAssistant mode="merchant" className="mb-6" />
        <div className="border border-cyan-900/30 rounded-xl p-5 text-center">
          <p className="text-xs text-white/40 mb-3 font-mono">Mint your QR campaign as a Solana campaign asset</p>
          <Link href="/sports/solana-launcher" className="inline-block bg-white text-black font-semibold text-sm px-8 py-3 rounded-lg hover:bg-white/90 transition-colors">
            Open Solana Campaign Launcher →
          </Link>
        </div>
      </section>

      {/* Disclaimer */}
      <footer className="max-w-4xl mx-auto px-6 pb-16">
        <div className="border border-white/8 rounded-xl p-4 text-xs text-white/25 leading-relaxed">
          {SAFETY_DISCLAIMER}
        </div>
      </footer>
    </div>
  );
}
