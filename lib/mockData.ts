/**
 * Simulated USGS/USACE data used when the upstream APIs are unavailable.
 * Keys mirror the USGS site IDs declared in SETTLEMENT_WATER_BODIES and
 * OKC_RESERVOIR_SYSTEM so any registered water body has a realistic fallback.
 */

export interface MockDataPoint {
  dateTime: string
  value: string
  qualifiers?: string[]
}

function generateMockData(
  baseValue: number,
  variance: number,
  count: number = 96,
  trendDirection: 'rising' | 'falling' | 'stable' = 'stable',
  trendStrength: number = 0
): MockDataPoint[] {
  const now = new Date()
  const points: MockDataPoint[] = []

  for (let i = count; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 15 * 60 * 1000)
    const hour = timestamp.getHours()
    const dailyCycle = Math.sin((hour / 24) * Math.PI * 2) * variance * 0.3
    const noise = (Math.random() - 0.5) * variance * 1.5

    let trendValue = 0
    if (trendDirection === 'rising') {
      trendValue = ((count - i) / count) * trendStrength
    } else if (trendDirection === 'falling') {
      trendValue = -((count - i) / count) * trendStrength
    }

    points.push({
      dateTime: timestamp.toISOString(),
      value: (baseValue + dailyCycle + noise + trendValue).toFixed(2),
      qualifiers: ['P']
    })
  }

  return points
}

function generateRiverFlowData(
  baseFlow: number,
  variance: number,
  count: number = 96
): MockDataPoint[] {
  const now = new Date()
  const points: MockDataPoint[] = []

  for (let i = count; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 15 * 60 * 1000)
    const noise = (Math.random() - 0.5) * variance * 2
    const spike = Math.random() < 0.02 ? variance * 3 * Math.random() : 0
    const value = Math.max(baseFlow * 0.3, baseFlow + noise + spike)

    points.push({
      dateTime: timestamp.toISOString(),
      value: value.toFixed(1),
      qualifiers: ['P']
    })
  }

  return points
}

interface MockSite {
  parameterCode: string
  generator: () => MockDataPoint[]
}

// Keyed by USGS site ID — must match SETTLEMENT_WATER_BODIES and OKC_RESERVOIR_SYSTEM.
export const MOCK_WATER_DATA: Record<string, MockSite> = {
  // === Settlement water bodies ===
  '07335775': { // Sardis Lake — conservation pool 599 ft, drifting toward OKC withdrawal floor
    parameterCode: '62614',
    generator: () => generateMockData(596.8, 0.5, 96, 'falling', 1.2)
  },
  '07335500': { // Hugo Lake — slightly below conservation pool (404.5 ft), recovering
    parameterCode: '62614',
    generator: () => generateMockData(402.4, 0.7, 96, 'rising', 0.9)
  },
  '07333910': { // McGee Creek Reservoir — settlement water body, near conservation pool (577.1 ft)
    parameterCode: '62614',
    generator: () => generateMockData(575.9, 0.6, 96, 'stable', 0.3)
  },
  '07333010': { // Atoka Lake — conservation pool 590 ft
    parameterCode: '62614',
    generator: () => generateMockData(587.3, 0.5, 96, 'stable', 0.3)
  },
  '07336500': { // Broken Bow Lake — conservation pool 599.5 ft
    parameterCode: '62614',
    generator: () => generateMockData(598.6, 0.4, 96, 'stable', 0.1)
  },
  '07335790': { // Kiamichi River nr Clayton — immediately downstream of Sardis releases
    parameterCode: '00060',
    generator: () => generateRiverFlowData(140, 22)
  },
  '07336200': { // Kiamichi River nr Antlers — downstream basin health
    parameterCode: '00060',
    generator: () => generateRiverFlowData(185, 28)
  },

  // === OKC reservoir system (Exhibit 13) ===
  '07238500': { // Canton Lake — 30% transit loss pre-applied; ~62% of capacity
    parameterCode: '62614',
    generator: () => generateMockData(1608.2, 1.2, 96, 'stable', 0.2)
  },
  '07240500': { // Lake Overholser — ~62% of capacity
    parameterCode: '62614',
    generator: () => generateMockData(1237.8, 0.4, 96, 'stable', 0.1)
  },
  '07159550': { // Lake Hefner — drought-critical (~86% of capacity)
    parameterCode: '62614',
    generator: () => generateMockData(1194.3, 0.6, 96, 'stable', 0.3)
  },
  '07229445': { // Stanley Draper Lake — drought-critical (~81% of capacity)
    parameterCode: '62614',
    generator: () => generateMockData(1182.5, 0.8, 96, 'falling', 0.5)
  },
  '07333900': { // McGee Creek as modeled by the OKC system registry
    parameterCode: '62614',
    generator: () => generateMockData(574.5, 0.8, 96, 'stable', 0.5)
  }
}

export function getMockData(siteId: string) {
  const mockSite = MOCK_WATER_DATA[siteId]
  if (!mockSite) return null

  return {
    value: {
      timeSeries: [
        {
          values: [
            {
              value: mockSite.generator()
            }
          ]
        }
      ]
    }
  }
}

export function getMockUsaceValues(siteId: string) {
  const mockSite = MOCK_WATER_DATA[siteId]
  if (!mockSite) return null

  return mockSite.generator().map((p) => ({
    dateTime: p.dateTime,
    value: Number(p.value)
  }))
}
