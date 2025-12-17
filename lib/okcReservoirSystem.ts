/**
 * Oklahoma City Reservoir System Configuration
 * Per Exhibit 13 of the Choctaw-Chickasaw Water Settlement Agreement
 *
 * The settlement restricts Oklahoma City withdrawals from Sardis Lake based on
 * the COMBINED storage across OKC's entire reservoir system, not individual lake levels.
 */

export interface OKCReservoir {
  id: string
  name: string
  /** USGS site ID for real-time data */
  usgsId?: string
  /** Top elevation in MSL (feet) */
  topElevation: number
  /** Lower elevation in MSL (feet) */
  lowerElevation: number
  /** Maximum live storage capacity in acre-feet */
  maxLiveStorage: number
  /** Elevation at 75% storage (MSL feet) - only applies to some reservoirs */
  elevation75Percent?: number
  /** Elevation at 65% storage (MSL feet) - only applies to some reservoirs */
  elevation65Percent?: number
  /** Elevation at 50% storage (MSL feet) - only applies to some reservoirs */
  elevation50Percent?: number
}

/**
 * Oklahoma City's six reservoir system
 * Data source: Exhibit 13 - Lake Level Release Restriction Accounting Memorandum
 */
export const OKC_RESERVOIR_SYSTEM: OKCReservoir[] = [
  {
    id: 'atoka',
    name: 'Lake Atoka',
    usgsId: '07334200',
    topElevation: 590.0,
    lowerElevation: 550.0,
    maxLiveStorage: 107940 // acre-feet
  },
  {
    id: 'canton',
    name: 'Canton Lake',
    topElevation: 1615.4,
    lowerElevation: 1596.5,
    maxLiveStorage: 68023 // acre-feet
  },
  {
    id: 'draper',
    name: 'Stanley Draper Lake',
    topElevation: 1191.0,
    lowerElevation: 1145.0,
    maxLiveStorage: 72195, // acre-feet
    elevation75Percent: 1183.1,
    elevation65Percent: 1179.5,
    elevation50Percent: 1173.7
  },
  {
    id: 'hefner',
    name: 'Lake Hefner',
    topElevation: 1199.0,
    lowerElevation: 1165.0,
    maxLiveStorage: 57993, // acre-feet
    elevation75Percent: 1193.1,
    elevation65Percent: 1190.4,
    elevation50Percent: 1186.1
  },
  {
    id: 'mcgee',
    name: 'McGee Creek Reservoir',
    usgsId: '07333900',
    topElevation: 577.1,
    lowerElevation: 533.0,
    maxLiveStorage: 88445 // acre-feet
  },
  {
    id: 'overholser',
    name: 'Lake Overholser',
    topElevation: 1241.5,
    lowerElevation: 1231.8,
    maxLiveStorage: 12909 // acre-feet
  }
]

/**
 * Total system capacity per Exhibit 13
 */
export const TOTAL_SYSTEM_CAPACITY = 407105 // acre-feet

/**
 * Combined storage percentage thresholds per the settlement agreement
 */
export const COMBINED_STORAGE_THRESHOLDS = {
  /** At or above 75%: Normal operations, full withdrawal rights */
  normal: 75,
  /** 65-75%: Watch status, heightened monitoring */
  watch: 65,
  /** 50-65%: Warning status, potential restrictions */
  warning: 50,
  /** Below 50%: Critical status, withdrawal restrictions may apply */
  critical: 50
} as const

/**
 * Calculate storage in acre-feet for a reservoir given current elevation
 */
export function calculateStorage(
  reservoir: OKCReservoir,
  currentElevation: number
): number {
  // Storage is proportional to elevation above lower elevation
  const totalRange = reservoir.topElevation - reservoir.lowerElevation
  const currentRange = currentElevation - reservoir.lowerElevation

  // Clamp to 0-100% range
  const percentFull = Math.max(0, Math.min(1, currentRange / totalRange))

  return reservoir.maxLiveStorage * percentFull
}

/**
 * Calculate combined storage across all OKC reservoirs
 */
export function calculateCombinedStorage(
  reservoirLevels: Map<string, number>
): {
  totalStorage: number
  percentage: number
  capacityAcreFeet: number
} {
  let totalStorage = 0

  for (const reservoir of OKC_RESERVOIR_SYSTEM) {
    const currentLevel = reservoirLevels.get(reservoir.id)
    if (currentLevel !== undefined) {
      totalStorage += calculateStorage(reservoir, currentLevel)
    }
  }

  const percentage = (totalStorage / TOTAL_SYSTEM_CAPACITY) * 100

  return {
    totalStorage,
    percentage,
    capacityAcreFeet: TOTAL_SYSTEM_CAPACITY
  }
}

/**
 * Determine system status based on combined storage percentage
 */
export function getCombinedStorageStatus(
  percentage: number
): 'normal' | 'watch' | 'warning' | 'critical' {
  if (percentage >= COMBINED_STORAGE_THRESHOLDS.normal) return 'normal'
  if (percentage >= COMBINED_STORAGE_THRESHOLDS.watch) return 'watch'
  if (percentage >= COMBINED_STORAGE_THRESHOLDS.warning) return 'warning'
  return 'critical'
}

/**
 * Check if Sardis Lake withdrawals should be restricted based on combined storage
 */
export function isSardisWithdrawalRestricted(
  combinedStoragePercentage: number
): boolean {
  // Per Exhibit 13, withdrawals are restricted when combined storage falls below certain thresholds
  // The exact threshold depends on the settlement terms, but typically this would be
  // at the "warning" or "critical" levels
  return combinedStoragePercentage < COMBINED_STORAGE_THRESHOLDS.warning
}

/**
 * Get detailed message about withdrawal restrictions
 */
export function getWithdrawalRestrictionMessage(
  combinedStoragePercentage: number
): string | null {
  const status = getCombinedStorageStatus(combinedStoragePercentage)

  switch (status) {
    case 'critical':
      return `CRITICAL: OKC system storage at ${combinedStoragePercentage.toFixed(1)}% (below 50%). Sardis Lake withdrawals RESTRICTED per settlement agreement.`
    case 'warning':
      return `WARNING: OKC system storage at ${combinedStoragePercentage.toFixed(1)}% (below 65%). Withdrawal restrictions may apply per settlement agreement.`
    case 'watch':
      return `WATCH: OKC system storage at ${combinedStoragePercentage.toFixed(1)}% (65-75%). Heightened monitoring per settlement agreement.`
    case 'normal':
      return null
  }
}

/**
 * Get OKC reservoir by ID
 */
export function getOKCReservoir(id: string): OKCReservoir | undefined {
  return OKC_RESERVOIR_SYSTEM.find(r => r.id === id)
}
