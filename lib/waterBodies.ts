// app/api/usace/route.ts
import { NextResponse } from 'next/server'

// The new "Official" API endpoint (CWMS Data API)
const BASE_URL = 'https://cwms-data.usace.army.mil/cwms-data/timeseries'

// Common patterns for Tulsa District (SWT) data
// ID = SHEF ID (e.g., CYDO2)
// Param = Elev, Flow, Stage, Stor
const TS_PATTERNS = [
  (id: string, param: string) => `${id}.${param}.Inst.1Hour.0.Ccp-Rev`,
  (id: string, param: string) => `${id}.${param}.Inst.1Hour.0.Rev-Regi`,
  (id: string, param: string) => `${id}.${param}.Inst.1Hour.0.Usgs-Raw`,
  (id: string, param: string) => `${id}.${param}.Inst.15Minutes.0.Ccp-Rev`,
  (id: string, param: string) => `${id}.${param}.Inst.15Minutes.0.Usgs-Raw`,
  // Fallback for daily data if hourly is missing
  (id: string, param: string) => `${id}.${param}.Ave.1Day.1Day.Ccp-Rev`,
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const locationId = searchParams.get('site') // e.g., 'CYDO2'
  const param = searchParams.get('param') // 'Elev' or 'Flow' or 'Stage'
  
  if (!locationId || !param) {
    return NextResponse.json({ error: 'Missing site or param' }, { status: 400 })
  }

  // Calculate time window (last 7 days to ensure we get a line)
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 7)
  
  const beginStr = start.toISOString()
  const endStr = end.toISOString()

  // Try patterns until we find data
  for (const pattern of TS_PATTERNS) {
    const name = pattern(locationId, param)
    const url = `${BASE_URL}?office=SWT&name=${encodeURIComponent(name)}&begin=${encodeURIComponent(beginStr)}&end=${encodeURIComponent(endStr)}&page-size=500`

    try {
      const res = await fetch(url, {
        headers: {
          'Accept': 'application/json;version=2'
        },
        next: { revalidate: 300 } // Cache for 5 minutes
      })

      if (!res.ok) continue

      const data = await res.json()
      
      // Check if we actually got values
      if (data.values && data.values.length > 0) {
        return NextResponse.json({
          source: 'usace-cwms',
          timeseriesId: name,
          values: data.values.map((v: any) => ({
            dateTime: new Date(v[0]).toISOString(),
            value: v[1]
          })),
          units: data.units
        })
      }
    } catch (e) {
      console.error(`Failed to fetch USACE data for ${name}:`, e)
      // Continue to next pattern
    }
  }

  return NextResponse.json({ error: 'No data found for this location' }, { status: 404 })
}
