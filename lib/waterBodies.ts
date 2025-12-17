/**
 * Water Bodies Configuration for Choctaw-Chickasaw Water Settlement Agreement
 *
 * The settlement covers 22 counties in southeastern Oklahoma and includes
 * protections for water bodies critical to tribal sovereignty, municipal supply,
 * and ecological health.
 *
 * Data Sources:
 * - U.S. Army Corps of Engineers, Tulsa District (USACE SWT)
 * - Bureau of Reclamation
 * - USGS National Water Information System
 * - Choctaw-Chickasaw Nations Water Settlement Act (2016, WIIN Act)
 */

export type WaterBodyType = 'reservoir' | 'river' | 'lake'
export type AlertLevel = 'normal' | 'watch' | 'warning' | 'critical'
export type DataSource = 'usace' | 'usgs' | 'bor'

export interface WaterBody {
  id: string
  name: string
  type: WaterBodyType
  /** USACE site code (e.g., CYDO2 for Sardis) */
  usaceCode?: string
  /** USGS site ID for backup/stream data */
  usgsId?: string
  /** Conservation pool elevation in feet */
  conservationPool: number
  /** Top of flood pool elevation in feet */
  floodPoolTop?: number
  /** Streambed elevation in feet */
  streambed?: number
  /** Top of dam elevation in feet */
  topOfDam?: number
  /** Minimum level before OKC withdrawal restrictions apply (for Sardis) */
  withdrawalMinimum?: number
  /** Short description */
  description: string
  /** Detailed settlement information */
  settlementInfo: string
  /** County location */
  county: string
  /** Whether this is a critical settlement water body */
  isSettlementCritical: boolean
  /** Primary data source */
  dataSource: DataSource
  /** Managing agency */
  agency: 'USACE' | 'BOR' | 'USGS' | 'State'
  /** Surface area at conservation pool (acres) */
  surfaceArea?: number
  /** Storage capacity at conservation pool (acre-feet) */
  storageCapacity?: number
  /** Year completed */
  yearCompleted?: number
}

/**
 * Alert level thresholds as percentage of conservation pool capacity
 */
export const ALERT_THRESHOLDS = {
  normal: 95,    // >= 95% of conservation pool capacity
  watch: 85,     // 85-95% of conservation pool capacity
  warning: 75,   // 75-85% of conservation pool capacity
  critical: 75   // < 75% of conservation pool capacity
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
 * Pool elevations and data from U.S. Army Corps of Engineers, Tulsa District
 */
export const SETTLEMENT_WATER_BODIES: WaterBody[] = [
  // ===== CRITICAL SETTLEMENT RESERVOIRS =====
  {
    id: 'sardis',
    name: 'Sardis Lake',
    type: 'reservoir',
    usaceCode: 'CYDO2',
    usgsId: '07335790',
    conservationPool: 599.0,
    floodPoolTop: 607.0,
    streambed: 530.0,
    topOfDam: 631.0,
    withdrawalMinimum: 590,
    surfaceArea: 14200,
    storageCapacity: 268909,
    yearCompleted: 1982,
    description: 'Critical reservoir for the water settlement. OKC withdrawals restricted based on lake levels.',
    settlementInfo: `**Sardis Lake** is the most critical water body in the Choctaw-Chickasaw Water Settlement Agreement.

**Settlement Provisions:**
• Oklahoma City acquired storage rights in Sardis Lake for municipal water supply
• Withdrawals are **strictly prohibited** when pool elevation falls below **590 feet** (per Oklahoma Department of Wildlife Conservation recommendations)
• Below **585 feet**, recreation and fish/wildlife are severely impacted and all withdrawals cease
• The conservation pool elevation is **599 feet**

**Water Level Restrictions:**
• ≥599 ft: Normal operations permitted
• 590-599 ft: OKC withdrawals allowed with monitoring
• <590 ft: **OKC withdrawals PROHIBITED** to protect recreation and wildlife
• <585 ft: **CRITICAL** - severe ecological impact

**Why This Matters:**
The settlement prevents Oklahoma City from making drastic withdrawals from Sardis Lake, even during drought conditions. These restrictions protect the local tourism and recreation economy that depends on the lake, while also preserving fish and wildlife habitat.

**Legal Authority:**
Choctaw and Chickasaw Nations Water Settlement (P.L. 114-322, WIIN Act, December 2016)`,
    county: 'Pushmataha/Latimer',
    isSettlementCritical: true,
    dataSource: 'usace',
    agency: 'USACE'
  },
  {
    id: 'mcgee-creek',
    name: 'McGee Creek Reservoir',
    type: 'reservoir',
    usaceCode: 'MGCO2',
    conservationPool: 577.0,
    floodPoolTop: 595.5,
    streambed: 461.0,
    topOfDam: 612.0,
    surfaceArea: 3800,
    storageCapacity: 113930,
    yearCompleted: 1985,
    description: 'Bureau of Reclamation reservoir providing water supply for Oklahoma City and Atoka.',
    settlementInfo: `**McGee Creek Reservoir** is a key water supply source managed by the Bureau of Reclamation.

**Settlement Role:**
• Provides municipal water supply for Oklahoma City via pipeline
• Part of the Atoka Pipeline system
• Subject to settlement provisions regarding tribal consultation

**Key Elevations:**
• Conservation Pool: **577 feet**
• Flood Pool Top: **595.5 feet**
• Dam built in 1985

**Capacity:**
• Surface area: 3,800 acres at conservation pool
• Storage: 113,930 acre-feet

**Legal Authority:**
Choctaw and Chickasaw Nations Water Settlement (P.L. 114-322)`,
    county: 'Atoka',
    isSettlementCritical: true,
    dataSource: 'usace',
    agency: 'BOR'
  },
  {
    id: 'hugo',
    name: 'Hugo Lake',
    type: 'reservoir',
    usaceCode: 'HUGO2',
    conservationPool: 406.0,
    floodPoolTop: 433.0,
    streambed: 360.0,
    topOfDam: 449.0,
    surfaceArea: 13250,
    storageCapacity: 158717,
    yearCompleted: 1974,
    description: 'Reservoir on the Kiamichi River providing flood control, water supply, and recreation.',
    settlementInfo: `**Hugo Lake** is located on the Kiamichi River in Choctaw County.

**Settlement Role:**
• Provides flood control for downstream communities
• Recreation and water supply for local area
• Subject to tribal water rights under the settlement

**Key Elevations:**
• Conservation Pool: **406 feet**
• Flood Pool Top: **433 feet**
• Completed in 1974

**Capacity:**
• Surface area: 13,250 acres
• Storage: 158,717 acre-feet

**Legal Authority:**
Choctaw and Chickasaw Nations Water Settlement (P.L. 114-322)`,
    county: 'Choctaw',
    isSettlementCritical: true,
    dataSource: 'usace',
    agency: 'USACE'
  },
  {
    id: 'broken-bow',
    name: 'Broken Bow Lake',
    type: 'reservoir',
    usaceCode: 'BROK2',
    conservationPool: 599.5,
    floodPoolTop: 620.0,
    streambed: 420.0,
    topOfDam: 645.0,
    surfaceArea: 14200,
    storageCapacity: 918070,
    yearCompleted: 1970,
    description: 'Major reservoir on the Mountain Fork River with significant recreation and water supply value.',
    settlementInfo: `**Broken Bow Lake** is one of Oklahoma's premier recreation destinations on the Mountain Fork River.

**Settlement Role:**
• Critical for regional water supply
• Major tourism and recreation economy
• Subject to tribal water rights protections

**Key Elevations:**
• Conservation Pool: **599.5 feet**
• Flood Pool Top: **620 feet**
• Completed in 1970

**Capacity:**
• Surface area: 14,200 acres
• Storage: 918,070 acre-feet (Oklahoma's deepest lake)

**Legal Authority:**
Choctaw and Chickasaw Nations Water Settlement (P.L. 114-322)`,
    county: 'McCurtain',
    isSettlementCritical: true,
    dataSource: 'usace',
    agency: 'USACE'
  },
  {
    id: 'pine-creek',
    name: 'Pine Creek Lake',
    type: 'reservoir',
    usaceCode: 'PCLO2',
    conservationPool: 438.0,
    floodPoolTop: 480.0,
    streambed: 384.0,
    topOfDam: 509.0,
    surfaceArea: 4000,
    storageCapacity: 55000,
    yearCompleted: 1969,
    description: 'Reservoir on the Little River providing flood control and recreation.',
    settlementInfo: `**Pine Creek Lake** is located on the Little River in McCurtain County.

**Settlement Role:**
• Flood control for downstream areas
• Recreation destination
• Subject to tribal water rights under settlement

**Key Elevations:**
• Conservation Pool: **438 feet**
• Flood Pool Top: **480 feet**
• Completed in 1969

**Capacity:**
• Surface area: 4,000 acres
• Storage: 55,000 acre-feet

**Legal Authority:**
Choctaw and Chickasaw Nations Water Settlement (P.L. 114-322)`,
    county: 'McCurtain',
    isSettlementCritical: true,
    dataSource: 'usace',
    agency: 'USACE'
  },
  {
    id: 'eufaula',
    name: 'Lake Eufaula',
    type: 'reservoir',
    usaceCode: 'EUFO2',
    conservationPool: 585.0,
    floodPoolTop: 597.0,
    streambed: 498.0,
    topOfDam: 612.0,
    surfaceArea: 102000,
    storageCapacity: 2099000,
    yearCompleted: 1964,
    description: 'Largest lake in Oklahoma by volume. Provides hydropower, water supply, navigation, and recreation.',
    settlementInfo: `**Lake Eufaula** is the largest lake in Oklahoma, spanning multiple counties.

**Settlement Role:**
• Largest volume lake in Oklahoma
• Provides hydropower, navigation, and water supply
• Subject to settlement provisions

**Key Elevations:**
• Conservation Pool: **585 feet** (range 565-585 for hydropower)
• Flood Pool Top: **597 feet**
• Completed in 1964

**Capacity:**
• Surface area: 102,000 acres
• Storage: 2,099,000 acre-feet
• 600 miles of shoreline

**Legal Authority:**
Choctaw and Chickasaw Nations Water Settlement (P.L. 114-322)`,
    county: 'McIntosh/Pittsburg',
    isSettlementCritical: true,
    dataSource: 'usace',
    agency: 'USACE'
  },
  {
    id: 'wister',
    name: 'Wister Lake',
    type: 'reservoir',
    usaceCode: 'WSLO2',
    conservationPool: 478.0,
    floodPoolTop: 502.5,
    streambed: 428.5,
    topOfDam: 527.5,
    surfaceArea: 6077,
    storageCapacity: 47414,
    yearCompleted: 1949,
    description: 'Reservoir on the Poteau River providing flood control and recreation.',
    settlementInfo: `**Wister Lake** is one of the older reservoirs in the settlement area.

**Settlement Role:**
• Flood control on Poteau River
• Recreation and wildlife habitat
• Subject to tribal water rights

**Key Elevations:**
• Conservation Pool: **478 feet** (year-round since 2002)
• Flood Pool Top: **502.5 feet**
• Completed in 1949

**Capacity:**
• Surface area: 6,077 acres
• Storage: 47,414 acre-feet

**Legal Authority:**
Choctaw and Chickasaw Nations Water Settlement (P.L. 114-322)`,
    county: 'Le Flore',
    isSettlementCritical: true,
    dataSource: 'usace',
    agency: 'USACE'
  },
  {
    id: 'atoka',
    name: 'Atoka Lake',
    type: 'reservoir',
    usaceCode: 'ATKO2',
    conservationPool: 582.0,
    floodPoolTop: 594.0,
    streambed: 520.0,
    topOfDam: 610.0,
    surfaceArea: 5800,
    storageCapacity: 123000,
    yearCompleted: 1959,
    description: 'Primary water supply reservoir for Oklahoma City via pipeline.',
    settlementInfo: `**Atoka Lake** is a critical water supply for Oklahoma City.

**Settlement Role:**
• Primary water supply for OKC via Atoka Pipeline
• Key infrastructure in settlement negotiations
• Subject to tribal consultation requirements

**Key Elevations:**
• Conservation Pool: **582 feet**
• Flood Pool Top: **594 feet**
• Completed in 1959

**Capacity:**
• Surface area: 5,800 acres
• Storage: 123,000 acre-feet

**Legal Authority:**
Choctaw and Chickasaw Nations Water Settlement (P.L. 114-322)`,
    county: 'Atoka',
    isSettlementCritical: true,
    dataSource: 'usace',
    agency: 'State'
  },
  // ===== KIAMICHI RIVER MONITORING STATIONS =====
  {
    id: 'kiamichi-big-cedar',
    name: 'Kiamichi River near Big Cedar',
    type: 'river',
    usgsId: '07335700',
    conservationPool: 0, // Rivers don't have conservation pools
    description: 'Upper Kiamichi River monitoring. Critical for tracking flows feeding Sardis Lake.',
    settlementInfo: `**Kiamichi River near Big Cedar** is a key monitoring point for the upper Kiamichi watershed.

**Settlement Role:**
• Monitors inflows to Sardis Lake
• Critical for water rights management
• Stream flow affects downstream lake levels

**Monitoring:**
• Measures discharge (cubic feet per second)
• Real-time flow data from USGS
• Part of settlement water monitoring network

**Why It Matters:**
The Kiamichi River is central to the water settlement dispute. Flows into Sardis Lake affect Oklahoma City's ability to withdraw water under the settlement restrictions.

**Legal Authority:**
Choctaw and Chickasaw Nations Water Settlement (P.L. 114-322)`,
    county: 'Le Flore',
    isSettlementCritical: true,
    dataSource: 'usgs',
    agency: 'USGS'
  },
  {
    id: 'kiamichi-antlers',
    name: 'Kiamichi River near Antlers',
    type: 'river',
    usgsId: '07336200',
    conservationPool: 0,
    description: 'Mid-Kiamichi River monitoring. Key location for streamflow monitoring under the settlement.',
    settlementInfo: `**Kiamichi River near Antlers** monitors flows in the middle section of the river.

**Settlement Role:**
• Key streamflow monitoring location
• Tracks water availability downstream of Sardis Lake
• Critical for settlement compliance

**Monitoring:**
• Measures discharge (cubic feet per second)
• Real-time USGS monitoring
• Minimum flow requirements may apply

**Legal Authority:**
Choctaw and Chickasaw Nations Water Settlement (P.L. 114-322)`,
    county: 'Pushmataha',
    isSettlementCritical: true,
    dataSource: 'usgs',
    agency: 'USGS'
  }
]

/**
 * Get alert level based on pool percentage
 */
export function getAlertLevel(poolPercentage: number): AlertLevel {
  if (poolPercentage >= ALERT_THRESHOLDS.normal) return 'normal'
  if (poolPercentage >= ALERT_THRESHOLDS.watch) return 'watch'
  if (poolPercentage >= ALERT_THRESHOLDS.warning) return 'warning'
  return 'critical'
}

/**
 * Calculate pool percentage from elevation
 * Uses the formula: (current - streambed) / (conservation - streambed) * 100
 */
export function calculatePoolPercentage(
  currentElevation: number,
  conservationPool: number,
  streambed: number
): number {
  if (!streambed || conservationPool === streambed) return 0
  const totalCapacity = conservationPool - streambed
  const currentStorage = currentElevation - streambed
  return Math.max(0, Math.min(100, (currentStorage / totalCapacity) * 100))
}

/**
 * Calculate how far below conservation pool (in feet)
 */
export function calculateBelowNormal(
  currentElevation: number,
  conservationPool: number
): number {
  return Math.max(0, conservationPool - currentElevation)
}

/**
 * Check if Sardis Lake withdrawals are restricted
 */
export function isSardisWithdrawalRestricted(currentElevation: number): boolean {
  return currentElevation < SARDIS_WITHDRAWAL_THRESHOLDS.minimumForWithdrawal
}

/**
 * Get alert message for water body
 */
export function getAlertMessage(
  waterBody: WaterBody,
  currentElevation: number,
  poolPercentage: number
): string | null {
  if (waterBody.type === 'river') return null

  // Special case for Sardis Lake
  if (waterBody.id === 'sardis') {
    if (currentElevation < SARDIS_WITHDRAWAL_THRESHOLDS.criticalLevel) {
      return 'CRITICAL: Lake level severely impacts recreation and wildlife. All OKC withdrawals prohibited.'
    }
    if (currentElevation < SARDIS_WITHDRAWAL_THRESHOLDS.minimumForWithdrawal) {
      return 'WARNING: Below minimum level for Oklahoma City withdrawals per settlement agreement.'
    }
  }

  const alertLevel = getAlertLevel(poolPercentage)

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
