import Header from '../../components/Header'
import Footer from '../../components/Footer'
import LakeCard from '../../components/LakeCard'
import { getReservoirs, getRivers } from '../../lib/waterBodies'

export const metadata = {
  title: 'Water Levels Dashboard | Choctaw Nation Water Resource Management',
  description: 'Real-time water level monitoring for all water bodies covered by the Choctaw-Chickasaw Water Settlement Agreement.'
}

export default function DashboardPage() {
  const reservoirs = getReservoirs()
  const rivers = getRivers()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Header Section */}
      <section className="bg-gradient-to-br from-[#512A2A] via-[#6B3A3A] to-[#512A2A] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="flex items-center gap-4">
            {/* Choctaw Seal */}
            <div className="hidden h-16 w-16 sm:block">
              <svg viewBox="0 0 100 100" className="h-full w-full">
                <circle cx="50" cy="50" r="48" fill="#006B54" />
                <circle cx="50" cy="50" r="40" fill="#C5A052" />
                <circle cx="50" cy="50" r="36" fill="#D4B96A" />
                <g transform="translate(50, 50)">
                  <line x1="-15" y1="-15" x2="15" y2="15" stroke="#512A2A" strokeWidth="3" />
                  <line x1="15" y1="-15" x2="-15" y2="15" stroke="#512A2A" strokeWidth="3" />
                  <circle cx="0" cy="0" r="8" fill="#512A2A" />
                </g>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold md:text-3xl">
                Water Levels Dashboard
              </h1>
              <p className="mt-2 max-w-2xl text-white/80">
                Real-time pool elevations for settlement water bodies. Click any card for detailed settlement information.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <div className="rounded-lg bg-white/10 px-4 py-2 backdrop-blur">
              <span className="text-white/70">Reservoirs:</span>{' '}
              <span className="font-bold">{reservoirs.length}</span>
            </div>
            <div className="rounded-lg bg-white/10 px-4 py-2 backdrop-blur">
              <span className="text-white/70">Rivers:</span>{' '}
              <span className="font-bold">{rivers.length}</span>
            </div>
            <div className="rounded-lg bg-white/10 px-4 py-2 backdrop-blur">
              <span className="text-white/70">Data:</span>{' '}
              <span className="font-bold">USACE & USGS</span>
            </div>
          </div>
        </div>
      </section>

      {/* Legend */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="font-medium text-gray-600">Pool Status:</span>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#1B7340]"></span>
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
              <span className="h-3 w-3 rounded-full bg-red-600"></span>
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
            <h2 className="text-xl font-bold text-[#512A2A]">Settlement Reservoirs</h2>
            <p className="mt-1 text-sm text-gray-600">
              Pool elevations from U.S. Army Corps of Engineers. Click any card to view settlement rules and restrictions.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {reservoirs.map((waterBody) => (
              <LakeCard key={waterBody.id} waterBody={waterBody} />
            ))}
          </div>
        </section>

        {/* River Monitoring */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#512A2A]">River Flow Monitoring</h2>
            <p className="mt-1 text-sm text-gray-600">
              Streamflow data from USGS. Flow measured in cubic feet per second (cfs).
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {rivers.map((waterBody) => (
              <LakeCard key={waterBody.id} waterBody={waterBody} />
            ))}
          </div>
        </section>

        {/* Info Section */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-bold text-[#512A2A]">About This Data</h3>
          <div className="mt-4 grid gap-6 text-sm text-gray-700 md:grid-cols-3">
            <div>
              <div className="font-semibold text-[#512A2A]">Pool Elevation Source</div>
              <p className="mt-1">
                Reservoir pool elevations are from U.S. Army Corps of Engineers, Tulsa District water control systems.
              </p>
            </div>
            <div>
              <div className="font-semibold text-[#512A2A]">Pool Percentage Calculation</div>
              <p className="mt-1">
                Pool % = (Current Elevation - Streambed) ÷ (Conservation Pool - Streambed) × 100
              </p>
            </div>
            <div>
              <div className="font-semibold text-[#512A2A]">Settlement Restrictions</div>
              <p className="mt-1">
                Click any water body card to view specific settlement rules, thresholds, and withdrawal restrictions.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
