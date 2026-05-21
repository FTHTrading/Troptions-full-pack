import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const DATA_DIR = process.env.WC_DATA_DIR ?? join(process.cwd(), '../../data/worldcup')
const MERCHANTS_FILE = join(DATA_DIR, 'merchants.json')

const PACKAGE_PRICES: Record<string, { setup: number; monthly: number; label: string }> = {
  starter: { setup: 199, monthly: 99, label: 'Starter Listing — World Cup Atlanta' },
  verified: { setup: 499, monthly: 199, label: 'Verified Merchant — World Cup Atlanta' },
  matchday: { setup: 500, monthly: 0, label: 'Matchday Boost — World Cup Atlanta' },
  sponsor: { setup: 5000, monthly: 0, label: 'Sponsor Package — World Cup Atlanta' },
}

export async function POST(req: NextRequest) {
  let body: Record<string, string>
  try { body = await req.json() } catch { return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 }) }

  const { merchant_id, package: pkg, success_url, cancel_url } = body
  if (!merchant_id || !pkg) {
    return NextResponse.json({ ok: false, error: 'merchant_id and package required' }, { status: 400 })
  }

  const pkgMeta = PACKAGE_PRICES[pkg]
  if (!pkgMeta) {
    return NextResponse.json({ ok: false, error: 'Invalid package' }, { status: 400 })
  }

  // Verify merchant exists
  let merchantName = 'World Cup Merchant'
  if (existsSync(MERCHANTS_FILE)) {
    const data = JSON.parse(readFileSync(MERCHANTS_FILE, 'utf-8'))
    const m = data.merchants?.find((x: Record<string, string>) => x.id === merchant_id)
    if (!m) return NextResponse.json({ ok: false, error: 'Merchant not found' }, { status: 404 })
    merchantName = m.name
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    // Graceful fallback — no Stripe configured
    return NextResponse.json({
      ok: true,
      mode: 'payment_pending',
      merchant_id,
      package: pkg,
      amount_usd: pkgMeta.setup,
      message: 'Payment link will be sent via email. Your spot is reserved.',
      status: 'PAYMENT_PENDING',
    })
  }

  try {
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(stripeKey, { apiVersion: '2026-04-22.dahlia' })

    const origin = req.headers.get('origin') || 'https://troptions.com'
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: pkgMeta.label,
              description: `World Cup Atlanta 2026 — ${merchantName} — ${pkg} package`,
              metadata: { merchant_id, package: pkg },
            },
            unit_amount: pkgMeta.setup * 100,
          },
          quantity: 1,
        },
      ],
      metadata: { merchant_id, package: pkg, merchant_name: merchantName },
      success_url: success_url || `${origin}/worldcup/join/success?session_id={CHECKOUT_SESSION_ID}&merchant_id=${merchant_id}`,
      cancel_url: cancel_url || `${origin}/worldcup/join?cancelled=1`,
      payment_intent_data: {
        metadata: { merchant_id, package: pkg, merchant_name: merchantName },
      },
    })

    return NextResponse.json({
      ok: true,
      mode: 'stripe',
      checkout_url: session.url,
      session_id: session.id,
      amount_usd: pkgMeta.setup,
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    // Stripe error — still allow payment_pending fallback
    return NextResponse.json({
      ok: true,
      mode: 'payment_pending',
      merchant_id,
      package: pkg,
      amount_usd: pkgMeta.setup,
      message: 'Payment link will be sent manually. Your spot is reserved.',
      stripe_error: msg,
      status: 'PAYMENT_PENDING',
    })
  }
}
