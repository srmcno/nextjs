'use client'

import { useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import LakeCard from '../../components/LakeCard'
import SearchFilter from '../../components/SearchFilter'
import DataStatusBanner from '../../components/DataStatusBanner'
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
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="font-medium text-gray-600">Status:</span>
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
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
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
          <div className="mt-3 grid gap-4 text-sm text-gray-700 md:grid-cols-3">
            <div>
              <div className="font-medium text-gray-900">Data Source</div>
              <p className="mt-1">
                All water level and flow data comes from the U.S. Geological Survey (USGS) National Water Information System.
              </p>
            </div>
            <div>
              <div className="font-medium text-gray-900">Update Frequency</div>
              <p className="mt-1">
                USGS stations typically report data every 15-60 minutes. This dashboard refreshes every 60 seconds.
              </p>
            </div>
            <div>
              <div className="font-medium text-gray-900">Pool Calculations</div>
              <p className="mt-1">
                Pool percentage = (Current Level - Streambed) / (Conservation Pool - Streambed) × 100
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
