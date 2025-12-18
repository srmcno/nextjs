'use client'

import { useState, useEffect, useMemo } from 'react'
import WaterChart from './WaterChart'
import DataExport from './DataExport'
import {
  WaterBody,
  AlertLevel,
  getAlertLevel,
  calculatePoolPercentage,
  getAlertMessage,
  SARDIS_WITHDRAWAL_THRESHOLDS
} from '../lib/waterBodies'

interface UsgsValue {
  dateTime: string
  value: string
}

interface UsgsJson {
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

const ALERT_CONFIG: Record<AlertLevel, { badgeColor: string; borderColor: string; headerBg: string }> = {
  normal: {
    badgeColor: 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-600/20',
    borderColor: 'border-slate-200 hover:border-emerald-300',
    headerBg: 'bg-gradient-to-r from-slate-50 to-emerald-50/50'
  },
  watch: {
    badgeColor: 'bg-sky-100 text-sky-800 ring-1 ring-sky-600/20',
    borderColor: 'border-sky-200 hover:border-sky-300',
    headerBg: 'bg-gradient-to-r from-slate-50 to-sky-50/50'
  },
  warning: {
    badgeColor: 'bg-amber-100 text-amber-800 ring-1 ring-amber-600/20',
    borderColor: 'border-amber-200 hover:border-amber-300',
    headerBg: 'bg-gradient-to-r from-slate-50 to-amber-50/50'
  },
  critical: {
    badgeColor: 'bg-rose-100 text-rose-800 ring-1 ring-rose-600/20',
    borderColor: 'border-rose-200 hover:border-rose-300',
    headerBg: 'bg-gradient-to-r from-slate-50 to-rose-50/50'
  }
}

export default function LakeCard({ waterBody }: LakeCardProps) {
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [latest, setLatest] = useState<Point | null>(null)
  const [series, setSeries] = useState<Point[]>([])
  const [dataSource, setDataSource] = useState<'usgs-live' | 'mock-demo' | null>(null)

  const { usgsId, parameterCode, conservationPool, streambed, name, type, description, county } = waterBody
  const isRiver = type === 'river'

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setErr(null)

    // Strategy: Try primary parameter, fallback to common ones
    const paramsToTry = isRiver ? [parameterCode, '00060'] : [parameterCode, '62614', '00065']

    const load = async () => {
      for (const param of paramsToTry) {
        if (!param) continue
        try {
          const res = await fetch(`/api/usgs?site=${encodeURIComponent(usgsId)}&param=${param}`)
          const headerSource = res.headers.get('X-Data-Source') as 'usgs-live' | 'mock-demo' | null
          if (!cancelled) setDataSource(headerSource)
          
          const json: UsgsJson = await res.json()
          const values = json?.value?.timeSeries?.[0]?.values?.[0]?.value ?? []
          const pts = values.map(v => ({ t: v.dateTime, v: Number(v.value) })).filter(p => Number.isFinite(p.v))

          if (pts.length > 0) {
            if (cancelled) return
            setSeries(pts)
            setLatest(pts[pts.length - 1])
            setLoading(false)
            return
          }
        } catch (e) {
          console.error(`Failed to load param ${param} for ${usgsId}`, e)
        }
      }
      if (!cancelled) {
        setErr('Data unavailable')
        setLoading(false)
      }
    }
    void load()
    return () => { cancelled = true }
  }, [usgsId, parameterCode, isRiver])

  // Calculations
  const alertLevel = useMemo(() => {
    if (!latest || !conservationPool) return 'normal'
    return getAlertLevel(latest.v, conservationPool)
  }, [latest, conservationPool])

  const poolPercentage = useMemo(() => {
    if (!latest || !conservationPool || !streambed) return null
    return calculatePoolPercentage(latest.v, conservationPool, streambed)
  }, [latest, conservationPool, streambed])

  const stats = useMemo(() => {
    if (!series.length) return null
    const vals = series.map(p => p.v)
    const min = Math.min(...vals)
    const max = Math.max(...vals)
    const change = series[series.length - 1].v - series[0].v
    return { min, max, change }
  }, [series])

  const trend = useMemo(() => {
    if (series.length < 10) return 'stable'
    const recent = series.slice(-20)
    const start = recent[0].v
    const end = recent[recent.length-1].v
    const diff = end - start
    const threshold = isRiver ? start * 0.05 : 0.1
    if (diff > threshold) return 'rising'
    if (diff < -threshold) return 'falling'
    return 'stable'
  }, [series, isRiver])

  const alertMessage = useMemo(() => latest ? getAlertMessage(waterBody, latest.v) : null, [latest, waterBody])
  
  const sardisRestricted = waterBody.id === 'sardis' && latest && latest.v < SARDIS_WITHDRAWAL_THRESHOLDS.minimumForWithdrawal
  const styles = ALERT_CONFIG[alertLevel]

  const statusLabel = {
    normal: 'Normal',
    watch: 'Watch',
    warning: 'Warning',
    critical: 'Critical'
  }[alertLevel]

  const sardisLine = waterBody.id === 'sardis' ? [{
    value: SARDIS_WITHDRAWAL_THRESHOLDS.minimumForWithdrawal,
    label: 'OKC Withdrawal Floor',
    color: '#ef4444' // red-500
  }] : undefined

  return (
    <div className={`group relative overflow-hidden rounded-2xl border-2 bg-white shadow-sm transition-all duration-300 hover:shadow-xl ${styles.borderColor}`}>
      
      {/* HEADER */}
      <div className={`px-5 py-4 ${styles.headerBg} border-b border-slate-100`}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{isRiver ? '🌊' : '💧'}</span>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700">{name}</h3>
            </div>
            <div className="mt-1 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <span>{county} County</span>
              <span className="text-slate-300">•</span>
              <span>USGS {usgsId}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${styles.badgeColor}`}>
              {loading ? 'Loading...' : statusLabel}
            </span>
            {waterBody.isSettlementCritical && (
               <span className="text-[10px] font-bold text-slate-400">Settlement Critical</span>
            )}
          </div>
        </div>
      </div>

      {/* ALERTS */}
      {(alertMessage || sardisRestricted) && (
        <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-3">
           {sardisRestricted && (
            <div className="mb-2 flex items-center gap-2 rounded-md bg-rose-100 px-3 py-2 text-xs font-bold text-rose-800">
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              WITHDRAWAL HOLD: Level below {SARDIS_WITHDRAWAL_THRESHOLDS.minimumForWithdrawal}'
            </div>
           )}
           {alertMessage && (
             <div className="text-xs font-medium text-slate-600">{alertMessage}</div>
           )}
        </div>
      )}

      {/* BODY */}
      <div className="p-5">
        {loading ? (
          <div className="flex h-48 animate-pulse items-center justify-center rounded-xl bg-slate-100 text-xs font-medium text-slate-400">
            Fetching live data...
          </div>
        ) : err ? (
          <div className="flex h-48 items-center justify-center rounded-xl bg-rose-50 text-xs font-medium text-rose-500">
            {err}
          </div>
        ) : (
          <>
            {/* PRIMARY METRIC */}
            <div className="mb-6 flex items-end justify-between">
              <div>
                <div className="text-xs font-semibold uppercase text-slate-400">{isRiver ? 'Discharge' : 'Elevation'}</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                    {latest?.v.toFixed(2)}
                  </span>
                  <span className="text-sm font-medium text-slate-500">{isRiver ? 'cfs' : 'ft'}</span>
                </div>
              </div>
              
              <div className="text-right">
                 {/* Trend Badge */}
                 <div className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold ${
                   trend === 'rising' ? 'bg-blue-50 text-blue-700' : 
                   trend === 'falling' ? 'bg-amber-50 text-amber-700' : 
                   'bg-slate-50 text-slate-600'
                 }`}>
                   {trend === 'rising' ? '↗ Rising' : trend === 'falling' ? '↘ Falling' : '→ Stable'}
                 </div>
                 {stats && (
                   <div className={`mt-1 text-[11px] font-medium ${stats.change >= 0 ? 'text-blue-600' : 'text-amber-600'}`}>
                     {stats.change > 0 ? '+' : ''}{stats.change.toFixed(2)} {isRiver ? 'cfs' : 'ft'} (24h)
                   </div>
                 )}
              </div>
            </div>

            {/* POOL BAR */}
            {!isRiver && poolPercentage !== null && (
              <div className="mb-6">
                <div className="mb-1.5 flex justify-between text-[11px] font-bold uppercase tracking-wide text-slate-500">
                   <span>Pool Capacity</span>
                   <span>{poolPercentage.toFixed(1)}%</span>
                </div>
                <div className="relative h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      poolPercentage < 75 ? 'bg-rose-500' : 
                      poolPercentage < 85 ? 'bg-amber-400' : 
                      poolPercentage < 95 ? 'bg-sky-500' : 
                      'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(poolPercentage, 100)}%` }}
                  ></div>
                </div>
                <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                   <span>Bed: {streambed?.toFixed(0)}'</span>
                   <span>Cons: {conservationPool?.toFixed(0)}'</span>
                </div>
              </div>
            )}

            {/* CHART */}
            <div className="relative h-32 w-full overflow-hidden rounded-xl border border-slate-100 bg-slate-50/50">
               <WaterChart
                 data={series}
                 threshold={!isRiver ? conservationPool : undefined}
                 isFlow={isRiver}
                 streambed={!isRiver ? streambed : undefined}
                 alertLines={sardisLine}
               />
            </div>

            {/* FOOTER ACTIONS */}
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
               <span className="text-[10px] font-medium text-slate-400">
                 {dataSource === 'mock-demo' ? '⚠️ Demo Mode' : '✓ Live USGS'}
               </span>
               <div className="flex gap-3">
                 <DataExport 
                    waterBodyName={name} 
                    data={series}
                    usgsId={usgsId} 
                    conservationPool={conservationPool} 
                    currentLevel={latest?.v} 
                    poolPercentage={poolPercentage} 
                    alertLevel={alertLevel}
                 />
                 <a 
                   href={`https://waterdata.usgs.gov/monitoring-location/${usgsId}/`}
                   target="_blank"
                   rel="noreferrer"
                   className="text-[11px] font-bold text-sky-600 hover:text-sky-800"
                 >
                   USGS Page ↗
                 </a>
               </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
