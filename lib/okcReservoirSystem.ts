/**
 * Oklahoma City Reservoir System Configuration
 * Per Exhibit 13 of the Choctaw-Chickasaw Water Settlement Agreement (2016)
 *
 * The settlement restricts Oklahoma City withdrawals from Sardis Lake based on
 * the COMBINED storage across OKC's entire reservoir system, not individual lake levels.
 *
 * DROUGHT CONDITION DETERMINATION (WSA Section 6):
 * ALL THREE conditions must be met:
 * 1. Cumulative system storage < threshold
 * 2. Hefner individually < threshold
 * 3. Draper individually < threshold
 *
 * Data Sources:
 * - Lake Hefner: https://waterdata.usgs.gov/monitoring-location/USGS-07159550/
 * - Stanley Draper: https://waterdata.usgs.gov/monitoring-location/USGS-07229445/
 * - Lake Overholser: https://waterdata.usgs.gov/monitoring-location/USGS-07240500/
 * - Canton Lake: https://waterdata.usgs.gov/monitoring-location/USGS-07238500/
 * - Atoka Reservoir: https://waterdata.usgs.gov/monitoring-location/USGS-07333010/
 * - McGee Creek: https://waterdata.usgs.gov/monitoring-location/USGS-07333900/
 */

export interface OKCReservoir {
  id: string
  name: string
  /** USGS site ID for real-time data */
  usgsId: string
  /** USACE station ID (where applicable) */
  usaceId?: string
  /** Direct link to USGS monitoring page */
  usgsUrl: string
  /** Top elevation in MSL (feet) - Full Pool */
  topElevation: number
  /** Lower elevation in MSL (feet) - Dead Pool / Below Outlets */
  lowerElevation: number
  /** Maximum live storage capacity in acre-feet */
  maxLiveStorage: number
  /** Full storage capacity in acre-feet (from Exhibit 13) */
  fullStorage: number
  /** Dead pool storage in acre-feet */
  deadPoolStorage: number
  /** Inactive storage (below outlets) in acre-feet */
  inactiveStorage?: number
  /** Inaccessible storage (water quality issues) in acre-feet */
  inaccessibleStorage?: number
  /** Transit loss percentage (for Canton) */
  transitLossPercent?: number
  /** Elevation at 75% storage (MSL feet) - only applies to Hefner and Draper */
  elevation75Percent?: number
  /** Elevation at 65% storage (MSL feet) - only applies to Hefner and Draper */
  elevation65Percent?: number
  /** Elevation at 50% storage (MSL feet) - only applies to Hefner and Draper */
  elevation50Percent?: number
  /** Whether this reservoir is critical for drought calculations */
  isDroughtCritical: boolean
}

/**
 * Oklahoma City's six reservoir system
 * Data source: Exhibit 13 - Lake Level Release Restriction Accounting Memorandum
 *
 * NOTE: Canton Lake has 30% transit loss deduction for water released to North Canadian River
 * Raw live storage would be 97,176 AF but effective is 68,023 AF (70% of raw)
 */
export const OKC_RESERVOIR_SYSTEM: OKCReservoir[] = [
  {
    id: 'atoka',
    name: 'Atoka Reservoir',
    usgsId: '07333010',
    usaceId: 'ATKO2',
    usgsUrl: 'https://waterdata.usgs.gov/monitoring-location/USGS-07333010/',
    topElevation: 590.0,
    lowerElevation: 550.0,
    maxLiveStorage: 107940, // acre-feet
    fullStorage: 109819,
    deadPoolStorage: 1879,
    inactiveStorage: 100, // below 540'
    inaccessibleStorage: 1779, // water quality
    isDroughtCritical: false
  },
  {
    id: 'canton',
    name: 'Canton Lake',
    usgsId: '07238500',
    usaceId: 'CANO2',
    usgsUrl: 'https://waterdata.usgs.gov/monitoring-location/USGS-07238500/',
    topElevation: 1615.4,
    lowerElevation: 1596.5,
    maxLiveStorage: 68023, // acre-feet (after 30% transit loss)
    fullStorage: 111353,
    deadPoolStorage: 14177,
    inactiveStorage: 14177, // below 1,596.5'
    transitLossPercent: 30, // Water released loses 30% in North Canadian River
    isDroughtCritical: false
  },
  {
    id: 'draper',
    name: 'Stanley Draper Lake',
    usgsId: '07229445',
    usaceId: 'LSDO2',
    usgsUrl: 'https://waterdata.usgs.gov/monitoring-location/USGS-07229445/',
    topElevation: 1191.0,
    lowerElevation: 1145.0,
    maxLiveStorage: 72195, // acre-feet
    fullStorage: 87155,
    deadPoolStorage: 14960,
    inactiveStorage: 2971, // below 1,123.5'
    inaccessibleStorage: 11989, // water quality (from 2011 drought)
    elevation75Percent: 1183.1,
    elevation65Percent: 1179.5,
    elevation50Percent: 1173.7,
    isDroughtCritical: true // Required for drought determination
  },
  {
    id: 'hefner',
    name: 'Lake Hefner',
    usgsId: '07159550',
    usaceId: 'HEFO2',
    usgsUrl: 'https://waterdata.usgs.gov/monitoring-location/USGS-07159550/',
    topElevation: 1199.0,
    lowerElevation: 1165.0,
    maxLiveStorage: 57593, // acre-feet
    fullStorage: 69894,
    deadPoolStorage: 12301,
    inactiveStorage: 2322, // below 1,148'
    inaccessibleStorage: 9979, // water quality
    elevation75Percent: 1193.1,
    elevation65Percent: 1190.4,
    elevation50Percent: 1186.1,
    isDroughtCritical: true // Required for drought determination
  },
  {
    id: 'mcgee',
    name: 'McGee Creek Reservoir',
    usgsId: '07333900',
    usgsUrl: 'https://waterdata.usgs.gov/monitoring-location/USGS-07333900/',
    topElevation: 577.1,
    lowerElevation: 533.0,
    maxLiveStorage: 88445, // acre-feet
    fullStorage: 99492,
    deadPoolStorage: 11047,
    inactiveStorage: 2196, // below 515'
    inaccessibleStorage: 8851, // water quality
    isDroughtCritical: false
  },
  {
    id: 'overholser',
    name: 'Lake Overholser',
    usgsId: '07240500',
    usgsUrl: 'https://waterdata.usgs.gov/monitoring-location/USGS-07240500/',
    topElevation: 1241.5,
    lowerElevation: 1231.8,
    maxLiveStorage: 12909, // acre-feet
    fullStorage: 13514,
    deadPoolStorage: 605,
    inactiveStorage: 385, // silted in
    inaccessibleStorage: 220, // water quality
    isDroughtCritical: false
  }
]

/**
 * Total system capacity per Exhibit 13
 * Verification: 107,940 + 68,023 + 72,195 + 57,593 + 88,445 + 12,909 = 407,105 AF
 */
export const TOTAL_SYSTEM_CAPACITY = 407105 // acre-feet

/**
 * Acre-feet thresholds for combined storage (calculated from percentages)
 */
export const STORAGE_THRESHOLDS_AF = {
  /** 75% of 407,105 AF */
  threshold75: 305329, // 407,105 × 0.75
  /** 65% of 407,105 AF */
  threshold65: 264618, // 407,105 × 0.65
  /** 50% of 407,105 AF */
  threshold50: 203553  // 407,105 × 0.50
} as const

/**
 * WSA Drought Condition Levels
 * Per Section 6 of the Water Settlement Agreement
 *
 * ALL THREE conditions must be met for a drought determination:
 * 1. Cumulative City Reservoirs storage < threshold
 * 2. Hefner individually < threshold
 * 3. Draper individually < threshold
 */
export type DroughtCondition = 'none' | 'moderate' | 'advanced' | 'extreme'

export const WSA_DROUGHT_THRESHOLDS = {
  /** No drought: >= 75% of live storage */
  none: { min: 75, max: 100 },
  /** Moderate drought: 65-75% of live storage */
  moderate: { min: 65, max: 75 },
  /** Advanced drought: 50-65% of live storage */
  advanced: { min: 50, max: 65 },
  /** Extreme drought: < 50% of live storage */
  extreme: { min: 0, max: 50 }
} as const

/**
 * Sardis Lake Release Restrictions by Season and Drought Condition
 * Per WSA Section 6 (Lake Level Release Restrictions)
 */
export const SARDIS_RELEASE_RESTRICTIONS = {
  /** April 1 - August 31: Full pool required for releases */
  summerSeason: {
    startMonth: 4, // April
    endMonth: 8,   // August
    minimumElevation: 599, // MSL feet (full pool)
    description: 'Summer season (Apr 1 - Aug 31): Sardis must be at 599\' MSL for releases'
  },
  /** September 1 - March 31: Lower threshold allowed */
  winterSeason: {
    startMonth: 9,  // September
    endMonth: 3,    // March (next year)
    minimumElevation: 595, // MSL feet
    description: 'Winter season (Sep 1 - Mar 31): Sardis must be at 595\' MSL for releases'
  },
  /** Drought conditions allow lower withdrawal levels */
  drought: {
    moderate: {
      minimumElevation: 597, // MSL feet
      allowedPeriod: 'July 5 - August 31 only',
      description: 'Moderate drought: Releases allowed down to 597\' MSL (Jul 5 - Aug 31)'
    },
    advanced: {
      minimumElevation: 592, // MSL feet
      allowedPeriod: 'Year-round',
      description: 'Advanced drought: Releases allowed down to 592\' MSL (year-round)'
    },
    extreme: {
      minimumElevation: 589, // MSL feet
      allowedPeriod: 'Year-round',
      description: 'Extreme drought: Releases allowed down to 589\' MSL (year-round)'
    }
  }
} as const

/**
 * Sardis Lake Conservation Storage Allocation
 * Total Conservation Storage: 297,200 acre-feet
 */
export const SARDIS_STORAGE_ALLOCATION = {
  totalConservation: 297200, // acre-feet
  lakeLevelMaintenance: 142676, // 48% - Recreation, Fish & Wildlife
  administrativeSetAside: 37908, // 13% - SE Oklahoma use (20,000 AFY yield)
  oklahomaCity: 116616, // 39% - City of Oklahoma City use
  /** Verification: 142,676 + 37,908 + 116,616 = 297,200 AF */
} as const

/**
 * City Permit Water Appropriation
 */
export const CITY_PERMIT = {
  annualAppropriation: 115000, // AFY from Kiamichi Basin
  diversionRate: 250, // cfs at Moyers Crossing
  bypassRequirement: 50, // cfs must flow past diversion point
  totalFlowRequired: 300, // cfs (250 + 50)
  pointOfDiversion: 'Moyers Crossing',
  usgsStationMoyers: '07336500' // USGS station at point of diversion
} as const

/**
 * Combined storage percentage thresholds per the settlement agreement
 * @deprecated Use WSA_DROUGHT_THRESHOLDS for accurate drought determination
 */
export const COMBINED_STORAGE_THRESHOLDS = {
  /** At or above 75%: Normal operations, full withdrawal rights */
  normal: 75,
  /** 65-75%: Moderate drought, heightened monitoring */
  moderate: 65,
  /** 50-65%: Advanced drought, withdrawal restrictions apply */
  advanced: 50,
  /** Below 50%: Extreme drought, severe withdrawal restrictions */
  extreme: 50
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

  // Apply transit loss for Canton Lake
  let storage = reservoir.maxLiveStorage * percentFull
  if (reservoir.transitLossPercent) {
    // Transit loss already factored into maxLiveStorage for Canton
    // No additional adjustment needed here
  }

  return storage
}

/**
 * Calculate storage percentage for an individual reservoir
 */
export function calculateReservoirPercentage(
  reservoir: OKCReservoir,
  currentElevation: number
): number {
  const totalRange = reservoir.topElevation - reservoir.lowerElevation
  const currentRange = currentElevation - reservoir.lowerElevation
  return Math.max(0, Math.min(100, (currentRange / totalRange) * 100))
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
  reservoirDetails: Array<{
    id: string
    name: string
    currentStorage: number
    percentage: number
    isDroughtCritical: boolean
  }>
} {
  let totalStorage = 0
  const reservoirDetails: Array<{
    id: string
    name: string
    currentStorage: number
    percentage: number
    isDroughtCritical: boolean
  }> = []

  for (const reservoir of OKC_RESERVOIR_SYSTEM) {
    const currentLevel = reservoirLevels.get(reservoir.id)
    if (currentLevel !== undefined) {
      const storage = calculateStorage(reservoir, currentLevel)
      const percentage = calculateReservoirPercentage(reservoir, currentLevel)
      totalStorage += storage
      reservoirDetails.push({
        id: reservoir.id,
        name: reservoir.name,
        currentStorage: storage,
        percentage,
        isDroughtCritical: reservoir.isDroughtCritical
      })
    }
  }

  const percentage = (totalStorage / TOTAL_SYSTEM_CAPACITY) * 100

  return {
    totalStorage,
    percentage,
    capacityAcreFeet: TOTAL_SYSTEM_CAPACITY,
    reservoirDetails
  }
}

/**
 * Determine WSA drought condition based on storage levels
 * Per Section 6: ALL THREE conditions must be met:
 * 1. Cumulative system storage < threshold
 * 2. Hefner individually < threshold
 * 3. Draper individually < threshold
 */
export function determineWSADroughtCondition(
  combinedPercentage: number,
  hefnerPercentage: number | undefined,
  draperPercentage: number | undefined
): {
  condition: DroughtCondition
  meetsAllCriteria: boolean
  details: {
    cumulativeMet: boolean
    hefnerMet: boolean | null
    draperMet: boolean | null
  }
} {
  // Helper to check if percentage is below threshold
  const isBelowThreshold = (pct: number | undefined, threshold: number) =>
    pct !== undefined && pct < threshold

  // Check each threshold level
  const checkThreshold = (threshold: number) => ({
    cumulativeMet: combinedPercentage < threshold,
    hefnerMet: hefnerPercentage !== undefined ? hefnerPercentage < threshold : null,
    draperMet: draperPercentage !== undefined ? draperPercentage < threshold : null
  })

  // Extreme: All three below 50%
  const extreme = checkThreshold(50)
  if (extreme.cumulativeMet && extreme.hefnerMet && extreme.draperMet) {
    return {
      condition: 'extreme',
      meetsAllCriteria: true,
      details: extreme
    }
  }

  // Advanced: All three below 65%
  const advanced = checkThreshold(65)
  if (advanced.cumulativeMet && advanced.hefnerMet && advanced.draperMet) {
    return {
      condition: 'advanced',
      meetsAllCriteria: true,
      details: advanced
    }
  }

  // Moderate: All three below 75%
  const moderate = checkThreshold(75)
  if (moderate.cumulativeMet && moderate.hefnerMet && moderate.draperMet) {
    return {
      condition: 'moderate',
      meetsAllCriteria: true,
      details: moderate
    }
  }

  // No drought condition
  return {
    condition: 'none',
    meetsAllCriteria: false,
    details: {
      cumulativeMet: combinedPercentage < 75,
      hefnerMet: hefnerPercentage !== undefined ? hefnerPercentage < 75 : null,
      draperMet: draperPercentage !== undefined ? draperPercentage < 75 : null
    }
  }
}

/**
 * Get minimum Sardis Lake elevation for releases based on current conditions
 */
export function getSardisMinimumElevation(
  droughtCondition: DroughtCondition,
  currentDate: Date = new Date()
): {
  minimumElevation: number
  reason: string
  isDroughtOverride: boolean
} {
  const month = currentDate.getMonth() + 1 // 1-12
  const day = currentDate.getDate()

  // Check drought condition first (overrides seasonal)
  if (droughtCondition === 'extreme') {
    return {
      minimumElevation: SARDIS_RELEASE_RESTRICTIONS.drought.extreme.minimumElevation,
      reason: SARDIS_RELEASE_RESTRICTIONS.drought.extreme.description,
      isDroughtOverride: true
    }
  }

  if (droughtCondition === 'advanced') {
    return {
      minimumElevation: SARDIS_RELEASE_RESTRICTIONS.drought.advanced.minimumElevation,
      reason: SARDIS_RELEASE_RESTRICTIONS.drought.advanced.description,
      isDroughtOverride: true
    }
  }

  if (droughtCondition === 'moderate') {
    // Moderate drought only allows lower levels July 5 - August 31
    if ((month === 7 && day >= 5) || month === 8) {
      return {
        minimumElevation: SARDIS_RELEASE_RESTRICTIONS.drought.moderate.minimumElevation,
        reason: SARDIS_RELEASE_RESTRICTIONS.drought.moderate.description,
        isDroughtOverride: true
      }
    }
  }

  // Seasonal restrictions
  const isSummerSeason = month >= 4 && month <= 8 // April through August
  if (isSummerSeason) {
    return {
      minimumElevation: SARDIS_RELEASE_RESTRICTIONS.summerSeason.minimumElevation,
      reason: SARDIS_RELEASE_RESTRICTIONS.summerSeason.description,
      isDroughtOverride: false
    }
  }

  // Winter season
  return {
    minimumElevation: SARDIS_RELEASE_RESTRICTIONS.winterSeason.minimumElevation,
    reason: SARDIS_RELEASE_RESTRICTIONS.winterSeason.description,
    isDroughtOverride: false
  }
}

/**
 * Determine system status based on combined storage percentage
 * @deprecated Use determineWSADroughtCondition for accurate WSA compliance
 */
export function getCombinedStorageStatus(
  percentage: number
): 'normal' | 'moderate' | 'advanced' | 'extreme' {
  if (percentage >= COMBINED_STORAGE_THRESHOLDS.normal) return 'normal'
  if (percentage >= COMBINED_STORAGE_THRESHOLDS.moderate) return 'moderate'
  if (percentage >= COMBINED_STORAGE_THRESHOLDS.advanced) return 'advanced'
  return 'extreme'
}

/**
 * Check if Sardis Lake withdrawals should be restricted based on combined storage
 */
export function isSardisWithdrawalRestricted(
  combinedStoragePercentage: number
): boolean {
  // Per Exhibit 13, withdrawals are restricted when combined storage falls below certain thresholds
  return combinedStoragePercentage < COMBINED_STORAGE_THRESHOLDS.advanced
}

/**
 * Get detailed message about withdrawal restrictions
 */
export function getWithdrawalRestrictionMessage(
  combinedStoragePercentage: number,
  droughtCondition?: DroughtCondition
): string | null {
  const status = getCombinedStorageStatus(combinedStoragePercentage)

  switch (status) {
    case 'extreme':
      return `EXTREME DROUGHT: OKC system storage at ${combinedStoragePercentage.toFixed(1)}% (below 50%). Sardis Lake releases allowed down to 589' MSL per settlement agreement.`
    case 'advanced':
      return `ADVANCED DROUGHT: OKC system storage at ${combinedStoragePercentage.toFixed(1)}% (below 65%). Sardis Lake releases allowed down to 592' MSL per settlement agreement.`
    case 'moderate':
      return `MODERATE DROUGHT: OKC system storage at ${combinedStoragePercentage.toFixed(1)}% (65-75%). Heightened monitoring; releases to 597' MSL allowed July 5-Aug 31.`
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

/**
 * Get drought-critical reservoirs (Hefner and Draper)
 */
export function getDroughtCriticalReservoirs(): OKCReservoir[] {
  return OKC_RESERVOIR_SYSTEM.filter(r => r.isDroughtCritical)
}

/**
 * Format storage in human-readable format
 */
export function formatStorage(acreFeet: number): string {
  if (acreFeet >= 1000) {
    return `${(acreFeet / 1000).toFixed(1)}K AF`
  }
  return `${acreFeet.toFixed(0)} AF`
}

/**
 * Get drought condition display properties
 */
export function getDroughtConditionDisplay(condition: DroughtCondition): {
  label: string
  color: string
  bgColor: string
  borderColor: string
  description: string
} {
  switch (condition) {
    case 'extreme':
      return {
        label: 'Extreme Drought',
        color: 'text-red-900',
        bgColor: 'bg-red-100',
        borderColor: 'border-red-300',
        description: 'Below 50% - Severe withdrawal restrictions apply'
      }
    case 'advanced':
      return {
        label: 'Advanced Drought',
        color: 'text-amber-900',
        bgColor: 'bg-amber-100',
        borderColor: 'border-amber-300',
        description: '50-65% - Withdrawal restrictions in effect'
      }
    case 'moderate':
      return {
        label: 'Moderate Drought',
        color: 'text-yellow-900',
        bgColor: 'bg-yellow-100',
        borderColor: 'border-yellow-300',
        description: '65-75% - Heightened monitoring required'
      }
    case 'none':
    default:
      return {
        label: 'Normal',
        color: 'text-emerald-900',
        bgColor: 'bg-emerald-100',
        borderColor: 'border-emerald-300',
        description: 'Above 75% - Normal operations'
      }
  }
}
