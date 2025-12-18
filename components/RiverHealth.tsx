'use client'

import { getRiverHealthStatus } from '../lib/waterBodies'

interface RiverHealthProps {
  riverName: string
  flowCfs: number
}

export default function RiverHealth({ riverName, flowCfs }: RiverHealthProps) {
  const health = getRiverHealthStatus(flowCfs)
  
  // Visual flow indicator segments
  const segments = [
    { label: '<50', threshold: 50, color: 'bg-amber-400' },
    { label: '50-100', threshold: 100, color: 'bg-blue-400' },
    { label: '100-500', threshold: 500, color: 'bg-emerald-500' },
    { label: '500-1000', threshold: 1000, color: 'bg-sky-500' },
    { label: '>1000', threshold: Infinity, color: 'bg-rose-500' }
  ]
  
  const activeIndex = segments.findIndex(s => flowCfs < s.threshold)

  return (
    <div className={`rounded-2xl border-2 p-5 ${health.bgColor}`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Basin Health
          </h3>
          <div className="mt-1 text-lg font-bold text-slate-800">{riverName}</div>
        </div>
        <div className="text-4xl">{health.icon}</div>
      </div>

      {/* Flow Reading */}
      <div className="mt-4 flex items-end gap-2">
        <span className="text-4xl font-black text-slate-900">{flowCfs.toFixed(0)}</span>
        <span className="mb-1 text-lg font-medium text-slate-500">cfs</span>
      </div>

      {/* Status */}
      <div className={`mt-3 inline-block rounded-full px-4 py-1.5 text-sm font-bold ${health.color} bg-white/70`}>
        {health.label}
      </div>

      {/* Description */}
      <p className="mt-3 text-sm text-slate-600 leading-relaxed">
        {health.description}
      </p>

      {/* Visual Flow Meter */}
      <div className="mt-4 flex gap-1 overflow-hidden rounded-lg">
        {segments.map((seg, i) => (
          <div 
            key={seg.label}
            className={`h-3 flex-1 ${seg.color} ${i <= activeIndex ? 'opacity-100' : 'opacity-20'} transition-opacity`}
          />
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[10px] font-medium text-slate-500">
        <span>Low</span>
        <span>Healthy</span>
        <span>High</span>
        <span>Flood</span>
      </div>

      {/* Activities */}
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-200/50 pt-4">
        {[
          { icon: '🎣', label: 'Fishing', good: flowCfs >= 50 && flowCfs < 1000 },
          { icon: '🛶', label: 'Kayaking', good: flowCfs >= 100 && flowCfs < 500 },
          { icon: '🏕️', label: 'Camping', good: flowCfs < 1000 }
        ].map((activity) => (
          <div 
            key={activity.label}
            className={`rounded-lg p-2 text-center text-xs ${
              activity.good ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
            }`}
          >
            <div className="text-lg">{activity.icon}</div>
            <div className="font-bold">{activity.label}</div>
            <div>{activity.good ? '✓ Good' : '✗ Not Ideal'}</div>
          </div>
        ))}
      </div>

      {/* Ecological Note */}
      <div className="mt-4 rounded-lg bg-blue-50 p-3">
        <p className="text-xs text-blue-700">
          <strong>Minimum Flow Requirement:</strong> The Settlement requires at least 50 cfs at 
          Moyers Crossing to protect aquatic habitat and downstream users.
        </p>
      </div>
    </div>
  )
}
