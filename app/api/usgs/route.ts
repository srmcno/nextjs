import { NextResponse } from 'next/server'
import { getMockData } from '../../../lib/mockData'

// Official USGS Water Services API
const USGS_BASE_URL = 'https://waterservices.usgs.gov/nwis/iv/'

const MAX_RETRIES = 2
const RETRY_DELAY_MS = 800
const FETCH_TIMEOUT_MS = 8000

async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<Response> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 300 } // Cache for 5 minutes
    })

    clearTimeout(timeoutId)
    return res
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS))
      return fetchWithRetry(url, retries - 1)
    }
    throw error
  }
}

function mockResponse(site: string, reason: 'unavailable' | 'error' | 'empty') {
  const mock = getMockData(site)
  if (!mock) {
    return NextResponse.json(
      { error: 'Data unavailable', site, reason },
      { status: 503, headers: { 'X-Data-Source': 'usgs-unavailable' } }
    )
  }

  return NextResponse.json(mock, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      'X-Data-Source': 'mock-demo',
      'X-Site-ID': site,
      'X-Fallback-Reason': reason
    }
  })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const site = searchParams.get('site')
  const param = searchParams.get('param')

  if (!site) {
    return NextResponse.json({ error: 'Missing site parameter' }, { status: 400 })
  }

  const url = new URL(USGS_BASE_URL)
  url.searchParams.set('format', 'json')
  url.searchParams.set('sites', site)
  url.searchParams.set('period', 'P7D')
  if (param) url.searchParams.set('parameterCd', param)
  url.searchParams.set('siteStatus', 'all')

  try {
    const res = await fetchWithRetry(url.toString())

    if (!res.ok) {
      console.error(`USGS API returned ${res.status} for site ${site}`)
      return mockResponse(site, 'error')
    }

    const data = await res.json()
    const hasValues = Boolean(
      data?.value?.timeSeries?.[0]?.values?.[0]?.value?.length
    )
    if (!hasValues) {
      return mockResponse(site, 'empty')
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'X-Data-Source': 'usgs-live',
        'X-Site-ID': site
      }
    })
  } catch (error) {
    console.error(`USGS fetch failed for site ${site}:`, error)
    return mockResponse(site, 'unavailable')
  }
}
