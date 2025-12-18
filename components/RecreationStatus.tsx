'use client'

import { getRecreationStatus } from '../lib/waterBodies'

interface RecreationStatusProps {
  lakeName: string
  currentLevel: number
  conservationPool: number
}

export default function RecreationStatus({ lakeName, currentLevel, conservationPool }: RecreationStatusProps) {
  const status = getRecreationStatus(currentLevel, conservationPool)
  const diff = currentLevel - conservationPool
  
  const icons = {
    great: '🚤',
    caution: '⚠️',
    poor: '🚫'
  }

  return (
    <div className={`rounded-2xl border-2 p-5 ${status.bgColor}`}>
      <div className="flex items-start gap-4">
        <div className="text-4xl">{icons[status.status]}</div>
        <div className="flex-1">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Can I Go Boating?
          </h3>
          <div className={`mt-1 text-xl font-bold ${status.color}`}>
            {status.label}
          </div>
          <p className="mt-2 text-sm text-slate-600">
            {status.description}
          </p>
          <div className="mt-3 flex items-center gap-4 text-xs">
            <div className="rounded-lg bg-white/70 px-3 py-1.5">
              <span className="text-slate-500">Lake:</span>{' '}
              <span className="font-bold text-slate-700">{lakeName}</span>
            </div>
            <div className="rounded-lg bg-white/70 px-3 py-1.5">
              <span className="text-slate-500">Level:</span>{' '}
              <span className="font-bold text-slate-700">{currentLevel.toFixed(1)} ft</span>
              <span className={`ml-1 ${diff >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                ({diff >= 0 ? '+' : ''}{diff.toFixed(1)} ft from pool)
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Boat Ramp Status */}
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-200/50 pt-4">
        {['Main Ramp', 'North Ramp', 'Marina'].map((ramp, i) => {
          const isOpen = status.status === 'great' || (status.status === 'caution' && i === 0)
          return (
            <div key={ramp} className={`rounded-lg p-2 text-center text-xs ${isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
              <div className="font-bold">{ramp}</div>
              <div>{isOpen ? '✓ Open' : '✗ Limited'}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
