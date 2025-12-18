'use client'

import { useState, useEffect } from 'react'
import {
  OKC_RESERVOIR_SYSTEM,
  calculateCombinedStorage,
  determineWSADroughtCondition,
  getSardisMinimumElevation,
  getWithdrawalRestrictionMessage,
  getDroughtConditionDisplay,
  TOTAL_SYSTEM_CAPACITY,
  SARDIS_STORAGE_ALLOCATION,
  CITY_PERMIT,
  calculateReservoirPercentage,
  type DroughtCondition
} from '../lib/okcReservoirSystem'

// ... (imports remain the same, just showing the render updates)

// Use the existing logic but improve the JSX return:

// ... inside the component ...
  // [Keep the useEffect logic exactly as it is in the original file]

  // [Update the Return JSX]
  return (
    <div className={`rounded-2xl border ${droughtDisplay.borderColor} bg-white shadow-sm overflow-hidden`}>
      {/* STATUS HEADER */}
      <div className={`px-6 py-4 ${droughtDisplay.bgColor} border-b ${droughtDisplay.borderColor}`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
             <h3 className="text-lg font-bold text-slate-900">OKC System Combined Storage</h3>
             <p className="text-xs text-slate-600">Settlement Agreement Exhibit 13 Calculation</p>
          </div>
          <span className={`self-start sm:self-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider bg-white/80 border ${droughtDisplay.borderColor} ${droughtDisplay.color}`}>
             {droughtDisplay.label} Status
          </span>
        </div>
      </div>

      <div className="p-6">
        {/* MAIN PROGRESS BAR */}
        <div className="mb-8">
           <div className="flex items-end justify-between mb-2">
              <div className="text-3xl font-black text-slate-900">
                {combinedStorage.percentage.toFixed(1)}%
                <span className="text-sm font-medium text-slate-500 ml-2">Total Capacity</span>
              </div>
              <div className="text-right text-xs font-medium text-slate-500">
                {(combinedStorage.totalStorage / 1000).toFixed(1)}k / {(TOTAL_SYSTEM_CAPACITY / 1000).toFixed(1)}k AF
              </div>
           </div>
           
           <div className="relative h-6 w-full rounded-full bg-slate-100 ring-1 ring-slate-200 overflow-hidden">
              {/* Threshold Markers */}
              <div className="absolute top-0 bottom-0 z-10 w-0.5 bg-white mix-blend-overlay" style={{ left: '50%' }}></div>
              <div className="absolute top-0 bottom-0 z-10 w-0.5 bg-white mix-blend-overlay" style={{ left: '65%' }}></div>
              <div className="absolute top-0 bottom-0 z-10 w-0.5 bg-white mix-blend-overlay" style={{ left: '75%' }}></div>

              {/* Fill */}
              <div 
                className={`h-full transition-all duration-1000 ease-out ${
                  combinedStorage.percentage < 50 ? 'bg-rose-500' :
                  combinedStorage.percentage < 65 ? 'bg-amber-500' :
                  combinedStorage.percentage < 75 ? 'bg-yellow-400' :
                  'bg-emerald-500'
                }`}
                style={{ width: `${combinedStorage.percentage}%` }}
              ></div>
           </div>
           
           <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
             <span>0%</span>
             <span className="text-rose-600">50% Critical</span>
             <span className="text-amber-600">65% Warning</span>
             <span className="text-yellow-600">75% Watch</span>
             <span className="text-emerald-600">100% Full</span>
           </div>
        </div>

        {/* INFO GRIDS */}
        <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6 sm:grid-cols-4">
           {[
             { label: 'System Storage', value: `${(combinedStorage.totalStorage / 1000).toFixed(1)}k`, unit: 'Ac-Ft' },
             { label: 'OKC Annual Right', value: `${(CITY_PERMIT.annualAppropriation / 1000).toFixed(0)}k`, unit: 'AFY' },
             { label: 'Sardis Share', value: '39%', unit: 'Allocated' },
             { label: 'Drought Trigger', value: droughtCondition.meetsAllCriteria ? 'ACTIVE' : 'INACTIVE', unit: 'WSA Sec 6' },
           ].map((stat, i) => (
             <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
               <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
               <div className="text-lg font-bold text-slate-900">{stat.value}</div>
               <div className="text-[10px] text-slate-400">{stat.unit}</div>
             </div>
           ))}
        </div>

        {/* DROUGHT DETAILS */}
        {droughtCondition && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">WSA Drought Determination Criteria</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
               {[
                 { label: 'Combined < 50%', met: droughtCondition.details.cumulativeMet },
                 { label: 'Hefner < 50%', met: droughtCondition.details.hefnerMet },
                 { label: 'Draper < 50%', met: droughtCondition.details.draperMet },
               ].map((crit) => (
                 <div key={crit.label} className={`flex items-center gap-2 rounded-lg p-2 text-xs font-bold border ${crit.met ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-white text-emerald-700 border-slate-200'}`}>
                    <span className="text-base">{crit.met ? '⚠️' : '✓'}</span> {crit.label}
                 </div>
               ))}
            </div>
            <p className="mt-2 text-[10px] text-slate-400">
              *All three conditions must be met to trigger drought provisions lowering the Sardis release floor.
            </p>
          </div>
        )}

        {/* RESTRICTION ALERT */}
        {sardisRestriction && (
           <div className={`mt-6 flex gap-3 rounded-xl border p-4 ${sardisRestriction.isDroughtOverride ? 'bg-amber-50 border-amber-200' : 'bg-sky-50 border-sky-200'}`}>
              <div className="text-2xl">{sardisRestriction.isDroughtOverride ? '⚠️' : 'ℹ️'}</div>
              <div>
                 <div className="font-bold text-slate-900 text-sm">Sardis Release Minimum: {sardisRestriction.minimumElevation}' MSL</div>
                 <p className="text-xs text-slate-600 mt-1">{sardisRestriction.reason}</p>
              </div>
           </div>
        )}
      </div>
      
      {/* INDIVIDUAL RESERVOIRS TOGGLE */}
      <details className="border-t border-slate-200 bg-slate-50">
        <summary className="cursor-pointer px-6 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors">
          View Individual Reservoir Breakdown ↓
        </summary>
        <div className="p-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
           {reservoirData.map(r => (
             <div key={r.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex justify-between mb-2">
                   <span className="font-bold text-sm text-slate-700">{r.name}</span>
                   <span className={`text-xs font-bold ${
                     (r.percentage||0) > 75 ? 'text-emerald-600' : (r.percentage||0) > 50 ? 'text-amber-600' : 'text-rose-600'
                   }`}>{(r.percentage||0).toFixed(0)}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-slate-400 rounded-full" style={{width: `${r.percentage}%`}}></div>
                </div>
             </div>
           ))}
        </div>
      </details>
    </div>
  )
}
