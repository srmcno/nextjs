import { NextResponse } from 'next/server'
import { getMockData } from '@/lib/mockData'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const site = searchParams.get('site')
  const param = searchParams.get('param') || '00065' // Default to gage height
  const useMock = searchParams.get('mock') === 'true'

  if (!site) {
    return NextResponse.json({ error: 'Missing ?site= parameter' }, { status: 400 })
  }

  // Validate parameter code (00065 = gage height, 00060 = discharge, 62614 = reservoir elevation NGVD29)
  const validParams = ['00065', '00060', '62614']
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
    // Try to fetch real data first (with timeout)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    const res = await fetch(url, {
      next: { revalidate: 60 }, // Cache for 60 seconds
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!res.ok) {
      throw new Error(`USGS API returned ${res.status}`)
    }

    const data = await res.json()

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate=120',
        'X-Data-Source': 'usgs-live'
      }
    })
  } catch (error) {
    console.error('USGS API error, falling back to mock data:', error)

    // Fallback to mock data
    const mockData = getMockData(site, param)

    if (mockData) {
      return NextResponse.json(mockData, {
        headers: {
          'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
          'X-Data-Source': 'mock-demo'
        }
      })
    }

    return NextResponse.json(
      { error: 'Failed to fetch USGS data and no mock data available' },
      { status: 500 }
    )
  }
}
