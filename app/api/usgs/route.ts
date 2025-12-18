import { NextResponse } from 'next/server'

// Official USGS Water Services API
const USGS_BASE_URL = 'https://waterservices.usgs.gov/nwis/iv/'

// Retry configuration
const MAX_RETRIES = 3
const RETRY_DELAY_MS = 1000

async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<Response> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout
    
    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 300 } // Cache for 5 minutes
    })
    
    clearTimeout(timeoutId)
    return res
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS))
      return fetchWithRetry(url, retries - 1)
    }
    throw error
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const site = searchParams.get('site')
  const param = searchParams.get('param') // USGS parameter code (e.g., 00065 = gage height, 00060 = discharge)

  if (!site) {
    return NextResponse.json({ error: 'Missing site parameter' }, { status: 400 })
  }

  // Build USGS API URL
  // Get last 7 days of instantaneous values
  const url = new URL(USGS_BASE_URL)
  url.searchParams.set('format', 'json')
  url.searchParams.set('sites', site)
  url.searchParams.set('period', 'P7D') // Last 7 days
  if (param) {
    url.searchParams.set('parameterCd', param)
  }
  url.searchParams.set('siteStatus', 'all')

  try {
    const res = await fetchWithRetry(url.toString())
    
    if (!res.ok) {
      console.error(`USGS API returned ${res.status} for site ${site}`)
      return NextResponse.json(
        { error: 'USGS API error', status: res.status },
        { 
          status: res.status,
          headers: { 'X-Data-Source': 'usgs-error' }
        }
      )
    }

    const data = await res.json()
    
    // Return the full USGS response structure
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'X-Data-Source': 'usgs-nwis',
        'X-Site-ID': site
      }
    })
  } catch (error) {
    console.error(`USGS fetch failed for site ${site}:`, error)
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch from USGS', 
        message: error instanceof Error ? error.message : 'Unknown error',
        site 
      },
      { 
        status: 503,
        headers: { 'X-Data-Source': 'usgs-unavailable' }
      }
    )
  }
}
