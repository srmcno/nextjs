'use client'

import { useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import LakeCard from '../../components/LakeCard'
import SearchFilter from '../../components/SearchFilter'
import DataStatusBanner from '../../components/DataStatusBanner'
import OKCSystemStatus from '../../components/OKCSystemStatus'
import { SETTLEMENT_WATER_BODIES, getReservoirs, getRivers, WaterBody } from '../../lib/waterBodies'

export default function DashboardPage() {
  const allWaterBodies = SETTLEMENT_WATER_BODIES
  const [filteredWaterBodies, setFilteredWaterBodies] = useState<WaterBody[]>(allWaterBodies)

  const reservoirs = filteredWaterBodies.filter(wb => wb.type === 'reservoir')
  const rivers = filteredWaterBodies.filter(wb => wb.type === 'river')

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <DataStatusBanner />

      {/* Header Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <h1 className="text-3xl font-extrabold md:text-4xl">
            Live Water Conditions Dashboard
          </h1>
          <p className="mt-3 max-w-3xl text-white/90">
            Real-time monitoring of all water bodies covered by the Choctaw-Chickasaw Water Settlement Agreement.
            Data sourced from official USGS monitoring stations.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <div className="rounded-lg bg-white/10 px-4 py-2">
              <span className="text-white/70">Reservoirs:</span>{' '}
              <span className="font-semibold">{reservoirs.length}</span>
            </div>
            <div className="rounded-lg bg-white/10 px-4 py-2">
              <span className="text-white/70">Rivers:</span>{' '}
              <span className="font-semibold">{rivers.length}</span>
            </div>
            <div className="rounded-lg bg-white/10 px-4 py-2">
              <span className="text-white/70">Data Source:</span>{' '}
              <span className="font-semibold">USGS Real-Time</span>
            </div>
          </div>
        </div>
      </section>

      {/* Legend */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="font-medium text-gray-600">Pool Status:</span>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
                <span className="text-gray-600">Normal (≥95%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-sky-500"></span>
                <span className="text-gray-600">Watch (85-95%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-slate-500"></span>
                <span className="text-gray-600">Warning (75-85%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500"></span>
                <span className="text-gray-600">Critical (&lt;75%)</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="font-medium text-gray-600">WSA Drought:</span>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
                <span className="text-gray-600">Moderate (65-75%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-amber-500"></span>
                <span className="text-gray-600">Advanced (50-65%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-600"></span>
                <span className="text-gray-600">Extreme (&lt;50%)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* OKC System Status - Per Exhibit 13 */}
        <div className="mb-8">
          <OKCSystemStatus />
        </div>

        {/* Search and Filter */}
        <SearchFilter
          waterBodies={allWaterBodies}
          onFilterChange={setFilteredWaterBodies}
        />

        {/* Results Summary */}
        <div className="mb-6 text-sm text-slate-600">
          Showing <span className="font-semibold text-slate-900">{filteredWaterBodies.length}</span> of {allWaterBodies.length} water bodies
          {filteredWaterBodies.length !== allWaterBodies.length && (
            <span className="ml-2 text-emerald-700">(filtered)</span>
          )}
        </div>

        {/* Critical Settlement Reservoirs */}
        {reservoirs.length > 0 && (
          <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Settlement Reservoirs</h2>
            <p className="mt-1 text-gray-600">
              Major reservoirs covered by the water settlement agreement. Pool levels are measured against conservation pool elevation.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {reservoirs.map((waterBody) => (
              <LakeCard key={waterBody.id} waterBody={waterBody} />
            ))}
          </div>
          </section>
        )}

        {/* River Monitoring */}
        {rivers.length > 0 && (
          <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">River Flow Monitoring</h2>
            <p className="mt-1 text-gray-600">
              Key river monitoring stations in the settlement area. Flow is measured in cubic feet per second (cfs).
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {rivers.map((waterBody) => (
              <LakeCard key={waterBody.id} waterBody={waterBody} />
            ))}
          </div>
          </section>
        )}

        {/* No Results */}
        {filteredWaterBodies.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No water bodies found</h3>
            <p className="mt-2 text-sm text-slate-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Info Section */}
        <section className="rounded-2xl bg-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900">About This Data</h3>
          <div className="mt-3 grid gap-4 text-sm text-gray-700 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="font-medium text-gray-900">Data Sources</div>
              <p className="mt-1">
                Primary: USGS National Water Information System. Supplementary: USACE Tulsa District, OWRB Monthly Reports.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <a href="https://waterdata.usgs.gov/ok/nwis/current/?type=lake" target="_blank" rel="noreferrer" className="text-xs text-sky-600 hover:underline">USGS OK Lakes</a>
                <a href="https://www.swt-wc.usace.army.mil/" target="_blank" rel="noreferrer" className="text-xs text-sky-600 hover:underline">USACE Tulsa</a>
              </div>
            </div>
            <div>
              <div className="font-medium text-gray-900">Update Frequency</div>
              <p className="mt-1">
                USGS stations report every 15-60 minutes. Dashboard refreshes on page load. Real-time data may have 15-30 minute latency.
              </p>
            </div>
            <div>
              <div className="font-medium text-gray-900">Pool Calculations</div>
              <p className="mt-1">
                Pool % = (Current - Streambed) / (Conservation - Streambed) × 100. Conservation pool elevations from USACE/BOR surveys.
              </p>
            </div>
            <div>
              <div className="font-medium text-gray-900">WSA Drought Determination</div>
              <p className="mt-1">
                Per Section 6: ALL THREE must be below threshold: (1) Combined OKC system, (2) Hefner individually, (3) Draper individually.
              </p>
            </div>
          </div>
        </section>

        {/* WSA Key Numbers */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900">Water Settlement Agreement Key Numbers</h3>
          <div className="mt-4 grid gap-4 text-sm md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-slate-50 p-4">
              <div className="text-2xl font-bold text-slate-900">115,000</div>
              <div className="text-xs font-semibold uppercase text-slate-600">AFY City Appropriation</div>
              <div className="mt-1 text-xs text-slate-500">Annual Kiamichi Basin rights</div>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <div className="text-2xl font-bold text-slate-900">297,200</div>
              <div className="text-xs font-semibold uppercase text-slate-600">AF Sardis Conservation</div>
              <div className="mt-1 text-xs text-slate-500">Total conservation storage</div>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <div className="text-2xl font-bold text-slate-900">407,105</div>
              <div className="text-xs font-semibold uppercase text-slate-600">AF OKC System Capacity</div>
              <div className="mt-1 text-xs text-slate-500">Combined 6-reservoir live storage</div>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <div className="text-2xl font-bold text-slate-900">50 cfs</div>
              <div className="text-xs font-semibold uppercase text-slate-600">Bypass Requirement</div>
              <div className="mt-1 text-xs text-slate-500">Minimum flow at Moyers Crossing</div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
