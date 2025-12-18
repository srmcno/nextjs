'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Live Dashboard' },
    { href: '/settlement', label: 'Settlement Info' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <img 
            src="https://i.imgur.com/R7iU4ao.png" 
            alt="Water Settlement Portal Logo" 
            className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <div className="hidden sm:block">
            <div className="font-bold text-slate-900 leading-tight">Water Settlement Portal</div>
            <div className="text-xs text-slate-500">Choctaw–Chickasaw Nations</div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
          
          {/* Live Status Indicator */}
          <div className="ml-4 flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            Live Data
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-slate-100 bg-white px-4 py-3">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          {/* Mobile Live Status */}
          <div className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-emerald-50 py-2 text-xs font-medium text-emerald-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            Live Data Active
          </div>
        </nav>
      )}
    </header>
  )
}