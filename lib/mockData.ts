/**
 * Mock USGS data for development and demo purposes
 * This simulates realistic water level and flow data with proper trends
 */

interface MockDataPoint {
  dateTime: string
  value: string
  qualifiers?: string[]
}

// Generate realistic mock data points with trends and patterns
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
    const timestamp = new Date(now.getTime() - i * 15 * 60 * 1000) // 15 minute intervals

    // Add daily cycle (small variation based on time of day)
    const hour = timestamp.getHours()
    const dailyCycle = Math.sin((hour / 24) * Math.PI * 2) * variance * 0.3

    // Add random noise
    const noise = (Math.random() - 0.5) * variance * 1.5

    // Add trend
    let trendValue = 0
    if (trendDirection === 'rising') {
      trendValue = ((count - i) / count) * trendStrength
    } else if (trendDirection === 'falling') {
      trendValue = -((count - i) / count) * trendStrength
    }

    const value = baseValue + dailyCycle + noise + trendValue

    points.push({
      dateTime: timestamp.toISOString(),
      value: value.toFixed(2),
      qualifiers: ['P'] // Provisional data
    })
  }

  return points
}

// Generate river flow data with more realistic patterns
function generateRiverFlowData(
  baseFlow: number,
  variance: number,
  count: number = 96
): MockDataPoint[] {
  const now = new Date()
  const points: MockDataPoint[] = []

  for (let i = count; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 15 * 60 * 1000)

    // Rivers have more variation and can have sudden spikes from rainfall
    const noise = (Math.random() - 0.5) * variance * 2

    // Occasional spike to simulate storm events
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

// Mock data for each water body with realistic patterns
export const MOCK_WATER_DATA: Record<string, { parameterCode: string; data: MockDataPoint[] }> = {
  // === SETTLEMENT WATER BODIES ===
  '07335775': { // Sardis Lake - Conservation pool 599, currently in watch zone
    parameterCode: '62614',
    data: generateMockData(592.5, 0.6, 96, 'falling', 2.0) // Falling trend, approaching OKC withdrawal threshold
  },
  '07333900': { // McGee Creek - Near conservation pool (also part of OKC system)
    parameterCode: '62614',
    data: generateMockData(574.5, 0.8, 96, 'stable', 0.5)
  },
  '07336000': { // Hugo Lake - Below conservation pool, watch status
    parameterCode: '62614',
    data: generateMockData(389.2, 0.9, 96, 'rising', 1.5) // Recovering
  },
  '07337900': { // Broken Bow - At conservation pool, normal status
    parameterCode: '62614',
    data: generateMockData(599.1, 0.4, 96, 'stable', 0)
  },
  '07338500': { // Pine Creek - Slightly below conservation
    parameterCode: '62614',
    data: generateMockData(434.8, 0.7, 96, 'falling', 1.0)
  },
  '07245500': { // Eufaula - Good level
    parameterCode: '62614',
    data: generateMockData(584.2, 0.5, 96, 'rising', 0.8)
  },
  '07247000': { // Wister - Below conservation pool
    parameterCode: '62614',
    data: generateMockData(472.3, 0.6, 96, 'falling', 0.5)
  },
  // Kiamichi River monitoring stations
  '07335700': { // Kiamichi River near Big Cedar - Upper river
    parameterCode: '00060',
    data: generateRiverFlowData(95, 18)
  },
  '07336500': { // Kiamichi River at Moyers - CRITICAL: Point of Diversion for OKC
    // Per WSA: 50 cfs must bypass when City diverts up to 250 cfs (total flow required: 300 cfs)
    parameterCode: '00060',
    data: generateRiverFlowData(285, 35) // Healthy flow allowing full diversion with bypass
  },
  '07336200': { // Kiamichi River near Antlers - Downstream
    parameterCode: '00060',
    data: generateRiverFlowData(165, 25)
  },

  // === OKC RESERVOIR SYSTEM (per Exhibit 13) ===
  // All 6 reservoirs now have verified USGS station IDs

  '07333010': { // Atoka Reservoir - Primary OKC supply reservoir
    // https://waterdata.usgs.gov/monitoring-location/USGS-07333010/
    parameterCode: '00065',
    data: generateMockData(585.8, 0.5, 96, 'stable', 0.3) // ~89% of live storage
  },
  '07238500': { // Canton Lake - OKC system (30% transit loss applies)
    // https://waterdata.usgs.gov/monitoring-location/USGS-07238500/
    parameterCode: '00065',
    data: generateMockData(1608.2, 1.2, 96, 'stable', 0.2) // ~62% of capacity
  },
  '07229445': { // Stanley Draper Lake - DROUGHT CRITICAL reservoir
    // https://waterdata.usgs.gov/monitoring-location/USGS-07229445/
    parameterCode: '00065',
    data: generateMockData(1182.5, 0.8, 96, 'falling', 0.5) // ~81% of capacity
  },
  '07159550': { // Lake Hefner - DROUGHT CRITICAL reservoir
    // https://waterdata.usgs.gov/monitoring-location/USGS-07159550/
    parameterCode: '00065',
    data: generateMockData(1194.3, 0.6, 96, 'stable', 0.3) // ~86% of capacity
  },
  '07240500': { // Lake Overholser - OKC system
    // https://waterdata.usgs.gov/monitoring-location/USGS-07240500/
    parameterCode: '00065',
    data: generateMockData(1237.8, 0.4, 96, 'stable', 0.1) // ~62% of capacity
  }
}

export function getMockData(siteId: string, parameterCode: string) {
  const mockSite = MOCK_WATER_DATA[siteId]

  if (!mockSite) {
    return null
  }

  // Return mock data in USGS JSON format
  return {
    value: {
      timeSeries: [
        {
          values: [
            {
              value: mockSite.data
            }
          ]
        }
      ]
    }
  }
}
