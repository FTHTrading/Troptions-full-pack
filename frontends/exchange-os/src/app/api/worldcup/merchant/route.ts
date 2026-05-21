import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { randomUUID } from 'crypto'

// Local dev: C:/Users/Kevan/data/worldcup/ — Vercel: /tmp/worldcup/
const DATA_DIR = process.env.WC_DATA_DIR ?? join(process.cwd(), '../../data/worldcup')
const DATA_FILE = join(DATA_DIR, 'merchants.json')

function readData() {
  if (!existsSync(DATA_FILE)) return { merchants: [], packages: {} }
  return JSON.parse(readFileSync(DATA_FILE, 'utf-8'))
}

function writeData(data: unknown) {
  mkdirSync(dirname(DATA_FILE), { recursive: true })
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const data = readData()
  const pkg = searchParams.get('package')
  const merchants = pkg
    ? data.merchants.filter((m: Record<string, unknown>) => m.package === pkg)
    : data.merchants
  return NextResponse.json({
    ok: true,
    total: merchants.length,
    packages: data.packages,
    merchants,
  })
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try { body = await req.json() } catch { return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 }) }

  const { name, type, address, contact_name, contact_email, contact_phone, package: pkg, notes } = body as Record<string, string>
  if (!name || !type || !pkg) {
    return NextResponse.json({ ok: false, error: 'name, type, package required' }, { status: 400 })
  }

  const validPackages = ['starter', 'verified', 'matchday', 'sponsor']
  if (!validPackages.includes(pkg)) {
    return NextResponse.json({ ok: false, error: `package must be one of: ${validPackages.join(', ')}` }, { status: 400 })
  }

  const data = readData()
  const packages = data.packages as Record<string, Record<string, unknown>>
  const pkgMeta = packages[pkg]

  const merchant = {
    id: randomUUID(),
    name,
    type, // restaurant | bar | hotel | parking | driver | vendor | promoter | other
    address: address || null,
    contact_name: contact_name || null,
    contact_email: contact_email || null,
    contact_phone: contact_phone || null,
    package: pkg,
    setup_usd: pkgMeta?.setup_usd ?? 0,
    monthly_usd: pkgMeta?.monthly_usd ?? 0,
    status: 'PENDING', // PENDING | ACTIVE | PAUSED | CANCELLED
    registered_at: new Date().toISOString(),
    activated_at: null,
    qr_offers: [],
    notes: notes || null,
    payment_rail: 'x402',
    x402_quote_id: null,
    stripe_fallback: false,
  }

  data.merchants.push(merchant)
  data.updated_at = new Date().toISOString()
  writeData(data)

  return NextResponse.json({
    ok: true,
    merchant_id: merchant.id,
    name: merchant.name,
    package: pkg,
    setup_usd: merchant.setup_usd,
    monthly_usd: merchant.monthly_usd,
    status: merchant.status,
    next_step: `Create x402 quote for $${merchant.setup_usd} setup fee`,
  }, { status: 201 })
}
