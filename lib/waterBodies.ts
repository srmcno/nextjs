export type WaterBodyType = 'reservoir' | 'river'

export interface WaterBody {
  id: string
  name: string
  // NWS/SHEF ID for USACE (e.g. CYDO2)
  usaceId?: string 
  // USGS Site ID (fallback/reference)
  usgsId: string
  type: WaterBodyType
  county: string
  // Parameter to fetch: 'Elev' for lakes, 'Flow'/'Stage' for rivers
  usaceParam?: 'Elev' | 'Stage' | 'Flow'
  parameterCode: string // USGS parameter code (00065 = gage height, 00060 = discharge)
  conservationPool?: number // Top of conservation pool (ft)
  streambed?: number // Elevation of streambed (ft)
  floodPool?: number // Top of flood control pool
  description: string
  isSettlementCritical: boolean // If true, heavily regulated by settlement
}

export const SARDIS_WITHDRAWAL_THRESHOLDS = {
  conservationPool: 599.0,
  minimumForWithdrawal: 592.0, // Floor for OKC withdrawals
  criticalLevel: 585.0 // Severe drought level
}

export const SETTLEMENT_WATER_BODIES: WaterBody[] = [
  {
    id: 'sardis',
    name: 'Sardis Lake',
    usaceId: 'CYDO2',
    usgsId: '07335775',
    type: 'reservoir',
    county: 'Pushmataha',
    usaceParam: 'Elev',
    parameterCode: '62614', // Lake elevation
    conservationPool: 599.0,
    streambed: 530.0,
    floodPool: 607.0,
    description: 'The primary storage reservoir for the settlement agreement. Withdrawals are strictly limited based on lake levels.',
    isSettlementCritical: true
  },
  {
    id: 'hugo',
    name: 'Hugo Lake',
    usaceId: 'HGLO2',
    usgsId: '07335500',
    type: 'reservoir',
    county: 'Choctaw',
    usaceParam: 'Elev',
    parameterCode: '62614',
    conservationPool: 404.5,
    streambed: 370.0, // Approx
    floodPool: 437.5,
    description: 'Located downstream of Sardis. Releases from Sardis often flow into Hugo Lake.',
    isSettlementCritical: false
  },
  {
    id: 'mcgee',
    name: 'McGee Creek Reservoir',
    usaceId: 'MGCO2',
    usgsId: '07333910',
    type: 'reservoir',
    county: 'Atoka',
    usaceParam: 'Elev',
    parameterCode: '62614',
    conservationPool: 577.1,
    streambed: 510.0, // Approx
    floodPool: 595.5,
    description: 'A key water source for Oklahoma City, connected via the Atoka pipeline.',
    isSettlementCritical: true
  },
  {
    id: 'atoka',
    name: 'Atoka Lake',
    usaceId: 'ATKO2',
    usgsId: '07333010',
    type: 'reservoir',
    county: 'Atoka',
    usaceParam: 'Elev',
    parameterCode: '62614',
    conservationPool: 590.0,
    streambed: 530.0, // Approx
    floodPool: 590.0, // Often kept at conservation
    description: 'The primary terminal for the existing pipeline system. Heavily utilized by OKC.',
    isSettlementCritical: false
  },
  {
    id: 'broken-bow',
    name: 'Broken Bow Lake',
    usaceId: 'BKDO2',
    usgsId: '07336500',
    type: 'reservoir',
    county: 'McCurtain',
    usaceParam: 'Elev',
    parameterCode: '62614',
    conservationPool: 599.5,
    streambed: 400.0,
    floodPool: 627.5,
    description: 'Deep clear-water reservoir in the Mountain Fork river system. Vital for tourism.',
    isSettlementCritical: false
  },
  {
    id: 'pine-creek',
    name: 'Pine Creek Lake',
    usaceId: 'PC2O2',
    usgsId: '07335300',
    type: 'reservoir',
    county: 'McCurtain',
    usaceParam: 'Elev',
    parameterCode: '62614',
    conservationPool: 438.0,
    streambed: 390.0,
    floodPool: 480.0,
    description: 'Located on the Little River, downstream of the upper Kiamichi basin.',
    isSettlementCritical: false
  },
  {
    id: 'kiamichi-clayton',
    name: 'Kiamichi R. nr Clayton',
    usgsId: '07335790',
    type: 'river',
    county: 'Pushmataha',
    parameterCode: '00060', // Discharge
    description: 'Key stream gauge monitoring flows just downstream of Sardis Lake releases.',
    isSettlementCritical: true
  },
  {
    id: 'kiamichi-antlers',
    name: 'Kiamichi R. nr Antlers',
    usgsId: '07336200',
    type: 'river',
    county: 'Pushmataha',
    parameterCode: '00060',
    description: 'Downstream monitor for the Kiamichi basin flows before reaching Hugo Lake.',
    isSettlementCritical: false
  }
]

export function getReservoirs() {
  return SETTLEMENT_WATER_BODIES.filter(wb => wb.type === 'reservoir')
}

export function getRivers() {
  return SETTLEMENT_WATER_BODIES.filter(wb => wb.type === 'river')
}

export function getWaterBody(id: string) {
  return SETTLEMENT_WATER_BODIES.find(wb => wb.id === id)
}

// Alert levels based on conservation pool distance
export type AlertLevel = 'normal' | 'watch' | 'warning' | 'critical'

export function getAlertLevel(currentLevel: number, conservationPool: number): AlertLevel {
  const diff = currentLevel - conservationPool
  
  // If significantly above conservation (flood watch)
  if (diff > 5) return 'watch'
  
  // If below conservation (drought watch)
  if (diff < -2 && diff >= -5) return 'watch'
  if (diff < -5 && diff >= -10) return 'warning'
  if (diff < -10) return 'critical'
  
  return 'normal'
}

export function calculatePoolPercentage(current: number, conservation: number, streambed: number) {
  if (current < streambed) return 0
  const totalCapacity = conservation - streambed
  const currentFill = current - streambed
  return (currentFill / totalCapacity) * 100
}

export function getAlertMessage(wb: WaterBody, level: number): string | null {
  if (wb.id === 'sardis' && level < SARDIS_WITHDRAWAL_THRESHOLDS.minimumForWithdrawal) {
    return `Level is below settlement withdrawal threshold (${SARDIS_WITHDRAWAL_THRESHOLDS.minimumForWithdrawal}'). OKC withdrawals prohibited.`
  }
  
  if (wb.conservationPool && level < wb.conservationPool - 5) {
    return 'Level is significantly below conservation pool. Drought conditions likely.'
  }

  return null
}
