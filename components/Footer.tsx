import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-choctaw-brown/20 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand - Official Choctaw Nation */}
          <div className="md:col-span-2">
            <div className="flex items-start gap-3">
              {/* Great Seal - Minimum 75px for one-color footer usage */}
              <img 
                src="/choctaw-great-seal-placeholder.svg" 
                alt="Choctaw Nation Great Seal" 
                className="h-16 w-16 object-contain flex-shrink-0"
              />
              <div>
                {/* Gill Sans Bold */}
                <div className="font-bold text-choctaw-brown text-lg">Choctaw Nation</div>
                <div className="text-sm font-bold text-choctaw-brown">Division of Legal &amp; Compliance</div>
                {/* Gill Sans Light */}
                <div className="text-xs font-light text-choctaw-brown">Department of Natural Resources</div>
                {/* PMS 356 Green for program */}
                <div className="text-xs text-choctaw-green mt-1">Water Resource Management</div>
                <div className="text-xs text-choctaw-green">Environmental Protection Services</div>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm text-gray-600">
              Providing transparent, real-time access to water conditions across the
              Choctaw-Chickasaw Water Settlement area in southeastern Oklahoma.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-choctaw-brown">Quick Links</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-600 hover:text-choctaw-green transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-600 hover:text-choctaw-green transition-colors">Live Dashboard</Link>
              </li>
              <li>
                <Link href="/game" className="text-gray-600 hover:text-choctaw-green transition-colors">Water Game</Link>
              </li>
              <li>
                <Link href="/settlement" className="text-gray-600 hover:text-choctaw-green transition-colors">Settlement Info</Link>
              </li>
            </ul>
          </div>

          {/* Data Sources */}
          <div>
            <h3 className="font-semibold text-choctaw-brown">Data Sources</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href="https://waterdata.usgs.gov/ok/nwis/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-600 hover:text-choctaw-green transition-colors"
                >
                  USGS Water Data
                </a>
              </li>
              <li>
                <a
                  href="https://www.swt-wc.usace.army.mil/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-600 hover:text-choctaw-green transition-colors"
                >
                  USACE Tulsa District
                </a>
              </li>
              <li>
                <a
                  href="https://www.owrb.ok.gov/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-600 hover:text-choctaw-green transition-colors"
                >
                  OK Water Resources Board
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-choctaw-brown/20 pt-8 text-sm text-gray-600 md:flex-row">
          <div>
            © {new Date().getFullYear()} Choctaw Nation of Oklahoma. Data provided by USGS.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-choctaw-green"></span>
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
