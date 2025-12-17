import Header from '../components/Header'
import Footer from '../components/Footer'
import LakeCard from '../components/LakeCard'
import {
  getReservoirs,
  SARDIS_WITHDRAWAL_THRESHOLDS
} from '../lib/waterBodies'

export const metadata = {
  title: 'Choctaw Nation Water Resource Management | Live Water Conditions',
  description: 'Real-time water level monitoring for the Choctaw and Chickasaw Nations Water Settlement Agreement. Track Sardis Lake, Kiamichi River, and other settlement water bodies.'
}

export default function Home() {
  const reservoirs = getReservoirs()
  const featuredReservoirs = reservoirs.slice(0, 4)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#512A2A] via-[#6B3A3A] to-[#512A2A]">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="water-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M0 10 Q 5 5, 10 10 T 20 10" stroke="white" fill="none" strokeWidth="0.5" />
            </pattern>
            <rect x="0" y="0" width="100" height="100" fill="url(#water-pattern)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              {/* Choctaw Seal Badge */}
              <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 backdrop-blur">
                <div className="h-8 w-8">
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
                <span className="text-sm font-medium text-white">Choctaw Nation Water Resource Management</span>
              </div>

              <h1 className="text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl">
                Water Settlement
                <span className="block text-[#C5A052]">Live Conditions</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg text-white/80">
                Real-time water levels and streamflows for the historic
                <strong className="text-white"> Choctaw–Chickasaw–Oklahoma Water Settlement Agreement</strong>.
                Data sourced from U.S. Army Corps of Engineers and USGS.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#1B7340] px-6 py-3 text-base font-bold text-white shadow-lg transition-all hover:bg-[#155D33] hover:shadow-xl"
                >
                  View Water Levels
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
                <a
                  href="/settlement"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
                >
                  Settlement Agreement
                </a>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4">
                <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
                  <div className="text-3xl font-bold text-[#C5A052]">{reservoirs.length}</div>
                  <div className="mt-1 text-sm text-white/70">Reservoirs</div>
                </div>
                <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
                  <div className="text-3xl font-bold text-[#C5A052]">22</div>
                  <div className="mt-1 text-sm text-white/70">Counties</div>
                </div>
                <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
                  <div className="text-3xl font-bold text-[#C5A052]">24/7</div>
                  <div className="mt-1 text-sm text-white/70">Monitoring</div>
                </div>
              </div>
            </div>

            {/* Sardis Lake Highlight Card */}
            <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-white/70">Featured Critical Reservoir</div>
                  <div className="text-2xl font-bold text-white">Sardis Lake</div>
                </div>
                <span className="rounded-full bg-[#C5A052] px-3 py-1 text-xs font-bold text-[#512A2A]">
                  Settlement Critical
                </span>
              </div>

              <p className="mb-4 text-sm text-white/80">
                Under the settlement, Oklahoma City cannot withdraw water from Sardis Lake
                when levels fall below minimum thresholds, protecting recreation and wildlife.
              </p>

              <div className="rounded-xl bg-black/20 p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xs text-white/60">Conservation Pool</div>
                    <div className="mt-1 text-2xl font-bold text-[#1B7340]">{SARDIS_WITHDRAWAL_THRESHOLDS.conservationPool}</div>
                    <div className="text-xs text-white/60">feet</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/60">OKC Min. Level</div>
                    <div className="mt-1 text-2xl font-bold text-[#C5A052]">{SARDIS_WITHDRAWAL_THRESHOLDS.minimumForWithdrawal}</div>
                    <div className="text-xs text-white/60">feet</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/60">Critical Level</div>
                    <div className="mt-1 text-2xl font-bold text-red-400">{SARDIS_WITHDRAWAL_THRESHOLDS.criticalLevel}</div>
                    <div className="text-xs text-white/60">feet</div>
                  </div>
                </div>
              </div>

              <a
                href="/dashboard"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#C5A052] hover:underline"
              >
                View current Sardis Lake level
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Data Source Banner */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-[#1B7340] animate-pulse"></span>
              <span className="text-sm font-medium text-gray-700">Live data from U.S. Army Corps of Engineers & USGS</span>
            </div>
            <a
              href="/dashboard"
              className="text-sm font-semibold text-[#1B7340] hover:underline"
            >
              View all {reservoirs.length} water bodies →
            </a>
          </div>
        </div>
      </section>

      {/* FEATURED WATER BODIES */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#512A2A]">Settlement Water Bodies</h2>
            <p className="mt-2 text-gray-600">
              Click any card to view detailed settlement information and current conditions.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featuredReservoirs.map((waterBody) => (
              <LakeCard key={waterBody.id} waterBody={waterBody} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-[#512A2A] px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-[#6B3A3A] hover:shadow-xl"
            >
              View All Water Bodies
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* SETTLEMENT OVERVIEW */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold text-[#512A2A]">
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
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#006B54]/10">
                <svg className="h-6 w-6 text-[#006B54]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#512A2A]">Tribal Sovereignty</h3>
              <p className="mt-2 text-gray-600">
                Affirms Choctaw and Chickasaw Nations&apos; water rights within their historic
                treaty territories spanning 22 counties.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1B7340]/10">
                <svg className="h-6 w-6 text-[#1B7340]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#512A2A]">Environmental Protection</h3>
              <p className="mt-2 text-gray-600">
                Strict lake level restrictions protect recreation, fish, and wildlife.
                Municipal withdrawals prohibited below minimum thresholds.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C5A052]/10">
                <svg className="h-6 w-6 text-[#C5A052]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#512A2A]">Public Transparency</h3>
              <p className="mt-2 text-gray-600">
                Real-time water monitoring ensures all stakeholders have access to the same
                authoritative data from USACE and USGS.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <a
              href="/settlement"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-[#512A2A] px-6 py-3 font-semibold text-[#512A2A] transition-colors hover:bg-[#512A2A] hover:text-white"
            >
              Learn More About the Settlement
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* DATA SOURCE INFO */}
      <section className="border-t border-gray-200 bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="text-sm font-semibold uppercase tracking-wide text-[#006B54]">
                Primary Data Source
              </div>
              <div className="mt-2 text-lg font-bold text-[#512A2A]">
                U.S. Army Corps of Engineers
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Pool elevation data from USACE Tulsa District water control systems.
              </p>
            </div>

            <div>
              <div className="text-sm font-semibold uppercase tracking-wide text-[#006B54]">
                Secondary Source
              </div>
              <div className="mt-2 text-lg font-bold text-[#512A2A]">
                U.S. Geological Survey
              </div>
              <p className="mt-2 text-sm text-gray-600">
                River flow and streamgage data from the USGS National Water Information System.
              </p>
            </div>

            <div>
              <div className="text-sm font-semibold uppercase tracking-wide text-[#006B54]">
                Update Frequency
              </div>
              <div className="mt-2 text-lg font-bold text-[#512A2A]">
                Hourly Updates
              </div>
              <p className="mt-2 text-sm text-gray-600">
                USACE and USGS stations report data hourly. Dashboard refreshes automatically.
              </p>
            </div>

            <div>
              <div className="text-sm font-semibold uppercase tracking-wide text-[#006B54]">
                Coverage
              </div>
              <div className="mt-2 text-lg font-bold text-[#512A2A]">
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
          <h2 className="text-2xl font-bold text-[#512A2A]">Resources</h2>
          <p className="mt-2 text-gray-600">
            Official links and data sources for the water settlement.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <a
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
              href="https://www.swt-wc.usace.army.mil/"
              target="_blank"
              rel="noreferrer"
            >
              <div className="text-sm font-semibold text-gray-500">Primary Data Source</div>
              <div className="mt-1 text-lg font-bold text-[#1B7340]">USACE Tulsa District</div>
              <div className="mt-2 text-sm text-gray-600">
                Official Army Corps of Engineers water control data for Oklahoma lakes.
              </div>
            </a>

            <a
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
              href="https://www.choctawnation.com/"
              target="_blank"
              rel="noreferrer"
            >
              <div className="text-sm font-semibold text-gray-500">Tribal Resource</div>
              <div className="mt-1 text-lg font-bold text-[#1B7340]">Choctaw Nation</div>
              <div className="mt-2 text-sm text-gray-600">
                Official website of the Choctaw Nation of Oklahoma.
              </div>
            </a>

            <a
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
              href="https://www.congress.gov/bill/114th-congress/senate-bill/612"
              target="_blank"
              rel="noreferrer"
            >
              <div className="text-sm font-semibold text-gray-500">Legal Authority</div>
              <div className="mt-1 text-lg font-bold text-[#1B7340]">WIIN Act (P.L. 114-322)</div>
              <div className="mt-2 text-sm text-gray-600">
                Federal legislation authorizing the Choctaw-Chickasaw Water Settlement.
              </div>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
