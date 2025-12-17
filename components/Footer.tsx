export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-[#512A2A]">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              {/* Choctaw Nation Seal */}
              <div className="h-14 w-14 flex-shrink-0">
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  <circle cx="50" cy="50" r="48" fill="#006B54" />
                  <circle cx="50" cy="50" r="40" fill="#C5A052" />
                  <circle cx="50" cy="50" r="36" fill="#D4B96A" />
                  <g transform="translate(50, 50)">
                    <line x1="-15" y1="-15" x2="15" y2="15" stroke="#512A2A" strokeWidth="3" />
                    <line x1="15" y1="-15" x2="-15" y2="15" stroke="#512A2A" strokeWidth="3" />
                    <circle cx="0" cy="0" r="8" fill="#512A2A" />
                    <ellipse cx="0" cy="-20" rx="4" ry="10" fill="#512A2A" />
                  </g>
                </svg>
              </div>
              <div>
                <div className="text-lg font-bold text-white">Choctaw Nation</div>
                <div className="text-sm text-[#1B7340]">Water Resource Management</div>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm text-white/70">
              Providing transparent, real-time access to water conditions across the
              Choctaw-Chickasaw Water Settlement area in southeastern Oklahoma.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-[#C5A052]">Quick Links</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href="/" className="text-white/70 hover:text-white">Home</a>
              </li>
              <li>
                <a href="/dashboard" className="text-white/70 hover:text-white">Water Levels Dashboard</a>
              </li>
              <li>
                <a href="/settlement" className="text-white/70 hover:text-white">Settlement Agreement</a>
              </li>
            </ul>
          </div>

          {/* Data Sources */}
          <div>
            <h3 className="font-semibold text-[#C5A052]">Data Sources</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href="https://www.swt-wc.usace.army.mil/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/70 hover:text-white"
                >
                  USACE Tulsa District
                </a>
              </li>
              <li>
                <a
                  href="https://waterdata.usgs.gov/ok/nwis/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/70 hover:text-white"
                >
                  USGS Water Data
                </a>
              </li>
              <li>
                <a
                  href="https://www.owrb.ok.gov/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/70 hover:text-white"
                >
                  OK Water Resources Board
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/60 md:flex-row">
          <div>
            © {new Date().getFullYear()} Choctaw Nation of Oklahoma. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#1B7340]"></span>
              Live Data from USACE & USGS
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
