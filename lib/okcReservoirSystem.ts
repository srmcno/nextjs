/**
 * Oklahoma City Reservoir System Configuration
 * Per Exhibit 13 of the Choctaw-Chickasaw Water Settlement Agreement (2016)
 *
 * NOTE: Eufaula is NOT part of this system. The 6 City Reservoirs are:
 * Canton, Overholser, Hefner, Draper, Atoka, McGee Creek.
 */

export interface OKCReservoir {
  id: string
  name: string
  usgsId: string
  usaceId?: string // For Canton/McGee/Atoka
  topElevation: number // Conservation Pool
  lowerElevation: number // Bottom of Live Storage
  maxLiveStorage: number // AF
  fullStorage: number // AF (Total)
  transitLossFactor?: number // 0.30 for Canton
  isDroughtCritical: boolean // True for Hefner & Draper
}

/**
 * Data from Exhibit 13, Table 2 (Page 9)
 */
export const OKC_RESERVOIR_SYSTEM: OKCReservoir[] = [
  {
    id: 'canton',
    name: 'Canton Lake',
    usgsId: '07238500',
    usaceId: 'CANO2',
    topElevation: 1615.4,
    lowerElevation: 1596.5,
    // Raw Live Storage is 97,176 AF. 
    // Exhibit 13 Table 2 applies 30% loss: 97,176 * (1 - 0.30) = 68,023 AF
    maxLiveStorage: 68023, 
    fullStorage: 111353,
    transitLossFactor: 0.30,
    isDroughtCritical: false
  },
  {
    id: 'overholser',
    name: 'Lake Overholser',
    usgsId: '07240500',
    // No USACE ID for Overholser usually
    topElevation: 1241.5,
    lowerElevation: 1231.8,
    maxLiveStorage: 12909,
    fullStorage: 13514,
    isDroughtCritical: false
  },
  {
    id: 'hefner',
    name: 'Lake Hefner',
    usgsId: '07159550',
    topElevation: 1199.0,
    lowerElevation: 1165.0,
    maxLiveStorage: 57593,
    fullStorage: 69894,
    isDroughtCritical: true // Critical for drought trigger
  },
  {
    id: 'draper',
    name: 'Stanley Draper Lake',
    usgsId: '07229445',
    topElevation: 1191.0,
    lowerElevation: 1145.0,
    maxLiveStorage: 72195,
    fullStorage: 87155,
    isDroughtCritical: true // Critical for drought trigger
  },
  {
    id: 'atoka',
    name: 'Atoka Reservoir',
    usgsId: '07333010',
    usaceId: 'ATKO2',
    topElevation: 590.0,
    lowerElevation: 550.0,
    maxLiveStorage: 107940,
    fullStorage: 109819,
    isDroughtCritical: false
  },
  {
    id: 'mcgee',
    name: 'McGee Creek Reservoir',
    usgsId: '07333900',
    usaceId: 'MGCO2',
    topElevation: 577.1,
    lowerElevation: 533.0,
    maxLiveStorage: 88445,
    fullStorage: 99492,
    isDroughtCritical: false
  }
]

// Total System Live Storage Capacity (Sum of maxLiveStorage)
// Verification: 68,023 + 12,909 + 57,593 + 72,195 + 107,940 + 88,445 = 407,105 AF
export const TOTAL_SYSTEM_CAPACITY = 407105 

export type DroughtCondition = 'none' | 'moderate' | 'advanced' | 'extreme'

/**
 * Calculates current storage in Acre-Feet based on elevation.
 * Linearly interpolates between bottom (0%) and top (100%).
 */
function calculateStorageAF(reservoir: OKCReservoir, currentElev: number): number {
  if (currentElev <= reservoir.lowerElevation) return 0
  if (currentElev >= reservoir.topElevation) return reservoir.maxLiveStorage

  const pct = (currentElev - reservoir.lowerElevation) / (reservoir.topElevation - reservoir.lowerElevation)
  
  // Note: Transit loss is already pre-calculated into maxLiveStorage for Canton
  // so we just take percentage of that reduced max.
  return reservoir.maxLiveStorage * pct
}

export function calculateCombinedStorage(
  // Map of 'id' -> current elevation (ft)
  elevations: Map<string, number> 
) {
  let currentSystemStorage = 0
  const details = []

  for (const res of OKC_RESERVOIR_SYSTEM) {
    const elev = elevations.get(res.id)
    if (elev !== undefined) {
      const storageAF = calculateStorageAF(res, elev)
      currentSystemStorage += storageAF
      
      details.push({
        id: res.id,
        name: res.name,
        elevation: elev,
        storageAF: storageAF,
        percentFull: (storageAF / res.maxLiveStorage) * 100,
        isCritical: res.isDroughtCritical
      })
    }
  }

  return {
    totalStorage: currentSystemStorage,
    percentage: (currentSystemStorage / TOTAL_SYSTEM_CAPACITY) * 100,
    details
  }
}

/**
 * WSA Section 6 Drought Determination
 * Logic: Drought exists ONLY if:
 * 1. Combined Storage < Threshold
 * AND
 * 2. Hefner < Threshold
 * AND
 * 3. Draper < Threshold
 */
export function determineWSADroughtCondition(
  systemPct: number,
  hefnerPct: number,
  draperPct: number
): {
  condition: DroughtCondition,
  details: any
} {
  const check = (threshold: number) => 
    systemPct < threshold && hefnerPct < threshold && draperPct < threshold

  let condition: DroughtCondition = 'none'

  // Check from most severe to least
  if (check(50)) condition = 'extreme'
  else if (check(65)) condition = 'advanced'
  else if (check(75)) condition = 'moderate'

  return {
    condition,
    details: {
      systemPct,
      hefnerPct,
      draperPct,
      thresholds: { moderate: 75, advanced: 65, extreme: 50 }
    }
  }
}

// Sardis Release Rules per WSA Section 6.1.8
export function getSardisRestriction(
  drought: DroughtCondition,
  date: Date = new Date()
) {
  const month = date.getMonth() + 1 // 1-12
  const day = date.getDate()

  // 1. Extreme Drought (Section 6.1.8.2.3)
  if (drought === 'extreme') {
    return { minimumElevation: 589.0, reason: 'Extreme Drought Condition', isDroughtOverride: true }
  }

  // 2. Advanced Drought (Section 6.1.8.2.2)
  if (drought === 'advanced') {
    return { minimumElevation: 592.0, reason: 'Advanced Drought Condition', isDroughtOverride: true }
  }

  // 3. Moderate Drought (Section 6.1.8.2.1) - Only applies Jul 5 - Aug 31
  if (drought === 'moderate') {
    const isSummerWindow = (month === 7 && day >= 5) || (month === 8)
    if (isSummerWindow) {
      return { minimumElevation: 597.0, reason: 'Moderate Drought (Jul 5 - Aug 31)', isDroughtOverride: true }
    }
  }

  // 4. Baseline (Section 6.1.8.1)
  // Summer: Apr 1 - Aug 31
  if (month >= 4 && month <= 8) {
    return { minimumElevation: 599.0, reason: 'Summer Baseline (Apr-Aug)', isDroughtOverride: false }
  }
  
  // Winter: Sep 1 - Mar 31
  return { minimumElevation: 595.0, reason: 'Winter Baseline (Sep-Mar)', isDroughtOverride: false }
}
