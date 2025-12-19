import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import BackToTop from '../../components/BackToTop'
import { SARDIS_WITHDRAWAL_THRESHOLDS, ALERT_THRESHOLDS } from '../../lib/waterBodies'

export const metadata = {
  title: 'Settlement Agreement | Choctaw-Chickasaw Water Settlement Portal',
  description: 'Learn about the historic Choctaw and Chickasaw Nations Water Settlement Agreement with Oklahoma and Oklahoma City.'
}

export default function SettlementPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 text-white">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <h1 className="text-4xl font-extrabold md:text-5xl">
            Water Settlement Agreement
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-white/90">
            The Choctaw and Chickasaw Nations Water Settlement is a landmark agreement
            that recognizes tribal water rights while ensuring sustainable water management
            across southeastern Oklahoma.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-12">
        {/* Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
          <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-gray-700 leading-relaxed">
              In 2016, the <strong>Choctaw and Chickasaw Nations Water Settlement</strong> was
              enacted by Congress as part of the Water Infrastructure Improvements for the
              Nation (WIIN) Act. This historic agreement resolved long-standing disputes over
              water rights and regulatory authority in the tribes&apos; historic treaty territories,
              spanning approximately <strong>22 counties</strong> in south-central and southeastern Oklahoma.
            </p>
            <p className="mt-4 text-gray-700 leading-relaxed">
              The settlement established a framework for tribal sovereignty over water resources
              while allowing measured municipal use under strict environmental protections.
            </p>
          </div>
        </section>

        {/* Key Parties */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900">Settlement Parties</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {[
              { name: 'Choctaw Nation of Oklahoma', role: 'Tribal sovereign with treaty water rights' },
              { name: 'Chickasaw Nation', role: 'Tribal sovereign with treaty water rights' },
              { name: 'State of Oklahoma', role: 'State water regulatory authority' },
              { name: 'Oklahoma City', role: 'Municipal water user (Sardis Lake storage rights)' },
              { name: 'United States', role: 'Federal trustee and settlement guarantor' }
            ].map((party) => (
              <div key={party.name} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="font-semibold text-gray-900">{party.name}</div>
                <div className="mt-1 text-sm text-gray-600">{party.role}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Key Provisions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900">Key Provisions</h2>
          <div className="mt-4 space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm font-bold">1</span>
                Tribal Water Rights Recognition
              </h3>
              <p className="mt-3 text-gray-700 leading-relaxed">
                The settlement affirms the Choctaw and Chickasaw Nations&apos; water rights within
                the settlement area, recognizing their authority over water resources in their
                historic treaty territories.
              </p>
            </div>

            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-6 shadow-sm">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sky-700 text-sm font-bold">2</span>
                Sardis Lake Withdrawal Restrictions
              </h3>
              <p className="mt-3 text-gray-700 leading-relaxed">
                Oklahoma City acquired storage rights in Sardis Lake but withdrawals are
                <strong> strictly regulated</strong> to protect recreation, fish, and wildlife.
                Withdrawals are prohibited when the lake level falls below minimum thresholds
                established by the Oklahoma Department of Wildlife Conservation.
              </p>
              <div className="mt-4 rounded-xl bg-white p-4">
                <div className="text-sm font-medium text-gray-600">Sardis Lake Thresholds</div>
                <div className="mt-2 grid gap-3 sm:grid-cols-3">
                  <div>
                    <div className="text-xs text-gray-500">Conservation Pool</div>
                    <div className="text-xl font-bold text-emerald-600">{SARDIS_WITHDRAWAL_THRESHOLDS.conservationPool} ft</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Min. for OKC Withdrawal</div>
                    <div className="text-xl font-bold text-sky-600">{SARDIS_WITHDRAWAL_THRESHOLDS.minimumForWithdrawal} ft</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Critical Level</div>
                    <div className="text-xl font-bold text-red-600">{SARDIS_WITHDRAWAL_THRESHOLDS.criticalLevel} ft</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm font-bold">3</span>
                Environmental Protections
              </h3>
              <p className="mt-3 text-gray-700 leading-relaxed">
                The agreement implements robust environmental protections including minimum
                streamflow requirements for the Kiamichi River and other waterways, ensuring
                ecological health and supporting local recreation and tourism industries.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm font-bold">4</span>
                Regulatory Framework
              </h3>
              <p className="mt-3 text-gray-700 leading-relaxed">
                The settlement establishes a cooperative regulatory framework between tribal,
                state, and federal authorities for managing water resources across the settlement area.
              </p>
            </div>
          </div>
        </section>

        {/* Alert Thresholds */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900">Water Level Alert Thresholds</h2>
          <p className="mt-2 text-gray-600">
            This portal uses the following thresholds to indicate water body status relative to conservation pool levels:
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-4">
            <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-4">
              <div className="text-sm font-semibold text-emerald-800">Normal</div>
              <div className="mt-1 text-2xl font-bold text-emerald-600">≥{ALERT_THRESHOLDS.normal}%</div>
              <div className="mt-1 text-xs text-emerald-700">At or above conservation pool</div>
            </div>
            <div className="rounded-xl border-2 border-sky-300 bg-sky-50 p-4">
              <div className="text-sm font-semibold text-sky-800">Watch</div>
              <div className="mt-1 text-2xl font-bold text-sky-600">{ALERT_THRESHOLDS.watch}-{ALERT_THRESHOLDS.normal}%</div>
              <div className="mt-1 text-xs text-sky-700">Slightly below normal</div>
            </div>
            <div className="rounded-xl border-2 border-slate-300 bg-slate-100 p-4">
              <div className="text-sm font-semibold text-slate-800">Warning</div>
              <div className="mt-1 text-2xl font-bold text-slate-600">{ALERT_THRESHOLDS.warning}-{ALERT_THRESHOLDS.watch}%</div>
              <div className="mt-1 text-xs text-slate-700">Below normal range</div>
            </div>
            <div className="rounded-xl border-2 border-red-400 bg-red-50 p-4">
              <div className="text-sm font-semibold text-red-800">Critical</div>
              <div className="mt-1 text-2xl font-bold text-red-600">&lt;{ALERT_THRESHOLDS.warning}%</div>
              <div className="mt-1 text-xs text-red-700">Significantly below pool</div>
            </div>
          </div>
        </section>

        {/* Settlement Area */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900">Settlement Area</h2>
          <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-gray-700 leading-relaxed">
              The settlement covers <strong>22 counties</strong> in southeastern Oklahoma, including:
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                'Atoka', 'Bryan', 'Carter', 'Choctaw', 'Coal', 'Garvin', 'Grady',
                'Haskell', 'Hughes', 'Johnston', 'Latimer', 'Le Flore', 'Love',
                'Marshall', 'McClain', 'McCurtain', 'McIntosh', 'Murray',
                'Pittsburg', 'Pontotoc', 'Pushmataha', 'Stephens'
              ].map((county) => (
                <span
                  key={county}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                >
                  {county}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900">Historical Timeline</h2>
          <div className="mt-4 space-y-4">
            {[
              { year: '2011', event: 'Oklahoma City applies for water permits from Sardis Lake, sparking legal disputes with tribes' },
              { year: '2013', event: 'Settlement negotiations begin among the Choctaw Nation, Chickasaw Nation, Oklahoma, and Oklahoma City' },
              { year: '2016', event: 'Settlement agreement reached and ratified by all parties' },
              { year: '2016', event: 'Congress enacts the Choctaw and Chickasaw Nations Water Settlement as part of the WIIN Act (P.L. 114-322)' },
              { year: '2024', event: 'Settlement implementation continues with ongoing water monitoring and reporting' }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-white">
                    {item.year}
                  </div>
                </div>
                <div className="flex items-center">
                  <p className="text-gray-700">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Resources */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900">Official Resources</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <a
              href="https://www.congress.gov/bill/114th-congress/senate-bill/612"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="text-sm font-medium text-gray-500">Federal Legislation</div>
              <div className="mt-1 text-lg font-semibold text-blue-600">S.612 - WIIN Act</div>
              <div className="mt-2 text-sm text-gray-600">
                The Water Infrastructure Improvements for the Nation Act containing the settlement authorization.
              </div>
            </a>
            <a
              href="https://www.choctawnation.com/"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="text-sm font-medium text-gray-500">Tribal Resource</div>
              <div className="mt-1 text-lg font-semibold text-blue-600">Choctaw Nation</div>
              <div className="mt-2 text-sm text-gray-600">
                Official website of the Choctaw Nation of Oklahoma.
              </div>
            </a>
            <a
              href="https://chickasaw.net/"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="text-sm font-medium text-gray-500">Tribal Resource</div>
              <div className="mt-1 text-lg font-semibold text-blue-600">Chickasaw Nation</div>
              <div className="mt-2 text-sm text-gray-600">
                Official website of the Chickasaw Nation.
              </div>
            </a>
            <a
              href="https://waterdata.usgs.gov/ok/nwis/"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="text-sm font-medium text-gray-500">Data Source</div>
              <div className="mt-1 text-lg font-semibold text-blue-600">USGS Oklahoma Water Data</div>
              <div className="mt-2 text-sm text-gray-600">
                Official federal water monitoring data for Oklahoma.
              </div>
            </a>
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-sky-900 p-8 text-white">
            <h2 className="text-2xl font-bold">View Live Water Conditions</h2>
            <p className="mt-2 text-white/90">
              Monitor real-time water levels for all settlement water bodies using official USGS data.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-xl bg-white px-6 py-3 font-semibold text-slate-900 shadow-lg transition-transform hover:scale-105"
            >
              Go to Dashboard
            </Link>
          </div>
        </section>
      </main>

      <BackToTop />
      <Footer />
    </div>
  )
}
