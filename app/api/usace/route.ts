import { NextResponse } from 'next/server'

// Official USACE CWMS Data API
const BASE_URL = 'https://cwms-data.usace.army.mil/cwms-data/timeseries'

// Strategy: Try standard Tulsa District (SWT) patterns
const ID_PATTERNS = [
  (id: string, param: string) => `${id}.${param}.Inst.1Hour.0.Ccp-Rev`,
  (id: string, param: string) => `${id}.${param}.Inst.1Hour.0.Rev-Regi`,
  (id: string, param: string) => `${id}.${param}.Inst.1Hour.0.Usgs-Raw`,
  (id: string, param: string) => `${id}.${param}.Inst.15Minutes.0.Ccp-Rev`
]

// Retry configuration
const MAX_RETRIES = 3
const RETRY_DELAY_MS = 1000

async function fetchWithRetry(url: string, options: RequestInit, retries = MAX_RETRIES): Promise<Response> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout
    
    const res = await fetch(url, {
      ...options,
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    return res
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS))
      return fetchWithRetry(url, options, retries - 1)
    }
    throw error
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const site = searchParams.get('site') // e.g. CYDO2
  const param = searchParams.get('param') // e.g. Elev

  if (!site || !param) {
    return NextResponse.json({ error: 'Missing site or param' }, { status: 400 })
  }

  // Last 7 days
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 7)

  // Try patterns until data is found
  for (const pattern of ID_PATTERNS) {
    const tsId = pattern(site, param)
    const url = `${BASE_URL}?office=SWT&name=${encodeURIComponent(tsId)}&begin=${start.toISOString()}&end=${end.toISOString()}&page-size=500`

    try {
      const res = await fetchWithRetry(url, {
        headers: { 'Accept': 'application/json;version=2' },
        next: { revalidate: 300 } // Cache for 5 minutes
      })
      
      if (!res.ok) continue

      const data = await res.json()
      if (data.values && data.values.length > 0) {
        // Filter out null values and format
        interface USACETimeSeriesValue {
          0: number;  // timestamp
          1: number | null;  // value
        }
        const cleanValues = data.values
          .filter((v: USACETimeSeriesValue) => v[1] !== null)
          .map((v: USACETimeSeriesValue) => ({
            dateTime: new Date(v[0]).toISOString(),
            value: v[1]
          }))
        
        if (cleanValues.length > 0) {
          return NextResponse.json({
            source: 'usace',
            tsId,
            site,
            param,
            values: cleanValues
          }, {
            headers: {
              'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
              'X-Data-Source': 'usace-cwms',
              'X-Site-ID': site
            }
          })
        }
      }
    } catch (e) {
      console.error(`USACE fetch failed for ${tsId}:`, e)
    }
  }

  // If USACE fails, return 404 - caller should fallback to USGS
  return NextResponse.json(
    { error: 'Data not found', site, param, triedPatterns: ID_PATTERNS.length },
    { 
      status: 404,
      headers: { 'X-Data-Source': 'usace-unavailable' }
    }
  )
}
