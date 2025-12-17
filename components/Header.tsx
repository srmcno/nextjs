'use client'

import { useState } from 'react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-[#512A2A]/20 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3">
          {/* Choctaw Nation Seal SVG */}
          <div className="relative h-12 w-12 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="h-full w-full">
              {/* Outer teal ring */}
              <circle cx="50" cy="50" r="48" fill="#006B54" />
              {/* Inner gold circle */}
              <circle cx="50" cy="50" r="40" fill="#C5A052" />
              {/* Inner design circle */}
              <circle cx="50" cy="50" r="36" fill="#D4B96A" />
              {/* Center elements - simplified representation */}
              <g transform="translate(50, 50)">
                {/* Crossed sticks */}
                <line x1="-15" y1="-15" x2="15" y2="15" stroke="#512A2A" strokeWidth="3" />
                <line x1="15" y1="-15" x2="-15" y2="15" stroke="#512A2A" strokeWidth="3" />
                {/* Center circle */}
                <circle cx="0" cy="0" r="8" fill="#512A2A" />
                {/* Wheat/feather elements */}
                <ellipse cx="0" cy="-20" rx="4" ry="10" fill="#512A2A" />
              </g>
              {/* Text around seal */}
              <text x="50" y="15" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">THE GREAT SEAL</text>
              <text x="50" y="92" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">OF THE CHOCTAW NATION</text>
            </svg>
          </div>
          <div className="leading-tight">
            <div className="text-lg font-bold text-[#512A2A]">
              Choctaw Nation
            </div>
            <div className="text-sm font-medium text-[#1B7340]">
              Water Resource Management
            </div>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          <a
            className="rounded-lg px-4 py-2 text-sm font-medium text-[#512A2A] transition-colors hover:bg-[#512A2A]/5"
            href="/"
          >
            Home
          </a>
          <a
            className="rounded-lg px-4 py-2 text-sm font-medium text-[#512A2A] transition-colors hover:bg-[#512A2A]/5"
            href="/dashboard"
          >
            Water Levels
          </a>
          <a
            className="rounded-lg px-4 py-2 text-sm font-medium text-[#512A2A] transition-colors hover:bg-[#512A2A]/5"
            href="/settlement"
          >
            Settlement Agreement
          </a>
        </nav>

        {/* CTA Button */}
        <div className="flex items-center gap-3">
          <a
            href="/dashboard"
            className="hidden rounded-lg bg-[#1B7340] px-4 py-2 text-sm font-bold text-white shadow transition-all hover:bg-[#155D33] hover:shadow-md sm:block"
          >
            View Live Data
          </a>

          {/* Mobile Menu Button */}
          <button
            className="rounded-lg p-2 text-[#512A2A] hover:bg-[#512A2A]/5 lg:hidden"
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
        <div className="border-t border-gray-100 bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            <a
              className="rounded-lg px-4 py-3 text-sm font-medium text-[#512A2A] transition-colors hover:bg-[#512A2A]/5"
              href="/"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </a>
            <a
              className="rounded-lg px-4 py-3 text-sm font-medium text-[#512A2A] transition-colors hover:bg-[#512A2A]/5"
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
            >
              Water Levels
            </a>
            <a
              className="rounded-lg px-4 py-3 text-sm font-medium text-[#512A2A] transition-colors hover:bg-[#512A2A]/5"
              href="/settlement"
              onClick={() => setMobileMenuOpen(false)}
            >
              Settlement Agreement
            </a>
            <a
              href="/dashboard"
              className="mt-2 rounded-lg bg-[#1B7340] px-4 py-3 text-center text-sm font-bold text-white"
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
