import { NextResponse } from 'next/server'

// Official USACE CWMS Data API
const BASE_URL = 'https://cwms-data.usace.army.mil/cwms-data/timeseries'

// Strategy: Try standard Tulsa District (SWT) patterns
const ID_PATTERNS = [
  (id: string, param: string) => `${id}.${param}.Inst.1Hour.0.Ccp-Rev`,
  (id: string, param: string) => `${id}.${param}.Inst.1Hour.0.Rev-Regi`,
  (id: string, param: string) => `${id}.${param}.Inst.1Hour.0.Usgs-Raw`, // Fallback
  (id: string, param: string) => `${id}.${param}.Inst.15Minutes.0.Ccp-Rev`
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const site = searchParams.get('site') // e.g. CYDO2
  const param = searchParams.get('param') // e.g. Elev

  if (!site || !param) return NextResponse.json({ error: 'Missing params' }, { status: 400 })

  // Last 7 days
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 7)

  // Try patterns until data is found
  for (const pattern of ID_PATTERNS) {
    const tsId = pattern(site, param)
    const url = `${BASE_URL}?office=SWT&name=${encodeURIComponent(tsId)}&begin=${start.toISOString()}&end=${end.toISOString()}&page-size=500`

    try {
      const res = await fetch(url, {
        headers: { 'Accept': 'application/json;version=2' },
        next: { revalidate: 300 }
      })
      
      if (!res.ok) continue

      const data = await res.json()
      if (data.values && data.values.length > 0) {
        // Format to simplified structure
        const cleanValues = data.values.map((v: any[]) => ({
          dateTime: new Date(v[0]).toISOString(),
          value: v[1]
        }))
        
        return NextResponse.json({
          source: 'usace',
          tsId,
          values: cleanValues
        })
      }
    } catch (e) {
      console.error(`USACE fetch failed for ${tsId}`, e)
    }
  }

  return NextResponse.json({ error: 'Data not found' }, { status: 404 })
}
