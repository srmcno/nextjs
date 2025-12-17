'use client'

import { useEffect, useMemo, useState } from 'react'
import WaterChart from './WaterChart'
import InfoModal from './InfoModal'
import {
  type WaterBody,
  type AlertLevel,
  getAlertLevel,
  calculatePoolPercentage,
  calculateBelowNormal,
  getAlertMessage,
  SARDIS_WITHDRAWAL_THRESHOLDS
} from '../lib/waterBodies'

type Point = { t: string; v: number }

interface USACEData {
  poolElevation: number | null
  conservationPoolPercent: number | null
  belowNormal: number | null
  storage: number | null
  release: number | null
  timestamp: string | null
}

function fmtTime(timestamp: string | null) {
  if (!timestamp) return '—'
  try {
    // Handle various formats
    if (timestamp.includes('T')) {
      // ISO format
      const d = new Date(timestamp)
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    }
    // USACE format: "15DEC2025 18:00"
    return timestamp
  } catch {
    return timestamp
  }
}

interface LakeCardProps {
  waterBody: WaterBody
}

const ALERT_STYLES: Record<AlertLevel, { badge: string; bg: string; border: string }> = {
  normal: {
    badge: 'bg-[#1B7340] text-white',
    bg: 'bg-white',
    border: 'border-gray-200'
  },
  watch: {
    badge: 'bg-yellow-500 text-white',
    bg: 'bg-yellow-50/50',
    border: 'border-yellow-300'
  },
  warning: {
    badge: 'bg-orange-500 text-white',
    bg: 'bg-orange-50/50',
    border: 'border-orange-300'
  },
  critical: {
    badge: 'bg-red-600 text-white',
    bg: 'bg-red-50/50',
    border: 'border-red-400'
  }
}

export default function LakeCard({ waterBody }: LakeCardProps) {
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [usaceData, setUsaceData] = useState<USACEData | null>(null)
  const [riverData, setRiverData] = useState<{ latest: Point | null; series: Point[] }>({ latest: null, series: [] })
  const [modalOpen, setModalOpen] = useState(false)

  const isRiver = waterBody.type === 'river'

  // Fetch data based on type
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setErr(null)

    const fetchData = async () => {
      try {
        if (isRiver && waterBody.usgsId) {
          // Fetch USGS data for rivers
          const res = await fetch(`/api/usgs?site=${waterBody.usgsId}&param=00060`)
          const json = await res.json()

          if (cancelled) return

          const values = json?.value?.timeSeries?.[0]?.values?.[0]?.value ?? []
          const pts = values
            .map((v: { dateTime: string; value: string }) => ({ t: v.dateTime, v: Number(v.value) }))
            .filter((p: Point) => Number.isFinite(p.v))

          const last = pts[pts.length - 1]
          setRiverData({ latest: last || null, series: pts })
        } else if (waterBody.usaceCode) {
          // Fetch USACE data for reservoirs
          const res = await fetch(`/api/usace?site=${waterBody.usaceCode}`)
          const data = await res.json()

          if (cancelled) return
          setUsaceData(data)
        }

        setLoading(false)
      } catch (e) {
        if (cancelled) return
        setErr('Failed to load data')
        setLoading(false)
      }
    }

    fetchData()

    return () => {
      cancelled = true
    }
  }, [waterBody, isRiver])

  // Calculate values for reservoirs
  const currentElevation = usaceData?.poolElevation ?? null
  const poolPercentage = useMemo(() => {
    if (isRiver) return null
    if (usaceData?.conservationPoolPercent) return usaceData.conservationPoolPercent
    if (currentElevation && waterBody.conservationPool && waterBody.streambed) {
      return calculatePoolPercentage(currentElevation, waterBody.conservationPool, waterBody.streambed)
    }
    return null
  }, [isRiver, usaceData, currentElevation, waterBody])

  const belowNormal = useMemo(() => {
    if (isRiver) return null
    if (usaceData?.belowNormal !== null && usaceData?.belowNormal !== undefined) return usaceData.belowNormal
    if (currentElevation && waterBody.conservationPool) {
      return calculateBelowNormal(currentElevation, waterBody.conservationPool)
    }
    return null
  }, [isRiver, usaceData, currentElevation, waterBody])

  const alertLevel = useMemo((): AlertLevel => {
    if (isRiver) return 'normal'
    if (poolPercentage === null) return 'normal'
    return getAlertLevel(poolPercentage)
  }, [isRiver, poolPercentage])

  const alertMessage = useMemo(() => {
    if (isRiver || !currentElevation || poolPercentage === null) return null
    return getAlertMessage(waterBody, currentElevation, poolPercentage)
  }, [isRiver, currentElevation, poolPercentage, waterBody])

  const sardisRestricted = useMemo(() => {
    if (waterBody.id !== 'sardis' || !currentElevation) return false
    return currentElevation < SARDIS_WITHDRAWAL_THRESHOLDS.minimumForWithdrawal
  }, [waterBody.id, currentElevation])

  const styles = ALERT_STYLES[alertLevel]

  const statusBadge = useMemo(() => {
    if (loading) return { label: 'Loading', cls: 'bg-gray-400 text-white' }
    if (isRiver) {
      if (!riverData.latest) return { label: 'No Data', cls: 'bg-gray-400 text-white' }
      return { label: 'Live', cls: 'bg-[#1B7340] text-white' }
    }
    if (!currentElevation) return { label: 'No Data', cls: 'bg-gray-400 text-white' }

    const labels: Record<AlertLevel, string> = {
      normal: 'Normal',
      watch: 'Watch',
      warning: 'Warning',
      critical: 'Critical'
    }

    return { label: labels[alertLevel], cls: styles.badge }
  }, [loading, isRiver, riverData.latest, currentElevation, alertLevel, styles.badge])

  return (
    <>
      <div className={`group relative rounded-2xl border-2 ${styles.border} ${styles.bg} shadow-sm transition-all hover:shadow-lg`}>
        {/* Info Button */}
        <button
          onClick={() => setModalOpen(true)}
          className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 shadow-md opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white"
          title="View settlement information"
        >
          <svg className="h-5 w-5 text-[#512A2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        {/* Header */}
        <div className="flex items-start justify-between gap-3 p-4 pb-2">
          <div className="flex-1 cursor-pointer" onClick={() => setModalOpen(true)}>
            <h3 className="text-base font-bold text-[#512A2A] hover:text-[#6B3A3A]">{waterBody.name}</h3>
            <div className="mt-0.5 text-xs text-gray-500">
              {waterBody.county} County • {waterBody.agency}
            </div>
          </div>
          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusBadge.cls}`}>
            {statusBadge.label}
          </span>
        </div>

        {/* Alert Banner */}
        {alertMessage && (
          <div className={`mx-4 mb-2 rounded-lg px-3 py-2 text-xs font-semibold ${
            alertLevel === 'critical' ? 'bg-red-600 text-white' :
            alertLevel === 'warning' ? 'bg-orange-500 text-white' :
            'bg-yellow-500 text-white'
          }`}>
            {alertMessage}
          </div>
        )}

        {/* Sardis Special Banner */}
        {sardisRestricted && (
          <div className="mx-4 mb-2 rounded-lg bg-red-700 px-3 py-2 text-xs font-bold text-white">
            ⚠️ OKC WITHDRAWALS PROHIBITED
          </div>
        )}

        {/* Content */}
        <div className="px-4 pb-3">
          {loading ? (
            <div className="flex h-40 items-center justify-center rounded-xl bg-gray-50">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading...
              </div>
            </div>
          ) : err ? (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-900">
              <div className="font-semibold">Error</div>
              <div className="mt-1 text-red-700">{err}</div>
            </div>
          ) : isRiver ? (
            /* River Display */
            <>
              <div className="mb-3">
                <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Current Flow</div>
                <div className="mt-1 text-3xl font-bold text-[#512A2A]">
                  {riverData.latest ? riverData.latest.v.toLocaleString() : '—'}
                  <span className="ml-1 text-sm font-semibold text-gray-500">cfs</span>
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 p-2">
                <WaterChart data={riverData.series.slice(-96)} isFlow />
              </div>

              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <span>Updated: {riverData.latest ? fmtTime(riverData.latest.t) : '—'}</span>
                <a
                  href={`https://waterdata.usgs.gov/monitoring-location/${waterBody.usgsId}/`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[#006B54] hover:underline"
                >
                  USGS Data →
                </a>
              </div>
            </>
          ) : (
            /* Reservoir Display */
            <>
              {/* Current Readings */}
              <div className="mb-3 grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Pool Elevation</div>
                  <div className="mt-1 text-2xl font-bold text-[#512A2A]">
                    {currentElevation ? currentElevation.toFixed(2) : '—'}
                    <span className="ml-1 text-xs font-semibold text-gray-500">ft</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Conservation Pool</div>
                  <div className="mt-1 text-2xl font-bold text-[#1B7340]">
                    {waterBody.conservationPool.toFixed(1)}
                    <span className="ml-1 text-xs font-semibold text-gray-500">ft</span>
                  </div>
                </div>
              </div>

              {/* Below/Above Normal */}
              {belowNormal !== null && (
                <div className={`mb-3 rounded-lg px-3 py-2 text-center ${
                  belowNormal > 0 ? 'bg-yellow-100' : 'bg-green-100'
                }`}>
                  <span className={`text-sm font-bold ${belowNormal > 0 ? 'text-yellow-800' : 'text-green-800'}`}>
                    {Math.abs(belowNormal).toFixed(2)} ft {belowNormal > 0 ? 'BELOW' : 'ABOVE'} normal
                  </span>
                </div>
              )}

              {/* Pool Level Bar */}
              {poolPercentage !== null && (
                <div className="mb-3">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-gray-600">Pool Level</span>
                    <span className={`font-bold ${
                      poolPercentage >= 95 ? 'text-[#1B7340]' :
                      poolPercentage >= 85 ? 'text-yellow-600' :
                      poolPercentage >= 75 ? 'text-orange-600' :
                      'text-red-600'
                    }`}>
                      {poolPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full rounded-full transition-all ${
                        poolPercentage >= 95 ? 'bg-[#1B7340]' :
                        poolPercentage >= 85 ? 'bg-yellow-500' :
                        poolPercentage >= 75 ? 'bg-orange-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, poolPercentage)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Storage & Release */}
              {(usaceData?.storage || usaceData?.release !== null) && (
                <div className="mb-3 grid grid-cols-2 gap-3 text-xs">
                  {usaceData?.storage && (
                    <div className="rounded-lg bg-gray-50 p-2">
                      <div className="text-gray-500">Storage</div>
                      <div className="font-bold text-gray-900">{usaceData.storage.toLocaleString()} ac-ft</div>
                    </div>
                  )}
                  {usaceData?.release !== null && usaceData?.release !== undefined && (
                    <div className="rounded-lg bg-gray-50 p-2">
                      <div className="text-gray-500">Release</div>
                      <div className="font-bold text-gray-900">{usaceData.release.toLocaleString()} cfs</div>
                    </div>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Updated: {fmtTime(usaceData?.timestamp ?? null)}</span>
                <button
                  onClick={() => setModalOpen(true)}
                  className="font-semibold text-[#006B54] hover:underline"
                >
                  Settlement Info →
                </button>
              </div>
            </>
          )}
        </div>

        {/* Click hint on hover */}
        <div className="absolute inset-x-0 bottom-0 rounded-b-2xl bg-gradient-to-t from-[#512A2A]/90 to-transparent p-3 text-center text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
          Click for settlement details
        </div>
      </div>

      {/* Info Modal */}
      <InfoModal
        waterBody={waterBody}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        currentElevation={currentElevation ?? undefined}
        poolPercentage={poolPercentage ?? undefined}
      />
    </>
  )
}
