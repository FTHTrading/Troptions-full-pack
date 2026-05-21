import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

const DATA_DIR = process.env.WC_DATA_DIR ?? join(process.cwd(), '../../data/worldcup')
const MERCHANTS_FILE = join(DATA_DIR, 'merchants.json')

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ ok: false, error: 'Stripe not configured' }, { status: 400 })
  }

  const body = await req.text()
  const sig = req.headers.get('stripe-signature')
  if (!sig) return NextResponse.json({ ok: false, error: 'No signature' }, { status: 400 })

  try {
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(stripeKey, { apiVersion: '2026-04-22.dahlia' })

    let event: import('stripe').Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } catch {
      return NextResponse.json({ ok: false, error: 'Invalid signature' }, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as import('stripe').Stripe.Checkout.Session
      const merchant_id = session.metadata?.merchant_id
      const pkg = session.metadata?.package

      if (merchant_id && existsSync(MERCHANTS_FILE)) {
        mkdirSync(DATA_DIR, { recursive: true })
        const data = JSON.parse(readFileSync(MERCHANTS_FILE, 'utf-8'))
        const merchant = data.merchants?.find((m: Record<string, string>) => m.id === merchant_id)
        if (merchant) {
          merchant.payment_status = 'paid'
          merchant.status = 'paid'
          merchant.stripe_session_id = session.id
          merchant.paid_at = new Date().toISOString()
          merchant.paid_amount_usd = (session.amount_total ?? 0) / 100
          merchant.package = pkg || merchant.package
          data.updated_at = new Date().toISOString()
          writeFileSync(MERCHANTS_FILE, JSON.stringify(data, null, 2))
        }
      }
    }

    return NextResponse.json({ ok: true, received: true })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
