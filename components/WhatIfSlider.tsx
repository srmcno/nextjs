'use client'

import { useState } from 'react'
import { SARDIS_WITHDRAWAL_THRESHOLDS } from '../lib/waterBodies'

interface WhatIfSliderProps {
  currentLevel: number
}

export default function WhatIfSlider({ currentLevel }: WhatIfSliderProps) {
  const [simulatedLevel, setSimulatedLevel] = useState(currentLevel)
  
  const { 
    conservationPool, 
    baselineSummer, 
    baselineWinter, 
    moderateDroughtFloor, 
    advancedDroughtFloor, 
    extremeDroughtFloor 
  } = SARDIS_WITHDRAWAL_THRESHOLDS

  const month = new Date().getMonth() + 1
  const isSummer = month >= 4 && month <= 8
  const currentBaseline = isSummer ? baselineSummer : baselineWinter
  const seasonLabel = isSummer ? 'Summer (Apr-Aug)' : 'Winter (Sep-Mar)'

  const getStatus = (level: number) => {
    if (level >= conservationPool) {
      return { 
        status: 'full', 
        label: 'At Conservation Pool', 
        description: 'Lake is at full conservation level. All activities normal.',
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50'
      }
    }
    if (level >= currentBaseline) {
      return { 
        status: 'normal', 
        label: 'Releases Allowed', 
        description: `Above ${seasonLabel} baseline. OKC can withdraw water.`,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50'
      }
    }
    if (level >= moderateDroughtFloor) {
      return { 
        status: 'restricted', 
        label: 'Releases BLOCKED', 
        description: `Below ${seasonLabel} baseline (${currentBaseline} ft). OKC must STOP withdrawals unless Moderate Drought declared.`,
        color: 'text-rose-600',
        bgColor: 'bg-rose-50'
      }
    }
    if (level >= advancedDroughtFloor) {
      return { 
        status: 'drought-mod', 
        label: 'Moderate Drought Floor', 
        description: 'Only releases allowed if Moderate Drought officially declared (Jul 5-Aug 31).',
        color: 'text-amber-600',
        bgColor: 'bg-amber-50'
      }
    }
    if (level >= extremeDroughtFloor) {
      return { 
        status: 'drought-adv', 
        label: 'Advanced Drought Floor', 
        description: 'Only releases allowed if Advanced Drought declared. Significant restrictions.',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50'
      }
    }
    return { 
      status: 'critical', 
      label: 'CRITICAL - Below All Floors', 
      description: 'Lake is below even the Extreme Drought floor. No releases possible under any circumstances.',
      color: 'text-rose-700',
      bgColor: 'bg-rose-100'
    }
  }

  const status = getStatus(simulatedLevel)
  const dropFromCurrent = currentLevel - simulatedLevel
  const dropToFloor = simulatedLevel - currentBaseline

  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-white overflow-hidden">
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-5 py-4 text-white">
        <h3 className="text-lg font-bold">What If? Interactive Simulator</h3>
        <p className="mt-1 text-sm text-slate-300">
          Drag the slider to see when OKC withdrawal restrictions kick in
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="rounded-xl bg-blue-50 p-4 text-center">
            <div className="text-xs font-bold uppercase text-blue-600">Actual Level</div>
            <div className="mt-1 text-2xl font-black text-blue-700">{currentLevel.toFixed(1)} ft</div>
          </div>
          <div className="rounded-xl bg-purple-50 p-4 text-center">
            <div className="text-xs font-bold uppercase text-purple-600">Simulated Level</div>
            <div className="mt-1 text-2xl font-black text-purple-700">{simulatedLevel.toFixed(1)} ft</div>
          </div>
        </div>

        <div className="relative mb-8">
          <input
            type="range"
            min={extremeDroughtFloor - 2}
            max={conservationPool + 2}
            step={0.1}
            value={simulatedLevel}
            onChange={(e) => setSimulatedLevel(parseFloat(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, 
                #ef4444 0%, 
                #ef4444 ${((extremeDroughtFloor - (extremeDroughtFloor - 2)) / (conservationPool + 2 - (extremeDroughtFloor - 2))) * 100}%, 
                #f59e0b ${((advancedDroughtFloor - (extremeDroughtFloor - 2)) / (conservationPool + 2 - (extremeDroughtFloor - 2))) * 100}%, 
                #eab308 ${((moderateDroughtFloor - (extremeDroughtFloor - 2)) / (conservationPool + 2 - (extremeDroughtFloor - 2))) * 100}%, 
                #10b981 ${((currentBaseline - (extremeDroughtFloor - 2)) / (conservationPool + 2 - (extremeDroughtFloor - 2))) * 100}%, 
                #10b981 100%
              )`
            }}
          />
          
          <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[9px] font-bold">
            <span className="text-rose-600">{extremeDroughtFloor} ft</span>
            <span className="text-amber-600">{advancedDroughtFloor} ft</span>
            <span className="text-yellow-600">{moderateDroughtFloor} ft</span>
            <span className="text-emerald-600">{currentBaseline} ft</span>
            <span className="text-emerald-700">{conservationPool} ft</span>
          </div>
        </div>

        <div className={`mt-8 rounded-xl p-5 ${status.bgColor} border border-slate-200`}>
          <div className="flex items-start gap-4">
            <div className="text-3xl">
              {status.status === 'full' || status.status === 'normal' ? '✅' : 
               status.status === 'critical' ? '🚨' : '⛔'}
            </div>
            <div>
              <div className={`text-lg font-bold ${status.color}`}>{status.label}</div>
              <p className="mt-1 text-sm text-slate-600">{status.description}</p>
            </div>
          </div>
        </div>

        {dropFromCurrent !== 0 && (
          <div className="mt-4 rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-700">
              {dropFromCurrent > 0 ? (
                <>
                  <strong>Scenario:</strong> If the lake dropped <strong>{dropFromCurrent.toFixed(1)} feet</strong> from current levels...
                  {dropToFloor > 0 
                    ? <> OKC could still withdraw water (still {dropToFloor.toFixed(1)} ft above the floor).</>
                    : <> OKC would be <strong>BLOCKED</strong> from withdrawing water!</>
                  }
                </>
              ) : (
                <>
                  <strong>Scenario:</strong> If the lake rose <strong>{Math.abs(dropFromCurrent).toFixed(1)} feet</strong>...
                  the lake would be closer to full conservation pool.
                </>
              )}
            </p>
          </div>
        )}

        <div className="mt-4 flex gap-2 flex-wrap">
          <button 
            onClick={() => setSimulatedLevel(currentLevel)}
            className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200"
          >
            Reset to Current
          </button>
          <button 
            onClick={() => setSimulatedLevel(currentBaseline - 0.1)}
            className="rounded-lg bg-rose-100 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-200"
          >
            Just Below Floor
          </button>
          <button 
            onClick={() => setSimulatedLevel(conservationPool)}
            className="rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-200"
          >
            Full Pool
          </button>
        </div>
      </div>
    </div>
  )
}
