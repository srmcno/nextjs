import { NextResponse } from 'next/server'
import { getMockUsaceValues } from '../../../lib/mockData'

// Official USACE CWMS Data API
const BASE_URL = 'https://cwms-data.usace.army.mil/cwms-data/timeseries'

// Strategy: Try standard Tulsa District (SWT) patterns
const ID_PATTERNS = [
  (id: string, param: string) => `${id}.${param}.Inst.1Hour.0.Ccp-Rev`,
  (id: string, param: string) => `${id}.${param}.Inst.1Hour.0.Rev-Regi`,
  (id: string, param: string) => `${id}.${param}.Inst.1Hour.0.Usgs-Raw`,
  (id: string, param: string) => `${id}.${param}.Inst.15Minutes.0.Ccp-Rev`
]

const MAX_RETRIES = 1
const RETRY_DELAY_MS = 800
const FETCH_TIMEOUT_MS = 8000

// USACE/NWS SHEF IDs → USGS site IDs for mock-data fallback
const USACE_TO_USGS: Record<string, string> = {
  CYDO2: '07335775', // Sardis Lake
  HGLO2: '07335500', // Hugo Lake
  MGCO2: '07333910', // McGee Creek Reservoir
  ATKO2: '07333010', // Atoka Lake
  BKDO2: '07336500', // Broken Bow Lake
  CANO2: '07238500'  // Canton Lake
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = MAX_RETRIES
): Promise<Response> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

    const res = await fetch(url, { ...options, signal: controller.signal })
    clearTimeout(timeoutId)
    return res
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS))
      return fetchWithRetry(url, options, retries - 1)
    }
    throw error
  }
}

function mockResponse(site: string, param: string, reason: 'unavailable' | 'not-found') {
  const usgsEquivalent = USACE_TO_USGS[site.toUpperCase()]
  const values = usgsEquivalent ? getMockUsaceValues(usgsEquivalent) : null

  if (!values) {
    return NextResponse.json(
      { error: 'Data not found', site, param, reason },
      { status: 404, headers: { 'X-Data-Source': 'usace-unavailable' } }
    )
  }

  return NextResponse.json(
    { source: 'mock', tsId: null, site, param, values },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        'X-Data-Source': 'mock-demo',
        'X-Site-ID': site,
        'X-Fallback-Reason': reason
      }
    }
  )
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const site = searchParams.get('site') // e.g. CYDO2
  const param = searchParams.get('param') // e.g. Elev

  if (!site || !param) {
    return NextResponse.json({ error: 'Missing site or param' }, { status: 400 })
  }

  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 7)

  interface USACETimeSeriesValue {
    0: number
    1: number | null
  }
  interface PatternHit {
    tsId: string
    cleanValues: { dateTime: string; value: number }[]
  }

  // Race the timeseries-ID patterns in parallel. The first pattern to return
  // a non-empty payload wins; the rest are abandoned. This bounds total
  // latency to a single fetch's worth of timeout instead of stacking 4×.
  const tryPattern = async (tsId: string): Promise<PatternHit> => {
    const url = `${BASE_URL}?office=SWT&name=${encodeURIComponent(tsId)}&begin=${start.toISOString()}&end=${end.toISOString()}&page-size=500`
    const res = await fetchWithRetry(url, {
      headers: { Accept: 'application/json;version=2' },
      next: { revalidate: 300 }
    })
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${tsId}`)

    const data = await res.json()
    const raw = data?.values as USACETimeSeriesValue[] | undefined
    if (!raw || raw.length === 0) throw new Error(`empty values for ${tsId}`)

    const cleanValues = raw
      .filter((v) => v[1] !== null && Number.isFinite(v[1] as number))
      .map((v) => ({
        dateTime: new Date(v[0]).toISOString(),
        value: v[1] as number
      }))

    if (cleanValues.length === 0) throw new Error(`no finite values for ${tsId}`)
    return { tsId, cleanValues }
  }

  try {
    const hit = await Promise.any(
      ID_PATTERNS.map((pattern) => tryPattern(pattern(site, param)))
    )

    return NextResponse.json(
      { source: 'usace', tsId: hit.tsId, site, param, values: hit.cleanValues },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          'X-Data-Source': 'usace-live',
          'X-Site-ID': site
        }
      }
    )
  } catch {
    // All patterns failed (Promise.any rejects with AggregateError) — fall back to mock.
    return mockResponse(site, param, 'not-found')
  }
}
