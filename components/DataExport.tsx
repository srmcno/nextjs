'use client'

import { useState } from 'react'

interface DataExportProps {
  waterBodyName: string
  data: Array<{ t: string; v: number }>
  usgsId: string
}

export default function DataExport({ waterBodyName, data, usgsId }: DataExportProps) {
  const [isOpen, setIsOpen] = useState(false)

  const exportCSV = () => {
    const csv = [
      ['Timestamp', 'Value', 'USGS ID', 'Water Body'],
      ...data.map(d => [
        new Date(d.t).toISOString(),
        d.v.toString(),
        usgsId,
        waterBodyName
      ])
    ].map(row => row.join(',')).join('\n')

    downloadFile(csv, `${waterBodyName.replace(/\s+/g, '_')}_${usgsId}_data.csv`, 'text/csv')
  }

  const exportJSON = () => {
    const json = JSON.stringify({
      waterBody: waterBodyName,
      usgsId,
      exportDate: new Date().toISOString(),
      dataPoints: data.map(d => ({
        timestamp: d.t,
        value: d.v
      }))
    }, null, 2)

    downloadFile(json, `${waterBodyName.replace(/\s+/g, '_')}_${usgsId}_data.json`, 'application/json')
  }

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setIsOpen(false)
  }

  if (data.length === 0) return null

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export Data
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-lg">
            <div className="p-2">
              <button
                onClick={exportCSV}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
              >
                <svg className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export as CSV
              </button>
              <button
                onClick={exportJSON}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
              >
                <svg className="h-4 w-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Export as JSON
              </button>
            </div>
            <div className="border-t border-slate-200 p-3 text-xs text-slate-600">
              {data.length} data points
            </div>
          </div>
        </>
      )}
    </div>
  )
}
