'use client'

import { useState, useEffect } from 'react'

interface DataStatusBannerProps {
  /** Force showing the banner even when dismissed */
  persistent?: boolean
}

type DataSourceState = 'checking' | 'live' | 'mock' | 'mixed'

// Sample both USGS rivers/lakes and a USACE lake so a single blocked endpoint
// doesn't flip the whole banner.
const SAMPLE_REQUESTS: Array<{ endpoint: string; live: string }> = [
  { endpoint: '/api/usgs?site=07335775&param=62614', live: 'usgs-live' },  // Sardis (USGS)
  { endpoint: '/api/usgs?site=07336200&param=00060', live: 'usgs-live' },  // Kiamichi at Antlers (USGS)
  { endpoint: '/api/usace?site=CYDO2&param=Elev', live: 'usace-live' }     // Sardis (USACE)
]

export default function DataStatusBanner({ persistent = false }: DataStatusBannerProps) {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window !== 'undefined' && !persistent) {
      return localStorage.getItem('data-status-banner-dismissed') === 'true'
    }
    return false
  })
  const [dataSource, setDataSource] = useState<DataSourceState>('checking')

  useEffect(() => {
    let cancelled = false

    const checkDataSources = async () => {
      const results = await Promise.all(
        SAMPLE_REQUESTS.map(async ({ endpoint, live }) => {
          try {
            const res = await fetch(endpoint, { cache: 'no-store' })
            const header = res.headers.get('X-Data-Source') ?? ''
            if (header === live) return 'live' as const
            if (header === 'mock-demo') return 'mock' as const
            return 'mock' as const
          } catch {
            return 'mock' as const
          }
        })
      )

      if (cancelled) return

      const liveCount = results.filter((r) => r === 'live').length
      if (liveCount === results.length) setDataSource('live')
      else if (liveCount === 0) setDataSource('mock')
      else setDataSource('mixed')
    }

    void checkDataSources()
    return () => {
      cancelled = true
    }
  }, [persistent])

  const handleDismiss = () => {
    if (!persistent) {
      localStorage.setItem('data-status-banner-dismissed', 'true')
      setDismissed(true)
    }
  }

  if (dismissed || dataSource === 'checking' || dataSource === 'live') {
    return null
  }

  const isMock = dataSource === 'mock'

  return (
    <div className="border-b-2 border-choctaw-sealYellow bg-gradient-to-r from-choctaw-sealYellow/5 to-choctaw-sealYellow/10">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-choctaw-sealYellow/30 text-lg">
                ⚡
              </div>
            </div>
            <div className="flex-1">
              <div className="font-bold text-choctaw-brown">
                {isMock ? 'Demo Data Mode' : 'Partial Live Data'}
              </div>
              <div className="mt-1 text-sm text-choctaw-brown/80">
                {isMock ? (
                  <>
                    Live USACE and USGS feeds are unreachable from this environment. All charts below use
                    realistic demo data generated from typical patterns so the dashboard stays functional.
                  </>
                ) : (
                  <>
                    Some water bodies are showing live agency data while others are falling back to demo
                    data due to connectivity. Check the source badge on each card.
                  </>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <a
                  href="https://waterdata.usgs.gov/nwis/rt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg bg-choctaw-sealYellow/30 px-3 py-1 text-xs font-semibold text-choctaw-brown transition-colors hover:bg-choctaw-sealYellow/40"
                >
                  Check USGS Status
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1 text-xs font-semibold text-choctaw-brown transition-colors hover:bg-choctaw-sealYellow/10"
                >
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Retry Connection
                </button>
              </div>
            </div>
          </div>
          {!persistent && (
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 rounded-lg p-1 text-choctaw-brown/70 transition-colors hover:bg-choctaw-sealYellow/20"
              aria-label="Dismiss banner"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
