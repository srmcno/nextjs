/**
 * Water Bodies Configuration for Choctaw-Chickasaw Water Settlement Agreement
 *
 * The settlement covers 22 counties in southeastern Oklahoma and includes
 * protections for water bodies critical to tribal sovereignty, municipal supply,
 * and ecological health.
 *
 * Sources:
 * - U.S. Army Corps of Engineers, Tulsa District
 * - Bureau of Reclamation
 * - USGS National Water Information System
 * - Choctaw-Chickasaw Nations Water Settlement Act (2016, WIIN Act)
 */

export type WaterBodyType = 'reservoir' | 'river' | 'lake'
export type AlertLevel = 'normal' | 'watch' | 'warning' | 'critical'

export interface WaterBody {
  id: string
  name: string
  type: WaterBodyType
  usgsId: string
  /** Conservation pool elevation in feet (for reservoirs/lakes) */
  conservationPool?: number
  /** Top of flood pool elevation in feet */
  floodPoolTop?: number
  /** Streambed elevation in feet */
  streambed?: number
  /** Top of dam elevation in feet */
  topOfDam?: number
  /** Minimum level before OKC withdrawal restrictions apply (for Sardis) */
  withdrawalMinimum?: number
  /** Description of the water body */
  description: string
  /** County location */
  county: string
  /** Whether this is a critical settlement water body */
  isSettlementCritical: boolean
  /** Managing agency */
  agency: 'USACE' | 'BOR' | 'USGS' | 'State'
  /** Parameter code: 00065 = gage height, 00060 = discharge, 62614 = reservoir elevation (NGVD29) */
  parameterCode: '00065' | '00060' | '62614'
}

/**
 * Alert level thresholds as percentage of conservation pool
 */
export const ALERT_THRESHOLDS = {
  normal: 95,    // >= 95% of conservation pool
  watch: 85,     // 85-95% of conservation pool
  warning: 75,   // 75-85% of conservation pool
  critical: 75   // < 75% of conservation pool
} as const

/**
 * Sardis Lake special thresholds per ODWC recommendations
 * Oklahoma City cannot withdraw water below these levels
 */
export const SARDIS_WITHDRAWAL_THRESHOLDS = {
  /** Minimum pool elevation for OKC withdrawals (feet) */
  minimumForWithdrawal: 590,
  /** Conservation pool elevation (feet) */
  conservationPool: 599,
  /** Below this level, recreation and fish/wildlife are severely impacted */
  criticalLevel: 585
} as const

/**
 * Primary water bodies covered by the Choctaw-Chickasaw Water Settlement
 */
export const SETTLEMENT_WATER_BODIES: WaterBody[] = [
  // ===== CRITICAL SETTLEMENT RESERVOIRS =====
  {
    id: 'sardis',
    name: 'Sardis Lake',
    type: 'reservoir',
    usgsId: '07335775',
    conservationPool: 599,
    floodPoolTop: 607,
    streambed: 530,
    topOfDam: 631,
    withdrawalMinimum: 590,
    description: 'Critical reservoir for the water settlement. Oklahoma City has storage rights but withdrawals are restricted based on lake levels to protect recreation, fish, and wildlife.',
    county: 'Pushmataha/Latimer',
    isSettlementCritical: true,
    agency: 'USACE',
    parameterCode: '62614'
  },
  {
    id: 'mcgee-creek',
    name: 'McGee Creek Reservoir',
    type: 'reservoir',
    usgsId: '07333900',
    conservationPool: 577,
    floodPoolTop: 595.5,
    streambed: 461,
    topOfDam: 612,
    description: 'Bureau of Reclamation reservoir providing water supply for Oklahoma City and Atoka.',
    county: 'Atoka',
    isSettlementCritical: true,
    agency: 'BOR',
    parameterCode: '62614'
  },
  {
    id: 'hugo',
    name: 'Hugo Lake',
    type: 'reservoir',
    usgsId: '07336000',
    conservationPool: 406,
    floodPoolTop: 433,
    streambed: 360,
    topOfDam: 449,
    description: 'Reservoir on the Kiamichi River providing flood control, water supply, and recreation.',
    county: 'Choctaw',
    isSettlementCritical: true,
    agency: 'USACE',
    parameterCode: '62614'
  },
  {
    id: 'broken-bow',
    name: 'Broken Bow Lake',
    type: 'reservoir',
    usgsId: '07337900',
    conservationPool: 599.5,
    floodPoolTop: 620,
    streambed: 420,
    topOfDam: 645,
    description: 'Major reservoir on the Mountain Fork River with significant recreation and water supply value.',
    county: 'McCurtain',
    isSettlementCritical: true,
    agency: 'USACE',
    parameterCode: '62614'
  },
  {
    id: 'pine-creek',
    name: 'Pine Creek Lake',
    type: 'reservoir',
    usgsId: '07338500',
    conservationPool: 438,
    floodPoolTop: 480,
    streambed: 384,
    topOfDam: 509,
    description: 'Reservoir on the Little River providing flood control and recreation.',
    county: 'McCurtain',
    isSettlementCritical: true,
    agency: 'USACE',
    parameterCode: '62614'
  },
  {
    id: 'eufaula',
    name: 'Lake Eufaula',
    type: 'reservoir',
    usgsId: '07245500',
    conservationPool: 585,
    floodPoolTop: 597,
    streambed: 498,
    topOfDam: 612,
    description: 'Largest lake in Oklahoma by volume. Provides hydropower, water supply, navigation, and recreation.',
    county: 'McIntosh/Pittsburg',
    isSettlementCritical: true,
    agency: 'USACE',
    parameterCode: '62614'
  },
  {
    id: 'wister',
    name: 'Wister Lake',
    type: 'reservoir',
    usgsId: '07247000',
    conservationPool: 478,
    floodPoolTop: 502.5,
    streambed: 428.5,
    topOfDam: 527.5,
    description: 'Reservoir on the Poteau River providing flood control and recreation.',
    county: 'Le Flore',
    isSettlementCritical: true,
    agency: 'USACE',
    parameterCode: '62614'
  },
  {
    id: 'atoka',
    name: 'Atoka Lake',
    type: 'reservoir',
    usgsId: '07334200',
    conservationPool: 582,
    floodPoolTop: 594,
    streambed: 520,
    topOfDam: 610,
    description: 'Primary water supply reservoir for Oklahoma City via pipeline.',
    county: 'Atoka',
    isSettlementCritical: true,
    agency: 'State',
    parameterCode: '00065'
  },
  // ===== KIAMICHI RIVER MONITORING STATIONS =====
  {
    id: 'kiamichi-big-cedar',
    name: 'Kiamichi River near Big Cedar',
    type: 'river',
    usgsId: '07335700',
    description: 'Upper Kiamichi River monitoring station. Critical for tracking river flows that feed Sardis Lake.',
    county: 'Le Flore',
    isSettlementCritical: true,
    agency: 'USGS',
    parameterCode: '00060'
  },
  {
    id: 'kiamichi-antlers',
    name: 'Kiamichi River near Antlers',
    type: 'river',
    usgsId: '07336200',
    description: 'Mid-Kiamichi River monitoring station. Key location for streamflow monitoring under the settlement.',
    county: 'Pushmataha',
    isSettlementCritical: true,
    agency: 'USGS',
    parameterCode: '00060'
  }
]

/**
 * Get alert level based on current water level and conservation pool
 */
export function getAlertLevel(
  currentLevel: number,
  conservationPool: number
): AlertLevel {
  const percentFull = (currentLevel / conservationPool) * 100

  if (percentFull >= ALERT_THRESHOLDS.normal) return 'normal'
  if (percentFull >= ALERT_THRESHOLDS.watch) return 'watch'
  if (percentFull >= ALERT_THRESHOLDS.warning) return 'warning'
  return 'critical'
}

/**
 * Calculate pool percentage
 */
export function calculatePoolPercentage(
  currentLevel: number,
  conservationPool: number,
  streambed: number
): number {
  // Pool percentage = (current - streambed) / (conservation - streambed) * 100
  const totalCapacity = conservationPool - streambed
  const currentStorage = currentLevel - streambed
  return Math.max(0, Math.min(100, (currentStorage / totalCapacity) * 100))
}

/**
 * Check if Sardis Lake withdrawals are restricted
 */
export function isSardisWithdrawalRestricted(currentLevel: number): boolean {
  return currentLevel < SARDIS_WITHDRAWAL_THRESHOLDS.minimumForWithdrawal
}

/**
 * Get alert message for water body
 */
export function getAlertMessage(
  waterBody: WaterBody,
  currentLevel: number
): string | null {
  if (!waterBody.conservationPool) return null

  const alertLevel = getAlertLevel(currentLevel, waterBody.conservationPool)

  // Special case for Sardis Lake
  if (waterBody.id === 'sardis') {
    if (currentLevel < SARDIS_WITHDRAWAL_THRESHOLDS.criticalLevel) {
      return 'CRITICAL: Lake level severely impacts recreation and wildlife. OKC withdrawals prohibited.'
    }
    if (currentLevel < SARDIS_WITHDRAWAL_THRESHOLDS.minimumForWithdrawal) {
      return 'WARNING: Below minimum level for Oklahoma City withdrawals per settlement agreement.'
    }
  }

  switch (alertLevel) {
    case 'critical':
      return 'CRITICAL: Water level significantly below conservation pool.'
    case 'warning':
      return 'WARNING: Water level below normal operating range.'
    case 'watch':
      return 'WATCH: Water level slightly below conservation pool.'
    default:
      return null
  }
}

/**
 * Get water body by ID
 */
export function getWaterBody(id: string): WaterBody | undefined {
  return SETTLEMENT_WATER_BODIES.find(wb => wb.id === id)
}

/**
 * Get all reservoirs
 */
export function getReservoirs(): WaterBody[] {
  return SETTLEMENT_WATER_BODIES.filter(wb => wb.type === 'reservoir')
}

/**
 * Get all rivers
 */
export function getRivers(): WaterBody[] {
  return SETTLEMENT_WATER_BODIES.filter(wb => wb.type === 'river')
}
