import Header from '../components/Header'
import Footer from '../components/Footer'
import LakeCard from '../components/LakeCard'
import DataStatusBanner from '../components/DataStatusBanner'
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
  // Use first 4 reservoirs for the featured section
  const featuredReservoirs = reservoirs.slice(0, 4)

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <DataStatusBanner />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white">
        {/* Subtle background texture */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        
        {/* Abstract shapes for visual interest */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl"></div>

        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-[1.3fr_1fr] md:items-center lg:py-24">
          
          {/* Hero Text */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-sky-100 ring-1 ring-white/20 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              Live USACE & USGS System Data
            </div>

            <div>
              <p className="font-bold uppercase tracking-wider text-sky-400/90 text-sm">Choctaw Nation & Chickasaw Nation</p>
              <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
                Water Settlement <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 to-emerald-200">Transparency Portal</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
                Monitoring reservoir levels and river flows in real-time using official <strong>US Army Corps of Engineers</strong> data. We layer the <strong>2016 Settlement Agreement</strong> guardrails directly onto live charts to ensure accountability.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-sky-900/20 transition-all hover:bg-sky-400 hover:shadow-sky-500/30 active:scale-95"
              >
                View Live Dashboard
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="/settlement"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-base font-semibold text-white transition-all hover:bg-white/10 active:scale-95"
              >
                Read Settlement Context
              </a>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
              {[
                { label: 'Water Bodies', value: reservoirs.length + 2 }, // +2 for rivers
                { label: 'Counties', value: 22 },
                { label: 'Update Rate', value: '60s' }
              ].map(stat => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs font-medium uppercase tracking-wide text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Card (Sardis) */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 p-6 shadow-2xl backdrop-blur-md transition-transform hover:scale-[1.01]">
              
              {/* Card Header */}
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Settlement Anchor
                  </div>
                  <h2 className="mt-1 text-3xl font-bold text-white">Sardis Lake</h2>
                  <p className="text-sm text-slate-400">Pushmataha County • USACE Managed</p>
                </div>
                <div className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 ring-1 ring-emerald-500/40">
                  Critical Asset
                </div>
              </div>

              {/* Key Thresholds Grid */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Conservation', value: SARDIS_WITHDRAWAL_THRESHOLDS.conservationPool, color: 'text-emerald-300' },
                  { label: 'OKC Floor', value: SARDIS_WITHDRAWAL_THRESHOLDS.minimumForWithdrawal, color: 'text-sky-300' },
                  { label: 'Crit. Habitat', value: SARDIS_WITHDRAWAL_THRESHOLDS.criticalLevel, color: 'text-rose-300' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl bg-white/5 p-3 text-center ring-1 ring-white/10">
                    <div className={`text-xl font-bold ${item.color}`}>{item.value}</div>
                    <div className="text-[10px] font-medium uppercase text-slate-400">{item.label}</div>
                  </div>
                ))}
              </div>

              {/* Context Box */}
              <div className="mt-4 rounded-xl bg-sky-900/20 p-4 ring-1 ring-sky-500/20">
                <p className="text-sm leading-relaxed text-sky-100/90">
                  <strong className="text-sky-300">Why it matters:</strong> Oklahoma City cannot withdraw water for municipal use if levels fall below the <strong>{SARDIS_WITHDRAWAL_THRESHOLDS.minimumForWithdrawal} ft</strong> floor, ensuring local recreation and wildlife are protected first.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-400">
                <span>Source: USACE Gauge CYDO2</span>
                <a href="/dashboard" className="font-semibold text-white hover:text-emerald-300 hover:underline">See full chart →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK STATUS STRIP */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <p className="text-sm font-medium text-slate-600">
            <strong>System Status:</strong> Monitoring {reservoirs.length + 2} water bodies across the settlement area.
          </p>
          <div className="flex gap-4 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500"></span> Normal</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-sky-500"></span> Watch</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-400"></span> Warning</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-500"></span> Critical</span>
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Current Conditions</h2>
              <p className="mt-2 text-slate-600">Live elevation and discharge data from key settlement locations.</p>
            </div>
            <a href="/dashboard" className="hidden text-sm font-bold text-sky-600 hover:text-sky-700 hover:underline sm:block">View All Locations →</a>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featuredReservoirs.map((waterBody) => (
              <LakeCard key={waterBody.id} waterBody={waterBody} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <a href="/dashboard" className="inline-block rounded-lg bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-200">View All Locations</a>
          </div>
        </div>
      </section>

      {/* INFO GRID */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-slate-900">Understanding the Settlement</h2>
            <p className="mt-4 text-lg text-slate-600">
              The 2016 agreement resolved decades of uncertainty, affirming tribal sovereignty while establishing a framework for shared water management.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
             <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 transition-shadow hover:shadow-md">
               <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl text-blue-700">⚖️</div>
               <h3 className="mb-2 text-lg font-bold text-slate-900">Sovereignty & Rights</h3>
               <p className="text-sm leading-relaxed text-slate-600">
                 Recognizes the Nations' historic treaty rights and establishes a formal role in water planning. The Tribes have a seat at the table for all major water export or transfer decisions.
               </p>
             </div>
             
             <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 transition-shadow hover:shadow-md">
               <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-2xl text-emerald-700">🛡️</div>
               <h3 className="mb-2 text-lg font-bold text-slate-900">Environmental Protection</h3>
               <p className="text-sm leading-relaxed text-slate-600">
                 Sets hard "floors" on lake levels. If Sardis Lake drops below conservation thresholds, Oklahoma City's withdrawals must stop to protect fish, wildlife, and tourism.
               </p>
             </div>

             <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 transition-shadow hover:shadow-md">
               <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl text-purple-700">🤝</div>
               <h3 className="mb-2 text-lg font-bold text-slate-900">Regional Cooperation</h3>
               <p className="text-sm leading-relaxed text-slate-600">
                 Creates a predictable system for all users. The "Combined Storage" system balances OKC's needs with the ecological health of the Kiamichi Basin.
               </p>
             </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
