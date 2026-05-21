'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

export default function JoinSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>}>
      <SuccessInner />
    </Suspense>
  )
}

function SuccessInner() {
  const params = useSearchParams()
  const merchantId = params.get('merchant_id')

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-6">🏆</div>
        <h1 className="text-3xl font-black mb-4 text-green-400">Payment received.</h1>
        <p className="text-gray-300 mb-2 text-lg">Your World Cup merchant listing is confirmed.</p>
        <p className="text-gray-400 mb-8 text-sm">We&apos;ll activate your QR offer campaign and merchant profile within 24 hours. Check your email for next steps.</p>

        {merchantId && (
          <div className="bg-gray-900 rounded-xl p-4 text-left text-sm text-gray-400 mb-8">
            <div>Reference: <span className="text-white font-mono">{merchantId.slice(0, 8).toUpperCase()}</span></div>
          </div>
        )}

        <div className="space-y-3 text-sm text-gray-500">
          <p>Questions? <a href="mailto:merchants@troptions.com" className="text-green-400 hover:underline">merchants@troptions.com</a></p>
          <p><a href="https://troptions.com/worldcup/join" className="text-green-700 hover:text-green-400">← Back to merchant signup</a></p>
        </div>
      </div>
    </div>
  )
}
