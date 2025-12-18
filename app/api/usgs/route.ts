import { NextResponse } from 'next/server'

// The Official USACE CWMS Data API (CDA) Endpoint
const BASE_URL = 'https://cwms-data.usace.army.mil/cwms-data/timeseries'

// Time Series ID Patterns to try
// USACE uses complex IDs like "CYDO2.Elev.Inst.1Hour.0.Ccp-Rev"
const PATTERNS = [
  // Most common for "Current" data
  (id: string, param: string) => `${id}.${param}.Inst.1Hour.0.Ccp-Rev`,
  // Sometimes marked as Revised-Regulated
  (id: string, param: string) => `${id}.${param}.Inst.1Hour.0.Rev-Regi`,
  // Raw USGS feed often mirrored by USACE
  (id: string, param: string) => `${id}.${param}.Inst.1Hour.0.Usgs-Raw`,
  // Raw USACE feed
  (id: string, param: string) => `${id}.${param}.Inst.1Hour.0.Raw`,
  // 15 Minute intervals (common for precip/stage, less for elev)
  (id: string, param: string) => `${id}.${param}.Inst.15Minutes.0.Ccp-Rev`,
  (id: string, param: string) => `${id}.${param}.Inst.15Minutes.0.Usgs-Raw`,
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const site = searchParams.get('site')
  const param = searchParams.get('param') // 'Elev', 'Stage', 'Flow'

  if (!site || !param) {
    return NextResponse.json({ error: 'Missing site or param' }, { status: 400 })
  }

  // Define Time Window (Last 7 days)
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 7)

  // Use encoded URI components for the timestamps
  const beginStr = start.toISOString()
  const endStr = end.toISOString()

  let lastError = null

  // Try each pattern until we get data
  for (const makeId of PATTERNS) {
    const tsId = makeId(site, param)
    const url = `${BASE_URL}?office=SWT&name=${encodeURIComponent(tsId)}&begin=${encodeURIComponent(beginStr)}&end=${encodeURIComponent(endStr)}&page-size=500`

    try {
      const res = await fetch(url, {
        headers: {
          'Accept': 'application/json;version=2' // Version 2 is standard for CDA
        },
        next: { revalidate: 300 } // Cache for 5 mins
      })

      if (!res.ok) {
        // 404 means this specific TS ID doesn't exist, try next
        continue
      }

      const data = await res.json()

      // Ensure we have values
      if (data.values && Array.isArray(data.values) && data.values.length > 0) {
        // Transform to our standard format
        const formattedValues = data.values.map((v: [number, number, number]) => ({
            // v[0] is timestamp (ms), v[1] is value, v[2] is quality code
            dateTime: new Date(v[0]).toISOString(),
            value: v[1]
        })).filter((v: any) => v.value !== null)

        if (formattedValues.length === 0) continue

        return NextResponse.json({
          source: 'usace-cwms',
          tsId: tsId,
          values: formattedValues,
          units: data.units
        })
      }

    } catch (e) {
      console.error(`USACE API Error for ${tsId}:`, e)
      lastError = e
    }
  }

  return NextResponse.json(
    { error: 'Data unavailable from USACE API', details: lastError },
    { status: 404 }
  )
}
