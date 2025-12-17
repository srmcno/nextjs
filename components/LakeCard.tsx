'use client'

import { useEffect, useMemo, useState } from 'react'
import WaterChart from './WaterChart'
import {
  type WaterBody,
  type AlertLevel,
  getAlertLevel,
  calculatePoolPercentage,
  getAlertMessage,
  SARDIS_WITHDRAWAL_THRESHOLDS
} from '../lib/waterBodies'

type UsgsValue = { value: string; dateTime: string }
type UsgsJson = {
  value?: {
    timeSeries?: Array<{
      values?: Array<{
        value?: UsgsValue[]
      }>
    }>
  }
}
type Point = { t: string; v: number }

function fmtTime(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  } catch {
    return iso
  }
}

interface LakeCardProps {
  waterBody: WaterBody
}

const ALERT_STYLES: Record<AlertLevel, { badge: string; bg: string; border: string }> = {
  normal: {
    badge: 'bg-emerald-100 text-emerald-800',
    bg: 'bg-white',
    border: 'border-black/10'
  },
  watch: {
    badge: 'bg-yellow-100 text-yellow-800',
    bg: 'bg-yellow-50/30',
    border: 'border-yellow-300'
  },
  warning: {
    badge: 'bg-orange-100 text-orange-800',
    bg: 'bg-orange-50/30',
    border: 'border-orange-300'
  },
  critical: {
    badge: 'bg-red-100 text-red-800',
    bg: 'bg-red-50/30',
    border: 'border-red-400'
  }
}

export default function LakeCard({ waterBody }: LakeCardProps) {
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [latest, setLatest] = useState<Point | null>(null)
  const [series, setSeries] = useState<Point[]>([])

  const { usgsId, parameterCode, conservationPool, streambed, name, type, description, county } = waterBody
  const isRiver = type === 'river'

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setErr(null)

    fetch(`/api/usgs?site=${encodeURIComponent(usgsId)}&param=${parameterCode}`)
      .then(r => r.json())
      .then((json: UsgsJson) => {
        if (cancelled) return

        const values: UsgsValue[] =
          json?.value?.timeSeries?.[0]?.values?.[0]?.value ?? []

        const pts = values
          .map(v => ({ t: v.dateTime, v: Number(v.value) }))
          .filter(p => Number.isFinite(p.v))

        setSeries(pts)

        const last = pts[pts.length - 1]
        setLatest(last ? { v: last.v, t: last.t } : null)

        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setErr('Failed to load USGS data')
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [usgsId, parameterCode])

  const alertLevel = useMemo((): AlertLevel => {
    if (!latest || !conservationPool) return 'normal'
    return getAlertLevel(latest.v, conservationPool)
  }, [latest, conservationPool])

  const poolPercentage = useMemo(() => {
    if (!latest || !conservationPool || !streambed) return null
    return calculatePoolPercentage(latest.v, conservationPool, streambed)
  }, [latest, conservationPool, streambed])

  const alertMessage = useMemo(() => {
    if (!latest) return null
    return getAlertMessage(waterBody, latest.v)
  }, [latest, waterBody])

  const sardisRestricted = useMemo(() => {
    if (waterBody.id !== 'sardis' || !latest) return false
    return latest.v < SARDIS_WITHDRAWAL_THRESHOLDS.minimumForWithdrawal
  }, [waterBody.id, latest])

  const styles = ALERT_STYLES[alertLevel]

  const statusBadge = useMemo(() => {
    if (!latest) return { label: 'No data', cls: 'bg-gray-100 text-gray-600' }
    if (loading) return { label: 'Loading', cls: 'bg-gray-100 text-gray-600' }

    const labels: Record<AlertLevel, string> = {
      normal: 'Normal',
      watch: 'Watch',
      warning: 'Warning',
      critical: 'Critical'
    }

    return { label: labels[alertLevel], cls: styles.badge }
  }, [latest, loading, alertLevel, styles.badge])

  return (
    <div className={`rounded-2xl border-2 ${styles.border} ${styles.bg} shadow-sm transition-all hover:shadow-md`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 p-5 pb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {isRiver ? '🌊' : '💧'}
            </span>
            <h3 className="text-lg font-bold text-gray-900">{name}</h3>
          </div>
          <div className="mt-1 text-sm text-gray-500">
            {county} County
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge.cls}`}>
          {statusBadge.label}
        </span>
      </div>

      {/* Alert Banner */}
      {alertMessage && (
        <div className={`mx-5 mb-3 rounded-lg px-3 py-2 text-sm font-medium ${
          alertLevel === 'critical' ? 'bg-red-100 text-red-800' :
          alertLevel === 'warning' ? 'bg-orange-100 text-orange-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {alertMessage}
        </div>
      )}

      {/* Sardis Special Banner */}
      {sardisRestricted && (
        <div className="mx-5 mb-3 rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white">
          ⚠️ OKC WITHDRAWAL RESTRICTED per Settlement Agreement
        </div>
      )}

      {/* Content */}
      <div className="px-5 pb-4">
        {loading ? (
          <div className="flex h-52 items-center justify-center rounded-xl bg-gray-50">
            <div className="flex items-center gap-2 text-gray-500">
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Loading USGS data...
            </div>
          </div>
        ) : err ? (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-900">
            <div className="font-semibold">Error loading data</div>
            <div className="mt-1 text-red-700">{err}</div>
          </div>
        ) : (
          <>
            {/* Current Reading */}
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  {isRiver ? 'Current Flow' : 'Current Level'}
                </div>
                <div className="mt-1 text-3xl font-bold text-gray-900">
                  {latest ? latest.v.toFixed(2) : '—'}
                  <span className="ml-1 text-base font-semibold text-gray-500">
                    {isRiver ? 'cfs' : 'ft'}
                  </span>
                </div>
              </div>

              {conservationPool && !isRiver && (
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Conservation Pool
                  </div>
                  <div className="mt-1 text-3xl font-bold text-gray-900">
                    {conservationPool.toFixed(1)}
                    <span className="ml-1 text-base font-semibold text-gray-500">ft</span>
                  </div>
                </div>
              )}
            </div>

            {/* Pool Level Progress Bar */}
            {poolPercentage !== null && !isRiver && (
              <div className="mb-4">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-600">Pool Level</span>
                  <span className={`font-bold ${
                    poolPercentage >= 95 ? 'text-emerald-600' :
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
                      poolPercentage >= 95 ? 'bg-emerald-500' :
                      poolPercentage >= 85 ? 'bg-yellow-500' :
                      poolPercentage >= 75 ? 'bg-orange-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(100, poolPercentage)}%` }}
                  />
                </div>
                <div className="mt-1 flex justify-between text-xs text-gray-500">
                  <span>Streambed: {streambed?.toFixed(0)} ft</span>
                  <span>Full: {conservationPool?.toFixed(0)} ft</span>
                </div>
              </div>
            )}

            {/* Chart */}
            <div className="rounded-xl bg-gray-50 p-3">
              <WaterChart
                data={series.slice(-96)}
                threshold={!isRiver ? conservationPool : undefined}
                isFlow={isRiver}
              />
            </div>

            {/* Footer Info */}
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <div>
                Updated: {latest ? fmtTime(latest.t) : '—'}
              </div>
              <a
                className="font-semibold text-blue-600 hover:underline"
                href={`https://waterdata.usgs.gov/monitoring-location/${usgsId}/`}
                target="_blank"
                rel="noreferrer"
              >
                View on USGS →
              </a>
            </div>
          </>
        )}
      </div>

      {/* Description Footer */}
      <div className="border-t border-gray-200 bg-gray-50/50 px-5 py-3">
        <p className="text-xs text-gray-600 line-clamp-2">{description}</p>
      </div>
    </div>
  )
}
