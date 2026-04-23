'use client'

import { useEffect, useState } from 'react'
import {
  OKC_RESERVOIR_SYSTEM,
  calculateCombinedStorage,
  determineWSADroughtCondition,
  getSardisRestriction
} from './okcReservoirSystem'

interface USACEValue { dateTime: string; value: number }
interface USGSTimeSeriesValue { value: string }

async function fetchLatestElevation(usgsId: string, usaceId?: string): Promise<number | null> {
  if (usaceId) {
    try {
      const r = await fetch(`/api/usace?site=${usaceId}&param=Elev`, { cache: 'no-store' })
      if (r.ok) {
        const d = await r.json()
        const values: USACEValue[] | undefined = d.values
        if (values && values.length) {
          return Number(values[values.length - 1].value)
        }
      }
    } catch {
      // Fall through to USGS
    }
  }

  try {
    const r = await fetch(`/api/usgs?site=${usgsId}&param=62614`, { cache: 'no-store' })
    if (!r.ok) return null
    const d = await r.json()
    const vs: USGSTimeSeriesValue[] | undefined = d?.value?.timeSeries?.[0]?.values?.[0]?.value
    if (vs && vs.length) {
      const latest = Number(vs[vs.length - 1].value)
      return Number.isFinite(latest) ? latest : null
    }
  } catch {
    // ignore
  }
  return null
}

export interface OKCSystemSnapshot {
  loading: boolean
  elevations: Map<string, number>
  totalStorage: number
  percentage: number
  details: ReturnType<typeof calculateCombinedStorage>['details']
  hefnerPct: number
  draperPct: number
  drought: ReturnType<typeof determineWSADroughtCondition>
  sardisRule: ReturnType<typeof getSardisRestriction>
}

export function useOKCSystem(): OKCSystemSnapshot {
  const [elevations, setElevations] = useState<Map<string, number>>(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      const entries = await Promise.all(
        OKC_RESERVOIR_SYSTEM.map(async (res) => {
          const val = await fetchLatestElevation(res.usgsId, res.usaceId)
          return [res.id, val] as const
        })
      )

      if (cancelled) return

      const next = new Map<string, number>()
      for (const [id, val] of entries) {
        if (val !== null) next.set(id, val)
      }
      setElevations(next)
      setLoading(false)
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const { totalStorage, percentage, details } = calculateCombinedStorage(elevations)
  const hefnerPct = details.find((d) => d.id === 'hefner')?.percentFull ?? 100
  const draperPct = details.find((d) => d.id === 'draper')?.percentFull ?? 100
  const drought = determineWSADroughtCondition(percentage, hefnerPct, draperPct)
  const sardisRule = getSardisRestriction(drought.condition)

  return {
    loading,
    elevations,
    totalStorage,
    percentage,
    details,
    hefnerPct,
    draperPct,
    drought,
    sardisRule
  }
}
