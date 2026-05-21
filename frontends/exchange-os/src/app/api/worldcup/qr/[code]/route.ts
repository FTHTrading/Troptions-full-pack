import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'

export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const format = new URL(req.url).searchParams.get('format') || 'svg'

  const scanUrl = `https://troptions.com/worldcup/scan/${code}`

  try {
    if (format === 'png') {
      const buf = await QRCode.toBuffer(scanUrl, {
        type: 'png',
        width: 400,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' },
      })
      return new Response(buf.buffer as ArrayBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=86400',
          'Content-Disposition': `inline; filename="${code}.png"`,
        },
      })
    }

    // Default: SVG
    const svg = await QRCode.toString(scanUrl, {
      type: 'svg',
      width: 300,
      margin: 2,
    })
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
