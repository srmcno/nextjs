'use client'

import { getSardisReleaseStatus, SARDIS_WITHDRAWAL_THRESHOLDS } from '../lib/waterBodies'

interface SardisReleaseTrackerProps {
  currentLevel: number
  droughtCondition?: 'none' | 'moderate' | 'advanced' | 'extreme'
}

export default function SardisReleaseTracker({ 
  currentLevel, 
  droughtCondition = 'none' 
}: SardisReleaseTrackerProps) {
  const releaseInfo = getSardisReleaseStatus(currentLevel, droughtCondition)
  
  return (
    <div className={`relative overflow-hidden rounded-2xl border-2 ${
      releaseInfo.isAllowed 
        ? 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-white' 
        : 'border-rose-300 bg-gradient-to-br from-rose-50 to-white'
    }`}>
      {/* Header */}
      <div className={`px-5 py-4 ${releaseInfo.isAllowed ? 'bg-emerald-100/50' : 'bg-rose-100/50'}`}>
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-600">
          Is OKC Taking Our Water?
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Sardis Lake Release Status per Settlement Agreement
        </p>
      </div>

      {/* Main Status Toggle */}
      <div className="p-6">
        <div className="flex items-center justify-center">
          <div className={`relative flex h-32 w-64 items-center justify-center rounded-full border-4 ${
            releaseInfo.isAllowed 
              ? 'border-emerald-400 bg-emerald-500' 
              : 'border-rose-400 bg-rose-500'
          } shadow-lg`}>
            {/* Animated glow */}
            <div className={`absolute inset-0 rounded-full ${
              releaseInfo.isAllowed ? 'bg-emerald-400' : 'bg-rose-400'
            } animate-pulse opacity-30`}></div>
            
            <div className="relative z-10 text-center text-white">
              <div className="text-3xl font-black uppercase tracking-wider">
                {releaseInfo.isAllowed ? 'ALLOWED' : 'BLOCKED'}
              </div>
              <div className="mt-1 text-sm font-medium opacity-90">
                {releaseInfo.isAllowed ? 'Releases Permitted' : 'Releases Stopped'}
              </div>
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div className={`mt-6 rounded-xl p-4 ${
          releaseInfo.isAllowed ? 'bg-emerald-50' : 'bg-rose-50'
        }`}>
          <p className="text-sm leading-relaxed text-slate-700">
            {releaseInfo.reason}
          </p>
          {releaseInfo.isDroughtOverride && (
            <div className="mt-2 flex items-center gap-2 text-xs text-amber-700">
              <span>⚡</span>
              <span>Drought override in effect - floor lowered from normal baseline</span>
            </div>
          )}
        </div>

        {/* Current Metrics */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-slate-50 p-3 text-center">
            <div className="text-xs font-medium uppercase text-slate-500">Current Level</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{currentLevel.toFixed(1)} ft</div>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 text-center">
            <div className="text-xs font-medium uppercase text-slate-500">{releaseInfo.floorLabel}</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{releaseInfo.currentFloor} ft</div>
          </div>
        </div>

        {/* Visual Level Indicator */}
        <div className="mt-4">
          <div className="relative h-8 overflow-hidden rounded-full bg-slate-200">
            {/* Conservation pool marker */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-emerald-600 z-20"
              style={{ left: '100%' }}
            ></div>
            
            {/* Floor marker */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-rose-500 z-20"
              style={{ 
                left: `${((releaseInfo.currentFloor - SARDIS_WITHDRAWAL_THRESHOLDS.extremeDroughtFloor) / 
                  (SARDIS_WITHDRAWAL_THRESHOLDS.conservationPool - SARDIS_WITHDRAWAL_THRESHOLDS.extremeDroughtFloor)) * 100}%` 
              }}
            ></div>
            
            {/* Current level fill */}
            <div 
              className={`h-full transition-all duration-1000 ${
                releaseInfo.isAllowed ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
              style={{ 
                width: `${Math.min(100, Math.max(0, 
                  ((currentLevel - SARDIS_WITHDRAWAL_THRESHOLDS.extremeDroughtFloor) / 
                   (SARDIS_WITHDRAWAL_THRESHOLDS.conservationPool - SARDIS_WITHDRAWAL_THRESHOLDS.extremeDroughtFloor)) * 100
                ))}%` 
              }}
            ></div>
          </div>
          <div className="mt-1 flex justify-between text-[10px] font-bold text-slate-500">
            <span>{SARDIS_WITHDRAWAL_THRESHOLDS.extremeDroughtFloor} ft (Extreme)</span>
            <span className="text-rose-600">↑ Floor: {releaseInfo.currentFloor} ft</span>
            <span>{SARDIS_WITHDRAWAL_THRESHOLDS.conservationPool} ft (Full)</span>
          </div>
        </div>

        {/* Trust Message */}
        <div className="mt-4 rounded-lg bg-blue-50 p-3 text-center">
          <p className="text-xs text-blue-700">
            <strong>Settlement Protection:</strong> The 2016 agreement ensures OKC cannot drain the lake 
            below levels that protect local fishing, boating, and wildlife.
          </p>
        </div>
      </div>
    </div>
  )
}
