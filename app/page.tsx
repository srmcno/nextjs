import Header from '../components/Header'
import Footer from '../components/Footer'
import LakeCard from '../components/LakeCard'
import {
  SETTLEMENT_WATER_BODIES,
  getReservoirs,
  SARDIS_WITHDRAWAL_THRESHOLDS
} from '../lib/waterBodies'

export const metadata = {
  title: 'Choctaw-Chickasaw Water Settlement Portal | Live Water Conditions',
  description: 'Real-time water level monitoring for the Choctaw and Chickasaw Nations Water Settlement Agreement. Track Sardis Lake, Kiamichi River, and other settlement water bodies.'
}

export default function Home() {
  const reservoirs = getReservoirs()
  const sardis = SETTLEMENT_WATER_BODIES.find(wb => wb.id === 'sardis')
  const featuredReservoirs = reservoirs.slice(0, 4)

  return (
    <div className="min-h-screen">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#8B0000] via-[#6B0000] to-[#4A0000] text-white">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="water-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M0 10 Q 5 5, 10 10 T 20 10" stroke="white" fill="none" strokeWidth="0.5" />
            </pattern>
            <rect x="0" y="0" width="100" height="100" fill="url(#water-pattern)" />
          </svg>
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:py-20">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></span>
              Live USGS Data
            </div>

            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
              Water Settlement
              <span className="block bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">
                Live Conditions
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-white/85">
              A public transparency portal for real-time water levels and streamflows
              tied to the historic <strong>Choctaw–Chickasaw–Oklahoma Water Settlement Agreement</strong>.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-bold text-[#8B0000] shadow-lg transition-transform hover:scale-105"
              >
                View Dashboard
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="/settlement"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
              >
                About the Settlement
              </a>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4">
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
                <div className="text-3xl font-bold text-[#D4AF37]">{reservoirs.length}</div>
                <div className="mt-1 text-sm text-white/70">Reservoirs</div>
              </div>
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
                <div className="text-3xl font-bold text-[#D4AF37]">22</div>
                <div className="mt-1 text-sm text-white/70">Counties</div>
              </div>
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
                <div className="text-3xl font-bold text-[#D4AF37]">24/7</div>
                <div className="mt-1 text-sm text-white/70">Monitoring</div>
              </div>
            </div>
          </div>

          {/* Sardis Lake Highlight */}
          <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white/70">Featured Critical Reservoir</div>
                <div className="text-xl font-bold">Sardis Lake</div>
              </div>
              <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-semibold text-orange-200">
                Settlement Critical
              </span>
            </div>

            <div className="rounded-xl bg-black/20 p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xs text-white/60">Conservation Pool</div>
                  <div className="mt-1 text-2xl font-bold text-emerald-400">{SARDIS_WITHDRAWAL_THRESHOLDS.conservationPool}</div>
                  <div className="text-xs text-white/60">feet</div>
                </div>
                <div>
                  <div className="text-xs text-white/60">OKC Min. Level</div>
                  <div className="mt-1 text-2xl font-bold text-yellow-400">{SARDIS_WITHDRAWAL_THRESHOLDS.minimumForWithdrawal}</div>
                  <div className="text-xs text-white/60">feet</div>
                </div>
                <div>
                  <div className="text-xs text-white/60">Critical Level</div>
                  <div className="mt-1 text-2xl font-bold text-red-400">{SARDIS_WITHDRAWAL_THRESHOLDS.criticalLevel}</div>
                  <div className="text-xs text-white/60">feet</div>
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm text-white/80">
              Under the settlement, Oklahoma City cannot withdraw water from Sardis Lake
              when levels fall below {SARDIS_WITHDRAWAL_THRESHOLDS.minimumForWithdrawal} ft to protect recreation and wildlife.
            </p>

            <a
              href="/dashboard"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#D4AF37] hover:underline"
            >
              View all water bodies
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* QUICK STATUS */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Quick Status Overview</h2>
              <p className="text-sm text-gray-600">Featured settlement reservoirs</p>
            </div>
            <a
              href="/dashboard"
              className="text-sm font-semibold text-[#8B0000] hover:underline"
            >
              View all {reservoirs.length} water bodies →
            </a>
          </div>
        </div>
      </section>

      {/* FEATURED WATER BODIES */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featuredReservoirs.map((waterBody) => (
              <LakeCard key={waterBody.id} waterBody={waterBody} />
            ))}
          </div>
        </div>
      </section>

      {/* SETTLEMENT OVERVIEW */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              About the Water Settlement
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              The Choctaw and Chickasaw Nations Water Settlement is a landmark 2016 agreement
              that recognizes tribal water rights while establishing a framework for sustainable
              water management across southeastern Oklahoma.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                🏛️
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">Tribal Sovereignty</h3>
              <p className="mt-2 text-gray-600">
                Affirms Choctaw and Chickasaw Nations&apos; water rights within their historic
                treaty territories spanning 22 counties.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-2xl">
                🌿
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">Environmental Protection</h3>
              <p className="mt-2 text-gray-600">
                Strict lake level restrictions protect recreation, fish, and wildlife.
                Municipal withdrawals are prohibited below minimum thresholds.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-2xl">
                📊
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">Public Transparency</h3>
              <p className="mt-2 text-gray-600">
                Real-time water monitoring ensures all stakeholders have access to the same
                authoritative USGS data.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <a
              href="/settlement"
              className="inline-flex items-center gap-2 rounded-xl bg-[#8B0000] px-6 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-105"
            >
              Learn More About the Settlement
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* DATA SOURCE */}
      <section className="border-t border-gray-200 bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Data Source
              </div>
              <div className="mt-2 text-lg font-bold text-gray-900">
                U.S. Geological Survey
              </div>
              <p className="mt-2 text-sm text-gray-600">
                All water level and streamflow data is sourced from official USGS monitoring stations.
              </p>
            </div>

            <div>
              <div className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Update Frequency
              </div>
              <div className="mt-2 text-lg font-bold text-gray-900">
                Every 15-60 Minutes
              </div>
              <p className="mt-2 text-sm text-gray-600">
                USGS stations report data at regular intervals. This portal refreshes every 60 seconds.
              </p>
            </div>

            <div>
              <div className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Parameters Tracked
              </div>
              <div className="mt-2 text-lg font-bold text-gray-900">
                Gage Height & Discharge
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Reservoir levels (feet) and river flows (cubic feet per second) are monitored.
              </p>
            </div>

            <div>
              <div className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Coverage
              </div>
              <div className="mt-2 text-lg font-bold text-gray-900">
                Settlement Area
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {reservoirs.length} reservoirs and 2 river monitoring stations across southeastern Oklahoma.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RESOURCES */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-2xl font-bold text-gray-900">Resources</h2>
          <p className="mt-2 text-gray-600">
            Official links and documentation for the water settlement.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <a
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
              href="https://waterdata.usgs.gov/ok/nwis/"
              target="_blank"
              rel="noreferrer"
            >
              <div className="text-sm font-semibold text-gray-500">Data Portal</div>
              <div className="mt-1 text-lg font-bold text-blue-600">USGS Oklahoma Water Data</div>
              <div className="mt-2 text-sm text-gray-600">
                Official federal water monitoring data and station information.
              </div>
            </a>

            <a
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
              href="https://www.choctawnation.com/"
              target="_blank"
              rel="noreferrer"
            >
              <div className="text-sm font-semibold text-gray-500">Tribal Resource</div>
              <div className="mt-1 text-lg font-bold text-blue-600">Choctaw Nation</div>
              <div className="mt-2 text-sm text-gray-600">
                Official website of the Choctaw Nation of Oklahoma.
              </div>
            </a>

            <a
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
              href="https://www.swt.usace.army.mil/Locations/Tulsa-District-Lakes/"
              target="_blank"
              rel="noreferrer"
            >
              <div className="text-sm font-semibold text-gray-500">Corps of Engineers</div>
              <div className="mt-1 text-lg font-bold text-blue-600">USACE Tulsa District Lakes</div>
              <div className="mt-2 text-sm text-gray-600">
                Army Corps reservoir management and lake level information.
              </div>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
