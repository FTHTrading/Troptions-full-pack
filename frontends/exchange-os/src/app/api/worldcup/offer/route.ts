import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { randomUUID } from 'crypto'

import { mkdirSync } from 'fs'
const DATA_DIR = process.env.WC_DATA_DIR ?? join(process.cwd(), '../../data/worldcup')
const MERCHANTS_FILE = join(DATA_DIR, 'merchants.json')
const OFFERS_FILE = join(DATA_DIR, 'offers.json')

function readMerchants() {
  if (!existsSync(MERCHANTS_FILE)) return { merchants: [] }
  return JSON.parse(readFileSync(MERCHANTS_FILE, 'utf-8'))
}

function readOffers() {
  if (!existsSync(OFFERS_FILE)) return { offers: [] }
  return JSON.parse(readFileSync(OFFERS_FILE, 'utf-8'))
}

function writeOffers(data: unknown) {
  mkdirSync(DATA_DIR, { recursive: true })
  writeFileSync(OFFERS_FILE, JSON.stringify(data, null, 2))
}

function writeMerchants(data: unknown) {
  mkdirSync(DATA_DIR, { recursive: true })
  writeFileSync(MERCHANTS_FILE, JSON.stringify(data, null, 2))
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const data = readOffers()
  const merchant_id = searchParams.get('merchant_id')
  const active_only = searchParams.get('active') === 'true'

  let offers = data.offers as Record<string, unknown>[]
  if (merchant_id) offers = offers.filter(o => o.merchant_id === merchant_id)
  if (active_only) offers = offers.filter(o => o.active === true)

  return NextResponse.json({ ok: true, total: offers.length, offers })
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try { body = await req.json() } catch { return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 }) }

  const {
    merchant_id,
    title,
    description,
    discount_type, // percent | fixed | bundle
    discount_value,
    match_ids,     // which matches this applies to, or "all"
    valid_from,
    valid_until,
    terms,
  } = body as Record<string, unknown>

  if (!merchant_id || !title || !discount_type || discount_value === undefined) {
    return NextResponse.json({ ok: false, error: 'merchant_id, title, discount_type, discount_value required' }, { status: 400 })
  }

  // Verify merchant exists
  const merchantData = readMerchants()
  const merchant = (merchantData.merchants as Record<string, unknown>[]).find(m => m.id === merchant_id)
  if (!merchant) {
    return NextResponse.json({ ok: false, error: 'Merchant not found' }, { status: 404 })
  }

  const qr_code = `WWAI-WC-${randomUUID().slice(0, 8).toUpperCase()}`
  const offer = {
    id: randomUUID(),
    qr_code,
    merchant_id,
    merchant_name: merchant.name,
    title,
    description: description || null,
    discount_type,
    discount_value: Number(discount_value),
    match_ids: match_ids || 'all',
    valid_from: valid_from || new Date().toISOString(),
    valid_until: valid_until || null,
    terms: terms || null,
    active: true,
    scans: 0,
    redemptions: 0,
    commission_pct: 10, // default 10% commission on redemptions
    created_at: new Date().toISOString(),
  }

  const offerData = readOffers()
  offerData.offers.push(offer)
  offerData.updated_at = new Date().toISOString()
  writeOffers(offerData)

  // Add qr ref back to merchant
  const mIdx = (merchantData.merchants as Record<string, unknown>[]).findIndex(m => m.id === merchant_id)
  if (mIdx >= 0) {
    (merchantData.merchants[mIdx] as Record<string, unknown[]>).qr_offers = 
      [...((merchantData.merchants[mIdx] as Record<string, unknown[]>).qr_offers || []), offer.id]
    writeMerchants(merchantData)
  }

  return NextResponse.json({
    ok: true,
    offer_id: offer.id,
    qr_code,
    title,
    discount_type,
    discount_value,
    scan_url: `https://troptions.com/worldcup/scan/${qr_code}`,
    qr_image_url: `/api/worldcup/qr/${qr_code}`,
  }, { status: 201 })
}
