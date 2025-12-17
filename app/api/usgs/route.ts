import { NextResponse } from 'next/server'
import { getMockData } from '@/lib/mockData'

// Parameter code descriptions for better error messages
const PARAMETER_CODES = {
  '00065': 'Gage Height (ft)',
  '00060': 'Discharge (cfs)',
  '62614': 'Reservoir Elevation, NGVD29 (ft)'
} as const

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const site = searchParams.get('site')
  const param = searchParams.get('param') || '00065' // Default to gage height
  const useMock = searchParams.get('mock') === 'true'

  if (!site) {
    return NextResponse.json(
      { error: 'Missing required parameter', details: 'Site ID is required (?site=XXXXXXXX)' },
      { status: 400 }
    )
  }

  // Validate parameter code
  const validParams = Object.keys(PARAMETER_CODES)
  if (!validParams.includes(param)) {
    return NextResponse.json(
      {
        error: 'Invalid parameter code',
        details: `Use one of: ${validParams.join(', ')}`,
        parameterCodes: PARAMETER_CODES
      },
      { status: 400 }
    )
  }

  // Force mock data if requested
  if (useMock) {
    const mockData = getMockData(site, param)
    if (mockData) {
      return NextResponse.json(mockData, {
        headers: {
          'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
          'X-Data-Source': 'mock-demo',
          'X-Data-Reason': 'mock-requested'
        }
      })
    }
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
      console.warn(`USGS API error: ${res.status} ${res.statusText} for site ${site}`)
      throw new Error(`USGS API returned ${res.status}`)
    }

    const data = await res.json()

    // Check if we got valid data
    if (!data?.value?.timeSeries || data.value.timeSeries.length === 0) {
      console.warn(`No data available from USGS for site ${site}, param ${param}`)
      throw new Error('No data available from USGS API')
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate=120',
        'X-Data-Source': 'usgs-live',
        'X-Site-ID': site,
        'X-Parameter': param
      }
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(`USGS API error for site ${site}: ${errorMessage}. Falling back to mock data.`)

    // Fallback to mock data
    const mockData = getMockData(site, param)

    if (mockData) {
      return NextResponse.json(mockData, {
        headers: {
          'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
          'X-Data-Source': 'mock-demo',
          'X-Data-Reason': errorMessage.includes('403') ? 'usgs-blocked' : 'usgs-unavailable',
          'X-Site-ID': site,
          'X-Parameter': param
        }
      })
    }

    return NextResponse.json(
      {
        error: 'Data unavailable',
        details: 'Failed to fetch USGS data and no mock data available',
        site,
        parameter: param,
        parameterName: PARAMETER_CODES[param as keyof typeof PARAMETER_CODES]
      },
      { status: 503 }
    )
  }
}
