'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [mobileMenuOpen])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Live Dashboard' },
    { href: '/game', label: 'Water Game' },
    { href: '/settlement', label: 'Settlement Info' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-choctaw-brown/20 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo - Official Choctaw Nation Branding */}
        <Link href="/" className="flex items-center gap-3 group">
          {/* Great Seal - minimum 125px per brand standards */}
          <img 
            src="/choctaw-great-seal-placeholder.svg" 
            alt="Choctaw Nation Great Seal" 
            className="h-16 w-16 object-contain transition-transform group-hover:scale-105"
            style={{ minWidth: '64px' }} // Ensures 64px = ~125px at normal DPI
          />
          <div className="hidden md:block">
            {/* Gill Sans Bold for "Choctaw Nation" */}
            <div className="font-bold text-choctaw-brown leading-tight text-lg">Choctaw Nation</div>
            <div className="text-sm font-bold text-choctaw-brown">Division of Legal &amp; Compliance</div>
            {/* Gill Sans Light for Department */}
            <div className="text-xs font-light text-choctaw-brown">Department of Natural Resources</div>
            {/* PMS 356 Green for program descriptor */}
            <div className="text-xs text-choctaw-green font-normal">Water Resource Management</div>
          </div>
          {/* Mobile: Show simplified branding */}
          <div className="block md:hidden">
            <div className="font-bold text-choctaw-brown text-sm leading-tight">Choctaw Nation</div>
            <div className="text-xs text-choctaw-green">Water Portal</div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-choctaw-brown transition-colors hover:bg-choctaw-green/10 hover:text-choctaw-green"
            >
              {link.label}
            </Link>
          ))}
          
          {/* Live Status Indicator - using brand green */}
          <div className="ml-4 flex items-center gap-2 rounded-full bg-choctaw-green/20 px-3 py-1.5 text-xs font-medium text-choctaw-green border border-choctaw-green/30">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-choctaw-green opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-choctaw-green"></span>
            </span>
            Live Data
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden rounded-lg p-2 text-choctaw-brown hover:bg-choctaw-green/10 hover:text-choctaw-green"
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
        <nav className="md:hidden border-t border-choctaw-brown/20 bg-white px-4 py-3">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-choctaw-brown transition-colors hover:bg-choctaw-green/10 hover:text-choctaw-green"
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          {/* Mobile Live Status */}
          <div className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-choctaw-green/20 py-2 text-xs font-medium text-choctaw-green border border-choctaw-green/30">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-choctaw-green opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-choctaw-green"></span>
            </span>
            Live Data Active
          </div>
        </nav>
      )}
    </header>
  )
}