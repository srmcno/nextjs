'use client'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[#7A0019]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-[#C8A951] shadow-inner" />
          <div className="leading-tight">
            <div className="text-sm font-semibold text-white">
              Water Settlement Portal
            </div>
            <div className="text-xs text-white/80">
              Choctaw–Chickasaw • Live USGS data
            </div>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-white/90 md:flex">
          <a className="hover:text-white" href="#live">
            Live levels
          </a>
          <a className="hover:text-white" href="#settlement">
            Settlement
          </a>
          <a className="hover:text-white" href="#resources">
            Resources
          </a>
        </nav>

        <a
          href="#live"
          className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-[#7A0019] shadow hover:bg-white/90"
        >
          View live data
        </a>
      </div>
    </header>
  )
}
