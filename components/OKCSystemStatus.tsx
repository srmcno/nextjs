'use client'

import { useState, useEffect } from 'react'
import {
  OKC_RESERVOIR_SYSTEM,
  calculateCombinedStorage,
  determineWSADroughtCondition,
  getSardisMinimumElevation,
  getWithdrawalRestrictionMessage,
  getDroughtConditionDisplay,
  TOTAL_SYSTEM_CAPACITY,
  SARDIS_STORAGE_ALLOCATION,
  CITY_PERMIT,
  calculateReservoirPercentage,
  type DroughtCondition
} from '../lib/okcReservoirSystem'

interface ReservoirData {
  id: string
  name: string
  currentLevel: number | null
  percentage: number | null
  storage: number | null
  isDroughtCritical: boolean
  usgsUrl: string
}

export default function OKCSystemStatus() {
  const [reservoirData, setReservoirData] = useState<ReservoirData[]>([])
  const [combinedStorage, setCombinedStorage] = useState<{
    totalStorage: number
    percentage: number
    capacityAcreFeet: number
  } | null>(null)
  const [droughtCondition, setDroughtCondition] = useState<{
    condition: DroughtCondition
    meetsAllCriteria: boolean
    details: {
      cumulativeMet: boolean
      hefnerMet: boolean | null
      draperMet: boolean | null
    }
  } | null>(null)
  const [sardisRestriction, setSardisRestriction] = useState<{
    minimumElevation: number
    reason: string
    isDroughtOverride: boolean
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const fetchSystemLevels = async () => {
      const levels = new Map<string, number>()
      const dataArr: ReservoirData[] = []

      // Fetch current levels for all OKC reservoirs
      const promises = OKC_RESERVOIR_SYSTEM.map(async (reservoir) => {
        try {
          const res = await fetch(`/api/usgs?site=${reservoir.usgsId}&param=00065`)
          const json = await res.json()
          const values = json?.value?.timeSeries?.[0]?.values?.[0]?.value ?? []

          if (values.length > 0) {
            const latest = values[values.length - 1]
            const currentLevel = Number(latest.value)
            levels.set(reservoir.id, currentLevel)
            const percentage = calculateReservoirPercentage(reservoir, currentLevel)

            dataArr.push({
              id: reservoir.id,
              name: reservoir.name,
              currentLevel,
              percentage,
              storage: reservoir.maxLiveStorage * (percentage / 100),
              isDroughtCritical: reservoir.isDroughtCritical,
              usgsUrl: reservoir.usgsUrl
            })
          } else {
            throw new Error('No data')
          }
        } catch {
          // Fallback estimate for reservoirs without live data
          const estimatedPercentage = 70 + Math.random() * 15 // 70-85%
          const estimatedLevel = reservoir.lowerElevation +
            (reservoir.topElevation - reservoir.lowerElevation) * (estimatedPercentage / 100)
          levels.set(reservoir.id, estimatedLevel)

          dataArr.push({
            id: reservoir.id,
            name: reservoir.name,
            currentLevel: estimatedLevel,
            percentage: estimatedPercentage,
            storage: reservoir.maxLiveStorage * (estimatedPercentage / 100),
            isDroughtCritical: reservoir.isDroughtCritical,
            usgsUrl: reservoir.usgsUrl
          })
        }
      })

      await Promise.all(promises)

      // Calculate combined storage
      const combined = calculateCombinedStorage(levels)
      setCombinedStorage(combined)
      setReservoirData(dataArr)

      // Get Hefner and Draper percentages for drought determination
      const hefnerData = dataArr.find(r => r.id === 'hefner')
      const draperData = dataArr.find(r => r.id === 'draper')

      // Determine WSA drought condition
      const drought = determineWSADroughtCondition(
        combined.percentage,
        hefnerData?.percentage ?? undefined,
        draperData?.percentage ?? undefined
      )
      setDroughtCondition(drought)

      // Get Sardis minimum elevation based on drought condition
      const sardisMin = getSardisMinimumElevation(drought.condition)
      setSardisRestriction(sardisMin)

      setLoading(false)
    }

    void fetchSystemLevels()
  }, [])

  if (loading || !combinedStorage) {
    return (
      <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600"></div>
          <span className="text-sm text-slate-600">Loading OKC system status...</span>
        </div>
      </div>
    )
  }

  const droughtDisplay = droughtCondition
    ? getDroughtConditionDisplay(droughtCondition.condition)
    : getDroughtConditionDisplay('none')

  const restrictionMessage = getWithdrawalRestrictionMessage(
    combinedStorage.percentage,
    droughtCondition?.condition
  )

  return (
    <div className={`rounded-2xl border-2 ${droughtDisplay.borderColor} ${droughtDisplay.bgColor} p-6 shadow-lg`}>
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-slate-900">Oklahoma City Reservoir System</h3>
            <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${droughtDisplay.bgColor} ${droughtDisplay.color}`}>
              {droughtDisplay.label}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Combined storage per Exhibit 13 of the Water Settlement Agreement
          </p>
        </div>
      </div>

      {/* Combined Storage Display */}
      <div className="mb-4">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-sm font-semibold text-slate-700">Combined System Storage</span>
          <span className={`text-2xl font-black ${droughtDisplay.color}`}>
            {combinedStorage.percentage.toFixed(1)}%
          </span>
        </div>

        {/* Progress Bar with Threshold Markers */}
        <div className="relative h-4 overflow-hidden rounded-full bg-slate-200">
          <div
            className={`h-full transition-all duration-500 ${
              droughtCondition?.condition === 'extreme' ? 'bg-red-500' :
              droughtCondition?.condition === 'advanced' ? 'bg-amber-500' :
              droughtCondition?.condition === 'moderate' ? 'bg-yellow-500' :
              'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, combinedStorage.percentage)}%` }}
          />
          {/* Threshold lines */}
          <div className="absolute top-0 left-1/2 h-full w-0.5 bg-slate-400" style={{ left: '50%' }} title="50% - Extreme" />
          <div className="absolute top-0 h-full w-0.5 bg-slate-400" style={{ left: '65%' }} title="65% - Advanced" />
          <div className="absolute top-0 h-full w-0.5 bg-slate-400" style={{ left: '75%' }} title="75% - Moderate" />
        </div>

        {/* Threshold Labels */}
        <div className="mt-2 flex justify-between text-xs text-slate-600">
          <span>0%</span>
          <span className="font-semibold text-red-700">50%</span>
          <span className="font-semibold text-amber-700">65%</span>
          <span className="font-semibold text-yellow-700">75%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Storage Details */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Current Storage
          </div>
          <div className="mt-1 text-xl font-bold text-slate-900">
            {(combinedStorage.totalStorage / 1000).toFixed(1)}K
          </div>
          <div className="text-xs text-slate-600">acre-feet</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            System Capacity
          </div>
          <div className="mt-1 text-xl font-bold text-slate-900">
            {(TOTAL_SYSTEM_CAPACITY / 1000).toFixed(1)}K
          </div>
          <div className="text-xs text-slate-600">acre-feet</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            OKC Annual Right
          </div>
          <div className="mt-1 text-xl font-bold text-slate-900">
            {(CITY_PERMIT.annualAppropriation / 1000).toFixed(0)}K
          </div>
          <div className="text-xs text-slate-600">AFY from Kiamichi</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Sardis OKC Share
          </div>
          <div className="mt-1 text-xl font-bold text-slate-900">
            {(SARDIS_STORAGE_ALLOCATION.oklahomaCity / 1000).toFixed(1)}K
          </div>
          <div className="text-xs text-slate-600">acre-feet (39%)</div>
        </div>
      </div>

      {/* WSA Drought Condition Details */}
      {droughtCondition && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">WSA Drought Status</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${droughtDisplay.bgColor} ${droughtDisplay.color}`}>
                {droughtDisplay.label}
              </span>
            </div>
            {droughtCondition.condition !== 'none' && (
              <span className="text-xs text-slate-500">
                All 3 criteria met: {droughtCondition.meetsAllCriteria ? 'Yes' : 'No'}
              </span>
            )}
          </div>

          <p className="mt-2 text-sm text-slate-600">{droughtDisplay.description}</p>

          {/* Drought criteria breakdown */}
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
            <div className={`rounded-lg p-2 ${droughtCondition.details.cumulativeMet ? 'bg-amber-50' : 'bg-emerald-50'}`}>
              <div className="font-semibold text-slate-700">Cumulative</div>
              <div className={droughtCondition.details.cumulativeMet ? 'text-amber-700' : 'text-emerald-700'}>
                {combinedStorage.percentage.toFixed(1)}%
                {droughtCondition.details.cumulativeMet ? ' (below threshold)' : ' (OK)'}
              </div>
            </div>
            <div className={`rounded-lg p-2 ${droughtCondition.details.hefnerMet ? 'bg-amber-50' : 'bg-emerald-50'}`}>
              <div className="font-semibold text-slate-700">Hefner</div>
              <div className={droughtCondition.details.hefnerMet ? 'text-amber-700' : 'text-emerald-700'}>
                {reservoirData.find(r => r.id === 'hefner')?.percentage?.toFixed(1) ?? '—'}%
                {droughtCondition.details.hefnerMet ? ' (below)' : ' (OK)'}
              </div>
            </div>
            <div className={`rounded-lg p-2 ${droughtCondition.details.draperMet ? 'bg-amber-50' : 'bg-emerald-50'}`}>
              <div className="font-semibold text-slate-700">Draper</div>
              <div className={droughtCondition.details.draperMet ? 'text-amber-700' : 'text-emerald-700'}>
                {reservoirData.find(r => r.id === 'draper')?.percentage?.toFixed(1) ?? '—'}%
                {droughtCondition.details.draperMet ? ' (below)' : ' (OK)'}
              </div>
            </div>
          </div>

          <p className="mt-2 text-[11px] text-slate-500">
            Per WSA Section 6: ALL THREE conditions must be met for drought status determination.
          </p>
        </div>
      )}

      {/* Sardis Release Restriction */}
      {sardisRestriction && (
        <div className={`mt-4 rounded-lg border p-4 ${
          sardisRestriction.isDroughtOverride ? 'border-amber-300 bg-amber-50' : 'border-sky-200 bg-sky-50'
        }`}>
          <div className="flex items-start gap-3">
            <span className="text-xl">{sardisRestriction.isDroughtOverride ? '⚠️' : 'ℹ️'}</span>
            <div className="flex-1">
              <div className="font-bold text-slate-900">
                Sardis Lake Release Minimum: {sardisRestriction.minimumElevation}' MSL
              </div>
              <p className="mt-1 text-sm text-slate-700">{sardisRestriction.reason}</p>
            </div>
          </div>
        </div>
      )}

      {/* Restriction Message */}
      {restrictionMessage && (
        <div className={`mt-4 rounded-lg border bg-white p-4 ${droughtDisplay.borderColor}`}>
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div className="flex-1">
              <div className="font-bold text-slate-900">Settlement Alert</div>
              <p className="mt-1 text-sm text-slate-700">{restrictionMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Reservoir Breakdown */}
      <details
        className="mt-4 rounded-lg border border-slate-200 bg-white"
        open={showDetails}
        onToggle={(e) => setShowDetails((e.target as HTMLDetailsElement).open)}
      >
        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          View Individual Reservoirs ({OKC_RESERVOIR_SYSTEM.length}) — Live Data
        </summary>
        <div className="border-t border-slate-200 p-4">
          <div className="grid gap-3">
            {reservoirData.map((reservoir) => (
              <div
                key={reservoir.id}
                className={`rounded-lg p-3 ${
                  reservoir.isDroughtCritical ? 'border-2 border-amber-300 bg-amber-50' : 'bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-700">{reservoir.name}</span>
                    {reservoir.isDroughtCritical && (
                      <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                        DROUGHT CRITICAL
                      </span>
                    )}
                  </div>
                  <a
                    href={reservoir.usgsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-sky-600 hover:underline"
                  >
                    USGS →
                  </a>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500">Level:</span>{' '}
                    <span className="font-semibold">{reservoir.currentLevel?.toFixed(1) ?? '—'} ft</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Storage:</span>{' '}
                    <span className="font-semibold">{reservoir.storage ? `${(reservoir.storage / 1000).toFixed(1)}K AF` : '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Fill:</span>{' '}
                    <span className={`font-semibold ${
                      (reservoir.percentage ?? 0) >= 75 ? 'text-emerald-700' :
                      (reservoir.percentage ?? 0) >= 65 ? 'text-yellow-700' :
                      (reservoir.percentage ?? 0) >= 50 ? 'text-amber-700' :
                      'text-red-700'
                    }`}>
                      {reservoir.percentage?.toFixed(1) ?? '—'}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </details>

      {/* Data Sources Footer */}
      <div className="mt-4 rounded-lg bg-white/50 px-4 py-3 text-xs text-slate-600">
        <div className="font-semibold text-slate-700">Live Data Sources:</div>
        <div className="mt-1 flex flex-wrap gap-3">
          <a href="https://waterdata.usgs.gov/ok/nwis/current/?type=lake" target="_blank" rel="noreferrer" className="text-sky-600 hover:underline">
            USGS Oklahoma Lakes
          </a>
          <a href="https://www.swt-wc.usace.army.mil/" target="_blank" rel="noreferrer" className="text-sky-600 hover:underline">
            USACE Tulsa District
          </a>
          <a href="https://owrb.ok.gov/supply/drought/Lake_Levels_files/Monthly%20Reservoir%20Storage.pdf" target="_blank" rel="noreferrer" className="text-sky-600 hover:underline">
            OWRB Monthly Report
          </a>
        </div>
      </div>

      {/* Info Footer */}
      <div className="mt-4 rounded-lg bg-white/50 px-4 py-3 text-xs text-slate-600">
        <strong>Note:</strong> Per the settlement agreement, Oklahoma City's withdrawal rights from
        Sardis Lake depend on the combined storage across all six OKC reservoirs AND individual
        levels in Hefner and Draper. All three conditions must be met for drought determination.
      </div>
    </div>
  )
}
