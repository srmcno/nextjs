import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const site = searchParams.get('site')

  if (!site) {
    return NextResponse.json({ error: 'Missing ?site=' }, { status: 400 })
  }

  // 00065 = Gage height (water level). You can add 00060 for discharge later.
  const url = `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${encodeURIComponent(
    site
  )}&parameterCd=00065`

  const res = await fetch(url, { cache: 'no-store' })
  const data = await res.json()

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 's-maxage=60, stale-while-revalidate=120'
    }
  })
}
