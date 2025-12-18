'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Settlement Info', href: '/settlement' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-900/95 backdrop-blur-md supports-[backdrop-filter]:bg-slate-900/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-white/10 ring-1 ring-white/20 transition-all group-hover:bg-white/20">
            <img src="/cno-logo.svg" alt="Logo" className="h-8 w-8 object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-none text-white tracking-wide">Water Portal</span>
            <span className="text-[10px] font-medium text-slate-400 group-hover:text-slate-300">Choctaw & Chickasaw Nations</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex md:items-center md:gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="hidden rounded-lg bg-sky-600 px-4 py-2 text-sm font-bold text-white shadow-md transition-transform hover:bg-sky-500 hover:scale-105 active:scale-95 md:block"
          >
            Live Data
          </Link>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white md:hidden"
            aria-label="Toggle menu"
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
        <div className="border-b border-white/10 bg-slate-900 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-base font-medium text-slate-300 hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 flex items-center justify-center rounded-lg bg-sky-600 px-4 py-3 text-base font-bold text-white shadow-sm"
            >
              View Live Data
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
