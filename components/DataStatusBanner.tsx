'use client'

import { useState, useEffect } from 'react'

interface DataStatusBannerProps {
  /** Force showing the banner even when dismissed */
  persistent?: boolean
}

export default function DataStatusBanner({ persistent = false }: DataStatusBannerProps) {
  const [dismissed, setDismissed] = useState(() => {
    // Initialize dismissed state from localStorage
    if (typeof window !== 'undefined' && !persistent) {
      const wasDismissed = localStorage.getItem('data-status-banner-dismissed')
      return wasDismissed === 'true'
    }
    return false
  })
  const [dataSource, setDataSource] = useState<'checking' | 'live' | 'mock' | 'mixed'>('checking')

  useEffect(() => {
    // Check a sample of water bodies to see if we're getting live or mock data
    const checkDataSources = async () => {
      try {
        const sampleSites = ['07335775', '07336000', '07337900'] // Sardis, Hugo, Broken Bow
        const results = await Promise.all(
          sampleSites.map(async (site) => {
            try {
              const res = await fetch(`/api/usgs?site=${site}&param=62614`)
              return res.headers.get('X-Data-Source')
            } catch {
              return 'mock-demo'
            }
          })
        )

        const liveCount = results.filter(r => r === 'usgs-live').length
        const mockCount = results.filter(r => r === 'mock-demo').length

        if (liveCount === results.length) {
          setDataSource('live')
        } else if (mockCount === results.length) {
          setDataSource('mock')
        } else {
          setDataSource('mixed')
        }
      } catch {
        setDataSource('mock')
      }
    }

    void checkDataSources()
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

  return (
    <div className="border-b-2 border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-200 text-lg">
                ⚡
              </div>
            </div>
            <div className="flex-1">
              <div className="font-bold text-amber-900">
                {dataSource === 'mock' && 'Demo Data Mode'}
                {dataSource === 'mixed' && 'Partial Live Data'}
              </div>
              <div className="mt-1 text-sm text-amber-800">
                {dataSource === 'mock' && (
                  <>
                    You&apos;re viewing simulated data for demonstration purposes. The USGS live data service is currently unavailable.
                    All water levels and flows shown are realistic simulations based on typical patterns for each water body.
                  </>
                )}
                {dataSource === 'mixed' && (
                  <>
                    Some water bodies are showing live USGS data while others are using simulated data due to connectivity issues.
                    Check individual cards for their data source.
                  </>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <a
                  href="https://waterdata.usgs.gov/nwis/rt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg bg-amber-200 px-3 py-1 text-xs font-semibold text-amber-900 transition-colors hover:bg-amber-300"
                >
                  Check USGS Status
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1 text-xs font-semibold text-amber-900 transition-colors hover:bg-amber-100"
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
              className="flex-shrink-0 rounded-lg p-1 text-amber-700 transition-colors hover:bg-amber-200"
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
