'use client'

import { useState, useEffect } from 'react'
import type { WaterBody } from '../lib/waterBodies'
import { SARDIS_WITHDRAWAL_THRESHOLDS } from '../lib/waterBodies'

interface InfoModalProps {
  waterBody: WaterBody
  isOpen: boolean
  onClose: () => void
  currentElevation?: number
  poolPercentage?: number
}

export default function InfoModal({
  waterBody,
  isOpen,
  onClose,
  currentElevation,
  poolPercentage
}: InfoModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!mounted || !isOpen) return null

  const isSardis = waterBody.id === 'sardis'
  const isRiver = waterBody.type === 'river'

  // Parse markdown-style bold text
  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Replace **text** with bold
      const formatted = line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      // Replace • with proper bullet
      const withBullets = formatted.replace(/^•/, '&bull;')
      return (
        <p
          key={i}
          className={`${line.startsWith('•') || line.startsWith('&bull;') ? 'ml-4' : ''} ${line === '' ? 'h-2' : 'mb-2'}`}
          dangerouslySetInnerHTML={{ __html: withBullets }}
        />
      )
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-gradient-to-r from-[#512A2A] to-[#6B3A3A] px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{waterBody.name}</h2>
              <p className="mt-1 text-sm text-white/80">{waterBody.county} County • {waterBody.agency}</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-180px)] overflow-y-auto px-6 py-6">
          {/* Current Status */}
          {!isRiver && currentElevation && (
            <div className="mb-6 rounded-xl bg-gray-50 p-4">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Current Status</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div>
                  <div className="text-xs text-gray-500">Pool Elevation</div>
                  <div className="text-2xl font-bold text-[#512A2A]">{currentElevation.toFixed(2)} ft</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Conservation Pool</div>
                  <div className="text-2xl font-bold text-[#1B7340]">{waterBody.conservationPool.toFixed(1)} ft</div>
                </div>
                {poolPercentage !== undefined && (
                  <div>
                    <div className="text-xs text-gray-500">Pool Level</div>
                    <div className={`text-2xl font-bold ${
                      poolPercentage >= 95 ? 'text-[#1B7340]' :
                      poolPercentage >= 85 ? 'text-yellow-600' :
                      poolPercentage >= 75 ? 'text-orange-600' :
                      'text-red-600'
                    }`}>{poolPercentage.toFixed(1)}%</div>
                  </div>
                )}
              </div>

              {/* Sardis Lake Special Status */}
              {isSardis && currentElevation && (
                <div className="mt-4 rounded-lg border-2 border-dashed border-gray-300 p-3">
                  <div className="text-sm font-semibold text-gray-700">OKC Withdrawal Status</div>
                  {currentElevation >= SARDIS_WITHDRAWAL_THRESHOLDS.minimumForWithdrawal ? (
                    <div className="mt-1 flex items-center gap-2 text-[#1B7340]">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Withdrawals Permitted</span>
                    </div>
                  ) : (
                    <div className="mt-1 flex items-center gap-2 text-red-600">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="font-bold">WITHDRAWALS PROHIBITED</span>
                    </div>
                  )}
                  <div className="mt-2 text-xs text-gray-500">
                    Minimum for OKC withdrawal: {SARDIS_WITHDRAWAL_THRESHOLDS.minimumForWithdrawal} ft
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Settlement Information */}
          <div className="prose prose-sm max-w-none text-gray-700">
            {formatText(waterBody.settlementInfo)}
          </div>

          {/* Key Statistics */}
          {!isRiver && (
            <div className="mt-6 rounded-xl border border-gray-200 p-4">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Key Statistics</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {waterBody.surfaceArea && (
                  <div>
                    <div className="text-gray-500">Surface Area</div>
                    <div className="font-semibold text-gray-900">{waterBody.surfaceArea.toLocaleString()} acres</div>
                  </div>
                )}
                {waterBody.storageCapacity && (
                  <div>
                    <div className="text-gray-500">Storage Capacity</div>
                    <div className="font-semibold text-gray-900">{waterBody.storageCapacity.toLocaleString()} ac-ft</div>
                  </div>
                )}
                {waterBody.streambed && (
                  <div>
                    <div className="text-gray-500">Streambed Elevation</div>
                    <div className="font-semibold text-gray-900">{waterBody.streambed} ft</div>
                  </div>
                )}
                {waterBody.topOfDam && (
                  <div>
                    <div className="text-gray-500">Top of Dam</div>
                    <div className="font-semibold text-gray-900">{waterBody.topOfDam} ft</div>
                  </div>
                )}
                {waterBody.yearCompleted && (
                  <div>
                    <div className="text-gray-500">Year Completed</div>
                    <div className="font-semibold text-gray-900">{waterBody.yearCompleted}</div>
                  </div>
                )}
                {waterBody.floodPoolTop && (
                  <div>
                    <div className="text-gray-500">Flood Pool Top</div>
                    <div className="font-semibold text-gray-900">{waterBody.floodPoolTop} ft</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Data Source */}
          <div className="mt-6 rounded-lg bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm">
                <div className="font-semibold text-blue-900">Data Source</div>
                <p className="mt-1 text-blue-800">
                  {waterBody.dataSource === 'usace' && 'U.S. Army Corps of Engineers, Tulsa District (USACE SWT)'}
                  {waterBody.dataSource === 'usgs' && 'U.S. Geological Survey (USGS)'}
                  {waterBody.dataSource === 'bor' && 'Bureau of Reclamation'}
                </p>
                {waterBody.usaceCode && (
                  <p className="mt-1 text-blue-700">Site Code: {waterBody.usaceCode}</p>
                )}
                {waterBody.usgsId && (
                  <p className="mt-1 text-blue-700">USGS ID: {waterBody.usgsId}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Choctaw-Chickasaw Water Settlement (P.L. 114-322)
            </div>
            <button
              onClick={onClose}
              className="rounded-lg bg-[#512A2A] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#6B3A3A]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
