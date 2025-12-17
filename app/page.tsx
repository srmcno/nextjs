import Header from '../components/Header'
import Footer from '../components/Footer'
import LakeCard from '../components/LakeCard'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* HERO */}
      <section className="bg-gradient-to-b from-[#7A0019] to-[#5A0013] text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
              Water Settlement
              <span className="block text-[#C8A951]">Live Conditions</span>
            </h1>
            <p className="mt-4 max-w-xl text-white/85">
              A public-facing portal for real-time water levels and context tied to the
              Choctaw–Chickasaw–Oklahoma City Water Settlement Agreement.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#live"
                className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#7A0019] shadow hover:bg-white/90"
              >
                Jump to live data
              </a>
              <a
                href="#settlement"
                className="rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15"
              >
                What the settlement is
              </a>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-white/10 p-4">
                <div className="text-white/70">Source</div>
                <div className="font-semibold">USGS monitoring</div>
              </div>
              <div className="rounded-xl bg-white/10 p-4">
                <div className="text-white/70">Focus</div>
                <div className="font-semibold">Reservoir levels</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white/10 p-5 shadow-inner">
            <div className="text-sm font-semibold text-white/80">
              Quick view (USGS embed)
            </div>
            <div className="mt-3 overflow-hidden rounded-xl border border-white/15 bg-white">
              <iframe
                src="https://waterdata.usgs.gov/monitoring-location/07331500/"
                width="100%"
                height="420"
                style={{ border: '0' }}
              />
            </div>
            <div className="mt-3 text-xs text-white/70">
              Lake Texoma • USGS monitoring location page
            </div>
          </div>
        </div>
      </section>

      {/* LIVE DATA */}
      <section id="live" className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold">Live water levels</h2>
            <p className="mt-2 max-w-3xl text-black/65">
              These cards pull live gage-height values from USGS (parameter 00065) and chart recent values.
              We can expand the list to the full official settlement set once you confirm it.
            </p>
          </div>
          <div className="text-sm text-black/50">
            Mobile-friendly. No extra pages. No 404s. No suffering.
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <LakeCard name="Lake Texoma" site="07331500" subtitle="Primary reservoir (demo ID)" />
          <LakeCard name="Arbuckle Reservoir" site="07326500" subtitle="Arbuckle region (demo ID)" />
          <LakeCard name="Sardis Lake" site="07343500" subtitle="Pushmataha area (demo ID)" />
          <LakeCard name="Atoka Reservoir" site="07345500" subtitle="Atoka area (demo ID)" />
        </div>
      </section>

      {/* SETTLEMENT */}
      <section id="settlement" className="bg-white/70">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-3xl font-extrabold">Settlement overview</h2>
          <p className="mt-2 max-w-3xl text-black/65">
            This section is where we place the official agreement summary, timeline, and the “why this matters”
            content for tribal sovereignty, municipal supply, and ecological health.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold text-black/50">1) Transparency</div>
              <div className="mt-2 text-lg font-bold">Live conditions</div>
              <p className="mt-2 text-sm text-black/60">
                Everyone sees the same numbers, pulled directly from USGS.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold text-black/50">2) Context</div>
              <div className="mt-2 text-lg font-bold">Agreement details</div>
              <p className="mt-2 text-sm text-black/60">
                Plain-language summary + official documents + contacts.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold text-black/50">3) Decisions</div>
              <div className="mt-2 text-lg font-bold">Actionable signals</div>
              <p className="mt-2 text-sm text-black/60">
                Later: thresholds, alerts, seasonal targets, and reporting exports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RESOURCES */}
      <section id="resources" className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-3xl font-extrabold">Resources</h2>
        <p className="mt-2 max-w-3xl text-black/65">
          Add official links, PDF repository, FAQs, and agency contacts here.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <a
            className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm hover:shadow"
            href="https://waterdata.usgs.gov/"
            target="_blank"
            rel="noreferrer"
          >
            <div className="text-sm font-semibold text-black/50">Data portal</div>
            <div className="mt-1 text-lg font-bold text-[#1E4F91]">USGS Water Data</div>
            <div className="mt-2 text-sm text-black/60">
              National water monitoring data and station pages.
            </div>
          </a>

          <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
            <div className="text-sm font-semibold text-black/50">Next step</div>
            <div className="mt-1 text-lg font-bold">Official water-body list</div>
            <div className="mt-2 text-sm text-black/60">
              Once you give me the official settlement list (or the doc), I’ll wire every lake/reservoir
              with the correct USGS site IDs and names.
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
