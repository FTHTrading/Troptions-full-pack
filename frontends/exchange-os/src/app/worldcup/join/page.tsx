'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const PACKAGES = [
  {
    id: 'starter',
    name: 'Starter Listing',
    setup: 199,
    monthly: 99,
    tag: 'Get on the map',
    features: ['Map pin + business profile', '1 QR offer campaign', 'Basic analytics', '"World Cup Atlanta" badge'],
    highlight: false,
  },
  {
    id: 'verified',
    name: 'Verified Merchant',
    setup: 499,
    monthly: 199,
    tag: 'Most popular',
    features: ['Boosted placement', '3 QR offer campaigns', 'Redemption tracking', 'Full analytics dashboard', 'AI concierge inclusion'],
    highlight: true,
  },
  {
    id: 'matchday',
    name: 'Matchday Boost',
    setup: 500,
    monthly: 0,
    tag: 'Per match day',
    features: ['Featured during specific match', 'Top-of-map placement', 'Matchday traffic report', 'Social media kit'],
    highlight: false,
  },
]

const TYPES = ['Restaurant', 'Bar', 'Hotel', 'Parking', 'Transportation/Driver', 'Retail/Merch', 'Event Promoter', 'Other']

export default function WorldCupJoinPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>}>
      <WorldCupJoinInner />
    </Suspense>
  )
}

function WorldCupJoinInner() {
  const searchParams = useSearchParams()
  const cancelled = searchParams.get('cancelled') === '1'
  const [step, setStep] = useState<'package' | 'form' | 'payment' | 'done'>('package')
  const [selectedPkg, setSelectedPkg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ merchant_id: string; name: string; setup_usd: number } | null>(null)
  const [paymentMode, setPaymentMode] = useState<'stripe' | 'payment_pending' | null>(null)
  const [form, setForm] = useState({
    name: '', type: '', address: '', contact_name: '', contact_email: '', contact_phone: '', notes: ''
  })

  // Show cancelled banner if redirected back from Stripe with ?cancelled=1
  useEffect(() => {
    if (cancelled && step === 'package') {
      // stay on package step, banner shown via cancelled var
    }
  }, [cancelled, step])

  const pkg = PACKAGES.find(p => p.id === selectedPkg)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Step 1: Register the merchant
      const res = await fetch('/api/worldcup/merchant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, package: selectedPkg }),
      })
      const data = await res.json()
      if (!data.ok) { alert(data.error || 'Error submitting. Try again.'); return }
      
      setResult(data)

      // Step 2: Create Stripe checkout session
      const checkoutRes = await fetch('/api/worldcup/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchant_id: data.merchant_id, package: selectedPkg }),
      })
      const checkoutData = await checkoutRes.json()

      if (checkoutData.ok && checkoutData.mode === 'stripe' && checkoutData.checkout_url) {
        setPaymentMode('stripe')
        // Redirect to Stripe Checkout
        window.location.href = checkoutData.checkout_url
      } else {
        // Fallback: payment_pending — spot reserved, manual follow-up
        setPaymentMode('payment_pending')
        setStep('done')
      }
    } catch {
      alert('Network error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Cancelled banner */}
      {cancelled && (
        <div className="bg-yellow-900/50 border-b border-yellow-700 text-yellow-300 text-center text-sm py-3 px-6">
          Payment was cancelled — your spot is still available. Complete registration below.
        </div>
      )}
      {/* Hero */}
      <div className="bg-gradient-to-b from-green-950 to-black px-6 py-16 text-center">
        <div className="text-sm font-bold text-green-400 uppercase tracking-widest mb-4">Atlanta · World Cup 2026</div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
          Millions of fans.<br />
          <span className="text-green-400">Most can&apos;t afford a ticket.</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-6">
          They&apos;ll be in your restaurant, your bar, your hotel. TROPTIONS puts your business on the Atlanta World Cup fan map — and routes foot traffic directly to you.
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
          <span>⚽ 8 matches at Mercedes-Benz Stadium</span>
          <span>🏟️ 1 Semifinal on July 15</span>
          <span>📍 ~2M fan-events in Atlanta</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Step 1: Pick package */}
        {step === 'package' && (
          <>
            <h2 className="text-2xl font-bold text-center mb-2">Choose your package</h2>
            <p className="text-gray-400 text-center mb-10">Get on the map before the rush. First 50 businesses get priority placement.</p>
            <div className="grid md:grid-cols-3 gap-6">
              {PACKAGES.map(p => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPkg(p.id)}
                  className={`rounded-2xl border-2 p-6 cursor-pointer transition-all ${
                    selectedPkg === p.id
                      ? 'border-green-400 bg-green-950/30'
                      : p.highlight
                      ? 'border-green-700 bg-gray-900'
                      : 'border-gray-700 bg-gray-900 hover:border-gray-500'
                  }`}
                >
                  {p.highlight && (
                    <div className="bg-green-500 text-black text-xs font-black px-3 py-1 rounded-full inline-block mb-3">
                      {p.tag}
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-1">{p.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-black text-green-400">${p.setup}</span>
                    <span className="text-gray-400 text-sm ml-1">setup</span>
                    {p.monthly > 0 && (
                      <span className="text-gray-400 text-sm ml-2">+ ${p.monthly}/mo</span>
                    )}
                    {p.id === 'matchday' && (
                      <span className="text-gray-400 text-sm ml-2">per match day</span>
                    )}
                  </div>
                  <ul className="space-y-2">
                    {p.features.map((f, i) => (
                      <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                        <span className="text-green-400 mt-0.5">✓</span>{f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <button
                disabled={!selectedPkg}
                onClick={() => setStep('form')}
                className="bg-green-500 hover:bg-green-400 disabled:bg-gray-700 disabled:text-gray-500 text-black font-black px-10 py-4 rounded-xl text-lg transition-colors"
              >
                {selectedPkg ? `Continue with ${pkg?.name} →` : 'Select a package to continue'}
              </button>
            </div>
          </>
        )}

        {/* Step 2: Form */}
        {step === 'form' && pkg && (
          <div className="max-w-xl mx-auto">
            <button onClick={() => setStep('package')} className="text-gray-500 hover:text-gray-300 text-sm mb-6">← Back</button>
            <div className="bg-green-950/30 border border-green-700 rounded-xl p-4 mb-8 flex items-center justify-between">
              <div>
                <div className="font-bold text-green-400">{pkg.name}</div>
                <div className="text-sm text-gray-400">
                  ${pkg.setup} setup{pkg.monthly > 0 ? ` + $${pkg.monthly}/mo` : ''}
                </div>
              </div>
              <button onClick={() => setStep('package')} className="text-xs text-gray-500 hover:text-gray-300">Change</button>
            </div>

            <h2 className="text-2xl font-bold mb-6">Your business details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Business name *</label>
                <input
                  required value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                  placeholder="e.g. Whiskey Bird ATL"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Business type *</label>
                <select
                  required value={form.type}
                  onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                >
                  <option value="">Select type...</option>
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Address</label>
                <input
                  value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                  placeholder="Street address, Atlanta GA"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Your name *</label>
                <input
                  required value={form.contact_name}
                  onChange={e => setForm(f => ({ ...f, contact_name: e.target.value }))}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                  placeholder="First and last name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email *</label>
                  <input
                    required type="email" value={form.contact_email}
                    onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                    placeholder="you@yourbiz.com"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Phone</label>
                  <input
                    type="tel" value={form.contact_phone}
                    onChange={e => setForm(f => ({ ...f, contact_phone: e.target.value }))}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                    placeholder="404-000-0000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Anything else? (optional)</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  rows={2}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 resize-none"
                  placeholder="Specific match days, special offers, questions..."
                />
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full bg-green-500 hover:bg-green-400 disabled:bg-gray-700 text-black font-black py-4 rounded-xl text-lg transition-colors mt-2"
              >
                {loading ? 'Reserving spot...' : `Reserve & Pay — $${pkg.setup} setup`}
              </button>
              <p className="text-center text-xs text-gray-500 mt-2">
                You&apos;ll be taken to secure payment after submitting. We use Stripe.
              </p>
            </form>
          </div>
        )}

        {/* Step 3: Done */}
        {step === 'done' && result && (
          <div className="max-w-lg mx-auto text-center py-12">
            <div className="text-6xl mb-6">⚽</div>
            <h2 className="text-3xl font-black mb-4 text-green-400">You&apos;re on the list.</h2>
            <p className="text-gray-300 mb-2 text-lg">
              <span className="font-bold text-white">{result.name}</span> is now registered.
            </p>
            {paymentMode === 'payment_pending' ? (
              <div className="bg-yellow-900/30 border border-yellow-700 rounded-xl p-4 mb-8 text-sm text-yellow-300">
                <p className="font-bold mb-1">Payment link coming within 24 hours</p>
                <p>Your spot is reserved. We&apos;ll send your ${result.setup_usd} payment link to your email.</p>
              </div>
            ) : (
              <p className="text-gray-400 mb-8">
                Setup fee of ${result.setup_usd} collected. We&apos;ll activate your World Cup listing within 24 hours.
              </p>
            )}
            <div className="bg-gray-900 rounded-xl p-4 text-left text-sm text-gray-400 mb-8">
              <div>Reference ID: <span className="text-white font-mono">{result.merchant_id.slice(0, 8).toUpperCase()}</span></div>
              <div className="mt-2">Signup URL: <span className="text-green-400">troptions.com/worldcup/join</span></div>
            </div>
            <p className="text-xs text-gray-600">Questions? <a href="mailto:merchants@troptions.com" className="text-green-400">merchants@troptions.com</a></p>
          </div>
        )}

        {/* Social proof strip */}
        {step === 'package' && (
          <div className="mt-16 border-t border-gray-800 pt-10">
            <div className="grid md:grid-cols-3 gap-8 text-center text-sm">
              <div>
                <div className="text-2xl font-black text-green-400 mb-1">8</div>
                <div className="text-gray-400">World Cup matches in Atlanta</div>
              </div>
              <div>
                <div className="text-2xl font-black text-green-400 mb-1">~2M</div>
                <div className="text-gray-400">Fan-events in Atlanta corridor</div>
              </div>
              <div>
                <div className="text-2xl font-black text-green-400 mb-1">$500+</div>
                <div className="text-gray-400">Average resale ticket price — fans will eat & watch instead</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
