'use client'

import { useEffect, useState } from 'react'

interface OfferData {
  ok: boolean
  qr_code: string
  merchant_name: string
  title: string
  description: string | null
  discount_type: string
  discount_value: number
  terms: string | null
  valid_until: string | null
  active: boolean
  total_scans: number
}

export default function ScanPage({ params }: { params: Promise<{ code: string }> }) {
  const [code, setCode] = useState<string | null>(null)
  const [offer, setOffer] = useState<OfferData | null>(null)
  const [loading, setLoading] = useState(true)
  const [redeemed, setRedeemed] = useState(false)
  const [redeeming, setRedeeming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    params.then(p => setCode(p.code))
  }, [params])

  useEffect(() => {
    if (!code) return
    fetch(`/api/worldcup/scan/${code}`)
      .then(r => r.json())
      .then(d => { setOffer(d); setLoading(false) })
      .catch(() => { setError('Could not load offer.'); setLoading(false) })
  }, [code])

  const handleRedeem = async () => {
    if (!code) return
    setRedeeming(true)
    try {
      const res = await fetch(`/api/worldcup/scan/${code}`, { method: 'POST' })
      const d = await res.json()
      if (d.ok) setRedeemed(true)
      else setError(d.error || 'Redemption failed.')
    } catch {
      setError('Network error.')
    } finally {
      setRedeeming(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-gray-400">Loading offer...</div>
      </div>
    )
  }

  if (!offer?.ok || error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <h1 className="text-xl font-bold text-red-400 mb-2">Offer not found</h1>
          <p className="text-gray-400 text-sm">{error || 'This QR code may have expired or is invalid.'}</p>
        </div>
      </div>
    )
  }

  if (!offer.active) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-4xl mb-4">⏰</div>
          <h1 className="text-xl font-bold text-yellow-400 mb-2">Offer expired</h1>
          <p className="text-gray-400 text-sm">This World Cup offer is no longer active.</p>
          <p className="text-gray-600 text-xs mt-2">{offer.merchant_name}</p>
        </div>
      </div>
    )
  }

  const discountLabel = offer.discount_type === 'percent'
    ? `${offer.discount_value}% off`
    : offer.discount_type === 'fixed'
    ? `$${offer.discount_value} off`
    : offer.title

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">⚽</div>
          <div className="text-xs font-bold text-green-400 uppercase tracking-widest mb-1">World Cup Atlanta 2026</div>
          <div className="text-lg font-bold text-gray-300">{offer.merchant_name}</div>
        </div>

        {/* Offer card */}
        <div className="bg-gradient-to-b from-green-950 to-gray-900 border-2 border-green-500 rounded-2xl p-6 mb-6 text-center shadow-lg shadow-green-900/30">
          <h1 className="text-2xl font-black mb-2">{offer.title}</h1>
          <div className="text-4xl font-black text-green-400 mb-3">{discountLabel}</div>
          {offer.description && (
            <p className="text-gray-300 text-sm mb-3">{offer.description}</p>
          )}
          {offer.valid_until && (
            <p className="text-xs text-gray-500">
              Valid until: {new Date(offer.valid_until).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Redeem / redeemed state */}
        {redeemed ? (
          <div className="bg-green-900/40 border border-green-500 rounded-xl p-6 text-center mb-4">
            <div className="text-3xl mb-2">✅</div>
            <h2 className="text-xl font-black text-green-400 mb-1">Redeemed!</h2>
            <p className="text-gray-300 text-sm">Show this screen to staff to claim your offer.</p>
          </div>
        ) : (
          <button
            onClick={handleRedeem}
            disabled={redeeming}
            className="w-full bg-green-500 hover:bg-green-400 disabled:bg-gray-700 text-black font-black py-4 rounded-xl text-xl transition-colors mb-4"
          >
            {redeeming ? 'Redeeming...' : 'Tap to Redeem'}
          </button>
        )}

        {offer.terms && (
          <p className="text-center text-xs text-gray-600 mt-2">{offer.terms}</p>
        )}

        {/* QR code info */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-700">Code: {offer.qr_code}</p>
          <p className="text-xs text-gray-700 mt-1">Scans: {offer.total_scans}</p>
        </div>

        <div className="text-center mt-6">
          <a href="https://troptions.com/worldcup" className="text-xs text-green-700 hover:text-green-400">
            troptions.com/worldcup
          </a>
        </div>
      </div>
    </div>
  )
}
