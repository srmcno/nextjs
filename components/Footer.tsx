export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-[#1F2933] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="text-white/90">
            © {new Date().getFullYear()} Water Settlement Portal
          </div>
          <div className="text-white/70">
            Data source: USGS (official federal monitoring)
          </div>
        </div>
      </div>
    </footer>
  )
}
