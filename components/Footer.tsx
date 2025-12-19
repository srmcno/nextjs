import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-[#1a1a2e]">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-sky-600 to-slate-700">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-white">Water Settlement Portal</div>
                <div className="text-sm text-gray-400">Choctaw–Chickasaw Nations</div>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm text-gray-400">
              Providing transparent, real-time access to water conditions across the
              Choctaw-Chickasaw Water Settlement area in southeastern Oklahoma.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white">Quick Links</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white">Home</Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-400 hover:text-white">Live Dashboard</Link>
              </li>
              <li>
                <Link href="/game" className="text-gray-400 hover:text-white">Water Game</Link>
              </li>
              <li>
                <Link href="/settlement" className="text-gray-400 hover:text-white">Settlement Info</Link>
              </li>
            </ul>
          </div>

          {/* Data Sources */}
          <div>
            <h3 className="font-semibold text-white">Data Sources</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href="https://waterdata.usgs.gov/ok/nwis/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-400 hover:text-white"
                >
                  USGS Water Data
                </a>
              </li>
              <li>
                <a
                  href="https://www.swt-wc.usace.army.mil/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-400 hover:text-white"
                >
                  USACE Tulsa District
                </a>
              </li>
              <li>
                <a
                  href="https://www.owrb.ok.gov/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-400 hover:text-white"
                >
                  OK Water Resources Board
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 text-sm text-gray-500 md:flex-row">
          <div>
            © {new Date().getFullYear()} Water Settlement Portal. Data provided by USGS.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
              Live Data
            </span>
            <span>|</span>
            <span>Updates every 60 seconds</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
