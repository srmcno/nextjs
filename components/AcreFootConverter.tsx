'use client'

import { useState } from 'react'

interface AcreFootConverterProps {
  value: number
  unit: 'af' | 'cfs' | 'mgd' // acre-feet, cubic feet per second, million gallons per day
  label?: string
}

/**
 * Conversion factors and analogies for water measurements
 */
const conversions = {
  // 1 acre-foot = 325,851 gallons
  afToGallons: 325851,
  // 1 cfs for 1 hour = 1.983 acre-feet per day, or about 0.0826 acre-feet per hour
  cfsToAfPerDay: 1.983,
  // Olympic swimming pool = 660,000 gallons
  olympicPoolGallons: 660000,
  // Average home uses ~100 gallons per day
  homeGallonsPerDay: 100,
  // Football field is ~1.32 acres
  footballFieldAcres: 1.32,
}

function getAFAnalogies(acrefeet: number) {
  const gallons = acrefeet * conversions.afToGallons
  
  return [
    {
      icon: '🏊',
      label: 'Olympic Pools',
      value: (gallons / conversions.olympicPoolGallons).toFixed(1),
      detail: `Enough to fill ${(gallons / conversions.olympicPoolGallons).toFixed(0)} Olympic swimming pools`
    },
    {
      icon: '🏠',
      label: 'Homes Supplied',
      value: Math.round(gallons / conversions.homeGallonsPerDay).toLocaleString(),
      detail: `Could supply ${Math.round(gallons / conversions.homeGallonsPerDay).toLocaleString()} homes for one day`
    },
    {
      icon: '🏈',
      label: 'Football Fields',
      value: (acrefeet / conversions.footballFieldAcres).toFixed(1),
      detail: `Would cover ${(acrefeet / conversions.footballFieldAcres).toFixed(1)} football fields 1 foot deep`
    },
    {
      icon: '💧',
      label: 'Million Gallons',
      value: (gallons / 1000000).toFixed(2),
      detail: `That's ${(gallons / 1000000).toFixed(2)} million gallons of water`
    }
  ]
}

function getCFSAnalogies(cfs: number) {
  // CFS is flow rate - gallons per second = cfs * 7.48
  const gallonsPerSecond = cfs * 7.48
  const gallonsPerHour = gallonsPerSecond * 3600
  const gallonsPerDay = gallonsPerHour * 24
  const afPerDay = cfs * conversions.cfsToAfPerDay

  return [
    {
      icon: '🏊',
      label: 'Pools per Hour',
      value: (gallonsPerHour / conversions.olympicPoolGallons).toFixed(1),
      detail: `Fills ${(gallonsPerHour / conversions.olympicPoolGallons).toFixed(1)} Olympic pools every hour`
    },
    {
      icon: '🏠',
      label: 'Homes per Day',
      value: Math.round(gallonsPerDay / conversions.homeGallonsPerDay).toLocaleString(),
      detail: `Supplies ${Math.round(gallonsPerDay / conversions.homeGallonsPerDay).toLocaleString()} homes daily`
    },
    {
      icon: '🚰',
      label: 'Gallons/Second',
      value: gallonsPerSecond.toFixed(0),
      detail: `${gallonsPerSecond.toFixed(0)} gallons flowing past every second`
    },
    {
      icon: '📦',
      label: 'Acre-Feet/Day',
      value: afPerDay.toFixed(1),
      detail: `Accumulates to ${afPerDay.toFixed(1)} acre-feet per day`
    }
  ]
}

export default function AcreFootConverter({ value, unit, label }: AcreFootConverterProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const analogies = unit === 'cfs' ? getCFSAnalogies(value) : getAFAnalogies(value)
  const unitLabel = unit === 'cfs' ? 'cfs' : unit === 'mgd' ? 'MGD' : 'AF'
  const unitName = unit === 'cfs' ? 'Cubic Feet per Second' : unit === 'mgd' ? 'Million Gallons per Day' : 'Acre-Feet'

  return (
    <div className="relative inline-block">
      {/* Trigger */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="group inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-sm font-bold text-slate-700 hover:bg-slate-200 transition-colors"
      >
        <span>{value.toLocaleString()}</span>
        <span className="text-slate-500">{unitLabel}</span>
        <span className="text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
          (What's this?)
        </span>
      </button>

      {/* Expanded Panel */}
      {isExpanded && (
        <div className="absolute z-50 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-4 shadow-xl left-0">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs font-medium text-slate-500">{label || 'Water Volume'}</div>
              <div className="text-lg font-bold text-slate-900">{value.toLocaleString()} {unitName}</div>
            </div>
            <button 
              onClick={() => setIsExpanded(false)}
              className="rounded-full p-1 hover:bg-slate-100"
            >
              ✕
            </button>
          </div>

          <div className="text-xs font-medium uppercase text-slate-400 mb-2">In Perspective:</div>
          
          <div className="space-y-2">
            {analogies.map((a, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg bg-slate-50 p-2">
                <div className="text-2xl">{a.icon}</div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-bold text-slate-600">{a.label}</span>
                    <span className="text-sm font-bold text-slate-900">{a.value}</span>
                  </div>
                  <div className="text-[10px] text-slate-500">{a.detail}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-lg bg-blue-50 p-2 text-[10px] text-blue-700">
            <strong>What is an Acre-Foot?</strong> The amount of water needed to cover 1 acre 
            of land 1 foot deep — about 326,000 gallons.
          </div>
        </div>
      )}
    </div>
  )
}

// Standalone version for displaying next to values
export function WaterVolumeExplainer({ 
  acrefeet, 
  showInline = false 
}: { 
  acrefeet: number
  showInline?: boolean 
}) {
  const analogies = getAFAnalogies(acrefeet)
  
  if (showInline) {
    return (
      <span className="text-xs text-slate-500">
        ({analogies[0].value} Olympic pools)
      </span>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-2 mt-2">
      {analogies.slice(0, 2).map((a, i) => (
        <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
          <span>{a.icon}</span>
          <span>{a.value} {a.label.toLowerCase()}</span>
        </div>
      ))}
    </div>
  )
}
