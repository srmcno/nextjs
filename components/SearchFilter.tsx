'use client'

import { useState } from 'react'
import { WaterBody, AlertLevel } from '../lib/waterBodies'

interface SearchFilterProps {
  onFilterChange: (filtered: WaterBody[]) => void
  waterBodies: WaterBody[]
}

export default function SearchFilter({ onFilterChange, waterBodies }: SearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedCounty, setSelectedCounty] = useState<string>('all')

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    applyFilters(term, selectedType, selectedCounty)
  }

  const handleTypeFilter = (type: string) => {
    setSelectedType(type)
    applyFilters(searchTerm, type, selectedCounty)
  }

  const handleCountyFilter = (county: string) => {
    setSelectedCounty(county)
    applyFilters(searchTerm, selectedType, county)
  }

  const applyFilters = (term: string, type: string, county: string) => {
    let filtered = waterBodies

    // Search filter
    if (term) {
      filtered = filtered.filter(wb =>
        wb.name.toLowerCase().includes(term.toLowerCase()) ||
        wb.description.toLowerCase().includes(term.toLowerCase()) ||
        wb.usgsId.includes(term)
      )
    }

    // Type filter
    if (type !== 'all') {
      filtered = filtered.filter(wb => wb.type === type)
    }

    // County filter
    if (county !== 'all') {
      filtered = filtered.filter(wb => wb.county === county)
    }

    onFilterChange(filtered)
  }

  const counties = Array.from(new Set(waterBodies.map(wb => wb.county))).sort()

  return (
    <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <svg className="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <h3 className="text-lg font-bold text-slate-900">Search & Filter</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Search */}
        <div className="md:col-span-3">
          <label className="mb-2 block text-sm font-semibold text-slate-700">Search</label>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, description, or USGS ID..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
        </div>

        {/* Type Filter */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Type</label>
          <select
            value={selectedType}
            onChange={(e) => handleTypeFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white py-2 px-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          >
            <option value="all">All Types</option>
            <option value="reservoir">Reservoirs</option>
            <option value="river">Rivers</option>
          </select>
        </div>

        {/* County Filter */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">County</label>
          <select
            value={selectedCounty}
            onChange={(e) => handleCountyFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white py-2 px-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          >
            <option value="all">All Counties</option>
            {counties.map(county => (
              <option key={county} value={county}>{county} County</option>
            ))}
          </select>
        </div>
      </div>

      {/* Reset Button */}
      {(searchTerm || selectedType !== 'all' || selectedCounty !== 'all') && (
        <div className="mt-4">
          <button
            onClick={() => {
              setSearchTerm('')
              setSelectedType('all')
              setSelectedCounty('all')
              onFilterChange(waterBodies)
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}
