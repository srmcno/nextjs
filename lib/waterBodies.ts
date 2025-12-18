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
 * Alert thresholds for pool percentage visualization
 */
export const ALERT_THRESHOLDS = {
  normal: 95,   // ≥95% of conservation pool
  watch: 85,    // 85-95% of conservation pool
  warning: 75,  // 75-85% of conservation pool
  critical: 75  // <75% of conservation pool
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
  extremeDroughtFloor: 589.0,
  
  // Legacy compatibility - using baselineWinter as minimum for general withdrawal checks
  minimumForWithdrawal: 595.0, // Conservative floor (winter baseline)
  criticalLevel: 589.0 // Extreme drought floor
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

/**
 * Recreation Status - "Can I Go Boating?" Logic
 */
export type RecreationStatus = 'great' | 'caution' | 'poor'

export interface RecreationInfo {
  status: RecreationStatus
  label: string
  description: string
  color: string
  bgColor: string
}

export function getRecreationStatus(currentLevel: number, conservationPool: number): RecreationInfo {
  const diff = currentLevel - conservationPool
  
  if (diff >= -2) {
    return {
      status: 'great',
      label: 'Great for Boating',
      description: 'Water levels are near normal. All boat ramps accessible.',
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50 border-emerald-200'
    }
  } else if (diff >= -5) {
    return {
      status: 'caution',
      label: 'Use Caution',
      description: 'Water level is low. Watch for submerged stumps. Some ramps may be tricky.',
      color: 'text-amber-700',
      bgColor: 'bg-amber-50 border-amber-200'
    }
  } else {
    return {
      status: 'poor',
      label: 'Navigation Hazardous',
      description: 'Very low water. Some ramps closed. Submerged hazards likely.',
      color: 'text-rose-700',
      bgColor: 'bg-rose-50 border-rose-200'
    }
  }
}

/**
 * River Health Status - Basin Health for Fishermen
 */
export type RiverHealthStatus = 'low' | 'healthy' | 'high' | 'flood'

export interface RiverHealthInfo {
  status: RiverHealthStatus
  label: string
  description: string
  color: string
  bgColor: string
  icon: string
}

export function getRiverHealthStatus(flowCfs: number): RiverHealthInfo {
  if (flowCfs < 50) {
    return {
      status: 'low',
      label: 'Low Flow',
      description: 'Ecological stress. Fish may be concentrated in pools. Limited kayaking.',
      color: 'text-amber-700',
      bgColor: 'bg-amber-50 border-amber-200',
      icon: '🏜️'
    }
  } else if (flowCfs < 100) {
    return {
      status: 'healthy',
      label: 'Moderate Flow',
      description: 'Adequate flow for aquatic life. Good fishing conditions.',
      color: 'text-blue-700',
      bgColor: 'bg-blue-50 border-blue-200',
      icon: '🎣'
    }
  } else if (flowCfs < 500) {
    return {
      status: 'healthy',
      label: 'Healthy Flow',
      description: 'Optimal conditions for ecosystem. Great for fishing and paddling.',
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50 border-emerald-200',
      icon: '🛶'
    }
  } else if (flowCfs < 1000) {
    return {
      status: 'high',
      label: 'High Flow',
      description: 'Strong current. Experienced paddlers only. Bank fishing recommended.',
      color: 'text-sky-700',
      bgColor: 'bg-sky-50 border-sky-200',
      icon: '💨'
    }
  } else {
    return {
      status: 'flood',
      label: 'Flood Watch',
      description: 'Dangerous conditions. Stay off the water. Flooding possible.',
      color: 'text-rose-700',
      bgColor: 'bg-rose-50 border-rose-200',
      icon: '⚠️'
    }
  }
}

/**
 * Sardis Release Status - "Is OKC Taking Our Water?"
 */
export interface SardisReleaseInfo {
  isAllowed: boolean
  currentFloor: number
  floorLabel: string
  reason: string
  isDroughtOverride: boolean
}

export function getSardisReleaseStatus(
  currentLevel: number,
  droughtCondition: 'none' | 'moderate' | 'advanced' | 'extreme' = 'none',
  date: Date = new Date()
): SardisReleaseInfo {
  const month = date.getMonth() + 1 // 1-12
  const day = date.getDate()
  
  let floor: number
  let floorLabel: string
  let isDroughtOverride = false
  
  // Determine current floor based on drought and season
  if (droughtCondition === 'extreme') {
    floor = SARDIS_WITHDRAWAL_THRESHOLDS.extremeDroughtFloor
    floorLabel = 'Extreme Drought Floor'
    isDroughtOverride = true
  } else if (droughtCondition === 'advanced') {
    floor = SARDIS_WITHDRAWAL_THRESHOLDS.advancedDroughtFloor
    floorLabel = 'Advanced Drought Floor'
    isDroughtOverride = true
  } else if (droughtCondition === 'moderate') {
    const isSummerWindow = (month === 7 && day >= 5) || (month === 8)
    if (isSummerWindow) {
      floor = SARDIS_WITHDRAWAL_THRESHOLDS.moderateDroughtFloor
      floorLabel = 'Moderate Drought Floor (Jul 5 - Aug 31)'
      isDroughtOverride = true
    } else {
      // Outside summer window, use baseline
      floor = month >= 4 && month <= 8 
        ? SARDIS_WITHDRAWAL_THRESHOLDS.baselineSummer 
        : SARDIS_WITHDRAWAL_THRESHOLDS.baselineWinter
      floorLabel = month >= 4 && month <= 8 ? 'Summer Baseline' : 'Winter Baseline'
    }
  } else {
    // No drought - use seasonal baseline
    floor = month >= 4 && month <= 8 
      ? SARDIS_WITHDRAWAL_THRESHOLDS.baselineSummer 
      : SARDIS_WITHDRAWAL_THRESHOLDS.baselineWinter
    floorLabel = month >= 4 && month <= 8 ? 'Summer Baseline (Apr-Aug)' : 'Winter Baseline (Sep-Mar)'
  }
  
  const isAllowed = currentLevel >= floor
  const reason = isAllowed
    ? `Lake level (${currentLevel.toFixed(1)}') is above the ${floorLabel} (${floor}'). Releases permitted.`
    : `Lake level (${currentLevel.toFixed(1)}') is below the ${floorLabel} (${floor}'). Releases BLOCKED.`
  
  return {
    isAllowed,
    currentFloor: floor,
    floorLabel,
    reason,
    isDroughtOverride
  }
}
