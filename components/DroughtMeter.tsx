'use client'

interface DroughtMeterProps {
  percentage: number
  hefnerPct: number
  draperPct: number
}

export default function DroughtMeter({ percentage, hefnerPct, draperPct }: DroughtMeterProps) {
  // Determine drought status
  const allBelowThreshold = (threshold: number) => 
    percentage < threshold && hefnerPct < threshold && draperPct < threshold

  let status: 'normal' | 'moderate' | 'advanced' | 'extreme' = 'normal'
  let statusLabel = 'No Restrictions'
  let statusDescription = 'Water lawns as normal. System operating at healthy levels.'
  let statusColor = 'text-emerald-600'
  
  if (allBelowThreshold(50)) {
    status = 'extreme'
    statusLabel = 'Mandatory Rationing'
    statusDescription = 'Severe water restrictions in effect. No outdoor watering. Essential use only.'
    statusColor = 'text-rose-600'
  } else if (allBelowThreshold(65)) {
    status = 'advanced'
    statusLabel = 'Significant Restrictions'
    statusDescription = 'Limit outdoor water use. Hand watering only. No car washing.'
    statusColor = 'text-amber-600'
  } else if (allBelowThreshold(75)) {
    status = 'moderate'
    statusLabel = 'Odd/Even Watering'
    statusDescription = 'Water lawns on odd/even days based on your address. Conserve when possible.'
    statusColor = 'text-yellow-600'
  }

  // Calculate rotation for speedometer needle (-135 to 135 degrees = 270 degree range)
  // Map 0-100% to the range
  const rotation = -135 + (percentage / 100) * 270
  
  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-center">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
          OKC System Drought Meter
        </h3>
        <p className="mt-1 text-xs text-slate-400">Combined storage across 6 city reservoirs</p>
      </div>

      {/* Speedometer */}
      <div className="relative mx-auto mt-6 h-48 w-64">
        {/* SVG Gauge */}
        <svg viewBox="0 0 200 120" className="w-full h-full">
          {/* Background arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="16"
            strokeLinecap="round"
          />
          
          {/* Colored zones */}
          {/* Critical (0-50%) */}
          <path
            d="M 20 100 A 80 80 0 0 1 55 35"
            fill="none"
            stroke="#ef4444"
            strokeWidth="16"
            strokeLinecap="round"
          />
          {/* Advanced (50-65%) */}
          <path
            d="M 55 35 A 80 80 0 0 1 80 23"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="16"
          />
          {/* Moderate (65-75%) */}
          <path
            d="M 80 23 A 80 80 0 0 1 100 20"
            fill="none"
            stroke="#eab308"
            strokeWidth="16"
          />
          {/* Normal (75-100%) */}
          <path
            d="M 100 20 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#10b981"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Needle */}
          <g transform={`rotate(${rotation}, 100, 100)`}>
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="35"
              stroke="#1e293b"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="100" cy="100" r="8" fill="#1e293b" />
          </g>

          {/* Labels */}
          <text x="15" y="115" className="text-[8px] fill-slate-500 font-bold">0%</text>
          <text x="45" y="40" className="text-[7px] fill-rose-500 font-bold">50%</text>
          <text x="70" y="22" className="text-[7px] fill-amber-500 font-bold">65%</text>
          <text x="95" y="15" className="text-[7px] fill-yellow-500 font-bold">75%</text>
          <text x="175" y="115" className="text-[8px] fill-slate-500 font-bold">100%</text>
        </svg>

        {/* Center Value */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
          <div className="text-3xl font-black text-slate-900">{percentage.toFixed(0)}%</div>
          <div className="text-xs font-medium text-slate-500">Combined Storage</div>
        </div>
      </div>

      {/* Status Card */}
      <div className={`mt-6 rounded-xl p-4 ${
        status === 'extreme' ? 'bg-rose-50 border border-rose-200' :
        status === 'advanced' ? 'bg-amber-50 border border-amber-200' :
        status === 'moderate' ? 'bg-yellow-50 border border-yellow-200' :
        'bg-emerald-50 border border-emerald-200'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-lg font-bold ${statusColor}`}>{statusLabel}</div>
            <p className="mt-1 text-sm text-slate-600">{statusDescription}</p>
          </div>
          <div className="text-3xl">
            {status === 'extreme' ? '🚫' : status === 'advanced' ? '⚠️' : status === 'moderate' ? '📅' : '✅'}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-4 gap-1 text-center text-[10px]">
        <div className="rounded bg-rose-100 px-1 py-2">
          <div className="font-bold text-rose-700">&lt;50%</div>
          <div className="text-rose-600">Extreme</div>
        </div>
        <div className="rounded bg-amber-100 px-1 py-2">
          <div className="font-bold text-amber-700">50-65%</div>
          <div className="text-amber-600">Advanced</div>
        </div>
        <div className="rounded bg-yellow-100 px-1 py-2">
          <div className="font-bold text-yellow-700">65-75%</div>
          <div className="text-yellow-600">Moderate</div>
        </div>
        <div className="rounded bg-emerald-100 px-1 py-2">
          <div className="font-bold text-emerald-700">&gt;75%</div>
          <div className="text-emerald-600">Normal</div>
        </div>
      </div>
    </div>
  )
}
