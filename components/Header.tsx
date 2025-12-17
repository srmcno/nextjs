'use client'

import { useState } from 'react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#8B0000]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B8960C] shadow-inner">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold text-white">
              Water Settlement Portal
            </div>
            <div className="text-xs text-white/70">
              Choctaw–Chickasaw • USGS Live Data
            </div>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          <a
            className="rounded-lg px-4 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
            href="/"
          >
            Home
          </a>
          <a
            className="rounded-lg px-4 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
            href="/dashboard"
          >
            Dashboard
          </a>
          <a
            className="rounded-lg px-4 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
            href="/settlement"
          >
            Settlement Info
          </a>
        </nav>

        {/* CTA Button */}
        <div className="flex items-center gap-3">
          <a
            href="/dashboard"
            className="hidden rounded-lg bg-white px-4 py-2 text-sm font-bold text-[#8B0000] shadow transition-transform hover:scale-105 sm:block"
          >
            View Live Data
          </a>

          {/* Mobile Menu Button */}
          <button
            className="rounded-lg p-2 text-white hover:bg-white/10 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-[#8B0000] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            <a
              className="rounded-lg px-4 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
              href="/"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </a>
            <a
              className="rounded-lg px-4 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </a>
            <a
              className="rounded-lg px-4 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
              href="/settlement"
              onClick={() => setMobileMenuOpen(false)}
            >
              Settlement Info
            </a>
            <a
              href="/dashboard"
              className="mt-2 rounded-lg bg-white px-4 py-3 text-center text-sm font-bold text-[#8B0000]"
              onClick={() => setMobileMenuOpen(false)}
            >
              View Live Data
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
