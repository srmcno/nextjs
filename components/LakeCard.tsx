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

type Point = { t: string; v: number }
type DataSource = 'usace-live' | 'usgs-live' | 'mock-demo' | 'unknown'

interface LakeCardProps {
  waterBody: WaterBody
}

const SOURCE_LABEL: Record<DataSource, { short: string; long: string; dot: string }> = {
  'usace-live':  { short: 'Live',  long: '✓ USACE Live',  dot: 'bg-emerald-500' },
  'usgs-live':   { short: 'Live',  long: '✓ USGS Live',   dot: 'bg-emerald-500' },
  'mock-demo':   { short: 'Demo',  long: '◦ Demo Data',   dot: 'bg-amber-400' },
  'unknown':     { short: '—',     long: 'No Source',     dot: 'bg-slate-300' }
}

const ALERT_CONFIG: Record<AlertLevel, { badgeColor: string; borderColor: string; headerBg: string }> = {
  normal: {
    badgeColor: 'bg-choctaw-green/10 text-choctaw-green ring-1 ring-choctaw-green/20',
    borderColor: 'border-gray-200 hover:border-choctaw-green/30',
    headerBg: 'bg-gradient-to-r from-white to-choctaw-green/5'
  },
  watch: {
    badgeColor: 'bg-choctaw-sealBlue/10 text-choctaw-sealBlue ring-1 ring-choctaw-sealBlue/20',
    borderColor: 'border-choctaw-sealBlue/20 hover:border-choctaw-sealBlue/30',
    headerBg: 'bg-gradient-to-r from-white to-choctaw-sealBlue/5'
  },
  warning: {
    badgeColor: 'bg-choctaw-sealYellow/10 text-choctaw-brown ring-1 ring-choctaw-sealYellow/20',
    borderColor: 'border-choctaw-sealYellow/20 hover:border-choctaw-sealYellow/30',
    headerBg: 'bg-gradient-to-r from-white to-choctaw-sealYellow/5'
  },
  critical: {
    badgeColor: 'bg-choctaw-sealRed/10 text-choctaw-sealRed ring-1 ring-choctaw-sealRed/20',
    borderColor: 'border-choctaw-sealRed/20 hover:border-choctaw-sealRed/30',
    headerBg: 'bg-gradient-to-r from-white to-choctaw-sealRed/5'
  }
}

export default function LakeCard({ waterBody }: LakeCardProps) {
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [latest, setLatest] = useState<Point | null>(null)
  const [series, setSeries] = useState<Point[]>([])
  const [dataSource, setDataSource] = useState<DataSource>('unknown')

  const { usgsId, usaceId, parameterCode, usaceParam, conservationPool, streambed, name, type, county } = waterBody
  const isRiver = type === 'river'

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      if (!cancelled) {
        setLoading(true)
        setErr(null)
      }

      // 1. Try USACE API first for reservoirs with a USACE ID
      if (usaceId && usaceParam && !cancelled) {
        try {
          const res = await fetch(`/api/usace?site=${usaceId}&param=${usaceParam}`, { cache: 'no-store' })
          if (res.ok) {
            const json = await res.json()
            interface USACEValue { dateTime: string; value: number }
            const pts: Point[] = (json.values as USACEValue[] | undefined ?? [])
              .map((v) => ({ t: v.dateTime, v: Number(v.value) }))
              .filter((p) => Number.isFinite(p.v))

            if (pts.length > 0 && !cancelled) {
              const header = res.headers.get('X-Data-Source') as DataSource | null
              setSeries(pts)
              setLatest(pts[pts.length - 1])
              setDataSource(header === 'mock-demo' ? 'mock-demo' : 'usace-live')
              setLoading(false)
              return
            }
          }
        } catch {
          // Fall through to USGS
        }
      }

      // 2. Fall back to USGS (or primary for rivers)
      if (!cancelled) {
        try {
          const res = await fetch(`/api/usgs?site=${encodeURIComponent(usgsId)}&param=${parameterCode}`, { cache: 'no-store' })
          const json = await res.json()
          interface USGSValue { dateTime: string; value: number | string }
          const values: USGSValue[] = json?.value?.timeSeries?.[0]?.values?.[0]?.value ?? []
          const pts: Point[] = values
            .map((v) => ({ t: v.dateTime, v: Number(v.value) }))
            .filter((p) => Number.isFinite(p.v))

          if (pts.length > 0 && !cancelled) {
            const header = res.headers.get('X-Data-Source') as DataSource | null
            setSeries(pts)
            setLatest(pts[pts.length - 1])
            setDataSource(header === 'mock-demo' ? 'mock-demo' : 'usgs-live')
            setLoading(false)
            return
          }
        } catch (error) {
          console.error(`USGS fetch failed for ${name}`, error)
        }
      }

      if (!cancelled) {
        setErr('Data unavailable')
        setLoading(false)
      }
    }

    void load()
    return () => { cancelled = true }
  }, [usgsId, usaceId, usaceParam, parameterCode, name])

  // ... (Calculations logic remains the same)
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
    const change = series[series.length - 1].v - series[0].v
    return { change }
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
  const statusLabel = { normal: 'Normal', watch: 'Watch', warning: 'Warning', critical: 'Critical' }[alertLevel]

  const sardisLine = waterBody.id === 'sardis' ? [{
    value: SARDIS_WITHDRAWAL_THRESHOLDS.minimumForWithdrawal,
    label: 'OKC Withdrawal Floor',
    color: '#ef4444'
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
            <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <span>{county} County</span>
              <span className="text-slate-300">•</span>
              <span>{dataSource === 'usace-live' && usaceId ? `USACE ${usaceId}` : `USGS ${usgsId}`}</span>
              {!loading && dataSource !== 'unknown' && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="inline-flex items-center gap-1 normal-case tracking-normal">
                    <span className={`h-1.5 w-1.5 rounded-full ${SOURCE_LABEL[dataSource].dot}`} />
                    <span className={dataSource === 'mock-demo' ? 'text-amber-600' : 'text-emerald-600'}>
                      {SOURCE_LABEL[dataSource].short}
                    </span>
                  </span>
                </>
              )}
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
              WITHDRAWAL HOLD: Level below {SARDIS_WITHDRAWAL_THRESHOLDS.minimumForWithdrawal} ft
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
                   <span>Bed: {streambed?.toFixed(0)} ft</span>
                   <span>Cons: {conservationPool?.toFixed(0)} ft</span>
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
               <span className={`text-[10px] font-medium ${
                 dataSource === 'mock-demo' ? 'text-amber-600' : 'text-slate-400'
               }`}>
                 {SOURCE_LABEL[dataSource].long}
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
                   href={dataSource === 'usace-live' && usaceId
                     ? `https://water.usace.army.mil/overview/swt/locations/${usaceId.toLowerCase()}`
                     : `https://waterdata.usgs.gov/monitoring-location/${usgsId}/`}
                   target="_blank"
                   rel="noreferrer"
                   className="text-[11px] font-bold text-sky-600 hover:text-sky-800"
                 >
                   {dataSource === 'usace-live' ? 'USACE Page ↗' : 'USGS Page ↗'}
                 </a>
               </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
