import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const site = searchParams.get('site')
  const param = searchParams.get('param') || '00065' // Default to gage height

  if (!site) {
    return NextResponse.json({ error: 'Missing ?site= parameter' }, { status: 400 })
  }

  // Validate parameter code (00065 = gage height, 00060 = discharge)
  const validParams = ['00065', '00060']
  if (!validParams.includes(param)) {
    return NextResponse.json(
      { error: `Invalid parameter code. Use: ${validParams.join(', ')}` },
      { status: 400 }
    )
  }

  const url = `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${encodeURIComponent(
    site
  )}&parameterCd=${param}`

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 } // Cache for 60 seconds
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: `USGS API returned ${res.status}` },
        { status: res.status }
      )
    }

    const data = await res.json()

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate=120'
      }
    })
  } catch (error) {
    console.error('USGS API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch USGS data' },
      { status: 500 }
    )
  }
}
