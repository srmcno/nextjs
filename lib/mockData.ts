/**
 * Mock USGS data for development and demo purposes
 * This simulates realistic water level and flow data
 */

interface MockDataPoint {
  dateTime: string
  value: string
}

// Generate realistic mock data points
function generateMockData(
  baseValue: number,
  variance: number,
  count: number = 96
): MockDataPoint[] {
  const now = new Date()
  const points: MockDataPoint[] = []

  for (let i = count; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 15 * 60 * 1000) // 15 minute intervals
    const variation = (Math.random() - 0.5) * variance * 2
    const value = baseValue + variation

    points.push({
      dateTime: timestamp.toISOString(),
      value: value.toFixed(2)
    })
  }

  return points
}

// Mock data for each water body
export const MOCK_WATER_DATA: Record<string, { parameterCode: string; data: MockDataPoint[] }> = {
  '07335775': { // Sardis Lake
    parameterCode: '62614',
    data: generateMockData(597.5, 0.8) // Slightly below conservation pool of 599
  },
  '07333900': { // McGee Creek
    parameterCode: '62614',
    data: generateMockData(575, 0.5)
  },
  '07336000': { // Hugo Lake
    parameterCode: '62614',
    data: generateMockData(404, 0.6)
  },
  '07337900': { // Broken Bow
    parameterCode: '62614',
    data: generateMockData(598, 0.7)
  },
  '07338500': { // Pine Creek
    parameterCode: '62614',
    data: generateMockData(436, 0.5)
  },
  '07245500': { // Eufaula
    parameterCode: '62614',
    data: generateMockData(583, 0.6)
  },
  '07247000': { // Wister
    parameterCode: '62614',
    data: generateMockData(476, 0.5)
  },
  '07334200': { // Atoka
    parameterCode: '00065',
    data: generateMockData(580, 0.4)
  },
  '07335700': { // Kiamichi River Big Cedar
    parameterCode: '00060',
    data: generateMockData(125, 15)
  },
  '07336200': { // Kiamichi River Antlers
    parameterCode: '00060',
    data: generateMockData(180, 20)
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
