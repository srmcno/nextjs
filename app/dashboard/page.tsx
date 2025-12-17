import Header from '../../components/Header'
import Footer from '../../components/Footer'
import LakeCard from '../../components/LakeCard'
import { SETTLEMENT_WATER_BODIES, getReservoirs, getRivers } from '../../lib/waterBodies'

export const metadata = {
  title: 'Dashboard | Choctaw-Chickasaw Water Settlement Portal',
  description: 'Real-time water level monitoring for all water bodies covered by the Choctaw-Chickasaw Water Settlement Agreement.'
}

export default function DashboardPage() {
  const reservoirs = getReservoirs()
  const rivers = getRivers()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      {/* Header Section */}
      <section className="bg-gradient-to-br from-[#8B0000] via-[#6B0000] to-[#4A0000] text-white">
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
              <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
              <span className="text-gray-600">Watch (85-95%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-orange-500"></span>
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
        {/* Critical Settlement Reservoirs */}
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

        {/* River Monitoring */}
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
