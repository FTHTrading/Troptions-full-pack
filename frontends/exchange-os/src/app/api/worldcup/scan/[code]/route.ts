import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

const DATA_DIR = process.env.WC_DATA_DIR ?? join(process.cwd(), '../../data/worldcup')
const OFFERS_FILE = join(DATA_DIR, 'offers.json')

function ensureDir() { mkdirSync(DATA_DIR, { recursive: true }) }

export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  if (!existsSync(OFFERS_FILE)) return NextResponse.json({ ok: false, error: 'No offers' }, { status: 404 })

  const data = JSON.parse(readFileSync(OFFERS_FILE, 'utf-8'))
  const offer = (data.offers as Record<string, unknown>[]).find(o => o.qr_code === code)
  if (!offer) return NextResponse.json({ ok: false, error: 'Offer not found' }, { status: 404 })

  // Log scan
  offer.scans = Number(offer.scans ?? 0) + 1
  if (!Array.isArray(offer.scan_log)) offer.scan_log = []
  ;(offer.scan_log as unknown[]).push({ at: new Date().toISOString(), ua: req.headers.get('user-agent')?.slice(0, 80) ?? null })
  data.updated_at = new Date().toISOString()
  ensureDir()
  writeFileSync(OFFERS_FILE, JSON.stringify(data, null, 2))

  return NextResponse.json({
    ok: true,
    qr_code: code,
    merchant_name: offer.merchant_name,
    title: offer.title,
    description: offer.description,
    discount_type: offer.discount_type,
    discount_value: offer.discount_value,
    terms: offer.terms,
    valid_until: offer.valid_until,
    active: offer.active,
    total_scans: offer.scans,
  })
}

// POST = mark redeemed
export async function POST(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  if (!existsSync(OFFERS_FILE)) return NextResponse.json({ ok: false, error: 'No offers' }, { status: 404 })

  const data = JSON.parse(readFileSync(OFFERS_FILE, 'utf-8'))
  const offer = (data.offers as Record<string, unknown>[]).find(o => o.qr_code === code)
  if (!offer) return NextResponse.json({ ok: false, error: 'Offer not found' }, { status: 404 })
  if (!offer.active) return NextResponse.json({ ok: false, error: 'Offer no longer active' }, { status: 410 })

  offer.redemptions = Number(offer.redemptions ?? 0) + 1
  if (!Array.isArray(offer.redemption_log)) offer.redemption_log = []
  ;(offer.redemption_log as unknown[]).push({ at: new Date().toISOString() })
  data.updated_at = new Date().toISOString()
  ensureDir()
  writeFileSync(OFFERS_FILE, JSON.stringify(data, null, 2))

  return NextResponse.json({
    ok: true,
    qr_code: code,
    redeemed: true,
    merchant_name: offer.merchant_name,
    title: offer.title,
    total_redemptions: offer.redemptions,
  })
}
