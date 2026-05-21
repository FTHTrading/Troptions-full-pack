"use client";
import Link from "next/link";
import { FAN_TRIBUTE_TEMPLATES, FAN_TRIBUTE_FLOW, FAN_TRIBUTE_DISCLAIMER } from "@/data/fan-tributes";
import LanguageSelector from "@/components/i18n/LanguageSelector";
import AIAssistant from "@/components/ai/AIAssistant";

export default function FanTributePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <Link href="/sports" className="font-bold text-white tracking-tight">TROPTIONS</Link>
        <div className="flex items-center gap-4 text-sm text-white/60">
          <Link href="/sports/merchant" className="text-white/60 hover:text-white">Merchant Kit</Link>
          <Link href="/sports/tribute" className="text-white">Fan Tribute</Link>
          <Link href="/sports/qr-campaign" className="text-white/60 hover:text-white">QR Campaign</Link>
          <Link href="/sports/solana-launcher" className="text-cyan-400/70 hover:text-cyan-400">Solana Launcher</Link>
          <LanguageSelector compact />
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-block text-xs font-mono text-white/40 border border-white/15 rounded px-3 py-1 mb-6">
          Fan + Community · No prediction markets · No gambling
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Create a fan tribute, community reward,<br />or commemorative campaign.
        </h1>
        <p className="text-lg text-white/60 mb-8 max-w-2xl mx-auto">
          Celebrate your team, city, or moment — forever. QR code, collectible coupon, VIP access, and optional sponsor tie-in. No betting, no prediction markets, no gambling.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/sports/demo"
            className="bg-white text-black font-semibold px-8 py-3 rounded-lg hover:bg-white/90 transition-colors"
          >
            Create Fan Tribute
          </Link>
          <Link
            href="/sports/merchant"
            className="border border-white/20 text-white px-8 py-3 rounded-lg hover:border-white/40 transition-colors"
          >
            Merchant Launch Kit
          </Link>
        </div>
      </section>

      {/* Templates */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-xl font-semibold mb-6">Tribute templates</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {FAN_TRIBUTE_TEMPLATES.map((t) => (
            <div key={t.id} className="border border-white/10 rounded-xl p-5">
              <div className="text-xs font-mono text-white/40 mb-2">{t.community}</div>
              <h3 className="font-semibold text-sm mb-2">{t.tributeName}</h3>
              <p className="text-xs text-white/50 mb-4">{t.message}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {t.qrCampaign && (
                  <span className="text-xs border border-white/15 rounded px-2 py-0.5 text-white/40">QR</span>
                )}
                {t.couponOrPass !== "none" && (
                  <span className="text-xs border border-white/15 rounded px-2 py-0.5 text-white/40">{t.couponOrPass.replace(/_/g, " ")}</span>
                )}
                {t.sponsorTieIn && (
                  <span className="text-xs border border-white/15 rounded px-2 py-0.5 text-white/40">sponsor slot</span>
                )}
              </div>
              <Link
                href="/sports/demo"
                className="inline-block border border-white/15 text-xs text-white/60 px-4 py-2 rounded-lg hover:border-white/30 transition-colors"
              >
                Use template
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Build flow */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-xl font-semibold mb-8">Build your fan tribute</h2>
        <div className="space-y-3">
          {FAN_TRIBUTE_FLOW.map((s) => (
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
        <AIAssistant mode="fan" className="mb-6" />
        <div className="border border-cyan-900/30 rounded-xl p-5 text-center">
          <p className="text-xs text-white/40 mb-3 font-mono">Mint your fan tribute as a Solana campaign asset</p>
          <Link href="/sports/solana-launcher" className="inline-block bg-white text-black font-semibold text-sm px-8 py-3 rounded-lg hover:bg-white/90 transition-colors">
            Open Solana Campaign Launcher →
          </Link>
        </div>
      </section>

      {/* Disclaimer */}
      <footer className="max-w-4xl mx-auto px-6 pb-16">
        <div className="border border-white/8 rounded-xl p-4 text-xs text-white/25 leading-relaxed">
          {FAN_TRIBUTE_DISCLAIMER}
        </div>
      </footer>
    </div>
  );
}
