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
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-sky-900 to-emerald-900 text-white">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="water-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M0 10 Q 5 5, 10 10 T 20 10" stroke="white" fill="none" strokeWidth="0.5" />
            </pattern>
            <rect x="0" y="0" width="100" height="100" fill="url(#water-pattern)" />
          </svg>
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-14 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium shadow-lg shadow-emerald-900/30">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300"></span>
              Live USGS data
            </div>

            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-sky-200">Choctaw / Chickasaw Nations</p>
              <h1 className="mt-2 text-4xl font-black leading-tight md:text-5xl lg:text-6xl">
                Water Settlement Transparency
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-slate-100/90">
                Real-time reservoir elevations and river flows with settlement guardrails layered directly on the charts—built for tribes, partners, and the public.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-base font-bold text-slate-900 shadow-lg shadow-emerald-900/30 transition-transform hover:-translate-y-0.5 hover:shadow-xl"
              >
                View dashboard
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="/settlement"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-white/20"
              >
                Settlement context
              </a>
              <details className="group relative ml-2 w-full max-w-xs rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-slate-100 shadow-lg shadow-emerald-900/20 backdrop-blur sm:w-auto">
                <summary className="flex cursor-pointer items-center gap-2 font-semibold marker:hidden">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs">i</span>
                  What the colors mean
                </summary>
                <div className="mt-3 space-y-2 text-sm leading-relaxed text-slate-100/90">
                  <p className="font-semibold text-emerald-100">Emerald</p>
                  <p>Within normal pool or flow bands.</p>
                  <p className="font-semibold text-sky-100">Sky</p>
                  <p>Watch conditions approaching guardrails.</p>
                  <p className="font-semibold text-slate-200">Slate</p>
                  <p>Critical levels where withdrawals halt and ecological protections kick in.</p>
                </div>
              </details>
            </div>

            <div className="grid grid-cols-3 gap-3 text-left text-sm text-slate-100/90 md:max-w-2xl">
              {[{ label: 'Reservoirs tracked', value: reservoirs.length }, { label: 'Counties covered', value: 22 }, { label: 'Refresh cadence', value: '60s live ping' }].map(stat => (
                <div key={stat.label} className="rounded-xl bg-white/10 p-4 shadow-inner shadow-black/20">
                  <div className="text-xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs uppercase tracking-wide text-slate-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sardis Lake Highlight */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-emerald-900/40 backdrop-blur">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-200">Featured reservoir</div>
                <div className="text-2xl font-bold text-white">Sardis Lake</div>
                <p className="mt-1 text-sm text-slate-100/80">USACE-managed pool that anchors the settlement safeguards.</p>
              </div>
              <span className="rounded-full bg-emerald-200/20 px-3 py-1 text-[11px] font-semibold text-emerald-50">Settlement critical</span>
            </div>

            <div className="grid grid-cols-3 gap-3 rounded-xl bg-slate-950/40 p-4 text-center text-slate-100">
              <div>
                <div className="text-xs text-slate-200/80">Conservation pool</div>
                <div className="mt-1 text-2xl font-bold text-emerald-200">{SARDIS_WITHDRAWAL_THRESHOLDS.conservationPool}</div>
                <div className="text-[11px] text-slate-300">ft NGVD29</div>
              </div>
              <div>
                <div className="text-xs text-slate-200/80">OKC floor</div>
                <div className="mt-1 text-2xl font-bold text-sky-200">{SARDIS_WITHDRAWAL_THRESHOLDS.minimumForWithdrawal}</div>
                <div className="text-[11px] text-slate-300">ft NGVD29</div>
              </div>
              <div>
                <div className="text-xs text-slate-200/80">Critical habitat</div>
                <div className="mt-1 text-2xl font-bold text-slate-100">{SARDIS_WITHDRAWAL_THRESHOLDS.criticalLevel}</div>
                <div className="text-[11px] text-slate-300">ft NGVD29</div>
              </div>
            </div>

            <details className="mt-3 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-100/90 shadow-inner shadow-emerald-900/20">
              <summary className="flex cursor-pointer items-center gap-2 font-semibold marker:hidden">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold">?</span>
                Settlement math (tap to view)
              </summary>
              <div className="mt-2 space-y-2 text-slate-100/90">
                <p>Below {SARDIS_WITHDRAWAL_THRESHOLDS.minimumForWithdrawal} ft NGVD29, Oklahoma City storage rights pause per the 2016 Act.</p>
                <p>Alert bands on charts follow Corps pool guidance: conservation pool at {SARDIS_WITHDRAWAL_THRESHOLDS.conservationPool} ft and ecological protection emphasis below {SARDIS_WITHDRAWAL_THRESHOLDS.criticalLevel} ft.</p>
              </div>
            </details>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-100/80">
              <a
                href="/dashboard"
                className="inline-flex items-center gap-1 font-semibold text-emerald-100 underline-offset-4 hover:underline"
              >
                View all water bodies
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100">Data source: USGS & USACE</span>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK STATUS */}
      <section className="border-b border-slate-200/70 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Quick Status Overview</h2>
              <p className="text-sm text-slate-600">Featured settlement reservoirs</p>
            </div>
            <a
              href="/dashboard"
              className="text-sm font-semibold text-emerald-700 hover:underline"
            >
              View all {reservoirs.length} water bodies →
            </a>
          </div>
        </div>
      </section>

      {/* FEATURED WATER BODIES */}
      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featuredReservoirs.map((waterBody) => (
              <LakeCard key={waterBody.id} waterBody={waterBody} />
            ))}
          </div>
        </div>
      </section>

      {/* SETTLEMENT OVERVIEW */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold text-slate-900">About the Water Settlement</h2>
            <p className="mt-4 text-base text-slate-600">
              A concise, card-based view with optional pop-ups keeps the overview short while letting readers dig into the details when needed.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Tribal sovereignty',
                icon: '🏛️',
                summary: 'The 2016 agreement affirms Choctaw and Chickasaw rights in 22 counties.',
                detail: 'Storage and diversion decisions require tribal-state coordination, preserving senior rights while honoring downstream users.'
              },
              {
                title: 'Environmental guardrails',
                icon: '🌿',
                summary: 'Lake bands protect recreation, fish, and wildlife.',
                detail: 'OKC withdrawals pause below Sardis thresholds; river alerts follow watch/warning/critical tiers tied to pool percentages.'
              },
              {
                title: 'Public transparency',
                icon: '📊',
                summary: 'Live USGS feeds with settlement lines overlaid on each chart.',
                detail: 'Data refreshes every minute and links out to official NWIS/USACE records for auditability.'
              }
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-2xl text-slate-900">{item.icon}</div>
                <h3 className="mt-3 text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.summary}</p>
                <details className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-inner">
                  <summary className="flex cursor-pointer items-center gap-2 font-semibold text-emerald-700 marker:hidden">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-800">+</span>
                    More detail
                  </summary>
                  <p className="mt-2 text-slate-700">{item.detail}</p>
                </details>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href="/settlement"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-200/40 transition-transform hover:-translate-y-0.5 hover:shadow-xl"
            >
              Read the agreement overview
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* DATA SOURCE */}
      <section className="border-t border-slate-200 bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Data source', value: 'U.S. Geological Survey & USACE', detail: 'Reservoir elevations now pull the USGS reservoir elevation parameter (62614) for closer alignment with Corps lake pages; rivers use USGS discharge (00060).' },
              { label: 'Update frequency', value: 'Every 60 seconds', detail: 'Stations typically report every 15–60 minutes; the portal revalidates cached data every minute.' },
              { label: 'Parameters tracked', value: 'Elevation & discharge', detail: 'Reservoir elevations in feet (NGVD29) and river flows in cubic feet per second mirror USACE pool math.' },
              { label: 'Coverage', value: `${reservoirs.length} reservoirs + 2 rivers`, detail: 'All settlement reservoirs plus two Kiamichi River gauges feeding Sardis Lake.' }
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{item.label}</div>
                <div className="mt-2 text-lg font-bold text-slate-900">{item.value}</div>
                <details className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  <summary className="cursor-pointer font-semibold text-emerald-700 marker:hidden">More info</summary>
                  <p className="mt-1 leading-relaxed">{item.detail}</p>
                </details>
              </div>
            ))}
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
