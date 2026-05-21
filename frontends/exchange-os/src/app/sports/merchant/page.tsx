"use client";
import Link from "next/link";
import { MERCHANT_PRODUCTS, CAMPAIGN_STEPS, CAMPAIGN_TYPES, SAFETY_DISCLAIMER } from "@/data/merchant-campaigns";
import { DONK_HERO } from "@/data/donk-products";
import LanguageSelector from "@/components/i18n/LanguageSelector";
import AIAssistant from "@/components/ai/AIAssistant";

export default function MerchantLaunchKitPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <Link href="/sports" className="font-bold text-white tracking-tight">TROPTIONS</Link>
        <div className="flex items-center gap-4 text-sm text-white/60">
          <Link href="/sports/merchant" className="text-white">Merchant Kit</Link>
          <Link href="/sports/tribute" className="text-white/60 hover:text-white">Fan Tribute</Link>
          <Link href="/sports/qr-campaign" className="text-white/60 hover:text-white">QR Campaign</Link>
          <Link href="/sports/solana-launcher" className="text-cyan-400/70 hover:text-cyan-400">Solana Launcher</Link>
          <Link href="/exchange-os" className="text-white/60 hover:text-white">Exchange OS</Link>
          <LanguageSelector compact />
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-block text-xs font-mono text-white/40 border border-white/15 rounded px-3 py-1 mb-6">
          DONK AI powered by TROPTIONS · Local Business Activation
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          {DONK_HERO.headline}
        </h1>
        <p className="text-lg text-white/60 mb-8 max-w-2xl mx-auto">
          {DONK_HERO.subline}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/sports/merchant#kit"
            className="bg-white text-black font-semibold px-8 py-3 rounded-lg hover:bg-white/90 transition-colors"
          >
            Launch My Merchant Campaign
          </Link>
          <Link
            href="/sports/tribute"
            className="border border-white/20 text-white px-8 py-3 rounded-lg hover:border-white/40 transition-colors"
          >
            Create Fan Tribute
          </Link>
        </div>
        <p className="text-xs text-white/30 mt-6">{DONK_HERO.disclaimer}</p>
      </section>

      {/* Campaign types */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-xl font-semibold mb-6 text-center">Campaign types</h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {CAMPAIGN_TYPES.map((ct) => (
            <div
              key={ct.id}
              className="border border-white/10 rounded-lg p-3 text-center text-xs text-white/60 hover:border-white/25 transition-colors"
            >
              {ct.label}
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section id="kit" className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-xl font-semibold mb-8">Products</h2>
        <div className="space-y-6">
          {MERCHANT_PRODUCTS.map((product) => (
            <div key={product.id} className="border border-white/10 rounded-xl p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-xs text-white/40 font-mono">{product.campaignType.replace(/_/g, " ")}</span>
                  <h3 className="text-lg font-semibold mt-1">{product.name}</h3>
                  <p className="text-white/60 text-sm mt-1">{product.tagline}</p>
                </div>
                {product.price && (
                  <span className="text-sm font-mono text-white/50 whitespace-nowrap ml-4">{product.price}</span>
                )}
              </div>
              <p className="text-sm text-white/50 mb-4">{product.description}</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 mb-4">
                {product.features.map((f, i) => (
                  <li key={i} className="text-xs text-white/40 flex items-center gap-2">
                    <span className="text-white/20">—</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/sports/demo"
                className="inline-block border border-white/20 text-white text-sm px-5 py-2 rounded-lg hover:border-white/40 transition-colors"
              >
                {product.cta}
              </Link>
              <p className="text-xs text-white/20 mt-3">{product.disclaimer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-xl font-semibold mb-8">How it works</h2>
        <div className="space-y-3">
          {CAMPAIGN_STEPS.map((s) => (
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

      {/* AI assistant + Solana launcher CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-10">
        <AIAssistant mode="merchant" className="mb-6" />
        <div className="border border-cyan-900/30 rounded-xl p-5 text-center">
          <p className="text-xs text-white/40 mb-3 font-mono">Ready to mint your campaign asset on Solana?</p>
          <Link href="/sports/solana-launcher" className="inline-block bg-white text-black font-semibold text-sm px-8 py-3 rounded-lg hover:bg-white/90 transition-colors">
            Open Solana Campaign Launcher →
          </Link>
        </div>
      </section>

      {/* Safety disclaimer */}
      <footer className="max-w-4xl mx-auto px-6 pb-16">
        <div className="border border-white/8 rounded-xl p-4 text-xs text-white/25 leading-relaxed">
          {SAFETY_DISCLAIMER}
        </div>
      </footer>
    </div>
  );
}
