'use client'

import { useState, useEffect } from 'react'
import {
  OKC_RESERVOIR_SYSTEM,
  calculateCombinedStorage,
  determineWSADroughtCondition,
  getSardisRestriction,
  getDroughtConditionDisplay
} from '../lib/okcReservoirSystem'

export default function OKCSystemStatus() {
  const [elevations, setElevations] = useState<Map<string, number>>(new Map())
  const [loading, setLoading] = useState(true)

  // Fetch logic for all 6 City Reservoirs
  useEffect(() => {
    async function fetchAll() {
      const newElevs = new Map<string, number>()
      
      await Promise.all(OKC_RESERVOIR_SYSTEM.map(async (res) => {
        try {
          // Priority: USACE API if ID exists (Canton, Atoka, McGee) -> USGS API fallback
          let val: number | null = null
          
          if (res.usaceId) {
             try {
               const r = await fetch(`/api/usace?site=${res.usaceId}&param=Elev`)
               const d = await r.json()
               if (d.values?.length) val = d.values[d.values.length - 1].value
             } catch(e) {}
          }

          if (val === null) {
             const r = await fetch(`/api/usgs?site=${res.usgsId}&param=62614`) // 62614 = Elev
             const d = await r.json()
             // Extract USGS value logic...
             const v = d?.value?.timeSeries?.[0]?.values?.[0]?.value
             if (v?.length) val = Number(v[v.length - 1].value)
          }

          if (val !== null) newElevs.set(res.id, val)
        } catch (e) {
          console.error(`Failed to load ${res.name}`, e)
        }
      }))
      
      setElevations(newElevs)
      setLoading(false)
    }
    fetchAll()
  }, [])

  // Calculations
  const { totalStorage, percentage, details } = calculateCombinedStorage(elevations)
  
  // Extract critical lakes for Drought Trigger Logic
  const hefner = details.find(d => d.id === 'hefner')?.percentFull || 100
  const draper = details.find(d => d.id === 'draper')?.percentFull || 100
  
  const drought = determineWSADroughtCondition(percentage, hefner, draper)
  const sardisRule = getSardisRestriction(drought.condition)
  const display = getDroughtConditionDisplay(drought.condition)

  if (loading) return <div className="animate-pulse h-64 bg-slate-100 rounded-2xl"></div>

  return (
    <div className={`rounded-2xl border ${display.borderColor} bg-white shadow-sm overflow-hidden`}>
      <div className={`px-6 py-4 ${display.bgColor} border-b ${display.borderColor} flex justify-between items-center`}>
        <div>
          <h3 className="text-lg font-bold text-slate-900">OKC System Combined Storage</h3>
          <p className="text-xs text-slate-600">Settlement Agreement Exhibit 13 Calculation</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${display.color} bg-white/80 border ${display.borderColor}`}>
          {display.label}
        </span>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-end mb-2">
            <span className="text-3xl font-black text-slate-900">{percentage.toFixed(1)}%</span>
            <span className="text-xs font-medium text-slate-500">
              {(totalStorage/1000).toFixed(1)}k / 407.1k AF
            </span>
          </div>
          {/* Progress Bar */}
          <div className="h-6 w-full bg-slate-100 rounded-full relative overflow-hidden ring-1 ring-slate-200">
             <div className="absolute top-0 bottom-0 w-0.5 bg-white mix-blend-overlay z-10 left-[50%]" />
             <div className="absolute top-0 bottom-0 w-0.5 bg-white mix-blend-overlay z-10 left-[65%]" />
             <div className="absolute top-0 bottom-0 w-0.5 bg-white mix-blend-overlay z-10 left-[75%]" />
             <div 
               className={`h-full transition-all duration-1000 ${
                 percentage < 50 ? 'bg-rose-500' : 
                 percentage < 65 ? 'bg-amber-500' : 
                 percentage < 75 ? 'bg-yellow-400' : 'bg-emerald-500'
               }`}
               style={{ width: `${percentage}%` }}
             />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-bold uppercase">
            <span>0%</span>
            <span className="text-rose-600">50% Critical</span>
            <span className="text-amber-600">65% Warning</span>
            <span className="text-yellow-600">75% Watch</span>
            <span className="text-emerald-600">100% Full</span>
          </div>
        </div>

        {/* Drought Trigger Detail Box */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 mb-4">
           <h4 className="text-xs font-bold uppercase text-slate-500 mb-3">Drought Trigger Status (All 3 Must be Met)</h4>
           <div className="grid grid-cols-3 gap-2 text-center">
              <div className={`p-2 rounded border ${drought.details.cumulativeMet ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-slate-200 text-slate-400'}`}>
                 <div className="text-[10px] uppercase font-bold">System</div>
                 <div className="font-bold">{percentage.toFixed(0)}%</div>
              </div>
              <div className={`p-2 rounded border ${drought.details.hefnerMet ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-slate-200 text-slate-400'}`}>
                 <div className="text-[10px] uppercase font-bold">Hefner</div>
                 <div className="font-bold">{hefner.toFixed(0)}%</div>
              </div>
              <div className={`p-2 rounded border ${drought.details.draperMet ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-slate-200 text-slate-400'}`}>
                 <div className="text-[10px] uppercase font-bold">Draper</div>
                 <div className="font-bold">{draper.toFixed(0)}%</div>
              </div>
           </div>
        </div>

        {/* Sardis Restriction Output */}
        <div className={`flex items-start gap-3 p-4 rounded-xl border ${sardisRule.isDroughtOverride ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'}`}>
           <span className="text-xl">{sardisRule.isDroughtOverride ? '⚠️' : 'ℹ️'}</span>
           <div>
              <div className="text-sm font-bold text-slate-900">
                Sardis Release Floor: {sardisRule.minimumElevation}' MSL
              </div>
              <div className="text-xs text-slate-600 mt-0.5">{sardisRule.reason}</div>
           </div>
        </div>
      </div>
    </div>
  )
}
