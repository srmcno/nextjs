export type WaterBodyType = 'reservoir' | 'river'

export interface WaterBody {
  id: string
  name: string
  /** USACE / NWS SHEF ID (e.g. CYDO2) - Primary for Corps Lakes */
  usaceId?: string 
  /** USGS Site ID - Primary for City Lakes / Rivers */
  usgsId: string
  type: WaterBodyType
  county: string
  /** Parameter to fetch: 'Elev' for lakes, 'Flow'/'Stage' for rivers */
  usaceParam?: 'Elev' | 'Stage' | 'Flow'
  parameterCode: string // USGS parameter code (00065 = gage height, 00060 = discharge)
  conservationPool?: number // Top of conservation pool (ft MSL)
  streambed?: number // Elevation of streambed (ft MSL)
  floodPool?: number // Top of flood control pool (ft MSL)
  description: string
  isSettlementCritical: boolean // If true, heavily regulated by settlement
}

/**
 * Sardis Lake Withdrawal Constraints (Settlement Agreement Section 6.1.8)
 */
export const SARDIS_WITHDRAWAL_THRESHOLDS = {
  conservationPool: 599.0,
  // Below these levels, OKC cannot release water unless drought conditions are met
  baselineWinter: 595.0, // Sep 1 - Mar 31
  baselineSummer: 599.0, // Apr 1 - Aug 31
  
  // Drought Release Floors (requires Drought Condition trigger)
  moderateDroughtFloor: 597.0, // Jul 5 - Aug 31 only
  advancedDroughtFloor: 592.0,
  extremeDroughtFloor: 589.0
}

export const SETTLEMENT_WATER_BODIES: WaterBody[] = [
  {
    id: 'sardis',
    name: 'Sardis Lake',
    usaceId: 'CYDO2', // Official USACE ID
    usgsId: '07335775',
    type: 'reservoir',
    county: 'Pushmataha',
    usaceParam: 'Elev',
    parameterCode: '62614',
    conservationPool: 599.0,
    streambed: 530.0,
    floodPool: 607.0,
    description: 'Primary settlement reservoir. Releases strictly regulated by lake level and drought conditions.',
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
    streambed: 370.0,
    floodPool: 437.5,
    description: 'Downstream of Sardis on the Kiamichi River. Managed by USACE.',
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
    streambed: 510.0,
    floodPool: 595.5,
    description: 'Bureau of Reclamation project supplying OKC via Atoka pipeline.',
    isSettlementCritical: true
  },
  {
    id: 'atoka',
    name: 'Atoka Lake',
    usaceId: 'ATKO2', // USACE often reports this even if City owned
    usgsId: '07333010',
    type: 'reservoir',
    county: 'Atoka',
    usaceParam: 'Elev',
    parameterCode: '62614',
    conservationPool: 590.0,
    streambed: 530.0,
    floodPool: 590.0,
    description: 'Terminal reservoir for the Atoka pipeline. Key OKC supply point.',
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
    description: 'Mountain Fork river system. Vital for regional tourism and ecology.',
    isSettlementCritical: false
  },
  {
    id: 'kiamichi-clayton',
    name: 'Kiamichi R. nr Clayton',
    usgsId: '07335790',
    type: 'river',
    county: 'Pushmataha',
    parameterCode: '00060',
    description: 'Monitors flows immediately downstream of Sardis Lake releases.',
    isSettlementCritical: true
  },
  {
    id: 'kiamichi-antlers',
    name: 'Kiamichi R. nr Antlers',
    usgsId: '07336200',
    type: 'river',
    county: 'Pushmataha',
    parameterCode: '00060',
    description: 'Key checkpoint for basin flow health before Hugo Lake.',
    isSettlementCritical: false
  }
]

export function getReservoirs() {
  return SETTLEMENT_WATER_BODIES.filter(wb => wb.type === 'reservoir')
}

export function getRivers() {
  return SETTLEMENT_WATER_BODIES.filter(wb => wb.type === 'river')
}

// Alert logic
export type AlertLevel = 'normal' | 'watch' | 'warning' | 'critical'

export function getAlertLevel(currentLevel: number, conservationPool: number): AlertLevel {
  const diff = currentLevel - conservationPool
  if (diff > 5) return 'watch' // Flood watch
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
  // Sardis-specific settlement check
  if (wb.id === 'sardis' && level < SARDIS_WITHDRAWAL_THRESHOLDS.baselineSummer) {
    return `Level below Summer Baseline (${SARDIS_WITHDRAWAL_THRESHOLDS.baselineSummer}'). Withdrawals restricted unless drought declared.`
  }
  return null
}
