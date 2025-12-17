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
    badge: 'bg-emerald-100 text-emerald-900',
    bg: 'bg-white',
    border: 'border-slate-200'
  },
  watch: {
    badge: 'bg-sky-100 text-sky-900',
    bg: 'bg-sky-50/40',
    border: 'border-sky-200'
  },
  warning: {
    badge: 'bg-cyan-100 text-cyan-900',
    bg: 'bg-cyan-50/40',
    border: 'border-cyan-200'
  },
  critical: {
    badge: 'bg-slate-200 text-slate-900',
    bg: 'bg-slate-50/60',
    border: 'border-slate-300'
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

    const paramsToTry = waterBody.type === 'river'
      ? [parameterCode, '00060']
      : [parameterCode, '62614', '00065']

    const load = async () => {
      let lastError: string | null = null

      for (const param of paramsToTry) {
        if (!param) continue

        try {
          const res = await fetch(`/api/usgs?site=${encodeURIComponent(usgsId)}&param=${param}`)
          const json: UsgsJson = await res.json()

          const values: UsgsValue[] =
            json?.value?.timeSeries?.[0]?.values?.[0]?.value ?? []

          const pts = values
            .map(v => ({ t: v.dateTime, v: Number(v.value) }))
            .filter(p => Number.isFinite(p.v))

          if (pts.length === 0) {
            lastError = `No recent observations for parameter ${param}`
            continue
          }

          if (cancelled) return

          setSeries(pts)
          const last = pts[pts.length - 1]
          setLatest(last ? { v: last.v, t: last.t } : null)
          setLoading(false)
          return
        } catch (e) {
          lastError = 'Failed to load USGS data'
        }
      }

      if (!cancelled) {
        setErr(lastError || 'Unable to load data')
        setSeries([])
        setLatest(null)
        setLoading(false)
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [usgsId, parameterCode, waterBody.type])

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

  const sardisLine =
    waterBody.id === 'sardis'
      ? [{
          value: SARDIS_WITHDRAWAL_THRESHOLDS.minimumForWithdrawal,
          label: 'OKC withdrawal floor',
          color: '#0ea5e9'
        }]
      : undefined

  return (
    <div className={`rounded-2xl border-2 ${styles.border} ${styles.bg} shadow-sm transition-all hover:shadow-lg`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 p-5 pb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {isRiver ? '🌊' : '💧'}
            </span>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{name}</h3>
              <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                <span className="rounded-md bg-gray-100 px-2 py-0.5">USGS Station {usgsId}</span>
                {waterBody.isSettlementCritical && (
                  <span className="rounded-md bg-slate-900/10 px-2 py-0.5 text-slate-800">Settlement critical</span>
                )}
              </div>
            </div>
          </div>
          <div className="mt-1 text-sm text-gray-500">
            {county} County
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge.cls}`}>
            {statusBadge.label}
          </span>
          {sardisRestricted && (
            <span className="rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-800">Withdrawal hold</span>
          )}
        </div>
      </div>

      {/* Alert Banner */}
      {alertMessage && (
        <div className={`mx-5 mb-3 rounded-lg px-3 py-2 text-sm font-medium ${
          alertLevel === 'critical' ? 'bg-slate-200 text-slate-900' :
          alertLevel === 'warning' ? 'bg-cyan-100 text-cyan-900' :
          'bg-sky-100 text-sky-900'
        }`}>
          {alertMessage}
        </div>
      )}

      {/* Sardis Special Banner */}
      {sardisRestricted && (
        <div className="mx-5 mb-3 rounded-lg bg-sky-800 px-3 py-2 text-sm font-bold text-white">
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
          <div className="rounded-xl bg-slate-100 p-4 text-sm text-slate-900">
            <div className="font-semibold">Error loading data</div>
            <div className="mt-1 text-slate-700">{err}</div>
          </div>
        ) : (
          <>
            {/* Current Reading */}
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  {isRiver ? 'Current Flow' : 'Current Level'}
                </div>
                <div className="mt-1 text-3xl font-extrabold text-gray-900">
                  {latest ? latest.v.toFixed(2) : '—'}
                  <span className="ml-1 text-base font-semibold text-gray-500">
                    {isRiver ? 'cfs' : 'ft'}
                  </span>
                </div>
                <div className="mt-1 text-xs text-gray-500">Updated {latest ? fmtTime(latest.t) : '—'}</div>
              </div>

              <div className="flex flex-col gap-2 text-xs text-gray-600">
                {conservationPool && !isRiver && (
                  <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">Conservation pool</div>
                    <div className="text-lg font-bold text-emerald-900">{conservationPool.toFixed(1)} ft</div>
                  </div>
                )}
                {streambed !== undefined && !isRiver && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">Streambed datum</div>
                    <div className="text-base font-semibold text-slate-800">{streambed.toFixed(1)} ft</div>
                  </div>
                )}
              </div>
            </div>

            {/* Pool Level Progress Bar */}
            {poolPercentage !== null && !isRiver && (
              <div className="mb-4">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-600">Pool Level</span>
                  <span className={`font-bold ${
                    poolPercentage >= 95 ? 'text-emerald-700' :
                    poolPercentage >= 85 ? 'text-sky-700' :
                    poolPercentage >= 75 ? 'text-cyan-700' :
                    'text-slate-700'
                  }`}>
                    {poolPercentage.toFixed(1)}%
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={`h-full rounded-full transition-all ${
                      poolPercentage >= 95 ? 'bg-emerald-500' :
                      poolPercentage >= 85 ? 'bg-sky-500' :
                      poolPercentage >= 75 ? 'bg-cyan-500' :
                      'bg-slate-500'
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

            {/* Settlement guardrail */}
            {!isRiver && (
              <div className="mb-4 rounded-lg border border-slate-300 bg-slate-50 p-3 text-xs leading-relaxed text-slate-800">
                <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-700 text-[10px] text-white">!
                  </span>
                  Settlement guardrails
                </div>
                {waterBody.id === 'sardis' ? (
                  <p>
                    Oklahoma City withdrawals pause when Sardis falls below {SARDIS_WITHDRAWAL_THRESHOLDS.minimumForWithdrawal} ft,
                    and recreation/wildlife protections trigger heightened alerts below {SARDIS_WITHDRAWAL_THRESHOLDS.criticalLevel} ft.
                  </p>
                ) : (
                  <p>
                    Pools are compared to conservation storage; alerts follow the settlement tiers (watch, warning, critical) set off of the pool percentage bands.
                  </p>
                )}
              </div>
            )}

            {/* Chart */}
            <div className="rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-3 shadow-inner">
              <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                <span>{isRiver ? 'Realtime discharge trace' : 'Pool elevation trace'}</span>
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1"><span className="h-1.5 w-4 rounded-full bg-slate-900"></span> USGS</span>
                  {!isRiver && <span className="flex items-center gap-1"><span className="h-1.5 w-4 rounded-full bg-emerald-500"></span> Settlement Pool</span>}
                </div>
              </div>
              <WaterChart
                data={series.slice(-96)}
                threshold={!isRiver ? conservationPool : undefined}
                isFlow={isRiver}
                streambed={!isRiver ? streambed : undefined}
                floodPoolTop={!isRiver ? waterBody.floodPoolTop : undefined}
                alertLines={sardisLine}
              />
            </div>

            {/* Footer Info */}
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-gray-600">USGS real-time</span>
                <span className="hidden rounded-full bg-gray-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-gray-600 sm:inline">Agreement guardrails</span>
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
