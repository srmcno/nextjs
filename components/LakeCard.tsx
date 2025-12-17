'use client'

import { useEffect, useMemo, useState } from 'react'
import WaterChart from './WaterChart'

type UsgsValue = { value: string; dateTime: string }
type UsgsJson = any

function fmtTime(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleString()
  } catch {
    return iso
  }
}

export default function LakeCard({
  name,
  site,
  subtitle
}: {
  name: string
  site: string
  subtitle?: string
}) {
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [latest, setLatest] = useState<{ v: number; t: string } | null>(null)
  const [series, setSeries] = useState<Array<{ t: string; v: number }>>([])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setErr(null)

    fetch(`/api/usgs?site=${encodeURIComponent(site)}`)
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
      .catch(e => {
        if (cancelled) return
        setErr('Failed to load USGS data')
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [site])

  const badge = useMemo(() => {
    if (!latest) return { label: 'No data', cls: 'bg-black/10 text-black/70' }
    return { label: 'Live', cls: 'bg-emerald-100 text-emerald-900' }
  }, [latest])

  return (
    <div className="rounded-2xl border border-black/10 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-3 p-5">
        <div>
          <div className="text-lg font-semibold">{name}</div>
          <div className="text-sm text-black/60">
            {subtitle ?? `USGS Site ${site}`}
          </div>
        </div>

        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge.cls}`}>
          {badge.label}
        </span>
      </div>

      <div className="px-5 pb-2">
        {loading ? (
          <div className="rounded-xl bg-black/5 p-4 text-sm text-black/70">
            Loading…
          </div>
        ) : err ? (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-900">
            {err}
          </div>
        ) : (
          <>
            <div className="mb-3 flex items-baseline justify-between">
              <div className="text-3xl font-bold text-[#1F2933]">
                {latest ? latest.v.toFixed(2) : '—'}
                <span className="ml-2 text-base font-semibold text-black/50">
                  ft
                </span>
              </div>
              <div className="text-xs text-black/50">
                Updated: {latest ? fmtTime(latest.t) : '—'}
              </div>
            </div>

            <WaterChart data={series.slice(-96).map(p => ({ t: p.t, v: p.v }))} />

            <div className="mt-3 flex items-center justify-between text-xs text-black/50">
              <div>Last 96 points</div>
              <a
                className="font-semibold text-[#1E4F91] hover:underline"
                href={`https://waterdata.usgs.gov/monitoring-location/${site}/`}
                target="_blank"
                rel="noreferrer"
              >
                View on USGS
              </a>
            </div>
          </>
        )}
      </div>

      <div className="border-t border-black/10 px-5 py-4 text-xs text-black/60">
        Note: “ft” reflects USGS gage height where available (parameter 00065).
      </div>
    </div>
  )
}
